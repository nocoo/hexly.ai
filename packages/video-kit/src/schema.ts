import { z } from "zod";

export const templateIds = [
	"launch",
	"essential",
	"showcase",
	"columns",
	"bento",
] as const;
export const openingIds = [
	"signal",
	"frame",
	"index",
	"horizon",
	"stack",
] as const;
export const endingIds = [
	"signature",
	"line",
	"frame",
	"split",
	"colophon",
] as const;
export const themeIds = ["light", "dark"] as const;
export const compositionSchema = z.strictObject({
	theme: z.enum(themeIds),
	opening: z.enum(openingIds),
	ending: z.enum(endingIds),
});
export type CompositionOptions = z.infer<typeof compositionSchema>;
export type VideoTheme = CompositionOptions["theme"];
export type OpeningId = CompositionOptions["opening"];
export type EndingId = CompositionOptions["ending"];
export const sceneKinds = [
	"intro",
	"title",
	"chapter",
	"content",
	"cta",
	"logo",
	"outro",
] as const;
const text = (max: number) => z.string().max(max);
const slug = z
	.string()
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
	.max(64);
const httpsUrl = z.url({ protocol: /^https$/ });
const imageSource = z
	.string()
	.max(12 * 1024 * 1024)
	.refine(
		(value) =>
			(/^\/[^/]/.test(value) && !value.includes("..")) ||
			/^https:\/\//.test(value) ||
			/^data:image\/(png|jpeg|webp);base64,/.test(value),
		"Use a public path, HTTPS image or a PNG/JPEG/WebP data URL.",
	);

export const projectSchema = z.strictObject({
	id: slug,
	name: text(80).min(1),
	summary: text(500).min(1),
	repository: httpsUrl,
	website: httpsUrl.nullable(),
	logo: imageSource.optional(),
	colors: z.array(z.string().regex(/^#[a-fA-F0-9]{6}$/)).max(6),
	technologies: z.array(text(60)).max(6),
	facts: z.array(z.strictObject({ label: text(36), value: text(48) })).max(4),
	sourceNote: text(160),
	screenshot: z
		.strictObject({ src: imageSource, alt: text(160).min(1) })
		.optional(),
});
export type VideoProject = z.infer<typeof projectSchema>;

export const sceneSchema = z.strictObject({
	id: slug,
	kind: z.enum(sceneKinds),
	duration: z
		.number()
		.int()
		.min(4)
		.max(30)
		.describe("Seconds, including the entrance and reading hold."),
	title: text(120)
		.min(1)
		.describe(
			"Newlines are intentional line breaks. Long copy automatically uses a smaller type size.",
		),
	eyebrow: text(48),
	body: text(500),
	link: z.strictObject({ label: text(36).min(1), href: httpsUrl }).optional(),
	template: z
		.enum(templateIds)
		.optional()
		.describe(
			"Override the content layout for this scene; opening and ending remain independent.",
		),
});

export const filmSchema = z.strictObject({
	schemaVersion: z.literal(2),
	...compositionSchema.shape,
	template: z.enum(templateIds),
	format: z.enum(["landscape", "portrait"]),
	fps: z.literal(30),
	motion: z.enum(["full", "reduced"]),
	project: projectSchema,
	scenes: z.array(sceneSchema).min(1).max(24),
});
export type FilmConfig = z.infer<typeof filmSchema>;
export type SceneConfig = z.infer<typeof sceneSchema>;
export type TemplateId = FilmConfig["template"];
export type SceneKind = SceneConfig["kind"];
export type Motion = FilmConfig["motion"];

export function parseFilm(value: unknown): FilmConfig {
	const film = filmSchema.parse(value);
	const ids = film.scenes.map((scene) => scene.id);
	if (new Set(ids).size !== ids.length)
		throw new Error("Scene IDs must be unique.");
	if (film.scenes.some((scene) => scene.kind === "cta" && !scene.link))
		throw new Error(
			"CTA scenes need a link with a label and HTTPS destination.",
		);
	return film;
}

export function dimensions(format: FilmConfig["format"]) {
	return format === "portrait"
		? { width: 1080, height: 1920 }
		: { width: 1920, height: 1080 };
}

export function timelineFor(film: FilmConfig) {
	let from = 0;
	return film.scenes.map((scene) => {
		const durationInFrames = scene.duration * film.fps;
		const entry = { ...scene, from, durationInFrames };
		from += durationInFrames;
		return entry;
	});
}

export function durationFor(film: FilmConfig) {
	return film.scenes.reduce((sum, scene) => sum + scene.duration * film.fps, 0);
}

// Public metadata only. Film scripts, audio and source bundles are never manifest fields.
const bilingual = z.strictObject({
	en: text(240).min(1),
	zh: text(240).min(1),
});
const metadata = {
	title: text(80).min(1),
	description: bilingual,
	use: bilingual,
};

export const videoManifestSchema = z.strictObject({
	schemaVersion: z.literal(2),
	kitVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
	preview: z.literal("client"),
	themes: z.tuple([z.literal("light"), z.literal("dark")]),
	templates: z
		.array(
			z.strictObject({
				...metadata,
				id: z.enum(templateIds),
				kind: z.literal("template"),
				status: z.enum(["ready", "preview"]),
				formats: z.array(z.enum(["landscape", "portrait"])).min(1),
				components: z.array(z.enum(sceneKinds)).min(1),
			}),
		)
		.length(5),
	openings: z
		.array(
			z.strictObject({
				...metadata,
				id: z.enum(openingIds),
				kind: z.literal("opening"),
			}),
		)
		.length(5),
	endings: z
		.array(
			z.strictObject({
				...metadata,
				id: z.enum(endingIds),
				kind: z.literal("ending"),
			}),
		)
		.length(5),
});
export type VideoManifest = z.infer<typeof videoManifestSchema>;
export type VideoEntry =
	| VideoManifest["templates"][number]
	| VideoManifest["openings"][number]
	| VideoManifest["endings"][number];

export function parseVideoManifest(value: unknown): VideoManifest {
	const manifest = videoManifestSchema.parse(value);
	for (const entries of [
		manifest.templates,
		manifest.openings,
		manifest.endings,
	])
		if (new Set(entries.map((entry) => entry.id)).size !== entries.length)
			throw new Error("Video IDs must be unique within each component family.");
	return manifest;
}

/** Build-time JSON schemas; runtime parsers also check unique IDs and CTA links. */
export function schemaDocuments() {
	return {
		"film-v2.schema.json": z.toJSONSchema(filmSchema),
		"manifest-v2.schema.json": z.toJSONSchema(videoManifestSchema),
	};
}
