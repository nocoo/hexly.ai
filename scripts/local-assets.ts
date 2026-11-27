import { existsSync } from "node:fs";
import { copyFile, link, mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { filesIn, pool, readInventory } from "./asset-storage";

/** Local Worker fixtures only: never add this directory to a production build. */
export async function localAssets(
	profile: string,
	owned?: { directory: string; assertOwned: () => void },
) {
	owned?.assertOwned();
	const directory = owned?.directory ?? `.wrangler/${profile}-assets`;
	if (owned) {
		await mkdir(directory);
	} else {
		await rm(directory, { recursive: true, force: true });
	}
	const inventory =
		profile === "browser" ? [] : readInventory().files.filter((f) => f.path);
	const files = [
		...filesIn("dist").map((source) => ({ source, path: source.slice(4) })),
		...inventory.map((f) => ({ source: f.source, path: f.path ?? "" })),
		...inventory.map((f) => ({ source: f.source, path: `/${f.key}` })),
	];
	const directories = [
		...new Set(files.map(({ path }) => dirname(`${directory}${path}`))),
	];
	await pool(
		directories,
		async (dir) => {
			await mkdir(dir, { recursive: true });
		},
		32,
	);
	await pool(
		files,
		async ({ source, path }) => {
			const target = `${directory}${path}`;
			if (existsSync(target)) return;
			try {
				await link(source, target);
			} catch {
				await copyFile(source, target);
			}
		},
		64,
	);
	return directory;
}
