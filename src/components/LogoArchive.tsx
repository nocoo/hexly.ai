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
	const [prompt, setPrompt] = useState("");
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		const controller = new AbortController();
		fetch(`${family.root}/prompt.txt`, { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				return response.text();
			})
			.then(setPrompt)
			.catch(() => {
				if (!controller.signal.aborted) setFailed(true);
			});
		return () => controller.abort();
	}, [family.root]);
	return (
		<section
			className="review-section identity-archive"
			aria-labelledby="archive-title"
		>
			<div className="review-section-heading">
				<h3 id="archive-title">{t.archive}</h3>
				<p>
					{family.model} · {family.foreground.width} ×{" "}
					{family.foreground.height}
				</p>
			</div>
			<div className="download-links">
				{[
					[t.download, family.foreground.original],
					[t.squareDownload, `${family.root}/icon.png`],
					[t.roundedDownload, `${family.root}/rounded.png`],
					[t.whiteDownload, `${family.root}/white.png`],
					[t.rawDownload, `${family.root}/raw.png`],
					[t.promptDownload, `${family.root}/prompt.txt`],
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
				<summary>{t.promptTitle}</summary>
				<pre className="generation-prompt">
					{failed ? t.promptFailed : prompt || t.promptLoading}
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
