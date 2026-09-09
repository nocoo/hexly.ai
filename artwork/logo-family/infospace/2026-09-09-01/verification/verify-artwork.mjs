import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const study = path.resolve(import.meta.dirname, "..");
const finishing = path.join(study, "finishing/01");
const rawBytes = await readFile(path.join(study, "raw/generated.png"));
const sourceSha256 = createHash("sha256").update(rawBytes).digest("hex");
const response = JSON.parse(
	await readFile(path.join(study, "response.json"), "utf8"),
);
assert.equal(sourceSha256, response.output.sha256);
const native = await sharp(rawBytes)
	.removeAlpha()
	.toColourspace("srgb")
	.raw()
	.toBuffer();
const foreground = await sharp(
	path.join(finishing, "exports/infospace-transparent-2048.png"),
)
	.ensureAlpha()
	.raw()
	.toBuffer();
let opaquePixels = 0;
let changedOpaquePixels = 0;
let nontransparentBorderPixels = 0;
for (let index = 0; index < 2048 * 2048; index++) {
	const x = index % 2048;
	const y = Math.floor(index / 2048);
	const alpha = foreground[index * 4 + 3];
	if ((x === 0 || y === 0 || x === 2047 || y === 2047) && alpha > 0)
		nontransparentBorderPixels++;
	if (alpha !== 255) continue;
	opaquePixels++;
	for (let channel = 0; channel < 3; channel++) {
		if (foreground[index * 4 + channel] !== native[index * 3 + channel]) {
			changedOpaquePixels++;
			break;
		}
	}
}
assert.equal(changedOpaquePixels, 0);
assert.equal(nontransparentBorderPixels, 0);
const samples = [
	["Indigo metal", "靛蓝金属", "primary", 1040, 1540],
	["Brushed nickel", "拉丝镍色", "accent", 1265, 810],
	["Indigo card", "靛蓝纸卡", "accent", 700, 700],
	["Sea-green card", "海绿纸卡", "accent", 1420, 650],
	["Terracotta card", "陶土色纸卡", "accent", 760, 1050],
	["Lilac card", "浅紫纸卡", "accent", 1450, 1100],
].map(([en, zh, role, x, y]) => {
	const index = y * 2048 + x;
	assert.equal(foreground[index * 4 + 3], 255);
	const rgb = Array.from(native.subarray(index * 3, index * 3 + 3));
	return {
		label: { en, zh },
		role,
		color: `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("")}`,
		pixel: [x, y],
		rgb,
		sourceSha256,
	};
});
const recipe = JSON.parse(
	await readFile(path.join(study, "presentation.json"), "utf8"),
);
const palette = {
	source: {
		path: "raw/generated.png",
		sha256: sourceSha256,
		width: 2048,
		height: 2048,
		colorSpace: "sRGB",
		sampling:
			"Exact native opaque pixels by visible material role; alpha and RGB equality verified against the finished transparent master.",
	},
	artwork: samples,
	presentation: {
		base: recipe.background.base,
		light: recipe.background.light,
		shade: recipe.background.shade,
		motif: recipe.background.motif,
		pattern: recipe.background.pattern.name,
		status:
			"Selected finishing 01 under the owner's complete adoption instruction; publication is tracked separately.",
	},
	application: {
		primary: "#ffffff",
		background: "#13161c",
		ink: "#ffffff",
		source:
			"Sources/InfoSpaceUI/InfoSpaceStyle.swift: InfoSpaceTheme.dark, selected by App/WorkspaceView.swift",
		status:
			"Existing native demo theme; no project website is configured. These tokens are independent of the artwork palette.",
	},
};
await writeFile(
	path.join(study, "palette.json"),
	`${JSON.stringify(palette, null, "\t")}\n`,
);
const edgeSamples = [
	[1690, 1550],
	[1700, 1550],
	[1500, 1690],
	[1500, 1696],
	[1500, 1700],
].map(([x, y]) => ({
	pixel: [x, y],
	alpha: foreground[(y * 2048 + x) * 4 + 3],
}));
assert.equal(edgeSamples[0].alpha, 255);
assert.equal(edgeSamples[1].alpha, 255);
assert.equal(edgeSamples[3].alpha, 0);
assert.equal(edgeSamples[4].alpha, 0);
const manifest = JSON.parse(
	await readFile(path.join(finishing, "manifest.json"), "utf8"),
);
assert.equal(manifest.placement.scale, 1);
assert.equal(manifest.placement.clippedPixels, 0);
assert(manifest.placement.minimumRoundedEdgeClearance >= 128);
const exports = [];
for (const size of recipe.exportSizes) {
	for (const kind of ["transparent", "icon", "rounded"]) {
		const file = `exports/infospace-${kind}-${size}.png`;
		const bytes = await readFile(path.join(finishing, file));
		const metadata = await sharp(bytes).metadata();
		assert.equal(metadata.width, size);
		assert.equal(metadata.height, size);
		const alpha = await sharp(bytes)
			.ensureAlpha()
			.extractChannel(3)
			.raw()
			.toBuffer();
		const transparentPixels = alpha.filter((value) => value === 0).length;
		const opaquePixels = alpha.filter((value) => value === 255).length;
		assert(opaquePixels > 0);
		if (kind === "icon") assert.equal(opaquePixels, size * size);
		else assert(transparentPixels > 0);
		exports.push({
			file,
			width: size,
			height: size,
			transparentPixels,
			opaquePixels,
			sha256: createHash("sha256").update(bytes).digest("hex"),
		});
	}
}
const report = {
	sourceSha256,
	finishing: "01",
	opaquePixels,
	changedOpaquePixels,
	nontransparentBorderPixels,
	placement: manifest.placement,
	edgeSamples,
	matting:
		"Exterior-connected extraction with a measured opaque-interior protection polygon. Local macOS Vision provided a contour hint, refined against native luminance transitions; no generated RGB was replaced. The first two diagnostic probes remain archived and are not selected.",
	exports,
};
await writeFile(
	path.join(import.meta.dirname, "artwork.json"),
	`${JSON.stringify(report, null, "\t")}\n`,
);
console.log(
	JSON.stringify({
		opaquePixels,
		changedOpaquePixels,
		roundedClearance: manifest.placement.minimumRoundedEdgeClearance,
		exportCount: exports.length,
		palette: samples.map(({ label, color, pixel }) => ({
			label: label.en,
			color,
			pixel,
		})),
	}),
);
