import type {
	CompositionOptions,
	VideoManifest,
	VideoProject,
} from "@hexly/video-kit/schema";
import order from "../data/project-order.json";
import identity from "../data/site-identity.json";
import manifest from "../data/videos.json";
import type { Locale, Project } from "./project";

// The build validates this source with parseVideoManifest before emitting any assets.
export const videoManifest = manifest as VideoManifest;
export const videoEntries = videoManifest.templates;
export const findVideo = (id?: string) =>
	videoEntries.find((entry) => entry.id === id);

export function projectForVideo(
	project: Project | undefined,
	locale: Locale,
): VideoProject {
	const p = project ?? identity;
	const snapshot = order.animals.find((item) => item.id === p.id);
	const technologies =
		project?.overview?.techStack.map((item) => item.name).slice(0, 6) ?? [];
	return {
		id: p.id,
		name: p.title,
		summary: p.description[locale],
		repository: p.repository,
		website: p.website,
		logo:
			p.id === identity.id
				? undefined
				: (project?.family?.foreground.display ?? p.logo.display),
		colors: [...new Set(p.colors.palette.map((item) => item.color))]
			.filter((color) => /^#[\da-f]{6}$/i.test(color))
			.slice(0, 6),
		technologies,
		...(project?.media?.screenshots?.[0]
			? {
					screenshot: {
						src: project.media.screenshots[0].src,
						alt: project.media.screenshots[0].alt[locale],
					},
				}
			: {}),
		facts: snapshot
			? [
					{
						label: locale === "en" ? "Stars" : "星标",
						value: String(snapshot.stars),
					},
					{
						label: locale === "en" ? "Commits" : "提交",
						value: String(snapshot.commits),
					},
					{
						label: locale === "en" ? "Snapshot" : "快照",
						value: order.updatedAt.slice(0, 10),
					},
				]
			: [
					{ label: locale === "en" ? "Category" : "分类", value: p.category },
					{
						label: locale === "en" ? "Website" : "网站",
						value: p.website
							? locale === "en"
								? "Listed"
								: "已收录"
							: locale === "en"
								? "No site"
								: "无站点",
					},
					{
						label: locale === "en" ? "Catalogue" : "目录",
						value: p.archived
							? locale === "en"
								? "Archived"
								: "已归档"
							: locale === "en"
								? "Active"
								: "活跃",
					},
				],
		sourceNote: snapshot
			? `GitHub snapshot · ${order.updatedAt.slice(0, 10)} · not live service health`
			: "Hexly project catalogue · not live service health",
	};
}

export function videoHref(
	id: string,
	project?: string,
	view: "video" | "deck" = "video",
	options: Partial<CompositionOptions> & {
		part?: "intro" | "content" | "outro";
	} = {},
) {
	const params = new URLSearchParams();
	if (project && project !== "hexly-ai") params.set("project", project);
	if (view === "deck") params.set("mode", "deck");
	if (options.theme === "dark") params.set("theme", "dark");
	if (options.opening && options.opening !== "signal")
		params.set("opening", options.opening);
	if (options.ending && options.ending !== "signature")
		params.set("ending", options.ending);
	if (options.part && options.part !== "content")
		params.set("part", options.part);
	return `/templates/${id}${params.size ? `?${params}` : ""}`;
}
