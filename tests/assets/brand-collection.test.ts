import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import inventory from "../../docs/brand-archives/inventory-2026-10-28.json";
import { readProjects } from "../../src/data/read-projects";
import { brandAsset, brandSourceLabel } from "../../src/model/brand";
import { brandManifestProblems } from "../../src/model/brand-manifest";
import { catalogueProblems } from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";

const sha = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const projects = readProjects();
const baselineProjects = projects.filter((project) =>
	inventory.projects.some((row) => row.id === project.id),
);
const targetIds = inventory.projects
	.filter((p) => p.scope === "target")
	.map((p) => p.id);
const targets = projects.filter((p) => targetIds.includes(p.id));
const kits = projects.filter((p) => p.brandKit?.method === "archived-artwork");
const manifest = (project: Project) =>
	readFile(`public${project.brandKit?.root}/manifest.json`, "utf8").then(
		JSON.parse,
	);

describe("complete Hexly campaign archives", () => {
	it("preserves baseline identity metadata and WebP CDN delivery after retiring Snail", async () => {
		expect(baselineProjects.map((p) => p.id)).toEqual(
			inventory.projects.filter((p) => p.id !== "snail").map((p) => p.id),
		);
		expect(targets).toHaveLength(54);
		for (const p of baselineProjects) {
			const baseline = inventory.projects.find((row) => row.id === p.id);
			if (!baseline) throw new Error(`Missing identity baseline: ${p.id}`);
			expect(p.logo, p.id).toMatchObject({
				original: baseline.original.path,
				sha256: baseline.original.sha256,
				modified: false,
			});
			if (baseline.familyRoot)
				expect(p.family, p.id).toMatchObject({
					root: baseline.familyRoot,
					foreground: baseline.foreground,
				});
			const display = await sharp(`public${p.logo.display}`).metadata();
			expect(display, p.id).toMatchObject({
				format: "webp",
				width: 1024,
				height: 1024,
			});
			if (targetIds.includes(p.id))
				expect(p.brandKit).toMatchObject({
					version: baseline.kitVersion ?? "1.0.0",
					method: "archived-artwork",
					scope: "hexly-campaign",
					sourceAdoptionRevision: baseline.sourceAdoptionRevision ?? null,
				});
		}
		expect(catalogueProblems(projects)).toEqual([]);
	});

	it.each(
		kits.filter((project) =>
			["frogie", "basalt", "neo", "pokepocket", "pi-agent-policy"].includes(
				project.id,
			),
		),
	)(
		"$id delivers valid manifests, outlined wordmarks, and lean WebP brand assets",
		async (p) => {
			const kit = p.brandKit;
			if (!kit || !p.family) throw new Error("Missing collection kit");
			const m = await manifest(p);
			expect(brandManifestProblems(m), p.id).toEqual([]);
			for (const theme of ["light", "dark"] as const) {
				const wordmark = await readFile(
					`public${brandAsset(kit, "wordmark", theme)}`,
				);
				expect(wordmark.toString()).not.toMatch(
					/<(text|image|script|foreignObject)\b|(?:href|src)=|@import|url\(/i,
				);
				for (const asset of ["mark", "icon", "lockup"] as const) {
					const meta = await sharp(
						`public${brandAsset(kit, asset, theme)}`,
					).metadata();
					expect(meta.format).toBe("webp");
					expect(meta.width).toBeGreaterThan(0);
				}
			}
			expect(
				(await sharp(`public${kit.root}/hero.webp`).metadata()).format,
			).toBe("webp");
			expect(
				(await sharp(`public${kit.root}/hero-square.webp`).metadata()).format,
			).toBe("webp");
			const ico = await readFile(`public${kit.root}/favicon.ico`);
			expect(ico.readUInt16LE(2)).toBe(1);
			expect(ico.readUInt16LE(4)).toBe(6);
			expect(brandSourceLabel(p, "en")).toBeTruthy();
		},
	);

	it("rejects manifest identity substitution, product recoloring, fabricated generation, bad digests and escaping files", async () => {
		const frogie = kits.find((p) => p.id === "frogie");
		if (!frogie) throw new Error("Missing frogie fixture");
		const m = await manifest(frogie);
		expect(brandManifestProblems(m)).toEqual([]);
		expect(
			brandManifestProblems({
				...m,
				scope: { ...m.scope, productUIChanged: true },
			}).length,
		).toBeGreaterThan(0);
		expect(
			brandManifestProblems({
				...m,
				officialProjectIdentity: {
					...m.officialProjectIdentity,
					sha256: sha("mutated"),
				},
			}).length,
		).toBeGreaterThan(0);
	});
});
