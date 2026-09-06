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
	if (project.family) {
		const root = `public${project.family.root}`;
		const manifest: {
			files: { path: string; bytes: number; sha256: string }[];
		} = JSON.parse(await readFile(`${root}/manifest.json`, "utf8"));
		for (const file of manifest.files) {
			const data = await readFile(`public${file.path}`);
			if (
				data.length !== file.bytes ||
				createHash("sha256").update(data).digest("hex") !== file.sha256
			)
				throw new Error(`Family archive changed: ${file.path}`);
		}
		const previous = await readFile(
			`public${project.family.previous.original}`,
		);
		if (
			createHash("sha256").update(previous).digest("hex") !==
			project.family.previous.sha256
		)
			throw new Error(`Previous identity changed: ${project.id}`);
		for (const size of [32, 64, 160, 1024]) {
			const meta = await sharp(`${root}/icon-${size}.webp`).metadata();
			if (meta.width !== size || meta.height !== size)
				throw new Error(
					`Incorrect family icon dimensions: ${project.id}/${size}`,
				);
		}
		for (const name of ["previous", "background"]) {
			const meta = await sharp(`${root}/${name}-1024.webp`).metadata();
			if (meta.width !== 1024 || meta.height !== 1024)
				throw new Error(
					`Incorrect family preview dimensions: ${project.id}/${name}`,
				);
		}
	}
}
console.info(
	`Verified ${projects.length} source checksums, ${projects.length * 4} artwork derivatives, and all promoted family archives and previews.`,
);
