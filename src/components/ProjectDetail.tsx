import {
	type CSSProperties,
	type RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
} from "react";
import { categoryLabels, copy } from "../data/copy";
import { assetUrl } from "../model/assets";
import { brandSourceLabel, brandTexture } from "../model/brand";
import {
	categories,
	categoryCounts,
	isChromeWebStoreProject,
} from "../model/catalogue";
import { type DirectoryState, navigationPath } from "../model/navigation";
import type { Category, Locale, Project } from "../model/project";
import { AgentGuide } from "./AgentGuide";
import { AssetLink } from "./AssetLink";
import { BrandDownloads, BrandHero } from "./BrandKit";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { LogoArchive } from "./LogoArchive";
import { LogoReview } from "./LogoReview";
import { ProjectApi } from "./ProjectApi";
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
	const activeTab =
		state.anchor === "downloads"
			? "downloads"
			: ["api", "agent-guide", "integration"].includes(state.anchor ?? "")
				? "api"
				: "brand";
	const tabs = [
		{ id: "brand", label: t.projectDetail, icon: "image" },
		{ id: "downloads", label: t.downloadsTab, icon: "download" },
		{ id: "api", label: t.integrationTab, icon: "link" },
	] as const;
	const selectTab = (id: string) =>
		onChange({
			anchor: id === "api" ? "integration" : id === "brand" ? "detail" : id,
		});
	const counts = categoryCounts(projects);
	const foreground = project?.family?.foreground ?? project?.logo;
	const chromeStore = project ? isChromeWebStoreProject(project) : false;
	const selectedIndex = visible.findIndex((item) => item.id === project?.id);
	const pickerRef = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		const picker = pickerRef.current;
		if (!picker) return;
		const root = document.documentElement;
		const items = picker.querySelectorAll<HTMLButtonElement>(".picker-item");
		const current = items[selectedIndex];
		const first = items[0];
		const last = items[visible.length - 1];
		if (!current || !first || !last) return;

		const alignCurrent = () => {
			// Both edge projects need enough space to sit at the carousel's center.
			picker.style.setProperty(
				"--picker-first-width",
				`${first.getBoundingClientRect().width}px`,
			);
			picker.style.setProperty(
				"--picker-last-width",
				`${last.getBoundingClientRect().width}px`,
			);
			root.style.setProperty(
				"--project-tabs-height",
				`${document.querySelector<HTMLElement>(".project-section-nav")?.offsetHeight ?? 0}px`,
			);
			root.style.setProperty(
				"--project-carousel-height",
				`${picker.parentElement?.offsetHeight ?? 0}px`,
			);
			picker.scrollTo({
				left:
					current.offsetLeft +
					current.getBoundingClientRect().width / 2 -
					picker.clientWidth / 2,
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
					? "instant"
					: "smooth",
			});
		};
		if (picker.contains(document.activeElement))
			current.focus({ preventScroll: true });
		alignCurrent();
		const observer = new ResizeObserver(alignCurrent);
		observer.observe(picker);
		const tablist = document.querySelector(".project-section-nav");
		if (tablist) observer.observe(tablist);
		for (const item of items) observer.observe(item);
		return () => {
			observer.disconnect();
			root.style.removeProperty("--project-carousel-height");
			root.style.removeProperty("--project-tabs-height");
		};
	}, [selectedIndex, visible]);
	const move = useCallback(
		(offset: number) => {
			if (visible.length < 2) return;
			const next =
				visible[(selectedIndex + offset + visible.length) % visible.length];
			if (next)
				onChange({
					project: next.id,
					anchor: "detail",
				});
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
					target.closest(
						"input, textarea, select, video, [role=tablist], .project-media, .project-api, .agent-region, .identity-archive",
					))
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
			<div className="picker-heading">
				<span>
					{t.selectProject}{" "}
					<span className="mono">
						{visible.length}/{projects.length}
					</span>
				</span>
				<div className="picker-controls">
					<div className="picker-category-control">
						<select
							className="picker-category"
							aria-label={t.categories}
							value={state.category}
							onChange={(event) =>
								onChange({
									category: event.target.value as Category,
									anchor: undefined,
								})
							}
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{categoryLabels[locale][category]} · {counts[category]}
								</option>
							))}
						</select>
						<Icon name="chevron" />
					</div>
					<SearchField
						value={state.query}
						onChange={(query) => onChange({ query, anchor: undefined })}
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
								anchor: undefined,
							})
						}
					>
						{t.reset}
					</button>
				</div>
			)}
			<nav className="gallery-selector" aria-label={t.selectProject}>
				<div className="project-picker" ref={pickerRef}>
					{visible.map((item) => (
						<button
							type="button"
							key={item.id}
							className="picker-item"
							aria-pressed={project?.id === item.id}
							aria-keyshortcuts={
								project?.id === item.id && visible.length > 1
									? "ArrowLeft ArrowRight"
									: undefined
							}
							onClick={() => onChange({ project: item.id, anchor: "detail" })}
						>
							<Logo project={item} size={32} framed={false} />
							<span>{item.title}</span>
						</button>
					))}
				</div>
			</nav>

			{project ? (
				<section
					className="identity-detail"
					aria-labelledby="identity-title"
					data-project={project.id}
					data-brand-artwork={project.brandKit?.method}
					data-texture-display={
						project.brandTexture?.display ?? project.brandKit?.texture?.display
					}
					style={brandTexture(project) as CSSProperties}
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
									<AssetLink
										className={
											chromeStore
												? "identity-chrome-store"
												: "button button-secondary identity-website"
										}
										href={project.website}
										target="_blank"
										rel="noreferrer"
										aria-label={`${chromeStore ? t.addToChrome : t.visit}: ${project.title}`}
										title={chromeStore ? t.addToChrome : undefined}
									>
										{chromeStore ? (
											<img
												src={assetUrl(
													"/badges/chrome-web-store/v1.0.0/chrome-web-store.png",
												)}
												alt={t.chromeWebStore}
												width={340}
												height={96}
												crossOrigin="anonymous"
											/>
										) : (
											<>
												<Icon name="globe" />
												{t.visit}
												<Icon name="arrow" />
											</>
										)}
									</AssetLink>
								)}
								<AssetLink
									className="button button-secondary identity-github"
									href={project.repository}
									target="_blank"
									rel="noreferrer"
									aria-label={`${t.source}: ${project.title}`}
								>
									<Icon name="github" />
									GitHub
									<Icon name="arrow" />
								</AssetLink>
								<button
									className="button button-secondary identity-share"
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
					</div>
					<div
						className="project-section-nav"
						role="tablist"
						aria-label={t.projectSections}
					>
						{tabs.map((tab, index) => (
							<a
								key={tab.id}
								href={`#${tab.id === "api" ? "integration" : tab.id === "brand" ? "detail" : tab.id}`}
								role="tab"
								id={`tab-${tab.id}`}
								aria-selected={activeTab === tab.id}
								aria-controls={`panel-${tab.id}`}
								tabIndex={activeTab === tab.id ? 0 : -1}
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
									selectTab(tab.id);
								}}
								onKeyDown={(event) => {
									if (event.key === " ") {
										event.preventDefault();
										selectTab(tab.id);
										return;
									}
									const offset =
										event.key === "ArrowRight"
											? 1
											: event.key === "ArrowLeft"
												? -1
												: 0;
									const next =
										event.key === "Home"
											? tabs[0]
											: event.key === "End"
												? tabs[tabs.length - 1]
												: offset
													? tabs[(index + offset + tabs.length) % tabs.length]
													: undefined;
									if (!next) return;
									event.preventDefault();
									event.stopPropagation();
									selectTab(next.id);
									document
										.getElementById(`tab-${next.id}`)
										?.focus({ preventScroll: true });
								}}
							>
								<Icon name={tab.icon} />
								{tab.label}
							</a>
						))}
					</div>
					<div
						id="panel-brand"
						className="project-tab-panel"
						role="tabpanel"
						aria-labelledby="tab-brand"
						hidden={activeTab !== "brand"}
					>
						<div id="detail">
							{project.brandKit?.hero && (
								<BrandHero kit={project.brandKit} locale={locale} />
							)}
							{(project.overview ||
								project.media?.videos?.length ||
								project.media?.screenshots?.length) && (
								<section
									id="overview"
									className="project-detail-overview"
									aria-labelledby="overview-title"
								>
									<div className="detail-section-heading">
										<h2 id="overview-title">{t.overview}</h2>
									</div>
									<ProjectOverview project={project} locale={locale} />
									<ProjectMedia
										key={`media-${project.id}`}
										project={project}
										locale={locale}
										anchor={state.anchor}
										visible={activeTab === "brand"}
									/>
								</section>
							)}
							<section
								id="brand"
								className="project-brand"
								aria-labelledby="brand-title"
							>
								<div className="detail-section-heading">
									<div>
										<h2 id="brand-title">{t.brandTab}</h2>
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
												? `${brandSourceLabel(project, locale)} · v${project.brandKit.version}`
												: `${foreground?.width} × ${foreground?.height}`}
											{project.family && ` · ${project.family.updated}`}
										</span>
									</div>
								</div>

								<LogoReview
									key={project.id}
									project={project}
									locale={locale}
									onCopy={onCopy}
								/>
							</section>
						</div>
					</div>

					<div
						id="panel-downloads"
						className="project-tab-panel"
						role="tabpanel"
						aria-labelledby="tab-downloads"
						hidden={activeTab !== "downloads"}
					>
						<section
							id="downloads"
							className="project-downloads"
							aria-labelledby="downloads-title"
						>
							<div className="detail-section-heading">
								<div>
									<h2 id="downloads-title">{t.downloadsTab}</h2>
									<p>{t.downloadsDescription}</p>
								</div>
							</div>
							{project.brandKit && (
								<BrandDownloads
									project={project}
									kit={project.brandKit}
									locale={locale}
								/>
							)}
							{project.family && (
								<LogoArchive
									key={project.id}
									project={project}
									family={project.family}
									locale={locale}
								/>
							)}
							<div className="identity-footer">
								<p>
									{project.logo.kind === "original" ? t.preserved : t.emojiNote}
									<AssetLink
										href={project.logo.sourceUrl}
										target="_blank"
										rel="noreferrer"
									>
										{t.sourceAsset}
										<Icon name="arrow" />
									</AssetLink>
								</p>
								<div className="identity-actions">
									{!project.family && (
										<AssetLink
											className="button button-secondary"
											href={project.logo.original}
											download
										>
											<Icon name="download" />
											{project.logo.kind === "original"
												? t.download
												: t.downloadEmoji}
										</AssetLink>
									)}
								</div>
							</div>
						</section>
					</div>
					<div
						id="panel-api"
						className="project-tab-panel"
						role="tabpanel"
						aria-labelledby="tab-api"
						hidden={activeTab !== "api"}
					>
						<div
							id="integration"
							className="integration-heading detail-section-heading"
						>
							<div>
								<h2>{t.integrationTab}</h2>
								<p>{t.integrationDescription}</p>
							</div>
							<AssetLink
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
							</AssetLink>
						</div>
						{activeTab === "api" && (
							<ProjectApi
								key={`api-${project.id}`}
								project={project}
								locale={locale}
							/>
						)}
						<AgentGuide
							path={navigationPath(state)}
							projects={projects}
							locale={locale}
						/>
					</div>
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
