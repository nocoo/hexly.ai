import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { endingIds, templateIds } from "../../packages/video-kit/src/schema";
import storage from "../../src/data/media-storage.json";
import { readProjects } from "../../src/data/read-projects";
import manifest from "../../src/data/template-examples.json" with {
	type: "json",
};
import { catalogueProblems } from "../../src/model/catalogue";
import { llmsDocument, pageForPath } from "../../src/model/discovery";
import { navigationPath, parseNavigation } from "../../src/model/navigation";

const projects = readProjects();

describe("published standard outro examples", () => {
	it("keeps five original MP4s and HTML stills tied to immutable publication receipts", () => {
		expect(manifest.examples).toHaveLength(5);
		expect(new Set(manifest.examples.map((example) => example.ending))).toEqual(
			new Set(endingIds),
		);
		expect(manifest.source.revision).toBe(
			"6b89bb9765f9845d57d6d38f2572f1c9152ecae2",
		);
		for (const example of manifest.examples) {
			const receipt = JSON.parse(readFileSync(example.video.source, "utf8"));
			expect(example).toMatchObject({
				kind: "outro",
				theme: "light",
				audio: "none",
				width: 1920,
				height: 1080,
				fps: 30,
			});
			expect(templateIds).toContain(example.template);
			expect(example.video.durationSeconds).toBe(6);
			expect(receipt.source.revision).toBe(manifest.source.revision);
			expect(receipt.assets.video).toMatchObject({
				url: example.video.src,
				sha256: example.video.sha256,
			});
			expect(receipt.assets.poster.url).toBe(example.video.poster);
			expect(receipt.assets.still).toMatchObject({
				url: example.still.src,
				sha256: example.still.sha256,
			});
			expect(receipt.posterProvenance).toMatchObject({
				method: "HTML composition screenshot",
				frame: 100,
				scale: 2,
				derivedFromVideo: false,
				cropped: false,
			});
			expect(example.still).toMatchObject({
				width: 3840,
				height: 2160,
				source: "html-composition",
			});
			for (const asset of Object.values(receipt.assets) as {
				url: string;
				key: string;
				sha256: string;
			}[]) {
				expect(asset.url).toBe(`${storage.origin}/${asset.key}`);
				expect(asset.key).toContain(
					`projects/hexly-ai/videos/${example.video.id}/v${example.video.version}/`,
				);
				expect(asset.key).toContain(asset.sha256.slice(0, 12));
				expect(
					receipt.verification.http.find(
						(check: { key: string }) => check.key === asset.key,
					)?.head,
				).toHaveLength(2);
			}
			expect(
				receipt.verification.http.find(
					(check: { key: string }) => check.key === receipt.assets.video.key,
				)?.range.status,
			).toBe(206);
		}
		const base = projects[0];
		if (!base) throw new Error("Expected the existing project catalogue");
		expect(
			catalogueProblems([
				{
					...base,
					media: { videos: manifest.examples.map((example) => example.video) },
				},
			]),
		).toEqual([]);
	});

	it("preserves example anchors alongside composition and theme choices", () => {
		for (const hash of ["#examples", "#video-standard-outro-product-launch"]) {
			const query = "?project=bogo&theme=dark&ending=line";
			const state = parseNavigation("/templates/launch", query, projects, hash);
			expect(navigationPath(state)).toBe(`/templates/launch${query}${hash}`);
		}
	});

	it("exposes real file links in crawler HTML and discovery on the canonical template route", () => {
		const page = pageForPath("/templates", projects);
		for (const example of manifest.examples) {
			expect(page.bodyHtml).toContain(example.video.src);
			expect(page.bodyHtml).toContain(example.still.src);
			const detail = pageForPath(`/templates/${example.template}`, projects);
			expect(detail.bodyHtml).toContain(example.video.src);
		}
		expect(page.canonical).toBe("https://hexly.ai/templates");
		expect(llmsDocument(projects)).toContain(
			"https://hexly.ai/templates/examples.json",
		);
	});
});
