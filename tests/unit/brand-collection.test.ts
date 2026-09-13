import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import inventory from "../../docs/brand-archives/inventory-0.10.0.json";
import retiredSnail from "../../docs/sources/snail-retired-2026-09-13.json" with {
	type: "json",
};
import { readProjects } from "../../src/data/read-projects";
import {
	brandAsset,
	brandSourceLabel,
	brandTexture,
} from "../../src/model/brand";
import { brandManifestProblems } from "../../src/model/brand-manifest";
import { catalogueProblems } from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";

const sha = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const projects = readProjects();
const targetIds = inventory.projects
	.filter((p) => p.scope === "target")
	.map((p) => p.id);
const targets = projects.filter((p) => targetIds.includes(p.id));
const manifest = (project: Project) =>
	readFile(`public${project.brandKit?.root}/manifest.json`, "utf8").then(
		JSON.parse,
	);

describe("complete Hexly campaign archives", () => {
	it("preserves baseline identity metadata and assets after retiring Snail from the catalogue", async () => {
		expect(projects.map((p) => p.id)).toEqual(
			inventory.projects.filter((p) => p.id !== "snail").map((p) => p.id),
		);
		expect(targets).toHaveLength(54);
		expect(projects.filter((p) => !p.archived)).toHaveLength(54);
		expect(projects.filter((p) => p.archived)).toHaveLength(20);
		for (const p of [...projects, retiredSnail as Project]) {
			const baseline = inventory.projects.find((row) => row.id === p.id);
			const { brandKit, ...original } = p;
			const isTarget = targetIds.includes(p.id);
			expect(sha(JSON.stringify(isTarget ? original : p)), p.id).toBe(
				baseline?.protectedMetadataSha256,
			);
			expect(sha(await readFile(`public${p.logo.original}`)), p.id).toBe(
				baseline?.original.sha256,
			);
			if (isTarget)
				expect(brandKit).toMatchObject({
					version: "1.0.0",
					method: "archived-artwork",
					scope: "hexly-campaign",
					sourceAdoptionRevision: null,
				});
		}
		expect(
			sha(await readFile("public/brands/snail/v2.0.0/manifest.json")),
		).toBe(inventory.snailBaseline.v2ManifestSha256);
		expect(
			sha(await readFile("public/brands/snail/v1.0.0/manifest.json")),
		).toBe(inventory.snailBaseline.v1ManifestSha256);
		expect(catalogueProblems(projects)).toEqual([]);
	});

	it.each(targets)(
		"$id preserves original file/pixel colors, real formats, complete Hero pixels and verifiable downloads",
		async (p) => {
			const kit = p.brandKit;
			if (!kit || !p.family) throw new Error("Missing collection kit");
			const m = await manifest(p);
			expect(brandManifestProblems(m), p.id).toEqual([]);
			for (const file of m.files) {
				const bytes = await readFile(`public${file.path}`);
				expect(bytes.length, file.path).toBe(file.bytes);
				expect(sha(bytes), file.path).toBe(file.sha256);
			}
			for (const identity of [
				m.officialProjectIdentity,
				m.campaignInterpretation,
			]) {
				const before = await readFile(`public${identity.path}`);
				const after = await readFile(`public${identity.export}`);
				expect(after.equals(before), identity.role).toBe(true);
				const originalPixels = await sharp(before)
					.ensureAlpha()
					.raw()
					.toBuffer();
				const exportedPixels = await sharp(after)
					.ensureAlpha()
					.raw()
					.toBuffer();
				expect(
					exportedPixels.equals(originalPixels),
					"Every decoded pixel, including original RGB and alpha",
				).toBe(true);
				expect(sha(originalPixels)).toBe(identity.rgbaSha256);
			}
			const master = await readFile(`public${kit.root}/logo.png`);
			for (const theme of ["light", "dark"] as const) {
				expect(
					(await readFile(`public${brandAsset(kit, "mark", theme)}`)).equals(
						master,
					),
				).toBe(true);
				const wordmark = await readFile(
					`public${brandAsset(kit, "wordmark", theme)}`,
				);
				expect(wordmark.toString()).not.toMatch(
					/<(text|image|script|foreignObject)\b|(?:href|src)=|@import|url\(/i,
				);
				expect(wordmark.toString()).toContain(
					"Full glyph bounds include descenders",
				);
				const glyph = await sharp(wordmark)
					.ensureAlpha()
					.raw()
					.toBuffer({ resolveWithObject: true });
				for (let x = 0; x < glyph.info.width; x++) {
					expect(glyph.data[x * 4 + 3]).toBe(0);
					expect(
						glyph.data[
							((glyph.info.height - 1) * glyph.info.width + x) * 4 + 3
						],
					).toBe(0);
				}
				const texture = await sharp(`public${kit.root}/texture-${theme}.png`)
					.ensureAlpha()
					.raw()
					.toBuffer({ resolveWithObject: true });
				expect(texture.info).toMatchObject({
					width: 512,
					height: 512,
					channels: 4,
				});
				let edgeAlpha = 0,
					maxAlpha = 0;
				for (let y = 0; y < 512; y++)
					for (let x = 0; x < 512; x++) {
						const a = texture.data[(y * 512 + x) * 4 + 3] ?? 0;
						maxAlpha = Math.max(maxAlpha, a);
						if (x === 0 || x === 511 || y === 0 || y === 511) edgeAlpha += a;
					}
				expect(edgeAlpha).toBe(0);
				expect(maxAlpha).toBeGreaterThan(0);
				expect(maxAlpha).toBeLessThanOrEqual(16);
				for (const square of [false, true]) {
					const placement = m.hero.placements[square ? "square" : "wide"];
					expect(placement.left).toBeGreaterThanOrEqual(0);
					expect(placement.top).toBeGreaterThanOrEqual(0);
					expect(placement.left + placement.artworkSize).toBeLessThanOrEqual(
						placement.width,
					);
					expect(placement.top + placement.artworkSize).toBeLessThanOrEqual(
						placement.height,
					);
					expect(placement.artworkSize).toBeLessThanOrEqual(
						p.family.foreground.width,
					);
					const suffix = theme === "dark" ? "-dark" : "";
					const preview = await sharp(
						`public${kit.root}/hero${square ? "-square" : ""}${suffix}.webp`,
					).metadata();
					expect(preview).toMatchObject({
						width: square ? 1024 : 2400,
						height: square ? 1024 : 960,
					});
					if (square) continue;
					const frame = await sharp(`public${kit.root}/hero${suffix}.png`)
						.ensureAlpha()
						.raw()
						.toBuffer();
					const expected = await sharp(master)
						.resize(placement.artworkSize)
						.png()
						.toBuffer();
					const source = await sharp(expected).ensureAlpha().raw().toBuffer();
					let covered = 0,
						changed = 0;
					for (let y = 0; y < placement.artworkSize; y++)
						for (let x = 0; x < placement.artworkSize; x++) {
							const from = (y * placement.artworkSize + x) * 4;
							const alpha = source[from + 3] ?? 0;
							if (alpha < 250) continue;
							covered++;
							const to =
								((y + placement.top) * placement.width + x + placement.left) *
								4;
							// Some authoritative retained PNGs use 254 alpha across solid facets.
							// Keep that alpha; bound only its legitimate background contribution.
							const tolerance = alpha === 255 ? 0 : 256 - alpha;
							if (
								[0, 1, 2].some(
									(channel) =>
										Math.abs(
											(source[from + channel] ?? 0) -
												(frame[to + channel] ?? 0),
										) > tolerance,
								)
							)
								changed++;
						}
					expect(covered).toBeGreaterThan(1000);
					expect(
						changed,
						"Hero preserves opaque colors exactly and only composites the source's existing alpha",
					).toBe(0);
				}
			}
			const ico = await readFile(`public${kit.root}/favicon.ico`);
			expect(ico.readUInt16LE(0)).toBe(0);
			expect(ico.readUInt16LE(2)).toBe(1);
			expect(ico.readUInt16LE(4)).toBe(6);
			for (const [i, size] of [16, 32, 48, 64, 128, 256].entries()) {
				const header = 6 + i * 16,
					start = ico.readUInt32LE(header + 12);
				const png = ico.subarray(start, start + ico.readUInt32LE(header + 8));
				expect(await sharp(png).metadata()).toMatchObject({
					width: size,
					height: size,
					hasAlpha: true,
				});
				expect((await sharp(png).stats()).channels[3]?.min).toBe(0);
			}
			const token = JSON.parse(
				await readFile(`public${kit.root}/tokens.json`, "utf8"),
			);
			expect(token.scope).toMatchObject({
				id: "hexly-campaign",
				productUIChanged: false,
				officialIdentityRecolored: false,
				campaignReplacesOfficialIdentity: false,
			});
			expect(sha(await readFile(`public${kit.root}/space-grotesk.woff2`))).toBe(
				token.font.fontSha256,
			);
			expect(await readFile(`public${kit.root}/license.txt`, "utf8")).toContain(
				"does not relicense preserved source imagery",
			);
		},
		15_000,
	);

	it("uses 54 distinct motif geometries, with truthful original/adapted/generated provenance", async () => {
		const motifs = new Set<string>();
		const different: string[] = [];
		for (const p of targets) {
			const m = await manifest(p);
			const provenance = JSON.parse(
				await readFile(`public${p.brandKit?.root}/provenance.json`, "utf8"),
			);
			motifs.add(
				JSON.stringify(
					provenance.texture.layers.map((layer: { d: string }) => layer.d),
				),
			);
			expect(provenance.hero).toMatchObject({
				method: "authored-composition",
				newGenerationCalls: 0,
				nativeGPTOutput: false,
			});
			if (!m.campaignInterpretation.sameBytesAsOfficial) different.push(p.id);
			if (p.family?.method) {
				expect(provenance.generation).toBeNull();
				expect(provenance.sourceRights).toContain(
					p.family.method === "reference-adaptation"
						? "Artist and redistribution license are not established"
						: "not independently established",
				);
			} else {
				expect(provenance.generation.model).toBe("gpt-image-2");
				expect(provenance.generation.madeInThisRelease).toBe(false);
				expect(
					sha(await readFile(`public${provenance.generation.raw.path}`)),
				).toBe(provenance.generation.raw.sha256);
				expect(
					sha(await readFile(`public${p.brandKit?.root}/prompt.txt`)),
				).toBe(provenance.generation.promptSha256);
			}
			for (const source of provenance.records)
				expect(sha(await readFile(source.path)), source.path).toBe(
					source.sha256,
				);
			for (const field of ["recipe", "tool", "typographyTool"])
				expect(
					sha(await readFile(provenance.build[field])),
					provenance.build[field],
				).toBe(provenance.build[`${field}Sha256`]);
		}
		expect(motifs.size).toBe(54);
		expect(different.toSorted()).toEqual([
			"basalt",
			"clip",
			"dreamro",
			"fundly",
			"meowth",
		]);
	}, 15_000);

	it("rejects missing campaign fields in catalogue data, and labels every source method honestly", () => {
		const p = targets[0];
		if (!p?.brandKit) throw new Error("Missing example kit");
		for (const change of [
			{ scope: undefined },
			{ scope: "product-ui" },
			{ hero: undefined },
			{ lockup: null },
			{ lockup: { width: 0, height: 416 } },
			{ lockup: { width: 1.2, height: 0 } },
			{ texture: null },
			{ texture: { name: { en: "Only English" } } },
			{ hero: { ...p.brandKit.hero, themed: "dark" } },
		]) {
			const damaged = {
				...p,
				brandKit: { ...p.brandKit, ...change },
			} as unknown as Project;
			expect(catalogueProblems([damaged]), JSON.stringify(change)).toContain(
				`Invalid brand kit: ${p.id}`,
			);
		}
		for (const [id, en, zh] of [
			["frogie", "GPT Image · Animal", "GPT Image · 动物"],
			["basalt", "GPT Image · Object", "GPT Image · 实物"],
			["neo", "Retained original", "保留原作"],
			["pokepocket", "Supplied illustration", "提供插画适配"],
		]) {
			const project = projects.find((p) => p.id === id);
			if (!project?.brandKit) throw new Error("Missing method fixture");
			expect(brandSourceLabel(project, "en")).toBe(en);
			expect(brandSourceLabel(project, "zh")).toBe(zh);
			expect(brandAsset(project.brandKit, "icon", "dark")).toMatch(
				/icon-dark\.png$/,
			);
			expect(brandTexture(project.brandKit)).toBeDefined();
		}
		const native = { ...p, brandKit: undefined };
		expect(brandSourceLabel(native, "en")).toBe("Original vector");
		expect(brandSourceLabel(native, "zh")).toBe("原创矢量");
	});

	it("rejects manifest identity substitution, product recoloring, fabricated generation, bad digests and escaping files", async () => {
		const p = targets[0];
		if (!p) throw new Error("Missing manifest fixture");
		const m = await manifest(p);
		for (const invalid of [
			null,
			[],
			"text",
			{},
			{ ...m, schemaVersion: 1 },
			{ ...m, method: "native-svg" },
			{ ...m, project: "bad/name" },
			{ ...m, project: 2 },
			{ ...m, version: "latest" },
			{ ...m, version: null },
			{ ...m, root: "https://elsewhere.test" },
			{ ...m, canonical: "/logos/frogie" },
			{ ...m, scope: null },
			{ ...m, scope: { ...m.scope, productUIChanged: true } },
			{ ...m, scope: { ...m.scope, officialIdentityRecolored: true } },
			{ ...m, scope: { ...m.scope, appliesTo: [] } },
			{ ...m, scope: { ...m.scope, appliesTo: [null] } },
			{ ...m, files: null },
			{ ...m, files: [null] },
			{ ...m, files: [...m.files, m.files[0]] },
			{
				...m,
				files: [{ ...m.files[0], path: `${p.brandKit?.root}/../outside.png` }],
			},
			{ ...m, files: [{ ...m.files[0], path: `${p.brandKit?.root}/` }] },
			{ ...m, files: [{ ...m.files[0], sha256: "x".repeat(64) }] },
			{ ...m, files: [{ ...m.files[0], bytes: -1 }] },
			{ ...m, officialProjectIdentity: null },
			{
				...m,
				officialProjectIdentity: {
					...m.officialProjectIdentity,
					path: "https://untrusted.test",
				},
			},
			{
				...m,
				officialProjectIdentity: {
					...m.officialProjectIdentity,
					rgbaSha256: "changed",
				},
			},
			{
				...m,
				officialProjectIdentity: { ...m.officialProjectIdentity, width: 0 },
			},
			{
				...m,
				officialProjectIdentity: {
					...m.officialProjectIdentity,
					modified: true,
				},
			},
			{
				...m,
				campaignInterpretation: {
					...m.campaignInterpretation,
					replacesOfficialIdentity: true,
				},
			},
			{
				...m,
				campaignInterpretation: {
					...m.campaignInterpretation,
					newGenerationCalls: 1,
				},
			},
			{
				...m,
				campaignInterpretation: {
					...m.campaignInterpretation,
					sameBytesAsOfficial: false,
				},
			},
			{
				...m,
				campaignInterpretation: {
					...m.campaignInterpretation,
					sourceMethod: "hand-drawn",
				},
			},
			{
				...m,
				campaignInterpretation: {
					...m.campaignInterpretation,
					sourceAdoptionStatus: "published",
				},
			},
			{ ...m, hero: { ...m.hero, nativeGPTOutput: true } },
			{ ...m, hero: { ...m.hero, crop: true } },
			{ ...m, hero: { ...m.hero, placements: {} } },
		])
			expect(
				brandManifestProblems(invalid).length,
				JSON.stringify(invalid).slice(0, 80),
			).toBeGreaterThan(0);
		const schema = JSON.parse(
			await readFile("public/brands/schema-v2.json", "utf8"),
		);
		expect(schema.properties.scope.properties.productUIChanged.const).toBe(
			false,
		);
		expect(schema.required).toContain("officialProjectIdentity");
		expect(schema.required).toContain("campaignInterpretation");
	});
});
