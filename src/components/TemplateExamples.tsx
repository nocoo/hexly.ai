import examples from "../data/template-examples.json" with { type: "json" };
import { videoCopy } from "../data/video-copy";
import type { Locale } from "../model/project";
import { AssetLink } from "./AssetLink";
import { VideoPlayer } from "./ProjectMedia";

export function TemplateExamples({
	locale,
	template,
}: {
	locale: Locale;
	template?: string;
}) {
	const t = videoCopy[locale];
	const entries = examples.examples.filter(
		(example) => !template || example.template === template,
	);
	return (
		<section
			className="template-examples"
			id="examples"
			aria-labelledby="template-examples-title"
			onPlayCapture={(event) => {
				for (const player of event.currentTarget.querySelectorAll("video")) {
					if (player !== event.target) player.pause();
				}
			}}
		>
			<div className="detail-section-heading">
				<div>
					<p className="eyebrow">{t.examplesEyebrow}</p>
					<h2 id="template-examples-title">{t.examples}</h2>
					<p>{t.examplesDescription}</p>
				</div>
				{template ? (
					<a className="video-examples-jump" href="/templates#examples">
						{t.allExamples} ↗
					</a>
				) : (
					<span className="mono">
						{String(entries.length).padStart(2, "0")} MP4
					</span>
				)}
			</div>
			<div className="template-example-grid">
				{entries.map((example) => (
					<article
						className="template-example"
						key={example.video.id}
						data-template-example={example.video.id}
						aria-label={example.video.title[locale]}
					>
						<VideoPlayer
							video={example.video}
							locale={locale}
							meta={`${example.video.durationSeconds} s · ${example.width} × ${example.height} · ${example.fps} fps`}
						/>
						<div className="template-example-links">
							<AssetLink href={example.video.src} download>
								{t.downloadExample} ↓
							</AssetLink>
							<AssetLink href={example.still.src} download>
								{t.downloadStill} ↓
							</AssetLink>
							<AssetLink
								href={example.video.src}
								target="_blank"
								rel="noreferrer"
							>
								{t.exampleLink} ↗
							</AssetLink>
						</div>
					</article>
				))}
			</div>
			<a className="template-examples-manifest" href="/templates/examples.json">
				{t.examplesManifest} ↗
			</a>
		</section>
	);
}
