import type { RefObject } from "react";
import { categoryLabels, copy } from "../data/copy";
import { selectedProject } from "../model/catalogue";
import type { DirectoryState } from "../model/navigation";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { LogoReview } from "./LogoReview";
import { SearchField } from "./SearchField";

export function Gallery({
	projects,
	visible,
	state,
	locale,
	searchRef,
	onChange,
	onCopy,
}: {
	projects: Project[];
	visible: Project[];
	state: DirectoryState;
	locale: Locale;
	searchRef: RefObject<HTMLInputElement | null>;
	onChange: (patch: Partial<DirectoryState>) => void;
	onCopy: (value: string) => void;
}) {
	const t = copy[locale];
	const project = selectedProject(visible, state.project);
	const selectedIndex = visible.findIndex((item) => item.id === project?.id);
	const move = (offset: number) => {
		const next =
			visible[(selectedIndex + offset + visible.length) % visible.length];
		if (next) onChange({ project: next.id });
	};
	return (
		<main id="main-content" className="shell gallery-main">
			<div className="gallery-heading">
				<div>
					<p className="eyebrow">
						<span className="tiny-square" />
						{t.galleryEyebrow}
					</p>
					<h1>{t.galleryTitle}</h1>
				</div>
				<p>{t.galleryDescription}</p>
			</div>
			<aside className="gallery-selector" aria-label={t.selectProject}>
				<div className="picker-heading">
					<span>
						{t.selectProject}{" "}
						<span className="mono">
							{visible.length}/{projects.length}
						</span>
					</span>
					<SearchField
						value={state.query}
						onChange={(query) => onChange({ query })}
						locale={locale}
						inputRef={searchRef}
					/>
				</div>
				<div className="project-picker">
					{visible.map((item) => (
						<button
							type="button"
							key={item.id}
							className="picker-item"
							aria-pressed={project?.id === item.id}
							onClick={() => onChange({ project: item.id })}
						>
							<Logo project={item} size={32} />
							<span>{item.title}</span>
						</button>
					))}
				</div>
			</aside>
			{project ? (
				<section className="identity-detail" aria-labelledby="identity-title">
					<div className="identity-heading">
						<div>
							<p className="identity-category">
								{categoryLabels[locale][project.category]}
							</p>
							<h2 id="identity-title">
								{project.title}
								<span aria-hidden="true">{project.emoji}</span>
							</h2>
							<p className="identity-description">
								{project.description[locale]}
							</p>
						</div>
						<div className="identity-meta">
							<span className="asset-label">
								{project.family
									? t.approved
									: project.reference
										? t.reference
										: project.logo.kind === "original"
											? t.original
											: t.emoji}
							</span>
							<span className="mono">
								{project.logo.width} × {project.logo.height}
								{project.family && ` · ${project.family.adopted}`}
							</span>
							<div className="identity-pagination">
								<span className="mono">
									{String(selectedIndex + 1).padStart(2, "0")} /{" "}
									{visible.length}
								</span>
								<button
									className="icon-button"
									type="button"
									aria-label={t.previous}
									onClick={() => move(-1)}
								>
									<Icon name="left" />
								</button>
								<button
									className="icon-button"
									type="button"
									aria-label={t.next}
									onClick={() => move(1)}
								>
									<Icon name="right" />
								</button>
							</div>
						</div>
					</div>
					<LogoReview
						key={project.id}
						project={project}
						locale={locale}
						onCopy={onCopy}
					/>
					<div className="identity-footer">
						<p>
							{project.logo.kind === "original" ? t.preserved : t.emojiNote}
							<a href={project.logo.sourceUrl} target="_blank" rel="noreferrer">
								{t.sourceAsset}
								<Icon name="arrow" />
							</a>
						</p>
						<div className="identity-actions">
							{!project.family && (
								<a
									className="button button-secondary"
									href={project.logo.original}
									download
								>
									<Icon name="download" />
									{project.logo.kind === "original"
										? t.download
										: t.downloadEmoji}
								</a>
							)}
							<button
								className="button button-secondary"
								type="button"
								onClick={() =>
									onCopy(
										`${window.location.origin}/?view=logos&project=${project.id}`,
									)
								}
							>
								<Icon name="link" />
								{t.share}
							</button>
							<a
								className="icon-button repository-link"
								href={project.repository}
								target="_blank"
								rel="noreferrer"
								aria-label={t.source}
								title={t.source}
							>
								<Icon name="github" />
							</a>
						</div>
					</div>
				</section>
			) : (
				<div className="empty-state gallery-empty">
					<Icon name="search" />
					<h2>{t.noResults}</h2>
					<p>{t.noResultsDescription}</p>
					<button
						className="button button-secondary"
						type="button"
						onClick={() => onChange({ query: "", category: "all" })}
					>
						{t.reset}
					</button>
				</div>
			)}
		</main>
	);
}
