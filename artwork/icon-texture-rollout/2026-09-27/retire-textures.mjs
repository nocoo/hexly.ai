import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import {
	appendFile,
	open,
	readFile,
	rm,
	unlink,
	writeFile,
} from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import {
	authenticatedRequest,
	digest,
	readInventory,
	retry,
	verifiedBytes,
} from "../../../scripts/asset-storage.ts";
import { readProjects } from "../../../src/data/read-projects.ts";

const mode = process.argv[2] ?? "audit";
assert.ok(["audit", "delete"].includes(mode));
const base = "docs/icon-texture-rollout/2026-09-27";
const plan = JSON.parse(await readFile(`${base}/retirement-plan.json`, "utf8"));
const acceptance = JSON.parse(
	await readFile(`${base}/production-acceptance.json`, "utf8"),
);
assert.equal(acceptance.version, "1.1.2");
assert.equal(acceptance.verified, true);
const browser = JSON.parse(
	await readFile(`${base}/browser-production.json`, "utf8"),
);
assert.equal(browser.records.length, 120);
assert.equal(browser.origin, "https://hexly.ai");
const downloads = JSON.parse(
	await readFile(`${base}/production-downloads.json`, "utf8"),
);
assert.equal(downloads.records.length, 9);
const live = await (
	await fetch("https://hexly.ai/api/live", { cache: "no-store" })
).json();
assert.equal(live.version, acceptance.version);
assert.equal(live.revision, acceptance.revision);
const catalogue = await (
	await fetch(`https://hexly.ai/data/projects.json?retirement=${Date.now()}`)
).json();
for (const local of readProjects().filter((p) => !p.archived)) {
	const remote = catalogue.find((p) => p.id === local.id);
	assert.deepEqual(remote?.presentationIcon, local.presentationIcon);
	assert.deepEqual(remote?.brandTexture, local.brandTexture);
}
const inventory = readInventory();
const targets = new Map(plan.localCandidates.map((f) => [f.source, f]));
const candidates = plan.remoteCandidates;
assert.equal(candidates.length, 595);
assert.equal(targets.size, 649);
for (const p of plan.independentPackages) {
	assert.notEqual(p.oldRoot, p.replacementRoot);
	assert.equal(
		catalogue.find((row) => row.id === p.id)?.brandTexture.root,
		p.replacementRoot,
	);
	const search = spawnSync(
		"rg",
		["-l", "-F", "--", p.oldRoot, "src", "public", "tests", "docs/profiles"],
		{ encoding: "utf8" },
	);
	assert.ok([0, 1].includes(search.status));
	const outside = search.stdout
		.trim()
		.split("\n")
		.filter(Boolean)
		.filter((path) => !path.startsWith(`public${p.oldRoot}/`));
	assert.deepEqual(outside, []);
	for (const theme of ["light", "dark"]) {
		const file = inventory.files.find(
			(f) => f.path === `${p.replacementRoot}/texture-${theme}.png`,
		);
		assert.ok(file);
		await verifiedBytes(file);
	}
}
for (const file of targets.values()) {
	assert.ok(
		file.source.startsWith("public/textures/") ||
			/^artwork\/brands\/[a-z0-9-]+\/texture-studies\/.+\/raw\.png$/.test(
				file.source,
			),
	);
	assert.equal(digest(await readFile(file.source)), file.sha256);
}
for (const candidate of candidates) {
	assert.equal(candidate.sharedReferenceBlocksDeletion, false);
	const aliases = inventory.files.filter((f) => f.key === candidate.key);
	assert.ok(aliases.length);
	assert.ok(
		aliases.every(
			(f) =>
				targets.has(f.source) &&
				f.sha256 === candidate.sha256 &&
				f.bytes === candidate.bytes,
		),
	);
	assert.ok(
		aliases.every((f) => ["hexly-campaign", "source-archive"].includes(f.role)),
	);
}
const run = (args) => {
	try {
		return JSON.parse(
			execFileSync(
				"node",
				["node_modules/wrangler/bin/wrangler.js", ...args, "--json"],
				{
					encoding: "utf8",
					stdio: ["ignore", "pipe", "pipe"],
					env: {
						...process.env,
						WRANGLER_SEND_METRICS: "false",
						WRANGLER_LOG_LEVEL: "error",
					},
				},
			),
		);
	} catch {
		throw new Error("Wrangler authentication lookup failed");
	}
};
const credentials = () => {
	const user = run(["whoami"]);
	assert.equal(user.accounts.length, 1);
	return { account: user.accounts[0].id, token: run(["auth", "token"]).token };
};
const auth = credentials();
assert.ok(auth.token);
let nextAt = 0;
async function request(key, method = "GET") {
	return authenticatedRequest(
		auth,
		(token) =>
			retry(async () => {
				const delay = Math.max(0, nextAt - Date.now());
				nextAt = Math.max(Date.now(), nextAt) + 350;
				await setTimeout(delay);
				const response = await fetch(
					`https://api.cloudflare.com/client/v4/accounts/${auth.account}/r2/buckets/hexlyai/objects/${key}`,
					{
						method,
						headers: {
							Authorization: `Bearer ${token}`,
							"cf-r2-data-catalog-check": "true",
						},
						signal: AbortSignal.timeout(120000),
					},
				);
				if (response.status === 429 || response.status >= 500) {
					await response.arrayBuffer();
					throw Object.assign(new Error(`R2 HTTP ${response.status}: ${key}`), {
						retryAfterMs: response.status === 429 ? 60000 : 0,
					});
				}
				return response;
			}),
		credentials,
	);
}
const batch = async (list, operation) => {
	for (let at = 0; at < list.length; at += 4) {
		const results = await Promise.allSettled(
			list.slice(at, at + 4).map(operation),
		);
		for (const result of results)
			if (result.status === "rejected") throw result.reason;
	}
};
const checked = [];
await batch(candidates, async (candidate) => {
	const response = await request(candidate.key);
	assert.ok(
		[200, 404].includes(response.status),
		`${candidate.key}: HTTP ${response.status}`,
	);
	const bytes = new Uint8Array(await response.arrayBuffer());
	if (response.status === 200) {
		assert.equal(bytes.length, candidate.bytes);
		assert.equal(digest(bytes), candidate.sha256);
	}
	checked.push({
		...candidate,
		exists: response.status === 200,
		checkedAt: new Date().toISOString(),
	});
	if (checked.length % 25 === 0)
		console.log(`Origin preflight ${checked.length}/${candidates.length}`);
});
checked.sort((a, b) => a.key.localeCompare(b.key));
await writeFile(
	`${base}/retirement-preflight.json`,
	`${JSON.stringify(
		{ release: live, checkedAt: new Date().toISOString(), objects: checked },
		null,
		2,
	)}\n`,
);
if (mode === "audit") {
	console.log(
		`Verified ${checked.filter((f) => f.exists).length} existing and ${checked.filter((f) => !f.exists).length} absent objects; no deletion`,
	);
	process.exit(0);
}
const lockPath = ".wrangler/assets-publish.lock";
const lock = await open(lockPath, "wx");
await lock.writeFile(String(process.pid));
try {
	const receiptPath = "docs/assets/texture-retirement-2026-09-27.jsonl";
	const deleted = [];
	await batch(checked, async (candidate) => {
		let action = "already-absent";
		if (candidate.exists) {
			const current = await request(candidate.key);
			assert.equal(current.status, 200);
			assert.equal(
				digest(new Uint8Array(await current.arrayBuffer())),
				candidate.sha256,
			);
			const response = await request(candidate.key, "DELETE");
			await response.arrayBuffer();
			assert.ok(response.ok, `${candidate.key}: DELETE ${response.status}`);
			action = "deleted";
		}
		const absent = await request(candidate.key);
		await absent.arrayBuffer();
		assert.equal(absent.status, 404);
		const receipt = {
			key: candidate.key,
			sha256: candidate.sha256,
			bytes: candidate.bytes,
			action,
			verifiedOriginAbsentAt: new Date().toISOString(),
			release: live.revision,
		};
		await appendFile(receiptPath, `${JSON.stringify(receipt)}\n`);
		deleted.push(receipt);
		if (deleted.length % 25 === 0)
			console.log(`Retired ${deleted.length}/${checked.length}`);
	});
	const journal = (await readFile(receiptPath, "utf8"))
		.trim()
		.split("\n")
		.map((line) => JSON.parse(line));
	const completed = new Map();
	for (const row of journal) {
		if (!completed.has(row.key) || row.action === "deleted")
			completed.set(row.key, row);
	}
	const finalReceipts = [...completed.values()];
	assert.equal(finalReceipts.length, candidates.length);
	const retiredFiles = inventory.files.filter((file) =>
		targets.has(file.source),
	);
	const retirement = {
		schemaVersion: 1,
		authorization: `${base}/authorization.json`,
		release: live,
		retiredAt: new Date().toISOString(),
		files: retiredFiles,
		objects: finalReceipts,
	};
	await writeFile(
		"docs/assets/retired.json",
		`${JSON.stringify(retirement, null, 2)}\n`,
	);
	const survivors = inventory.files.filter((file) => !targets.has(file.source));
	assert.ok(
		survivors.every((file) => !checked.some((old) => old.key === file.key)),
	);
	for (const file of targets.values()) {
		assert.equal(digest(await readFile(file.source)), file.sha256);
		await unlink(file.source);
	}
	await writeFile(
		"docs/assets/inventory.json",
		`${JSON.stringify({ ...inventory, files: survivors }, null, 2)}\n`,
	);
	const routes = JSON.parse(
		await readFile("src/data/asset-routes.json", "utf8"),
	);
	for (const [path, key] of Object.entries(routes))
		if (checked.some((file) => file.key === key)) delete routes[path];
	await writeFile(
		"src/data/asset-routes.json",
		`${JSON.stringify(routes, null, "\t")}\n`,
	);
	const retainedHashes = new Set(survivors.map((file) => file.sha256));
	let cacheBytes = 0;
	for (const file of checked) {
		const cache = `.wrangler/asset-cache/${file.sha256}`;
		if (!retainedHashes.has(file.sha256) && existsSync(cache)) {
			assert.equal(digest(await readFile(cache)), file.sha256);
			await unlink(cache);
			cacheBytes += file.bytes;
		}
	}
	const summary = {
		deletedKeys: finalReceipts.filter((f) => f.action === "deleted").length,
		deletedBytes: finalReceipts
			.filter((f) => f.action === "deleted")
			.reduce((n, f) => n + f.bytes, 0),
		alreadyAbsent: finalReceipts.filter((f) => f.action === "already-absent")
			.length,
		localFiles: targets.size,
		localBytes: [...targets.values()].reduce((n, f) => n + f.bytes, 0),
		cacheBytes,
		retainedIdentityKits: plan.embeddedIdentityKitDependencies,
	};
	await writeFile(
		`${base}/retirement-result.json`,
		`${JSON.stringify(summary, null, 2)}\n`,
	);
	console.log(summary);
} finally {
	await lock.close();
	await rm(lockPath);
}
