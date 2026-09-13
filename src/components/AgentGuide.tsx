import { agentCopy } from "../data/agent-copy";
import { agentGuide } from "../model/agent-guide";
import type { Locale, Project } from "../model/project";
import { CopyButton } from "./CopyButton";

export function AgentGuide({
	path,
	projects,
	locale,
}: {
	path: string;
	projects: Project[];
	locale: Locale;
}) {
	const guide = agentGuide(path, projects, locale);
	const t = agentCopy[locale];
	return (
		<section
			className="agent-region shell"
			id="agent-guide"
			aria-labelledby="agent-guide-title"
		>
			<div className="agent-guide-heading">
				<div>
					<h2 id="agent-guide-title">{t.region}</h2>
					<p>{t.hint}</p>
				</div>
				<CopyButton text={guide.body} locale={locale} label={t.copy} />
			</div>
			<details>
				<summary>{t.read}</summary>
				<pre className="agent-instructions" lang="en">
					{guide.body}
				</pre>
			</details>
			<div className="agent-resource-links">
				<a href={guide.path} type="text/markdown" rel="alternate">
					{t.markdown} ↗
				</a>
				<a href="/llms.txt">{t.index} ↗</a>
			</div>
		</section>
	);
}
