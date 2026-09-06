import { type RefObject, useState } from "react";
import { categoryLabels, copy } from "../data/copy";
import { destination, selectedProject } from "../model/catalogue";
import type { DirectoryState } from "../model/navigation";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Palette } from "./Palette";
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
	const [surface, setSurface] = useState("paper");
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
			<div className="gallery-layout">
				<aside className="gallery-sidebar" aria-label={t.selectProject}>
					<div className="picker-heading">
						<span>{t.directory}</span>
						<span className="mono">
							{visible.length}/{projects.length}
						</span>
					</div>
					<SearchField
						value={state.query}
						onChange={(query) => onChange({ query })}
						locale={locale}
						inputRef={searchRef}
					/>
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
								<span>
									{item.title}
									<small>{categoryLabels[locale][item.category]}</small>
								</span>
								<Icon name="right" />
							</button>
						))}
					</div>
				</aside>
				{project ? (
					<section className="identity-detail" aria-labelledby="identity-title">
						<div className="identity-heading">
							<div>
								<span className="identity-category">
									{categoryLabels[locale][project.category]}
								</span>
								<h2 id="identity-title">
									{project.title}
									<span aria-hidden="true">{project.emoji}</span>
								</h2>
								<p>{project.description[locale]}</p>
							</div>
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
						<div className={`artwork-stage surface-${surface}`}>
							<div className="artwork-topline">
								<span className="asset-label">
									<span className="tiny-square" />
									{project.reference
										? t.reference
										: project.logo.kind === "original"
											? t.original
											: t.emoji}
								</span>
								<fieldset className="surface-control" aria-label={t.surface}>
									{(["paper", "white", "black", "transparent"] as const).map(
										(value) => (
											<button
												type="button"
												key={value}
												className={`surface-choice choice-${value}`}
												aria-label={`${t.surface}: ${t[value]}`}
												aria-pressed={surface === value}
												title={t[value]}
												onClick={() => setSurface(value)}
											>
												<span />
											</button>
										),
									)}
								</fieldset>
							</div>
							<img
								className="artwork-image"
								src={project.logo.display}
								width="1024"
								height="1024"
								alt={`${project.title} — ${project.subject}`}
								fetchPriority="high"
							/>
							<div className="artwork-bottomline">
								<span className="mono">
									{project.logo.width} × {project.logo.height}
									<span className="metadata-divider">/</span>
									{project.logo.original.split(".").pop()?.toUpperCase()}
								</span>
								<a
									className="icon-button"
									href={project.logo.original}
									target="_blank"
									rel="noreferrer"
									aria-label={t.openOriginal}
									title={t.openOriginal}
								>
									<Icon name="expand" />
								</a>
							</div>
						</div>
						<div className="identity-section-heading">
							<div>
								<h3>{t.sizes}</h3>
								<p>{t.sizesDescription}</p>
							</div>
							<span className="eyebrow">80 / 24 / 16 PX</span>
						</div>
						<div className="size-specimens">
							<div className="specimen specimen-app">
								<div className="specimen-label">
									<span>{t.appIcon}</span>
									<span>80 px</span>
								</div>
								<div className="app-preview">
									<Logo project={project} size={80} eager />
									<span>{project.title}</span>
								</div>
							</div>
							<div className="specimen specimen-sidebar">
								<div className="specimen-label">
									<span>{t.sidebar}</span>
									<span>24 px</span>
								</div>
								<div className="sidebar-preview">
									<div className="preview-workspace">
										<Logo project={project} size={24} framed={false} eager />
										<strong>{project.title}</strong>
										<Icon name="chevron" />
									</div>
									<div className="preview-sidebar-line selected">
										<Icon name="grid" />
										{t.overview}
									</div>
									<div className="preview-sidebar-line">
										<Icon name="folder" />
										{t.workspace}
									</div>
									<div className="preview-sidebar-line">
										<Icon name="settings" />
										{t.settings}
									</div>
								</div>
							</div>
							<div className="specimen specimen-browser">
								<div className="specimen-label">
									<span>{t.favicon}</span>
									<span>16 px</span>
								</div>
								<div className="browser-preview">
									<div className="browser-dots">
										<i />
										<i />
										<i />
									</div>
									<div className="browser-tab">
										<Logo project={project} size={16} framed={false} eager />
										<span>{project.title}</span>
										<Icon name="close" />
									</div>
									<div className="browser-address">
										<Icon name="globe" />
										<span>{new URL(destination(project)).hostname}</span>
									</div>
									<div className="browser-page-lines">
										<i />
										<i />
										<i />
									</div>
								</div>
							</div>
						</div>
						<div className="identity-section-heading palette-heading">
							<div>
								<h3>{t.palette}</h3>
								<p>{t.paletteDescription}</p>
							</div>
							<span className="palette-code-label">HEX / sRGB</span>
						</div>
						<Palette project={project} locale={locale} onCopy={onCopy} />
						<div className="identity-footer">
							<p>
								{project.logo.kind === "original" ? t.preserved : t.emojiNote}
								<a
									href={project.logo.sourceUrl}
									target="_blank"
									rel="noreferrer"
								>
									{t.sourceAsset}
									<Icon name="arrow" />
								</a>
							</p>
							<div className="identity-actions">
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
			</div>
		</main>
	);
}
