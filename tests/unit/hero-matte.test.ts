import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "vitest";

test("extracts an exterior matte without erasing enclosed pale material or recoloring opaque pixels", () => {
	const module = pathToFileURL(
		resolve("artwork/site-heroes/2026-11-13-01/finish.mjs"),
	).href;
	const output = execFileSync(
		"bun",
		[
			"-e",
			`
		import assert from "node:assert/strict";
		import { extractMatte } from ${JSON.stringify(module)};
		const width = 24, height = 16;
		const rgb = Buffer.alloc(width * height * 3, 252);
		const set = (x, y, color) => rgb.set(color, (y * width + x) * 3);
		for (let y = 3; y < 13; y++) for (let x = 4; x < 20; x++) set(x, y, [180, 90, 50]);
		set(8, 8, [252, 252, 252]);
		set(1, 1, [120, 120, 120]);
		set(4, 7, [216, 171, 151]);
		const result = extractMatte(rgb, width, height);
		const pixel = (x, y) => [...result.rgba.subarray((y * width + x) * 4, (y * width + x) * 4 + 4)];
		assert.throws(() => extractMatte(Buffer.alloc(2), width, height));
		console.log(JSON.stringify({ outside: pixel(0, 0), pale: pixel(8, 8), solid: pixel(12, 8), edge: pixel(4, 7), noise: pixel(1, 1), removed: result.statistics.removedPixels }));
	`,
		],
		{ encoding: "utf8" },
	);
	const pixels = JSON.parse(output);
	expect(pixels.outside).toEqual([0, 0, 0, 0]);
	expect(pixels.pale).toEqual([252, 252, 252, 255]);
	expect(pixels.solid).toEqual([180, 90, 50, 255]);
	expect(pixels.edge).toEqual([180, 90, 50, 128]);
	expect(pixels.noise).toEqual([0, 0, 0, 0]);
	expect(pixels.removed).toBe(1);
});
