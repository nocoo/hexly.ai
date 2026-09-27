import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const directory = fileURLToPath(new URL(".", import.meta.url));
const groups = [
	{ name: "动物", en: "Animals", ids: ["frogie", "bogo", "ocelot"] },
	{ name: "鸟类", en: "Birds", ids: ["falcon", "owl", "rio"] },
	{ name: "拟物", en: "Objects", ids: ["coffee", "matrix", "pi-agent-policy"] },
];
const width = 2048;
const textureOpacity = 0.7;
const baseColor = "#f0f0e9";
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");

function continuousCornerPath() {
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
	return `M ${1000 - p} 0
		c ${a} 0 ${a + b} 0 ${a + b + c} ${d}
		a ${radius} ${radius} 0 0 1 ${arc} ${arc}
		c ${d} ${c} ${d} ${b + c} ${d} ${a + b + c}
		L 1000 ${1000 - p}
		c 0 ${a} 0 ${a + b} ${-d} ${a + b + c}
		a ${radius} ${radius} 0 0 1 ${-arc} ${arc}
		c ${-c} ${d} ${-b - c} ${d} ${-a - b - c} ${d}
		L ${p} 1000
		c ${-a} 0 ${-a - b} 0 ${-a - b - c} ${-d}
		a ${radius} ${radius} 0 0 1 ${-arc} ${-arc}
		c ${-d} ${-c} ${-d} ${-b - c} ${-d} ${-a - b - c}
		L 0 ${p}
		c 0 ${-a} 0 ${-a - b} ${d} ${-a - b - c}
		a ${radius} ${radius} 0 0 1 ${arc} ${-arc}
		c ${c} ${-d} ${b + c} ${-d} ${a + b + c} ${-d} Z`
		.replace(/\s+/g, " ")
		.trim();
}

const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}" viewBox="0 0 1000 1000"><title>iOS-style continuous-corner mask</title><path d="${continuousCornerPath()}" fill="white"/></svg>\n`;
const mask = Buffer.from(maskSvg);
const maskPixels = await sharp(mask).ensureAlpha().raw().toBuffer();
await mkdir(`${directory}images`, { recursive: true });
await writeFile(`${directory}ios-style-mask.svg`, mask);
const records = [];

for (const group of groups) {
	for (const id of group.ids) {
		const project = JSON.parse(
			await readFile(`src/data/projects/${id}.json`, "utf8"),
		);
		assert.equal(project.archived, false);
		const foregroundPath = `public${project.family.foreground.original}`;
		const texturePath = `public${project.brandTexture.root}/texture-light.png`;
		const oldPath = `public${project.family.root}/rounded.png`;
		const foreground = await readFile(foregroundPath);
		const texture = await readFile(texturePath);
		const old = await readFile(oldPath);
		assert.equal(hash(foreground), project.family.foreground.sha256);
		const metadata = await sharp(foreground).metadata();
		assert.equal(metadata.width, width);
		assert.equal(metadata.height, width);
		const textureLayer = await sharp(texture)
			.resize(width, width)
			.removeAlpha()
			.ensureAlpha(textureOpacity)
			.png()
			.toBuffer();
		const square = await sharp({
			create: { width, height: width, channels: 4, background: baseColor },
		})
			.composite([{ input: textureLayer }, { input: foreground }])
			.png()
			.toBuffer();
		const rounded = await sharp(square)
			.composite([{ input: mask, blend: "dest-in" }])
			.png()
			.toBuffer();
		const originalPixels = await sharp(foreground)
			.ensureAlpha()
			.raw()
			.toBuffer();
		const squarePixels = await sharp(square).ensureAlpha().raw().toBuffer();
		const roundedPixels = await sharp(rounded).ensureAlpha().raw().toBuffer();
		let opaquePixels = 0;
		let opaquePixelsInsideMask = 0;
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
				`${id}: changed foreground RGB`,
			);
			if (maskPixels[at + 3] !== 255) continue;
			opaquePixelsInsideMask++;
			assert.ok(
				originalPixels
					.subarray(at, at + 3)
					.equals(roundedPixels.subarray(at, at + 3)),
				`${id}: changed masked foreground RGB`,
			);
		}
		await writeFile(`${directory}images/${id}-square.png`, square);
		await writeFile(`${directory}images/${id}-rounded.png`, rounded);
		for (const [variant, buffer] of [
			["before", old],
			["after", rounded],
		]) {
			await sharp(buffer)
				.resize(512, 512)
				.webp({ lossless: true })
				.toFile(`${directory}images/${id}-${variant}.webp`);
		}
		records.push({
			id,
			title: project.title,
			group: group.name,
			groupEnglish: group.en,
			textureName: project.brandTexture.name.zh,
			foreground: {
				path: foregroundPath,
				sha256: hash(foreground),
				width,
				height: width,
			},
			texture: {
				path: texturePath,
				sha256: hash(texture),
				nativeWidth: 1024,
				placementWidth: width,
				opacity: textureOpacity,
			},
			previousPresentation: { path: oldPath, sha256: hash(old) },
			outputs: {
				square: { path: `images/${id}-square.png`, sha256: hash(square) },
				rounded: { path: `images/${id}-rounded.png`, sha256: hash(rounded) },
			},
			inspection: {
				opaquePixels,
				opaquePixelsInsideMask,
				foregroundPixelsAtOutline,
				opaqueForegroundRgbUnchanged: true,
				sourceBytesUnchanged: true,
				foregroundScale: 1,
				foregroundOffset: [0, 0],
			},
		});
		console.log(
			`${id}: ${opaquePixels.toLocaleString()} opaque foreground pixels preserved; ${foregroundPixelsAtOutline.toLocaleString()} pixels meet the presentation outline.`,
		);
	}
}

await writeFile(
	`${directory}manifest.json`,
	`${JSON.stringify(
		{
			status: "local composition review; not adopted",
			generationCalls: 0,
			ownerInstruction: "你每个系列各找3个合成一个html我看看效果",
			recipe: {
				baseColor,
				textureOpacity,
				foregroundBlend: "normal alpha over",
				foregroundTransform: "none",
				bannerGradient: false,
				nativeOutputSize: width,
				previewSize: 512,
				previewEncoding: "lossless WebP",
			},
			mask: {
				path: "ios-style-mask.svg",
				sha256: hash(mask),
				kind: "iOS-style continuous-corner approximation",
				radiusRatio: 0.2237,
				cornerSmoothing: 0.6,
				officialAppleAsset: false,
				geometryReference:
					"https://www.figma.com/blog/desperately-seeking-squircles/",
				implementationReference:
					"https://github.com/phamfoo/figma-squircle/blob/main/src/draw.ts",
			},
			projects: records,
		},
		null,
		"\t",
	)}\n`,
);
