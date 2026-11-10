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
			if (!project.presentationIcon && project.archived) continue;
			if (!project.family) {
				expect(project.presentationIcon).toBeUndefined();
				if (project.archived) continue;
				const api = projectApi(project);
				for (const url of [api.icons.small, api.icons.large])
					expect(
						inventory.files.some(
							(file) => `https://h.no.mt/${file.key}` === url,
						),
					).toBe(true);
				expect(api.logos.find((logo) => logo.id === "original")?.role).toBe(
					"project-identity",
				);
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
	it("rejects foreign icon paths and false native dimensions", () => {
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
		expect(catalogueProblems([{ ...p, archived: true }])).toEqual([]);
		expect(catalogueProblems([{ ...p, family: undefined }])).toContain(
			"Invalid presentation icon: frogie",
		);
	});
});
