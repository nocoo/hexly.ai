import { describe, expect, it } from "vitest";
import { createProjectFilm } from "../../packages/video-kit/src/project";
import {
	dimensions,
	durationFor,
	endingIds,
	openingIds,
	parseFilm,
	parseVideoManifest,
	schemaDocuments,
	templateIds,
	themeIds,
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
		expect(schemaDocuments()["film-v2.schema.json"].properties).toHaveProperty(
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
				(entry) => entry.status === "ready" && entry.components.length === 7,
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
		expect(manifest.openings.map((entry) => entry.id)).toEqual([...openingIds]);
		expect(manifest.endings.map((entry) => entry.id)).toEqual([...endingIds]);
		expect(manifest.themes).toEqual(["light", "dark"]);
		expect(manifest.preview).toBe("client");
		expect(() =>
			parseVideoManifest({
				...manifest,
				templates: manifest.templates.map((entry) => ({
					...entry,
					clip: "/old.mp4",
				})),
			}),
		).toThrow();
		for (const id of ["studio", "editorial", "pulse"])
			expect(findVideo(id)).toBeUndefined();
		expect(findVideo("showcase")?.title).toBe("Showcase");
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
					view: "templates",
					video: template,
					videoProject: "bogo",
					videoMode: mode,
				});
				expect(navigationPath(state)).toBe(path);
			}
		expect(videoHref("launch", "hexly-ai")).toBe("/templates/launch");
		expect(videoHref("launch")).toBe("/templates/launch");
		expect(navigationPath(parseNavigation("/templates", "", projects))).toBe(
			"/templates",
		);
	});
	it("preserves the library family when changing projects or reloading", () => {
		for (const family of ["openings", "endings"] as const) {
			const state = parseNavigation(
				"/templates",
				`?family=${family}`,
				projects,
			);
			const path = navigationPath({ ...state, videoProject: "bogo" });
			expect(path).toBe(`/templates?family=${family}&project=bogo`);
			const url = new URL(path, "https://hexly.ai");
			expect(parseNavigation(url.pathname, url.search, projects)).toMatchObject(
				{
					videoFamily: family,
					videoProject: "bogo",
				},
			);
		}
		expect(
			parseNavigation("/templates", "?family=unknown", projects).videoFamily,
		).toBe("templates");
	});
	it("round-trips all 250 compositions without duplicating the story", () => {
		const project = projectForVideo(
			projects.find((item) => item.id === "bogo"),
			"en",
		);
		const base = createProjectFilm(project);
		for (const template of templateIds)
			for (const opening of openingIds)
				for (const ending of endingIds)
					for (const theme of themeIds) {
						const options = { opening, ending, theme };
						const film = createProjectFilm(project, template, "en", options);
						expect(parseFilm(JSON.parse(JSON.stringify(film)))).toEqual(film);
						expect(film.scenes).toEqual(base.scenes);
						const url = new URL(
							videoHref(template, project.id, "deck", {
								...options,
								part: "outro",
							}),
							"https://hexly.ai",
						);
						const state = parseNavigation(url.pathname, url.search, projects);
						expect(state).toMatchObject({
							video: template,
							videoOpening: opening,
							videoEnding: ending,
							videoTheme: theme,
							videoPart: "outro",
						});
						expect(navigationPath(state)).toBe(url.pathname + url.search);
					}
		expect(
			parseFilm({ ...base, scenes: [{ ...base.scenes[3], template: "bento" }] })
				.scenes[0]?.template,
		).toBe("bento");
		for (const patch of [
			{ theme: "blue" },
			{ opening: "unknown" },
			{ ending: "unknown" },
			{ schemaVersion: 1 },
			{ template: "studio" },
			{ template: "editorial" },
			{ template: "pulse" },
		])
			expect(() => parseFilm({ ...base, ...patch })).toThrow();
		expect(
			parseNavigation(
				"/templates/launch",
				"?theme=blue&opening=../&ending=unknown&part=unknown",
				projects,
			),
		).toMatchObject({
			videoTheme: "light",
			videoOpening: "signal",
			videoEnding: "signature",
			videoPart: "content",
		});
	});
	it("emits crawlable component pages without advertising obsolete movies or decks", () => {
		const shell = '<title>old</title><div id="root"></div></head>';
		for (const template of videoManifest.templates) {
			const page = pageForPath(`/templates/${template.id}`, projects);
			expect(page.canonical).toBe(`https://hexly.ai/templates/${template.id}`);
			expect(page.bodyHtml).toContain("/templates/film-v2.schema.json");
			const html = applyPageToHtml(shell, page);
			expect(html).toContain(template.title);
			expect(html).not.toContain("/video-assets/");
			expect(html).toContain("/templates/outros.json");
			expect(JSON.stringify(page.jsonLd)).not.toContain("VideoObject");
		}
		expect(pageForPath("/templates/unknown", projects).path).toBe("/templates");
	});
});
