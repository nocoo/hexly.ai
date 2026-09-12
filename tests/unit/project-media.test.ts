import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import {
	catalogueProblems,
	filterProjects,
	parseCatalogue,
} from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";
import { projectForVideo } from "../../src/model/videos";
import { screenshotFixture, videoFixture } from "../fixtures/project-media";

const projects = readProjects();
const base = projects.find((project) => project.id === "pew");
if (!base) throw new Error("Pew is required.");
const withMedia: Project = {
	...base,
	media: { videos: [videoFixture], screenshots: [screenshotFixture] },
};

describe("optional project media", () => {
	it("accepts projects with or without media and filters only finished-video entries", () => {
		expect(
			parseCatalogue([base, { ...withMedia, id: "media-fixture" }]),
		).toHaveLength(2);
		expect(catalogueProblems([{ ...base, media: {} }])).toEqual([]);
		expect(
			catalogueProblems([{ ...base, media: { videos: [], screenshots: [] } }]),
		).toEqual([]);
		const all = projects.map((project) =>
			project.id === base.id ? withMedia : { ...project, media: undefined },
		);
		expect(
			filterProjects(all, "", "all", "curated", true).map((p) => p.id),
		).toEqual(["pew"]);
		expect(filterProjects(all, "unmatched", "all", "az", true)).toEqual([]);
		expect(filterProjects(all, "", "games", "az", true)).toEqual([]);
		expect(
			filterProjects(
				[{ ...base, media: { screenshots: [screenshotFixture] } }],
				"",
				"all",
				"curated",
				true,
			),
		).toEqual([]);
	});
	it.each([
		["missing id", { id: undefined }],
		["numeric id", { id: 1 }],
		["unsafe id", { id: "../bad" }],
		["empty title", { title: { en: "", zh: "示例" } }],
		["missing translation", { title: { en: "Sample" } }],
		["zero duration", { durationSeconds: 0 }],
		["infinite duration", { durationSeconds: Number.POSITIVE_INFINITY }],
		["missing language", { language: "" }],
		["missing version", { version: "" }],
		["missing source", { source: "" }],
		["invalid checksum", { sha256: "not-a-hash" }],
		["invalid burned-in flag", { captionsBurnedIn: "yes" }],
		["missing poster", { poster: "" }],
		["invalid captions", { captions: {} }],
		["empty caption", { captions: [null] }],
		[
			"caption URL",
			{
				captions: [
					{ src: "javascript:alert(1)", language: "en", label: "English" },
				],
			},
		],
		[
			"caption language",
			{ captions: [{ src: "/captions.vtt", language: "", label: "English" }] },
		],
		[
			"caption label",
			{ captions: [{ src: "/captions.vtt", language: "en", label: "" }] },
		],
	])("rejects invalid video metadata: %s", (_label, patch) => {
		const candidate = {
			...withMedia,
			media: { videos: [{ ...videoFixture, ...patch }] },
		} as Project;
		expect(catalogueProblems([candidate])).toContain(
			"Invalid project videos: pew",
		);
	});
	it.each([
		"javascript:alert(1)",
		"http://h.no.mt/movie.mp4",
		"https://unapproved.example/movie.mp4",
		"https://media.hexly.ai/movie.mp4",
		"https://h.no.mt.evil.example/movie.mp4",
		"//h.no.mt/movie.mp4",
		"https://h.no.mt@evil.example/movie.mp4",
		"https://user:pass@h.no.mt/movie.mp4",
		"https://h.no.mt/movie.mp4#fragment",
		"/\\evil.example/movie.mp4",
		"/has space.mp4",
		"https://[invalid",
		undefined,
	])("rejects video sources outside the explicit asset boundary: %s", (src) => {
		expect(() =>
			parseCatalogue([
				{ ...withMedia, media: { videos: [{ ...videoFixture, src }] } },
			]),
		).toThrow("Invalid project videos");
	});
	it("accepts safe local files and the media origin, including query strings", () => {
		for (const src of [
			"/recordings/clip.mp4",
			"https://h.no.mt/projects/clip.mp4?v=1",
		]) {
			expect(
				catalogueProblems([
					{
						...withMedia,
						media: { videos: [{ ...videoFixture, src, captions: undefined }] },
					},
				]),
			).toEqual([]);
		}
	});
	it.each([
		null,
		[],
		{ videos: {} },
		{ videos: [null] },
		{ videos: [videoFixture, videoFixture] },
		{ screenshots: {} },
		{ screenshots: [null] },
		{ screenshots: [screenshotFixture, screenshotFixture] },
		...[
			{ id: undefined },
			{ id: "BAD" },
			{ src: "https://other.example/a.png" },
			{ alt: {} },
			{ width: 0 },
			{ height: 0 },
			{ width: 1.5 },
			{ height: "540" },
		].map((patch) => ({ screenshots: [{ ...screenshotFixture, ...patch }] })),
	])("rejects malformed or duplicate media", (media) => {
		expect(() => parseCatalogue([{ ...base, media }])).toThrow(
			/Invalid project (media|videos|screenshots)/,
		);
	});
	it("uses a project's localized screenshot across templates without requiring one", () => {
		expect(projectForVideo(withMedia, "en").screenshot).toEqual({
			src: screenshotFixture.src,
			alt: screenshotFixture.alt.en,
		});
		expect(projectForVideo(withMedia, "zh").screenshot?.alt).toBe(
			screenshotFixture.alt.zh,
		);
		expect(projectForVideo(base, "en").screenshot).toBeUndefined();
	});
});
