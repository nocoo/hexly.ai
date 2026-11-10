import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";

const projects = readProjects();

describe("approved textured icon bytes", () => {
	it("delivers square opaque iOS masters and continuous transparent corners at native size", async () => {
		const selected = projects.filter(
			(p) =>
				p.presentationIcon &&
				(p.presentationIcon.width < 1024 ||
					["frogie", "rio", "coffee"].includes(p.id)),
		);
		for (const project of selected) {
			const icon = project.presentationIcon;
			if (!icon) throw new Error(project.id);
			const square = sharp(`public${icon.root}/icon.png`);
			expect((await square.metadata()).width).toBe(icon.width);
			expect((await square.stats()).isOpaque).toBe(true);
			const rounded = sharp(`public${icon.root}/rounded.png`);
			expect((await rounded.metadata()).width).toBe(icon.width);
			const pixels = await rounded.ensureAlpha().raw().toBuffer();
			expect(pixels[3]).toBe(0);
			expect(
				pixels[
					(Math.floor(icon.width / 2) * icon.width +
						Math.floor(icon.width / 2)) *
						4 +
						3
				],
			).toBe(255);
			const ios = sharp(`public${icon.root}/icon-1024.png`);
			expect((await ios.metadata()).width).toBe(1024);
			expect((await ios.stats()).isOpaque).toBe(true);
			const ico = await readFile(`public${icon.root}/favicon.ico`);
			expect(ico.readUInt16LE(2)).toBe(1);
			expect(ico.readUInt16LE(4)).toBe(6);
			for (const [index, size] of [16, 32, 48, 64, 128, 256].entries()) {
				const at = 6 + index * 16;
				const start = ico.readUInt32LE(at + 12);
				const bytes = ico.subarray(start, start + ico.readUInt32LE(at + 8));
				expect((await sharp(bytes).metadata()).width).toBe(size);
			}
		}
	});
});
