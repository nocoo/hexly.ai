import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
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
		const foreground = project.family.foreground;
		const master = await readFile(`public${foreground.original}`);
		const meta = await sharp(master).metadata();
		if (
			createHash("sha256").update(master).digest("hex") !== foreground.sha256 ||
			meta.width !== foreground.width ||
			meta.height !== foreground.height
		)
			throw new Error(`Refined foreground changed: ${project.id}`);
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
		for (const name of ["previous", "background", "transparent"]) {
			const meta = await sharp(`${root}/${name}-1024.webp`).metadata();
			if (meta.width !== 1024 || meta.height !== 1024)
				throw new Error(
					`Incorrect family preview dimensions: ${project.id}/${name}`,
				);
		}
	}
}
console.info(
	`Verified ${projects.length} source checksums, ${projects.length * 4} artwork derivatives, and all current family foregrounds and previews.`,
);

let publicArchives = 0;
for await (const path of new Bun.Glob(
	"public/logos/family/**/manifest.json",
).scan(".")) {
	const manifest: {
		files: { path: string; bytes: number; sha256: string }[];
	} = JSON.parse(await readFile(path, "utf8"));
	for (const file of manifest.files) {
		const data = await readFile(`public${file.path}`);
		if (
			data.length !== file.bytes ||
			createHash("sha256").update(data).digest("hex") !== file.sha256
		)
			throw new Error(`Family archive changed: ${file.path}`);
	}
	publicArchives++;
}
console.info(
	`Verified ${publicArchives} current and historical public family archives.`,
);

let finishingPasses = 0;
for await (const path of new Bun.Glob(
	"artwork/logo-family/*/*/finishing/*/manifest.json",
).scan(".")) {
	const manifest: {
		input: { path: string; sha256: string };
		files: { path: string; bytes: number; sha256: string }[];
	} = JSON.parse(await readFile(path, "utf8"));
	const root = dirname(path);
	const input = await readFile(resolve(root, manifest.input.path));
	if (
		createHash("sha256").update(input).digest("hex") !== manifest.input.sha256
	)
		throw new Error(`Study source changed: ${path}`);
	for (const file of manifest.files) {
		const data = await readFile(resolve(root, file.path));
		if (
			data.length !== file.bytes ||
			createHash("sha256").update(data).digest("hex") !== file.sha256
		)
			throw new Error(`Finishing archive changed: ${path}/${file.path}`);
	}
	finishingPasses++;
}
console.info(
	`Verified every recorded file in ${finishingPasses} finishing passes.`,
);
