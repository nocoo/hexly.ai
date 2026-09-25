import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import baseline from "../../docs/brand-textures/2026-09-14/inventory.json";
import scope from "../../docs/brand-textures/2026-09-14/scope-update.json";
import { readProjects } from "../../src/data/read-projects";
import { agentGuide } from "../../src/model/agent-guide";
import { assetUrl } from "../../src/model/assets";
import {
	brandTexture,
	brandTextureAsset,
	projectTexture,
} from "../../src/model/brand";
import { textureManifestProblems } from "../../src/model/brand-manifest";
import { catalogueProblems } from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";

const projects = readProjects();
const baselineProjects = projects.filter((p) =>
	baseline.projects.some((row) => row.id === p.id),
);
const sha = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));
const fixture = await json("public/textures/frogie/v1.0.0/manifest.json");

describe("independent campaign textures", () => {
	it("covers active projects, retains completed archives and preserves original identity and old kits", async () => {
		expect(baselineProjects.map((p) => p.id)).toEqual(
			baseline.projects.map((p) => p.id),
		);
		expect(
			baselineProjects
				.filter((p) => p.brandTexture)
				.map((p) => p.id)
				.sort(),
		).toEqual(
			[...scope.activeProjectIds, ...scope.retainedArchivedProjectIds].sort(),
		);
		expect(baselineProjects.filter((p) => p.brandTexture)).toHaveLength(
			scope.expectedNewPackCount,
		);
		for (const project of baselineProjects) {
			const row = baseline.projects.find((p) => p.id === project.id);
			if (!row) throw new Error(project.id);
			expect(project.logo, project.id).toMatchObject({
				original: row.officialProjectIdentity.path,
				sha256: row.officialProjectIdentity.sha256,
				width: row.officialProjectIdentity.width,
				height: row.officialProjectIdentity.height,
				bytes: row.officialProjectIdentity.bytes,
				sourceUrl: row.officialProjectIdentity.source,
				kind: row.officialProjectIdentity.kind,
				modified: false,
			});
			const original = await readFile(`public${project.logo.original}`);
			expect(sha(original), project.id).toBe(
				row.officialProjectIdentity.sha256,
			);
			expect(
				sha(await sharp(original).ensureAlpha().raw().toBuffer()),
				project.id,
			).toBe(row.officialProjectIdentity.rgbaSha256);
			if (row.existingKit)
				expect(
					sha(await readFile(`public${row.existingKit.root}/manifest.json`)),
					project.id,
				).toBe(row.existingKit.manifestSha256);
		}
		const pi = projects.find((p) => p.id === "pi-agent-policy");
		expect(pi?.brandTexture).toBeUndefined();
		expect(pi?.brandKit?.version).toBe("1.0.3");
		expect(catalogueProblems(projects)).toEqual([]);
	}, 30_000);

	it("excludes archived projects from new generation even with the old inclusive inventory", () => {
		const args = [
			".agents/skills/hexly-brand-textures/scripts/generate.py",
			"--inventory",
			"docs/brand-textures/2026-09-14/inventory.json",
		];
		const plan = spawnSync("python3", args, { encoding: "utf8" });
		expect(plan.status, plan.stderr).toBe(0);
		expect(JSON.parse(plan.stdout).projects).toEqual(
			scope.activeProjectIds.filter((id) => id !== "hermes-on-herdr"),
		);
		const archived = spawnSync("python3", [...args, "--project", "infoviz"], {
			encoding: "utf8",
		});
		expect(archived.status).toBe(2);
		expect(archived.stderr).toContain(
			"archived entries receive basic support only",
		);
	});

	it.each(projects.filter((p) => p.brandTexture))(
		"$id exports exact approved light/dark pixels, sources and lightweight delivery",
		async (project) => {
			const texture = project.brandTexture;
			if (!texture) throw new Error(`Missing texture: ${project.id}`);
			const manifest = await json(`public${texture.root}/manifest.json`);
			expect(textureManifestProblems(manifest)).toEqual([]);
			expect(manifest.catalogue).toEqual(texture);
			const provenance = await json(`public${texture.root}/provenance.json`);
			expect(provenance.delivery).toMatchObject({
				crop: false,
				recolor: false,
				repeat: false,
			});
			expect(provenance.contrast.lightMinimum).toBeGreaterThanOrEqual(4.7);
			expect(provenance.contrast.darkMinimum).toBeGreaterThanOrEqual(4.7);
			for (const file of manifest.files) {
				const bytes = await readFile(`public${file.path}`);
				expect(bytes.length, file.path).toBe(file.bytes);
				expect(sha(bytes), file.path).toBe(file.sha256);
			}
			for (const generation of manifest.generations) {
				const raw = await readFile(`public${generation.raw.path}`);
				expect(raw.equals(await readFile(`${generation.source}/raw.png`))).toBe(
					true,
				);
				const request = await json(`public${generation.request}`);
				const response = await json(`public${generation.response}`);
				const review = await json(`public${generation.approval}`);
				expect(request.parameters).toMatchObject({
					model: "gpt-image-2.5-flare",
					size: "1024x1024",
					quality: "high",
					n: 1,
				});
				expect(request.promptSha256).toBe(
					sha(await readFile(`public${generation.prompt}`)),
				);
				expect(response).toMatchObject({
					status: "succeeded",
					httpStatus: 200,
					outputs: [{ sha256: sha(raw), width: 1024, height: 1024 }],
				});
				expect(review).toMatchObject({
					status: "approved",
					imageSha256: sha(raw),
					acceptance: generation.acceptance,
					ownerReviewedExactBytes: generation.ownerReviewedExactBytes,
					inspection: {
						fullCanvas: true,
						productionCrop: false,
						repeat: false,
					},
				});
				for (const size of [1024, 320]) {
					const path = brandTextureAsset(
						texture,
						generation.theme,
						size === 320,
					);
					const bytes = await readFile(`public${path}`);
					expect(await sharp(bytes).metadata()).toMatchObject({
						width: size,
						height: size,
						format: "webp",
					});
					if (size === 320) expect(bytes.length).toBeLessThan(60_000);
				}
			}
			const guide = agentGuide(`/projects/${project.id}`, projects).body;
			expect(guide).toContain(assetUrl(`${texture.root}/manifest.json`));
			expect(guide).toContain(
				assetUrl(`${texture.root}/texture-dark-prompt.txt`),
			);
			expect(guide).toContain("independent of the identity kit");
		},
	);

	it("selects current textures independently of legacy kits, including archived projects", () => {
		const project = projects[0];
		if (!project) throw new Error("Missing fixture");
		const selected = { ...project, brandTexture: fixture.catalogue };
		expect(projectTexture(selected)).toEqual(fixture.catalogue);
		expect(brandTexture(selected)?.["--brand-texture-light"]).toContain(
			"/projects/frogie/textures/v1.0.0/texture-light-320.webp",
		);
		expect(brandTexture(selected)?.["--brand-texture-opacity"]).toBe(
			fixture.catalogue.surfaceOpacity,
		);
		expect(projectTexture({})).toBeUndefined();
		expect(projectTexture({ brandKit: project.brandKit })).toMatchObject({
			root: project.brandKit?.root,
		});
		for (const change of [
			null,
			{ root: "/textures/wrong/v1.0.0" },
			{ version: "next" },
			{ scope: "product-ui" },
			{ format: "svg" },
			{ display: "repeat" },
			{ model: "invented" },
			{ name: { en: "Only one locale" } },
			{ description: null },
			{ surfaceOpacity: 0 },
			{ surfaceOpacity: 1.1 },
			{ surfaceOpacity: Number.NaN },
		]) {
			const bad = {
				...project,
				brandTexture:
					change === null ? null : { ...fixture.catalogue, ...change },
			} as Project;
			expect(catalogueProblems([bad])).toContain(
				"Invalid project texture: frogie",
			);
		}
	});

	it("rejects misattribution, unsafe paths, missing themes and fabricated acceptance", () => {
		expect(textureManifestProblems(fixture)).toEqual([]);
		expect(
			textureManifestProblems({
				...fixture,
				generations: fixture.generations.map((generation: object) => ({
					...generation,
					acceptance: "owner",
					ownerReviewedExactBytes: true,
				})),
			}),
		).toEqual([]);
		expect(textureManifestProblems({}).length).toBeGreaterThan(0);
		const source = fixture.generations[0];
		for (const change of [
			null,
			[],
			{ schemaVersion: 2 },
			{ project: "../other" },
			{ version: "latest" },
			{ root: "/textures/other/v1.0.0" },
			{ canonical: "https://hexly.ai/" },
			{ scope: { ...fixture.scope, officialIdentityRecolored: true } },
			{
				officialProjectIdentity: {
					...fixture.officialProjectIdentity,
					rgbaSha256: "missing",
				},
			},
			{ files: [] },
			{ files: [...fixture.files, fixture.files[0]] },
			{
				files: [
					{ ...fixture.files[0], path: `${fixture.root}/../outside.png` },
				],
			},
			{ files: [{ ...fixture.files[0], bytes: 0 }] },
			{ generations: [] },
			{ generations: [source, source] },
			{
				generations: [
					{ ...source, model: "handmade-svg" },
					fixture.generations[1],
				],
			},
			{
				generations: [
					{ ...source, ownerReviewedExactBytes: true },
					fixture.generations[1],
				],
			},
			{ generations: [{ ...source, crop: true }, fixture.generations[1]] },
			{
				generations: [
					{ ...source, raw: { ...source.raw, sha256: "a".repeat(64) } },
					fixture.generations[1],
				],
			},
		]) {
			expect(
				textureManifestProblems(
					change && !Array.isArray(change) ? { ...fixture, ...change } : change,
				).length,
			).toBeGreaterThan(0);
		}
	});
});
