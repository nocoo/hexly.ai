import { describe, expect, it } from "vitest";
import rawProjects from "../../src/data/projects.json";
import {
	catalogueProblems,
	categoryCounts,
	destination,
	destinationHost,
	filterProjects,
	selectedProject,
} from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";

const projects = rawProjects as Project[];
const frogie = projects.find((project) => project.id === "frogie");
if (!frogie) throw new Error("Frogie is required as the reference identity.");

describe("the imported project catalogue", () => {
	it("includes every unique profile entry with bilingual metadata and local assets", () => {
		expect(projects).toHaveLength(66);
		expect(catalogueProblems(projects)).toEqual([]);
		expect(
			projects.filter((project) => project.logo.kind === "original"),
		).toHaveLength(43);
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
		expect(filterProjects(projects, "  ")).toEqual(projects);
		const sorted = filterProjects(projects, "", "all", "az");
		expect(sorted.map((project) => project.title)).toEqual(
			projects
				.map((project) => project.title)
				.toSorted((a, b) => a.localeCompare(b, "en")),
		);
		expect(projects).toEqual(before);
	});
	it("counts the full collection and disjoint categories", () => {
		const counts = categoryCounts(projects);
		expect(counts.all).toBe(projects.length);
		expect(counts.archive).toBe(12);
		expect(counts.games).toBe(4);
		expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(
			projects.length * 2,
		);
		expect(categoryCounts([]).all).toBe(0);
	});
	it("selects a known identity and safely handles unknown or empty selections", () => {
		expect(selectedProject(projects, "pew")?.title).toBe("Pew");
		expect(selectedProject(projects, "missing")).toBe(projects[0]);
		expect(selectedProject([], "missing")).toBeNull();
	});
	it("uses evidenced website links and falls back to repository links", () => {
		expect(destination(frogie)).toBe("https://github.com/nocoo/frogie");
		expect(destinationHost(frogie)).toBe("github.com");
		expect(destination({ ...frogie, website: "https://pew.md" })).toBe(
			"https://pew.md",
		);
		expect(
			destinationHost({ ...frogie, website: "https://www.example.com/tool" }),
		).toBe("example.com");
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
});
