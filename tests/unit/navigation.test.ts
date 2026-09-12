import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import {
	navigationPath,
	openProject,
	parseNavigation,
	resolveNavigation,
} from "../../src/model/navigation";

const projects = readProjects();
const parse = (pathname: string, search = "", hash = "") =>
	parseNavigation(pathname, search, projects, hash);

describe("shareable directory navigation", () => {
	it("opens the directory by default and rejects unsupported parameters", () => {
		expect(parse("/")).toEqual({
			view: "directory",
			category: "all",
			query: "",
			sort: "curated",
			project: "frogie",
		});
		expect(
			parse("/", "?view=logos&category=wrong&sort=wrong&project=../bad"),
		).toEqual(parse("/"));
		for (const path of ["/projects/../bad", "/projects/UPPER", "/unknown"])
			expect(parse(path)).toEqual(parse("/"));
	});
	it("round-trips project routes, logo wall, filters and section anchors", () => {
		for (const state of [
			parse("/projects/pew", "?category=ai&sort=az"),
			parse("/", "?q=智能体&category=ai&sort=az"),
			parse("/logos", "?media=video&sort=az"),
			parse("/projects/pew", "", "#brand"),
			parse("/projects/pew", "", "#video-introduction"),
		]) {
			const url = new URL(navigationPath(state), "https://hexly.ai");
			expect(parse(url.pathname, url.search, url.hash)).toEqual(state);
		}
		expect(parse("/", "?q=智能体").query).toBe("智能体");
		expect(navigationPath(parse("/projects/pew/"))).toBe("/projects/pew");
		expect(navigationPath(parse("/logos"))).toBe("/logos");
		expect(navigationPath(parse("/"))).toBe("/");
	});
	it("opens a project and clears incompatible directory filters", () => {
		expect(
			openProject(parse("/", "?q=pew&category=ai"), {
				id: "backy",
				archived: false,
			}),
		).toEqual({
			view: "project",
			project: "backy",
			query: "",
			category: "all",
			sort: "curated",
		});
	});
	it("opens archived identities from cards and clean direct paths", () => {
		const archived = { id: "uptime-kuma-skill", archived: true };
		expect(openProject(parse("/"), archived)).toMatchObject({
			project: archived.id,
			view: "project",
			category: "archive",
		});
		expect(parse(`/projects/${archived.id}`)).toMatchObject({
			project: archived.id,
			category: "archive",
		});
		expect(
			parse(`/projects/${archived.id}`, "?category=extensions").category,
		).toBe("extensions");
	});
	it("keeps the path aligned with selection when filtering and handles empty results", () => {
		const state = parse("/projects/frogie");
		expect(
			resolveNavigation({ ...state, query: "pew" }, projects).project,
		).toBe("pew");
		expect(
			resolveNavigation({ ...state, query: "missing-project" }, projects)
				.project,
		).toBe("frogie");
		expect(parse("/projects/missing-project").project).toBe("missing-project");
		expect(parseNavigation("/logos", "", []).project).toBe("frogie");
	});
	it("preserves legacy links while using canonical project and template routes", () => {
		expect(navigationPath(parse("/logos/frogie"))).toBe(
			"/projects/frogie#brand",
		);
		expect(navigationPath(parse("/frogie"))).toBe("/projects/frogie");
		expect(navigationPath(parse("/projects"))).toBe("/");
		expect(navigationPath(parse("/logos/hermes-gateway-herdr"))).toBe(
			"/projects/hermes-on-herdr#brand",
		);
		expect(navigationPath(parse("/logos/frogie", "", "#overview"))).toBe(
			"/projects/frogie#overview",
		);
		expect(
			navigationPath(parse("/videos/launch", "?project=pew&mode=deck")),
		).toBe("/templates/launch?project=pew&mode=deck");
		expect(
			parse("/projects/pew", "?media=invalid", "#../bad").anchor,
		).toBeUndefined();
		expect(parse("/projects/pew", "?media=invalid").withVideo).toBeUndefined();
	});
});
