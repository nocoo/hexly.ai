import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assetKey, digest, readInventory } from "../../scripts/asset-storage";
import { readProjects } from "../../src/data/read-projects";
import { assetKeyForPath, assetUrl } from "../../src/model/assets";

describe("R2 material delivery", () => {
	it("keeps page navigation separate from immutable asset transport", () => {
		for (const path of [
			"/",
			"/projects/snail",
			"/logos/snail",
			"/templates",
			"/api/live",
			"/brands/snail/v2.0.0/review.html",
			"/brands/snail/v2.0.0/review.js",
			"//untrusted.test/a.png",
			"/brands/../bad.png",
			"/brands/%2e%2e/bad.png",
			"/missing.png",
		]) {
			expect(assetKeyForPath(path)).toBeNull();
			expect(assetUrl(path)).toBe(path);
		}
		const path = "/brands/snail/v2.0.0/mark-light.png";
		expect(assetUrl(`${path}?download=1#image`)).toBe(
			`https://h.no.mt${path}?download=1#image`,
		);
		expect(assetUrl(`https://hexly.ai${path}`)).toBe(`https://h.no.mt${path}`);
		expect(assetUrl(`https://other.test${path}`)).toBe(
			`https://other.test${path}`,
		);
		expect(assetUrl("data:image/svg+xml,test")).toBe("data:image/svg+xml,test");
		expect(assetUrl("/video-kit/1.0.0/hexly/journey-cjk.woff2")).toBe(
			"https://h.no.mt/video-kit/1.0.0/hexly/journey-cjk.woff2",
		);
	});
	it("inventories all projects, preserves original Logo bytes, and maps every public material", () => {
		const inventory = readInventory();
		expect(inventory.files.length).toBeGreaterThan(9000);
		for (const project of readProjects()) {
			const original = inventory.files.find(
				(f) => f.path === project.logo.original,
			);
			expect(original?.sha256, project.id).toBe(project.logo.sha256);
			expect(
				digest(readFileSync(`public${project.logo.original}`)),
				project.id,
			).toBe(project.logo.sha256);
		}
		for (const file of inventory.files.filter(
			(f) => f.path && !/\.(html|css|js)$/.test(f.path),
		)) {
			expect(assetKeyForPath(file.path ?? ""), file.source).toBe(file.key);
			for (const alias of file.aliases ?? [])
				expect(assetKeyForPath(alias)).toBe(file.key);
		}
	});
	it("rejects invalid CLI selectors before any upload or hydration", () => {
		for (const args of [
			["--scope", "everything"],
			["--project", "unknown-project"],
			["--limit", "0"],
			["--limit", "NaN"],
		]) {
			const result = spawnSync(
				"bun",
				["scripts/asset-storage.ts", "plan", ...args],
				{ encoding: "utf8" },
			);
			expect(result.status).not.toBe(0);
			expect(result.stderr).toMatch(
				/Scope must|Unknown catalogue project|Limit must/,
			);
		}
	});
	it("versions loose files by bytes while preserving package-relative paths", () => {
		const sha = "a".repeat(64);
		expect(assetKey("/logos/originals/pew.png", sha, "pew")).toBe(
			"projects/pew/identity/v1.0.0/pew-aaaaaaaaaaaa.png",
		);
		expect(assetKey("/fonts/journey-cjk.woff2", sha, "hexly-ai")).toBe(
			"shared/site/v1.0.0/journey-cjk-aaaaaaaaaaaa.woff2",
		);
		expect(assetKey("/brands/snail/v2.0.0/manifest.json", sha, "snail")).toBe(
			"brands/snail/v2.0.0/manifest.json",
		);
	});
});
