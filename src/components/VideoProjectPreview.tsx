import { createProjectFilm, HexlyFontOrigin } from "@hexly/video-kit";
import { VideoPreview } from "@hexly/video-kit/player";
import type {
	CompositionOptions,
	SceneKind,
	VideoManifest,
	VideoProject,
} from "@hexly/video-kit/schema";
import { useMemo, useState } from "react";
import storage from "../data/media-storage.json";
import { videoCopy } from "../data/video-copy";
import type { Locale } from "../model/project";

export default function VideoProjectPreview({
	entry,
	project,
	locale,
	view,
	onView,
	options,
	focusScene,
}: {
	entry: VideoManifest["templates"][number];
	project: VideoProject;
	locale: Locale;
	view: "video" | "deck";
	onView: (view: "video" | "deck") => void;
	options: CompositionOptions;
	focusScene: SceneKind;
}) {
	const t = videoCopy[locale];
	const film = useMemo(
		() => createProjectFilm(project, entry.id, locale, options),
		[project, entry.id, locale, options],
	);
	const [renderConfig, setRenderConfig] = useState(film);
	const filename = `${project.id}-${entry.id}-${options.opening}-${options.ending}-${options.theme}.json`;
	const download = () => {
		const url = URL.createObjectURL(
			new Blob([JSON.stringify(renderConfig, null, 2)], {
				type: "application/json",
			}),
		);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		anchor.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	};
	return (
		<>
			<HexlyFontOrigin.Provider value={storage.origin}>
				<VideoPreview
					config={film}
					locale={locale}
					view={view}
					onView={onView}
					onConfigChange={setRenderConfig}
					focusScene={focusScene}
				/>
			</HexlyFontOrigin.Provider>
			<div className="video-export">
				<div>
					<h2>{t.render}</h2>
					<p>{t.renderHint}</p>
					<div className="video-export-command">
						<span>{t.exportDeck}</span>
						<code>bun run video:render -- --props {filename} --mode deck</code>
					</div>
					<div className="video-export-command">
						<span>{t.exportVideo}</span>
						<code>bun run video:render -- --props {filename} --mode video</code>
					</div>
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
