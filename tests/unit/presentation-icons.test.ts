import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { readInventory } from "../../scripts/asset-storage";
import { readProjects } from "../../src/data/read-projects";
import { catalogueProblems } from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";
import { projectApi } from "../../src/model/project-api";

const projects = readProjects();

describe("approved textured icon delivery", () => {
	it("covers every active project while keeping archived identities separate", () => {
		const inventory = readInventory();
		for (const project of projects) {
			if (project.archived) {
				expect(project.presentationIcon).toBeUndefined();
				continue;
			}
			expect(project.presentationIcon?.width).toBe(
				project.family?.foreground.width,
			);
			const api = projectApi(project);
			for (const url of [
				api.icons.small,
				api.icons.large,
				api.brand.iconManifest,
			])
				expect(
					inventory.files.some((file) => `https://h.no.mt/${file.key}` === url),
				).toBe(true);
			expect(api.logos.find((logo) => logo.id === "original")?.role).toBe(
				"project-identity",
			);
		}
	});
	it("rejects foreign icon paths, archive enrichment and false native dimensions", () => {
		const p = projects.find((project) => project.id === "frogie");
		if (!p?.presentationIcon) throw new Error("Missing Frogie presentation");
		for (const icon of [
			null,
			{ ...p.presentationIcon, version: "latest" },
			{ ...p.presentationIcon, root: "/icons/pew/v1.0.0" },
			{ ...p.presentationIcon, width: 900 },
			{ ...p.presentationIcon, height: 900 },
		])
			expect(
				catalogueProblems([
					{ ...p, presentationIcon: icon as Project["presentationIcon"] },
				]),
			).toContain("Invalid presentation icon: frogie");
		expect(catalogueProblems([{ ...p, archived: true }])).toContain(
			"Invalid presentation icon: frogie",
		);
		expect(catalogueProblems([{ ...p, family: undefined }])).toContain(
			"Invalid presentation icon: frogie",
		);
	});
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
