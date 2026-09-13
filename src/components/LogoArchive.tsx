import { useEffect, useState } from "react";
import { copy } from "../data/copy";
import { assetUrl } from "../model/assets";
import type { Locale, LogoFamily, Project } from "../model/project";
import { AssetLink } from "./AssetLink";

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
	const adapted = family.method === "reference-adaptation";
	const supplied = retained || adapted;
	const textFile = supplied ? "brief.txt" : "prompt.txt";
	const [prompt, setPrompt] = useState("");
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		const controller = new AbortController();
		setPrompt("");
		setFailed(false);
		fetch(assetUrl(`${family.root}/${textFile}`), { signal: controller.signal })
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
					{adapted
						? t.adaptedArtwork
						: retained
							? t.retainedArtwork
							: family.model}{" "}
					· {family.foreground.width} × {family.foreground.height}
				</p>
			</div>
			<div className="download-links">
				{[
					[t.download, family.foreground.original],
					[t.squareDownload, `${family.root}/icon.png`],
					[t.roundedDownload, `${family.root}/rounded.png`],
					[t.whiteDownload, `${family.root}/white.png`],
					[
						adapted
							? t.adaptedSource
							: retained
								? t.retainedSource
								: t.rawDownload,
						`${family.root}/${adapted ? "source.jpg" : retained ? "source.png" : "raw.png"}`,
					],
					[
						supplied ? t.briefDownload : t.promptDownload,
						`${family.root}/${textFile}`,
					],
				].map(([label, href]) => (
					<AssetLink
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
					</AssetLink>
				))}
			</div>
			<details>
				<summary>{supplied ? t.briefTitle : t.promptTitle}</summary>
				<pre className="generation-prompt">
					{failed
						? supplied
							? t.briefFailed
							: t.promptFailed
						: prompt || (supplied ? t.briefLoading : t.promptLoading)}
				</pre>
			</details>
			<AssetLink
				className="process-link"
				href={family.archive}
				target="_blank"
				rel="noreferrer"
			>
				{t.archiveSource} ↗
			</AssetLink>
		</section>
	);
}
