import { type RefObject, useCallback, useEffect } from "react";
import { categoryLabels, copy } from "../data/copy";
import {
	categories,
	categoryCounts,
	selectedProject,
} from "../model/catalogue";
import type { DirectoryState } from "../model/navigation";
import type { Category, Locale, Project } from "../model/project";
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
	const counts = categoryCounts(projects);
	const foreground = project?.family?.foreground ?? project?.logo;
	const selectedIndex = visible.findIndex((item) => item.id === project?.id);
	const move = useCallback(
		(offset: number) => {
			if (visible.length < 2) return;
			const next =
				visible[(selectedIndex + offset + visible.length) % visible.length];
			if (next) onChange({ project: next.id });
		},
		[visible, selectedIndex, onChange],
	);
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				visible.length < 2 ||
				event.defaultPrevented ||
				event.isComposing ||
				event.altKey ||
				event.ctrlKey ||
				event.metaKey ||
				event.shiftKey ||
				(event.key !== "ArrowLeft" && event.key !== "ArrowRight")
			)
				return;
			const target = event.target;
			if (
				target instanceof HTMLElement &&
				(target.isContentEditable || target.closest("input, textarea, select"))
			)
				return;
			event.preventDefault();
			move(event.key === "ArrowLeft" ? -1 : 1);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [move, visible.length]);
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
					<div className="picker-controls">
						<select
							className="picker-category"
							aria-label={t.categories}
							value={state.category}
							onChange={(event) =>
								onChange({ category: event.target.value as Category })
							}
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{categoryLabels[locale][category]} · {counts[category]}
								</option>
							))}
						</select>
						<SearchField
							value={state.query}
							onChange={(query) => onChange({ query })}
							locale={locale}
							inputRef={searchRef}
						/>
					</div>
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
							<Logo project={item} size={32} framed={false} />
							<span>{item.title}</span>
						</button>
					))}
				</div>
			</aside>
			{project ? (
				<section className="identity-detail" aria-labelledby="identity-title">
					<div className="identity-heading">
						<div className="identity-summary">
							<p className="identity-category">
								{categoryLabels[locale][project.category]}
								{project.archived &&
									project.category !== "archive" &&
									` · ${categoryLabels[locale].archive}`}
							</p>
							<h2 id="identity-title" title={project.title}>
								<span className="identity-name">{project.title}</span>
								<span className="identity-emoji" aria-hidden="true">
									{project.emoji}
								</span>
							</h2>
							<p
								className="identity-description"
								title={project.description[locale]}
							>
								{project.description[locale]}
							</p>
						</div>
						<div className="identity-meta">
							<div className="identity-links">
								{project.website && (
									<a
										className="button button-secondary identity-website"
										href={project.website}
										target="_blank"
										rel="noreferrer"
										aria-label={`${t.visit}: ${project.title}`}
									>
										<Icon name="globe" />
										{t.visit}
										<Icon name="arrow" />
									</a>
								)}
								<a
									className="button button-secondary identity-github"
									href={project.repository}
									target="_blank"
									rel="noreferrer"
									aria-label={`${t.source}: ${project.title}`}
								>
									<Icon name="github" />
									GitHub
									<Icon name="arrow" />
								</a>
							</div>
							<span className="asset-label">
								{project.family
									? t.refined
									: project.reference
										? t.reference
										: project.logo.kind === "original"
											? t.original
											: t.emoji}
							</span>
							<span className="mono">
								{foreground?.width} × {foreground?.height}
								{project.family && ` · ${project.family.updated}`}
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
									aria-keyshortcuts="ArrowLeft"
									title={`${t.previous} (←)`}
									disabled={visible.length < 2}
									onClick={() => move(-1)}
								>
									<Icon name="left" />
								</button>
								<button
									className="icon-button"
									type="button"
									aria-label={t.next}
									aria-keyshortcuts="ArrowRight"
									title={`${t.next} (→)`}
									disabled={visible.length < 2}
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
									onCopy(`${window.location.origin}/logos/${project.id}`)
								}
							>
								<Icon name="link" />
								{t.share}
							</button>
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
