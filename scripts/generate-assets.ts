import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import type { Project } from "../src/model/project";

const projects: Project[] = JSON.parse(
	await readFile("src/data/projects.json", "utf8"),
);
await mkdir("public/logos/display", { recursive: true });
for (const project of projects) {
	const source = await readFile(`public${project.logo.original}`);
	const meta = await sharp(source).metadata();
	for (const size of [32, 64, 160, 1024]) {
		await sharp(source)
			.resize(size, size, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.webp({ quality: 88, effort: 5 })
			.toFile(`public/logos/display/${project.id}-${size}.webp`);
	}
	Object.assign(project.logo, {
		width: meta.width,
		height: meta.height,
		bytes: source.length,
		sha256: createHash("sha256").update(source).digest("hex"),
		thumbnail: `/logos/display/${project.id}-160.webp`,
		display: `/logos/display/${project.id}-1024.webp`,
	});
	if (project.family) {
		const root = `public${project.family.root}`;
		for (const size of [32, 64, 160, 1024]) {
			await sharp(`${root}/icon.png`)
				.resize(size, size)
				.webp({ quality: 88, effort: 5 })
				.toFile(`${root}/icon-${size}.webp`);
		}
		for (const [name, path] of [
			["background", `${root}/background.png`],
			["previous", `public${project.family.previous.original}`],
		]) {
			await sharp(path)
				.resize(1024, 1024, {
					fit: "contain",
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				})
				.webp({ quality: 88, effort: 5 })
				.toFile(`${root}/${name}-1024.webp`);
		}
	}
}
await writeFile(
	"src/data/projects.json",
	`${JSON.stringify(projects, null, "\t")}\n`,
);
console.info(
	`Built four preview sizes for ${projects.length} identities; original bytes preserved.`,
);
