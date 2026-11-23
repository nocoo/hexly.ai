import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { agentGuide, agentGuidePath } from "../../src/model/agent-guide";
import { assetUrl, cdnImage } from "../../src/model/assets";
import {
	agentFiles,
	applyPageToHtml,
	discoveryPages,
	llmsDocument,
	pageForPath,
} from "../../src/model/discovery";

const projects = readProjects();

describe("page-specific agent handoffs", () => {
	it("keeps Brand instructions separate from template composition and publication", () => {
		for (const locale of ["en", "zh"] as const) {
			const guide = agentGuide("/brand", projects, locale);
			expect(guide.path).toBe("/agents/brand.md");
			expect(guide.body).toContain("Hexly brand usage");
			expect(guide.body).toContain("Space Grotesk");
			expect(guide.body).toContain("16, 24, 32, 48, 64, 96, 128, 256");
			expect(guide.body).toContain("unpublished candidate");
			expect(guide.body).not.toContain("Choose any of the five");
		}
	});
	it("describes Chrome store links as installation destinations in HTML and agent handoffs", () => {
		for (const id of ["hooky", "r2shot"]) {
			const project = projects.find((p) => p.id === id);
			const guide = agentGuide(`/projects/${id}`, projects);
			expect(guide.body).toContain(
				`Install from Chrome Web Store: ${project?.website}`,
			);
			expect(guide.body).not.toContain(`Website: ${project?.website}`);
			expect(pageForPath(`/projects/${id}`, projects).bodyHtml).toContain(
				`href="${project?.website}">Add to Chrome</a>`,
			);
		}
	});
	it("exposes optional screenshot originals, smaller previews and provenance to agents", () => {
		for (const id of ["hooky", "r2shot"]) {
			const project = projects.find((p) => p.id === id);
			const guide = agentGuide(`/projects/${id}`, projects);
			const page = pageForPath(`/projects/${id}`, projects);
			for (const shot of project?.media?.screenshots ?? []) {
				expect(guide.body).toContain(assetUrl(shot.src));
				expect(guide.body).toContain(assetUrl(shot.preview ?? shot.src));
				expect(guide.body).toContain(`${shot.width} × ${shot.height}`);
				expect(page.bodyHtml).toContain(
					`<img crossorigin="anonymous" src="${assetUrl(shot.preview ?? shot.src)}"`,
				);
				expect(page.bodyHtml).toContain(`href="${assetUrl(shot.src)}"`);
				expect(
					guide.resources.some((resource) =>
						resource.href.endsWith(shot.source ?? "missing"),
					),
				).toBe(true);
			}
		}
	});
	it("publishes one discoverable Markdown guide per canonical page from the same content", () => {
		const pages = discoveryPages(projects);
		const files = agentFiles(projects);
		expect(files).toHaveLength(pages.length);
		expect(new Set(files.map((file) => file.fileName)).size).toBe(files.length);
		for (const page of pages) {
			const guide = agentGuide(page.path, projects);
			expect(
				files.find((file) => `/${file.fileName}` === guide.path)?.source,
			).toBe(guide.body);
			expect(guide.body).toContain(`Page: ${page.canonical}`);
		}
		const shell =
			'<html><head></head><body><div id="root"></div></body></html>';
		const home = applyPageToHtml(shell, pageForPath("/", projects));
		const detail = applyPageToHtml(
			home,
			pageForPath("/projects/pew", projects),
		);
		expect(detail.match(/title="Agent guide"/g)).toHaveLength(1);
		expect(detail).toContain(
			'href="/agents/projects/pew.md" title="Agent guide"',
		);
		expect(llmsDocument(projects)).toContain("/agents/index.md");
	});

	it("keeps original identities, their hashes and actual prompt/brief provenance distinct", () => {
		for (const project of projects) {
			const guide = agentGuide(`/projects/${project.id}`, projects);
			expect(guide.body).toContain(
				assetUrl(cdnImage(project.logo.original, project.logo.display)),
			);
			expect(guide.body).toContain(project.logo.sha256);
			expect(guide.body).toContain(
				project.archived ? "state: archived" : "state: active",
			);
			if (project.family) {
				const supplied = !!project.family.method;
				expect(guide.resources).toContainEqual({
					label: supplied ? "Presentation brief" : "Exact generation prompt",
					href: assetUrl(
						`${project.family.root}/${supplied ? "brief" : "prompt"}.txt`,
					),
				});
				expect(guide.body).toContain(project.family.foreground.sha256);
			}
			if (project.brandKit)
				expect(guide.body).toContain(
					assetUrl(`${project.brandKit.root}/manifest.json`),
				);
		}
	});

	it("distinguishes a first-identity review candidate from a source project identity", () => {
		const original = projects.find((project) => project.id === "frogie");
		if (!original?.family) throw new Error("Missing family fixture");
		const candidate = {
			...original,
			logo: { ...original.logo, kind: "candidate" as const },
			family: { ...original.family, status: "review" as const, previous: null },
		};
		const guide = agentGuide(`/projects/${candidate.id}`, [candidate]);
		expect(guide.body).toContain(
			"Hexly review candidate (not adopted by the source project)",
		);
		expect(guide.body).toContain(`Candidate SHA-256: ${candidate.logo.sha256}`);
		expect(guide.body).not.toContain("Original project identity:");
	});

	it("describes monitoring semantics without inventing a live health result", () => {
		const text = agentGuide("/status", projects).body;
		expect(text).toContain("GET /api/status");
		expect(text).toContain("five minutes");
		expect(text).toContain("seven days");
		expect(text).toContain("UTC");
		expect(text).toContain("login pages are never healthy");
		expect(text).toContain("Local development uses labelled mock data");
	});

	it("builds catalogue and gallery guide paths and instructions", () => {
		expect(agentGuidePath("/")).toBe("/agents/index.md");
		expect(agentGuidePath("/logos?sort=az#brand")).toBe("/agents/logos.md");
		const gallery = agentGuide("/logos", projects);
		expect(gallery.path).toBe("/agents/logos.md");
		expect(gallery.body).toContain("# Hexly identity gallery");
	});
});
