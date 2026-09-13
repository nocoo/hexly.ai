// Pi-only presentation refinement. Run from the repository root before publication:
// bun artwork/brands/pi-agent-policy/v1.0.1/refine.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

const source = "artwork/brands/pi-agent-policy/v1.0.1";
const root = "/brands/pi-agent-policy/v1.0.1";
const output = `public${root}`;
const parentRoot = "/brands/pi-agent-policy/v1.0.0";
const hash = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const readJson = async (path: string) =>
	JSON.parse(await readFile(path, "utf8"));
const recipe = await readJson(`${source}/recipe.json`);
const parentBytes = await readFile(recipe.parentManifest);
assert.equal(hash(parentBytes), recipe.parentManifestSha256);
const parent = JSON.parse(parentBytes.toString());
const parentProvenance = await readJson(`public${parentRoot}/provenance.json`);
assert.equal(recipe.newGenerationCalls, 0);
assert.equal(recipe.project, parent.project);
assert.equal(recipe.brandVersion, "1.0.1");
assert.equal(
	spawnSync("git", ["cat-file", "-e", `HEAD:${output}/manifest.json`], {
		stdio: "ignore",
	}).status === 0,
	false,
	"Committed packages are immutable",
);
const inventory = await readJson("docs/assets/inventory.json");
assert(
	!inventory.files.some((file: { source: string }) =>
		file.source.startsWith(`${output}/`),
	),
	"Inventoried packages are frozen; create another version",
);
assert(!existsSync(output), "Preserve existing output; never overwrite a kit");
await mkdir(output, { recursive: true });
for (const file of parent.files) {
	const bytes = await readFile(`public${file.path}`);
	assert.equal(hash(bytes), file.sha256, file.path);
	await writeFile(`${output}/${basename(file.path)}`, bytes);
}
async function saveJson(name: string, data: unknown) {
	const result = spawnSync(
		"node_modules/.bin/biome",
		["format", "--stdin-file-path=brand.json"],
		{ input: JSON.stringify(data), encoding: "utf8" },
	);
	assert.equal(result.status, 0, result.stderr);
	await writeFile(`${output}/${name}`, result.stdout);
}
const replaceRoot = (data: unknown) =>
	JSON.parse(JSON.stringify(data).replaceAll(parentRoot, root));
const changed = new Set<string>();
const measurements = [];
for (const theme of ["light", "dark"] as const) {
	const svgName = `texture-${theme}.svg`;
	const pngName = `texture-${theme}.png`;
	const original = await readFile(`${output}/${svgName}`, "utf8");
	const scale = parentProvenance.texture.transform.scale;
	const svg = original
		.replace(
			`stroke-width="${1.7 / scale}" opacity=".036"`,
			`stroke-width="${recipe.texture.inkStrokeWidthPx / scale}" opacity="${recipe.texture.inkOpacity}"`,
		)
		.replace(
			`stroke-width="${1.4 / scale}" opacity=".022"`,
			`stroke-width="${recipe.texture.accentStrokeWidthPx / scale}" opacity="${recipe.texture.accentOpacity}"`,
		);
	assert.notEqual(svg, original);
	assert(!svg.includes('opacity=".036"') && !svg.includes('opacity=".022"'));
	assert.deepEqual(svg.match(/d="[^"]*"/g), original.match(/d="[^"]*"/g));
	await writeFile(`${output}/${svgName}`, svg);
	await sharp(Buffer.from(svg)).png().toFile(`${output}/${pngName}`);
	const { data, info } = await sharp(`${output}/${pngName}`)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	let clear = 512;
	let maxAlpha = 0;
	let visiblePixels = 0;
	for (let y = 0; y < info.height; y++)
		for (let x = 0; x < info.width; x++) {
			const alpha = data[(y * info.width + x) * 4 + 3] ?? 0;
			maxAlpha = Math.max(maxAlpha, alpha);
			if (alpha) clear = Math.min(clear, x, y, 511 - x, 511 - y);
			if (alpha >= 16) visiblePixels++;
		}
	assert(clear >= recipe.texture.minimumClearPerimeterPx);
	assert(maxAlpha >= 70 && maxAlpha <= 150);
	measurements.push({
		theme,
		clearPerimeterPx: clear,
		maxAlpha,
		visiblePixels,
	});
	changed.add(svgName).add(pngName);
}
const tokens = await readJson(`${output}/tokens.json`);
tokens.texture = recipe.texture;
await saveJson("tokens.json", tokens);
changed.add("tokens.json");

const provenance = replaceRoot(parentProvenance);
provenance.brandVersion = recipe.brandVersion;
provenance.texture.description = recipe.texture.description;
provenance.texture.presentation = recipe.texture;
provenance.inheritedFrom = {
	manifest: recipe.parentManifest,
	manifestSha256: recipe.parentManifestSha256,
	sourceBuild: parentProvenance.build,
	note: "Exact identities, Hero images, typography, fonts and historical records inherited. Only support texture visibility and specimen presentation are refined; no new generation or product adoption.",
};
provenance.build = {
	...parentProvenance.build,
	baseline: recipe.siteBaseline,
	recipe: `${source}/recipe.json`,
	recipeSha256: hash(await readFile(`${source}/recipe.json`)),
	tool: `${source}/refine.ts`,
	toolSha256: hash(await readFile(`${source}/refine.ts`)),
};
await saveJson("provenance.json", provenance);
changed.add("provenance.json");

let guide = await readFile(`${output}/guide.md`, "utf8");
guide = guide
	.replace("campaign archive 1.0.0", "campaign archive 1.0.1")
	.replaceAll(parentRoot, root)
	.replace("Brand version 1.0.0", "Brand version 1.0.1")
	.replace(
		"The full motif linework is normalized into a 512px tile with a transparent 40px perimeter. Ink opacity is 3.6%; accent is 2.2%. Both are decorative, repeatable and subordinate to text. Use 360–480 CSS px tiles in archives.",
		"The complete motif is preserved in a transparent 512px tile with at least 36px clear perimeter. Ink strokes are 4.8px at 30% opacity; accent strokes are 3px at 25%. At the 256 CSS px specimen scale they read as 2.4px and 1.5px lines. Show one full tile height and stack specimens on narrow screens. For text-bearing surfaces use 45% layer strength (a 55% surface-color veil); never dim the text itself. These are decorative patterns, not status indicators. Keep text at WCAG AA contrast.",
	);
guide += `\n## Presentation refinement 1.0.1\n\nThis Pi Agent Policy pilot changes support textures and their specimen layout only. The approved Logo, application icons, wordmark, original Hero images and source adoption remain byte-identical to 1.0.0. Hero images retain the earlier quieter texture. The independent project identity remains 1.0.0; no source-repository update is required. No other project's presentation is changed.\n\n[Previous immutable package](../v1.0.0/manifest.json), SHA-256 \`${recipe.parentManifestSha256}\`. The historical source recipe and exporter hashes remain verifiable through provenance.json.\n`;
await writeFile(`${output}/guide.md`, guide);
changed.add("guide.md");

let html = await readFile(`${output}/review.html`, "utf8");
for (const label of ["specimens", "archive /", "Version", "Campaign archive"])
	html = html.replaceAll(`${label} 1.0.0`, `${label} 1.0.1`);
html = html.replace(
	parentProvenance.texture.description.en,
	recipe.texture.description.en,
);
await writeFile(`${output}/review.html`, html);
const css = await readFile(`${output}/review.css`, "utf8");
await writeFile(
	`${output}/review.css`,
	`${css}\n/* Pi Agent Policy 1.0.1: show the complete repeat at readable line weight. */\n.textures > figure > div { height: 256px; background-size: 256px 256px; background-position: center; }\n@media (max-width: 640px) { .pair.textures { grid-template-columns: minmax(0, 1fr); } }\n`,
);
const formattedCss = spawnSync(
	"node_modules/.bin/biome",
	["format", "--write", `${output}/review.css`],
	{ encoding: "utf8" },
);
assert.equal(formattedCss.status, 0, formattedCss.stderr);
changed.add("review.html").add("review.css");

const manifest = replaceRoot(parent);
manifest.version = recipe.brandVersion;
manifest.source = source;
manifest.brandBaseline = recipe.siteBaseline;
manifest.sourceAdoption = manifest.sourceAdoption.replace(
	"Brand version 1.0.0",
	"Brand version 1.0.1",
);
for (const file of manifest.files) {
	const name = basename(file.path);
	const bytes = await readFile(`public${file.path}`);
	file.bytes = bytes.length;
	file.sha256 = hash(bytes);
	if (name.startsWith("texture-"))
		file.role =
			"512px transparent seamless authored support texture; preserved contact geometry, clearer 4.8/3px strokes, 30/25% opacity, at least 36px clear perimeter";
	if (!changed.has(name)) {
		const old = parent.files.find(
			(f: { path: string }) => basename(f.path) === name,
		);
		assert.equal(file.sha256, old.sha256, `Protected file changed: ${name}`);
	}
}
await saveJson("manifest.json", manifest);
await writeFile(
	`${source}/verification.json`,
	`${JSON.stringify(
		{
			project: recipe.project,
			version: recipe.brandVersion,
			parentManifestSha256: recipe.parentManifestSha256,
			manifestSha256: hash(await readFile(`${output}/manifest.json`)),
			files: manifest.files.length,
			changedFiles: [...changed].sort(),
			unchangedFiles: parent.files.length - changed.size,
			textures: measurements,
			approvedIdentitySha256: manifest.officialProjectIdentity.sha256,
			newGenerationCalls: 0,
		},
		null,
		"\t",
	)}\n`,
);
console.info(
	`Exported ${root}: ${changed.size} presentation files changed; ${parent.files.length - changed.size} inherited byte-for-byte.`,
);
