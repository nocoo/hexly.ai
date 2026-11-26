import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import type { Project } from "../src/model/project";

const BASE_COLOR = "#f0f0e9";
const TEXTURE_OPACITY = 0.7;
const ICON_SIZES = [32, 64, 160, 256, 512, 1024] as const;
const ICO_SIZES = [16, 32, 48, 64, 128, 256] as const;
const MASK_SVG_PATH =
	"artwork/icon-texture-review/2026-09-27/ios-style-mask.svg";

const sha = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");

function continuousCornerPath(): string {
	const radius = 223.7;
	const smoothing = 0.6;
	const p = radius * (1 + smoothing);
	const arcAngle = (Math.PI / 2) * (1 - smoothing);
	const arc = Math.sin(arcAngle / 2) * radius * Math.SQRT2;
	const beta = (Math.PI / 4) * smoothing;
	const c = radius * Math.tan(beta / 2) * Math.cos(beta);
	const d = c * Math.tan(beta);
	const b = (p - arc - c - d) / 3;
	const a = 2 * b;
	return `M ${1000 - p} 0 c ${a} 0 ${a + b} 0 ${a + b + c} ${d} a ${radius} ${radius} 0 0 1 ${arc} ${arc} c ${d} ${c} ${d} ${b + c} ${d} ${a + b + c} L 1000 ${1000 - p} c 0 ${a} 0 ${a + b} ${-d} ${a + b + c} a ${radius} ${radius} 0 0 1 ${-arc} ${arc} c ${-c} ${d} ${-b - c} ${d} ${-a - b - c} ${d} L ${p} 1000 c ${-a} 0 ${-a - b} 0 ${-a - b - c} ${-d} a ${radius} ${radius} 0 0 1 ${-arc} ${-arc} c ${-d} ${-c} ${-d} ${-b - c} ${-d} ${-a - b - c} L 0 ${p} c 0 ${-a} 0 ${-a - b} ${d} ${-a - b - c} a ${radius} ${radius} 0 0 1 ${arc} ${-arc} c ${c} ${-d} ${b + c} ${-d} ${a + b + c} ${-d} Z`
		.replace(/\s+/g, " ")
		.trim();
}

function encodeIco(frames: { size: number; png: Buffer }[]): Buffer {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(frames.length, 4);
	const directory = Buffer.alloc(16 * frames.length);
	let offset = header.length + directory.length;
	for (const [index, frame] of frames.entries()) {
		const at = index * 16;
		const dim = frame.size >= 256 ? 0 : frame.size;
		directory.writeUInt8(dim, at);
		directory.writeUInt8(dim, at + 1);
		directory.writeUInt8(0, at + 2);
		directory.writeUInt8(0, at + 3);
		directory.writeUInt16LE(1, at + 4);
		directory.writeUInt16LE(32, at + 6);
		directory.writeUInt32LE(frame.png.length, at + 8);
		directory.writeUInt32LE(offset, at + 12);
		offset += frame.png.length;
	}
	return Buffer.concat([
		header,
		directory,
		...frames.map((frame) => frame.png),
	]);
}

const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		project: { type: "string" },
		version: { type: "string" },
		foreground: { type: "string" },
		texture: { type: "string" },
		masterDir: { type: "string" },
	},
});

const projectId = values.project;
const version = values.version;
assert(projectId, "--project <id> is required");
assert(
	version && /^\d+\.\d+\.\d+$/.test(version),
	"--version X.Y.Z is required",
);

const project = JSON.parse(
	await readFile(`src/data/projects/${projectId}.json`, "utf8"),
) as Project;
assert(project.family, `Project ${projectId} requires project.family`);

const textureManifest = JSON.parse(
	await readFile(`public/textures/${projectId}/v1.0.0/manifest.json`, "utf8"),
) as {
	catalogue: { root: string };
	generations: {
		theme: string;
		source: string;
		raw: { path: string; sha256: string };
	}[];
};
const lightGen = textureManifest.generations.find((g) => g.theme === "light");
assert(lightGen, `Missing light texture generation for ${projectId}`);

const foregroundPath =
	values.foreground ??
	(existsSync(`public${project.family.foreground.original}`)
		? `public${project.family.foreground.original}`
		: `../${project.repo}/logo.png`);
const foreground = await readFile(foregroundPath);
assert.equal(
	sha(foreground),
	project.family.foreground.sha256,
	`Foreground SHA-256 mismatch at ${foregroundPath}`,
);
const fgMeta = await sharp(foreground).metadata();
const width = fgMeta.width ?? 0;
const height = fgMeta.height ?? 0;
assert(width > 0 && width === height, "Foreground must be square");
assert.equal(width, project.family.foreground.width);

const rawFilename = basename(lightGen.raw.path);
const textureInputPath =
	values.texture ??
	(existsSync(
		`${lightGen.source}/raw.${rawFilename.endsWith(".jpg") ? "jpg" : "png"}`,
	)
		? `${lightGen.source}/raw.${rawFilename.endsWith(".jpg") ? "jpg" : "png"}`
		: `public${lightGen.raw.path}`);
const textureBytes = await readFile(textureInputPath);
assert.equal(
	sha(textureBytes),
	lightGen.raw.sha256,
	`Light texture SHA-256 mismatch at ${textureInputPath}`,
);

const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1000 1000"><title>iOS-style continuous-corner mask</title><path d="${continuousCornerPath()}" fill="white"/></svg>\n`;
const mask = Buffer.from(maskSvg);
const maskPixels = await sharp(mask).ensureAlpha().raw().toBuffer();

const textureLayer = await sharp(textureBytes)
	.resize(width, height)
	.removeAlpha()
	.ensureAlpha(TEXTURE_OPACITY)
	.png()
	.toBuffer();

const squarePng = await sharp({
	create: { width, height, channels: 4, background: BASE_COLOR },
})
	.composite([{ input: textureLayer }, { input: foreground }])
	.png()
	.toBuffer();

const roundedPng = await sharp(squarePng)
	.composite([{ input: mask, blend: "dest-in" }])
	.png()
	.toBuffer();

const fgPixels = await sharp(foreground).ensureAlpha().raw().toBuffer();
const sqPixels = await sharp(squarePng).ensureAlpha().raw().toBuffer();
const rdPixels = await sharp(roundedPng).ensureAlpha().raw().toBuffer();

let opaquePixels = 0;
let foregroundPixelsAtOutline = 0;
for (let at = 0; at < fgPixels.length; at += 4) {
	if ((fgPixels[at + 3] ?? 0) > 0 && (maskPixels[at + 3] ?? 0) < 255)
		foregroundPixelsAtOutline++;
	if (fgPixels[at + 3] !== 255) continue;
	opaquePixels++;
	assert.ok(
		fgPixels.subarray(at, at + 3).equals(sqPixels.subarray(at, at + 3)),
		`${projectId}: changed square foreground RGB`,
	);
	if (maskPixels[at + 3] === 255) {
		assert.ok(
			fgPixels.subarray(at, at + 3).equals(rdPixels.subarray(at, at + 3)),
			`${projectId}: changed rounded foreground RGB`,
		);
	}
}

const root = `/icons/${projectId}/v${version}`;
const outDir = `public${root}`;
const masterDir =
	values.masterDir ?? `.wrangler/icon-masters/${projectId}/v${version}`;
await mkdir(outDir, { recursive: true });
await mkdir(masterDir, { recursive: true });

await writeFile(join(masterDir, "icon.png"), squarePng);
await writeFile(join(masterDir, "rounded.png"), roundedPng);

const recordedFiles: { path: string; bytes: number; sha256: string }[] = [
	{ path: `${root}/icon.png`, bytes: squarePng.length, sha256: sha(squarePng) },
	{
		path: `${root}/rounded.png`,
		bytes: roundedPng.length,
		sha256: sha(roundedPng),
	},
];

for (const size of ICON_SIZES) {
	for (const [variant, src] of [
		["icon", squarePng],
		["rounded", roundedPng],
	] as const) {
		const filename = `${variant}-${size}.webp`;
		const buf = await sharp(src)
			.resize(size, size)
			.webp({ quality: 90, effort: 6 })
			.toBuffer();
		await writeFile(join(outDir, filename), buf);
		recordedFiles.push({
			path: `${root}/${filename}`,
			bytes: buf.length,
			sha256: sha(buf),
		});
	}
}

const appleBuf = await sharp(squarePng)
	.resize(180, 180)
	.flatten({ background: BASE_COLOR })
	.png()
	.toBuffer();
await writeFile(join(outDir, "apple-touch-icon.png"), appleBuf);
recordedFiles.push({
	path: `${root}/apple-touch-icon.png`,
	bytes: appleBuf.length,
	sha256: sha(appleBuf),
});

const icoFrames: { size: number; png: Buffer }[] = [];
for (const size of ICO_SIZES) {
	const png = await sharp(roundedPng).resize(size, size).png().toBuffer();
	icoFrames.push({ size, png });
}
const icoBuf = encodeIco(icoFrames);
await writeFile(join(outDir, "favicon.ico"), icoBuf);
recordedFiles.push({
	path: `${root}/favicon.ico`,
	bytes: icoBuf.length,
	sha256: sha(icoBuf),
});

const referenceMaskSha = existsSync(MASK_SVG_PATH)
	? sha(await readFile(MASK_SVG_PATH))
	: sha(mask);

const provenanceObj = {
	schemaVersion: 1,
	project: projectId,
	version,
	scope: "hexly-campaign",
	generationCalls: 0,
	foreground: {
		subject: project.family.foreground.subject,
		original: project.family.foreground.original,
		display: project.family.foreground.display,
		width,
		height,
		sha256: project.family.foreground.sha256,
		transform: "none; native canvas, original position, normal alpha over",
	},
	texture: {
		path: lightGen.raw.path,
		sha256: lightGen.raw.sha256,
		originalWidth: 1024,
		placementWidth: width,
		opacity: TEXTURE_OPACITY,
	},
	baseColor: BASE_COLOR,
	bannerGradient: false,
	shadow: false,
	mask: {
		path: MASK_SVG_PATH,
		sha256: referenceMaskSha,
		kind: "iOS-style continuous-corner approximation",
		radiusRatio: 0.2237,
		cornerSmoothing: 0.6,
		officialAppleAsset: false,
		geometryReference:
			"https://www.figma.com/blog/desperately-seeking-squircles/",
		implementationReference:
			"https://github.com/phamfoo/figma-squircle/blob/main/src/draw.ts",
	},
	width,
	height,
	upscaledExportSizes: [],
	rights: {
		identity: project.logo.sourceUrl,
		family: project.family.archive,
		texture: `${textureManifest.catalogue.root}/license.txt`,
	},
	inspection: {
		opaquePixels,
		foregroundPixelsAtOutline,
		opaqueForegroundRgbUnchanged: true,
	},
};

const guideText = `# ${project.title} textured icons

Approved Hexly presentation, composed without image generation. Native artwork: ${width} × ${height}. Original foreground colors and position are preserved.

Use rounded WebP exports directly in site navigation and project cards, without an additional CSS mask, background or shadow. The continuous corners approximate iOS styling and are not an official Apple mask.

Use icon-1024.webp / apple-touch-icon.png for square platform surfaces and favicon.ico (16, 32, 48, 64, 128 and 256 px PNG frames) for browser tabs. Native PNG masters are archived in cold storage; smaller CDN WebPs are resampled directly from the native master.

Original identity and historical brand downloads retain their own provenance. Source-product adoption is a separate operation. Rights follow provenance.json and the referenced source/texture licenses.
`;

const provBuf = Buffer.from(`${JSON.stringify(provenanceObj, null, "\t")}\n`);
const guideBuf = Buffer.from(guideText);
await writeFile(join(outDir, "provenance.json"), provBuf);
await writeFile(join(outDir, "guide.md"), guideBuf);
recordedFiles.push(
	{
		path: `${root}/provenance.json`,
		bytes: provBuf.length,
		sha256: sha(provBuf),
	},
	{
		path: `${root}/guide.md`,
		bytes: guideBuf.length,
		sha256: sha(guideBuf),
	},
);

const manifestObj = {
	...provenanceObj,
	root,
	files: recordedFiles,
};
await writeFile(
	join(outDir, "manifest.json"),
	`${JSON.stringify(manifestObj, null, "\t")}\n`,
);
console.info(
	`Built textured icon ${projectId} v${version}: ${opaquePixels.toLocaleString()} opaque foreground px preserved (${foregroundPixelsAtOutline.toLocaleString()} at mask outline); masters saved at ${masterDir}.`,
);
