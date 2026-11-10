import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { digest, publicUrl, readInventory } from "../../scripts/asset-storage";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";

const projects = readProjects();

describe("store screenshot integrity", () => {
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
