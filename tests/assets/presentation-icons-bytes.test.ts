import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";

const projects = readProjects();

describe("approved textured icon CDN bytes", () => {
	it("delivers lean WebP square/rounded icons, opaque apple-touch icons, and multi-size ICOs", async () => {
		const selected = projects.filter(
			(p) =>
				p.presentationIcon &&
				(p.presentationIcon.width < 1024 ||
					["frogie", "rio", "coffee"].includes(p.id)),
		);
		for (const project of selected) {
			const icon = project.presentationIcon;
			if (!icon) throw new Error(project.id);
			const square = sharp(`public${icon.root}/icon-1024.webp`);
			expect((await square.metadata()).width).toBe(1024);
			expect((await square.stats()).isOpaque).toBe(true);
			const rounded = sharp(`public${icon.root}/rounded-1024.webp`);
			expect((await rounded.metadata()).width).toBe(1024);
			const pixels = await rounded.ensureAlpha().raw().toBuffer();
			expect(pixels[3]).toBe(0);
			expect(pixels[(512 * 1024 + 512) * 4 + 3]).toBe(255);
			const apple = sharp(`public${icon.root}/apple-touch-icon.png`);
			expect((await apple.metadata()).width).toBe(180);
			expect((await apple.stats()).isOpaque).toBe(true);
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
