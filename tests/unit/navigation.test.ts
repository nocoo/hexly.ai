import { describe, expect, it } from "vitest";
import {
	navigationSearch,
	openLogo,
	parseNavigation,
} from "../../src/model/navigation";

describe("shareable directory navigation", () => {
	it("opens the directory by default and rejects unsupported parameters", () => {
		expect(parseNavigation("")).toEqual({
			view: "directory",
			category: "all",
			query: "",
			sort: "curated",
			project: "frogie",
		});
		expect(
			parseNavigation("?view=unknown&category=wrong&sort=wrong&project=../bad"),
		).toEqual(parseNavigation(""));
	});
	it("round-trips gallery, filters, Unicode search, and sort order", () => {
		const state = parseNavigation(
			"?view=logos&project=pew&category=ai&q=智能体&sort=az",
		);
		expect(state).toEqual({
			view: "logos",
			project: "pew",
			category: "ai",
			query: "智能体",
			sort: "az",
		});
		expect(parseNavigation(navigationSearch(state))).toEqual(state);
		expect(navigationSearch(parseNavigation(""))).toBe("/");
	});
	it("opens a project's logo and clears incompatible directory filters", () => {
		expect(openLogo(parseNavigation("?q=pew&category=ai"), "backy")).toEqual({
			view: "logos",
			project: "backy",
			query: "",
			category: "all",
			sort: "curated",
		});
	});
});
