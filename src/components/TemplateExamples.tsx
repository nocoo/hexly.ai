import { agentCopy } from "../data/agent-copy";
import { videoCopy } from "../data/video-copy";
import { outroInstructions, standardOutros } from "../model/agent-guide";
import type { Locale } from "../model/project";
import { AssetLink } from "./AssetLink";
import { CopyButton } from "./CopyButton";
import { VideoPlayer } from "./ProjectMedia";

export function TemplateExamples({ locale }: { locale: Locale }) {
	const t = videoCopy[locale];
	const entries = standardOutros.outros;
	return (
		<section
			className="template-examples"
			id="outros"
			aria-labelledby="template-examples-title"
			onPlayCapture={(event) => {
				for (const player of event.currentTarget.querySelectorAll("video")) {
					if (player !== event.target) player.pause();
				}
			}}
		>
			<span id="examples" className="anchor-alias" aria-hidden="true" />
			<div className="detail-section-heading">
				<div>
					<p className="eyebrow">{t.examplesEyebrow}</p>
					<h2 id="template-examples-title">{t.examples}</h2>
					<p>{t.examplesDescription}</p>
				</div>
				<span className="mono">
					{String(entries.length).padStart(2, "0")} MP4
				</span>
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
							<CopyButton
								text={outroInstructions(example)}
								locale={locale}
								label={agentCopy[locale].copyOutro}
							/>
						</div>
						<details className="outro-guide">
							<summary>{t.outroUse}</summary>
							<pre className="agent-instructions" lang="en">
								{outroInstructions(example)}
							</pre>
						</details>
					</article>
				))}
			</div>
			<a className="template-examples-manifest" href="/templates/outros.json">
				{t.examplesManifest} ↗
			</a>
		</section>
	);
}
