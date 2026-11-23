import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import selected from "../../artwork/logo-family/hexly-ai/2026-11-13-02/selection.json";
import { readInventory } from "../../scripts/asset-storage";
import identity from "../../src/data/projects/hexly-ai.json";

describe("adopted Hexly identity", () => {
	it("records the exact selected master hash and serves WebP CDN derivatives", async () => {
		expect(identity.family.status).toBe("adopted");
		expect(identity.family.foreground.sha256).toBe(selected.transparentSha256);
		expect(identity.logo.sha256).toBe(selected.transparentSha256);
		const display = await sharp(`public${identity.logo.display}`).metadata();
		expect(display).toMatchObject({
			format: "webp",
			width: 1024,
			height: 1024,
		});
		const prev = await sharp(
			`public${identity.family.root}/previous-1024.webp`,
		).metadata();
		expect(prev).toMatchObject({ format: "webp", width: 1024, height: 1024 });
	});

	it("preserves transparent favicon frames and opaque platform icons", async () => {
		const ico = await readFile(
			`public${identity.presentationIcon.root}/favicon.ico`,
		);
		const sizes = [16, 32, 48, 64, 128, 256];
		expect(ico.readUInt16LE(4)).toBe(sizes.length);
		for (const [index, size] of sizes.entries()) {
			const at = 6 + index * 16;
			const offset = ico.readUInt32LE(at + 12);
			const frame = ico.subarray(offset, offset + ico.readUInt32LE(at + 8));
			const metadata = await sharp(frame).metadata();
			expect([metadata.width, metadata.height]).toEqual([size, size]);
			expect(metadata.hasAlpha).toBe(true);
			expect((await sharp(frame).ensureAlpha().raw().toBuffer())[3]).toBe(0);
		}
		const apple = await readFile(
			`public${identity.presentationIcon.root}/apple-touch-icon.png`,
		);
		expect((await sharp(apple).metadata()).width).toBe(180);
		expect((await sharp(apple).stats()).isOpaque).toBe(true);
	});

	it("delivers lean WebP textures for both themes", async () => {
		for (const theme of ["light", "dark"])
			for (const [suffix, size] of [
				[".webp", 1024],
				["-320.webp", 320],
			] as const) {
				const meta = await sharp(
					`public${identity.brandTexture.root}/texture-${theme}${suffix}`,
				).metadata();
				expect(meta).toMatchObject({
					format: "webp",
					width: size,
					height: size,
				});
			}
	});

	it("inventories active identity CDN delivery files cleanly", () => {
		const files = readInventory().files.filter(
			(file) =>
				file.source.startsWith(`public${identity.family.root}/`) ||
				file.source.startsWith(`public${identity.presentationIcon.root}/`) ||
				file.source === `public${identity.logo.display}`,
		);
		expect(files.length).toBeGreaterThan(20);
		expect(files.every((file) => Boolean(file.path))).toBe(true);
	});
});
