import type { RefObject } from "react";
import { categoryLabels, copy } from "../data/copy";
import { categories, categoryCounts } from "../model/catalogue";
import type { DirectoryState } from "../model/navigation";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { ProjectCard } from "./ProjectCard";
import { SearchField } from "./SearchField";

export function Directory({
	projects,
	visible,
	state,
	locale,
	searchRef,
	onChange,
	onLogo,
}: {
	projects: Project[];
	visible: Project[];
	state: DirectoryState;
	locale: Locale;
	searchRef: RefObject<HTMLInputElement | null>;
	onChange: (patch: Partial<DirectoryState>) => void;
	onLogo: (id: string) => void;
}) {
	const t = copy[locale];
	const counts = categoryCounts(projects);
	const faces = projects
		.filter((project) => project.family && !project.archived)
		.slice(0, 6);
	return (
		<main id="main-content" className="shell directory-main">
			<section className="hero" aria-labelledby="hero-title">
				<div className="hero-copy">
					<p className="eyebrow">
						<span className="tiny-square" />
						{t.eyebrow}
					</p>
					<h1 id="hero-title">
						{t.heroFirst}
						<br />
						<span className="outline-word">{t.heroSecond}</span>
						<span className="headline-period">
							{locale === "zh" ? "。" : "."}
						</span>
					</h1>
					<p className="hero-description">{t.heroDescription}</p>
					<div className="hero-actions">
						<a className="button button-primary" href="#collection">
							{t.explore}
							<Icon name="right" />
						</a>
						<button
							type="button"
							className="text-button"
							onClick={() => onLogo("frogie")}
						>
							{t.meet}
							<Icon name="arrow" />
						</button>
					</div>
				</div>
				<div className="hero-art">
					<div className="orbit orbit-one" />
					<div className="orbit orbit-two" />
					<div className="orbit orbit-three" />
					<div className="orbit-dot dot-one" />
					<div className="orbit-dot dot-two" />
					<span className="art-cross cross-one">+</span>
					<span className="art-cross cross-two">+</span>
					{faces.map((project, index) => (
						<button
							type="button"
							className={`floating-logo float-${index}`}
							key={project.id}
							aria-label={`${t.viewLogo}: ${project.title}`}
							onClick={() => onLogo(project.id)}
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
			</section>
			<section
				className="collection"
				id="collection"
				aria-labelledby="collection-title"
			>
				<div className="collection-heading">
					<div>
						<div className="collection-title-row">
							<h2 id="collection-title">{t.collection}</h2>
							<span className="count-badge">{projects.length}</span>
						</div>
						<p>{t.collectionDescription}</p>
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
					<div className="sort-control">
						<label className="sr-only" htmlFor="project-sort">
							{t.sort}
						</label>
						<select
							id="project-sort"
							value={state.sort}
							onChange={(event) =>
								onChange({
									sort: event.target.value === "az" ? "az" : "curated",
								})
							}
						>
							<option value="curated">{t.curated}</option>
							<option value="az">{t.alphabetical}</option>
						</select>
						<Icon name="chevron" />
					</div>
				</div>
				<p className="result-count" role="status">
					{t.showing} {visible.length} {t.of} {projects.length} {t.projects}
				</p>
				{visible.length ? (
					<div className="project-grid">
						{visible.map((project, index) => (
							<ProjectCard
								key={project.id}
								project={project}
								locale={locale}
								onLogo={onLogo}
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
