import { useEffect, useState } from "react";
import { copy } from "../data/copy";
import { assetUrl } from "../model/assets";
import type { Locale, Project, ProjectVideo } from "../model/project";
import { AssetLink } from "./AssetLink";
import { Icon } from "./Icon";

function duration(seconds: number) {
	return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function VideoPlayer({
	video,
	locale,
}: {
	video: ProjectVideo;
	locale: Locale;
}) {
	const [started, setStarted] = useState(false);
	const [failed, setFailed] = useState(false);
	const t = copy[locale];
	const defaultCaption = video.captionsBurnedIn
		? undefined
		: (video.captions?.find(
				(track) => track.language.split("-")[0] === locale,
			) ?? video.captions?.[0]);
	return (
		<figure className="project-film" id={`video-${video.id}`}>
			<div className="project-video-stage">
				{started ? (
					// biome-ignore lint/a11y/useMediaCaption: Actual caption tracks are rendered from the project manifest below.
					<video
						controls
						autoPlay
						playsInline
						preload="metadata"
						crossOrigin="anonymous"
						poster={assetUrl(video.poster)}
						src={assetUrl(video.src)}
						aria-label={video.title[locale]}
						onError={() => setFailed(true)}
					>
						{video.captions?.map((track) => (
							<track
								key={track.src}
								kind="captions"
								src={assetUrl(track.src)}
								srcLang={track.language}
								label={track.label}
								default={track === defaultCaption}
							/>
						))}
					</video>
				) : (
					<button
						className="project-video-poster"
						type="button"
						aria-label={`${t.playVideo}: ${video.title[locale]}`}
						onClick={() => setStarted(true)}
					>
						<img
							crossOrigin="anonymous"
							src={assetUrl(video.poster)}
							alt=""
							width={1920}
							height={1080}
							decoding="async"
						/>
						<span className="project-video-play">
							<Icon name="play" />
							<span>{t.playVideo}</span>
						</span>
						<span className="project-video-duration">
							{duration(video.durationSeconds)}
						</span>
					</button>
				)}
			</div>
			<figcaption>
				<strong>{video.title[locale]}</strong>
				<span className="mono">
					{video.language.toUpperCase()} · {duration(video.durationSeconds)}
				</span>
			</figcaption>
			{failed && (
				<p className="project-video-error" role="alert">
					{t.videoFailed}{" "}
					<AssetLink href={video.src} target="_blank" rel="noreferrer">
						{t.openVideo} ↗
					</AssetLink>
				</p>
			)}
		</figure>
	);
}

export function ProjectMedia({
	project,
	locale,
	anchor,
}: {
	project: Project;
	locale: Locale;
	anchor?: string;
}) {
	const videos = project.media?.videos ?? [];
	const screenshots = project.media?.screenshots ?? [];
	const requested = videos.find((video) => `video-${video.id}` === anchor);
	const [selection, setSelection] = useState(videos[0]?.id);
	useEffect(() => {
		if (requested) setSelection(requested.id);
	}, [requested]);
	if (!videos.length && !screenshots.length) return null;
	const active =
		requested ?? videos.find((video) => video.id === selection) ?? videos[0];
	const t = copy[locale];
	return (
		<section
			className="project-media"
			id="media"
			aria-labelledby="project-media-title"
		>
			<div className="detail-section-heading">
				<div>
					<h2 id="project-media-title">{t.projectMedia}</h2>
					<p>{t.projectMediaDescription}</p>
				</div>
			</div>
			{active && <VideoPlayer key={active.id} video={active} locale={locale} />}
			{videos.length > 1 && (
				<nav className="project-video-list" aria-label={t.videoList}>
					{videos.map((video) => (
						<AssetLink
							key={video.id}
							href={`#video-${video.id}`}
							aria-current={active?.id === video.id ? "true" : undefined}
						>
							<img
								crossOrigin="anonymous"
								src={assetUrl(video.poster)}
								alt=""
								width={320}
								height={180}
								loading="lazy"
								decoding="async"
							/>
							<span>
								<strong>{video.title[locale]}</strong>
								<span className="mono">{duration(video.durationSeconds)}</span>
							</span>
						</AssetLink>
					))}
				</nav>
			)}
			{screenshots.length > 0 && (
				<section className="project-screenshots" aria-label={t.screenshots}>
					{screenshots.map((shot) => (
						<figure key={shot.id}>
							<AssetLink
								href={shot.src}
								target="_blank"
								rel="noreferrer"
								aria-label={`${t.openOriginal}: ${shot.alt[locale]}`}
							>
								<img
									src={assetUrl(shot.src)}
									alt={shot.alt[locale]}
									width={shot.width}
									height={shot.height}
									loading="lazy"
									decoding="async"
								/>
							</AssetLink>
							<figcaption>{shot.alt[locale]}</figcaption>
						</figure>
					))}
				</section>
			)}
		</section>
	);
}
