import { describe, expect, it } from "vitest";
import { createProjectFilm } from "../../packages/video-kit/src/project";
import {
	dimensions,
	durationFor,
	parseFilm,
	parseVideoManifest,
	schemaDocuments,
	templateIds,
	timelineFor,
} from "../../packages/video-kit/src/schema";
import { readProjects } from "../../src/data/read-projects";
import { applyPageToHtml, pageForPath } from "../../src/model/discovery";
import { navigationPath, parseNavigation } from "../../src/model/navigation";
import {
	findVideo,
	projectForVideo,
	videoHref,
	videoManifest,
} from "../../src/model/videos";

const projects = readProjects();

describe("one project source for five video and deck templates", () => {
	it("accepts every real project in both languages with the same complete timeline", () => {
		for (const project of [undefined, ...projects])
			for (const locale of ["en", "zh"] as const) {
				const data = projectForVideo(project, locale);
				for (const template of templateIds) {
					const film = createProjectFilm(data, template, locale);
					expect(film.project.name).toBe(project?.title ?? "hexly.ai");
					expect(film.scenes.map((scene) => scene.kind)).toEqual([
						"intro",
						"title",
						"chapter",
						"content",
						"cta",
						"logo",
						"outro",
					]);
					expect(film.scenes[4]?.link?.href).toBe(
						data.website ?? data.repository,
					);
					const timeline = timelineFor(film);
					expect(timeline.map((scene) => scene.from)).toEqual([
						0, 150, 270, 390, 570, 720, 840,
					]);
					expect(durationFor(film)).toBe(990);
					expect(parseFilm({ ...film, motion: "reduced" }).project).toEqual(
						film.project,
					);
				}
			}
		expect(dimensions("landscape")).toEqual({ width: 1920, height: 1080 });
		expect(dimensions("portrait")).toEqual({ width: 1080, height: 1920 });
		expect(createProjectFilm(projectForVideo(undefined, "en")).template).toBe(
			"launch",
		);
	});
	it("rejects invalid composition inputs before preview or rendering", () => {
		const film = createProjectFilm(projectForVideo(undefined, "en"));
		expect(() =>
			parseFilm({ ...film, scenes: [film.scenes[0], film.scenes[0]] }),
		).toThrow("unique");
		expect(() =>
			parseFilm({ ...film, scenes: [{ ...film.scenes[4], link: undefined }] }),
		).toThrow("CTA");
		for (const template of ["unrelated-brand", "", null])
			expect(() => parseFilm({ ...film, template })).toThrow();
		for (const logo of [
			"javascript:alert(1)",
			"//example.test/logo.png",
			"/../private.png",
			"data:image/svg+xml;base64,AAA",
		])
			expect(() =>
				parseFilm({ ...film, project: { ...film.project, logo } }),
			).toThrow();
		expect(schemaDocuments()["film-v1.schema.json"].properties).toHaveProperty(
			"scenes",
		);
	});
	it("keeps public metadata strict, complete and separate from private production sources", () => {
		const manifest = parseVideoManifest(videoManifest);
		expect(manifest.templates.map((entry) => entry.id)).toEqual([
			...templateIds,
		]);
		expect(
			manifest.templates.every(
				(entry) => entry.status === "ready" && entry.deck.pages === 7,
			),
		).toBe(true);
		expect(() =>
			parseVideoManifest({ ...manifest, narration: "private script" }),
		).toThrow();
		expect(() =>
			parseVideoManifest({
				...manifest,
				templates: Array(5).fill(manifest.templates[0]),
			}),
		).toThrow("unique");
		expect(() =>
			parseVideoManifest({
				...manifest,
				templates: manifest.templates.map((entry) => ({
					...entry,
					poster: { ...entry.poster, src: "/video-assets/../secret.webp" },
				})),
			}),
		).toThrow();
		expect(findVideo("studio")?.title).toBe("Studio");
		expect(findVideo("unknown")).toBeUndefined();
		expect(findVideo()).toBeUndefined();
	});
	it("shares project, template and view selection without duplicate project configurations", () => {
		for (const template of templateIds)
			for (const mode of ["video", "deck"] as const) {
				const path = videoHref(template, "bogo", mode);
				const url = new URL(path, "https://hexly.ai");
				const state = parseNavigation(url.pathname, url.search, projects);
				expect(state).toMatchObject({
					view: "videos",
					video: template,
					videoProject: "bogo",
					videoMode: mode,
				});
				expect(navigationPath(state)).toBe(path);
			}
		expect(videoHref("launch", "hexly-ai")).toBe("/videos/launch");
		expect(videoHref("launch")).toBe("/videos/launch");
		expect(navigationPath(parseNavigation("/videos", "", projects))).toBe(
			"/videos",
		);
	});
	it("emits template-specific crawlable pages and correct poster metadata", () => {
		const shell =
			'<title>old</title><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><div id="root"></div></head>';
		for (const template of videoManifest.templates) {
			const page = pageForPath(`/videos/${template.id}`, projects);
			expect(page.canonical).toBe(`https://hexly.ai/videos/${template.id}`);
			expect(page.bodyHtml).toContain(template.deck.pptx.src);
			const html = applyPageToHtml(shell, page);
			expect(html).toContain("image/webp");
			expect(html).toContain(`content="${template.poster.width}"`);
		}
		expect(pageForPath("/videos/unknown", projects).path).toBe("/videos");
	});
});
