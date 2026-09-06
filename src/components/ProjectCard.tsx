import { categoryLabels, copy } from "../data/copy";
import { destination, destinationHost } from "../model/catalogue";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Palette } from "./Palette";

export function ProjectCard({
	project,
	locale,
	onLogo,
	eager,
}: {
	project: Project;
	locale: Locale;
	onLogo: (id: string) => void;
	eager: boolean;
}) {
	const t = copy[locale];
	return (
		<article className="project-card" data-project={project.id}>
			<div className="card-top">
				<button
					className="card-logo"
					type="button"
					onClick={() => onLogo(project.id)}
					aria-label={`${t.viewLogo}: ${project.title}`}
				>
					<Logo project={project} eager={eager} />
					<span className="inspect-hint">
						<Icon name="expand" />
					</span>
				</button>
				<a
					className="card-visit"
					href={destination(project)}
					target="_blank"
					rel="noreferrer"
					aria-label={`${t.visit}: ${project.title}`}
					title={destinationHost(project)}
				>
					<Icon name="arrow" />
				</a>
			</div>
			<h3>
				<a href={destination(project)} target="_blank" rel="noreferrer">
					{project.title}
				</a>
				<span className="project-emoji" aria-hidden="true">
					{project.emoji}
				</span>
			</h3>
			<p className="project-description">{project.description[locale]}</p>
			<div className="card-meta">
				<span>{categoryLabels[locale][project.category]}</span>
				<Palette project={project} locale={locale} compact />
			</div>
		</article>
	);
}
