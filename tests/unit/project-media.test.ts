import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { digest, publicUrl, readInventory } from "../../scripts/asset-storage";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import { catalogueProblems, parseCatalogue } from "../../src/model/catalogue";
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
	it("accepts projects with or without media", () => {
		expect(
			parseCatalogue([
				base,
				{ ...withMedia, id: "media-fixture", brandKit: undefined },
			]),
		).toHaveLength(2);
		expect(catalogueProblems([{ ...base, media: {} }])).toEqual([]);
		expect(
			catalogueProblems([{ ...base, media: { videos: [], screenshots: [] } }]),
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
			{ preview: "https://other.example/preview.webp" },
			{ preview: "" },
			{ thumbnail: "javascript:alert(1)" },
			{ thumbnail: "//h.no.mt/thumb.webp" },
			{ source: "docs/assets/../secret.json" },
			{ source: "" },
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
	it("accepts uncropped portrait previews and uses the smaller asset in templates", () => {
		const shot = {
			...screenshotFixture,
			width: 900,
			height: 1800,
			preview: "/test-media/portrait.webp",
			thumbnail: "/test-media/portrait-thumb.webp",
			source: "docs/assets/pew/screenshots/portrait/v1.0.0.json",
		};
		const project = { ...base, media: { screenshots: [shot] } } as Project;
		expect(catalogueProblems([project])).toEqual([]);
		expect(projectForVideo(project, "en").screenshot?.src).toBe(shot.preview);
	});
	it.each(["hooky", "r2shot"])(
		"keeps %s store originals and derivatives recoverable with source and hash receipts",
		async (id) => {
			const project = projects.find((p) => p.id === id);
			const screenshots = project?.media?.screenshots ?? [];
			expect(screenshots).toHaveLength(3);
			const inventory = readInventory();
			for (const shot of screenshots) {
				const receipt = JSON.parse(readFileSync(shot.source ?? "", "utf8"));
				expect(receipt.project).toBe(id);
				expect(receipt.source.revision).toMatch(/^[a-f0-9]{40}$/);
				expect(receipt.source.materialsVersion).toBe("2.0.0");
				expect(receipt.source.rights.license).toBe("MIT");
				expect(receipt.source.path).toContain("/store/screenshots/");
				for (const path of [shot.src, shot.preview, shot.thumbnail]) {
					const file = inventory.files.find((f) => f.path === path);
					if (!file)
						throw new Error(`Screenshot missing from inventory: ${path}`);
					expect(file.role).toBe("project-media");
					expect(file.provenance).toBe(shot.source);
					expect(assetUrl(path ?? "")).toBe(publicUrl(file));
					const bytes = readFileSync(file.source);
					expect(digest(bytes)).toBe(file.sha256);
					const artifact = receipt.artifacts.find(
						(a: { path: string }) => a.path === path,
					);
					expect(artifact.sha256).toBe(file.sha256);
					expect(artifact.bytes).toBe(bytes.length);
					const metadata = await sharp(bytes).metadata();
					expect(metadata.width).toBe(artifact.width);
					expect(metadata.height).toBe(artifact.height);
					expect((metadata.width ?? 0) / (metadata.height ?? 1)).toBeCloseTo(
						shot.width / shot.height,
						2,
					);
					if (path === shot.src) {
						expect(file.sha256).toBe(receipt.source.sha256);
						expect(metadata.width).toBe(shot.width);
						expect(metadata.height).toBe(shot.height);
					} else {
						expect(artifact.derivedFrom).toBe(receipt.source.sha256);
						expect(artifact.transform.crop).toBe(false);
						expect(artifact.transform.recolor).toBe(false);
					}
				}
			}
		},
	);
});
