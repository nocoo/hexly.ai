import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";

describe("sleepy and rhino onboarding", () => {
	it.each(["sleepy", "rhino"])(
		"keeps %s identity and product evidence aligned",
		(id) => {
			const project = readProjects().find((entry) => entry.id === id);
			expect(project).toBeDefined();
			expect(project?.archived).toBe(false);
			expect(project?.category).toBe("everyday");
			expect(project?.website).toBe(`https://${id}.hexly.ai`);
			expect(project?.family?.status).toBe("adopted");
			expect(project?.family?.model).toBe("gpt-image-2.5-sunburst");
			expect(project?.logo.sha256).toBe(project?.family?.foreground.sha256);
			expect(project?.brandTexture).toMatchObject({
				root: `/textures/${id}/v1.0.1`,
				scope: "hexly-campaign",
				model: "gpt-image-2.5-flare",
				format: "webp",
				display: "single",
			});
			expect(project?.overview?.verified.snapshot?.path).toBe(
				`docs/sources/${id}-2026-10-09.json`,
			);
		},
	);

	it("keeps the material override and the former crescent identity", () => {
		const sleepy = readProjects().find((entry) => entry.id === "sleepy");
		const rhino = readProjects().find((entry) => entry.id === "rhino");
		expect(sleepy?.family?.series).toBe("material");
		expect(sleepy?.family?.previous).not.toBeNull();
		expect(rhino?.family?.previous).toBeNull();
	});
});
