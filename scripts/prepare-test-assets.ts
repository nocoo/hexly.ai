import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { readProjects } from "../src/data/read-projects";
import { digest, hydrate, pool, readInventory } from "./asset-storage";

const sources = new Set([
	"docs/screenshots/directory-light.png",
	"artwork/logo-family/snail/2026-09-13-01/raw/generated.png",
	"artwork/logo-family/snail/2026-09-13-04/raw/generated.png",
	...readProjects().flatMap((project) => {
		const snapshot = project.overview?.verified.snapshot;
		if (!snapshot) return [];
		const source: { files: { archive: string }[] } = JSON.parse(
			readFileSync(snapshot.path, "utf8"),
		);
		return source.files.map((file) => file.archive);
	}),
]);
const files = readInventory().files.filter(
	(file) =>
		file.path ||
		sources.has(file.source) ||
		[
			"packages/video-kit/",
			"artwork/brands/",
			"artwork/brand-textures/",
			"src/fonts/",
		].some((prefix) => file.source.startsWith(prefix)),
);

await hydrate(files, 16);
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
console.info(`Verified ${files.length} public and test-source asset paths.`);
