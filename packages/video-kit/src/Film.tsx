import { AbsoluteFill, Sequence } from "remotion";
import { palettes } from "./brand";
import { sceneComponents } from "./Scenes";
import { type FilmConfig, timelineFor } from "./schema";

/** Pass parseFilm() output. Consumers can also compose the exported scenes with Sequence. */
export function Film(config: FilmConfig) {
	return (
		<AbsoluteFill style={{ background: palettes[config.theme].page }}>
			{timelineFor(config).map((scene, index) => {
				const Component = sceneComponents[scene.kind];
				return (
					<Sequence
						key={scene.id}
						name={scene.title}
						from={scene.from}
						durationInFrames={scene.durationInFrames}
					>
						<Component
							{...scene}
							index={index}
							project={config.project}
							template={scene.template ?? config.template}
							theme={config.theme}
							opening={config.opening}
							ending={config.ending}
							motion={config.motion}
						/>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
}
