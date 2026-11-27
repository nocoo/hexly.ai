import { readFile } from "node:fs/promises";
import {
	digest,
	hydrate,
	pool,
	pruneAssetCache,
	readInventory,
} from "./asset-storage";

const files = readInventory().files.filter((file) => Boolean(file.path));

await hydrate(files, 32);
await pruneAssetCache(new Set(files.map((file) => file.sha256)));
let verified = 0;
await pool(
	files,
	async (file) => {
		const bytes = await readFile(file.source);
		if (bytes.length !== file.bytes || digest(bytes) !== file.sha256)
			throw new Error(`Test asset differs from inventory: ${file.source}`);
		verified++;
	},
	8,
);
if (verified !== files.length)
	throw new Error(
		`Verified ${verified} of ${files.length} asset paths; the verification pool stopped early.`,
	);
console.info(`Verified ${files.length} public CDN asset paths.`);
