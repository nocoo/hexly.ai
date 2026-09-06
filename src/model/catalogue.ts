import type { Category, Project } from "./project";

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
): Project[] {
	const terms = query
		.normalize("NFKC")
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean);
	const result = projects.filter((project) => {
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
	return sort === "az"
		? result.toSorted((a, b) => a.title.localeCompare(b.title, "en"))
		: result;
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

export function catalogueProblems(projects: Project[]): string[] {
	const problems: string[] = [];
	const ids = new Set<string>();
	for (const project of projects) {
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id) || ids.has(project.id))
			problems.push(`Invalid or duplicate id: ${project.id}`);
		ids.add(project.id);
		if (
			!project.title ||
			!project.emoji ||
			!project.description.en ||
			!project.description.zh
		)
			problems.push(`Incomplete identity: ${project.id}`);
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
