import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { brandSourceLabel } from "../../src/model/brand";
import { statusTargets } from "../../src/model/status";

const projects = readProjects();
const project = projects.find((p) => p.id === "pi-agent-policy");
if (!project?.brandKit || !project.family)
	throw new Error("Missing Pi Agent Policy identity");
const root = `public${project.brandKit.root}`;
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));

describe("Pi Agent Policy onboarding", () => {
	it("retains its archived material-tool identity without a fictional website", () => {
		expect(project.category).toBe("tools");
		expect(project.family).toMatchObject({
			series: "material",
			previous: null,
			status: "adopted",
		});
		expect(project.website).toBeNull();
		expect(project.websiteSource).toBeNull();
		expect(project.archived).toBe(true);
		expect(
			statusTargets(projects).some((target) => target.id === project.id),
		).toBe(false);
		expect(brandSourceLabel(project, "en")).toBe("GPT Image · Object");
	});

	it("preserves truthful generation/adoption metadata and lean WebP delivery in v1.0.3", async () => {
		const source = await json("docs/sources/pi-agent-policy-2026-09-14.json");
		const provenance = await json(`${root}/provenance.json`);
		const profile = await readFile(
			"docs/profiles/77-pi-agent-policy.md",
			"utf8",
		);
		expect(profile).toContain("Owner-approved GPT Image raster identity");
		expect(profile).not.toContain("Original vector identity commissioned");
		expect(source).toMatchObject({
			visibility: "private",
			packageVersion: "0.1.2",
			brandVersion: "1.0.0",
			firstIndependentIdentity: true,
		});
		expect(project.brandKit?.version).toBe("1.0.3");
		expect(project.logo.sha256).toBe(
			"c090785742f29fbaed227af799e5555a49b20449c5f37cdea5fb826fae1d3611",
		);
		expect(provenance.generation).toMatchObject({
			model: "gpt-image-2",
			batch: "2026-09-14-03",
			madeInThisRelease: false,
			newGenerationCallsDuringKitAssembly: 0,
		});
		const approval = await json(`${root}/source-raw-review.json`);
		expect(approval).toMatchObject({
			status: "approved",
			ownerReviewedExactBytes: true,
			imageSha256: provenance.generation.raw.sha256,
		});
		for (const file of [
			"hero.webp",
			"hero-dark.webp",
			"lockup-light.webp",
			"lockup-dark.webp",
			"mark-512.webp",
			"texture-light.webp",
			"texture-dark.webp",
		]) {
			const meta = await sharp(`${root}/${file}`).metadata();
			expect(meta.format, file).toBe("webp");
		}
		expect(sha(await readFile(`${root}/manifest.json`))).toMatch(
			/^[a-f0-9]{64}$/,
		);
	});
});
