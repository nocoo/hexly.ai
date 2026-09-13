import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LogoReview } from "../../src/components/LogoReview";
import { readProjects } from "../../src/data/read-projects";
import type { Project } from "../../src/model/project";

const existing = readProjects().find((project) => project.id === "frogie");
if (!existing?.family?.previous) throw new Error("Missing historical fixture");
const first: Project = {
	...existing,
	brandKit: undefined,
	family: { ...existing.family, previous: null },
};

describe("first project identities", () => {
	it.each([
		["en", "First identity", "No previous logo existed."],
		["zh", "首个品牌标识", "此前没有独立 Logo。"],
	] as const)(
		"states the initial identity honestly in %s",
		(locale, title, note) => {
			const html = renderToStaticMarkup(
				createElement(LogoReview, { project: first, locale, onCopy: () => {} }),
			);
			expect(html).toContain(title);
			expect(html).toContain(note);
			expect(html).not.toContain('class="previous-artwork"');
			expect(html).not.toContain("previous-1024.webp");
			expect(html).toContain("comparison-single");
			expect(html).toContain('class="size-grid"');
		},
	);

	it("retains the old identity and source link for a redesign", () => {
		const html = renderToStaticMarkup(
			createElement(LogoReview, {
				project: { ...existing, brandKit: undefined },
				locale: "en",
				onCopy: () => {},
			}),
		);
		expect(html).toContain('class="previous-artwork"');
		expect(html).toContain(existing.family?.previous?.sourceUrl);
		expect(html).not.toContain("No previous logo existed.");
	});
});
