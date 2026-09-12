import type { VideoEntry, VideoProject } from "@hexly/video-kit/schema";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { videoCopy } from "../data/video-copy";
import type { DirectoryState } from "../model/navigation";
import type { Locale, Project } from "../model/project";
import {
	findVideo,
	projectForVideo,
	videoHref,
	videoManifest,
} from "../model/videos";
import { Icon } from "./Icon";
import "../styles/videos.css";

const ProjectPreview = lazy(() => import("./VideoProjectPreview"));
const source = "https://github.com/nocoo/hexly.ai/tree/main/packages/video-kit";

function TemplateCard({
	entry,
	locale,
	project,
	onOpen,
	index,
}: {
	entry: VideoEntry;
	locale: Locale;
	project?: string;
	onOpen: (id: string) => void;
	index: number;
}) {
	const t = videoCopy[locale];
	return (
		<article className="video-card" data-video-template={entry.id}>
			<a
				href={videoHref(entry.id, project)}
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
					onOpen(entry.id);
				}}
				aria-label={`${t.open}: ${entry.title}`}
			>
				<div className="video-card-art">
					<img
						src={entry.poster.src}
						width={entry.poster.width}
						height={entry.poster.height}
						loading={index < 2 ? "eager" : "lazy"}
						alt={`${entry.title} — ${entry.description[locale]}`}
					/>
					<span className="video-card-play">
						<Icon name="play" />
					</span>
				</div>
				<div className="video-card-content">
					<div className="video-card-kicker">
						<span>
							{String(index + 1).padStart(2, "0")} /{" "}
							{entry.kind === "template" ? t.light : t.projects}
						</span>
						<span>{t[entry.status]}</span>
					</div>
					<div className="video-card-title">
						<h2>{entry.title}</h2>
						<span aria-hidden="true">↗</span>
					</div>
					<p>{entry.description[locale]}</p>
					<div className="video-card-meta">
						<span>16:9 · Video + Deck</span>
						<span>v{entry.version}</span>
					</div>
				</div>
			</a>
		</article>
	);
}

export function Videos({
	projects,
	state,
	locale,
	onChange,
}: {
	projects: Project[];
	state: DirectoryState;
	locale: Locale;
	onChange: (patch: Partial<DirectoryState>) => void;
}) {
	const t = videoCopy[locale];
	const selected = projects.find(
		(project) => project.id === state.videoProject,
	);
	const entry = findVideo(state.video);
	const [screenshot, setScreenshot] = useState<VideoProject["screenshot"]>();
	const [uploadError, setUploadError] = useState("");
	const [sample, setSample] = useState(false);
	const upload = useRef(0);
	const data = useMemo(
		() => ({
			...projectForVideo(selected, locale),
			...(screenshot ? { screenshot } : {}),
		}),
		[selected, locale, screenshot],
	);
	const view = state.videoMode ?? "video";
	const open = (id: string) => {
		setSample(false);
		onChange({ video: id });
	};
	const readScreenshot = (file?: File) => {
		setUploadError("");
		if (!file) return;
		const request = ++upload.current;
		if (
			!["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
			file.size > 8 * 1024 * 1024
		) {
			setUploadError(t.screenshotError);
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result !== "string") return;
			const src = reader.result;
			const image = new Image();
			image.src = src;
			image
				.decode()
				.then(() => {
					if (upload.current === request)
						setScreenshot({ src, alt: `${data.name} — ${t.screenshotAlt}` });
				})
				.catch(() => {
					if (upload.current === request) setUploadError(t.screenshotError);
				});
		};
		reader.onerror = () => setUploadError(t.screenshotError);
		reader.readAsDataURL(file);
	};
	const chooser = (
		<div className="video-project-chooser">
			<label>
				<span className="eyebrow">{t.project}</span>
				<select
					aria-label={t.project}
					value={selected?.id ?? "hexly-ai"}
					onChange={(event) => {
						upload.current++;
						setScreenshot(undefined);
						setSample(false);
						onChange({ videoProject: event.target.value });
					}}
				>
					<option value="hexly-ai">hexly.ai</option>
					{projects
						.toSorted((a, b) => a.title.localeCompare(b.title, "en"))
						.map((project) => (
							<option key={project.id} value={project.id}>
								{project.title}
								{project.archived ? ` · ${t.archived}` : ""}
							</option>
						))}
				</select>
			</label>
			<p>{t.projectHint}</p>
		</div>
	);

	if (state.video && !entry)
		return (
			<main className="shell videos-page" id="main-content">
				<h1>{t.notFound}</h1>
				<button
					type="button"
					className="button"
					onClick={() => onChange({ video: undefined })}
				>
					{t.back}
				</button>
			</main>
		);
	return (
		<main className="shell videos-page" id="main-content">
			{entry ? (
				<>
					<a
						className="video-back"
						href="/videos"
						onClick={(event) => {
							event.preventDefault();
							onChange({ video: undefined });
						}}
					>
						← {t.back}
					</a>
					<div className="video-detail-heading">
						<div>
							<p className="eyebrow">
								<span className="video-red-dot" />
								{t.eyebrow}
							</p>
							<h1>
								{entry.title}
								<span>.</span>
							</h1>
							<p>{entry.description[locale]}</p>
						</div>
						<div className="video-detail-meta">
							<span>
								{t[entry.status]} · v{entry.version}
							</span>
							<span>16:9 / 30 fps</span>
							<span>
								{entry.kind === "template"
									? `${entry.components.length} ${t.components}`
									: entry.published}
							</span>
						</div>
					</div>
					{entry.kind === "template" ? (
						<>
							<div className="video-workbench-bar">
								{chooser}
								<div className="video-upload">
									<label className="button">
										<Icon name="image" />
										{t.screenshot}
										<input
											type="file"
											accept="image/png,image/jpeg,image/webp"
											onChange={(event) =>
												readScreenshot(event.target.files?.[0])
											}
										/>
									</label>
									{screenshot ? (
										<button
											type="button"
											onClick={() => setScreenshot(undefined)}
										>
											{t.removeScreenshot}
										</button>
									) : (
										<span>{t.screenshotHint}</span>
									)}
									{uploadError ? <span role="alert">{uploadError}</span> : null}
								</div>
							</div>
							<nav className="video-theme-nav" aria-label={t.switchTemplate}>
								{videoManifest.templates.map((template) => (
									<a
										key={template.id}
										href={videoHref(template.id, data.id, view)}
										aria-current={entry.id === template.id ? "page" : undefined}
										onClick={(event) => {
											if (event.metaKey || event.ctrlKey || event.shiftKey)
												return;
											event.preventDefault();
											open(template.id);
										}}
									>
										{template.title}
									</a>
								))}
							</nav>
							<Suspense
								fallback={
									<div className="video-loading" role="status">
										{t.loading}
									</div>
								}
							>
								<ProjectPreview
									key={`${entry.id}-${data.id}-${locale}`}
									entry={entry}
									project={data}
									locale={locale}
									view={view}
									onView={(videoMode) => onChange({ videoMode })}
								/>
							</Suspense>
							<div className="video-usage">
								<span className="eyebrow">{t.use}</span>
								<p>{entry.use[locale]}</p>
							</div>
						</>
					) : (
						<div className="video-project-film">
							<video
								muted
								controls
								preload="none"
								playsInline
								poster={entry.poster.src}
								src={entry.clip.src}
								aria-label={entry.title}
							/>
							<p>
								<a className="button button-primary" href={entry.previewUrl}>
									{t.projectSite} ↗
								</a>{" "}
								<a className="button" href={entry.sourceUrl}>
									{t.projectSource} ↗
								</a>
							</p>
						</div>
					)}
					<section className="video-downloads">
						<div>
							<h2>{t.downloads}</h2>
							<p>{t.downloadHint}</p>
						</div>
						<div className="video-download-links">
							<a href={entry.clip.src} download>
								MP4 ↓
							</a>
							<a href={entry.deck.pptx.src} download>
								PPTX ↓
							</a>
							<a href={entry.deck.pdf.src} download>
								PDF ↓
							</a>
							<button type="button" onClick={() => setSample(!sample)}>
								{sample ? t.closeSample : t.sample}
							</button>
						</div>
						{sample ? (
							<video
								muted
								className="video-sample"
								controls
								playsInline
								preload="metadata"
								poster={entry.poster.src}
								src={entry.clip.src}
								aria-label={`${entry.title} ${t.sample}`}
							/>
						) : null}
					</section>
				</>
			) : (
				<>
					<section className="video-intro">
						<div>
							<p className="eyebrow">
								<span className="video-red-dot" />
								{t.eyebrow}
							</p>
							<h1>
								{t.title}
								<br />
								<span>{t.titleEnd}</span>
							</h1>
							<p>{t.description}</p>
						</div>
						<div className="video-intro-note">
							<span>01 — 07</span>
							<div className="video-mini-timeline">
								<i />
								<i />
								<i />
								<i />
								<i />
								<i />
								<i />
							</div>
							<p>INTRO / STORY / SIGNATURE</p>
							<span>Video ↔ Deck</span>
						</div>
					</section>
					<div className="video-library-bar">
						<div>
							<h2>{t.templates}</h2>
							<span>{t.templateCount}</span>
						</div>
						{chooser}
					</div>
					<div className="video-template-grid">
						{videoManifest.templates.map((template, index) => (
							<TemplateCard
								key={template.id}
								entry={template}
								locale={locale}
								project={data.id}
								onOpen={open}
								index={index}
							/>
						))}
					</div>
					<section className="video-films">
						<h2>{t.projects}</h2>
						{videoManifest.projects.length ? (
							<div className="video-template-grid">
								{videoManifest.projects.map((film, index) => (
									<TemplateCard
										key={film.id}
										entry={film}
										locale={locale}
										onOpen={open}
										index={index}
									/>
								))}
							</div>
						) : (
							<div className="video-empty">
								<span className="video-red-dot" />
								<div>
									<h3>{t.noProjects}</h3>
									<p>{t.noProjectsBody}</p>
								</div>
							</div>
						)}
					</section>
				</>
			)}
			<div className="video-resource-links">
				<a href={source}>{t.docs} ↗</a>
				<a href="/videos/film-v1.schema.json">{t.schema} ↗</a>
				<a href="/videos/manifest.json">{t.publicManifest} ↗</a>
			</div>
		</main>
	);
}
