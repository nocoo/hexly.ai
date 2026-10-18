import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const ids = ["hexly-ai", "base-ci", "base-cli", "base-mcp", "next-ai", "octo"];
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
for (const id of ids) {
	const path = `src/data/projects/${id}.json`;
	const project = JSON.parse(await readFile(path, "utf8"));
	const family = project.family;
	const source = `public${family.root}`;
	const root = `/icons/${id}/v1.0.0`;
	const output = `public${root}`;
	const width = family.foreground.width;
	const foreground = await readFile(`${source}/transparent.png`);
	const square = await readFile(`${source}/icon.png`);
	const rounded = await readFile(`${source}/rounded.png`);
	assert.equal(digest(foreground), family.foreground.sha256);
	assert.equal((await sharp(square).metadata()).width, width);
	assert.equal((await sharp(square).stats()).isOpaque, true);
	const pixels = await sharp(foreground).ensureAlpha().raw().toBuffer();
	const composed = await sharp(square).ensureAlpha().raw().toBuffer();
	let opaquePixels = 0;
	for (let at = 0; at < pixels.length; at += 4) {
		if (pixels[at + 3] !== 255) continue;
		opaquePixels++;
		assert.ok(
			pixels.subarray(at, at + 3).equals(composed.subarray(at, at + 3)),
		);
	}
	await mkdir(output, { recursive: true });
	const files = [];
	const save = async (name, bytes) => {
		try {
			await writeFile(`${output}/${name}`, bytes, { flag: "wx" });
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
			assert.ok(
				(await readFile(`${output}/${name}`)).equals(bytes),
				`Frozen ${root}/${name}`,
			);
		}
		files.push({
			path: `${root}/${name}`,
			bytes: bytes.length,
			sha256: digest(bytes),
		});
	};
	await save("icon.png", square);
	await save("rounded.png", rounded);
	for (const [name, bytes] of [
		["icon", square],
		["rounded", rounded],
	])
		for (const size of [32, 64, 160, 256, 512, 1024])
			await save(
				`${name}-${size}.webp`,
				await sharp(bytes).resize(size).webp({ lossless: true }).toBuffer(),
			);
	await save(
		"icon-1024.png",
		await sharp(square).resize(1024).png().toBuffer(),
	);
	await save(
		"apple-touch-icon.png",
		await sharp(square).resize(180).png().toBuffer(),
	);
	const sizes = [16, 32, 48, 64, 128, 256];
	const frames = await Promise.all(
		sizes.map((size) => sharp(rounded).resize(size).png().toBuffer()),
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
	await save("favicon.ico", Buffer.concat([header, ...frames]));
	const provenance = {
		schemaVersion: 1,
		project: id,
		version: "1.0.0",
		scope: "hexly-campaign",
		generationCalls: 0,
		source: family.root,
		study: family.archive,
		finishing: family.finishing,
		foreground: family.foreground,
		texture: {
			path: `${family.root}/background.png`,
			sha256: digest(await readFile(`${source}/background.png`)),
			sourceMethod: "authored-family-background",
		},
		width,
		height: width,
		upscaledExportSizes: [],
		inspection: {
			opaquePixels,
			opaqueForegroundRgbUnchanged: true,
			nativeMastersCopiedByteForByte: true,
		},
		publication: "Local only; no R2 upload or release",
	};
	await save(
		"provenance.json",
		Buffer.from(`${JSON.stringify(provenance, null, "\t")}\n`),
	);
	await save(
		"guide.md",
		Buffer.from(
			`# ${project.title} presentation exports\n\nThe approved study's native square and rounded masters are copied byte-for-byte. No new background, mask, shadow or image generation is applied. Original colors, source rights and exact finishing evidence remain in ${family.archive}/finishing/${family.finishing}.\n\nUse rounded WebP for Hexly navigation without another mask, tile or shadow. For source-product headers and favicons use the separate transparent family master, not these presentation tiles. Use icon-1024.png and apple-touch-icon.png as opaque platform masters. Smaller exports are resampled from the native ${width}px canvas; ICO contains 16/32/48/64/128/256px rounded presentation frames.\n\nLocal adoption only; no R2 publication or service-health claim.\n`,
		),
	);
	await save(
		"manifest.json",
		Buffer.from(
			`${JSON.stringify({ ...provenance, root, files: [...files] }, null, "\t")}\n`,
		),
	);
	project.presentationIcon = { version: "1.0.0", root, width, height: width };
	await writeFile(path, `${JSON.stringify(project, null, "\t")}\n`);
	console.info(
		`${id}: native ${width}px, ${opaquePixels} opaque pixels unchanged`,
	);
}
