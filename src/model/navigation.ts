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
	withVideo?: boolean;
	video?: string;
	videoProject?: string;
	videoMode?: "video" | "deck";
	videoTheme?: VideoTheme;
	videoOpening?: OpeningId;
	videoEnding?: EndingId;
	videoPart?: "intro" | "content" | "outro";
	videoFamily?: "templates" | "openings" | "endings";
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
	const route = /^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path);
	const video = /^\/templates(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?\/?$/.exec(path);
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
			view: video
				? "templates"
				: /^\/status\/?$/.test(path)
					? "status"
					: route
						? "project"
						: /^\/logos\/?$/.test(path)
							? "logos"
							: "directory",
			category,
			query: params.get("q") ?? "",
			sort: params.get("sort") === "az" ? "az" : "curated",
			project,
			...(anchor ? { anchor } : {}),
			...(params.get("media") === "video" ? { withVideo: true } : {}),
			...(video
				? {
						video: video[1],
						videoProject: params.get("project") ?? "hexly-ai",
						videoFamily:
							params.get("family") === "openings"
								? ("openings" as const)
								: params.get("family") === "endings"
									? ("endings" as const)
									: ("templates" as const),
						videoTheme:
							params.get("theme") === "dark"
								? ("dark" as const)
								: ("light" as const),
						videoOpening:
							openingIds.find((id) => id === params.get("opening")) ?? "signal",
						videoEnding:
							endingIds.find((id) => id === params.get("ending")) ??
							"signature",
						videoPart:
							params.get("part") === "intro"
								? ("intro" as const)
								: params.get("part") === "outro"
									? ("outro" as const)
									: ("content" as const),
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
	if (state.view !== "project" || !projects.some((p) => p.id === state.project))
		return state;
	const selected = selectedProject(
		filterProjects(
			projects,
			state.query,
			state.category,
			state.sort,
			state.withVideo,
		),
		state.project,
	);
	return { ...state, project: selected?.id ?? state.project };
}

export function navigationPath(state: DirectoryState): string {
	const params = new URLSearchParams();
	if (state.view === "templates") {
		if (!state.video && state.videoFamily && state.videoFamily !== "templates")
			params.set("family", state.videoFamily);
		if (state.videoProject && state.videoProject !== "hexly-ai")
			params.set("project", state.videoProject);
		if (state.videoMode === "deck") params.set("mode", "deck");
		if (state.videoTheme === "dark") params.set("theme", "dark");
		if (state.videoOpening && state.videoOpening !== "signal")
			params.set("opening", state.videoOpening);
		if (state.videoEnding && state.videoEnding !== "signature")
			params.set("ending", state.videoEnding);
		if (state.videoPart && state.videoPart !== "content")
			params.set("part", state.videoPart);
		const path = `/templates${state.video ? `/${state.video}` : ""}`;
		return `${path}${params.size ? `?${params}` : ""}${state.anchor ? `#${state.anchor}` : ""}`;
	}
	if (state.category !== "all") params.set("category", state.category);
	if (state.query) params.set("q", state.query);
	if (state.sort !== "curated") params.set("sort", state.sort);
	if (state.withVideo && ["directory", "logos", "project"].includes(state.view))
		params.set("media", "video");
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
		withVideo: undefined,
		anchor,
	};
}

import {
	type EndingId,
	endingIds,
	type OpeningId,
	openingIds,
	type VideoTheme,
} from "@hexly/video-kit/schema";
