// Assemble an approved raster-texture revision; never call an image model here.
// bun artwork/brands/pi-agent-policy/v1.0.3/refine.ts [--refresh-local]
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

const source = "artwork/brands/pi-agent-policy/v1.0.3";
const root = "/brands/pi-agent-policy/v1.0.3";
const previousRoot = "/brands/pi-agent-policy/v1.0.2";
const output = `public${root}`;
const sha = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));
const recipe = await json(`${source}/recipe.json`);
const parentBytes = await readFile(recipe.parentManifest);
assert.equal(sha(parentBytes), recipe.parentManifestSha256);
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
if (existsSync(output)) {
	assert(
		process.argv.includes("--refresh-local"),
		"Existing output needs an explicit local refresh",
	);
	const prior = await json(`${output}/manifest.json`);
	assert.equal(prior.source, source);
	const names = new Set([
		"manifest.json",
		...prior.files.map((file: { path: string }) => basename(file.path)),
	]);
	for (const name of await readdir(output))
		assert(names.has(name), `Unknown file: ${name}`);
	for (const file of prior.files)
		assert.equal(
			sha(await readFile(`public${file.path}`)),
			file.sha256,
			`Changed local output: ${file.path}`,
		);
}
await mkdir(output, { recursive: true });
const roles = new Map<string, string>();
const changed = new Set<string>();
for (const file of parent.files) {
	const bytes = await readFile(`public${file.path}`);
	assert.equal(sha(bytes), file.sha256, file.path);
	const name = basename(file.path);
	if (/^texture-.*\.svg$/.test(name)) continue;
	await writeFile(`${output}/${name}`, bytes);
	roles.set(name, file.role);
}
async function saveJson(name: string, data: unknown) {
	const result = spawnSync(
		"node_modules/.bin/biome",
		["format", "--stdin-file-path=brand.json"],
		{ input: JSON.stringify(data), encoding: "utf8" },
	);
	assert.equal(result.status, 0, result.stderr);
	await writeFile(`${output}/${name}`, result.stdout);
	changed.add(name);
}
const relocate = (data: unknown) =>
	JSON.parse(JSON.stringify(data).replaceAll(previousRoot, root));
const generations = [];
for (const theme of ["light", "dark"]) {
	const run = `${recipe.study}/${theme}`;
	const raw = await readFile(`${run}/raw.png`);
	const approval = await json(`${run}/raw-review.json`);
	const request = await json(`${run}/request.json`);
	const response = await json(`${run}/response.json`);
	assert.equal(approval.status, "approved");
	assert.equal(approval.imageSha256, sha(raw));
	assert.equal(response.outputs[0].sha256, sha(raw));
	assert.equal(request.parameters.model, recipe.texture.model);
	assert.equal(request.promptSha256, sha(await readFile(`${run}/prompt.txt`)));
	const metadata = await sharp(raw).metadata();
	assert.equal(metadata.width, 1024);
	assert.equal(metadata.height, 1024);
	await writeFile(`${output}/texture-${theme}.png`, raw);
	await sharp(raw)
		.webp({ quality: recipe.texture.webpQuality, effort: 6 })
		.toFile(`${output}/texture-${theme}.webp`);
	for (const format of ["png", "webp"]) {
		const name = `texture-${theme}.${format}`;
		roles.set(
			name,
			`${format === "png" ? "Untouched native GPT Image Flare PNG" : "Full-canvas WebP delivery derivative"}; ${theme} decorative surface, not seamless, not a Logo or native SVG`,
		);
		changed.add(name);
	}
	for (const file of [
		"prompt.txt",
		"request.json",
		"response.json",
		"raw-review.json",
	]) {
		const name =
			file === "prompt.txt"
				? `texture-${theme}-prompt.txt`
				: `source-texture-${theme}-${file}`;
		await writeFile(`${output}/${name}`, await readFile(`${run}/${file}`));
		roles.set(
			name,
			`Exact ${theme} decorative-image generation/approval record; independent of the historical Logo generation`,
		);
		changed.add(name);
	}
	generations.push({
		theme,
		requestId: response.requestId,
		request: `${run}/request.json`,
		response: `${run}/response.json`,
		approval: `${run}/raw-review.json`,
		raw: {
			path: `${run}/raw.png`,
			export: `${root}/texture-${theme}.png`,
			sha256: sha(raw),
			bytes: raw.length,
			width: 1024,
			height: 1024,
		},
		crop: false,
		recolor: false,
	});
}
const texture = {
	...recipe.texture,
	method: "gpt-image",
	newGenerationCalls: 2,
	generations,
};
const tokens = await json(`${output}/tokens.json`);
tokens.texture = texture;
await saveJson("tokens.json", tokens);
const oldProvenance = await json(`public${previousRoot}/provenance.json`);
const provenance = relocate(oldProvenance);
provenance.brandVersion = recipe.brandVersion;
provenance.texture = {
	...texture,
	source: `${source}/recipe.json`,
	sourceSha256: sha(await readFile(`${source}/recipe.json`)),
	productEvidence: oldProvenance.texture.productEvidence,
};
provenance.inheritedFrom = {
	manifest: recipe.parentManifest,
	manifestSha256: recipe.parentManifestSha256,
	sourceBuild: oldProvenance.build,
	note: "Identity, Heroes, icons, fonts and original Logo generation/adoption records retain exact parent bytes. Only decorative surface material and its documentation change.",
};
provenance.build = {
	...oldProvenance.build,
	baseline: recipe.siteBaseline,
	recipe: `${source}/recipe.json`,
	recipeSha256: sha(await readFile(`${source}/recipe.json`)),
	tool: `${source}/refine.ts`,
	toolSha256: sha(await readFile(`${source}/refine.ts`)),
};
await saveJson("provenance.json", provenance);
const surfaceGuide = `${recipe.texture.name.en}. ${recipe.texture.description.en}\n\nTwo owner-approved, independently generated Azure OpenAI gpt-image-2.5-flare PNGs provide the light/dark material. PNG downloads preserve untouched native 1024 × 1024 bytes; WebP files are complete-canvas delivery encodings with no crop, recolor, tracing or upscale. This is generated raster decoration, not authored SVG. Prompts, sanitized request/response metadata, actual request IDs, usage and exact-byte approvals are included.\n\nThe grooves meet the top edge. Use a single complete surface with background-repeat: no-repeat and proportional containment; never call these seamless tiles. The site shows square specimens and one contained background on text-bearing regions, under a 55% surface-color veil. Keep text fully opaque and verify contrast. Preserve the approved Logo and never bake this texture into navigation or favicon marks. Existing Hero images retain their prior complete artwork bytes.\n\n`;
let guide = await readFile(`${output}/guide.md`, "utf8");
guide = guide
	.replaceAll(previousRoot, root)
	.replaceAll("campaign archive 1.0.2", "campaign archive 1.0.3")
	.replaceAll("Campaign archive 1.0.2", "Campaign archive 1.0.3")
	.replace(
		/## Texture and colors\n[\s\S]*?(?=Light Hexly campaign surface)/,
		`## Texture and colors\n\n${surfaceGuide}`,
	)
	.replace(/\n## Product-specific surface 1\.0\.2[\s\S]*$/, "");
guide += `\n## Generated service surface 1.0.3\n\nThe official identity stays at 1.0.0. Parent campaign 1.0.2 and every earlier version remain immutable. The new surface was approved for local page review; publication is a separate operation. See source-texture-light-raw-review.json and source-texture-dark-raw-review.json.\n`;
await writeFile(`${output}/guide.md`, guide);
changed.add("guide.md");
let license = await readFile(`${output}/license.txt`, "utf8");
license = license
	.replace(
		"Brand archive: Pi Agent Policy / 1.0.0",
		"Brand archive: Pi Agent Policy / 1.0.3",
	)
	.replace("recipes, text and support textures", "recipes and text");
license +=
	"\nThe 1.0.3 decorative surfaces are Azure OpenAI gpt-image-2.5-flare outputs, commissioned by the owner under the applicable provider terms. No third-party image or font was submitted. They are raster material studies, not hand-authored SVG and not covered by a new assertion of exclusive trademark rights. Historical Logo and font licenses remain unchanged.\n";
await writeFile(`${output}/license.txt`, license);
changed.add("license.txt");
let html = await readFile(`${output}/review.html`, "utf8");
html = html
	.replaceAll("1.0.2", "1.0.3")
	.replaceAll(oldProvenance.texture.name.en, recipe.texture.name.en)
	.replaceAll(
		oldProvenance.texture.description.en,
		recipe.texture.description.en,
	)
	.replaceAll("./texture-light.svg", "./texture-light.webp")
	.replaceAll("./texture-dark.svg", "./texture-dark.webp")
	.replaceAll(
		/href="\.\/texture-(light|dark)\.webp"/g,
		'href="./texture-$1.png"',
	)
	.replaceAll("seamless SVG", "native PNG")
	.replaceAll("Seamless texture", "Generated surface PNG");
html = html.replace(
	'<div class="pair textures">',
	`<p class="caption">GPT Image Flare · Full-canvas raster surfaces · <a href="./texture-light-prompt.txt">Paper prompt</a> · <a href="./texture-dark-prompt.txt">Night prompt</a></p><div class="pair textures">`,
);
await writeFile(`${output}/review.html`, html);
changed.add("review.html");
let css = await readFile(`${output}/review.css`, "utf8");
css = css
	.replaceAll("texture-light.svg", "texture-light.webp")
	.replaceAll("texture-dark.svg", "texture-dark.webp");
css +=
	"\n/* Complete approved raster canvases; never repeat or crop. */\n.textures > figure > div { height: auto; aspect-ratio: 1; background-size: contain; background-repeat: no-repeat; background-position: center; }\n";
const formattedCss = spawnSync(
	"node_modules/.bin/biome",
	["format", "--stdin-file-path=review.css"],
	{ input: css, encoding: "utf8" },
);
assert.equal(formattedCss.status, 0, formattedCss.stderr);
await writeFile(`${output}/review.css`, formattedCss.stdout);
changed.add("review.css");
const manifest = relocate(parent);
manifest.version = recipe.brandVersion;
manifest.source = source;
manifest.brandBaseline = recipe.siteBaseline;
manifest.texture = texture;
manifest.sourceAdoption = manifest.sourceAdoption.replace(
	"Campaign archive 1.0.2",
	"Campaign archive 1.0.3",
);
manifest.files = [];
for (const [name, role] of roles) {
	const bytes = await readFile(`${output}/${name}`);
	manifest.files.push({
		path: `${root}/${name}`,
		role,
		bytes: bytes.length,
		sha256: sha(bytes),
	});
	if (!changed.has(name))
		assert.equal(
			sha(bytes),
			parent.files.find(
				(file: { path: string }) => basename(file.path) === name,
			).sha256,
			name,
		);
}
await saveJson("manifest.json", manifest);
await writeFile(
	`${source}/verification.json`,
	`${JSON.stringify({ project: recipe.project, version: recipe.brandVersion, parentManifestSha256: recipe.parentManifestSha256, manifestSha256: sha(await readFile(`${output}/manifest.json`)), files: manifest.files.length, changedFiles: [...changed].sort(), approvedIdentitySha256: manifest.officialProjectIdentity.sha256, generatedSurfaces: generations, newGenerationCalls: 2, published: false }, null, "\t")}\n`,
);
console.info(
	`Prepared ${root}: ${manifest.files.length} files; approved identity preserved; two approved full-canvas Flare surfaces.`,
);
