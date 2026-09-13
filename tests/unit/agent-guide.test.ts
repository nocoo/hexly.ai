import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import examples from "../../src/data/template-examples.json" with {
	type: "json",
};
import {
	agentGuide,
	agentGuidePath,
	outroInstructions,
	standardOutros,
} from "../../src/model/agent-guide";
import { assetUrl } from "../../src/model/assets";
import {
	agentFiles,
	applyPageToHtml,
	discoveryPages,
	llmsDocument,
	pageForPath,
} from "../../src/model/discovery";

const projects = readProjects();

describe("page-specific agent handoffs", () => {
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
			expect(page.bodyHtml).toContain(`href="${guide.path}"`);
			expect(page.bodyHtml).toContain('id="agent-guide"');
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
		expect(agentGuidePath("/templates/launch/?project=pew#outros")).toBe(
			"/agents/templates/launch.md",
		);
		expect(llmsDocument(projects)).toContain("/agents/index.md");
	});

	it("keeps original identities, their hashes and actual prompt/brief provenance distinct", () => {
		for (const project of projects) {
			const guide = agentGuide(`/projects/${project.id}`, projects);
			expect(guide.body).toContain(assetUrl(project.logo.original));
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

	it("reuses all five immutable endings across all templates without regeneration", () => {
		expect(standardOutros).toMatchObject({
			usage: "reuse-as-is",
			projectIndependent: true,
		});
		expect(standardOutros.outros).toEqual(examples.examples);
		for (const outro of standardOutros.outros) {
			const text = outroInstructions(outro);
			expect(text).toContain(outro.video.src);
			expect(text).toContain(outro.video.sha256);
			expect(text).toContain(outro.still.sha256);
			expect(text).toContain(
				"no project configuration or regeneration is required",
			);
			const page = pageForPath(`/templates/${outro.template}`, projects);
			for (const other of standardOutros.outros)
				expect(page.bodyHtml).toContain(other.video.src);
			expect(page.bodyHtml).not.toContain("Finished examples");
		}
	});

	it("copies actual composition choices while validating command arguments against the catalogue", () => {
		const selected = agentGuide(
			"/templates/launch?project=pew&theme=dark&opening=stack&ending=split&mode=deck",
			projects,
		).body;
		expect(selected).toContain(
			"--project pew --template launch --theme dark --opening stack --ending split --mode deck",
		);
		expect(selected).toContain("/templates/outros.json");
		expect(agentGuide("/templates/launch", projects, "zh").body).toContain(
			"--locale zh",
		);
		const defaults = agentGuide(
			"/templates/missing?project=not-listed&theme=unknown&opening=unknown&ending=unknown",
			projects,
		).body;
		expect(defaults).toContain(
			"--project hexly-ai --template launch --theme light --opening signal --ending signature --mode video",
		);
		expect(agentGuide("/templates", projects).body).toContain(
			"There are no published dark or intro MP4s",
		);
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
});
