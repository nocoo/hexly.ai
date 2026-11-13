import type { RefObject } from "react";
import { categoryLabels, copy } from "../data/copy";
import { categories, categoryCounts } from "../model/catalogue";
import type { DirectoryState } from "../model/navigation";
import { navigationPath } from "../model/navigation";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { PageHero } from "./PageHero";
import { ProjectCard } from "./ProjectCard";
import { SearchField } from "./SearchField";

export function Directory({
	projects,
	visible,
	state,
	locale,
	searchRef,
	onChange,
	onProject,
}: {
	projects: Project[];
	visible: Project[];
	state: DirectoryState;
	locale: Locale;
	searchRef: RefObject<HTMLInputElement | null>;
	onChange: (patch: Partial<DirectoryState>) => void;
	onProject: (id: string, anchor?: string) => void;
}) {
	const t = copy[locale];
	const counts = categoryCounts(projects);
	const logos = state.view === "logos";
	const faces = projects
		.filter((project) => project.family && !project.archived)
		.slice(0, 6);
	return (
		<main id="main-content" className="shell directory-main">
			<PageHero
				headingId="hero-title"
				eyebrow={t.eyebrow}
				title={
					<>
						{t.heroFirst}
						<br />
						<span className="outline-word">{t.heroSecond}</span>
						<span className="headline-period">
							{locale === "zh" ? "。" : "."}
						</span>
					</>
				}
				description={t.heroDescription}
				artwork={
					<div className="hero-art">
						<span className="orbit orbit-one" aria-hidden="true" />
						<span className="orbit orbit-two" aria-hidden="true" />
						<span className="orbit orbit-three" aria-hidden="true" />
						{faces.map((project, index) => (
							<button
								type="button"
								className={`floating-logo float-${index}`}
								key={project.id}
								aria-label={`${t.viewProject}: ${project.title}`}
								onClick={() => onProject(project.id)}
							>
								<Logo project={project} size={index < 2 ? 104 : 80} eager />
							</button>
						))}
						<span className="hero-art-caption">
							<span />
							{t.heroNote}
							<span />
						</span>
					</div>
				}
			/>
			<section
				className="collection"
				id="collection"
				aria-labelledby="collection-title"
			>
				<div className="collection-heading">
					<div>
						<div className="collection-title-row">
							<h2 id="collection-title">{t.collection}</h2>
							<span className="count-badge" role="status" aria-live="polite">
								{visible.length}/{projects.length}
							</span>
						</div>
					</div>
					<SearchField
						value={state.query}
						onChange={(query) => onChange({ query })}
						locale={locale}
						inputRef={searchRef}
					/>
				</div>
				<div className="collection-toolbar">
					<fieldset className="category-tabs" aria-label={t.categories}>
						{categories.map((category) => (
							<button
								type="button"
								key={category}
								aria-pressed={state.category === category}
								onClick={() => onChange({ category })}
							>
								{categoryLabels[locale][category]}
								<span>{counts[category]}</span>
							</button>
						))}
					</fieldset>
					<div className="collection-actions">
						<nav
							className="collection-views view-switch"
							aria-label={t.browseAs}
						>
							{(["directory", "logos"] as const).map((view) => (
								<a
									key={view}
									href={navigationPath({
										...state,
										view,
										anchor: "collection",
									})}
									aria-current={state.view === view ? "page" : undefined}
									onClick={(event) => {
										if (
											event.button ||
											event.metaKey ||
											event.ctrlKey ||
											event.shiftKey ||
											event.altKey
										)
											return;
										event.preventDefault();
										onChange({ view, anchor: undefined });
									}}
								>
									<Icon name={view === "logos" ? "image" : "grid"} />
									{view === "logos" ? t.gallery : t.directory}
								</a>
							))}
						</nav>
						<button
							type="button"
							className="sort-toggle"
							aria-label={`${t.sort}: ${t.alphabetical}`}
							aria-pressed={state.sort === "az"}
							title={`${state.sort === "az" ? t.alphabetical : t.curated} · ${state.sort === "az" ? t.curated : t.alphabetical}`}
							onClick={() =>
								onChange({ sort: state.sort === "az" ? "curated" : "az" })
							}
						>
							<Icon name="sort-az" />
						</button>
					</div>
				</div>
				{visible.length ? (
					<div className={logos ? "logo-wall" : "project-grid"}>
						{visible.map((project, index) => (
							<ProjectCard
								key={project.id}
								project={project}
								locale={locale}
								onProject={onProject}
								artworkOnly={logos}
								eager={index < 3}
							/>
						))}
					</div>
				) : (
					<div className="empty-state">
						<Icon name="search" />
						<h3>{t.noResults}</h3>
						<p>{t.noResultsDescription}</p>
						<button
							className="button button-secondary"
							type="button"
							onClick={() => onChange({ category: "all", query: "" })}
						>
							{t.reset}
						</button>
					</div>
				)}
			</section>
		</main>
	);
}
