import { createProjectFilm } from "@hexly/video-kit";
import { VideoPreview } from "@hexly/video-kit/player";
import type { VideoManifest, VideoProject } from "@hexly/video-kit/schema";
import { useMemo, useState } from "react";
import { videoCopy } from "../data/video-copy";
import type { Locale } from "../model/project";

export default function VideoProjectPreview({
	entry,
	project,
	locale,
	view,
	onView,
}: {
	entry: VideoManifest["templates"][number];
	project: VideoProject;
	locale: Locale;
	view: "video" | "deck";
	onView: (view: "video" | "deck") => void;
}) {
	const t = videoCopy[locale];
	const film = useMemo(
		() => createProjectFilm(project, entry.id, locale),
		[project, entry.id, locale],
	);
	const [renderConfig, setRenderConfig] = useState(film);
	const download = () => {
		const url = URL.createObjectURL(
			new Blob([JSON.stringify(renderConfig, null, 2)], {
				type: "application/json",
			}),
		);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `${project.id}-${entry.id}.json`;
		anchor.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	};
	return (
		<>
			<VideoPreview
				config={film}
				locale={locale}
				view={view}
				onView={onView}
				onConfigChange={setRenderConfig}
			/>
			<div className="video-export">
				<div>
					<h2>{t.render}</h2>
					<p>{t.renderHint}</p>
					<code>
						bun run video:render -- --props {project.id}-{entry.id}.json --mode
						all
					</code>
				</div>
				<button
					type="button"
					className="button button-primary"
					onClick={download}
				>
					{t.config} ↓
				</button>
			</div>
		</>
	);
}
