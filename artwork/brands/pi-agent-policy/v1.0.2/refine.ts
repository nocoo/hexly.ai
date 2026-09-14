// Author one immutable Pi campaign revision. No image-model call or Logo edit.
// bun artwork/brands/pi-agent-policy/v1.0.2/refine.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

const source = "artwork/brands/pi-agent-policy/v1.0.2";
const root = "/brands/pi-agent-policy/v1.0.2";
const output = `public${root}`;
const previousRoot = "/brands/pi-agent-policy/v1.0.1";
const sha = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));
const recipe = await json(`${source}/recipe.json`);
const parentBytes = await readFile(recipe.parentManifest);
assert.equal(sha(parentBytes), recipe.parentManifestSha256);
assert.equal(recipe.brandVersion, "1.0.2");
assert.equal(recipe.newGenerationCalls, 0);
const parent = JSON.parse(parentBytes.toString());
const inventory = await json("docs/assets/inventory.json");
assert(
	!inventory.files.some((file: { source: string }) =>
		file.source.startsWith(`${output}/`),
	),
	"Inventoried packages are immutable",
);
assert.notEqual(
	spawnSync("git", ["cat-file", "-e", `HEAD:${output}/manifest.json`], {
		stdio: "ignore",
	}).status,
	0,
	"Committed packages are immutable",
);
assert(!existsSync(output), "Preserve existing output; create a new version");
await mkdir(output, { recursive: true });
for (const file of parent.files) {
	const bytes = await readFile(`public${file.path}`);
	assert.equal(sha(bytes), file.sha256, file.path);
	await writeFile(`${output}/${basename(file.path)}`, bytes);
}
async function saveJson(name: string, data: unknown) {
	const formatted = spawnSync(
		"node_modules/.bin/biome",
		["format", "--stdin-file-path=brand.json"],
		{ input: JSON.stringify(data), encoding: "utf8" },
	);
	assert.equal(formatted.status, 0, formatted.stderr);
	await writeFile(`${output}/${name}`, formatted.stdout);
}
const relocate = (data: unknown) =>
	JSON.parse(JSON.stringify(data).replaceAll(previousRoot, root));
const tokens = await json(`${output}/tokens.json`);
const texture = recipe.texture;
const grid = Array.from({ length: 16 }, (_, row) =>
	Array.from(
		{ length: 16 },
		(_, col) =>
			`M${16 + col * 32} ${14 + row * 32}v4 M${14 + col * 32} ${16 + row * 32}h4`,
	).join(" "),
).join(" ");
const layers = [
	{ ...texture.grid, id: "locating-grid", d: grid },
	...texture.layers,
];
const measurements = [];
const changed = new Set<string>();
for (const theme of ["light", "dark"] as const) {
	const colors = tokens.ui[theme];
	const contacts = texture.contacts;
	const reset = texture.reset;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>Pi Agent Policy — ${texture.name.en} / ${theme}</title><desc>${texture.description.en} Authored transparent SVG support texture, not a traced Logo, electrical schematic or status display.</desc><g fill="none" stroke-linejoin="round" stroke-linecap="round">${layers.map((layer) => `<path d="${layer.d}" stroke="${colors[layer.tone]}" stroke-width="${layer.strokeWidth}" opacity="${layer.opacity}"/>`).join("")}<g stroke="${colors.ink}" stroke-width="${contacts.strokeWidth}" opacity="${contacts.opacity}">${contacts.centers.map(([cx, cy]: number[], index: number) => `<circle cx="${cx}" cy="${cy}" r="${contacts.radiusPx[index]}"/>`).join("")}</g><circle cx="${reset.center[0]}" cy="${reset.center[1]}" r="${reset.ringRadiusPx}" stroke="${colors.accent}" stroke-width="${reset.strokeWidth}" opacity="${reset.ringOpacity}"/><circle cx="${reset.center[0]}" cy="${reset.center[1]}" r="${reset.dotRadiusPx}" fill="${colors.accent}" opacity="${reset.dotOpacity}"/></g></svg>`;
	await writeFile(`${output}/texture-${theme}.svg`, svg);
	await sharp(Buffer.from(svg)).png().toFile(`${output}/texture-${theme}.png`);
	const { data } = await sharp(Buffer.from(svg))
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	let clear = 512,
		maxAlpha = 0,
		visiblePixels = 0;
	for (let y = 0; y < 512; y++)
		for (let x = 0; x < 512; x++) {
			const alpha = data[(y * 512 + x) * 4 + 3] ?? 0;
			if (alpha) clear = Math.min(clear, x, y, 511 - x, 511 - y);
			maxAlpha = Math.max(maxAlpha, alpha);
			if (alpha >= 16) visiblePixels++;
		}
	assert(clear >= texture.minimumClearPerimeterPx);
	assert(maxAlpha >= 100 && maxAlpha <= 220);
	measurements.push({
		theme,
		clearPerimeterPx: clear,
		maxAlpha,
		visiblePixels,
	});
	changed.add(`texture-${theme}.svg`).add(`texture-${theme}.png`);
}
tokens.texture = texture;
await saveJson("tokens.json", tokens);
changed.add("tokens.json");
const parentProvenance = await json(`public${previousRoot}/provenance.json`);
const provenance = relocate(parentProvenance);
provenance.brandVersion = recipe.brandVersion;
provenance.generation.madeInThisRelease = false;
provenance.texture = {
	method:
		"Authored native SVG support graphic based on product behavior and an instrument service mat; no new image generation or Logo tracing",
	name: texture.name,
	description: texture.description,
	source: `${source}/recipe.json`,
	sourceSha256: sha(await readFile(`${source}/recipe.json`)),
	productEvidence: recipe.productEvidence,
	layers,
	transform: { scale: 1, x: 0, y: 0 },
	presentation: texture,
};
provenance.inheritedFrom = {
	manifest: recipe.parentManifest,
	manifestSha256: recipe.parentManifestSha256,
	sourceBuild: parentProvenance.build,
	note: "Approved identity, Hero, font, icon and historical generation/adoption bytes inherited unchanged. Earlier packages retain their original motifs. Only the campaign support texture and its descriptions are new.",
};
provenance.build = {
	...parentProvenance.build,
	baseline: recipe.siteBaseline,
	recipe: `${source}/recipe.json`,
	recipeSha256: sha(await readFile(`${source}/recipe.json`)),
	tool: `${source}/refine.ts`,
	toolSha256: sha(await readFile(`${source}/refine.ts`)),
};
await saveJson("provenance.json", provenance);
changed.add("provenance.json");
let guide = await readFile(`${output}/guide.md`, "utf8");
guide = guide
	.replace("campaign archive 1.0.1", "campaign archive 1.0.2")
	.replaceAll(previousRoot, root)
	.replaceAll("Brand version 1.0.1", "Campaign archive 1.0.2")
	.replace(
		/## Texture and colors\n[\s\S]*?(?=Light Hexly campaign surface)/,
		`## Texture and colors\n\n${texture.name.en}. ${texture.description.en}\n\nThe material analogy comes from the product interaction: declared rules, an intercepted tool call and one shared repair allowance. A 32px locating lattice provides the fine surface grain; registration corners and measured ticks suggest a service mat. The open contact and one terracotta return are the larger readable motif. This is decorative campaign artwork, not a hardware schematic or live status. Do not apply this stencil to unrelated tools.\n\nThe transparent tile is 512px, with at least 12px of clear perimeter; the 32px lattice repeats evenly across the seam. At 256 CSS px, the contact and return strokes are 1.8px and 1.5px, while the lattice is 0.9px. Keep the lattice quieter than the contact and the marked return. Show a complete tile height, stack themes on phones, and use the site's 55% surface-color veil with ink text on text-bearing surfaces. Never fade text or bake this background into small marks. Exact native stroke weights/opacities and theme colors are in tokens.json.\n\n`,
	);
guide += `\n## Product-specific surface 1.0.2\n\nAuthored SVG geometry replaces the support texture only; no image-model request or new source adoption. The official identity remains 1.0.0. All 51 unchanged files, including the Hero backgrounds, retain their exact earlier bytes. [Parent archive](../v1.0.1/manifest.json), SHA-256 \`${recipe.parentManifestSha256}\`. The former 1.0.0 and 1.0.1 motifs remain available at their immutable URLs.\n`;
await writeFile(`${output}/guide.md`, guide);
changed.add("guide.md");
let html = await readFile(`${output}/review.html`, "utf8");
for (const label of ["specimens", "archive /", "Version", "Campaign archive"])
	html = html.replaceAll(`${label} 1.0.1`, `${label} 1.0.2`);
html = html
	.replaceAll(parentProvenance.texture.name.en, texture.name.en)
	.replaceAll(parentProvenance.texture.description.en, texture.description.en);
await writeFile(`${output}/review.html`, html);
changed.add("review.html");
const manifest = relocate(parent);
manifest.version = recipe.brandVersion;
manifest.source = source;
manifest.brandBaseline = recipe.siteBaseline;
manifest.sourceAdoption = manifest.sourceAdoption.replace(
	"Brand version 1.0.1",
	"Campaign archive 1.0.2",
);
for (const file of manifest.files) {
	const name = basename(file.path);
	const bytes = await readFile(`public${file.path}`);
	file.bytes = bytes.length;
	file.sha256 = sha(bytes);
	if (name.startsWith("texture-"))
		file.role =
			"512px transparent authored service-mat texture: locating lattice, open contact and a single reset route; independent of official identity";
	if (!changed.has(name))
		assert.equal(
			file.sha256,
			parent.files.find((old: { path: string }) => basename(old.path) === name)
				.sha256,
			`Protected file changed: ${name}`,
		);
}
await saveJson("manifest.json", manifest);
await writeFile(
	`${source}/verification.json`,
	`${JSON.stringify({ project: recipe.project, version: recipe.brandVersion, parentManifestSha256: recipe.parentManifestSha256, manifestSha256: sha(await readFile(`${output}/manifest.json`)), files: manifest.files.length, changedFiles: [...changed].sort(), unchangedFiles: parent.files.length - changed.size, textures: measurements, approvedIdentitySha256: manifest.officialProjectIdentity.sha256, newGenerationCalls: 0 }, null, "\t")}\n`,
);
console.info(
	`Exported ${root}; ${changed.size} presentation files changed, ${parent.files.length - changed.size} exact inherited files.`,
);
