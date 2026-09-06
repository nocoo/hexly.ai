import { categories } from "./catalogue";
import type { Category, View } from "./project";

export interface DirectoryState {
	view: View;
	category: Category;
	query: string;
	sort: "curated" | "az";
	project: string;
}

export function parseNavigation(search: string): DirectoryState {
	const params = new URLSearchParams(search);
	const category = params.get("category");
	const project = params.get("project") ?? "frogie";
	return {
		view: params.get("view") === "logos" ? "logos" : "directory",
		category: categories.find((item) => item === category) ?? "all",
		query: params.get("q") ?? "",
		sort: params.get("sort") === "az" ? "az" : "curated",
		project: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project) ? project : "frogie",
	};
}

export function navigationSearch(state: DirectoryState): string {
	const params = new URLSearchParams();
	if (state.view === "logos") {
		params.set("view", "logos");
		params.set("project", state.project);
	}
	if (state.category !== "all") params.set("category", state.category);
	if (state.query) params.set("q", state.query);
	if (state.sort !== "curated") params.set("sort", state.sort);
	const search = params.toString();
	return search ? `?${search}` : "/";
}

export function openLogo(
	state: DirectoryState,
	project: string,
): DirectoryState {
	return { ...state, view: "logos", project, category: "all", query: "" };
}
