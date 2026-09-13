import { existsSync } from "node:fs";
import { copyFile, link, mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { filesIn, readInventory } from "./asset-storage";

/** Local Worker fixtures only: never add this directory to a production build. */
export async function localAssets(profile: string) {
	const directory = `.wrangler/${profile}-assets`;
	await rm(directory, { recursive: true, force: true });
	const files = [
		...filesIn("dist").map((source) => ({ source, path: source.slice(4) })),
		...readInventory()
			.files.filter((f) => f.path)
			.map((f) => ({ source: f.source, path: f.path ?? "" })),
		...readInventory()
			.files.filter((f) => f.path)
			.map((f) => ({ source: f.source, path: `/${f.key}` })),
	];
	for (const { source, path } of files) {
		const target = `${directory}${path}`;
		if (existsSync(target)) continue;
		await mkdir(dirname(target), { recursive: true });
		try {
			await link(source, target);
		} catch {
			await copyFile(source, target);
		}
	}
	return directory;
}
