import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { filterProjects } from "../../src/model/catalogue";
import {
	navigationPath,
	openLogo,
	parseNavigation,
	resolveNavigation,
} from "../../src/model/navigation";

const projects = readProjects();
const firstVisible = filterProjects(projects, "", "all")[0]?.id;
const parse = (pathname: string, search = "") =>
	parseNavigation(pathname, search, projects);

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
		for (const path of ["/logos/../bad", "/logos/UPPER", "/unknown"])
			expect(parse(path)).toEqual(parse("/"));
	});
	it("round-trips gallery, filters, Unicode search, and sort order", () => {
		for (const state of [
			parse("/logos/pew", "?category=ai&sort=az"),
			parse("/", "?q=智能体&category=ai&sort=az"),
		]) {
			const url = new URL(navigationPath(state), "https://hexly.ai");
			expect(parse(url.pathname, url.search)).toEqual(state);
		}
		expect(parse("/", "?q=智能体").query).toBe("智能体");
		expect(navigationPath(parse("/logos/pew/"))).toBe("/logos/pew");
		expect(navigationPath(parse("/logos"))).toBe("/logos/frogie");
		expect(navigationPath(parse("/"))).toBe("/");
	});
	it("opens a project's logo and clears incompatible directory filters", () => {
		expect(
			openLogo(parse("/", "?q=pew&category=ai"), {
				id: "backy",
				archived: false,
			}),
		).toEqual({
			view: "logos",
			project: "backy",
			query: "",
			category: "all",
			sort: "curated",
		});
	});
	it("opens archived identities from cards and clean direct paths", () => {
		const archived = { id: "uptime-kuma-skill", archived: true };
		expect(openLogo(parse("/"), archived)).toMatchObject({
			project: archived.id,
			view: "logos",
			category: "archive",
		});
		expect(parse(`/logos/${archived.id}`)).toMatchObject({
			project: archived.id,
			category: "archive",
		});
		expect(
			parse(`/logos/${archived.id}`, "?category=extensions").category,
		).toBe("extensions");
	});
	it("keeps the path aligned with selection when filtering and handles empty results", () => {
		const state = parse("/logos/frogie");
		expect(
			resolveNavigation({ ...state, query: "pew" }, projects).project,
		).toBe("pew");
		expect(
			resolveNavigation({ ...state, query: "missing-project" }, projects)
				.project,
		).toBe("frogie");
		expect(parse("/logos/missing-project").project).toBe(firstVisible);
		expect(parseNavigation("/logos", "", []).project).toBe("frogie");
	});
});
