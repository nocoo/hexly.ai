// Export reviewed texture packs without copying or altering identity kits.
// bun .agents/skills/hexly-brand-textures/scripts/export.ts --inventory <batch.json> [--project <id>]
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import {
	assetKey,
	publicUrl,
	readInventory,
} from "../../../../scripts/asset-storage";
import { assetUrl } from "../../../../src/model/assets";
import { textureManifestProblems } from "../../../../src/model/brand-manifest";
import type { Locale, Project } from "../../../../src/model/project";

interface Row {
	id: string;
	title: string;
	archived: boolean;
	action: string;
	root: string;
	version: string;
	study: string;
	officialProjectIdentity: {
		path: string;
		sha256: string;
		rgbaSha256: string;
		source: string;
		bytes: number;
		width: number;
		height: number;
		kind: string;
	};
	existingKit: { root: string; version: string; manifestSha256: string } | null;
	design: {
		identityType: string;
		language: string;
		name: Record<Locale, string>;
		description: Record<Locale, string>;
		motif: string;
		rationale: string;
	};
	productEvidence: {
		source: string;
		purpose: Record<Locale, string>;
		inspectedRevision: string | null;
	};
}
const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		inventory: { type: "string" },
		project: { type: "string", multiple: true },
		output: { type: "string", default: ".video-work/texture-adoptions.json" },
	},
});
assert(values.inventory, "Pass the reviewed batch inventory.");
const batch = JSON.parse(await readFile(values.inventory, "utf8"));
const rows = (batch.projects as Row[]).filter(
	(row) =>
		row.action === "generate" &&
		(!values.project || values.project.includes(row.id)),
);
assert(rows.length);
const frozen = readInventory().files;
const sha = (data: Buffer | string) =>
	createHash("sha256").update(data).digest("hex");
const readJson = async (path: string) =>
	JSON.parse(await readFile(path, "utf8"));
const escapeHtml = (value: string) =>
	value.replace(
		/[&<>"']/g,
		(char) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				char
			] ?? char,
	);
function jsonBytes(value: unknown) {
	const result = spawnSync(
		"node_modules/.bin/biome",
		["format", "--stdin-file-path=texture.json"],
		{
			input: JSON.stringify(value),
			encoding: "utf8",
			maxBuffer: 4 * 1024 * 1024,
		},
	);
	assert.equal(result.status, 0, result.stderr);
	return Buffer.from(result.stdout);
}
const channel = (n: number) => {
	const v = n / 255;
	return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (rgb: number[]) =>
	0.2126 * channel(rgb[0] ?? 0) +
	0.7152 * channel(rgb[1] ?? 0) +
	0.0722 * channel(rgb[2] ?? 0);
function minimumContrast(pixels: Buffer, opacity: number, dark: boolean) {
	const foreground = dark ? [248, 248, 242] : [48, 55, 46];
	const backgrounds = dark
		? [
				[39, 51, 44],
				[52, 67, 53],
			]
		: [
				[248, 248, 242],
				[226, 230, 216],
			];
	const ink = luminance(foreground);
	let minimum = Infinity;
	for (const background of backgrounds)
		for (let i = 0; i < pixels.length; i += 4) {
			const a = (opacity * (pixels[i + 3] ?? 255)) / 255;
			const rgb = [0, 1, 2].map(
				(c) => (pixels[i + c] ?? 0) * a + (background[c] ?? 0) * (1 - a),
			);
			const surface = luminance(rgb);
			minimum = Math.min(
				minimum,
				(Math.max(ink, surface) + 0.05) / (Math.min(ink, surface) + 0.05),
			);
		}
	return minimum;
}
const adoptions: {
	id: string;
	brandTexture: NonNullable<Project["brandTexture"]>;
}[] = [];
for (const row of rows) {
	assert.equal(row.root, `/textures/${row.id}/v${row.version}`);
	const directory = `public${row.root}`;
	if (existsSync(`${directory}/manifest.json`)) {
		const prior = await readJson(`${directory}/manifest.json`);
		for (const file of prior.files)
			assert.equal(
				sha(await readFile(`public${file.path}`)),
				file.sha256,
				`Preserve changed existing export: ${file.path}`,
			);
		assert.equal(
			prior.officialProjectIdentity.sha256,
			row.officialProjectIdentity.sha256,
		);
		adoptions.push({ id: row.id, brandTexture: prior.catalogue });
		console.info(`Preserved prepared pack ${row.id}`);
		continue;
	}
	assert(!existsSync(directory), `Unrecognized existing output: ${directory}`);
	assert(
		!frozen.some((file) => file.source.startsWith(`${directory}/`)),
		"Inventoried packages are immutable",
	);
	const original = await readFile(`public${row.officialProjectIdentity.path}`);
	assert.equal(sha(original), row.officialProjectIdentity.sha256);
	if (row.existingKit)
		assert.equal(
			sha(await readFile(`public${row.existingKit.root}/manifest.json`)),
			row.existingKit.manifestSha256,
		);
	assert.equal(
		sha(await sharp(original).ensureAlpha().raw().toBuffer()),
		row.officialProjectIdentity.rgbaSha256,
	);
	const sources = [];
	for (const theme of ["light", "dark"] as const) {
		const selection = await readJson(`${row.study}/${theme}/selection.json`);
		const run = selection.run as string;
		assert(
			run === `${row.study}/${theme}` ||
				[2, 3, 4].some(
					(attempt) =>
						run ===
						`${row.study}/${theme}-attempt-${String(attempt).padStart(2, "0")}`,
				),
		);
		const raw = await readFile(`${run}/raw.png`);
		const approval = await readJson(`${run}/raw-review.json`);
		const request = await readJson(`${run}/request.json`);
		const response = await readJson(`${run}/response.json`);
		assert.equal(approval.status, "approved");
		assert.equal(approval.imageSha256, sha(raw));
		assert.equal(approval.ownerReviewedExactBytes, false);
		assert.equal(approval.acceptance, "delegated-agent");
		assert.equal(response.status, "succeeded");
		assert.equal(response.outputs.length, 1);
		assert.equal(response.outputs[0].sha256, sha(raw));
		assert.equal(request.parameters.model, "gpt-image-2.5-flare");
		assert.equal(
			request.promptSha256,
			sha(await readFile(`${run}/prompt.txt`)),
		);
		const metadata = await sharp(raw).metadata();
		assert.equal(metadata.width, 1024);
		assert.equal(metadata.height, 1024);
		sources.push({
			theme,
			run,
			raw,
			approval,
			request,
			response,
			pixels: await sharp(raw).ensureAlpha().raw().toBuffer(),
		});
	}
	let opacity = 0.45;
	let contrasts = sources.map((s) =>
		minimumContrast(s.pixels, opacity, s.theme === "dark"),
	);
	while (Math.min(...contrasts) < 4.7 && opacity > 0.25) {
		opacity = Number((opacity - 0.01).toFixed(2));
		contrasts = sources.map((s) =>
			minimumContrast(s.pixels, opacity, s.theme === "dark"),
		);
	}
	assert(
		Math.min(...contrasts) >= 4.7,
		"Review this surface's contrast before export",
	);
	await mkdir(directory, { recursive: true });
	const files = new Map<string, { bytes: Buffer; role: string }>();
	const add = (name: string, bytes: Buffer | string, role: string) =>
		files.set(name, {
			bytes: Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes),
			role,
		});
	for (const source of sources) {
		const prefix = `texture-${source.theme}`;
		add(
			`${prefix}.png`,
			source.raw,
			"Untouched native GPT Image Flare PNG; full canvas and metadata preserved",
		);
		add(
			`${prefix}.webp`,
			await sharp(source.raw).webp({ quality: 90, effort: 6 }).toBuffer(),
			"Full-size 1024-square WebP; complete canvas, no crop or recolor",
		);
		add(
			`${prefix}-320.webp`,
			await sharp(source.raw)
				.resize(320, 320, { fit: "inside", withoutEnlargement: true })
				.webp({ quality: 84, effort: 6 })
				.toBuffer(),
			"320-square lightweight card derivative; complete canvas, no crop or recolor",
		);
		for (const filename of [
			"prompt.txt",
			"request.json",
			"response.json",
			"raw-review.json",
		]) {
			const name =
				filename === "prompt.txt"
					? `${prefix}-prompt.txt`
					: `source-${source.theme}-${filename}`;
			add(
				name,
				await readFile(`${source.run}/${filename}`),
				"Exact archived generation/acceptance record; no credentials",
			);
		}
	}
	const catalogue: NonNullable<Project["brandTexture"]> = {
		root: row.root,
		version: row.version,
		scope: "hexly-campaign",
		name: row.design.name,
		description: row.design.description,
		format: "webp",
		display: "single",
		model: "gpt-image-2.5-flare",
		surfaceOpacity: opacity,
	};
	const generations = sources.map((source) => ({
		theme: source.theme,
		model: source.request.parameters.model,
		provider: "Azure OpenAI",
		requestId: source.response.requestId,
		source: source.run,
		request: `${row.root}/source-${source.theme}-request.json`,
		response: `${row.root}/source-${source.theme}-response.json`,
		prompt: `${row.root}/texture-${source.theme}-prompt.txt`,
		approval: `${row.root}/source-${source.theme}-raw-review.json`,
		raw: {
			path: `${row.root}/texture-${source.theme}.png`,
			sha256: sha(source.raw),
			bytes: source.raw.length,
			width: 1024,
			height: 1024,
		},
		acceptance: "delegated-agent",
		ownerReviewedExactBytes: false,
		crop: false,
		recolor: false,
	}));
	const scope = {
		id: "hexly-campaign",
		productUIChanged: false,
		officialIdentityChanged: false,
		officialIdentityRecolored: false,
		campaignReplacesOfficialIdentity: false,
	};
	const provenance = {
		project: row.id,
		version: row.version,
		scope,
		design: row.design,
		productEvidence: row.productEvidence,
		officialProjectIdentity: row.officialProjectIdentity,
		existingKit: row.existingKit,
		sourceInventory: values.inventory,
		sourceInventorySha256: sha(await readFile(values.inventory)),
		siteBaseline: batch.siteBaseline,
		tokenSource: batch.tokenSource,
		generations,
		rights:
			"Owner-commissioned Azure OpenAI generated decoration under applicable provider terms. No third-party reference image or font was submitted. Existing Logo, font and product rights are unchanged. Do not describe raster output as handmade SVG or assert exclusive trademark rights.",
		delivery: {
			nativeSize: [1024, 1024],
			webpQuality: 90,
			cardSize: [320, 320],
			cardWebpQuality: 84,
			effort: 6,
			crop: false,
			recolor: false,
			repeat: false,
			surfaceOpacity: opacity,
		},
		contrast: {
			method:
				"WCAG relative luminance on every native RGBA pixel composited over actual Hexly normal/hover surfaces, before the left-edge mask. Text remains fully opaque.",
			lightMinimum: contrasts[0],
			darkMinimum: contrasts[1],
			target: 4.7,
		},
		recordedAt: new Date().toISOString(),
		publication:
			"Export-time record. Upload receipts and the site release establish subsequent publication.",
	};
	add(
		"provenance.json",
		jsonBytes(provenance),
		"Design evidence, provider provenance, unchanged identity hashes, derivative and contrast recipe",
	);
	add(
		"brief.md",
		await readFile(`${row.study}/brief.md`),
		"Original product-specific design brief",
	);
	add(
		"license.txt",
		`Hexly campaign texture pack: ${row.title} / ${row.version}\n\nGenerated PNG/WebP: Azure OpenAI gpt-image-2.5-flare, commissioned by the owner under applicable provider terms. Original native PNGs retain their metadata. No third-party reference image or font was submitted. This is generated raster decoration, not a native SVG or hand-drawn artwork; no new exclusive trademark claim is made.\n\nThis pack does not copy or relicense the project Logo, fonts, icons or Hero. Their original bytes, rights and existing kit remain authoritative. The review page uses Hexly's separately licensed Space Grotesk font (SIL OFL 1.1) through the existing site font URL.\n\nAuthored code, prompts, documentation and assembly:\n\n${await readFile("LICENSE", "utf8")}\n`,
		"Generated-output terms, MIT authored material, separate original identity and font rights",
	);
	const guide = `# ${row.title} — ${row.design.name.en}\n\n${row.design.description.en}\n\n${row.design.description.zh}\n\n## Scope\n\nThis v${row.version} texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. Preserve official Logo bytes and colors: ${row.officialProjectIdentity.sha256}.\n\n${row.design.rationale}\n\n## Use\n\nUse texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.\n\nKeep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity ${opacity}, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are ${contrasts[0]?.toFixed(3)}:1 light and ${contrasts[1]?.toFixed(3)}:1 dark, including normal/hover surface colors before the mask.\n\n## Exact generation and reuse\n\nRead texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. The user delegated acceptance for this batch; Codex inspected the raw canvases. No claim is made that the user personally reviewed these bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.\n\nSource batch: ${values.inventory}\nOriginal source study: ${row.study}\nExisting identity kit: ${row.existingKit?.root ?? "None; the archived original/emoji identity is retained."}\n\nOld kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url ${row.root}/manifest.json.\n`;
	add(
		"guide.md",
		guide,
		"Reusable surface and theme guidance, exact generation discovery, independent version maintenance",
	);
	const href = (name: string) =>
		publicUrl({ key: assetKey(`${row.root}/${name}`, "", row.id) });
	const font = assetUrl("/fonts/space-grotesk.woff2");
	add(
		"review.html",
		`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(row.title)} textures · hexly.ai</title><link rel="canonical" href="https://hexly.ai/projects/${row.id}#texture"><style>@font-face{font-family:Space;src:url('${font}') format('woff2');font-weight:100 900;font-display:swap}*{box-sizing:border-box}body{margin:0;padding:clamp(20px,5vw,64px);font-family:Space,system-ui,sans-serif;color:#30372e;background:#f0f0e9}main{max-width:1160px;margin:auto}header{display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:12px}a{color:inherit;text-underline-offset:4px}h1{font-size:clamp(32px,5vw,58px);line-height:1.2;letter-spacing:-.045em;margin:48px 0 20px}p{max-width:760px;line-height:1.8}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:36px 0}figure{margin:0;overflow:hidden;border:1px solid #d4d8cb;border-radius:20px;background:#f8f8f2;color:#30372e}figure.dark{background:#1e2824;color:#e6e9dc}figure img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}figcaption{display:flex;justify-content:space-between;gap:18px;padding:18px;font-size:13px}footer{display:flex;gap:20px;flex-wrap:wrap;margin-top:32px;font-size:13px}.meta{font-size:12px;line-height:1.8}@media(max-width:640px){.pair{grid-template-columns:1fr;gap:20px}header{align-items:flex-start}h1{margin-top:32px}figcaption{flex-wrap:wrap}}@media(prefers-color-scheme:dark){body{color:#e6e9dc;background:#1e2824}figure{border-color:#3d4940}}</style></head><body><main><header><a href="/projects/${row.id}#texture">${escapeHtml(row.title)} ↗</a><span>HEXLY / CAMPAIGN SURFACES / v${row.version}</span></header><h1>${escapeHtml(row.design.name.en)}</h1><p>${escapeHtml(row.design.description.en)}</p><p lang="zh">${escapeHtml(row.design.description.zh)}</p><div class="pair">${sources.map((source) => `<figure class="${source.theme}"><img src="${href(`texture-${source.theme}.webp`)}" crossorigin="anonymous" width="1024" height="1024" alt="${escapeHtml(row.design.name.en)} — ${source.theme} full canvas"><figcaption><span>${source.theme === "light" ? "Paper" : "Night"}</span><a href="${href(`texture-${source.theme}.png`)}" download>Original PNG ↓</a><a href="${href(`texture-${source.theme}-prompt.txt`)}">Exact prompt ↗</a></figcaption></figure>`).join("")}</div><p class="meta">GPT Image Flare · Independent light and dark generations · Complete canvases, no crop or repetition · Official project identity preserved.</p><footer><a href="${href("manifest.json")}">Files &amp; SHA-256</a><a href="${href("guide.md")}">Usage guide</a><a href="${href("provenance.json")}">Generation provenance</a><a href="${href("license.txt")}">License</a></footer></main></body></html>\n`,
		"Responsive whole-canvas review document; material downloads served by R2",
	);
	for (const [name, file] of files)
		await writeFile(`${directory}/${name}`, file.bytes);
	const manifest = {
		$schema: "https://hexly.ai/textures/schema-v1.json",
		schemaVersion: 1,
		kind: "hexly-project-texture",
		project: row.id,
		version: row.version,
		root: row.root,
		canonical: `https://hexly.ai/projects/${row.id}#texture`,
		scope,
		catalogue,
		officialProjectIdentity: row.officialProjectIdentity,
		existingKit: row.existingKit,
		generations,
		files: [...files].map(([name, file]) => ({
			path: `${row.root}/${name}`,
			role: file.role,
			bytes: file.bytes.length,
			sha256: sha(file.bytes),
		})),
	};
	assert.deepEqual(textureManifestProblems(manifest), []);
	await writeFile(`${directory}/manifest.json`, jsonBytes(manifest));
	adoptions.push({ id: row.id, brandTexture: catalogue });
	console.info(
		`Exported ${row.id}: ${files.size} files, opacity ${opacity}; identity and historical kits unchanged.`,
	);
}
await mkdir(dirname(values.output), { recursive: true });
await writeFile(values.output, jsonBytes(adoptions));
