import { createProjectFilm, HexlyFontOrigin } from "@hexly/video-kit";
import { FilmStill } from "@hexly/video-kit/player";
import type {
	CompositionOptions,
	VideoEntry,
	VideoProject,
} from "@hexly/video-kit/schema";
import { useMemo } from "react";
import storage from "../data/media-storage.json";
import type { Locale } from "../model/project";

export default function VideoCardPreview({
	entry,
	project,
	locale,
	options,
}: {
	entry: VideoEntry;
	project: VideoProject;
	locale: Locale;
	options: CompositionOptions;
}) {
	const film = useMemo(
		() =>
			createProjectFilm(
				project,
				entry.kind === "template" ? entry.id : "launch",
				locale,
				{
					...options,
					...(entry.kind === "opening"
						? { opening: entry.id }
						: entry.kind === "ending"
							? { ending: entry.id }
							: {}),
				},
			),
		[project, entry, locale, options],
	);
	return (
		<HexlyFontOrigin.Provider value={storage.origin}>
			<FilmStill
				config={film}
				scene={
					entry.kind === "opening"
						? "intro"
						: entry.kind === "ending"
							? "outro"
							: "content"
				}
			/>
		</HexlyFontOrigin.Provider>
	);
}
