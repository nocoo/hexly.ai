import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import retiredSnail from "../../docs/sources/snail-retired-2026-09-13.json" with {
	type: "json",
};
import type { Project } from "../../src/model/project";

const snail = retiredSnail as Project;
if (!snail?.brandKit) throw new Error("Missing Snail brand handoff");
const kit = snail.brandKit;

describe("versioned brand identity bytes", () => {
	it("preserves historical SVGs and reuses exact font outlines, never a fake SVG animal", async () => {
		const oldRoot = "public/brands/snail/v1.0.0";
		expect(
			createHash("sha256")
				.update(await readFile(`${oldRoot}/manifest.json`))
				.digest("hex"),
		).toBe("11b8203d41030ad5317b94fd8a2a19d7a7b1077f174410b89caea4fd0d082ec8");
		for (const file of [
			"mark-light.svg",
			"mark-dark.svg",
			"wordmark-light.svg",
			"wordmark-dark.svg",
			"lockup-light.svg",
			"lockup-dark.svg",
			"favicon.svg",
		]) {
			const svg = await readFile(`${oldRoot}/${file}`, "utf8");
			expect(svg).toContain("<path");
			expect(svg).not.toMatch(
				/<(text|image|script|foreignObject)\b|(?:href|src)=|@import|url\(/i,
			);
			const image = await sharp(Buffer.from(svg))
				.png()
				.toBuffer({ resolveWithObject: true });
			expect(image.info.width).toBeGreaterThan(0);
		}
		for (const file of [
			"wordmark-light.svg",
			"wordmark-dark.svg",
			"space-grotesk.woff2",
			"space-grotesk-ofl.txt",
			"hexly-mark.svg",
		])
			expect(
				(await readFile(`public${kit.root}/${file}`)).equals(
					await readFile(`${oldRoot}/${file}`),
				),
			).toBe(true);
		const manifest = JSON.parse(
			await readFile(`public${kit.root}/manifest.json`, "utf8"),
		);
		expect(manifest.method).toBe("gpt-image-2");
		expect(
			manifest.files.some((file: { path: string }) =>
				/\/(mark|icon|lockup|favicon).*\.svg$/.test(file.path),
			),
		).toBe(false);
	});
	it("keeps native compositions and every opaque foreground pixel from the accepted generation", async () => {
		const source = await readFile(
			"artwork/logo-family/snail/2026-09-13-01/raw/generated.png",
		);
		const master = await readFile(`public${kit.root}/logo.png`);
		expect(
			(await readFile(`public${kit.root}/raw-icon.png`)).equals(source),
		).toBe(true);
		expect(await sharp(master).metadata()).toMatchObject({
			width: 2048,
			height: 2048,
			hasAlpha: true,
		});
		const original = await sharp(source).ensureAlpha().raw().toBuffer();
		const foreground = await sharp(master).ensureAlpha().raw().toBuffer();
		let opaque = 0;
		let changed = 0;
		for (let i = 0; i < foreground.length; i += 4) {
			if (foreground[i + 3] !== 255) continue;
			opaque++;
			if (
				foreground[i] !== original[i] ||
				foreground[i + 1] !== original[i + 1] ||
				foreground[i + 2] !== original[i + 2]
			)
				changed++;
		}
		expect({ opaque, changed }).toEqual({ opaque: 1_227_417, changed: 0 });
		const hero = await readFile(
			"artwork/logo-family/snail/2026-09-13-04/raw/generated.png",
		);
		expect((await readFile(`public${kit.root}/hero.png`)).equals(hero)).toBe(
			true,
		);
		expect(await sharp(`public${kit.root}/hero.webp`).metadata()).toMatchObject(
			{ width: 2560, height: 1024 },
		);
		expect(
			await sharp(`public${kit.root}/hero-square.webp`).metadata(),
		).toMatchObject({ width: 1024, height: 1024 });
		const provenance = JSON.parse(
			await readFile(`public${kit.root}/provenance.json`, "utf8"),
		);
		expect(provenance.generations).toHaveLength(6);
		expect(
			provenance.generations.filter(
				(item: { selected: boolean }) => item.selected,
			),
		).toHaveLength(2);
		expect(provenance.selection.ownerReviewedExactBytes).toBe(false);
		expect(provenance.processing).toMatchObject({
			crop: false,
			recolor: false,
			opaqueColorsPreserved: true,
			placement: { scale: 1, offsetAt2048: [0, 0] },
		});
	});
	it("ships low-contrast repeatable textures with transparent seams in both themes", async () => {
		for (const theme of ["light", "dark"]) {
			const { data, info } = await sharp(
				`public${kit.root}/texture-${theme}.png`,
			)
				.ensureAlpha()
				.raw()
				.toBuffer({ resolveWithObject: true });
			expect(info).toMatchObject({ width: 512, height: 512, channels: 4 });
			let maxAlpha = 0;
			let boundaryAlpha = 0;
			for (let y = 0; y < 512; y++)
				for (let x = 0; x < 512; x++) {
					const alpha = data[(y * 512 + x) * 4 + 3] ?? 0;
					maxAlpha = Math.max(maxAlpha, alpha);
					if (x === 0 || x === 511 || y === 0 || y === 511)
						boundaryAlpha += alpha;
				}
			expect(boundaryAlpha).toBe(0);
			expect(maxAlpha).toBeGreaterThan(0);
			expect(maxAlpha).toBeLessThanOrEqual(16);
		}
	});
	it("delivers a real ICO with transparent, decodable entries at every advertised size", async () => {
		const ico = await readFile(`public${kit.root}/favicon.ico`);
		expect(ico.readUInt16LE(0)).toBe(0);
		expect(ico.readUInt16LE(2)).toBe(1);
		expect(ico.readUInt16LE(4)).toBe(6);
		const sizes = [];
		for (let index = 0; index < ico.readUInt16LE(4); index++) {
			const entry = 6 + index * 16;
			const size = ico[entry] || 256;
			const start = ico.readUInt32LE(entry + 12);
			const png = ico.subarray(start, start + ico.readUInt32LE(entry + 8));
			const metadata = await sharp(png).metadata();
			expect(metadata).toMatchObject({
				format: "png",
				width: size,
				height: size,
				hasAlpha: true,
			});
			expect((await sharp(png).stats()).channels[3]?.min).toBe(0);
			sizes.push(size);
		}
		expect(sizes).toEqual([16, 32, 48, 64, 128, 256]);
	});
});
