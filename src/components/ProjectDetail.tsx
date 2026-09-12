import {
	type CSSProperties,
	type RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
} from "react";
import { categoryLabels, copy } from "../data/copy";
import { brandTexture } from "../model/brand";
import { categories, categoryCounts } from "../model/catalogue";
import type { DirectoryState } from "../model/navigation";
import type { Category, Locale, Project } from "../model/project";
import { BrandHero } from "./BrandKit";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { LogoReview } from "./LogoReview";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectOverview } from "./ProjectOverview";
import { SearchField } from "./SearchField";

export function ProjectDetail({
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
	const project = projects.find((item) => item.id === state.project);
	const counts = categoryCounts(projects);
	const foreground = project?.family?.foreground ?? project?.logo;
	const selectedIndex = visible.findIndex((item) => item.id === project?.id);
	const pickerRef = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		const picker = pickerRef.current;
		if (!picker) return;
		const items = picker.querySelectorAll<HTMLButtonElement>(".picker-item");
		const current = items[selectedIndex];
		const last = items[visible.length - 1];
		if (!current || !last) return;

		const alignCurrent = () => {
			// Leave enough trailing space for even the final project to align left.
			picker.style.setProperty(
				"--picker-last-width",
				`${last.getBoundingClientRect().width}px`,
			);
			const inset = Number.parseFloat(getComputedStyle(picker).paddingLeft);
			picker.scrollTo({
				left: current.offsetLeft - inset,
				behavior: "instant",
			});
		};
		alignCurrent();
		const observer = new ResizeObserver(alignCurrent);
		observer.observe(picker);
		for (const item of items) observer.observe(item);
		return () => observer.disconnect();
	}, [selectedIndex, visible]);
	const move = useCallback(
		(offset: number) => {
			if (visible.length < 2) return;
			const next =
				visible[(selectedIndex + offset + visible.length) % visible.length];
			if (next) onChange({ project: next.id, anchor: "brand" });
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
				(target.isContentEditable ||
					target.closest("input, textarea, select, video, .project-media"))
			)
				return;
			event.preventDefault();
			move(event.key === "ArrowLeft" ? -1 : 1);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [move, visible.length]);
	return (
		<main id="main-content" className="shell gallery-main project-detail-main">
			<nav className="detail-breadcrumb" aria-label={t.browseAs}>
				<a
					href="/"
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
						onChange({
							view: "directory",
							query: "",
							category: "all",
							withVideo: undefined,
						});
					}}
				>
					<Icon name="left" />
					{t.back}
				</a>
				<a
					href="/logos"
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
						onChange({
							view: "logos",
							query: "",
							category: "all",
							withVideo: undefined,
						});
					}}
				>
					<Icon name="image" />
					{t.gallery}
				</a>
			</nav>

			{project ? (
				<section
					className="identity-detail"
					aria-labelledby="identity-title"
					data-brand-artwork={project.brandKit?.method}
					style={brandTexture(project.brandKit) as CSSProperties}
				>
					<div className="identity-heading">
						<Logo project={project} size={72} framed={false} eager />
						<div className="identity-summary">
							<p className="identity-category">
								{categoryLabels[locale][project.category]}
								{project.archived &&
									project.category !== "archive" &&
									` · ${categoryLabels[locale].archive}`}
							</p>
							<h1 id="identity-title" title={project.title}>
								<span className="identity-name">{project.title}</span>
								<span className="identity-emoji" aria-hidden="true">
									{project.emoji}
								</span>
							</h1>
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
					{project.brandKit?.hero && (
						<BrandHero kit={project.brandKit} locale={locale} />
					)}
					<nav className="project-section-nav" aria-label={t.projectSections}>
						<div>
							{project.media?.videos?.length ||
							project.media?.screenshots?.length ? (
								<a href="#media">{t.projectMedia}</a>
							) : null}
							{project.overview && <a href="#overview">{t.overview}</a>}
							<a href="#brand">{t.brand}</a>
						</div>
						<a
							className="project-template-link"
							href={`/templates?project=${project.id}`}
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
								onChange({
									view: "templates",
									video: undefined,
									videoProject: project.id,
								});
							}}
						>
							{t.useTemplate}
							<Icon name="arrow" />
						</a>
					</nav>
					<ProjectMedia
						key={project.id}
						project={project}
						locale={locale}
						anchor={state.anchor}
					/>
					<ProjectOverview project={project} locale={locale} />
					<section
						id="brand"
						className="project-brand"
						aria-labelledby="brand-title"
					>
						<div className="detail-section-heading">
							<div>
								<h2 id="brand-title">{t.brand}</h2>
								<p>{t.brandDescription}</p>
							</div>
							<div className="brand-metadata">
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
									{project.brandKit
										? `${project.brandKit.method === "gpt-image-2" ? "GPT Image · PNG" : "SVG"} · v${project.brandKit.version}`
										: `${foreground?.width} × ${foreground?.height}`}
									{project.family && ` · ${project.family.updated}`}
								</span>
							</div>
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
							{visible.length === 0 && (
								<div className="empty-state">
									<h3>{t.noResults}</h3>
									<p>{t.noResultsDescription}</p>
									<button
										type="button"
										className="button button-secondary"
										onClick={() =>
											onChange({
												category: "all",
												query: "",
												withVideo: undefined,
												anchor: "brand",
											})
										}
									>
										{t.reset}
									</button>
								</div>
							)}
							<div className="project-picker" ref={pickerRef}>
								{visible.map((item) => (
									<button
										type="button"
										key={item.id}
										className="picker-item"
										aria-pressed={project?.id === item.id}
										onClick={() =>
											onChange({ project: item.id, anchor: "brand" })
										}
									>
										<Logo project={item} size={32} framed={false} />
										<span>{item.title}</span>
									</button>
								))}
							</div>
						</aside>

						<LogoReview
							key={project.id}
							project={project}
							locale={locale}
							onCopy={onCopy}
						/>
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
										onCopy(`${window.location.origin}/projects/${project.id}`)
									}
								>
									<Icon name="link" />
									{t.share}
								</button>
							</div>
						</div>
					</section>
				</section>
			) : (
				<div className="empty-state gallery-empty">
					<Icon name="search" />
					<h1>
						{projects.some((item) => item.id === state.project)
							? t.noResults
							: t.projectNotFound}
					</h1>
					<p>{t.noResultsDescription}</p>
					<button
						className="button button-secondary"
						type="button"
						onClick={() =>
							onChange({
								view: "directory",
								query: "",
								category: "all",
								withVideo: undefined,
							})
						}
					>
						{t.reset}
					</button>
				</div>
			)}
		</main>
	);
}
