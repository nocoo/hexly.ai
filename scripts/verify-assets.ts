import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import type { Project } from "../src/model/project";

const projects: Project[] = JSON.parse(
	await readFile("src/data/projects.json", "utf8"),
);
for (const project of projects) {
	const original = await readFile(`public${project.logo.original}`);
	if (
		createHash("sha256").update(original).digest("hex") !== project.logo.sha256
	)
		throw new Error(`Original checksum changed: ${project.id}`);
	for (const size of [32, 64, 160, 1024]) {
		const meta = await sharp(
			`public/logos/display/${project.id}-${size}.webp`,
		).metadata();
		if (meta.width !== size || meta.height !== size)
			throw new Error(`Incorrect derivative dimensions: ${project.id}/${size}`);
	}
}
console.info(
	`Verified ${projects.length} source checksums and ${projects.length * 4} image derivatives.`,
);
