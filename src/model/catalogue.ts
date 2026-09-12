import mediaStorage from "../data/media-storage.json" with { type: "json" };
import projectOrder from "../data/project-order.json" with { type: "json" };
import type { Category, Locale, Project } from "./project";

const curatedOrder = new Map<string, number>(
	[
		...projectOrder.animals
			.toSorted(
				(a, b) =>
					b.stars - a.stars ||
					(a.stars === 0 && b.stars === 0 ? b.commits - a.commits : 0),
			)
			.map((project) => project.id),
		...projectOrder.templates,
		...projectOrder.games,
	].map((id, position) => [id, position]),
);
const featuredTools = new Set(projectOrder.featuredTools);

export const categories: Category[] = [
	"all",
	"ai",
	"tools",
	"everyday",
	"design",
	"games",
	"extensions",
	"archive",
];

export function filterProjects(
	projects: Project[],
	query: string,
	category: Category = "all",
	sort: "curated" | "az" = "curated",
	withVideo = false,
): Project[] {
	const terms = query
		.normalize("NFKC")
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean);
	const result = projects.filter((project) => {
		if (withVideo && !project.media?.videos?.length) return false;
		if (category === "archive") {
			if (!project.archived) return false;
		} else {
			if (category === "all" && project.archived) return false;
			if (category !== "all" && project.category !== category) return false;
		}
		const content = [
			project.title,
			project.repo,
			project.emoji,
			project.description.en,
			project.description.zh,
			project.subject,
		]
			.join(" ")
			.normalize("NFKC")
			.toLowerCase();
		return terms.every((term) => content.includes(term));
	});
	return result.toSorted((a, b) =>
		sort === "az"
			? a.title.localeCompare(b.title, "en")
			: (category === "tools"
					? Number(featuredTools.has(b.id)) - Number(featuredTools.has(a.id))
					: 0) ||
				(curatedOrder.get(a.id) ?? curatedOrder.size) -
					(curatedOrder.get(b.id) ?? curatedOrder.size),
	);
}

export function categoryCounts(projects: Project[]): Record<Category, number> {
	const counts: Record<Category, number> = {
		all: projects.filter((project) => !project.archived).length,
		ai: 0,
		tools: 0,
		everyday: 0,
		design: 0,
		games: 0,
		extensions: 0,
		archive: 0,
	};
	for (const project of projects) {
		if (project.archived) counts.archive += 1;
		if (project.category !== "archive") counts[project.category] += 1;
	}
	return counts;
}

export function selectedProject(
	projects: Project[],
	id: string,
): Project | null {
	return projects.find((project) => project.id === id) ?? projects[0] ?? null;
}

export function destination(project: Project): string {
	return project.website ?? project.repository;
}

export const cataloguePath = "/data/projects.json";

export function parseCatalogue(value: unknown): Project[] {
	if (!Array.isArray(value)) throw new Error("Catalogue must be a JSON array.");
	const projects = value as Project[];
	const problems = catalogueProblems(projects);
	if (problems.length > 0) throw new Error(problems.join("\n"));
	return projects;
}

export async function loadProjects(
	fetchImpl: (input: string) => Promise<Response>,
): Promise<Project[]> {
	const response = await fetchImpl(cataloguePath);
	if (!response.ok) throw new Error(`Catalogue HTTP ${response.status}`);
	return parseCatalogue(await response.json());
}

function hasText(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function hasTranslations(value?: Record<Locale, string>): boolean {
	return hasText(value?.en) && hasText(value?.zh);
}

function mediaUrl(value: unknown): boolean {
	if (typeof value !== "string" || /[\s\\]/.test(value)) return false;
	try {
		const url = new URL(value, "https://hexly.ai");
		return (
			(value.startsWith("/")
				? !value.startsWith("//") && url.origin === "https://hexly.ai"
				: value.startsWith("https://") && url.origin === mediaStorage.origin) &&
			!url.username &&
			!url.password &&
			!url.hash
		);
	} catch {
		return false;
	}
}

export function catalogueProblems(projects: Project[]): string[] {
	const problems: string[] = [];
	const ids = new Set<string>();
	for (const project of projects) {
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id) || ids.has(project.id))
			problems.push(`Invalid or duplicate id: ${project.id}`);
		ids.add(project.id);
		const kit = project.brandKit;
		if (
			kit !== undefined &&
			(!kit ||
				!/^\d+\.\d+\.\d+$/.test(kit.version) ||
				kit.root !== `/brands/${project.id}/v${kit.version}` ||
				(kit.method !== undefined &&
					kit.method !== "gpt-image-2" &&
					kit.method !== "archived-artwork") ||
				(kit.scope !== undefined && kit.scope !== "hexly-campaign") ||
				(kit.previousVersion !== undefined &&
					(!/^\d+\.\d+\.\d+$/.test(kit.previousVersion) ||
						kit.previousVersion === kit.version)) ||
				(kit.method === "gpt-image-2" &&
					(!project.family || !kit.hero || !kit.previousVersion)) ||
				(kit.method === "archived-artwork" &&
					(!project.family ||
						!kit.hero?.themed ||
						!kit.lockup ||
						!kit.texture ||
						kit.scope !== "hexly-campaign")) ||
				(kit.lockup !== undefined &&
					(!kit.lockup ||
						!Number.isInteger(kit.lockup.width) ||
						!Number.isInteger(kit.lockup.height) ||
						kit.lockup.width <= 0 ||
						kit.lockup.height <= 0)) ||
				(kit.texture !== undefined &&
					(!kit.texture ||
						!hasTranslations(kit.texture.name) ||
						!hasTranslations(kit.texture.description))) ||
				(kit.hero !== undefined &&
					(!kit.hero ||
						!Number.isInteger(kit.hero.width) ||
						!Number.isInteger(kit.hero.height) ||
						kit.hero.width <= 0 ||
						kit.hero.height <= 0 ||
						(kit.hero.themed !== undefined &&
							typeof kit.hero.themed !== "boolean") ||
						!hasTranslations(kit.hero.alt) ||
						!hasTranslations(kit.hero.caption))) ||
				(kit.sourceAdoptionRevision !== null &&
					!/^[a-f0-9]{40}$/.test(kit.sourceAdoptionRevision)) ||
				!hasTranslations(kit.description) ||
				!Array.isArray(kit.guidelines) ||
				kit.guidelines.length === 0 ||
				kit.guidelines.some(
					(item) =>
						!hasTranslations(item?.title) ||
						!hasTranslations(item?.description),
				))
		)
			problems.push(`Invalid brand kit: ${project.id}`);
		const media = project.media;
		if (media !== undefined) {
			if (!media || typeof media !== "object" || Array.isArray(media)) {
				problems.push(`Invalid project media: ${project.id}`);
			} else {
				const videos = media.videos;
				if (
					videos !== undefined &&
					(!Array.isArray(videos) ||
						videos.some(
							(video) =>
								!video ||
								!hasText(video.id) ||
								!/^([a-z0-9]+-)*[a-z0-9]+$/.test(video.id) ||
								!hasTranslations(video.title) ||
								!mediaUrl(video.src) ||
								!mediaUrl(video.poster) ||
								!Number.isFinite(video.durationSeconds) ||
								video.durationSeconds <= 0 ||
								!hasText(video.language) ||
								!hasText(video.version) ||
								!hasText(video.source) ||
								(video.captionsBurnedIn !== undefined &&
									typeof video.captionsBurnedIn !== "boolean") ||
								!/^[a-f0-9]{64}$/.test(video.sha256) ||
								(video.captions !== undefined &&
									(!Array.isArray(video.captions) ||
										video.captions.some(
											(track) =>
												!track ||
												!mediaUrl(track.src) ||
												!hasText(track.language) ||
												!hasText(track.label),
										))),
						) ||
						new Set(videos.map((video) => video.id)).size !== videos.length)
				)
					problems.push(`Invalid project videos: ${project.id}`);
				const screenshots = media.screenshots;
				if (
					screenshots !== undefined &&
					(!Array.isArray(screenshots) ||
						screenshots.some(
							(screenshot) =>
								!screenshot ||
								!hasText(screenshot.id) ||
								!/^([a-z0-9]+-)*[a-z0-9]+$/.test(screenshot.id) ||
								!mediaUrl(screenshot.src) ||
								!hasTranslations(screenshot.alt) ||
								!Number.isInteger(screenshot.width) ||
								!Number.isInteger(screenshot.height) ||
								screenshot.width <= 0 ||
								screenshot.height <= 0,
						) ||
						new Set(screenshots.map((shot) => shot.id)).size !==
							screenshots.length)
				)
					problems.push(`Invalid project screenshots: ${project.id}`);
			}
		}
		if (
			!project.title ||
			!project.emoji ||
			!project.description.en ||
			!project.description.zh
		)
			problems.push(`Incomplete identity: ${project.id}`);
		const overview = project.overview;
		if (overview !== undefined) {
			if (
				!hasTranslations(overview?.goal) ||
				!Array.isArray(overview?.techStack) ||
				overview.techStack.length === 0 ||
				overview.techStack.some(
					(technology) =>
						!hasText(technology?.name) || !hasTranslations(technology?.role),
				) ||
				new Set(overview.techStack.map((technology) => technology.name))
					.size !== overview.techStack.length
			)
				problems.push(`Incomplete project overview: ${project.id}`);
			const verified = overview?.verified;
			const localSnapshot = verified?.snapshot;
			const validRevision =
				verified?.revision === null
					? /^docs\/sources\/[a-z0-9-]+\.json$/.test(
							localSnapshot?.path ?? "",
						) && /^[a-f0-9]{64}$/.test(localSnapshot?.sha256 ?? "")
					: /^[a-f0-9]{40}$/.test(verified?.revision ?? "");
			if (
				!/^\d{4}-\d{2}-\d{2}$/.test(verified?.date ?? "") ||
				!validRevision ||
				!Array.isArray(verified?.sources) ||
				verified.sources.length === 0 ||
				verified.sources.some(
					(source) =>
						!hasText(source) ||
						source.startsWith("/") ||
						source.split("/").includes(".."),
				)
			)
				problems.push(`Invalid overview evidence: ${project.id}`);
		}
		if (
			!categories.includes(project.category) ||
			project.category === ("all" as Category)
		)
			problems.push(`Invalid category: ${project.id}`);
		for (const url of [project.repository, project.website].filter(
			(value) => value !== null,
		)) {
			if (!/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(url))
				problems.push(`Invalid external link: ${project.id}`);
		}
		for (const asset of [
			project.logo.original,
			project.logo.thumbnail,
			project.logo.display,
		]) {
			if (
				!/^\/logos\/(originals|emoji|display)\/[a-z0-9-]+\.(png|svg|jpg|webp)$/.test(
					asset,
				)
			)
				problems.push(`Invalid local asset: ${project.id}`);
		}
		if (
			!/^[a-f0-9]{64}$/.test(project.logo.sha256) ||
			project.logo.width < 1 ||
			project.logo.height < 1
		)
			problems.push(`Invalid source metadata: ${project.id}`);
		for (const color of [
			project.colors.primary,
			project.colors.background,
			...project.colors.palette.map((swatch) => swatch.color),
		]) {
			if (!/^(#[a-f0-9]{6}|transparent)$/i.test(color))
				problems.push(`Invalid palette: ${project.id}`);
		}
	}
	return problems;
}
