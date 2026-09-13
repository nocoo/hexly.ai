import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { createProjectFilm } from "@hexly/video-kit";
import {
	compositionSchema,
	parseFilm,
	templateIds,
	type VideoProject,
} from "@hexly/video-kit/schema";
import { readProjects } from "../src/data/read-projects";
import { projectForVideo } from "../src/model/videos";
import { hydrate, publicUrl, readInventory } from "./asset-storage";

const { values } = parseArgs({
	args: process.argv.slice(2).filter((arg) => arg !== "--"),
	options: {
		project: { type: "string", default: "hexly-ai" },
		template: { type: "string", default: "launch" },
		theme: { type: "string", default: "light" },
		opening: { type: "string", default: "signal" },
		ending: { type: "string", default: "signature" },
		locale: { type: "string", default: "en" },
		props: { type: "string" },
		screenshot: { type: "string" },
		out: { type: "string" },
		mode: { type: "string", default: "all" },
		scale: { type: "string", default: "0.5" },
	},
});
const output = values.out ? resolve(values.out) : undefined;
if (output === resolve("public") || output?.startsWith(`${resolve("public")}/`))
	throw new Error("Keep render outputs outside the site's public/ directory.");
const template = templateIds.find((id) => id === values.template);
if (!template) throw new Error("Unknown template.");
const selected = readProjects().find(
	(project) => project.id === values.project,
);
if (!values.props && !selected && values.project !== "hexly-ai")
	throw new Error("Unknown project.");
if (!["en", "zh"].includes(values.locale))
	throw new Error("Use --locale en|zh.");
const locale = values.locale as "en" | "zh";
let project: VideoProject = projectForVideo(selected, locale);
if (values.screenshot) {
	const path = resolve(values.screenshot);
	const ext = path.split(".").pop()?.toLowerCase();
	const mime =
		ext === "png"
			? "image/png"
			: ext === "webp"
				? "image/webp"
				: ["jpg", "jpeg"].includes(ext ?? "")
					? "image/jpeg"
					: null;
	if (!mime) throw new Error("Screenshot must be PNG, JPEG or WebP.");
	const bytes = readFileSync(path);
	if (bytes.length > 8 * 1024 * 1024)
		throw new Error("Screenshot exceeds 8 MB.");
	project = {
		...project,
		screenshot: {
			src: `data:${mime};base64,${bytes.toString("base64")}`,
			alt: `${project.name} screenshot`,
		},
	};
}
const film = values.props
	? parseFilm(JSON.parse(readFileSync(resolve(values.props), "utf8")))
	: createProjectFilm(
			project,
			template,
			locale,
			compositionSchema.parse({
				theme: values.theme,
				opening: values.opening,
				ending: values.ending,
			}),
		);
const directory = resolve(
	".video-work",
	new Date().toISOString().replace(/[:.]/g, "-"),
);
const publicDir = join(directory, "public");
mkdirSync(publicDir, { recursive: true });
const assets = readInventory().files;
const references = [film.project.logo, film.project.screenshot?.src];
const needed = assets.filter(
	(file) =>
		file.path?.startsWith("/video-kit/") ||
		references.some(
			(url) => url && (url === file.path || url === publicUrl(file)),
		),
);
await hydrate(needed, 4);
cpSync("packages/video-kit/public/video-kit", join(publicDir, "video-kit"), {
	recursive: true,
});
for (const [field, url] of [
	["logo", film.project.logo],
	["screenshot", film.project.screenshot?.src],
] as const) {
	const asset = needed.find((file) => url === publicUrl(file));
	const path = asset?.path ?? url;
	if (!path?.startsWith("/")) continue;
	const source = resolve("public", path.slice(1));
	if (!source.startsWith(`${resolve("public")}/`) || !existsSync(source))
		throw new Error(`Missing local image: ${path}`);
	const target = join(publicDir, path.slice(1));
	mkdirSync(dirname(target), { recursive: true });
	cpSync(source, target);
	if (field === "logo") film.project.logo = path;
	else if (film.project.screenshot) film.project.screenshot.src = path;
}
const input = join(directory, "project.json");
writeFileSync(input, `${JSON.stringify(film, null, 2)}\n`);
const command = [
	"bun",
	"packages/video-kit/scripts/render.ts",
	"--props",
	input,
	"--public-dir",
	publicDir,
	"--mode",
	values.mode,
	"--scale",
	values.scale,
];
if (output) command.push("--out", output);
process.exit(
	await Bun.spawn(command, { stdout: "inherit", stderr: "inherit" }).exited,
);
