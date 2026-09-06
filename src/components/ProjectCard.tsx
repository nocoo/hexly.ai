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
		<article
			className="project-card"
			data-project={project.id}
			data-refined={Boolean(project.family)}
		>
			<div className="card-identity">
				<button
					className="card-logo"
					type="button"
					onClick={() => onLogo(project.id)}
					aria-label={`${t.viewLogo}: ${project.title}`}
				>
					<Logo project={project} size={96} eager={eager} />
					<span className="inspect-hint">
						<Icon name="expand" />
					</span>
				</button>
				{project.family && (
					<span className="refined-badge">
						<Icon name="check" />
						{t.refined}
					</span>
				)}
			</div>
			<div className="card-body">
				<div className="card-title-row">
					<h3>
						<a href={destination(project)} target="_blank" rel="noreferrer">
							{project.title}
						</a>
					</h3>
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
				<p className="project-description" title={project.description[locale]}>
					{project.description[locale]}
				</p>
				<div className="card-meta">
					<span>
						{
							categoryLabels[locale][
								project.archived ? "archive" : project.category
							]
						}
					</span>
					<Palette
						project={project}
						locale={locale}
						colors={project.family?.palette}
						compact
					/>
				</div>
			</div>
		</article>
	);
}
