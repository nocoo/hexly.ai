import { useEffect, useState } from "react";
import { copy } from "../data/copy";
import type { Locale, LogoFamily, Project } from "../model/project";

export function LogoArchive({
	family,
	project,
	locale,
}: {
	family: LogoFamily;
	project: Project;
	locale: Locale;
}) {
	const t = copy[locale];
	const retained = family.method === "retained-original";
	const textFile = retained ? "brief.txt" : "prompt.txt";
	const [prompt, setPrompt] = useState("");
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		const controller = new AbortController();
		setPrompt("");
		setFailed(false);
		fetch(`${family.root}/${textFile}`, { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				return response.text();
			})
			.then(setPrompt)
			.catch(() => {
				if (!controller.signal.aborted) setFailed(true);
			});
		return () => controller.abort();
	}, [family.root, textFile]);
	return (
		<section
			className="review-section identity-archive"
			aria-labelledby="archive-title"
		>
			<div className="review-section-heading">
				<h3 id="archive-title">{t.archive}</h3>
				<p>
					{retained ? t.retainedArtwork : family.model} ·{" "}
					{family.foreground.width} × {family.foreground.height}
				</p>
			</div>
			<div className="download-links">
				{[
					[t.download, family.foreground.original],
					[t.squareDownload, `${family.root}/icon.png`],
					[t.roundedDownload, `${family.root}/rounded.png`],
					[t.whiteDownload, `${family.root}/white.png`],
					[
						retained ? t.retainedSource : t.rawDownload,
						`${family.root}/${retained ? "source" : "raw"}.png`,
					],
					[
						retained ? t.briefDownload : t.promptDownload,
						`${family.root}/${textFile}`,
					],
				].map(([label, href]) => (
					<a
						key={href}
						href={href}
						download={
							href?.startsWith(family.root)
								? `${project.id}-${href.split("/").pop()}`
								: true
						}
					>
						{label}
						<span aria-hidden="true">↗</span>
					</a>
				))}
			</div>
			<details>
				<summary>{retained ? t.briefTitle : t.promptTitle}</summary>
				<pre className="generation-prompt">
					{failed
						? retained
							? t.briefFailed
							: t.promptFailed
						: prompt || (retained ? t.briefLoading : t.promptLoading)}
				</pre>
			</details>
			<a
				className="process-link"
				href={family.archive}
				target="_blank"
				rel="noreferrer"
			>
				{t.archiveSource} ↗
			</a>
		</section>
	);
}
