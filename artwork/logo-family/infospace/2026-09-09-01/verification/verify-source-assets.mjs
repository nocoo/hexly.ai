import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = resolve(process.argv[2] ?? "../infospace");
const output = fileURLToPath(new URL("source-assets.json", import.meta.url));
const provenance = JSON.parse(
	await readFile(join(source, "assets/brand/provenance.json"), "utf8"),
);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const files = [];

async function inspectPNG(path, expectedSize) {
	const bytes = await readFile(path);
	const { data, info } = await sharp(bytes)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	assert.equal(info.width, expectedSize);
	assert.equal(info.height, expectedSize);
	let transparent = 0;
	let opaque = 0;
	for (let i = 3; i < data.length; i += 4) {
		if (data[i] === 0) transparent++;
		if (data[i] === 255) opaque++;
	}
	return {
		width: info.width,
		height: info.height,
		transparentPixels: transparent,
		opaquePixels: opaque,
		sha256: sha256(bytes),
	};
}

for (const record of provenance.files) {
	const bytes = await readFile(join(source, record.path));
	assert.equal(bytes.length, record.bytes, record.path);
	assert.equal(sha256(bytes), record.sha256, record.path);
	if (record.path.endsWith(".png")) {
		const size = record.path.includes("@2x")
			? 44
			: record.path.includes("ToolbarMark")
				? 22
				: record.path.endsWith("macos-icon.png")
					? 1024
					: 2048;
		const decoded = await inspectPNG(join(source, record.path), size);
		assert(decoded.opaquePixels > 0);
		if (record.path === "assets/brand/icon.png") {
			assert.equal(decoded.transparentPixels, 0);
		} else {
			assert(decoded.transparentPixels > 0);
		}
		files.push({ path: record.path, ...decoded });
	} else {
		files.push(record);
	}
}

for (const [target, role] of [
	["logo.png", "transparent"],
	["assets/brand/icon.png", "icon"],
	["assets/brand/icon-rounded.png", "rounded"],
]) {
	const master = fileURLToPath(
		new URL(
			`../finishing/01/exports/infospace-${role}-2048.png`,
			import.meta.url,
		),
	);
	assert.deepEqual(
		await readFile(join(source, target)),
		await readFile(master),
	);
}

assert.equal(
	sha256(await readFile(join(source, "logo.svg"))),
	"7540789c41a74c8553af6fe38b23aa3784753259038ff93dc8e7797f17582d03",
);
for (const [path, image] of [
	["README.md", "assets/brand/icon-rounded.png"],
	["docs/README.en.md", "../assets/brand/icon-rounded.png"],
]) {
	assert(
		(await readFile(join(source, path), "utf8")).includes(`src="${image}"`),
	);
}

const temporary = await mkdtemp(join(tmpdir(), "infospace-decoded-icons-"));
const iconset = join(temporary, "AppIcon.iconset");
execFileSync("/usr/bin/iconutil", [
	"--convert",
	"iconset",
	"--output",
	iconset,
	join(source, "App/Resources/AppIcon.icns"),
]);
const entries = [];
for (const file of (await readdir(iconset)).sort()) {
	const match = /^icon_(\d+)x\d+(@2x)?\.png$/.exec(file);
	assert(match, file);
	const points = Number(match[1]);
	const scale = match[2] ? 2 : 1;
	const decoded = await inspectPNG(join(iconset, file), points * scale);
	assert(decoded.transparentPixels > 0, file);
	assert(decoded.opaquePixels > 0, file);
	entries.push({ file, points, scale, ...decoded });
}
assert.equal(entries.length, 10);
assert.deepEqual(
	[...new Set(entries.map((entry) => entry.width))].sort((a, b) => a - b),
	[16, 32, 64, 128, 256, 512, 1024],
);

const report = {
	date: "2026-09-09",
	study: "infospace/2026-09-09-01",
	finishing: "01",
	exactMasters: true,
	previousSVGUnchanged: true,
	readmePresentationTargets: true,
	files,
	icnsEntries: entries,
	retainedDecodedIconset: iconset,
	platformInset: { canvas: 1024, completeRoundedTile: 824, inset: 100 },
	note: "Static source consumer verification. Native runtime resource loading and actual toolbar rendering are verified separately.",
	passed: true,
};
await writeFile(output, `${JSON.stringify(report, null, "\t")}\n`);
console.log(
	"InfoSpace exact masters, README targets, transparent toolbar PNGs and 10 decoded ICNS entries verified.",
);
