import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const studies = [
	{
		id: "coffee",
		samples: [
			["Peach ceramic", 880, 970],
			["Cream rim", 1100, 305],
			["Milk leaf", 1000, 470],
			["Espresso crema", 760, 530],
			["Brass spoon", 1120, 1430],
		],
		cores: [[600, 820, 750, 350], [900, 1620, 250, 70]],
		applicationTheme: {
			revision: "a6f179b1f530b1511e276eae6d3989a43c08a833",
			path: "src/styles.css",
			primary: "#c7d9a9",
			background: "#f8f6f0",
			ink: "#36352f",
			pink: "#f2d5d9",
			illustration: "#d9c9f0",
			note: "Existing application tokens, separate from the new artwork and its designed presentation.",
		},
	},
	{
		id: "hermes-gateway-herdr",
		samples: [
			["Petrol enamel", 1050, 800],
			["Brushed brass", 1120, 305],
			["Ivory terminal inlay", 1100, 1230],
			["Green status glass", 1570, 400],
		],
		cores: [[770, 610, 450, 840], [470, 430, 90, 1320], [1580, 700, 60, 900]],
		applicationTheme: {
			revision: "3cdecbf420e51232fe6e4ac790a8f51d42fe6e71",
			path: null,
			note: "No application or website theme is evidenced. The CLI and development manifest do not define UI tokens; the previous editorial emoji is not a theme.",
		},
	},
];

for (const study of studies) {
	const root = `artwork/logo-family/${study.id}/2026-09-11-01`;
	const pass = `${root}/finishing/01`;
	const inspection = `${root}/inspection`;
	await mkdir(inspection, { recursive: true });
	const raw = await readFile(`${root}/raw/generated.png`);
	const rawSha256 = hash(raw);
	const rgb = await sharp(raw).removeAlpha().raw().toBuffer();
	const foreground = await sharp(`${pass}/extracted-foreground.png`).ensureAlpha().raw().toBuffer();
	const placed = await sharp(`${pass}/exports/${study.id}-transparent-2048.png`).ensureAlpha().raw().toBuffer();
	const manifest = JSON.parse(await readFile(`${pass}/manifest.json`, "utf8"));
	assert.equal(rawSha256, manifest.input.sha256);
	let opaquePixels = 0;
	let changedOpaquePixels = 0;
	let maximumRadiusAt2048 = 0;
	const borderColors = new Map();
	for (let index = 0; index < 2048 * 2048; index++) {
		const x = index % 2048;
		const y = Math.floor(index / 2048);
		if (foreground[index * 4 + 3] === 255) {
			opaquePixels++;
			if (!rgb.subarray(index * 3, index * 3 + 3).equals(foreground.subarray(index * 4, index * 4 + 3))) changedOpaquePixels++;
		}
		if (placed[index * 4 + 3] >= 16) maximumRadiusAt2048 = Math.max(maximumRadiusAt2048, Math.hypot(x + 0.5 - 1024, y + 0.5 - 1024));
		if (x < 8 || y < 8 || x >= 2040 || y >= 2040) {
			const color = [...rgb.subarray(index * 3, index * 3 + 3)].join(",");
			borderColors.set(color, (borderColors.get(color) ?? 0) + 1);
		}
	}
	assert.equal(changedOpaquePixels, 0, `${study.id}: changed native opaque RGB`);
	assert.equal(manifest.placement.clippedPixels, 0);
	assert(manifest.placement.minimumRoundedEdgeClearance >= 128);
	const artworkSamples = study.samples.map(([label, x, y]) => {
		const pixel = [...rgb.subarray((y * 2048 + x) * 3, (y * 2048 + x) * 3 + 3)];
		const alpha = foreground[(y * 2048 + x) * 4 + 3];
		assert.equal(alpha, 255, `${label} must remain opaque`);
		return { label, x, y, rgb: pixel, hex: `#${pixel.map((value) => value.toString(16).padStart(2, "0")).join("")}`, alpha };
	});
	const coreChecks = study.cores.map(([left, top, width, height]) => {
		let nonOpaquePixels = 0;
		for (let y = top; y < top + height; y++) for (let x = left; x < left + width; x++) if (foreground[(y * 2048 + x) * 4 + 3] !== 255) nonOpaquePixels++;
		assert.equal(nonOpaquePixels, 0, `${study.id}: physical material core has holes`);
		return { left, top, width, height, nonOpaquePixels };
	});
	const openings = manifest.settings.matte.backgroundSeedsAt2048.map(([x, y]) => {
		const alpha = foreground[(y * 2048 + x) * 4 + 3];
		assert.equal(alpha, 0, "The real opening must be transparent");
		return { x, y, alpha, rgb: [...rgb.subarray((y * 2048 + x) * 3, (y * 2048 + x) * 3 + 3)] };
	});
	const exports = [];
	for (const file of manifest.files.filter((file) => file.path.startsWith("exports/"))) {
		const bytes = await readFile(`${pass}/${file.path}`);
		assert.equal(hash(bytes), file.sha256);
		const expectedSize = Number(file.path.match(/-(\d+)\.png$/)[1]);
		const metadata = await sharp(bytes).metadata();
		assert.equal(metadata.width, expectedSize);
		assert.equal(metadata.height, expectedSize);
		const pixels = await sharp(bytes).ensureAlpha().raw().toBuffer();
		let clearPixels = 0;
		let solidPixels = 0;
		for (let at = 3; at < pixels.length; at += 4) {
			if (pixels[at] === 0) clearPixels++;
			if (pixels[at] === 255) solidPixels++;
		}
		if (file.path.includes("-transparent-") || file.path.includes("-rounded-")) assert(clearPixels > 0 && solidPixels > 0);
		else assert.equal(solidPixels, expectedSize * expectedSize);
		if (file.path.includes("-white-")) assert.deepEqual([...pixels.subarray(0, 4)], [255, 255, 255, 255]);
		exports.push({ ...file, width: expectedSize, height: expectedSize, clearPixels, solidPixels });
	}
	assert.equal(exports.length, 31);
	const sizes = [128, 64, 48, 32, 24, 16];
	const composites = [];
	for (const [row, background, kind] of [[0, "#f6f5ef", "icon"], [1, "#f6f5ef", "transparent"], [2, "#17211d", "icon"], [3, "#17211d", "transparent"]]) {
		composites.push({ input: await sharp({ create: { width: 1200, height: 180, channels: 3, background } }).png().toBuffer(), left: 0, top: row * 180 });
		for (const [column, size] of sizes.entries()) {
			composites.push({ input: `${pass}/exports/${study.id}-${kind}-${size}.png`, left: column * 200 + Math.floor((200 - size) / 2), top: row * 180 + Math.floor((180 - size) / 2) });
		}
	}
	await sharp({ create: { width: 1200, height: 720, channels: 3, background: "white" } }).composite(composites).png().toFile(`${inspection}/sizes-01.png`);
	const settings = manifest.settings.background;
	const palette = {
		project: study.id, study: "2026-09-11-01", finishing: "01",
		nativeSource: { path: "raw/generated.png", sha256: rawSha256, width: 2048, height: 2048 },
		artworkSamples,
		presentation: { status: "adopted locally under owner-authorized finishing", recipe: "presentation.json", colors: Object.fromEntries(["base", "light", "shade", "motif", "motifOpacity", "highlightOpacity", "ribbonOpacity"].map((key) => [key, settings[key]])) },
		applicationTheme: study.applicationTheme,
	};
	await writeFile(`${root}/palette.json`, `${JSON.stringify(palette, null, "\t")}\n`);
	const report = { pass: "01", rawSha256, opaquePixels, changedOpaquePixels, artworkSamples, coreChecks, openings, matteBorderSample: { width: 8, mostFrequentColors: [...borderColors].sort((a, b) => b[1] - a[1]).slice(0, 8) }, placement: manifest.placement, maximumRadiusAt2048, exports, sizeSheet: "sizes-01.png", sizeSheetColumns: sizes, sizeSheetRows: ["Light presentation", "Light transparent", "Dark presentation", "Dark transparent"] };
	await writeFile(`${inspection}/finishing-01.json`, `${JSON.stringify(report, null, "\t")}\n`);
	console.log(`${study.id}: ${opaquePixels} native opaque pixels preserved; ${exports.length} exports; clearance ${manifest.placement.minimumRoundedEdgeClearance.toFixed(1)} px`);
}
