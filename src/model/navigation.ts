import { categories, filterProjects, selectedProject } from "./catalogue";
import type { Category, Project, View } from "./project";

export interface DirectoryState {
	view: View;
	category: Category;
	query: string;
	sort: "curated" | "az";
	project: string;
}

export function parseNavigation(
	pathname: string,
	search: string,
	projects: Project[],
): DirectoryState {
	const params = new URLSearchParams(search);
	const route = /^\/logos(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?\/?$/.exec(pathname);
	const project = route?.[1] ?? "frogie";
	let category =
		categories.find((item) => item === params.get("category")) ?? "all";
	if (
		route &&
		category === "all" &&
		projects.some((item) => item.id === project && item.archived)
	)
		category = "archive";
	return resolveNavigation(
		{
			view: route ? "logos" : "directory",
			category,
			query: params.get("q") ?? "",
			sort: params.get("sort") === "az" ? "az" : "curated",
			project,
		},
		projects,
	);
}

export function resolveNavigation(
	state: DirectoryState,
	projects: Project[],
): DirectoryState {
	if (state.view === "directory") return state;
	const selected = selectedProject(
		filterProjects(projects, state.query, state.category, state.sort),
		state.project,
	);
	return { ...state, project: selected?.id ?? state.project };
}

export function navigationPath(state: DirectoryState): string {
	const params = new URLSearchParams();
	if (state.category !== "all") params.set("category", state.category);
	if (state.query) params.set("q", state.query);
	if (state.sort !== "curated") params.set("sort", state.sort);
	const search = params.toString();
	const pathname = state.view === "logos" ? `/logos/${state.project}` : "/";
	return search ? `${pathname}?${search}` : pathname;
}

export function openLogo(
	state: DirectoryState,
	project: Pick<Project, "id" | "archived">,
): DirectoryState {
	return {
		...state,
		view: "logos",
		project: project.id,
		category: project.archived ? "archive" : "all",
		query: "",
	};
}
