import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import manifest from "../package.json";
import projects from "../src/data/projects.json";

const revision =
	process.argv[2] ??
	process.env.GITHUB_SHA ??
	execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
if (!/^[a-f0-9]{40}$/.test(revision))
	throw new Error("Expected a full Git revision.");
const origin = new URL(process.env.DEPLOY_URL ?? "https://hexly.ai");

async function get(path: string) {
	const response = await fetch(new URL(path, origin), {
		cache: "no-store",
		signal: AbortSignal.timeout(15_000),
	});
	if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
	return response;
}

let verified = false;
for (let attempt = 1; attempt <= 18; attempt++) {
	try {
		const response = await get(`/api/live?revision=${revision}`);
		const data = await response.json();
		if (
			data.status !== "ok" ||
			data.name !== manifest.name ||
			data.version !== manifest.version ||
			data.revision !== revision
		) {
			throw new Error(
				`Waiting for v${manifest.version} at ${revision.slice(0, 7)}.`,
			);
		}
		if (
			!response.headers.get("content-type")?.includes("application/json") ||
			response.headers.get("cache-control") !== "no-store"
		) {
			throw new Error("Release metadata must be JSON and uncached.");
		}
		verified = true;
		break;
	} catch (error) {
		console.info(
			`Production check ${attempt}/18: ${error instanceof Error ? error.message : "Request failed"}`,
		);
		if (attempt < 18) await Bun.sleep(10_000);
	}
}
if (!verified)
	throw new Error("The expected release is not serving in production.");

const document = await get("/");
const html = await document.text();
if (
	!html.includes('<div id="root"></div>') ||
	!html.includes('href="https://hexly.ai/"')
) {
	throw new Error("The production document does not match the directory.");
}
const assets = [...new Set(html.match(/\/assets\/[^" ]+\.(?:js|css)/g))];
if (assets.length < 2)
	throw new Error("The document is missing compiled JavaScript or CSS.");
await Promise.all(
	assets.map(async (path) => {
		const response = await get(path);
		const type = path.endsWith(".js") ? "javascript" : "text/css";
		if (!response.headers.get("content-type")?.includes(type)) {
			throw new Error(`Invalid production asset: ${path}`);
		}
		await response.arrayBuffer();
	}),
);
const identity = projects.find((project) => project.id === "hexly-ai");
if (!identity) throw new Error("The directory must include its own identity.");
const logo = await (await get(identity.logo.original)).arrayBuffer();
if (
	createHash("sha256").update(new Uint8Array(logo)).digest("hex") !==
	identity.logo.sha256
) {
	throw new Error("The production logo does not match the archived original.");
}
console.info(
	`Verified ${origin.origin}: v${manifest.version}, revision ${revision}, document, compiled assets, and original logo.`,
);
