import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));

/** Paths unit tests must never read (hydrated materials, CDN cache, identity binaries). */
export function assertUnitPathAllowed(target: string): void {
	const absolute = path.isAbsolute(target)
		? path.normalize(target)
		: path.normalize(path.join(process.cwd(), target));
	const relative = path.relative(repoRoot, absolute).replace(/\\/g, "/");
	if (relative.startsWith("..")) return;
	const blocked =
		relative === "public" ||
		relative.startsWith("public/") ||
		relative.includes("/.wrangler/asset-cache/") ||
		relative.startsWith(".wrangler/asset-cache/") ||
		relative.startsWith("src/fonts/") ||
		relative.startsWith("packages/video-kit/public/") ||
		/^artwork\/logo-family\/[^/]+\/[^/]+\/raw\//.test(relative) ||
		/^artwork\/brands\//.test(relative) ||
		/^artwork\/brand-textures\//.test(relative);
	if (blocked) {
		throw new Error(
			`L1 unit tests must not read hydrated assets (${relative}). Move this coverage to tests/assets (bun run test:assets).`,
		);
	}
}
