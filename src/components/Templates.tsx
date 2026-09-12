import type {
	CompositionOptions,
	EndingId,
	OpeningId,
	VideoEntry,
	VideoProject,
} from "@hexly/video-kit/schema";
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
const CardPreview = lazy(() => import("./VideoCardPreview"));
const source = "https://github.com/nocoo/hexly.ai/tree/main/packages/video-kit";
const plainClick = (event: React.MouseEvent) =>
	!event.button &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.shiftKey &&
	!event.altKey;

export function Templates({
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
	const family = state.videoFamily ?? "templates";
	const upload = useRef(0);
	const data = useMemo(
		() => ({
			...projectForVideo(selected, locale),
			...(screenshot ? { screenshot } : {}),
		}),
		[selected, locale, screenshot],
	);
	const options = useMemo<CompositionOptions>(
		() => ({
			theme: state.videoTheme ?? "light",
			opening: state.videoOpening ?? "signal",
			ending: state.videoEnding ?? "signature",
		}),
		[state.videoTheme, state.videoOpening, state.videoEnding],
	);
	const view = state.videoMode ?? "video";
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
		reader.onerror = () => {
			if (upload.current === request) setUploadError(t.screenshotError);
		};
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
		</div>
	);
	const themeSwitch = (
		<fieldset className="video-theme-switch" aria-label={t.theme}>
			{(["light", "dark"] as const).map((theme) => (
				<button
					type="button"
					key={theme}
					aria-pressed={options.theme === theme}
					onClick={() => onChange({ videoTheme: theme })}
				>
					<Icon name={theme === "light" ? "sun" : "moon"} />
					{t[theme]}
				</button>
			))}
		</fieldset>
	);
	const componentChoices = [
		{
			label: t.opening,
			value: options.opening,
			entries: videoManifest.openings,
			update: (id: string) =>
				onChange({ videoOpening: id as OpeningId, videoPart: "intro" }),
		},
		{
			label: t.switchTemplate,
			value: entry?.id ?? "launch",
			entries: videoManifest.templates,
			update: (id: string) => onChange({ video: id, videoPart: "content" }),
		},
		{
			label: t.ending,
			value: options.ending,
			entries: videoManifest.endings,
			update: (id: string) =>
				onChange({ videoEnding: id as EndingId, videoPart: "outro" }),
		},
	];
	const cardTarget = (item: VideoEntry) => ({
		video: item.kind === "template" ? item.id : "launch",
		...(item.kind === "opening"
			? { videoOpening: item.id, videoPart: "intro" as const }
			: item.kind === "ending"
				? { videoEnding: item.id, videoPart: "outro" as const }
				: { videoPart: "content" as const }),
	});
	const cards = videoManifest[family];
	if (state.video && !entry)
		return (
			<main className="shell videos-page" id="main-content">
				<h1>{t.notFound}</h1>
				<a
					className="button"
					href="/templates"
					onClick={(event) => {
						if (plainClick(event)) {
							event.preventDefault();
							onChange({ video: undefined });
						}
					}}
				>
					{t.back}
				</a>
			</main>
		);
	return (
		<main className="shell videos-page" id="main-content">
			{entry ? (
				<>
					<a
						className="video-back"
						href="/templates"
						onClick={(event) => {
							if (plainClick(event)) {
								event.preventDefault();
								onChange({ video: undefined });
							}
						}}
					>
						← {t.back}
					</a>
					<div className="video-detail-heading">
						<div>
							<p className="eyebrow">
								<span className="video-red-dot" />
								{t.combination}
							</p>
							<h1>
								{entry.title}
								<span>.</span>
							</h1>
						</div>
						<p>
							{t.combinationHint}
							<br />
							<span>16:9 / 30 fps / v{videoManifest.kitVersion}</span>
						</p>
					</div>
					<div className="video-workbench-bar">
						{chooser}
						<div className="video-upload">
							<label className="button button-secondary">
								<Icon name="image" />
								{t.screenshot}
								<input
									type="file"
									accept="image/png,image/jpeg,image/webp"
									onChange={(event) => readScreenshot(event.target.files?.[0])}
								/>
							</label>
							{screenshot ? (
								<button
									type="button"
									onClick={() => {
										upload.current++;
										setScreenshot(undefined);
									}}
								>
									{t.removeScreenshot}
								</button>
							) : (
								<span>{t.screenshotHint}</span>
							)}
							{uploadError ? <span role="alert">{uploadError}</span> : null}
						</div>
						{themeSwitch}
					</div>
					<fieldset className="video-composition" aria-label={t.combination}>
						{componentChoices.map((choice, i) => (
							<label key={choice.label}>
								<span className="video-choice-heading">
									<span>{String(i + 1).padStart(2, "0")}</span>
									{choice.label}
									<span aria-hidden="true">{i === 2 ? "●" : "→"}</span>
								</span>
								<select
									aria-label={choice.label}
									value={choice.value}
									onChange={(event) => choice.update(event.target.value)}
								>
									{choice.entries.map((item) => (
										<option key={item.id} value={item.id}>
											{item.title}
										</option>
									))}
								</select>
								<span className="video-choice-note">
									{
										choice.entries.find((item) => item.id === choice.value)
											?.description[locale]
									}
								</span>
							</label>
						))}
					</fieldset>
					<Suspense
						fallback={
							<div className="video-loading" role="status">
								{t.loading}
							</div>
						}
					>
						<ProjectPreview
							key={`${data.id}-${locale}`}
							entry={entry}
							project={data}
							locale={locale}
							options={options}
							focusScene={state.videoPart ?? "content"}
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
						<div className="video-intro-note" aria-hidden="true">
							<div className="video-combination-figure">
								<span>05</span>
								<i>×</i>
								<span>05</span>
								<i>×</i>
								<span>05</span>
							</div>
							<p>OPEN / CONTENT / CLOSE</p>
							<div className="video-mini-timeline">
								<i />
								<i />
								<i />
							</div>
							<span>LIGHT + DARK</span>
						</div>
					</section>
					<div className="video-library-bar">
						<div>
							<h2>{t.library}</h2>
							<span>{t.templateCount}</span>
						</div>
						<div className="video-library-settings">
							{chooser}
							{themeSwitch}
						</div>
					</div>
					<div className="video-family-bar">
						<fieldset className="video-family-tabs" aria-label={t.part}>
							{(["templates", "openings", "endings"] as const).map((part) => (
								<button
									type="button"
									key={part}
									aria-pressed={family === part}
									onClick={() => onChange({ videoFamily: part })}
								>
									{t[part]}
									<span>05</span>
								</button>
							))}
						</fieldset>
						<p>{t.previewOnly}</p>
					</div>
					<div className="video-template-grid">
						{cards.map((item, index) => {
							const target = cardTarget(item);
							const href = videoHref(target.video, data.id, view, {
								...options,
								...(item.kind === "opening"
									? { opening: item.id }
									: item.kind === "ending"
										? { ending: item.id }
										: {}),
								part: target.videoPart,
							});
							return (
								<article
									className="video-card"
									data-video-template={item.id}
									data-video-kind={item.kind}
									key={`${item.kind}-${item.id}`}
								>
									<a
										href={href}
										aria-label={`${t.open}: ${item.title}`}
										onClick={(event) => {
											if (plainClick(event)) {
												event.preventDefault();
												onChange(target);
											}
										}}
									>
										<div className="video-card-art">
											<Suspense
												fallback={
													<div className="video-loading">{t.loading}</div>
												}
											>
												<CardPreview
													entry={item}
													project={data}
													locale={locale}
													options={options}
												/>
											</Suspense>
											<span className="video-card-play">
												<Icon name="arrow" />
											</span>
										</div>
										<div className="video-card-content">
											<div className="video-card-kicker">
												<span>
													{String(index + 1).padStart(2, "0")} / {t[family]}
												</span>
												<span>{t[options.theme]}</span>
											</div>
											<div className="video-card-title">
												<h2>{item.title}</h2>
												<span aria-hidden="true">↗</span>
											</div>
											<p>{item.description[locale]}</p>
											<div className="video-card-meta">
												<span>{item.use[locale]}</span>
												<span>16:9</span>
											</div>
										</div>
									</a>
								</article>
							);
						})}
					</div>
				</>
			)}
			<div className="video-resource-links">
				<a href={source}>{t.docs} ↗</a>
				<a href="/templates/film-v2.schema.json">{t.schema} ↗</a>
				<a href="/templates/manifest.json">{t.publicManifest} ↗</a>
			</div>
		</main>
	);
}
