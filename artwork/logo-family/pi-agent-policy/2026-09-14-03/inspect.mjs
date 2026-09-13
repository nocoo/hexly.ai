// Run from the repository root after finishing 01.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const run = "artwork/logo-family/pi-agent-policy/2026-09-14-03";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const raw = await readFile(`${run}/raw/generated.png`);
assert.equal(
	hash(raw),
	"71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85",
);
const review = JSON.parse(await readFile(`${run}/raw-review.json`, "utf8"));
assert.equal(review.status, "approved");
assert.equal(review.imageSha256, hash(raw));
const native = await sharp(raw).removeAlpha().raw().toBuffer();
const extracted = await sharp(`${run}/finishing/01/extracted-foreground.png`)
	.ensureAlpha()
	.raw()
	.toBuffer();
let opaquePixels = 0;
let changedOpaquePixels = 0;
for (let pixel = 0; pixel < 2048 * 2048; pixel++) {
	if (extracted[pixel * 4 + 3] !== 255) continue;
	opaquePixels++;
	if ([0, 1, 2].some((c) => native[pixel * 3 + c] !== extracted[pixel * 4 + c]))
		changedOpaquePixels++;
}
assert.ok(opaquePixels > 1_000_000);
assert.equal(changedOpaquePixels, 0);
for (const [x, y] of [
	[1840, 870],
	[1840, 1285],
])
	assert.equal(extracted[(y * 2048 + x) * 4 + 3], 0);

const finishing = JSON.parse(
	await readFile(`${run}/finishing/01/manifest.json`, "utf8"),
);
for (const file of finishing.files) {
	const bytes = await readFile(`${run}/finishing/01/${file.path}`);
	assert.equal(bytes.length, file.bytes);
	assert.equal(hash(bytes), file.sha256);
}
assert.equal(finishing.placement.clippedPixels, 0);
assert.ok(finishing.placement.minimumRoundedEdgeClearance >= 128);
for (const size of finishing.settings.exportSizes)
	for (const kind of ["transparent", "icon", "rounded"]) {
		const meta = await sharp(
			`${run}/finishing/01/exports/pi-agent-policy-${kind}-${size}.png`,
		).metadata();
		assert.equal(meta.width, size);
		assert.equal(meta.height, size);
	}

const samples = [
	["Graphite housing", 1070, 360],
	["Ivory face", 655, 700],
	["Terracotta enamel", 610, 1100],
	["Warm steel reflection", 1030, 885],
	["Brass contact", 1810, 800],
].map(([label, x, y]) => {
	const pixel = y * 2048 + x;
	const rgb = Array.from(native.subarray(pixel * 3, pixel * 3 + 3));
	assert.equal(extracted[pixel * 4 + 3], 255);
	return {
		label,
		x,
		y,
		rgb,
		hex: `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("")}`,
		alpha: 255,
	};
});
const palette = {
	project: "pi-agent-policy",
	study: "2026-09-14-03",
	finishing: "01",
	nativeSource: {
		path: "raw/generated.png",
		sha256: hash(raw),
		width: 2048,
		height: 2048,
	},
	artworkSamples: samples,
	presentation: {
		status:
			"Owner-authorized finishing; source adoption is recorded separately",
		recipe: "presentation.json",
		colors: finishing.settings.background,
	},
	applicationTheme: {
		revision: "352e8b9551e569f33f73273a20aa2ca66d06c2e5",
		note: "No product UI or evidenced application palette. These are native artwork samples and a separate designed Hexly presentation, not recovered product tokens.",
	},
};
const verification = {
	project: "pi-agent-policy",
	study: "2026-09-14-03",
	finishing: "01",
	rawSha256: hash(raw),
	opaquePixels,
	changedOpaquePixels,
	terminalOpeningsTransparent: true,
	verifiedFinishingFiles: finishing.files.length,
	exportSizes: finishing.settings.exportSizes,
	placement: finishing.placement,
	method:
		"Byte/hash checks for every finishing file; per-pixel comparison of fully opaque extracted RGB with the native image before uniform placement; measured rounded-outline clearance and native terminal-hole alpha checks.",
};
await writeFile(
	`${run}/palette.json`,
	`${JSON.stringify(palette, null, "\t")}\n`,
);
await writeFile(
	`${run}/verification.json`,
	`${JSON.stringify(verification, null, "\t")}\n`,
);
console.log(JSON.stringify(verification, null, 2));
