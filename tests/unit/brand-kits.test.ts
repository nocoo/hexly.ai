import { describe, expect, it } from "vitest";
import retiredSnail from "../../docs/sources/snail-retired-2026-09-13.json" with {
	type: "json",
};
import { readProjects } from "../../src/data/read-projects";
import {
	brandAsset,
	brandSourceLabel,
	brandTexture,
} from "../../src/model/brand";
import { catalogueProblems } from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";
import { healthEndpoint, statusTargets } from "../../src/model/status";

const snail = retiredSnail as Project;
if (!snail?.brandKit) throw new Error("Missing Snail brand handoff");
const project = snail;
const kit = snail.brandKit;

describe("versioned brand identities", () => {
	it("keeps brand publication distinct from source adoption and the product release", () => {
		expect(catalogueProblems([project])).toEqual([]);
		expect(kit.sourceAdoptionRevision).toBeNull();
		expect(project.source.profileRevision).toBeNull();
		expect(project.overview?.verified.revision).toBeNull();
		expect(healthEndpoint(project)).toBe("https://snail.hexly.ai/api/live");
		expect(statusTargets(readProjects()).some(({ id }) => id === "snail")).toBe(
			false,
		);
		expect(kit.version).toBe("2.0.0");
		expect(project.family?.status).toBe("review");
		expect(project.family?.previous?.sha256).toBe(project.logo.sha256);
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
			{ ...kit, method: "pretend-svg" },
			{ ...kit, previousVersion: "latest" },
			{ ...kit, previousVersion: kit.version },
			{ ...kit, previousVersion: undefined },
			{ ...kit, hero: undefined },
			{ ...kit, hero: null },
			{ ...kit, hero: { ...kit.hero, width: 0 } },
			{ ...kit, hero: { ...kit.hero, height: -1 } },
			{ ...kit, hero: { ...kit.hero, width: 1.5 } },
			{ ...kit, hero: { ...kit.hero, height: "1024" } },
			{ ...kit, hero: { ...kit.hero, alt: { en: "Only English" } } },
			{ ...kit, hero: { ...kit.hero, caption: { en: "Only English" } } },
		]) {
			expect(
				catalogueProblems([
					{ ...project, brandKit: damaged as unknown as Project["brandKit"] },
				]),
			).toContain("Invalid brand kit: snail");
		}
		expect(catalogueProblems([{ ...project, family: undefined }])).toContain(
			"Invalid brand kit: snail",
		);
	});
	it("resolves true formats and theme textures while preserving native-kit compatibility", () => {
		const nativeKit = {
			...kit,
			method: undefined,
			previousVersion: undefined,
			hero: undefined,
			version: "1.0.0",
			root: "/brands/snail/v1.0.0",
		};
		expect(
			catalogueProblems([
				{ ...project, brandKit: nativeKit, family: undefined },
			]),
		).toEqual([]);
		expect(brandAsset(nativeKit, "mark", "dark")).toBe(
			"/brands/snail/v1.0.0/mark-dark.svg",
		);
		expect(brandAsset(kit, "mark", "light")).toBe(`${kit.root}/mark-light.png`);
		expect(brandAsset(kit, "wordmark", "dark")).toBe(
			`${kit.root}/wordmark-dark.svg`,
		);
		expect(brandTexture({ brandKit: kit })).toEqual({
			"--brand-texture-light": `url("https://h.no.mt${kit.root}/texture-light.svg")`,
			"--brand-texture-dark": `url("https://h.no.mt${kit.root}/texture-dark.svg")`,
			"--brand-texture-opacity": 0.45,
		});
		expect(brandTexture({ brandKit: nativeKit })).toBeUndefined();
		expect(brandTexture({})).toBeUndefined();
		expect(
			brandTexture({
				brandKit: {
					...kit,
					texture: {
						name: { en: "Surface", zh: "底纹" },
						description: { en: "Generated surface", zh: "生成底纹" },
						format: "webp",
						display: "single",
						model: "gpt-image-2.5-flare",
					},
				},
			}),
		).toEqual({
			"--brand-texture-light": `url("https://h.no.mt${kit.root}/texture-light.webp")`,
			"--brand-texture-dark": `url("https://h.no.mt${kit.root}/texture-dark.webp")`,
			"--brand-texture-opacity": 0.45,
		});
	});
	it("labels campaign source methods for catalogue display", () => {
		if (!project.family) throw new Error("Snail family fixture required");
		const material = {
			...project,
			family: { ...project.family, series: "material" as const },
		};
		expect(brandSourceLabel(material, "en")).toBe("GPT Image · Object");
		expect(brandSourceLabel(material, "zh")).toBe("GPT Image · 实物");
		const animal = {
			...project,
			family: { ...project.family, series: "character" as const },
		};
		expect(brandSourceLabel(animal, "en")).toBe("GPT Image · Animal");
	});
});
