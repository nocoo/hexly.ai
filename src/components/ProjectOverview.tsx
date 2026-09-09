import { copy } from "../data/copy";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";

export function ProjectOverview({
	project,
	locale,
}: {
	project: Project;
	locale: Locale;
}) {
	const { overview } = project;
	if (!overview) return null;
	const t = copy[locale];
	const readme = locale === "en" ? "docs/README.en.md" : "README.md";

	return (
		<section className="project-overview" aria-labelledby="project-goal-title">
			<div className="project-goal">
				<h3 id="project-goal-title">{t.projectGoal}</h3>
				<p>{overview.goal[locale]}</p>
				{overview.verified.revision && (
					<a
						className="project-readme"
						href={`${project.repository}/blob/main/${readme}`}
						target="_blank"
						rel="noreferrer"
					>
						{t.readReadme}
						<Icon name="arrow" />
					</a>
				)}
			</div>
			<div className="project-stack">
				<h3 id="project-stack-title">{t.techStack}</h3>
				<ul className="tech-badges" aria-labelledby="project-stack-title">
					{overview.techStack.map((technology) => (
						<li className="tech-badge" key={technology.name}>
							<span className="tech-name">{technology.name}</span>
							<span className="tech-role">{technology.role[locale]}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
