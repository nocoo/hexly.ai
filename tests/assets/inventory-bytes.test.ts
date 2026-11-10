import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { digest, readInventory } from "../../scripts/asset-storage";
import { readProjects } from "../../src/data/read-projects";
import { assetKeyForPath } from "../../src/model/assets";

describe("hydrated public material bytes", () => {
	it("inventories all projects, preserves original Logo bytes, and maps every public material", () => {
		const inventory = readInventory();
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
	it("keeps the official Chrome store badge bytes and third-party rights distinct", () => {
		const badge = readInventory().files.find(
			(file) =>
				file.path === "/badges/chrome-web-store/v1.0.0/chrome-web-store.png",
		);
		expect(badge?.role).toBe("third-party-badge");
		expect(badge?.sha256).toBe(
			"fbf289fca885e58a1507cc8c69a9df68f35e83e683825b3ad6cd617b0a17d79c",
		);
		expect(digest(readFileSync(badge?.source ?? ""))).toBe(badge?.sha256);
		const receipt = JSON.parse(readFileSync(badge?.provenance ?? "", "utf8"));
		expect(receipt.source.rightsHolder).toBe("Google LLC");
		expect(receipt.source.guidance).toBe(
			"https://developer.chrome.com/docs/webstore/branding",
		);
		expect(receipt.files[0]).toMatchObject({
			width: 340,
			height: 96,
			sha256: badge?.sha256,
		});
	});
});
