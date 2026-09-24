import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import {
	projectApi,
	projectApiPath,
	projectApiPrompt,
} from "../../src/model/project-api";

const projects = readProjects();
const project = (id: string) => {
	const result = projects.find((item) => item.id === id);
	if (!result) throw new Error(id);
	return result;
};

describe("single-project integration contract", () => {
	it("uses repository names rather than catalogue slugs and preserves bilingual content", () => {
		const p = project("life-ai");
		expect(
			projectApiPath({
				...p,
				repo: "LIFE.AI",
				repository: "https://github.com/NOCOO/life.ai",
			}),
		).toBe("/api/projects/nocoo/life.ai");
		expect(projectApi(p)).toMatchObject({
			schemaVersion: 1,
			id: "life-ai",
			owner: "nocoo",
			repo: "life.ai",
			github: p.repository,
			description: p.description,
		});
		expect(projectApi(p)).not.toHaveProperty("projects");
		const other = {
			...p,
			repository: "https://github.com/another-owner/life.ai",
		};
		expect(projectApiPath(other)).toBe("/api/projects/another-owner/life.ai");
		expect(projectApi(other).owner).toBe("another-owner");
	});
	it("offers small/large transparent identity icons and opaque presentation sizes", () => {
		const p = project("rio");
		const result = projectApi(p);
		expect(result.icons).toEqual({
			small: assetUrl(`${p.brandKit?.root}/mark-64.png`),
			large: assetUrl(`${p.brandKit?.root}/mark-512.png`),
		});
		expect(result.logos.find((l) => l.id === "transparent-16")).toMatchObject({
			width: 16,
			background: "transparent",
			role: "project-identity",
		});
		expect(
			result.logos
				.filter((l) => l.id.startsWith("background-"))
				.map((l) => l.width),
		).toEqual([32, 64, 160, 256, 512, 1024, 2048]);
		expect(result.logos.find((l) => l.id === "tile-dark-512")).toMatchObject({
			background: "opaque",
			theme: "dark",
			role: "hexly-campaign",
		});
	});
	it("does not promote review artwork to a product identity", () => {
		const p = project("basalt");
		const result = projectApi(p);
		expect(result.icons.small).toBe(assetUrl("/logos/display/basalt-64.webp"));
		expect(result.logos.find((l) => l.id === "transparent-32")?.role).toBe(
			"hexly-campaign",
		);
	});
	it("preserves limited and archived identities without manufacturing variants", () => {
		const p = project("express-spa");
		const result = projectApi(p);
		expect(result.archived).toBe(true);
		expect(result.website).toBeNull();
		expect(result.brand.manifest).toBeNull();
		expect(result.logos).toHaveLength(7);
		expect(result.logos.filter((l) => l.background === "opaque")).toHaveLength(
			0,
		);
		expect(
			projectApi(project("infoviz")).logos.every(
				(l) => l.background === "original",
			),
		).toBe(true);
		const withoutKit = { ...project("rio"), brandKit: undefined };
		expect(
			projectApi(withoutKit).logos.some((l) => l.id === "transparent-32"),
		).toBe(false);
	});
	it("provides unique assets and copyable integration instructions for every repository", () => {
		for (const p of projects) {
			const result = projectApi(p);
			expect(new Set(result.logos.map((l) => l.id)).size).toBe(
				result.logos.length,
			);
			expect(
				result.logos.every((l) => l.url.startsWith("https://h.no.mt/")),
			).toBe(true);
			for (const locale of ["en", "zh"] as const) {
				const prompt = projectApiPrompt(p, locale);
				expect(prompt).toContain(`https://hexly.ai${projectApiPath(p)}`);
				expect(prompt).toContain(`project.description.${locale}`);
				expect(prompt).toContain('background="transparent"');
				expect(prompt).toContain('role="hexly-campaign"');
				expect(prompt).toContain("one hour");
			}
		}
	});
});
