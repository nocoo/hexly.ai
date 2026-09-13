import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { brandSourceLabel } from "../../src/model/brand";
import { filterProjects } from "../../src/model/catalogue";
import { statusTargets } from "../../src/model/status";

const projects = readProjects();
const project = projects.find((p) => p.id === "pi-agent-policy");
if (!project?.brandKit || !project.family)
	throw new Error("Missing new identity");
const root = `public${project.brandKit.root}`;
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));

describe("Pi Agent Policy onboarding", () => {
	it("is a first material-tool identity at the end of the catalogue without a fictional website", () => {
		expect(project.category).toBe("tools");
		expect(project.family).toMatchObject({
			series: "material",
			previous: null,
			status: "adopted",
		});
		expect(project.website).toBeNull();
		expect(project.websiteSource).toBeNull();
		expect(projects.at(-1)?.id).toBe(project.id);
		for (const category of ["all", "tools"] as const)
			expect(filterProjects(projects, "", category).at(-1)?.id).toBe(
				project.id,
			);
		expect(
			statusTargets(projects).some((target) => target.id === project.id),
		).toBe(false);
		expect(brandSourceLabel(project, "en")).toBe("GPT Image · Object");
	});

	it("preserves the approved first Logo and truthful generation/adoption records", async () => {
		const source = await json("docs/sources/pi-agent-policy-2026-09-14.json");
		const provenance = await json(`${root}/provenance.json`);
		expect(source).toMatchObject({
			visibility: "private",
			packageVersion: "0.1.2",
			brandVersion: "1.0.0",
			firstIndependentIdentity: true,
		});
		expect(project.brandKit?.sourceAdoptionRevision).toBe(
			source.sourceAdoptionRevision,
		);
		expect(project.source.repositoryRevision).toBe(
			source.sourceAdoptionRevision,
		);
		expect(project.source.profileRevision).toBe(source.profileRevision);
		expect(sha(await readFile(`public${project.logo.original}`))).toBe(
			"c090785742f29fbaed227af799e5555a49b20449c5f37cdea5fb826fae1d3611",
		);
		expect(provenance.generation).toMatchObject({
			model: "gpt-image-2",
			batch: "2026-09-14-03",
			madeInThisRelease: true,
			newGenerationCallsDuringKitAssembly: 0,
		});
		expect(provenance.generation.raw.sha256).toBe(
			"71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85",
		);
		expect(sha(await readFile(`public${provenance.generation.raw.path}`))).toBe(
			provenance.generation.raw.sha256,
		);
		const approval = await json(`${root}/source-raw-review.json`);
		expect(approval).toMatchObject({
			status: "approved",
			ownerReviewedExactBytes: true,
			imageSha256: provenance.generation.raw.sha256,
		});
		for (const record of provenance.records) {
			const original = await readFile(record.path);
			const exported = await readFile(`public${record.export}`);
			expect(exported.equals(original), record.path).toBe(true);
			expect(sha(exported), record.path).toBe(record.sha256);
			expect(record.url).toBe(`https://h.no.mt${record.export}`);
		}
		for (const key of ["tool", "recipe", "typographyTool"])
			expect(sha(await readFile(provenance.build[key]))).toBe(
				provenance.build[`${key}Sha256`],
			);
		expect(provenance.finishing).toMatchObject({
			firstIndependentIdentity: true,
			sourceAdoptionRevision: source.sourceAdoptionRevision,
		});
	});
});
