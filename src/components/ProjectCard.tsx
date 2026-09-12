import { categoryLabels, copy } from "../data/copy";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Palette } from "./Palette";

export function ProjectCard({
	project,
	locale,
	onProject,
	eager,
	artworkOnly = false,
}: {
	project: Project;
	locale: Locale;
	onProject: (id: string, anchor?: string) => void;
	eager: boolean;
	artworkOnly?: boolean;
}) {
	const t = copy[locale];
	return (
		<article className="project-card" data-project={project.id}>
			<a
				className="card-main"
				href={`/projects/${project.id}${artworkOnly ? "#brand" : ""}`}
				aria-label={`${artworkOnly ? t.viewLogo : t.viewProject}: ${project.title}`}
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
					onProject(project.id, artworkOnly ? "brand" : undefined);
				}}
			>
				<div className="card-logo">
					<Logo project={project} size={artworkOnly ? 256 : 96} eager={eager} />
					<span className="inspect-hint">
						<Icon name="expand" />
					</span>
				</div>
				<div className="card-body">
					<h3 title={project.title}>{project.title}</h3>
					{!artworkOnly && (
						<p
							className="project-description"
							title={project.description[locale]}
						>
							{project.description[locale]}
						</p>
					)}
				</div>
				<div className="card-meta">
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
			{project.media?.videos?.[0] && (
				<a
					className="card-video"
					href={`/projects/${project.id}#video-${project.media.videos[0].id}`}
					aria-label={`${t.playVideo}: ${project.title}`}
					onClick={(event) => {
						if (
							event.button ||
							event.metaKey ||
							event.ctrlKey ||
							event.shiftKey ||
							event.altKey
						)
							return;
						event.preventDefault();
						onProject(project.id, `video-${project.media?.videos?.[0]?.id}`);
					}}
				>
					<Icon name="play" />
					<span>{t.withVideo}</span>
				</a>
			)}
			{!artworkOnly && (
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
			)}
		</article>
	);
}
