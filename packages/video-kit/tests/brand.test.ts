import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import manifest from "../brand-source.json";
import identity from "../current-identity.json";
import { family, hexly, layouts, palettes } from "../src/brand";
import { BrandLockup } from "../src/Identity";
import { entrance, revealState } from "../src/motion";

describe("the Hexly family contract", () => {
	test("all five layouts share both site palettes and the approved native identity", () => {
		const site = readFileSync(
			new URL("../../../src/styles/base.css", import.meta.url),
			"utf8",
		);
		const icon = readFileSync(
			new URL("../../../src/components/Icon.tsx", import.meta.url),
			"utf8",
		);
		for (const palette of Object.values(palettes))
			for (const color of Object.values(palette)) expect(site).toContain(color);
		expect(Object.keys(layouts)).toHaveLength(5);
		expect(family.space.edge).toBeLessThan(family.space.safe);
		expect(family.space.edge).toBe(32);
		const html = renderToStaticMarkup(createElement(BrandLockup));
		expect(icon).toContain("identity.family.root");
		expect(html).toContain(identity.path);
		const bytes = readFileSync(
			new URL(`../public${identity.path}`, import.meta.url),
		);
		expect(createHash("sha256").update(bytes).digest("hex")).toBe(
			identity.sha256,
		);
		expect(html).toContain("font-weight:400");
		expect(html).toContain("gap:11px");
		expect(hexly.wordmark.letterSpacing).toBe(-1);
	});
	test("the official mark settles alone, expands its full wordmark, then shows the caption", () => {
		expect(revealState(0, 30)).toEqual({ mark: 0, expand: 0, caption: 0 });
		expect(revealState(30, 30)).toEqual({ mark: 1, expand: 0, caption: 0 });
		expect(revealState(54, 30).expand).toBeGreaterThan(0);
		expect(revealState(54, 30).expand).toBeLessThan(1);
		expect(revealState(54, 30).caption).toBe(0);
		expect(revealState(110, 30)).toEqual({ mark: 1, expand: 1, caption: 1 });
		expect(revealState(0, 30, true)).toEqual({
			mark: 1,
			expand: 1,
			caption: 1,
		});
		expect(entrance(0, 30, 0.7, 0.2, true)).toBe(1);
		expect(entrance(0, 30, 0.7, 0.2)).toBe(0);
		expect(entrance(90, 30, 0.7)).toBe(1);
	});
	test("distributed font and license bytes retain recorded provenance", () => {
		for (const asset of manifest.assets) {
			const bytes = readFileSync(
				new URL(
					`../public/video-kit/1.0.0/hexly/${asset.file}`,
					import.meta.url,
				),
			);
			expect(createHash("sha256").update(bytes).digest("hex")).toBe(
				asset.sha256,
			);
		}
	});
});
