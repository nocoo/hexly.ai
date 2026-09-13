import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { constants, existsSync, readdirSync, readFileSync } from "node:fs";
import {
	appendFile,
	copyFile,
	mkdir,
	open,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises";
import { basename, dirname, extname } from "node:path";
import { setTimeout } from "node:timers/promises";
import { parseArgs } from "node:util";
import storage from "../src/data/media-storage.json" with { type: "json" };
import { readProjects } from "../src/data/read-projects";
import identity from "../src/data/site-identity.json" with { type: "json" };
import type { Project } from "../src/model/project";
import { cacheControl, mediaTypes } from "./media-r2";

export const inventoryPath = "docs/assets/inventory.json";
const receiptPath = "docs/assets/publication.jsonl";
const binary =
	/\.(?:png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|zip|pdf|pptx|mp[34]|wav|webm)$/i;
const appFiles = new Set([
	"_headers",
	"_redirects",
	"robots.txt",
	"preferences.js",
]);
export interface StoredAsset {
	source: string;
	path?: string;
	aliases?: string[];
	version: string;
	key: string;
	bytes: number;
	sha256: string;
	contentType: string;
	project: string;
	role:
		| "official-project-identity"
		| "hexly-campaign"
		| "licensed-font"
		| "source-archive";
	provenance: string;
}
export interface AssetInventory {
	schemaVersion: 1;
	sourceRevision: string;
	bucket: string;
	origin: string;
	files: StoredAsset[];
}
export const digest = (bytes: Uint8Array) =>
	createHash("sha256").update(bytes).digest("hex");
export const publicUrl = (asset: Pick<StoredAsset, "key">) =>
	`${storage.origin}/${asset.key}`;
export function readInventory(): AssetInventory {
	const data = JSON.parse(
		readFileSync(inventoryPath, "utf8"),
	) as AssetInventory;
	if (
		data.schemaVersion !== 1 ||
		data.bucket !== storage.bucket ||
		data.origin !== storage.origin
	)
		throw new Error("Asset inventory disagrees with the storage contract.");
	const keys = new Map<string, string>();
	const paths = new Set<string>();
	const sources = new Set<string>();
	for (const file of data.files) {
		if (
			!/^[a-f0-9]{64}$/.test(file.sha256) ||
			!Number.isSafeInteger(file.bytes) ||
			file.bytes < 1 ||
			sources.has(file.source) ||
			!file.source ||
			file.source.startsWith("/") ||
			file.source.split("/").includes("..") ||
			!/^[a-zA-Z0-9/_.-]+$/.test(file.key) ||
			file.key.startsWith("/") ||
			file.key.split("/").includes("..") ||
			!/^(?:historical|\d+\.\d+\.\d+)$/.test(file.version) ||
			(keys.has(file.key) && keys.get(file.key) !== file.sha256)
		)
			throw new Error(`Invalid or conflicting asset: ${file.source}`);
		keys.set(file.key, file.sha256);
		sources.add(file.source);
		for (const path of [file.path, ...(file.aliases ?? [])].filter(Boolean)) {
			if (
				!path ||
				!/^\/[a-zA-Z0-9/_.-]+$/.test(path) ||
				path.split("/").includes("..") ||
				paths.has(path)
			)
				throw new Error(`Invalid or conflicting public path: ${path}`);
			paths.add(path);
		}
	}
	return data;
}

export function filesIn(directory: string): string[] {
	if (!existsSync(directory)) return [];
	return readdirSync(directory, { withFileTypes: true })
		.flatMap((entry) => {
			const path = `${directory}/${entry.name}`;
			return entry.name.startsWith(".") || entry.isSymbolicLink()
				? []
				: entry.isDirectory()
					? filesIn(path)
					: [path];
		})
		.sort();
}

/** Published package-relative paths remain byte compatible; loose assets get immutable keys. */
export function assetKey(path: string, sha256: string, project: string) {
	if (
		/^\/(?:brands\/[^/]+\/v\d+\.\d+\.\d+\/|logos\/family\/|video-kit\/\d+\.\d+\.\d+\/)/.test(
			path,
		)
	)
		return path.slice(1);
	const extension = extname(path).toLowerCase();
	const stem = basename(path, extname(path))
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, "-");
	const prefix =
		project === "hexly-ai" ? "shared/site" : `projects/${project}/identity`;
	return `${prefix}/v1.0.0/${stem}-${sha256.slice(0, 12)}${extension}`;
}

export async function inventory() {
	const projects = [...readProjects(), identity as Project];
	const previous = existsSync(inventoryPath) ? readInventory() : undefined;
	const previousSources = new Map(
		previous?.files.map((file) => [file.source, file]),
	);
	const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
		.split("\0")
		.filter(Boolean);
	const sources = new Map<string, string | undefined>();
	for (const source of filesIn("public"))
		if (!appFiles.has(source.slice(7)))
			sources.set(source, `/${source.slice(7)}`);
	for (const source of filesIn("packages/video-kit/public"))
		sources.set(source, source.slice("packages/video-kit/public".length));
	for (const source of tracked)
		if (binary.test(source)) sources.set(source, sources.get(source));
	// These approved source directories also contain new, intentionally untracked originals.
	for (const directory of ["artwork", "docs", "src/fonts"])
		for (const source of filesIn(directory))
			if (binary.test(source)) sources.set(source, sources.get(source));
	for (const source of previousSources.keys())
		sources.set(source, previousSources.get(source)?.path);
	for (const [source, path] of [
		["src/fonts/journey-cjk.woff2", "/fonts/journey-cjk.woff2"],
		[
			"node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
			"/fonts/space-grotesk.woff2",
		],
		[
			"node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
			"/fonts/geist-mono.woff2",
		],
	] as const)
		sources.set(source, path);
	const files: StoredAsset[] = [];
	for (const [source, path] of [...sources].sort(([a], [b]) =>
		a.localeCompare(b),
	)) {
		const old = previousSources.get(source);
		if (!existsSync(source)) {
			if (!old) throw new Error(`Missing source: ${source}`);
			files.push(old);
			continue;
		}
		const bytes = await readFile(source);
		const sha256 = digest(bytes);
		if (old && old.sha256 !== sha256)
			throw new Error(
				`Published source changed: ${source}. Add a version instead.`,
			);
		const project =
			projects.find(
				(p) =>
					path &&
					(path === p.logo.original ||
						path.startsWith(`/logos/display/${p.id}-`) ||
						path === `/og/${p.id}.jpg` ||
						path.startsWith(`/brands/${p.id}/`) ||
						(p.family && path.startsWith(`${p.family.root}/`))),
			) ??
			projects.find((p) => source.includes(`/${p.id}/`)) ??
			identity;
		const official =
			path === project.logo.original || /\/official-logo\./.test(source);
		files.push(
			old ?? {
				source,
				...(path ? { path } : {}),
				version: path?.startsWith("/logos/family/")
					? "historical"
					: (path?.match(/\/v(\d+\.\d+\.\d+)\//)?.[1] ?? "1.0.0"),
				bytes: bytes.length,
				sha256,
				key: path
					? assetKey(path, sha256, project.id)
					: `archives/sources/v1.0.0/${sha256}${extname(source).toLowerCase()}`,
				contentType:
					mediaTypes[extname(source).toLowerCase()] ??
					"application/octet-stream",
				project: project.id,
				role: official
					? "official-project-identity"
					: /\.(woff2?|ttf|otf)$/.test(source)
						? "licensed-font"
						: path
							? "hexly-campaign"
							: "source-archive",
				provenance: official
					? project.logo.sourceUrl
					: path?.startsWith("/brands/")
						? `${dirname(path)}/provenance.json`
						: path?.startsWith("/video-kit/")
							? "packages/video-kit/brand-source.json"
							: "docs/02-identity-rules.md",
			},
		);
	}
	// Source copies with identical bytes can recover from a published export.
	const publicByHash = new Map(
		files.filter((f) => f.path).map((f) => [f.sha256, f.key]),
	);
	for (const file of files)
		if (!file.path) file.key = publicByHash.get(file.sha256) ?? file.key;
	const document: AssetInventory = {
		schemaVersion: 1,
		sourceRevision:
			previous?.sourceRevision ??
			execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
		...storage,
		files,
	};
	await mkdir(dirname(inventoryPath), { recursive: true });
	await writeFile(inventoryPath, `${JSON.stringify(document, null, 2)}\n`);
	const routes = Object.fromEntries(
		files.flatMap((file) =>
			[file.path, ...(file.aliases ?? [])]
				.filter(
					(path) =>
						path &&
						file.key !== path.slice(1) &&
						!/\.(html|css|js)$/.test(path),
				)
				.map((path) => [path, file.key]),
		),
	);
	await writeFile(
		"src/data/asset-routes.json",
		`${JSON.stringify(routes, null, "\t")}\n`,
	);
	console.info(
		`Inventoried ${files.length} source paths, ${new Set(files.map((f) => f.key)).size} objects, ${files.reduce((n, f) => n + f.bytes, 0)} source bytes.`,
	);
}

/** Bounded network retries only; different bytes are a permanent failure. */
export async function retry<T>(operation: () => Promise<T>): Promise<T> {
	for (let attempt = 0; ; attempt++) {
		try {
			return await operation();
		} catch (error) {
			if (
				attempt >= 2 ||
				(error instanceof Error &&
					/mismatch|changed|conflict|HTTP 40[013]/i.test(error.message))
			)
				throw error;
			const delay = Math.max(
				750 * 2 ** attempt,
				error instanceof Error && "retryAfterMs" in error
					? Number(error.retryAfterMs)
					: 0,
			);
			if (delay > 5000)
				console.info(
					`Rate limit: waiting ${Math.ceil(delay / 1000)} seconds before bounded retry ${attempt + 2}/3.`,
				);
			await setTimeout(delay);
		}
	}
}
async function request(url: string, init: RequestInit = {}) {
	if (url.startsWith("https://api.cloudflare.com/") && Date.now() < apiRetryAt)
		await setTimeout(apiRetryAt - Date.now());
	const response = await fetch(url, {
		...init,
		redirect: "error",
		signal: AbortSignal.timeout(120_000),
		headers: { "User-Agent": "hexly-assets/1.0", ...init.headers },
	});
	if (response.status >= 500 || response.status === 429) {
		const retryAfterMs =
			response.status === 429
				? Math.min(
						300_000,
						Math.max(
							60_000,
							Number(response.headers.get("retry-after") ?? "60") * 1000 ||
								60_000,
						),
					)
				: 0;
		if (response.status === 429) apiRetryAt = Date.now() + retryAfterMs;
		await response.arrayBuffer();
		throw Object.assign(new Error(`HTTP ${response.status}: ${url}`), {
			retryAfterMs,
		});
	}
	return response;
}
let apiRetryAt = 0;
export async function verifiedBytes(file: StoredAsset, url = publicUrl(file)) {
	const response = await retry(() => request(url));
	if (response.status !== 200)
		throw new Error(`HTTP ${response.status}: ${url}`);
	const bytes = new Uint8Array(await response.arrayBuffer());
	if (bytes.length !== file.bytes || digest(bytes) !== file.sha256)
		throw new Error(`Asset checksum/size mismatch: ${file.source}`);
	if (
		response.headers.get("content-type")?.split(";")[0] !==
		file.contentType.split(";")[0]
	)
		throw new Error(`Asset MIME mismatch: ${file.source}`);
	return bytes;
}

async function pool<T>(
	items: T[],
	operation: (item: T) => Promise<void>,
	concurrency: number,
) {
	let index = 0;
	let stopped = false;
	const results = await Promise.allSettled(
		Array.from({ length: Math.min(concurrency, items.length) }, async () => {
			while (!stopped && index < items.length) {
				const item = items[index++];
				if (item === undefined) break;
				try {
					await operation(item);
				} catch (error) {
					stopped = true;
					throw error;
				}
			}
		}),
	);
	for (const result of results)
		if (result.status === "rejected") throw result.reason;
}

// Credentials are captured in memory, never printed or passed in process arguments.
function credentials() {
	const run = (args: string[]) =>
		JSON.parse(
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
	const user = run(["whoami"]) as { accounts: { id: string }[] };
	const auth = run(["auth", "token"]) as { token?: string };
	const account = process.env.CLOUDFLARE_ACCOUNT_ID ?? user.accounts[0]?.id;
	if (
		!auth.token ||
		!account ||
		(!process.env.CLOUDFLARE_ACCOUNT_ID && user.accounts.length !== 1)
	)
		throw new Error("Select an authenticated Cloudflare account.");
	return { token: auth.token, account };
}

export async function publish(files: StoredAsset[], concurrency: number) {
	await mkdir(".wrangler", { recursive: true });
	const lockPath = ".wrangler/assets-publish.lock";
	const lock = await open(lockPath, "wx");
	await lock.writeFile(String(process.pid));
	try {
		let auth = credentials();
		let authenticatedAt = Date.now();
		const completed = new Set(
			existsSync(receiptPath)
				? readFileSync(receiptPath, "utf8")
						.trim()
						.split("\n")
						.filter(Boolean)
						.map((line) => {
							const r = JSON.parse(line);
							return `${r.key}:${r.sha256}`;
						})
				: [],
		);
		let count = 0;
		let nextPut = Date.now();
		await pool(
			files,
			async (file) => {
				if (completed.has(`${file.key}:${file.sha256}`)) {
					count++;
					return;
				}
				const url = `${publicUrl(file)}?inspect=${randomUUID()}`;
				const exists = await retry(() => request(url, { method: "HEAD" }));
				if (![200, 404].includes(exists.status))
					throw new Error(`HTTP ${exists.status}: ${file.key}`);
				if (exists.status === 404) {
					const bytes = await readFile(file.source);
					if (bytes.length !== file.bytes || digest(bytes) !== file.sha256)
						throw new Error(`Source changed: ${file.source}`);
					// Leave account API headroom for other active Workers/agents.
					const delay = Math.max(0, nextPut - Date.now());
					nextPut = Math.max(Date.now(), nextPut) + 700;
					await setTimeout(delay);
					if (Date.now() - authenticatedAt > 30 * 60_000) {
						const refreshed = credentials();
						if (refreshed.account !== auth.account)
							throw new Error("Authenticated account changed; stopped.");
						auth = refreshed;
						authenticatedAt = Date.now();
					}
					const response = await retry(() =>
						request(
							`https://api.cloudflare.com/client/v4/accounts/${auth.account}/r2/buckets/${storage.bucket}/objects/${file.key}`,
							{
								method: "PUT",
								body: bytes,
								headers: {
									Authorization: `Bearer ${auth.token}`,
									"Content-Type": file.contentType,
									"Content-Length": String(file.bytes),
									"Cache-Control": cacheControl,
									"cf-r2-data-catalog-check": "true",
								},
							},
						),
					);
					if (!response.ok)
						throw new Error(`R2 upload HTTP ${response.status}: ${file.key}`);
					await response.arrayBuffer();
				}
				await verifiedBytes(file);
				await appendFile(
					receiptPath,
					`${JSON.stringify({ key: file.key, url: publicUrl(file), sha256: file.sha256, bytes: file.bytes, contentType: file.contentType, verifiedAt: new Date().toISOString(), action: exists.status === 200 ? "reused" : "uploaded" })}\n`,
				);
				if (++count % 25 === 0 || count === files.length)
					console.info(`Verified ${count}/${files.length}: ${file.key}`);
			},
			concurrency,
		);
		console.info(
			`Publication complete: ${files.length} objects (including recorded verified uploads).`,
		);
	} finally {
		await lock.close();
		await rm(lockPath);
	}
}

export async function hydrate(files: StoredAsset[], concurrency: number) {
	const cache = ".wrangler/asset-cache";
	await mkdir(cache, { recursive: true });
	const byHash = new Map<string, StoredAsset[]>();
	for (const file of files)
		byHash.set(file.sha256, [...(byHash.get(file.sha256) ?? []), file]);
	let fetched = 0;
	await pool(
		[...byHash.values()],
		async (copies) => {
			const file = copies[0];
			if (!file) return;
			const missing = copies.filter((f) => !existsSync(f.source));
			if (!missing.length) return;
			const cached = `${cache}/${file.sha256}`;
			if (!existsSync(cached)) {
				const local = copies.find((f) => existsSync(f.source));
				const bytes = local
					? new Uint8Array(await readFile(local.source))
					: await retry(() => verifiedBytes(file));
				if (digest(bytes) !== file.sha256)
					throw new Error(`Hydration checksum mismatch: ${file.source}`);
				await writeFile(cached, bytes);
				fetched++;
			}
			if (digest(await readFile(cached)) !== file.sha256)
				throw new Error(`Cached checksum mismatch: ${file.source}`);
			for (const copy of missing) {
				await mkdir(dirname(copy.source), { recursive: true });
				await copyFile(cached, copy.source, constants.COPYFILE_EXCL);
			}
		},
		concurrency,
	);
	console.info(
		`Hydrated ${files.length} paths; ${fetched} cache additions. Existing local edits were preserved.`,
	);
}

if (import.meta.main) {
	const { positionals, values } = parseArgs({
		args: process.argv.slice(2).filter((s) => s !== "--"),
		allowPositionals: true,
		options: {
			project: { type: "string" },
			scope: { type: "string", default: "public" },
			limit: { type: "string" },
			concurrency: { type: "string", default: "8" },
			upload: { type: "boolean", default: false },
		},
	});
	const command = positionals[0];
	if (!["public", "all"].includes(values.scope))
		throw new Error("Scope must be public or all.");
	if (
		values.project &&
		![...readProjects().map((p) => p.id), "hexly-ai"].includes(values.project)
	)
		throw new Error(`Unknown catalogue project: ${values.project}`);
	const limit = values.limit === undefined ? undefined : Number(values.limit);
	if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1))
		throw new Error("Limit must be a positive integer.");
	if (command === "inventory") await inventory();
	else {
		const data = readInventory();
		const selected = data.files.filter(
			(f) =>
				(values.scope === "all" || (values.scope === "public" && !!f.path)) &&
				(!values.project || f.project === values.project),
		);
		const objects = [...new Map(selected.map((f) => [f.key, f])).values()];
		const files = limit ? objects.slice(0, limit) : objects;
		const concurrency = Number(values.concurrency);
		if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16)
			throw new Error("Concurrency must be 1–16.");
		if (command === "plan")
			console.info(
				JSON.stringify(
					{
						...storage,
						sourcePaths: selected.length,
						objects: files.length,
						bytes: files.reduce((n, f) => n + f.bytes, 0),
						sample: files
							.slice(0, 5)
							.map((f) => ({ source: f.source, url: publicUrl(f) })),
					},
					null,
					2,
				),
			);
		else if (command === "url") {
			const file = data.files.find(
				(f) =>
					f.source === positionals[1] ||
					f.path === positionals[1] ||
					f.aliases?.includes(positionals[1] ?? "") ||
					f.key === positionals[1],
			);
			if (!file) throw new Error("Asset not in inventory.");
			console.info(JSON.stringify({ ...file, url: publicUrl(file) }, null, 2));
		} else if (command === "publish") {
			if (!values.upload)
				throw new Error(
					"Run plan first; --upload is required for publication.",
				);
			await publish(files, concurrency);
		} else if (command === "verify") {
			let count = 0;
			await pool(
				files,
				async (file) => {
					await retry(() => verifiedBytes(file));
					if (++count % 100 === 0)
						console.info(`Verified ${count}/${files.length}`);
				},
				concurrency,
			);
			console.info(
				`Verified complete public bytes and MIME for ${files.length} objects.`,
			);
		} else if (command === "hydrate") {
			const keys = new Set(files.map((file) => file.key));
			await hydrate(
				selected.filter((file) => keys.has(file.key)),
				concurrency,
			);
		} else
			throw new Error(
				"Expected inventory, plan, url <path>, publish --upload, verify, or hydrate; --scope public|all.",
			);
	}
}
