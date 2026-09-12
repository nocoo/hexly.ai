import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import example from "../examples/hexly.json";
import { kitVersion, layouts } from "../src/brand";
import { BrandLockup } from "../src/Identity";
import { VideoPreview } from "../src/Preview";
import { createProjectFilm } from "../src/project";
import {
	type CompositionOptions,
	endingIds,
	openingIds,
	type SceneKind,
	type TemplateId,
	templateIds,
} from "../src/schema";
import "./web.css";

function Demo() {
	const [template, setTemplate] = useState<TemplateId>("launch");
	const [view, setView] = useState<"video" | "deck">("video");
	const [options, setOptions] = useState<CompositionOptions>({
		theme: "light",
		opening: "signal",
		ending: "signature",
	});
	const [focus, setFocus] = useState<SceneKind>("content");
	const film = createProjectFilm(example, template, "en", options);
	return (
		<div className="demo-shell">
			<header>
				<a href="https://hexly.ai/videos" aria-label="hexly.ai">
					<BrandLockup />
				</a>
				<span>VIDEO KIT / {kitVersion}</span>
			</header>
			<main>
				<p className="demo-kicker">ONE FAMILY. YOUR COMPOSITION.</p>
				<h1>Ideas in motion.</h1>
				<p className="demo-intro">
					The same story, from a first frame to a final slide.
				</p>
				<nav className="demo-templates" aria-label="Templates">
					{templateIds.map((id) => (
						<button
							type="button"
							key={id}
							aria-pressed={template === id}
							onClick={() => {
								setTemplate(id);
								setFocus("content");
							}}
						>
							{layouts[id].label}
						</button>
					))}
				</nav>
				<div className="demo-composer">
					<label>
						Opening
						<select
							aria-label="Opening"
							value={options.opening}
							onChange={(event) => {
								setOptions({
									...options,
									opening: event.target.value as CompositionOptions["opening"],
								});
								setFocus("intro");
							}}
						>
							{openingIds.map((id) => (
								<option key={id}>{id}</option>
							))}
						</select>
					</label>
					<label>
						Ending
						<select
							aria-label="Ending"
							value={options.ending}
							onChange={(event) => {
								setOptions({
									...options,
									ending: event.target.value as CompositionOptions["ending"],
								});
								setFocus("outro");
							}}
						>
							{endingIds.map((id) => (
								<option key={id}>{id}</option>
							))}
						</select>
					</label>
					<label>
						Theme
						<select
							aria-label="Theme"
							value={options.theme}
							onChange={(event) =>
								setOptions({
									...options,
									theme: event.target.value as CompositionOptions["theme"],
								})
							}
						>
							<option>light</option>
							<option>dark</option>
						</select>
					</label>
				</div>
				<VideoPreview
					config={film}
					focusScene={focus}
					view={view}
					onView={setView}
				/>
			</main>
			<footer>
				Hexly Video Kit · Local preview ·{" "}
				<a href="https://github.com/nocoo/hexly.ai/tree/main/packages/video-kit">
					Source & documentation ↗
				</a>
			</footer>
		</div>
	);
}
const root = document.getElementById("root");
if (!root) throw new Error("Missing root");
createRoot(root).render(
	<StrictMode>
		<Demo />
	</StrictMode>,
);
