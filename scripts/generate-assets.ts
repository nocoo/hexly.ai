import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, relative } from "node:path";
import sharp from "sharp";
import { readProjects, writeProjects } from "../src/data/read-projects";

const projects = readProjects();
await mkdir("public/logos/display", { recursive: true });
for (const project of projects) {
	const source = await readFile(`public${project.logo.original}`);
	const meta = await sharp(source).metadata();
	for (const size of [32, 64, 160, 256, 512, 1024]) {
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
		const family = project.family;
		const root = `public${family.root}`;
		const studyPath = relative("/logos/family", dirname(family.root));
		const artworkId = basename(dirname(studyPath));
		const study = `artwork/logo-family/${studyPath}`;
		const finishing = `${study}/finishing/${family.finishing}`;
		const retained = family.method === "retained-original";
		const adapted = family.method === "reference-adaptation";
		const supplied = retained || adapted;
		const sourceRecord = JSON.parse(
			await readFile(
				`${study}/${supplied ? "source" : "response"}.json`,
				"utf8",
			),
		) as {
			output?: { path: string };
			artwork?: { path: string };
			reference?: { path: string };
		};
		const sourcePath = adapted
			? sourceRecord.reference?.path
			: retained
				? sourceRecord.artwork?.path
				: sourceRecord.output?.path;
		if (!sourcePath) throw new Error(`Missing study source: ${project.id}`);
		const nativeSize = family.foreground.width;
		await mkdir(root, { recursive: true });
		const files = [];
		for (const [name, source] of [
			[
				"transparent.png",
				`${finishing}/exports/${artworkId}-transparent-${nativeSize}.png`,
			],
			["icon.png", `${finishing}/exports/${artworkId}-icon-${nativeSize}.png`],
			[
				"rounded.png",
				`${finishing}/exports/${artworkId}-rounded-${nativeSize}.png`,
			],
			[
				"white.png",
				`${finishing}/exports/${artworkId}-white-${nativeSize}.png`,
			],
			["background.png", `${finishing}/background.png`],
			[
				adapted ? "source.jpg" : retained ? "source.png" : "raw.png",
				`${study}/${sourcePath}`,
			],
			[
				supplied ? "brief.txt" : "prompt.txt",
				`${study}/${supplied ? "brief.txt" : "prompt.txt"}`,
			],
		] as const) {
			const data = await readFile(source);
			const destination = `${root}/${name}`;
			try {
				await writeFile(destination, data, { flag: "wx" });
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
				if (!(await readFile(destination)).equals(data))
					throw new Error(
						`Refusing to overwrite archived artwork: ${destination}`,
					);
			}
			files.push({
				path: `${family.root}/${name}`,
				bytes: data.length,
				sha256: createHash("sha256").update(data).digest("hex"),
			});
		}
		await writeFile(
			`${root}/manifest.json`,
			`${JSON.stringify({ study: studyPath, finishing: family.finishing, status: family.status, files }, null, "\t")}\n`,
		);
		for (const size of [32, 64, 160, 256, 512, 1024]) {
			await sharp(`${root}/icon.png`)
				.resize(size, size)
				.webp({ quality: 88, effort: 5 })
				.toFile(`${root}/icon-${size}.webp`);
		}
		for (const [name, path] of [
			["background", `${root}/background.png`],
			["previous", `public${project.family.previous.original}`],
			["transparent", `${root}/transparent.png`],
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
writeProjects(projects);
console.info(
	`Built six preview sizes for ${projects.length} identities; original bytes preserved.`,
);
