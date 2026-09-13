import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import {
	catalogueProblems,
	categoryCounts,
	destination,
	filterProjects,
	loadProjects,
	parseCatalogue,
	selectedProject,
} from "../../src/model/catalogue";
import type { Project, ProjectOverview } from "../../src/model/project";

const projects = readProjects();
const active = projects.filter((project) => !project.archived);
const frogie = projects.find((project) => project.id === "frogie");
if (!frogie) throw new Error("Frogie is required as the reference identity.");
const overview: ProjectOverview = {
	goal: { en: "Inspect network routes.", zh: "检查网络路由。" },
	techStack: [{ name: "TypeScript", role: { en: "CLI", zh: "命令行" } }],
	verified: {
		date: "2026-09-08",
		revision: "a".repeat(40),
		sources: ["package.json", "src/index.ts"],
	},
};

describe("the imported project catalogue", () => {
	it("omits Snail after its bookmark and Connector capabilities merge into Zhe", () => {
		expect(projects.some((project) => project.id === "snail")).toBe(false);
		expect(projects.find((project) => project.id === "zhe")?.website).toBe(
			"https://zhe.to",
		);
	});
	it("includes the listed projects with bilingual metadata and local assets", () => {
		expect(projects).toHaveLength(74);
		expect(catalogueProblems(projects)).toEqual([]);
		expect(
			projects.filter((project) => project.logo.kind === "original"),
		).toHaveLength(60);
	});
	it("provides a verified goal and stack for every active project", () => {
		expect(
			active.filter((project) => !project.overview).map(({ id }) => id),
		).toEqual([]);
		for (const project of active) {
			expect(catalogueProblems([project])).toEqual([]);
		}
	});
	it("finds projects by English, Chinese, emoji, repository name, and animal", () => {
		for (const query of [
			"frogie",
			"FROGIE",
			"ｆｒｏｇｉｅ",
			"🐸",
			"本地 工作台",
			"green frog",
		]) {
			expect(filterProjects(projects, query)).toContain(frogie);
		}
	});
	it("combines category and multiword search without changing the input", () => {
		const before = [...projects];
		expect(filterProjects(projects, "  AI   agents  ", "ai")).toContain(frogie);
		expect(filterProjects(projects, "frogie", "games")).toEqual([]);
		expect(filterProjects(projects, "not-a-real-project")).toEqual([]);
		expect(filterProjects(projects, "  ")).toHaveLength(active.length);
		expect(filterProjects(projects, "  ")).toEqual(
			expect.arrayContaining(active),
		);
		const sorted = filterProjects(projects, "", "all", "az");
		expect(sorted.map((project) => project.title)).toEqual(
			active
				.map((project) => project.title)
				.toSorted((a, b) => a.localeCompare(b, "en")),
		);
		expect(projects).toEqual(before);
	});
	it("hides archived repositories from All while keeping their categories", () => {
		const counts = categoryCounts(projects);
		expect(counts.all).toBe(54);
		expect(counts.archive).toBe(20);
		expect(counts.games).toBe(5);
		expect(counts.all + counts.archive).toBe(projects.length);
		expect(filterProjects(projects, "", "archive")).toEqual(
			projects.filter((project) => project.archived),
		);
		expect(filterProjects(projects, "uptime kuma")).toEqual([]);
		expect(filterProjects(projects, "uptime kuma", "extensions")).toHaveLength(
			1,
		);
		expect(counts.extensions).toBe(
			filterProjects(projects, "", "extensions").length,
		);
		expect(categoryCounts([]).all).toBe(0);
	});
	it("selects a known identity and safely handles unknown or empty selections", () => {
		expect(selectedProject(projects, "pew")?.title).toBe("Pew");
		expect(selectedProject(projects, "missing")).toBe(projects[0]);
		expect(selectedProject([], "missing")).toBeNull();
	});
	it("places Showtime first in Tools while preserving the other curated positions", () => {
		const tools = filterProjects(projects, "", "tools");
		expect(tools[0]?.id).toBe("showtime");
		expect(tools.slice(1)).toEqual(
			filterProjects(
				projects.filter((project) => project.id !== "showtime"),
				"",
				"tools",
			),
		);
		const all = filterProjects(projects, "");
		const showtimeIndex = all.findIndex((project) => project.id === "showtime");
		expect(all[showtimeIndex + 1]?.id).toBe("infospace");
		expect(filterProjects(projects, "", "tools", "az")).toEqual(
			tools.toSorted((a, b) => a.title.localeCompare(b.title, "en")),
		);
	});
	it("uses evidenced website links and falls back to repository links", () => {
		expect(destination(frogie)).toBe("https://github.com/nocoo/frogie");
		expect(destination({ ...frogie, website: "https://pew.md" })).toBe(
			"https://pew.md",
		);
	});
	it("rejects incomplete records, duplicate identities, unsafe URLs, and invalid image evidence", () => {
		const damaged: Project = {
			...frogie,
			id: "../bad",
			title: "",
			category: "unknown" as Project["category"],
			website: "javascript:alert(1)",
			logo: {
				...frogie.logo,
				original: "https://remote.test/logo.png",
				sha256: "missing",
				width: 0,
			},
			colors: { ...frogie.colors, primary: "red" },
		};
		expect(catalogueProblems([damaged]).length).toBeGreaterThanOrEqual(7);
		expect(catalogueProblems([frogie, frogie])).toContain(
			"Invalid or duplicate id: frogie",
		);
		for (const field of ["emoji", "description"] as const) {
			const record =
				field === "emoji"
					? { ...frogie, emoji: "" }
					: { ...frogie, description: { en: "", zh: "" } };
			expect(catalogueProblems([record])).toContain(
				"Incomplete identity: frogie",
			);
		}
	});
	it("parses a published catalogue and rejects malformed payloads", () => {
		expect(parseCatalogue(projects)).toEqual(projects);
		expect(() => parseCatalogue({})).toThrow("Catalogue must be a JSON array.");
		expect(() => parseCatalogue([{ ...frogie, id: "../bad" }])).toThrow(
			"Invalid or duplicate id: ../bad",
		);
	});
	it("accepts verified overviews alongside legacy records without research", () => {
		const reviewed = { ...frogie, overview };
		expect(parseCatalogue([reviewed])).toEqual([reviewed]);
		expect(catalogueProblems([{ ...frogie, overview: undefined }])).toEqual([]);
	});
	it("accepts an unpublished project only with a checksummed local snapshot", () => {
		const verified = {
			...overview.verified,
			revision: null,
			snapshot: {
				path: "docs/sources/showtime-2026-09-10.json",
				sha256: "b".repeat(64),
			},
		};
		expect(
			catalogueProblems([{ ...frogie, overview: { ...overview, verified } }]),
		).toEqual([]);
		for (const snapshot of [
			undefined,
			{ ...verified.snapshot, sha256: "missing" },
			{ ...verified.snapshot, path: "../private.json" },
			{ ...verified.snapshot, path: "https://example.com/source.json" },
		]) {
			expect(() =>
				parseCatalogue([
					{
						...frogie,
						overview: { ...overview, verified: { ...verified, snapshot } },
					},
				]),
			).toThrow("Invalid overview evidence: frogie");
		}
	});
	it.each([
		null,
		{ ...overview, goal: { en: " ", zh: "检查网络路由。" } },
		{ ...overview, goal: { en: 123, zh: "检查网络路由。" } },
		{ ...overview, techStack: null },
		{ ...overview, techStack: [] },
		{ ...overview, techStack: [null] },
		{ ...overview, techStack: [{ name: " ", role: overview.goal }] },
		{
			...overview,
			techStack: [{ name: "Swift", role: { en: "Native app" } }],
		},
		{ ...overview, techStack: [...overview.techStack, ...overview.techStack] },
	])("rejects incomplete bilingual overviews: %j", (invalid) => {
		expect(() => parseCatalogue([{ ...frogie, overview: invalid }])).toThrow(
			"Incomplete project overview: frogie",
		);
	});
	it.each([
		undefined,
		{ ...overview.verified, date: "yesterday" },
		{ ...overview.verified, revision: "main" },
		{ ...overview.verified, sources: null },
		{ ...overview.verified, sources: [] },
		{ ...overview.verified, sources: [" "] },
		{ ...overview.verified, sources: ["/etc/config"] },
		{ ...overview.verified, sources: ["../package.json"] },
	])("requires dated, immutable source evidence: %j", (verified) => {
		expect(() =>
			parseCatalogue([{ ...frogie, overview: { ...overview, verified } }]),
		).toThrow("Invalid overview evidence: frogie");
	});
	it("loads the catalogue through HTTP and surfaces fetch failures", async () => {
		await expect(
			loadProjects(
				async () =>
					new Response(JSON.stringify(projects), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					}),
			),
		).resolves.toEqual(projects);
		await expect(
			loadProjects(async () => new Response("", { status: 404 })),
		).rejects.toThrow("Catalogue HTTP 404");
	});
});
