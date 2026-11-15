import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

const study = "artwork/logo-family/hexly-ai/2026-11-13-02";
const root = "/logos/family/hexly-ai/2026-11-13-02/02";
const iconRoot = "/icons/hexly-ai/v1.0.4";
const sourceRevision = "c89ba6d1534a8df5028c28087c98c82aebbf6c68";
const sourceUrl = `https://github.com/nocoo/hexly.ai/blob/${sourceRevision}/${study}/finishing/02/manifest.json`;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => `${JSON.stringify(value, null, "\t")}\n`;
const selected = JSON.parse(await readFile(`${study}/selection.json`, "utf8"));
const previous = JSON.parse(
	execFileSync(
		"git",
		["show", `${sourceRevision}:src/data/projects/hexly-ai.json`],
		{ encoding: "utf8" },
	),
);
const projectPath = "src/data/projects/hexly-ai.json";
const project = JSON.parse(await readFile(projectPath, "utf8"));
const nativePath = `${study}/finishing/02/exports/hexly-ai-transparent-2048.png`;
const native = await readFile(nativePath);
assert.equal(hash(native), selected.transparentSha256);
const existing = hash(await readFile("logo.png"));
assert.ok(
	[previous.logo.sha256, selected.transparentSha256].includes(existing),
);
const save = async (path, bytes) => {
	await mkdir(dirname(path), { recursive: true });
	try {
		await writeFile(path, bytes, { flag: "wx" });
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		assert.ok(
			(await readFile(path)).equals(Buffer.from(bytes)),
			`Immutable asset differs: ${path}`,
		);
	}
};
const { data, info } = await sharp(native)
	.ensureAlpha()
	.raw()
	.toBuffer({ resolveWithObject: true });
assert.equal(info.width, 2048);
assert.equal(info.height, 2048);
const samples = [
	["Cream frame", "奶油色外框", 1700, 1000],
	["Sand-beige insert", "米色内片", 600, 750],
	["Brick-red insert", "砖红色内片", 1400, 900],
].map(([en, zh, x, y], index) => {
	const at = (y * info.width + x) * 4;
	assert.equal(data[at + 3], 255);
	return {
		color: `#${data.subarray(at, at + 3).toString("hex")}`,
		role: index === 2 ? "primary" : "accent",
		label: { en, zh },
		source: `Approved transparent master ${selected.transparentSha256}, native sRGB pixel (${x}, ${y}); ${study}/palette.json`,
	};
});
await save(
	`${study}/palette.json`,
	json({ source: nativePath, sha256: selected.transparentSha256, samples }),
);
const original = "/logos/originals/hexly-ai-family-2026-11-13-02-02.png";
await save(`public${original}`, native);
await writeFile("logo.png", native);
project.subject = "Two-tone cream-framed hexagonal emblem";
project.logo = {
	kind: "original",
	original,
	thumbnail: "/logos/display/hexly-ai-family-2026-11-13-02-160.webp",
	display: "/logos/display/hexly-ai-family-2026-11-13-02-1024.webp",
	sourcePath: "logo.png",
	sourceUrl,
	modified: false,
	width: 2048,
	height: 2048,
	bytes: native.length,
	sha256: selected.transparentSha256,
};
project.family = {
	id: "2026-11-13-02",
	status: "adopted",
	updated: "2026-11-15",
	finishing: "02",
	root,
	archive: study,
	series: "material",
	rawFile: "raw.png",
	foreground: {
		subject: {
			en: project.subject,
			zh: "奶油色外框与米色、砖红色内片构成的六边形标志",
		},
		original: `${root}/transparent.png`,
		display: `${root}/transparent-1024.webp`,
		width: 2048,
		height: 2048,
		sha256: selected.transparentSha256,
	},
	previous: {
		original: previous.logo.original,
		sourceUrl: previous.logo.sourceUrl,
		width: previous.logo.width,
		height: previous.logo.height,
		sha256: previous.logo.sha256,
	},
	direction: [
		{
			aspect: "composition",
			title: { en: "Approved complete silhouette", zh: "保留已选定的完整轮廓" },
			description: {
				en: "A rounded cream frame encloses sand-beige and brick-red inserts with deliberate open channels. Native placement and proportions are unchanged.",
				zh: "圆润奶油色外框包围米色与砖红色内片，保留开口、原始位置和比例。",
			},
		},
		{
			aspect: "drawing",
			title: { en: "Original material and color", zh: "保留原有材质与颜色" },
			description: {
				en: "The approved 2048px transparent master retains the original opaque RGB values and inspected cutout edges.",
				zh: "已批准的 2048px 透明原图保留全部不透明像素颜色与校验过的边缘。",
			},
		},
		{
			aspect: "presentation",
			title: { en: "Shadow-free identity", zh: "无外部阴影的标志" },
			description: {
				en: "Headers and browser marks use the transparent foreground without glow or another mask. Existing neutral square and rounded derivatives serve large and platform presentations.",
				zh: "页头与浏览器标志使用透明前景，不加光晕或额外遮罩；大图和平台展示使用已有纯底方形与圆角版本。",
			},
		},
	],
	palette: [
		{
			color: "#ffffff",
			role: "background",
			label: { en: "Neutral white presentation", zh: "纯白展示底" },
			source: `${study}/finishing/02/settings.json background.base`,
		},
		...samples,
	],
	sizeNote: {
		en: "At 16/24px the two-tone silhouette remains; fine material shading softens. The full canvas is resized without cropping.",
		zh: "16/24px 保留双色轮廓，细微材质会柔化；始终缩放完整画布，不裁剪。",
	},
};
project.colors.palette = samples;
project.presentationIcon = {
	root: iconRoot,
	version: "1.0.4",
	width: 2048,
	height: 2048,
};
await writeFile(projectPath, json(project));
execFileSync("bun", ["scripts/generate-assets.ts", "--project", "hexly-ai"], {
	stdio: "inherit",
});
for (const kind of ["transparent", "icon", "rounded"])
	for (const size of [2048, 1024, 512, 256, 128, 64, 48, 32, 24, 16])
		await save(
			`public${root}/${kind}-${size}.png`,
			await readFile(
				`${study}/finishing/02/exports/hexly-ai-${kind}-${size}.png`,
			),
		);
const square = await readFile(`public${root}/icon.png`);
const rounded = await readFile(`public${root}/rounded.png`);
assert.equal((await sharp(square).stats()).isOpaque, true);
const opaque = await sharp(square).ensureAlpha().raw().toBuffer();
let preservedPixels = 0;
for (let at = 0; at < data.length; at += 4) {
	if (data[at + 3] !== 255) continue;
	assert.ok(data.subarray(at, at + 3).equals(opaque.subarray(at, at + 3)));
	preservedPixels++;
}
const iconFiles = [];
const icon = async (name, bytes) => {
	await save(`public${iconRoot}/${name}`, bytes);
	iconFiles.push({
		path: `${iconRoot}/${name}`,
		bytes: bytes.length,
		sha256: hash(bytes),
	});
};
await icon("icon.png", square);
await icon("rounded.png", rounded);
for (const [kind, bytes] of [
	["icon", square],
	["rounded", rounded],
])
	for (const size of [32, 64, 160, 256, 512, 1024])
		await icon(
			`${kind}-${size}.webp`,
			await sharp(bytes).resize(size).webp({ lossless: true }).toBuffer(),
		);
await icon("icon-1024.png", await sharp(square).resize(1024).png().toBuffer());
await icon(
	"apple-touch-icon.png",
	await sharp(square).resize(180).png().toBuffer(),
);
const sizes = [16, 32, 48, 64, 128, 256];
const frames = await Promise.all(
	sizes.map((size) => sharp(native).resize(size).png().toBuffer()),
);
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (const [index, frame] of frames.entries()) {
	const at = 6 + index * 16;
	header[at] = header[at + 1] = sizes[index] % 256;
	header.writeUInt16LE(1, at + 4);
	header.writeUInt16LE(32, at + 6);
	header.writeUInt32LE(frame.length, at + 8);
	header.writeUInt32LE(offset, at + 12);
	offset += frame.length;
}
await icon("favicon.ico", Buffer.concat([header, ...frames]));
const provenance = {
	schemaVersion: 1,
	project: "hexly-ai",
	version: "1.0.4",
	scope: "hexly-campaign",
	generationCalls: 0,
	source: root,
	study,
	finishing: "02",
	foreground: project.family.foreground,
	texture: {
		path: `${root}/background.png`,
		sha256: hash(await readFile(`public${root}/background.png`)),
		sourceMethod: "authored-family-background",
	},
	width: 2048,
	height: 2048,
	upscaledExportSizes: [],
	inspection: {
		opaquePixels: preservedPixels,
		opaqueForegroundRgbUnchanged: true,
		nativeMastersCopiedByteForByte: true,
	},
	publication:
		"Owner authorized replacement, R2 publication and push on 2026-11-15; completed publication receipts are stored separately.",
};
await icon("provenance.json", Buffer.from(json(provenance)));
await icon(
	"guide.md",
	Buffer.from(
		"# Hexly identity presentations\n\nThe exact selected 2026-11-13-02 / 02 masters remain unchanged. Transparent marks serve headers and browser favicons without another mask, shadow or glow. Neutral square and rounded masters are copied from the frozen finishing pass. Opaque iOS and Apple touch files use platform masking. The six-entry ICO uses transparent foregrounds. Every resize preserves the complete source canvas.\n\nThe prior v1.0.2 package remains immutable. Publication is established by docs/assets/publication.jsonl, not by this guide.\n",
	),
);
await icon(
	"manifest.json",
	Buffer.from(json({ ...provenance, root: iconRoot, files: [...iconFiles] })),
);
const videoPath = "/video-kit/1.2.0/hexly/mark.png";
const videoSource = `${study}/finishing/02/exports/hexly-ai-transparent-1024.png`;
const video = await readFile(videoSource);
await save(`packages/video-kit/public${videoPath}`, video);
await writeFile(
	"packages/video-kit/current-identity.json",
	json({
		path: videoPath,
		width: 1024,
		height: 1024,
		sha256: hash(video),
		source: videoSource,
		sourceRevision,
		status:
			"Current source identity; publication receipts in docs/assets/publication.jsonl",
		history:
			"Previous identity assets, font provenance and all five published standard outro movies remain immutable.",
	}),
);
await writeFile(
	`${study}/adoption.json`,
	json({
		status: "installed-locally",
		decisionDate: "2026-11-15",
		decisionSource: "owner: 把新的替换旧的，再push",
		study,
		finishing: "02",
		sourceRevision,
		sourceUrl,
		master: {
			path: nativePath,
			sha256: hash(native),
			width: 2048,
			height: 2048,
		},
		previous: project.family.previous,
		canonicalCopy: "logo.png",
		familyRoot: root,
		presentationRoot: iconRoot,
		videoKit: videoPath,
		inspection: {
			opaquePixels: preservedPixels,
			opaqueForegroundRgbUnchanged: true,
			nativeMasterCopiedByteForByte: true,
		},
		publication: "pending scoped R2 verification and Git publication",
		pageArtwork: "paused; not part of this identity rollout",
	}),
);
console.info(
	`Installed the exact selected master; ${preservedPixels} opaque presentation pixels are unchanged.`,
);
