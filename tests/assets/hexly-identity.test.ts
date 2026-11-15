import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import selected from "../../artwork/logo-family/hexly-ai/2026-11-13-02/selection.json";
import { readInventory } from "../../scripts/asset-storage";
import identity from "../../src/data/projects/hexly-ai.json";

const hash = (bytes: Buffer) =>
	createHash("sha256").update(bytes).digest("hex");

describe("adopted Hexly identity", () => {
	it("uses the exact selected master in source and catalogue", async () => {
		expect(identity.family.status).toBe("adopted");
		expect(identity.family.foreground.sha256).toBe(selected.transparentSha256);
		for (const path of [
			"logo.png",
			`public${identity.logo.original}`,
			`public${identity.family.root}/transparent.png`,
		]) {
			expect(hash(await readFile(path)), path).toBe(selected.transparentSha256);
		}
		const previous = await readFile(
			`public${identity.family.previous.original}`,
		);
		expect(hash(previous)).toBe(identity.family.previous.sha256);
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

	it("preserves the existing textures during identity rebinding", async () => {
		for (const theme of ["light", "dark"])
			for (const suffix of [".png", ".webp", "-320.webp"]) {
				const name = `texture-${theme}${suffix}`;
				expect(
					await readFile(`public${identity.brandTexture.root}/${name}`),
				).toEqual(await readFile(`public/textures/hexly-ai/v1.0.1/${name}`));
			}
	});

	it("requires publication receipts for every active identity delivery file", async () => {
		const receipts = new Set(
			(await readFile("docs/assets/publication.jsonl", "utf8"))
				.trim()
				.split("\n")
				.map((line) => {
					const record = JSON.parse(line);
					return `${record.key}:${record.sha256}`;
				}),
		);
		const files = readInventory().files.filter(
			(file) =>
				file.source.startsWith(`public${identity.family.root}/`) ||
				file.source.startsWith(`public${identity.presentationIcon.root}/`) ||
				file.source === `public${identity.logo.original}`,
		);
		expect(files.length).toBeGreaterThan(40);
		for (const file of files)
			expect(receipts.has(`${file.key}:${file.sha256}`), file.source).toBe(
				true,
			);
	});
});
