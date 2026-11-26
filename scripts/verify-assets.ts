import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { readProjects } from "../src/data/read-projects";
import socialCardsJson from "../src/data/social-cards.json" with {
	type: "json",
};
import { brandAsset, brandTextureAsset, rasterBrand } from "../src/model/brand";
import {
	brandManifestProblems,
	textureManifestProblems,
} from "../src/model/brand-manifest";
import { siteSocialImage } from "../src/model/discovery";
import { readInventory } from "./asset-storage";

const socialCards = socialCardsJson as {
	projects: Record<string, { path: string }>;
};

const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

const projects = readProjects();
for (const project of projects) {
	const statusEvidence = project.source.statusEvidence;
	if (statusEvidence) {
		const bytes = await readFile(statusEvidence.path);
		const evidence = JSON.parse(bytes.toString()) as {
			owner: string;
			repositories: { name: string; revision: string; archived: boolean }[];
		};
		const repository = evidence.repositories.find(
			(item) => item.name === project.repo,
		);
		if (
			sha(bytes) !== statusEvidence.sha256 ||
			project.repository !==
				`https://github.com/${evidence.owner}/${project.repo}` ||
			repository?.revision !== project.source.repositoryRevision ||
			repository?.archived !== project.archived
		)
			throw new Error(`Repository status evidence differs: ${project.id}`);
	}
	if (project.logo.original.endsWith(".svg")) {
		const original = await readFile(`public${project.logo.original}`);
		if (sha(original) !== project.logo.sha256)
			throw new Error(`Original SVG checksum changed: ${project.id}`);
	} else if (!/^[a-f0-9]{64}$/.test(project.logo.sha256)) {
		throw new Error(`Invalid recorded original SHA-256: ${project.id}`);
	}
	if (project.presentationIcon) {
		const icon = project.presentationIcon;
		const manifest = JSON.parse(
			await readFile(`public${icon.root}/manifest.json`, "utf8"),
		);
		const allowedTextures = [
			`${project.brandTexture?.root}/texture-light.png`,
			`${project.brandTexture?.root}/texture-light.jpg`,
		];
		const textureOk =
			manifest.texture.sourceMethod === "authored-family-background"
				? manifest.texture.path === `${project.family?.root}/background.png`
				: allowedTextures.includes(manifest.texture.path);
		if (
			manifest.project !== project.id ||
			manifest.version !== icon.version ||
			manifest.foreground.sha256 !== project.family?.foreground.sha256 ||
			!textureOk ||
			manifest.width !== icon.width ||
			manifest.height !== icon.height ||
			manifest.generationCalls !== 0 ||
			!manifest.inspection.opaqueForegroundRgbUnchanged
		)
			throw new Error(`Icon manifest disagrees with catalogue: ${project.id}`);
		for (const variant of ["icon", "rounded"] as const) {
			for (const size of [32, 64, 160, 256, 512, 1024]) {
				const meta = await sharp(
					`public${icon.root}/${variant}-${size}.webp`,
				).metadata();
				if (
					meta.format !== "webp" ||
					meta.width !== size ||
					meta.height !== size
				)
					throw new Error(
						`Incorrect icon WebP: ${project.id}/${variant}-${size}`,
					);
			}
		}
		const apple = await sharp(
			`public${icon.root}/apple-touch-icon.png`,
		).metadata();
		if (apple.width !== 180 || apple.height !== 180)
			throw new Error(`Incorrect apple-touch-icon: ${project.id}`);
	}
	if (project.brandTexture) {
		const texture = project.brandTexture;
		const manifest = JSON.parse(
			await readFile(`public${texture.root}/manifest.json`, "utf8"),
		);
		const problems = textureManifestProblems(manifest);
		const reference =
			project.logo.kind === "candidate"
				? manifest.reviewCandidate
				: manifest.officialProjectIdentity;
		if (
			problems.length ||
			manifest.project !== project.id ||
			manifest.version !== texture.version ||
			JSON.stringify(manifest.catalogue) !== JSON.stringify(texture) ||
			reference?.sha256 !== project.logo.sha256
		)
			throw new Error(
				`Texture manifest disagrees with catalogue: ${project.id}: ${problems.join("; ")}`,
			);
		for (const theme of ["light", "dark"] as const) {
			for (const [preview, size] of [
				[false, 1024],
				[true, 320],
			] as const) {
				const path = `public${brandTextureAsset(texture, theme, preview)}`;
				const meta = await sharp(path).metadata();
				if (
					meta.format !== "webp" ||
					meta.width !== size ||
					meta.height !== size
				)
					throw new Error(`Incorrect texture WebP: ${path}`);
			}
		}
	}
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
				? ["hero.webp", "hero-square.webp", "provenance.json"]
				: ["favicon.svg"]
			).map((name) => `${kit.root}/${name}`),
			...(kit.hero?.themed
				? ["hero-dark.webp", "hero-square-dark.webp"].map(
						(name) => `${kit.root}/${name}`,
					)
				: []),
			...[
				"favicon.ico",
				"apple-touch-icon.png",
				"guide.md",
				"license.txt",
				"space-grotesk-ofl.txt",
			].map((name) => `${kit.root}/${name}`),
		]) {
			if (!existsSync(`public${asset}`))
				throw new Error(`Missing brand CDN delivery: ${asset}`);
		}
	}
	for (const size of [32, 64, 160, 256, 512, 1024]) {
		const meta = await sharp(
			`public${project.logo.display.replace(/1024\.webp$/, `${size}.webp`)}`,
		).metadata();
		if (meta.width !== size || meta.height !== size)
			throw new Error(`Incorrect derivative dimensions: ${project.id}/${size}`);
	}
	const socialCard = socialCards.projects[project.id];
	if (!socialCard) throw new Error(`Missing social card: ${project.id}`);
	const socialPath = `public${socialCard.path}`;
	const social = await sharp(socialPath).metadata();
	if (
		social.format !== "jpeg" ||
		social.width !== 1200 ||
		social.height !== 630
	)
		throw new Error(`Incorrect social image: ${project.id}`);
	const socialBytes = await readFile(socialPath);
	if (socialBytes.byteLength > 400_000)
		throw new Error(`Social image too large: ${project.id}`);
	if (project.family) {
		const root = `public${project.family.root}`;
		for (const size of [32, 64, 160, 256, 512, 1024]) {
			const meta = await sharp(`${root}/icon-${size}.webp`).metadata();
			if (meta.width !== size || meta.height !== size)
				throw new Error(
					`Incorrect family icon dimensions: ${project.id}/${size}`,
				);
		}
		for (const name of [
			...(project.family.previous ? ["previous"] : []),
			"background",
			"transparent",
		]) {
			const meta = await sharp(`${root}/${name}-1024.webp`).metadata();
			if (meta.width !== 1024 || meta.height !== 1024)
				throw new Error(
					`Incorrect family preview dimensions: ${project.id}/${name}`,
				);
		}
	}
}
{
	const home = await sharp(`public${siteSocialImage}`).metadata();
	if (home.format !== "jpeg" || home.width !== 1200 || home.height !== 630)
		throw new Error("Incorrect home social image");
	if ((await readFile(`public${siteSocialImage}`)).byteLength > 400_000)
		throw new Error("Home social image too large");
}

const inventory = readInventory();
for (const file of inventory.files) {
	const data = await readFile(file.source);
	if (data.length !== file.bytes || sha(data) !== file.sha256)
		throw new Error(`CDN asset checksum mismatch: ${file.source}`);
}
console.info(
	`Verified ${projects.length} projects, ${projects.length * 6} display derivatives, all lean WebP icons/textures/brands, and ${inventory.files.length} CDN inventory entries.`,
);
