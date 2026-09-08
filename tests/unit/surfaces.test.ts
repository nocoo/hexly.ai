import { describe, expect, it } from "vitest";
import { surfaceHref, surfaceIds } from "../../src/data/surfaces";

describe("family surface destinations", () => {
	it("keeps Play, Journal, Résumé, and Portfolio in that order", () => {
		expect(surfaceIds).toEqual(["play", "journal", "resume", "portfolio"]);
	});

	it("points Play and Résumé at the current locale and keeps Journal and Portfolio stable", () => {
		expect(surfaceHref("play", "en")).toBe("https://lizheng.me/en/");
		expect(surfaceHref("play", "zh")).toBe("https://lizheng.me/zh/");
		expect(surfaceHref("journal", "en")).toBe("https://lizheng.blog/");
		expect(surfaceHref("journal", "zh")).toBe("https://lizheng.blog/");
		expect(surfaceHref("resume", "en")).toBe("https://lizheng.dev/en/");
		expect(surfaceHref("resume", "zh")).toBe("https://lizheng.dev/zh/");
		expect(surfaceHref("portfolio", "en")).toBe("/");
		expect(surfaceHref("portfolio", "zh")).toBe("/");
	});
});
