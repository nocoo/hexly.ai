import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const batch = "artwork/icon-texture-rollout/2026-09-27";
const evidence = "docs/icon-texture-rollout/2026-10-10-zoo";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const mask = await readFile(`${batch}/ios-style-mask.svg`);
const pilot = JSON.parse(
	await readFile(
		"artwork/icon-texture-review/2026-09-27/manifest.json",
		"utf8",
	),
);
const pngOptions = { compressionLevel: 9, adaptiveFiltering: true };
const records = [];
await mkdir(evidence, { recursive: true });

async function compose(id) {
	const profile = `src/data/projects/${id}.json`;
	const project = JSON.parse(await readFile(profile, "utf8"));
	if (project.archived) return;
	const root = `/icons/${id}/v1.0.0`;
	const output = `public${root}`;
	if (existsSync(`${output}/manifest.json`)) {
		records.push(JSON.parse(await readFile(`${output}/manifest.json`, "utf8")));
		return;
	}
	const source = project.family.foreground;
	const foreground = await readFile(`public${source.original}`);
	const texturePath = `${project.brandTexture.root}/texture-light.png`;
	const texture = await readFile(`public${texturePath}`);
	assert.equal(hash(foreground), source.sha256);
	const { width, height } = await sharp(foreground).metadata();
	assert.equal(width, source.width);
	assert.equal(height, width);
	const textureLayer = await sharp(texture)
		.resize(width, height)
		.removeAlpha()
		.ensureAlpha(0.7)
		.png()
		.toBuffer();
	const square = await sharp({
		create: { width, height, channels: 4, background: "#f0f0e9" },
	})
		.composite([{ input: textureLayer }, { input: foreground }])
		.png(pngOptions)
		.toBuffer();
	const sizedMask = await sharp(mask).resize(width, height).png().toBuffer();
	const rounded = await sharp(square)
		.composite([{ input: sizedMask, blend: "dest-in" }])
		.png(pngOptions)
		.toBuffer();
	const originalPixels = await sharp(foreground).ensureAlpha().raw().toBuffer();
	const squarePixels = await sharp(square).ensureAlpha().raw().toBuffer();
	const roundedPixels = await sharp(rounded).ensureAlpha().raw().toBuffer();
	const maskPixels = await sharp(sizedMask).ensureAlpha().raw().toBuffer();
	let opaquePixels = 0;
	let foregroundPixelsAtOutline = 0;
	for (let at = 0; at < originalPixels.length; at += 4) {
		if (originalPixels[at + 3] > 0 && maskPixels[at + 3] < 255)
			foregroundPixelsAtOutline++;
		if (originalPixels[at + 3] !== 255) continue;
		opaquePixels++;
		assert.ok(
			originalPixels
				.subarray(at, at + 3)
				.equals(squarePixels.subarray(at, at + 3)),
			`${id}: foreground RGB changed`,
		);
		if (maskPixels[at + 3] === 255)
			assert.ok(
				originalPixels
					.subarray(at, at + 3)
					.equals(roundedPixels.subarray(at, at + 3)),
				`${id}: rounded RGB changed`,
			);
	}
	assert.ok(opaquePixels > 0 && opaquePixels < width * height);
	const approved = pilot.projects.find((p) => p.id === id);
	if (approved) {
		assert.equal(hash(texture), approved.texture.sha256);
		for (const [name, pixels] of [
			["square", squarePixels],
			["rounded", roundedPixels],
		]) {
			const reference = await sharp(
				`artwork/icon-texture-review/2026-09-27/${approved.outputs[name].path}`,
			)
				.ensureAlpha()
				.raw()
				.toBuffer();
			assert.ok(
				reference.equals(pixels),
				`${id}: differs from approved ${name}`,
			);
		}
	}
	await mkdir(output, { recursive: true });
	const files = [];
	const save = async (name, bytes) => {
		await writeFile(`${output}/${name}`, bytes);
		files.push({
			path: `${root}/${name}`,
			bytes: bytes.length,
			sha256: hash(bytes),
		});
	};
	await save(
		"icon.png",
		await sharp(square).removeAlpha().png(pngOptions).toBuffer(),
	);
	await save("rounded.png", rounded);
	for (const size of [32, 64, 160, 256, 512, 1024]) {
		await save(
			`rounded-${size}.webp`,
			await sharp(rounded)
				.resize(size, size)
				.webp({ lossless: true })
				.toBuffer(),
		);
		await save(
			`icon-${size}.webp`,
			await sharp(square)
				.resize(size, size)
				.removeAlpha()
				.webp({ lossless: true })
				.toBuffer(),
		);
	}
	await save(
		"icon-1024.png",
		await sharp(square)
			.resize(1024, 1024)
			.removeAlpha()
			.png(pngOptions)
			.toBuffer(),
	);
	await save(
		"apple-touch-icon.png",
		await sharp(square)
			.resize(180, 180)
			.removeAlpha()
			.png(pngOptions)
			.toBuffer(),
	);
	const sizes = [16, 32, 48, 64, 128, 256];
	const pngs = [];
	for (const size of sizes) {
		const bytes = await sharp(rounded)
			.resize(size, size)
			.png(pngOptions)
			.toBuffer();
		pngs.push(bytes);
		await save(`rounded-${size}.png`, bytes);
	}
	const header = Buffer.alloc(6 + sizes.length * 16);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(sizes.length, 4);
	let offset = header.length;
	for (const [i, bytes] of pngs.entries()) {
		const entry = 6 + i * 16;
		header[entry] = header[entry + 1] = sizes[i] === 256 ? 0 : sizes[i];
		header.writeUInt16LE(1, entry + 4);
		header.writeUInt16LE(32, entry + 6);
		header.writeUInt32LE(bytes.length, entry + 8);
		header.writeUInt32LE(offset, entry + 12);
		offset += bytes.length;
	}
	await save("favicon.ico", Buffer.concat([header, ...pngs]));
	const provenance = {
		schemaVersion: 1,
		project: id,
		version: "1.0.0",
		scope: "hexly-campaign",
		generationCalls: 0,
		approval: "docs/icon-texture-rollout/2026-09-27/authorization.json",
		foreground: {
			...source,
			transform: "none; native canvas, original position, normal alpha over",
		},
		texture: {
			path: texturePath,
			sha256: hash(texture),
			originalWidth: 1024,
			placementWidth: width,
			opacity: 0.7,
		},
		baseColor: "#f0f0e9",
		bannerGradient: false,
		shadow: false,
		mask: {
			...pilot.mask,
			path: `${batch}/ios-style-mask.svg`,
			sha256: hash(mask),
		},
		width,
		height,
		upscaledExportSizes: width < 1024 ? [1024] : [],
		rights: {
			identity: project.logo.sourceUrl,
			family: project.family.archive,
			texture: `${project.brandTexture.root}/license.txt`,
		},
		inspection: {
			opaquePixels,
			foregroundPixelsAtOutline,
			opaqueForegroundRgbUnchanged: true,
			approvedPilotPixelsMatch: !!approved,
		},
	};
	await save(
		"provenance.json",
		Buffer.from(`${JSON.stringify(provenance, null, "\t")}\n`),
	);
	await save(
		"guide.md",
		Buffer.from(
			`# ${project.title} textured icons\n\nApproved Hexly presentation, composed without image generation. Native artwork: ${width} × ${height}. Original foreground colors and position are preserved.\n\nUse rounded WebP/PNG exports directly in site navigation and project cards, without an additional CSS mask, background or shadow. The continuous corners match the approved nine-project study; they approximate iOS styling and are not an official Apple mask.\n\nUse icon-1024.png for iOS app delivery and apple-touch-icon.png for touch bookmarks; both are opaque square exports for the platform to mask. favicon.ico contains 16, 32, 48, 64, 128 and 256 px PNG frames. icon.png and rounded.png retain the native canvas. ${width < 1024 ? "1024 px exports are documented upscales, not new detail." : "Smaller exports are resampled from the native master."}\n\nOriginal identity and historical brand downloads retain their own provenance. Source-product adoption is a separate operation. Rights follow provenance.json and the referenced source/texture licenses.\n`,
		),
	);
	const manifest = { ...provenance, root, files };
	await writeFile(
		`${output}/manifest.json`,
		`${JSON.stringify(manifest, null, "\t")}\n`,
	);
	project.presentationIcon = { version: "1.0.0", root, width, height };
	await writeFile(profile, `${JSON.stringify(project, null, "\t")}\n`);
	records.push(manifest);
	console.log(
		`${id}: ${width}px, ${opaquePixels} opaque pixels unchanged, ${foregroundPixelsAtOutline} outline intersections`,
	);
}
const ids = ["zoo"];
for (let at = 0; at < ids.length; at += 3)
	await Promise.all(ids.slice(at, at + 3).map(compose));
records.sort((a, b) => ids.indexOf(a.project) - ids.indexOf(b.project));
await writeFile(
	`${evidence}/composition.json`,
	`${JSON.stringify({ projects: records }, null, "\t")}\n`,
);
