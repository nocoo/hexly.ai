import { categories, filterProjects, selectedProject } from "./catalogue";
import type { Category, Project, View } from "./project";
import { legacyRoute } from "./routes";

export interface DirectoryState {
	view: View;
	category: Category;
	query: string;
	sort: "curated" | "az";
	project: string;
	anchor?: string;
}

export function parseNavigation(
	pathname: string,
	search: string,
	projects: Project[],
	hash = "",
): DirectoryState {
	const params = new URLSearchParams(search);
	const legacy = legacyRoute(pathname);
	const path = legacy?.path ?? pathname;
	const brand = /^\/brand\/?$/.test(path);
	const route = /^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path);
	const anchor = /^#[a-z][a-z0-9-]*$/.test(hash)
		? hash.slice(1)
		: legacy?.anchor;
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
			view: brand
				? "brand"
				: /^\/status\/?$/.test(path)
					? "status"
					: route
						? "project"
						: /^\/logos\/?$/.test(path)
							? "logos"
							: "directory",
			category: brand ? "all" : category,
			query: brand ? "" : (params.get("q") ?? ""),
			sort: !brand && params.get("sort") === "az" ? "az" : "curated",
			project,
			...(anchor ? { anchor } : {}),
		},
		projects,
	);
}

export function resolveNavigation(
	state: DirectoryState,
	projects: Project[],
): DirectoryState {
	if (state.view !== "project" || !projects.some((p) => p.id === state.project))
		return state;
	const selected = selectedProject(
		filterProjects(projects, state.query, state.category, state.sort),
		state.project,
	);
	return { ...state, project: selected?.id ?? state.project };
}

export function navigationPath(state: DirectoryState): string {
	if (state.view === "brand")
		return `/brand${state.anchor ? `#${state.anchor}` : ""}`;
	const params = new URLSearchParams();
	if (state.category !== "all") params.set("category", state.category);
	if (state.query) params.set("q", state.query);
	if (state.sort !== "curated") params.set("sort", state.sort);
	const search = params.toString();
	const pathname =
		state.view === "status"
			? "/status"
			: state.view === "project"
				? `/projects/${state.project}`
				: state.view === "logos"
					? "/logos"
					: "/";
	return `${pathname}${search ? `?${search}` : ""}${state.anchor ? `#${state.anchor}` : ""}`;
}

export function openProject(
	state: DirectoryState,
	project: Pick<Project, "id" | "archived">,
	anchor?: string,
): DirectoryState {
	return {
		...state,
		view: "project",
		project: project.id,
		category: project.archived ? "archive" : "all",
		query: "",
		anchor,
	};
}
