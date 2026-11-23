import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { textureManifestProblems } from "../../src/model/brand-manifest";
import { projectApi } from "../../src/model/project-api";

const ids = ["mao", "hackernews-on-this-day", "pi-superagent"];
const projects = readProjects();
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));

describe("2026-11-12 local project onboarding", () => {
	it.each(ids)(
		"%s preserves approved identities and honest source status",
		async (id) => {
			const project = projects.find((item) => item.id === id);
			if (!project?.family || !project.presentationIcon) throw new Error(id);
			const { family } = project;
			expect(project.category).toBe("tools");
			const profile = await json(
				"docs/sources/profile-onboarding-2026-11-12.json",
			);
			expect(project.source.profileRevision).toBe(profile.revision);
			expect(project.source.profileSection).toBe(profile.section);
			expect(
				profile.entries.find(
					(entry: { repo: string }) => entry.repo === project.repo,
				),
			).toMatchObject({
				emoji: project.emoji,
				description: project.description.en,
			});
			const status = project.source.statusEvidence;
			if (!status) throw new Error(`${id}: missing status evidence`);
			const evidenceBytes = await readFile(status.path);
			expect(sha(evidenceBytes)).toBe(status.sha256);
			const evidence = JSON.parse(evidenceBytes.toString());
			expect(
				evidence.repositories.find(
					(item: { name: string }) => item.name === id,
				),
			).toMatchObject({
				archived: false,
				fork: false,
				revision: project.source.repositoryRevision,
			});
			expect(project.overview?.verified.readmes).toEqual({
				en: "README.md",
				zh: "README.md",
			});
			expect(family.status).toBe("review");
			expect(
				await sharp(`public${family.foreground.display}`).metadata(),
			).toMatchObject({ format: "webp", width: 1024, height: 1024 });
			const icon = await json(
				`public${project.presentationIcon.root}/manifest.json`,
			);
			expect(icon.inspection.opaqueForegroundRgbUnchanged).toBe(true);
			expect(icon.foreground.sha256).toBe(family.foreground.sha256);
			if (id === "mao") {
				expect(project.theme).toMatchObject({
					primary: { value: "#d6251a", source: "styles.css --c-red" },
					background: { value: "#eee5d2", source: "styles.css --c-paper" },
					ink: { value: "#13100f", source: "styles.css --c-ink" },
				});
				expect(project.logo.kind).toBe("original");
				expect(family.previous?.sha256).toBe(project.logo.sha256);
				expect(projectApi(project).brand.originalSha256).toBe(
					project.logo.sha256,
				);
			} else {
				expect(project.logo.kind).toBe("candidate");
				expect(family.previous).toBeNull();
				expect(projectApi(project).brand.originalSha256).toBeNull();
				expect(
					projectApi(project).logos.find((logo) => logo.id === "original")
						?.role,
				).toBe("hexly-campaign");
			}
		},
		30_000,
	);

	it.each(ids)(
		"%s preserves both approved texture sources and measured contrast",
		async (id) => {
			const project = projects.find((item) => item.id === id);
			if (!project?.brandTexture) throw new Error(id);
			const { root } = project.brandTexture;
			const manifest = await json(`public${root}/manifest.json`);
			const provenance = await json(`public${root}/provenance.json`);
			expect(textureManifestProblems(manifest)).toEqual([]);
			expect(provenance.contrast.lightMinimum).toBeGreaterThanOrEqual(4.7);
			expect(provenance.contrast.darkMinimum).toBeGreaterThanOrEqual(4.7);
			for (const theme of ["light", "dark"]) {
				expect(
					await sharp(`public${root}/texture-${theme}.webp`).metadata(),
				).toMatchObject({ format: "webp", width: 1024, height: 1024 });
				expect(
					await sharp(`public${root}/texture-${theme}-320.webp`).metadata(),
				).toMatchObject({ format: "webp", width: 320, height: 320 });
			}
		},
	);
});
