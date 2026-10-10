import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { catalogueProblems } from "../../src/model/catalogue";
import { statusTargets } from "../../src/model/status";

describe("Zoo onboarding", () => {
	it("keeps the approved material identity and independent texture pack aligned", () => {
		const project = readProjects().find((project) => project.id === "zoo");
		expect(project).toBeDefined();
		if (!project) throw new Error("Missing Zoo catalogue entry");
		expect(catalogueProblems([project])).toEqual([]);
		expect(project).toMatchObject({
			category: "tools",
			archived: false,
			website: "https://zoo.hexly.ai",
			family: {
				status: "adopted",
				series: "material",
				model: "gpt-image-2.5-sunburst",
				finishing: "01",
			},
			brandTexture: {
				root: "/textures/zoo/v1.0.1",
				model: "gpt-image-2.5-flare",
				display: "single",
			},
		});
		expect(project.logo.sha256).toBe(project.family?.foreground.sha256);
		expect(project.family?.previous?.sourceUrl).toContain("public/favicon.svg");
	});

	it("includes the independent public health endpoint exactly once", () => {
		expect(
			statusTargets(readProjects()).filter((target) => target.id === "zoo"),
		).toEqual([{ id: "zoo", endpoint: "https://zoo.hexly.ai/api/live" }]);
	});
});
