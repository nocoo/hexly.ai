import { categories, filterProjects, selectedProject } from "./catalogue";
import type { Category, Project, View } from "./project";

export interface DirectoryState {
	view: View;
	category: Category;
	query: string;
	sort: "curated" | "az";
	project: string;
	video?: string;
	videoProject?: string;
	videoMode?: "video" | "deck";
}

export function parseNavigation(
	pathname: string,
	search: string,
	projects: Project[],
): DirectoryState {
	const params = new URLSearchParams(search);
	const route = /^\/logos(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?\/?$/.exec(pathname);
	const video = /^\/videos(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?\/?$/.exec(pathname);
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
			view: video
				? "videos"
				: /^\/status\/?$/.test(pathname)
					? "status"
					: route
						? "logos"
						: "directory",
			category,
			query: params.get("q") ?? "",
			sort: params.get("sort") === "az" ? "az" : "curated",
			project,
			...(video
				? {
						video: video[1],
						videoProject: params.get("project") ?? "hexly-ai",
						videoMode:
							params.get("mode") === "deck"
								? ("deck" as const)
								: ("video" as const),
					}
				: {}),
		},
		projects,
	);
}

export function resolveNavigation(
	state: DirectoryState,
	projects: Project[],
): DirectoryState {
	if (state.view !== "logos") return state;
	const selected = selectedProject(
		filterProjects(projects, state.query, state.category, state.sort),
		state.project,
	);
	return { ...state, project: selected?.id ?? state.project };
}

export function navigationPath(state: DirectoryState): string {
	const params = new URLSearchParams();
	if (state.view === "videos") {
		if (state.videoProject && state.videoProject !== "hexly-ai")
			params.set("project", state.videoProject);
		if (state.videoMode === "deck") params.set("mode", "deck");
		const path = `/videos${state.video ? `/${state.video}` : ""}`;
		return params.size ? `${path}?${params}` : path;
	}
	if (state.category !== "all") params.set("category", state.category);
	if (state.query) params.set("q", state.query);
	if (state.sort !== "curated") params.set("sort", state.sort);
	const search = params.toString();
	const pathname =
		state.view === "status"
			? "/status"
			: state.view === "logos"
				? `/logos/${state.project}`
				: "/";
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
