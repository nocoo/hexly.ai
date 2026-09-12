import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import sharp from "sharp";
import { readProjects } from "../src/data/read-projects";
import { brandAsset, rasterBrand } from "../src/model/brand";
import { brandManifestProblems } from "../src/model/brand-manifest";

const projects = readProjects();
for (const project of projects) {
	const snapshot = project.overview?.verified.snapshot;
	if (snapshot) {
		const evidence = await readFile(snapshot.path);
		if (createHash("sha256").update(evidence).digest("hex") !== snapshot.sha256)
			throw new Error(`Local source snapshot changed: ${project.id}`);
		const source = JSON.parse(evidence.toString()) as {
			files: { archive: string; sha256: string }[];
		};
		for (const file of source.files) {
			const bytes = await readFile(file.archive);
			if (createHash("sha256").update(bytes).digest("hex") !== file.sha256)
				throw new Error(`Archived local source changed: ${file.archive}`);
		}
	}
	const original = await readFile(`public${project.logo.original}`);
	if (project.brandKit) {
		const kit = project.brandKit;
		const manifest = JSON.parse(
			await readFile(`public${kit.root}/manifest.json`, "utf8"),
		);
		if (manifest.project !== project.id || manifest.version !== kit.version)
			throw new Error(`Brand manifest disagrees with catalogue: ${project.id}`);
		if (kit.method === "archived-artwork") {
			const problems = brandManifestProblems(manifest);
			if (problems.length)
				throw new Error(`${project.id}: ${problems.join("; ")}`);
			if (
				manifest.officialProjectIdentity.sha256 !== project.logo.sha256 ||
				manifest.campaignInterpretation.sha256 !==
					project.family?.foreground.sha256
			)
				throw new Error(
					`Brand identity roles disagree with original sources: ${project.id}`,
				);
		}
		for (const asset of [
			...(["mark", "wordmark", "lockup", "icon"] as const).flatMap((name) => [
				brandAsset(kit, name, "light"),
				brandAsset(kit, name, "dark"),
			]),
			...(rasterBrand(kit)
				? [
						"hero.png",
						"hero.webp",
						"hero-square.webp",
						"texture-light.svg",
						"texture-dark.svg",
						"provenance.json",
					]
				: ["favicon.svg"]
			).map((name) => `${kit.root}/${name}`),
			...(kit.hero?.themed
				? ["hero-dark.png", "hero-dark.webp", "hero-square-dark.webp"].map(
						(name) => `${kit.root}/${name}`,
					)
				: []),
			...[
				"favicon.ico",
				"guide.md",
				"license.txt",
				"space-grotesk-ofl.txt",
			].map((name) => `${kit.root}/${name}`),
		]) {
			if (!manifest.files.some((file: { path: string }) => file.path === asset))
				throw new Error(`Missing brand delivery: ${asset}`);
		}
	}
	if (
		createHash("sha256").update(original).digest("hex") !== project.logo.sha256
	)
		throw new Error(`Original checksum changed: ${project.id}`);
	for (const size of [32, 64, 160, 256, 512, 1024]) {
		const meta = await sharp(
			`public/logos/display/${project.id}-${size}.webp`,
		).metadata();
		if (meta.width !== size || meta.height !== size)
			throw new Error(`Incorrect derivative dimensions: ${project.id}/${size}`);
	}
	const social = await sharp(`public/og/${project.id}.jpg`).metadata();
	if (
		social.format !== "jpeg" ||
		social.width !== 1200 ||
		social.height !== 630
	)
		throw new Error(`Incorrect social image: ${project.id}`);
	const socialBytes = await readFile(`public/og/${project.id}.jpg`);
	if (socialBytes.byteLength > 400_000)
		throw new Error(`Social image too large: ${project.id}`);
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
		if (project.family.method === "retained-original") {
			const source = await readFile(`${root}/source.png`);
			if (
				project.family.model ||
				!master.equals(source) ||
				!source.equals(previous) ||
				!source.equals(original)
			)
				throw new Error(`Retained original was modified: ${project.id}`);
		}
		if (project.family.method === "reference-adaptation") {
			const source = JSON.parse(
				await readFile(
					`artwork/logo-family/${relative("/logos/family", dirname(project.family.root))}/source.json`,
					"utf8",
				),
			) as { reference: { sha256: string; width: number; height: number } };
			const illustration = await readFile(`${root}/source.jpg`);
			const info = await sharp(illustration).metadata();
			if (
				project.family.model ||
				createHash("sha256").update(illustration).digest("hex") !==
					source.reference.sha256 ||
				info.width !== source.reference.width ||
				info.height !== source.reference.height ||
				foreground.width !== info.width ||
				foreground.height !== info.height
			)
				throw new Error(
					`Adapted illustration provenance changed: ${project.id}`,
				);
		}
		for (const size of [32, 64, 160, 256, 512, 1024]) {
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
{
	const home = await sharp("public/og.jpg").metadata();
	if (home.format !== "jpeg" || home.width !== 1200 || home.height !== 630)
		throw new Error("Incorrect home social image");
	if ((await readFile("public/og.jpg")).byteLength > 400_000)
		throw new Error("Home social image too large");
}
console.info(
	`Verified ${projects.length} source checksums, ${projects.length * 6} artwork derivatives, and all current family foregrounds and previews.`,
);

let publicArchives = 0;
for await (const path of new Bun.Glob("public/brands/*/v*/manifest.json").scan(
	".",
)) {
	const manifest: { files: { path: string; bytes: number; sha256: string }[] } =
		JSON.parse(await readFile(path, "utf8"));
	for (const file of manifest.files) {
		if (
			`public${file.path}` !== `${dirname(path)}/${file.path.split("/").pop()}`
		)
			throw new Error(`Brand file escapes its version: ${file.path}`);
		const data = await readFile(`public${file.path}`);
		if (
			data.length !== file.bytes ||
			createHash("sha256").update(data).digest("hex") !== file.sha256
		)
			throw new Error(`Brand archive changed: ${file.path}`);
	}
}
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
