import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const inventoryPath = "docs/brand-textures/2026-10-18/inventory.json";
assert(
	!existsSync(inventoryPath),
	"Preserve the existing batch; do not rerun.",
);
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const definitions = [
	{
		id: "hexly-ai",
		name: { en: "Ceramic archive", zh: "陶土档案" },
		description: {
			en: "Fine ceramic grain with sparse specimen-layout impressions, leaving a quiet field for the preserved identities.",
			zh: "细陶土颗粒与疏朗的标本排布压痕，为原始品牌留出安静底面。",
		},
		motif:
			"One continuous matte unglazed ceramic working surface. Very fine mineral pores, soft fired-clay grain and a few shallow straight layout scores meeting at oblique angles near the upper-right and lower-left edges. The scores suggest arranging a collection of specimens, not a completed hexagon, tessellation or logo. No separate tiles, tile borders, loose shards or objects.",
		rationale:
			"Hexly preserves a collection of project identities. A ceramic specimen-working surface supports the adopted terracotta emblem without drawing a second emblem or copying its six triangles.",
	},
	{
		id: "base-ci",
		name: { en: "Inspection plate", zh: "检验台面" },
		description: {
			en: "Lapped mineral grain and shallow paired alignment marks recall a quality-inspection work surface.",
			zh: "研磨矿物颗粒与浅浅的成对对位刻痕，呼应质量检验工作台。",
		},
		motif:
			"One continuous precision-lapped mineral inspection plate, extremely fine stone grain, with two sparse groups of short parallel registration scores and open perpendicular alignment corners pressed into the plate near opposite edges. A little directional polishing catches the grazing light. No full-page grid, ruler, numbers, gauge, check mark, lock or raised tool.",
		rationale:
			"Reusable checks and provenance verification are analogous to inspecting work against a gauge. Registration marks belong to its workbench, not to a claim that a repository has passed quality or security checks.",
	},
	{
		id: "base-cli",
		name: { en: "Assembly mat", zh: "装配垫" },
		description: {
			en: "Fine-grained service rubber and shallow modular channels support the shared CLI toolkit.",
			zh: "细颗粒维修胶垫与浅模块槽，承托可复用的命令行工具箱。",
		},
		motif:
			"One continuous fine-grained matte rubber assembly mat, tactile but clean. A small group of broad shallow parallel bit-storage channels enters from the lower-right edge; a few short organizing dividers stay close to the upper edge. Channels are molded depressions in the same surface, not drawn outlines or separate objects. No screwdriver, screws, parts, letters, terminal symbols, circuit traces or full-page grid.",
		rationale:
			"Base CLI packages configuration, OAuth, update and logging helpers. A modular assembly mat supports the adopted screwdriver as a reusable toolkit; it does not illustrate software control flow.",
	},
	{
		id: "base-mcp",
		name: { en: "Mating surface", zh: "接合工作面" },
		description: {
			en: "A fine anti-static work surface with sparse paired coupling impressions and short routing channels.",
			zh: "细腻防静电工作面上，疏朗排布成对接合压痕与短导槽。",
		},
		motif:
			"One continuous matte anti-static service surface with a very fine pebbled grain. Near the upper-right edge, two incomplete concentric mating impressions and three short parallel shallow channels suggest aligning a coupling. A smaller pair of open curved grooves rests near the lower-left edge. All impressions belong to the continuous surface. No actual connector, sockets, cable, electronics, circuit diagram, glowing paths or dense network.",
		rationale:
			"The framework connects entity tools, authorization and transport helpers. A coupling-alignment work surface supports its adopted blue-steel coupling without inventing protocol wiring or security guarantees.",
	},
	{
		id: "next-ai",
		name: { en: "Tuning enamel", zh: "调谐珐琅" },
		description: {
			en: "A softly powder-coated control surface with restrained tuning arcs and shallow detent marks.",
			zh: "柔和粉末涂层控制面上，保留克制的调谐弧线与浅档位刻痕。",
		},
		motif:
			"One continuous finely powder-coated enamel control fascia seen straight down. An incomplete broad tuning arc follows only the lower-right margin, with a few separated short detent marks impressed in the enamel. A short offset parallel arc touches the top-left margin. Keep the arcs open and away from the center, never a full dial. No knob, switch, display, numerals, neon, circuit pattern or interface screenshot.",
		rationale:
			"Next AI supplies provider selection and configuration controls. A tuning fascia supports the adopted selector dial; the arc is a material analogy, not a literal model-routing diagram.",
	},
	{
		id: "octo",
		name: { en: "Seagrass shelter", zh: "海草栖地" },
		description: {
			en: "Long ribbon-like seagrass leaves form a loose coastal shelter around an open, quiet field.",
			zh: "细长带状海草叶围出疏朗的近岸栖地，将中央留给海马。",
		},
		motif:
			"Habitat-led botanical bas-relief of long ribbon-like seagrass leaves, with gentle bends, tapered tips and fine parallel veins, impressed into a tactile mineral-paper surface. Two loose asymmetric clumps grow in from the lower-left and upper-right margins, with a few separated blades and generous open space between them. Use plausible broad coastal seagrass habitat, not a named species. No flowers, coral, shells, bubbles, tropical broad leaves, animal silhouette, seahorse, ocean landscape, grid or technical marks.",
		rationale:
			"The approved identity is a seahorse. Coastal seagrass provides plausible shelter and holdfasts; species is not established, so no species-specific ecology is claimed. The background follows the animal habitat, not the database product's technical diagrams.",
	},
];
const tokens = {
	light:
		"Hexly light tokens: page #f0f0e9, surface #f8f8f2, surface-soft #e8ebdf, line #d4d8cb, ink #30372e. Use warm pale mineral paper with quiet gray-sage relief; do not print any hex code. Preserve visible relief rather than bleaching it into white.",
	dark: "Hexly dark tokens: page #1e2824, surface #27332c, surface-soft #26352b, line #3d4940, ink #e6e9dc. Use deep desaturated green-charcoal with gently illuminated gray-sage relief; do not print any hex code. Keep details visible in dark midtones, with no crushed black field or bright glossy highlights.",
};
const projects = [];
for (const id of [...definitions.map((row) => row.id), "zoo", "sleepy"]) {
	const sourcePath = `src/data/projects/${id}.json`;
	const sourceBytes = await readFile(sourcePath);
	const project = JSON.parse(sourceBytes);
	assert.equal(project.archived, false);
	const original = await readFile(`public${project.logo.original}`);
	assert.equal(sha(original), project.logo.sha256);
	const pixels = await sharp(original).ensureAlpha().raw().toBuffer();
	const definition = definitions.find((row) => row.id === id);
	const row = {
		id,
		title: project.title,
		archived: false,
		category: project.category,
		subject: project.subject,
		sourceMetadataSha256: sha(sourceBytes),
		officialProjectIdentity: {
			path: project.logo.original,
			sha256: sha(original),
			rgbaSha256: sha(pixels),
			width: project.logo.width,
			height: project.logo.height,
			bytes: original.length,
			source: project.logo.sourceUrl,
			kind: project.logo.kind,
		},
		existingKit: null,
		existingIcon: {
			...project.presentationIcon,
			manifestSha256: sha(
				await readFile(`public${project.presentationIcon.root}/manifest.json`),
			),
		},
		productEvidence: {
			source: sourcePath,
			purpose: project.overview.goal,
			inspectedRevision: project.overview.verified.revision,
			snapshot: project.overview.verified.snapshot,
		},
		action: definition ? "generate" : "reuse",
	};
	if (definition) {
		assert(!project.brandTexture && !project.brandKit);
		row.study = `artwork/brands/${id}/texture-studies/2026-10-18-flare-intake-01`;
		row.version = "1.0.0";
		row.root = `/textures/${id}/v1.0.0`;
		row.design = {
			identityType: id === "octo" ? "animal" : "material",
			language: id === "octo" ? "habitat-botanical" : "working-surface",
			...Object.fromEntries(
				Object.entries(definition).filter(([key]) => key !== "id"),
			),
		};
		assert(!existsSync(row.study), `Preserve existing study: ${row.study}`);
		for (const theme of ["light", "dark"]) {
			await mkdir(`${row.study}/${theme}`, { recursive: true });
			const prompt = `Create a supporting decorative texture, not a logo or product illustration. Native square 1024 x 1024, one complete canvas.\n\n${definition.motif}\n\n${tokens[theme]}\n\nOrthographic overhead view with shallow believable relief and soft grazing illumination. A continuous surface fills the canvas without a horizon, frame, vignette, object shadow or perspective. Keep the central 60 percent and left-side text area spacious and quiet. Make the few larger impressions clearly legible at 250-320 CSS pixels; do not rely only on microscopic grain. Refined, tactile and restrained, never noisy, distressed or grungy. No lettering, watermark, badge, central emblem or second focal object. No added plants or ornaments${id === "octo" ? " beyond the specified seagrass" : ""}. Compose the full square as a single surface; seamless repetition is not required.\n`;
			await writeFile(`${row.study}/${theme}/prompt.txt`, prompt);
		}
		await writeFile(
			`${row.study}/brief.md`,
			`# ${project.title}: ${definition.name.en}\n\n## Evidence and direction\n\nExisting identity: ${project.subject}.\nProduct purpose: ${project.overview.goal.en}\nSource: ${sourcePath}, revision ${project.overview.verified.revision}.\n\n${definition.rationale}\n\n${definition.motif}\n\n## Scope and review\n\nTwo independent native 1024-square GPT Image Flare generations, light and dark. Use the actual Workflow helper and retain exact raw PNGs, prompts and sanitized receipts. Generation is authorized by the owner's eight-project texture request on 2026-10-18. Acceptance is not delegated: show the exact raw bytes and wait for owner approval before exporting or integrating. No paid retries without a recorded decision.\n\nPreserve the original Logo file (${sha(original)}) and decoded RGBA (${sha(pixels)}), position, dimensions, colors, rights and all existing identity packages. A later presentation-background composition uses a new icon version. Full canvas only; no crop, recolor, mirrored tiling or seamless claim. No source-product UI, remote upload, profile publication or deployment changes.\n`,
		);
	} else {
		row.existingTexture = {
			...project.brandTexture,
			manifestSha256: sha(
				await readFile(`public${project.brandTexture.root}/manifest.json`),
			),
		};
		row.decision =
			id === "zoo"
				? "Existing owner-approved Flare pair is already composed into the current icon. Preserve and verify; no generation or redundant icon version."
				: "Reuse the existing owner-approved Flare pair. The current icon still uses the authored family background; prepare a new presentation-only version after native inspection.";
	}
	projects.push(row);
}
await mkdir("docs/brand-textures/2026-10-18", { recursive: true });
await writeFile(
	inventoryPath,
	`${JSON.stringify(
		{
			schemaVersion: 1,
			recordedAt: new Date().toISOString(),
			siteBaseline: execFileSync("git", ["rev-parse", "HEAD"], {
				encoding: "utf8",
			}).trim(),
			catalogueSource: "src/data/projects/index.json",
			catalogueSha256: sha(await readFile("src/data/projects/index.json")),
			assetInventoryBaselineSha256: sha(
				await readFile("docs/assets/inventory.json"),
			),
			scope: "hexly-campaign",
			originalIdentityRecolored: false,
			productUIChanged: false,
			authorization: {
				date: "2026-10-18",
				generation: true,
				rawAcceptance: "owner-review-required",
				publication: false,
				quote:
					"有8个项目没有生成底纹，按规范，利用skill给他们补上。更新其logo背景。",
				scopeClarification: "zoo，sleepy",
				localOnly: true,
			},
			model: "gpt-image-2.5-flare",
			plannedRequests: definitions.length * 2,
			nativeSize: [1024, 1024],
			tokenSource: {
				path: "src/styles/base.css",
				sha256: sha(await readFile("src/styles/base.css")),
			},
			projects,
		},
		null,
		"\t",
	)}\n`,
);
console.log(
	`Prepared ${definitions.length * 2} requests; Zoo and Sleepy reuse existing approved textures.`,
);
