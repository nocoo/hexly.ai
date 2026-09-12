import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { catalogueProblems } from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";
import { healthEndpoint } from "../../src/model/status";

const snail = readProjects().find((project) => project.id === "snail");
if (!snail?.brandKit) throw new Error("Missing Snail brand handoff");
const project = snail;
const kit = snail.brandKit;

describe("versioned vector identities", () => {
	it("keeps brand publication distinct from source adoption and the product release", () => {
		expect(catalogueProblems([project])).toEqual([]);
		expect(kit.sourceAdoptionRevision).toBeNull();
		expect(project.source.profileRevision).toBeNull();
		expect(project.overview?.verified.revision).toBeNull();
		expect(healthEndpoint(project)).toBe("https://snail.hexly.ai/api/live");
		expect(
			catalogueProblems([
				{
					...project,
					brandKit: { ...kit, sourceAdoptionRevision: "a".repeat(40) },
				},
			]),
		).toEqual([]);
	});
	it("rejects incomplete metadata and assets outside a project's immutable version", () => {
		for (const damaged of [
			null,
			{ ...kit, version: "latest" },
			{ ...kit, root: "/brands/another-project/v1.0.0" },
			{ ...kit, root: "https://untrusted.test/brand" },
			{ ...kit, sourceAdoptionRevision: "main" },
			{ ...kit, description: { en: "Only English" } },
			{ ...kit, guidelines: null },
			{ ...kit, guidelines: [] },
			{ ...kit, guidelines: [null] },
			{ ...kit, guidelines: [{ title: { en: "Rule", zh: "规则" } }] },
		]) {
			expect(
				catalogueProblems([
					{ ...project, brandKit: damaged as unknown as Project["brandKit"] },
				]),
			).toContain("Invalid brand kit: snail");
		}
	});
	it("ships standalone vector wordmarks without live fonts, scripts or embedded raster artwork", async () => {
		for (const file of [
			"mark-light.svg",
			"mark-dark.svg",
			"wordmark-light.svg",
			"wordmark-dark.svg",
			"lockup-light.svg",
			"lockup-dark.svg",
			"favicon.svg",
		]) {
			const svg = await readFile(`public${kit.root}/${file}`, "utf8");
			expect(svg).toContain("<path");
			expect(svg).not.toMatch(
				/<(text|image|script|foreignObject)\b|(?:href|src)=|@import|url\(/i,
			);
			const image = await sharp(Buffer.from(svg))
				.png()
				.toBuffer({ resolveWithObject: true });
			expect(image.info.width).toBeGreaterThan(0);
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
