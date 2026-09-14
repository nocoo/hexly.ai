// This records the explicitly authorized 2026-09-14 catalogue batch, once.
// Run from the repository root; existing records and projects are not overwritten.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { readProjects } from "../../../src/data/read-projects";

const batch = "artwork/brand-textures/2026-09-14";
const destination = "docs/brand-textures/2026-09-14";
const sha = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const projects = readProjects();
const directions = new Map(
	(await readFile(`${batch}/directions.tsv`, "utf8"))
		.trim()
		.split("\n")
		.map((line) => {
			const [id, ...fields] = line.split("\t");
			assert(id && fields.length === 5);
			return [id, fields] as const;
		}),
);
assert.equal(projects.length, 75);
assert.equal(directions.size, 74);
assert.deepEqual(
	[...directions.keys()].sort(),
	projects
		.filter((p) => p.id !== "pi-agent-policy")
		.map((p) => p.id)
		.sort(),
);
assert(
	!existsSync(`${destination}/inventory.json`),
	"Preserve the frozen batch inventory; make a new batch.",
);
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
	encoding: "utf8",
}).trim();
const rows = [];
for (const project of projects) {
	const original = await readFile(`public${project.logo.original}`);
	assert.equal(sha(original), project.logo.sha256);
	const rgbaSha256 = sha(await sharp(original).ensureAlpha().raw().toBuffer());
	const kit = project.brandKit;
	const base = {
		id: project.id,
		title: project.title,
		archived: project.archived,
		category: project.category,
		sourceMetadataSha256: sha(JSON.stringify(project)),
		officialProjectIdentity: {
			path: project.logo.original,
			sha256: sha(original),
			rgbaSha256,
			width: project.logo.width,
			height: project.logo.height,
			bytes: original.length,
			source: project.logo.sourceUrl,
			kind: project.logo.kind,
		},
		existingKit: kit
			? {
					root: kit.root,
					version: kit.version,
					manifestSha256: sha(
						await readFile(`public${kit.root}/manifest.json`),
					),
				}
			: null,
		subject: project.family?.foreground.subject?.en ?? project.subject,
		productEvidence: {
			description: project.description,
			purpose: project.overview?.goal ?? project.description,
			source: `src/data/projects/${project.id}.json`,
			inspectedRevision: project.source.repositoryRevision,
		},
	};
	if (project.id === "pi-agent-policy") {
		rows.push({
			...base,
			action: "retain",
			reason:
				"Owner-approved Flare pilot already published; preserve its exact texture, identity and kit bytes.",
		});
		continue;
	}
	const [identityType, nameEn, nameZh, motif, descriptionZh] =
		directions.get(project.id) ?? [];
	assert(identityType && nameEn && nameZh && motif && descriptionZh);
	const study = `artwork/brands/${project.id}/texture-studies/2026-09-14-flare-rollout-01`;
	assert(!existsSync(study), `Study exists: ${study}`);
	const natural = ["animal", "bird", "fictional-animal"].includes(identityType);
	const design = {
		identityType,
		language: natural ? "habitat-botanical" : "product-material",
		name: { en: nameEn, zh: nameZh },
		motif,
		description: {
			en: (motif.split(". ")[0] ?? motif)
				.replace(/^.*?: /, "")
				.replace(/^[a-z]/, (c) => c.toUpperCase())
				.replace(/\.?$/, "."),
			zh: descriptionZh,
		},
		rationale: natural
			? "The existing animal/bird identity determines a plausible broad botanical setting; no species claim is added. Product category does not override an approved animal identity."
			: "The existing object, character or historical mark remains unchanged. Only a supporting working surface is interpreted from the product's purpose; no replacement Logo is generated.",
	};
	const row = {
		...base,
		action: "generate",
		study,
		version: "1.0.0",
		root: `/textures/${project.id}/v1.0.0`,
		design,
	};
	rows.push(row);
	await mkdir(study, { recursive: true });
	await writeFile(
		`${study}/brief.md`,
		`# ${project.title}: ${nameEn}\n\n${descriptionZh}\n\n${motif}\n\nExisting identity: ${base.subject}.\n\nProduct evidence: ${base.productEvidence.purpose.en}\n\n${design.rationale}\n\nThe owner authorized all other catalogue projects, including archived entries, and delegated raw-image acceptance on 2026-09-14. This is a Hexly-only decorative campaign study using GPT Image Flare, not a change to the official identity, product UI, product release or archive status. Original Logo SHA-256: ${project.logo.sha256}.\n\nPrepare independent full-square light/dark surfaces. Inspect their complete raw canvases, record delegated acceptance, then make uncropped delivery encodings. Do not claim seamless tiling or fabricate owner review.\n`,
	);
	for (const theme of ["light", "dark"]) {
		await mkdir(`${study}/${theme}`, { recursive: true });
		const palette =
			theme === "light"
				? "LIGHT THEME: Hexly warm paper #f0f0e9 and ivory surface #f8f8f2. Broad tonal motifs in quiet sage-paper neutrals, delicate shadows around #bcc2b3 and soft light on raised edges. Keep the overall image clearly light, clean and fresh."
				: "DARK THEME: Hexly deep pine-charcoal #1e2824 and matte surface #27332c. Motifs should remain clearly discernible in muted sage-charcoal midtones around #465547, with soft recessed shadows and restrained grazing edge light. Keep the overall image dark and calm; no white glowing leaves or inverted light-paper look.";
		const prompt = `Create one complete native 1024 x 1024 square decorative material surface for a refined Hexly.ai project archive. This is the ${theme} variant of '${nameEn}' for ${project.title}.\n\nDesign from the following product-specific brief:\n${motif}\n\n${natural ? "ART DIRECTION: Habitat-related botanical impressions on fine matte paper. Give leaves believable shape, veins, folds and shallow tactile relief. Restrained softly faceted construction can echo the Hexly animal family, but this must feel like an exquisite botanical surface rather than a flat SVG outline, stock plant wallpaper or a photograph of a potted plant. Leaves are the main vocabulary. Any permitted flowers stay tiny, sparse and low in chroma. No animal, bird, paw, shell, feather pattern, logo, technical grid or contact trace." : "ART DIRECTION: A believable close-up working material tied to the product. Grain, small grooves, construction edges and shallow impressions should have coherent physical depth, exceptionally restrained diffuse lighting and clean crafted detail. This is a supporting surface, not a centered product rendering or another icon. Do not add ornamental plants, flowers, generic Pi reset circuitry or an unrelated blueprint."}\n\n${palette}\nThe listed hex values are art-direction targets, not printed text. The existing Logo keeps its own colors and is not included in this image. A tiny muted terracotta detail (#bf5c3c light / #e79670 dark) is allowed only when natural to the described material, under one percent of the image. Do not force a red-dot emblem; the surrounding page supplies the family red point.\n\nCOMPOSITION: Quiet asymmetry, generous breathing space. Organize motif groups mainly toward the right and lower outer thirds, with several smaller supporting forms elsewhere; keep the central-left half especially calm for adjacent content. Use the whole native square. Complete primary botanical/material forms should fit comfortably within the canvas with approximately eight percent edge clearance, without a decorative frame. Let fine base grain continue to all edges. This will be displayed once with proportional containment, NOT as a repeating seamless tile.\n\nQUALITY AT REAL SIZE: The surface will often appear at 280-320 CSS pixels. Major leaf veins, grooves and contour lips need enough width and tonal separation to remain visible there: roughly 4-10 native pixels for important features. Aim for readable medium-low contrast rather than almost invisible hairlines. Detail is clear in the full specimen but remains supporting, with shallow soft shadows, no deep black outlines, gloss, clutter, grunge, hard vignette or noisy particles.\n\nNo words, letters, numbers, watermarks, UI, borders, central emblem or additional focal object. No crop is planned afterward: deliver the intended complete square composition directly.\n`;
		await writeFile(`${study}/${theme}/prompt.txt`, prompt);
	}
}
await mkdir(destination, { recursive: true });
const document = {
	schemaVersion: 1,
	recordedAt: new Date().toISOString(),
	siteBaseline: revision,
	catalogueSource: "src/data/projects/index.json",
	catalogueSha256: sha(await readFile("src/data/projects/index.json")),
	scope: "hexly-campaign",
	originalIdentityRecolored: false,
	productUIChanged: false,
	authorization: {
		date: "2026-09-14",
		rawAcceptance: "delegated-to-Codex",
		publication: true,
		quote:
			"su- release Y+1 不验证；然后回顾之前底纹的创作skill，当前只有Pi Agent Policy项目落实了底纹替换，给其他全部项目生成新的底纹（注意根据项目logo类型的设计约束），无须人工确认，全部生成维护到R2，再进行一次Y+1发布，无须人工确认。",
	},
	model: "gpt-image-2.5-flare",
	plannedRequests: 148,
	nativeSize: [1024, 1024],
	existingProjects: 75,
	activeProjects: 55,
	archivedProjects: 20,
	excluded: [
		"Pi Agent Policy: retain the approved pilot",
		"hexly.ai: separate site identity, not a catalogue project",
		"Snail: retired, not present in the current catalogue; keep historical assets",
	],
	tokenSource: {
		path: "src/styles/base.css",
		sha256: sha(await readFile("src/styles/base.css")),
	},
	independentVersions:
		"Texture packs are versioned separately from identity/brand kits. Do not clone or edit existing Logo, font, icon or Hero files.",
	projects: rows,
};
await writeFile(
	`${destination}/inventory.json`,
	`${JSON.stringify(document, null, "\t")}\n`,
);
console.info(
	`Prepared ${directions.size} briefs, 148 exact prompts, and the 75-project protected baseline; no generation calls made.`,
);
