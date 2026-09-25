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
		expect(projects.at(-7)?.id).toBe(project.id);
		expect(filterProjects(projects, "", "all").at(-3)?.id).toBe(project.id);
		expect(filterProjects(projects, "", "tools").at(-1)?.id).toBe(project.id);
		expect(
			statusTargets(projects).some((target) => target.id === project.id),
		).toBe(false);
		expect(brandSourceLabel(project, "en")).toBe("GPT Image · Object");
	});

	it("preserves the approved first Logo and truthful generation/adoption records", async () => {
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
			madeInThisRelease: false,
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

	it("keeps the published SVG service-mat archives and their exact identity/Hero bytes", async () => {
		const root = "public/brands/pi-agent-policy/v1.0.2";
		const parentRoot = "public/brands/pi-agent-policy/v1.0.0";
		expect(sha(await readFile(`${parentRoot}/manifest.json`))).toBe(
			"eef04f8b568759b2e6623dd41607a323ce5829c50792b288037938e3bf1e5d56",
		);
		const parent = await json(`${parentRoot}/manifest.json`);
		const current = await json(`${root}/manifest.json`);
		const pilotRoot = "public/brands/pi-agent-policy/v1.0.1";
		expect(sha(await readFile(`${pilotRoot}/manifest.json`))).toBe(
			"1a48a57b289873f9db4180a8f92aa519e9798d32440f934ff1cb3cb098923f42",
		);
		const pilot = await json(`${pilotRoot}/manifest.json`);
		for (const file of pilot.files)
			expect(sha(await readFile(`public${file.path}`)), file.path).toBe(
				file.sha256,
			);
		const permitted = new Set([
			"texture-light.svg",
			"texture-dark.svg",
			"texture-light.png",
			"texture-dark.png",
			"tokens.json",
			"provenance.json",
			"guide.md",
			"review.html",
			"review.css",
		]);
		for (const file of parent.files) {
			const name = file.path.split("/").at(-1);
			expect(sha(await readFile(`public${file.path}`)), file.path).toBe(
				file.sha256,
			);
			if (!permitted.has(name))
				expect(sha(await readFile(`${root}/${name}`)), name).toBe(file.sha256);
		}
		expect(current.files).toHaveLength(parent.files.length);
		for (const theme of ["light", "dark"]) {
			const before = await readFile(
				`${parentRoot}/texture-${theme}.svg`,
				"utf8",
			);
			const preserved = await readFile(
				`${pilotRoot}/texture-${theme}.svg`,
				"utf8",
			);
			expect(preserved.match(/<path d="[^"]*"/g)).toEqual(
				before.match(/<path d="[^"]*"/g),
			);
			expect(await readFile(`${root}/texture-${theme}.svg`, "utf8")).not.toBe(
				preserved,
			);
		}
		const oldProvenance = await json(`${parentRoot}/provenance.json`);
		for (const key of ["tool", "recipe", "typographyTool"])
			expect(sha(await readFile(oldProvenance.build[key]))).toBe(
				oldProvenance.build[`${key}Sha256`],
			);
		expect(project.brandKit?.previousVersion).toBe("1.0.2");
		const provenance = await json(`${root}/provenance.json`);
		expect(provenance.texture.productEvidence.repositoryRevision).toBe(
			project.source.repositoryRevision,
		);
		expect(sha(await readFile(provenance.texture.source))).toBe(
			provenance.texture.sourceSha256,
		);
		expect(provenance.texture.presentation).toMatchObject({
			decorative: true,
			gridPitchPx: 32,
			specimenTileCssPx: 256,
		});
	});

	it("uses approved Flare raster surfaces without changing the Logo or claiming seamless SVG", async () => {
		expect(project.brandKit?.texture).toMatchObject({
			format: "webp",
			display: "single",
			model: "gpt-image-2.5-flare",
		});
		const manifest = await json(`${root}/manifest.json`);
		const previous = await json(
			"public/brands/pi-agent-policy/v1.0.2/manifest.json",
		);
		expect(manifest.texture).toMatchObject({
			method: "gpt-image",
			repeat: false,
			crop: false,
			newGenerationCalls: 2,
		});
		for (const file of previous.files) {
			expect(sha(await readFile(`public${file.path}`))).toBe(file.sha256);
			const name = file.path.split("/").at(-1);
			if (
				!/^(texture-|tokens\.json|provenance\.json|guide\.md|review\.(html|css)|license\.txt)/.test(
					name,
				)
			)
				expect(sha(await readFile(`${root}/${name}`)), name).toBe(file.sha256);
		}
		for (const theme of ["light", "dark"]) {
			const approval = await json(
				`${root}/source-texture-${theme}-raw-review.json`,
			);
			const request = await json(
				`${root}/source-texture-${theme}-request.json`,
			);
			const response = await json(
				`${root}/source-texture-${theme}-response.json`,
			);
			expect(approval).toMatchObject({
				status: "approved",
				ownerReviewedExactBytes: true,
			});
			expect(request.parameters.model).toBe("gpt-image-2.5-flare");
			expect(sha(await readFile(`${root}/texture-${theme}.png`))).toBe(
				approval.imageSha256,
			);
			expect(approval.imageSha256).toBe(response.outputs[0].sha256);
			expect(sha(await readFile(`${root}/texture-${theme}-prompt.txt`))).toBe(
				request.promptSha256,
			);
			expect(
				manifest.files.some((file: { path: string }) =>
					file.path.endsWith(`texture-${theme}.svg`),
				),
			).toBe(false);
		}
	});
});
