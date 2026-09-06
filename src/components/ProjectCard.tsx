import { categoryLabels, copy } from "../data/copy";
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
			<a
				className="card-main"
				href={`/logos/${project.id}`}
				aria-label={`${t.viewLogo}: ${project.title}`}
				onClick={(event) => {
					if (
						event.button !== 0 ||
						event.metaKey ||
						event.ctrlKey ||
						event.shiftKey ||
						event.altKey
					)
						return;
					event.preventDefault();
					onLogo(project.id);
				}}
			>
				<div className="card-logo">
					<Logo project={project} size={96} eager={eager} />
					<span className="inspect-hint">
						<Icon name="expand" />
					</span>
				</div>
				<div className="card-body">
					<h3 title={project.title}>{project.title}</h3>
					<p
						className="project-description"
						title={project.description[locale]}
					>
						{project.description[locale]}
					</p>
				</div>
				<div className="card-meta">
					{project.family && (
						<span className="refined-badge">
							<Icon name="check" />
							{t.refined}
						</span>
					)}
					<span className="card-category">
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
			</a>
			<a
				className="card-github"
				href={project.repository}
				target="_blank"
				rel="noreferrer"
				aria-label={`${t.source}: ${project.title}`}
				title={`${t.source}: ${project.title}`}
			>
				<Icon name="github" />
				GitHub
			</a>
		</article>
	);
}
