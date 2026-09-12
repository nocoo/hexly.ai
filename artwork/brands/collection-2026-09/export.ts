// Brand collection 2026-09. Run from the repository root; never overwrite a committed kit.
// bun artwork/brands/collection-2026-09/export.ts [project-id ...]
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import sharp from "sharp";
import { palettes } from "../../../packages/video-kit/src/brand";
import { readProjects } from "../../../src/data/read-projects";
import type { Project } from "../../../src/model/project";

const collection = "artwork/brands/collection-2026-09";
const inventory = JSON.parse(
	await readFile("docs/brand-archives/inventory-0.10.0.json", "utf8"),
);
const targets = new Set<string>(
	inventory.projects
		.filter((p: { scope: string }) => p.scope === "target")
		.map((p: { id: string }) => p.id),
);
const requested = process.argv.slice(2);
for (const id of requested)
	if (!targets.has(id))
		throw new Error(`Outside the approved inventory: ${id}`);
const projects = readProjects().filter(
	(p) => targets.has(p.id) && (!requested.length || requested.includes(p.id)),
);
const hash = (bytes: Buffer | string) =>
	createHash("sha256").update(bytes).digest("hex");
const xml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll('"', "&quot;");
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const sizes = [1024, 512, 256, 128, 64, 48, 32, 24, 16];
const fontRoot = "packages/video-kit/public/video-kit/1.0.0/hexly";

function format(name: string, text: string) {
	// The repository intentionally leaves HTML formatting disabled in Biome.
	if (name.endsWith(".html")) return `${text}\n`;
	const result = spawnSync(
		"node_modules/.bin/biome",
		["format", `--stdin-file-path=${name}`],
		{ input: text, encoding: "utf8" },
	);
	if (result.status !== 0) throw new Error(result.stderr);
	return result.stdout;
}
function json(value: unknown) {
	return format("brand.json", `${JSON.stringify(value, null, "\t")}\n`);
}
function svg(width: number, height: number, body: string) {
	return Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`,
	);
}
async function pixelRecord(bytes: Buffer) {
	const { data, info } = await sharp(bytes)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const edges = { top: 0, right: 0, bottom: 0, left: 0 };
	for (let x = 0; x < info.width; x++) {
		if ((data[x * 4 + 3] ?? 0) >= 16) edges.top++;
		if ((data[((info.height - 1) * info.width + x) * 4 + 3] ?? 0) >= 16)
			edges.bottom++;
	}
	for (let y = 0; y < info.height; y++) {
		if ((data[y * info.width * 4 + 3] ?? 0) >= 16) edges.left++;
		if ((data[(y * info.width + info.width - 1) * 4 + 3] ?? 0) >= 16)
			edges.right++;
	}
	return {
		width: info.width,
		height: info.height,
		channels: info.channels,
		rgbaSha256: hash(data),
		edgePixels: edges,
	};
}
async function ico(images: Buffer[], resolutions: number[]) {
	const header = Buffer.alloc(6 + images.length * 16);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(images.length, 4);
	let offset = header.length;
	for (const [i, bytes] of images.entries()) {
		const entry = 6 + i * 16;
		const size = resolutions[i];
		if (!size) throw new Error("Missing ICO size");
		header[entry] = header[entry + 1] = size === 256 ? 0 : size;
		header.writeUInt16LE(1, entry + 4);
		header.writeUInt16LE(32, entry + 6);
		header.writeUInt32LE(bytes.length, entry + 8);
		header.writeUInt32LE(offset, entry + 12);
		offset += bytes.length;
	}
	return Buffer.concat([header, ...images]);
}

for (const project of projects) {
	const family = project.family;
	if (!family) throw new Error(`Missing existing family: ${project.id}`);
	const source = `artwork/brands/${project.id}/v1.0.0`;
	const root = `/brands/${project.id}/v1.0.0`;
	const output = `public${root}`;
	if (
		spawnSync("git", ["cat-file", "-e", `HEAD:${output}/manifest.json`], {
			stdio: "ignore",
		}).status === 0
	)
		throw new Error(`Committed kit is immutable: ${output}`);
	const recipe = JSON.parse(await readFile(`${source}/recipe.json`, "utf8"));
	const row = inventory.projects.find(
		(p: { id: string }) => p.id === project.id,
	);
	const study = row.sourceArchive;
	const original = await readFile(`public${project.logo.original}`);
	const foreground = await readFile(`public${family.foreground.original}`);
	if (
		hash(original) !== project.logo.sha256 ||
		hash(foreground) !== family.foreground.sha256 ||
		hash(foreground) !== recipe.foreground.sha256
	)
		throw new Error(`Protected source identity changed: ${project.id}`);
	if (
		recipe.scope.id !== "hexly-campaign" ||
		recipe.newGenerationCalls !== 0 ||
		recipe.campaignInterpretation.replacementOfOfficialIdentity !== false
	)
		throw new Error(`Invalid publication scope: ${project.id}`);
	const originalPixels = await pixelRecord(original);
	const foregroundPixels = await pixelRecord(foreground);
	const entry =
		recipe.hero.layout === "portrait" || foregroundPixels.edgePixels.bottom > 0;
	const originalName = `official-logo${extname(project.logo.original)}`;
	const files: { name: string; role: string }[] = [];
	await mkdir(output, { recursive: true });
	async function save(name: string, data: Buffer | string, role: string) {
		await writeFile(`${output}/${name}`, data);
		files.push({ name, role });
	}
	function texture(theme: "light" | "dark") {
		const t = recipe.pattern.transform;
		const paths = (highlight: boolean) =>
			recipe.pattern.layers
				.filter(
					(layer: { tone: string }) =>
						(layer.tone === "highlight") === highlight,
				)
				.map((layer: { d: string }) => `<path d="${xml(layer.d)}"/>`)
				.join("");
		return svg(
			512,
			512,
			`<title>${xml(project.title)} — ${xml(recipe.pattern.name.en)} / ${theme}</title><desc>Authored seamless supporting texture. Original project-specific motif linework; this is not a vectorized logo.</desc><g transform="translate(${t.x} ${t.y}) scale(${t.scale})" fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="${palettes[theme].ink}" stroke-width="${1.7 / t.scale}" opacity=".036">${paths(false)}</g><g stroke="${palettes[theme].accent}" stroke-width="${1.4 / t.scale}" opacity=".022">${paths(true)}</g></g>`,
		);
	}
	const wordmarkSource = await readFile(`${source}/wordmark.svg`, "utf8");
	const wordmarkMeta = await sharp(Buffer.from(wordmarkSource)).metadata();
	if (!wordmarkMeta.width || !wordmarkMeta.height)
		throw new Error("Missing outlined type dimensions");
	const lockupHeight = 416;
	const typeHeight = 144;
	const typeWidth = Math.round(
		(wordmarkMeta.width / wordmarkMeta.height) * typeHeight,
	);
	const lockupWidth = 432 + typeWidth + 24;
	const minWordmark = Math.ceil(
		(wordmarkMeta.width / wordmarkMeta.height) * 24,
	);
	const minLockup = Math.max(160, Math.ceil((lockupWidth / typeHeight) * 18));
	const framing = entry
		? "Keep the existing portrait's natural frame entry. The full square is placed against the baseline; no anatomy is extended, trimmed or masked."
		: "Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail.";
	const guidelines: NonNullable<Project["brandKit"]>["guidelines"] = [
		{
			title: { en: "Identity keeps its colors", zh: "身份保留原色" },
			description: {
				en: "Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.",
				zh: "项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。",
			},
		},
		{
			title: { en: "A complete composition", zh: "保留完整构图" },
			description: {
				en: `${framing} Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.`,
				zh: `${entry ? "保留原头像自然入框的边界，将完整方形画布贴齐基线；不补画、不截取解剖结构。" : "保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。"}独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。`,
			},
		},
		{
			title: { en: "A mark, not a tile", zh: "小标志不用底板" },
			description: {
				en: `Navigation 24px preferred, 16px minimum. Wordmark ≥${minWordmark}px wide; lockup ≥${minLockup}px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.`,
				zh: `导航推荐 24px，最小 16px。字标宽度至少 ${minWordmark}px，组合至少 ${minLockup}px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。`,
			},
		},
	];
	await save(
		originalName,
		original,
		"Official/source project identity, exact preserved bytes and original colors; not recolored for Hexly",
	);
	await save(
		"logo.png",
		foreground,
		"Existing Hexly family foreground at its true native resolution; exact bytes, separate from official identity when different",
	);
	await save(
		"white.png",
		await readFile(`public${family.root}/white.png`),
		"Historical white-field presentation retained byte for byte",
	);
	for (const size of sizes) {
		if (size > family.foreground.width) continue;
		await save(
			`mark-${size}.png`,
			await sharp(foreground).resize(size).png().toBuffer(),
			`${size}px complete transparent campaign foreground, uniformly downsampled; no recoloring or masking`,
		);
	}
	const heroPlacements: Record<string, unknown> = {};
	for (const theme of ["light", "dark"] as const) {
		const colors = palettes[theme];
		const pattern = texture(theme);
		await save(
			`texture-${theme}.svg`,
			pattern,
			"512px seamless authored texture from the project's own motif geometry; distinct from the raster identity",
		);
		await save(
			`texture-${theme}.png`,
			await sharp(pattern).png().toBuffer(),
			"512px transparent texture raster; 40px clear perimeter, ≤5.8% combined layer opacity",
		);
		await save(
			`mark-${theme}.png`,
			foreground,
			"Exact same campaign foreground in both themes, original colors and proportions",
		);
		await save(
			`logo-${theme}.png`,
			await sharp(foreground)
				.resize(Math.min(1024, family.foreground.width))
				.png()
				.toBuffer(),
			"Transparent web mark, no upscale beyond native artwork",
		);
		const wordmark = wordmarkSource.replace(
			'fill="#30372e"',
			`fill="${colors.ink}"`,
		);
		await save(
			`wordmark-${theme}.svg`,
			wordmark,
			"Unmodified actual Space Grotesk 600 glyph outlines; full descenders; Hexly campaign typography under OFL",
		);
		const lockup = await sharp({
			create: {
				width: lockupWidth,
				height: lockupHeight,
				channels: 4,
				background: transparent,
			},
		})
			.composite([
				{
					input: await sharp(foreground).resize(384).png().toBuffer(),
					left: 16,
					top: 16,
				},
				{
					input: await sharp(Buffer.from(wordmark))
						.resize(typeWidth, typeHeight)
						.png()
						.toBuffer(),
					left: 432,
					top: Math.floor((lockupHeight - typeHeight) / 2),
				},
			])
			.png()
			.toBuffer();
		await save(
			`lockup-${theme}.png`,
			lockup,
			"Transparent campaign lockup: unchanged raster identity plus licensed outlined type; not native SVG artwork",
		);
		const iconSize = family.foreground.width;
		const icon =
			theme === "light"
				? await readFile(`public${family.root}/icon.png`)
				: await sharp({
						create: {
							width: iconSize,
							height: iconSize,
							channels: 4,
							background: colors.page,
						},
					})
						.composite([
							{ input: await sharp(pattern).resize(iconSize).png().toBuffer() },
							{ input: foreground },
						])
						.png()
						.toBuffer();
		await save(
			`icon-${theme}.png`,
			icon,
			theme === "light"
				? "Existing approved square presentation bytes (some historical exports are declared upscales); platform supplies masking"
				: "Night presentation of the exact native foreground; independent Hexly theme surface, no animal recoloring",
		);
		await save(
			`icon-${theme}-512.png`,
			await sharp(icon).resize(512).png().toBuffer(),
			"512px square app presentation; use the transparent mark for navigation",
		);
		// Each canvas is laid out independently. Never resize-to-cover or crop artwork.
		for (const square of [false, true]) {
			const width = square ? 1024 : 2400;
			const height = square ? 1024 : 960;
			const artSize = square
				? entry
					? Math.min(960, family.foreground.width)
					: Math.min(864, family.foreground.width)
				: entry
					? Math.min(960, family.foreground.width)
					: Math.min(880, family.foreground.width);
			const artLeft = entry
				? width - artSize
				: square
					? Math.round((width - artSize) / 2)
					: 1400;
			const artTop = entry
				? height - artSize
				: square
					? 120
					: Math.round((height - artSize) / 2);
			const stage =
				recipe.hero.layout === "object"
					? square
						? { x: 64, y: 96, width: 896, height: 864, radius: 48 }
						: { x: 1376, y: 96, width: 904, height: 768, radius: 64 }
					: null;
			const layers: sharp.OverlayOptions[] = [{ input: pattern, tile: true }];
			if (stage)
				layers.push({
					input: svg(
						width,
						height,
						`<rect x="${stage.x}" y="${stage.y}" width="${stage.width}" height="${stage.height}" rx="${stage.radius}" fill="${palettes.light.soft}" opacity="${theme === "light" ? ".65" : ".94"}"/>`,
					),
				});
			layers.push({
				input: await sharp(foreground).resize(artSize).png().toBuffer(),
				left: artLeft,
				top: artTop,
			});
			if (!square) {
				const wordWidth = Math.min(
					1110,
					Math.round((wordmarkMeta.width / wordmarkMeta.height) * 186),
				);
				layers.push({
					input: await sharp(Buffer.from(wordmark))
						.resize(wordWidth)
						.png()
						.toBuffer(),
					left: 112,
					top: entry ? 350 : 328,
				});
				layers.push({
					input: svg(
						width,
						height,
						`<circle cx="136" cy="270" r="9" fill="${colors.accent}"/><path d="M172 270h324M136 690h968" fill="none" stroke="${colors.line}" stroke-width="1.5"/>`,
					),
				});
			}
			const frame = await sharp({
				create: { width, height, channels: 4, background: colors.page },
			})
				.composite(layers)
				.png()
				.toBuffer();
			const name = `hero${square ? "-square" : ""}${theme === "dark" ? "-dark" : ""}`;
			await save(
				`${name}.webp`,
				await sharp(frame).webp({ quality: 90, effort: 5 }).toBuffer(),
				`${width}×${height} complete ${theme} campaign canvas; authored composition, no new generation, no crop`,
			);
			if (!square)
				await save(
					`${name}.png`,
					frame,
					"Lossless authored campaign Hero; not a native GPT Image output and not a replacement project logo",
				);
			heroPlacements[square ? "square" : "wide"] = {
				width,
				height,
				artworkSize: artSize,
				left: artLeft,
				top: artTop,
				scale: artSize / family.foreground.width,
				crop: false,
				recolor: false,
				entry,
				paperStage: stage,
			};
		}
	}
	const icoSizes = [16, 32, 48, 64, 128, 256];
	await save(
		"favicon.ico",
		await ico(
			await Promise.all(
				icoSizes.map((size) => readFile(`${output}/mark-${size}.png`)),
			),
			icoSizes,
		),
		"Real ICO, six PNG-backed transparent campaign entries: 16/32/48/64/128/256px",
	);
	const lightIcon = await readFile(`${output}/icon-light.png`);
	await save(
		"apple-touch-icon.png",
		await sharp(lightIcon)
			.resize(180)
			.flatten({ background: palettes.light.page })
			.png()
			.toBuffer(),
		"180px opaque Apple touch presentation; platform masks the square",
	);
	await save(
		"icon-192.png",
		await sharp(lightIcon).resize(192).png().toBuffer(),
		"192px PWA presentation, purpose any",
	);
	for (const [file, path] of [
		["space-grotesk.woff2", `${fontRoot}/space-grotesk.woff2`],
		["space-grotesk-ofl.txt", `${fontRoot}/space-grotesk-OFL.txt`],
		["geist-mono.woff2", `${fontRoot}/geist-mono.woff2`],
		["geist-mono-ofl.txt", `${fontRoot}/geist-mono-OFL.txt`],
		["hexly-mark.svg", "public/brands/snail/v2.0.0/hexly-mark.svg"],
	] as const)
		await save(
			file,
			await readFile(path),
			"Exact licensed site resource; unchanged bytes, no recreated brand geometry",
		);
	const officialIdentity = {
		role: "official-project-identity",
		path: project.logo.original,
		export: `${root}/${originalName}`,
		sha256: hash(original),
		bytes: original.length,
		...originalPixels,
		sourceUrl: project.logo.sourceUrl,
		sourceRepositoryRevision: project.source.repositoryRevision,
		modified: false,
	};
	const campaign = {
		role: "hexly-campaign-interpretation",
		path: family.foreground.original,
		export: `${root}/logo.png`,
		sha256: hash(foreground),
		bytes: foreground.length,
		...foregroundPixels,
		sameBytesAsOfficial: hash(foreground) === hash(original),
		sourceMethod: family.method ?? "gpt-image-2",
		series: family.series ?? "animal",
		sourceAdoptionStatus: family.status,
		replacesOfficialIdentity: false,
		newGenerationCalls: 0,
	};
	const scope = {
		id: "hexly-campaign",
		appliesTo: recipe.scope.appliesTo,
		productUIChanged: false,
		officialIdentityRecolored: false,
		campaignReplacesOfficialIdentity: false,
	};
	const tokens = {
		scope,
		ui: {
			source: "src/styles/base.css",
			baseline: inventory.baseline,
			...palettes,
		},
		font: { ...recipe.typography, source: "space-grotesk.woff2" },
		artwork: {
			minimumMarkPx: 16,
			preferredNavigationPx: 24,
			minimumWordmarkWidthPx: minWordmark,
			minimumLockupWidthPx: minLockup,
			preserveOriginalColors: true,
			palette: family.palette,
			paletteScope:
				"Evidence from archived artwork, not a product UI theme prescription",
		},
		texture: {
			tile: [512, 512],
			inkOpacity: 0.036,
			accentOpacity: 0.022,
			recommendedTileCssPx: [360, 480],
			decorative: true,
		},
		productUI: {
			action: "unchanged",
			source: `src/data/projects/${project.id}.json at ${inventory.baseline}`,
		},
	};
	await save(
		"tokens.json",
		json(tokens),
		"Hexly campaign-only tokens; official artwork and product UI palettes are explicitly independent",
	);
	const records = [];
	for (const name of [
		"request.json",
		"response.json",
		"prompt.txt",
		"source.json",
		"source-review.json",
		"raw-review.json",
		"authorization.json",
		`finishing/${family.finishing}/manifest.json`,
		`finishing/${family.finishing}/settings.json`,
	]) {
		try {
			const path = `${study}/${name}`;
			const bytes = await readFile(path);
			records.push({
				path,
				sha256: hash(bytes),
				bytes: bytes.length,
				url: `https://github.com/nocoo/hexly.ai/blob/${inventory.baseline}/${path}`,
			});
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
		}
	}
	let generation = null;
	if (!family.method) {
		const request = JSON.parse(await readFile(`${study}/request.json`, "utf8"));
		const response = JSON.parse(
			await readFile(`${study}/response.json`, "utf8"),
		);
		const prompt = await readFile(`${study}/prompt.txt`);
		const raw = await readFile(`public${family.root}/raw.png`);
		if (
			request.promptSha256 !== hash(prompt) ||
			response.output.sha256 !== hash(raw)
		)
			throw new Error(`Original generation provenance mismatch: ${project.id}`);
		generation = {
			provider: request.provider,
			model: request.parameters.model,
			batch: family.id,
			requestId: response.requestId,
			promptSha256: hash(prompt),
			raw: {
				path: `${family.root}/raw.png`,
				bytes: raw.length,
				sha256: hash(raw),
				width: response.output.width,
				height: response.output.height,
			},
			originallyGeneratedAt: request.startedAt,
			madeInThisRelease: false,
		};
		await save(
			"prompt.txt",
			prompt,
			"Exact historical generation prompt; this release made no image-model call",
		);
	}
	const sourceRights =
		family.method === "reference-adaptation"
			? "Owner-supplied character illustration. Artist and redistribution license are not established in the source record. No MIT grant is made for this illustration or third-party character/trademark rights."
			: family.method === "retained-original"
				? "Existing project raster retained from its recorded source. Original authorship and artwork-specific license are not independently established by these records; no new image-model or blanket MIT claim is made. Third-party rights, where applicable, remain with their holders."
				: "Existing Azure OpenAI GPT Image 2 artwork. Its original prompt, model response, raw hash and finishing history remain recorded. Owner-held output rights remain subject to provider terms and any referenced third-party rights; this archive does not turn generated artwork into a hand-drawn or native SVG identity.";
	const provenance = {
		project: project.id,
		brandVersion: "1.0.0",
		scope,
		officialProjectIdentity: officialIdentity,
		campaignInterpretation: campaign,
		generation,
		records,
		sourceRights,
		hero: {
			method: "authored-composition",
			newGenerationCalls: 0,
			nativeGPTOutput: false,
			placements: heroPlacements,
		},
		texture: {
			method:
				"Authored SVG support graphic from the project's distinct archived pattern; not a logo tracing",
			...recipe.pattern,
		},
		finishing: {
			archive: `${study}/finishing/${family.finishing}`,
			sourceAdoptionUnchanged: true,
		},
		build: {
			baseline: inventory.baseline,
			recipe: `${source}/recipe.json`,
			recipeSha256: hash(await readFile(`${source}/recipe.json`)),
			tool: `${collection}/export.ts`,
			toolSha256: hash(await readFile(`${collection}/export.ts`)),
			typographyTool: `${collection}/outline.py`,
			typographyToolSha256: hash(await readFile(`${collection}/outline.py`)),
			sharp: "0.35.4",
		},
	};
	await save(
		"provenance.json",
		json(provenance),
		"Independent official/campaign roles, exact original generation records, pixel hashes and declared authored derivatives",
	);
	await save(
		"license.txt",
		`Brand archive: ${project.title} / 1.0.0\n\n${sourceRights}\n\nNewly authored Hexly layout/export code, recipes, text and support textures are offered under the repository MIT license below. This does not relicense preserved source imagery or third-party rights. Wordmark outlines and Space Grotesk / Geist Mono retain SIL OFL 1.1; see the two font notices. The typography is a Hexly campaign treatment, not a product-site typography migration.\n\n${await readFile("LICENSE", "utf8")}\n`,
		"Separated source-artwork rights, MIT for authored support work, and real font license notices",
	);
	const guide = `# ${project.title} — Hexly campaign archive 1.0.0\n\n${recipe.caption.en}\n\n${recipe.caption.zh}\n\n${recipe.description.en}\n\n## Scope and source identity\n\nHexly palettes, typography, red points and editorial geometry apply only to the hexly.ai archive and Hexly-authored promotional materials, video, Deck and social graphics. Independent product websites keep their own full palettes, themes and visual identity. This release writes only hexly.ai.\n\nThe official/source project identity is [${originalName}](${originalName}), preserved byte for byte: SHA-256 \`${hash(original)}\`; native ${originalPixels.width}×${originalPixels.height}; decoded RGBA SHA-256 \`${originalPixels.rgbaSha256}\`. [Original source](${project.logo.sourceUrl}).\n\nThe Hexly family artwork is [logo.png](logo.png): SHA-256 \`${hash(foreground)}\`; native ${foregroundPixels.width}×${foregroundPixels.height}; decoded RGBA SHA-256 \`${foregroundPixels.rgbaSha256}\`. ${campaign.sameBytesAsOfficial ? "It is byte-identical to the recorded project identity." : "It differs from the recorded project identity and remains a Hexly campaign interpretation. The existing family status is review; this release does not claim source adoption."} Its colors and geometry are unchanged.\n\nAny future generated campaign Hero must be separately identified as a Hexly campaign interpretation, with its actual prompt/model/raw records. It cannot silently become an official project Logo. This kit made **zero** image-generation calls.\n\n## Composition and scale\n\n${guidelines.map((g) => `### ${g.title.en}\n\n${g.description.en}\n\n${g.description.zh}`).join("\n\n")}\n\nNative foreground resolution is ${family.foreground.width}px. New web marks never exceed it. Historical square presentations may retain their previously disclosed export dimensions; those are not a claim of new native detail. The wide 2400×960 and mobile 1024×1024 Hero canvases place the entire existing artwork independently, without a crop. New Hero PNGs are lossless authored composites, not raw GPT outputs. See exact placement ratios in provenance.json.\n\n## Texture and colors\n\n${recipe.pattern.name.en} / ${recipe.pattern.name.zh}. ${recipe.pattern.description.en}\n\nThe full motif linework is normalized into a 512px tile with a transparent 40px perimeter. Ink opacity is 3.6%; accent is 2.2%. Both are decorative, repeatable and subordinate to text. Use 360–480 CSS px tiles in archives. Keep the point separate from the logo; do not add it to small app marks or use it as a false health indicator.\n\nLight Hexly campaign surface \`#f0f0e9\`, ink \`#30372e\`, accent \`#bf5c3c\`. Dark surface \`#1e2824\`, ink \`#e6e9dc\`, accent \`#e79670\`. These values do not replace product UI tokens or original Logo colors. Native artwork palette evidence remains in tokens.json and the historical family archive.\n\n## Downloads and integration\n\n[All files and exact SHA-256](manifest.json) · [Standalone specimens](review.html) · [Provenance](provenance.json) · [Licensing](license.txt).\n\nUse \`https://hexly.ai${root}/\` as the immutable URL root. Download only the needed roles from manifest.json and verify each file's bytes/SHA before adoption.\n\n- Official product identity: \`${originalName}\`.\n- Campaign foreground: \`logo.png\`, \`mark-light.png\` / \`mark-dark.png\` (same exact image).\n- Navigation: \`mark-24.png\` (or a 48px source displayed at 24px), without a tile or mask.\n- Browser icon: \`favicon.ico\` with actual 16/32/48/64/128/256 PNG entries, all transparent campaign marks.\n- Campaign wordmark: \`wordmark-light.svg\` / \`wordmark-dark.svg\`; genuine font outlines, including full descenders. No raster identity is advertised as native SVG.\n- Wide Hero: \`hero.webp\` / \`hero-dark.webp\`; mobile: \`hero-square.webp\` / \`hero-square-dark.webp\`. Never crop the wide Hero for mobile.\n- Support texture: \`texture-light.svg\` / \`texture-dark.svg\` or their PNG forms.\n\nA kit version is independent of a product release. Source repository adoption requires its own future action; the existing catalogue source/adoption fields are unchanged. Pin the published Hexly commit and manifest hash when adopting; do not use a mutable \`main\` URL as the only provenance.\n\n## Rights and history\n\n${sourceRights}\n\n[Preserved family record](https://github.com/nocoo/hexly.ai/tree/${inventory.baseline}/${study}). Exact record paths, model/prompt/raw hashes when applicable, finishing source and source revisions are listed in provenance.json. Previous public Logo and family URLs remain valid.\n\nScope (中文)：统一色系只用于 Hexly 的介绍、档案与宣发画布。官方项目 Logo 和已有动物/标志的形状、核心色彩与原文件不变，各独立产品的完整色板和主题不在修改范围。宣发演绎资产不取代官方 Logo。\n`;
	await save(
		"guide.md",
		guide,
		"Project-specific bilingual usage, color scope, minimum sizes, original rights and verified immutable integration paths",
	);
	const picture = (theme: string) =>
		`<picture class="theme-${theme}"><source media="(max-width: 640px)" srcset="./hero-square${theme === "dark" ? "-dark" : ""}.webp" width="1024" height="1024"><img src="./hero${theme === "dark" ? "-dark" : ""}.webp" width="2400" height="960" alt="${xml(family.foreground.subject?.en ?? project.subject)} on a Hexly campaign canvas"></picture>`;
	const standalone = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><meta name="color-scheme" content="light dark"><title>${xml(project.title)} — Hexly brand specimens 1.0</title><link rel="canonical" href="https://hexly.ai/projects/${project.id}"><link rel="icon" href="./favicon.ico"><link rel="stylesheet" href="./review.css"></head><body data-theme="light"><header class="masthead"><a class="family" href="/projects/${project.id}#brand"><img src="./hexly-mark.svg" alt="" width="30" height="34"><span>hexly.ai</span></a><button id="theme-switch" type="button" aria-pressed="false">Dark canvas</button></header><main>
<div class="introduction"><p class="eyebrow">${xml(project.title)} / Hexly campaign archive / 1.0.0</p><h1>${xml(recipe.caption.en)}</h1><p>${xml(recipe.description.en)}</p><p class="caption">Hexly campaign surfaces only. Original Logo colors and independent product palettes remain unchanged.</p></div>
<figure class="hero">${picture("light")}${picture("dark")}<figcaption>Independent wide and mobile layouts using complete existing artwork. Authored composition, no new image generation.</figcaption></figure>
<section aria-labelledby="identity-title"><div class="section-heading"><div><p class="eyebrow">01 / Identity</p><h2 id="identity-title">An identity, with its history.</h2></div><fieldset class="view-switch" aria-label="Artwork presentation"><button type="button" data-view="icon" aria-pressed="true">Icon</button><button type="button" data-view="white" aria-pressed="false">White</button><button type="button" data-view="transparent" aria-pressed="false">Transparent</button></fieldset></div><div class="comparison"><figure><a class="artwork previous" href="./${originalName}" download><img src="./${originalName}" width="${originalPixels.width}" height="${originalPixels.height}" alt="${xml(project.title)} recorded original project identity"></a><figcaption><strong>Project identity / Original bytes</strong><span>Original colors, geometry and source record preserved.</span></figcaption></figure><figure><a class="artwork" id="candidate-link" data-view="icon" href="./icon-light.png" download><img id="candidate" src="./icon-light-512.png" width="512" height="512" alt="${xml(project.title)} existing Hexly campaign artwork"></a><figcaption><strong>Hexly family / Campaign artwork</strong><span>${campaign.sameBytesAsOfficial ? "Same foreground as the recorded project identity." : "Separate family interpretation; source adoption is not claimed."}</span></figcaption></figure></div></section>
<section aria-labelledby="type-title"><div class="section-heading"><div><p class="eyebrow">02 / Wordmark</p><h2 id="type-title">A common language, a distinct voice.</h2></div><p>Space Grotesk 600. Unchanged glyphs and complete descenders.</p></div><div class="pair">${["light", "dark"].map((theme) => `<figure class="${theme === "light" ? "paper" : "night"} specimen"><img src="./lockup-${theme}.png" width="${lockupWidth}" height="${lockupHeight}" alt="${xml(project.title)} ${theme} campaign lockup"><figcaption>${theme} / original artwork colors</figcaption></figure>`).join("")}</div></section>
<section aria-labelledby="size-title"><div class="section-heading"><div><p class="eyebrow">03 / Scale</p><h2 id="size-title">From a tile to a tab.</h2></div><p>Small marks use complete transparent artwork.</p></div><div class="sizes">${[128, 64, 32, 16].map((size) => `<figure><img ${size >= 64 ? 'class="tile"' : ""} src="./${size >= 64 ? "icon-light-512" : `mark-${size}`}.png" width="${size}" height="${size}" alt="${xml(project.title)} at ${size} pixels"><figcaption>${size}px / ${size >= 64 ? "presentation" : "foreground"}</figcaption></figure>`).join("")}</div><div class="pair contexts"><div><div class="app-name"><img src="./mark-48.png" alt="" width="24" height="24"><strong>${xml(project.title)}</strong></div><p>${xml(project.description.en)}</p><span class="caption">24px navigation / no tile, mask or added point</span></div><div><div class="tab"><img src="./mark-32.png" alt="" width="16" height="16"><span>${xml(project.title)}</span><span aria-hidden="true">×</span></div><p class="caption">16px browser mark / six decodable ICO entries</p></div></div><p class="caption">Native source ${family.foreground.width}px. Small facets soften at 16px. ${xml(framing)}</p></section>
<section aria-labelledby="texture-title"><div class="section-heading"><div><p class="eyebrow">04 / Texture</p><h2 id="texture-title">${xml(recipe.pattern.name.en)}</h2></div><p>${xml(recipe.pattern.description.en)}</p></div><div class="pair textures">${["light", "dark"].map((theme) => `<figure class="${theme === "light" ? "paper" : "night"}"><div style="background-image:url('./texture-${theme}.svg')"></div><figcaption><a href="./texture-${theme}.svg" download>${theme} / seamless SVG ↓</a></figcaption></figure>`).join("")}</div></section>
<section aria-labelledby="palette-title"><div class="section-heading"><div><p class="eyebrow">05 / Color scope</p><h2 id="palette-title">The canvas is Hexly. The mark is itself.</h2></div><p>Campaign-only tokens. Product UI stays independent.</p></div><div class="swatches">${Object.entries(
		{
			Paper: palettes.light.page,
			Ink: palettes.light.ink,
			Terracotta: palettes.light.accent,
			"Night paper": palettes.dark.page,
			"Night ink": palettes.dark.ink,
			"Night accent": palettes.dark.accent,
		},
	)
		.map(
			([name, color]) =>
				`<button type="button" data-color="${color}" style="--swatch:${color}"><span></span><strong>${name}</strong><code>${color}</code><small>Hexly campaign surface</small></button>`,
		)
		.join(
			"",
		)}</div><p id="copy-status" role="status" aria-live="polite"></p></section>
<section aria-labelledby="edge-title"><div class="section-heading"><div><p class="eyebrow">06 / Edges</p><h2 id="edge-title">Same image, both fields.</h2></div><p>No recoloring, extra mask or opacity change.</p></div><div class="pair edges"><figure class="paper"><img src="./logo-light.png" width="512" height="512" alt="${xml(project.title)} transparent edge on paper"></figure><figure class="night"><img src="./logo-dark.png" width="512" height="512" alt="${xml(project.title)} transparent edge on night paper"></figure></div></section>
<section aria-labelledby="use-title"><div class="section-heading"><div><p class="eyebrow">07 / Usage</p><h2 id="use-title">Keep the identity intact.</h2></div></div><div class="rules">${guidelines.map((g) => `<article><h3>${xml(g.title.en)}</h3><p>${xml(g.description.en)}</p></article>`).join("")}</div></section>
<section aria-labelledby="download-title"><div class="section-heading"><div><p class="eyebrow">08 / Sources & downloads</p><h2 id="download-title">An archive you can trace.</h2></div><p>Version 1.0.0 / official and campaign roles are separate.</p></div><div class="downloads">${[
		[originalName, "Original project identity"],
		["logo.png", "Campaign foreground"],
		["wordmark-light.svg", "Outlined wordmark"],
		["hero.png", "Full campaign Hero"],
		["favicon.ico", "Favicon ICO"],
		["texture-light.svg", "Seamless texture"],
		["manifest.json", "All files & SHA-256"],
		["provenance.json", "Complete provenance"],
		["guide.md", "Usage & integration"],
		["license.txt", "License & source"],
	]
		.map(([file, label]) => `<a href="./${file}" download>${label} ↗</a>`)
		.join(
			"",
		)}</div><p class="caption">${xml(sourceRights)}</p>${generation ? `<details><summary>Read the exact historical generation prompt</summary><pre>${xml(await readFile(`${study}/prompt.txt`, "utf8"))}</pre><a href="./prompt.txt" download>Exact prompt ↓</a><p>Model ${xml(generation.model)} · batch ${xml(generation.batch)} · no new generation in this release.</p></details>` : ""}<p><a href="https://github.com/nocoo/hexly.ai/tree/${inventory.baseline}/${study}">Preserved source archive ↗</a> · <a href="./space-grotesk-ofl.txt">Space Grotesk / OFL</a> · <a href="./geist-mono-ofl.txt">Geist Mono / OFL</a></p></section></main><footer><a href="/projects/${project.id}#brand">Back to ${xml(project.title)} ↗</a><span>Hexly / Campaign archive 1.0.0</span></footer><script src="./review.js"></script></body></html>`;
	await save(
		"review.html",
		format("review.html", standalone),
		"Responsive standalone specimens, original/campaign comparison, both themes, sizes, sources and downloads",
	);
	await save(
		"review.css",
		await readFile(`${collection}/review.css`),
		"Shared Hexly campaign specimen styling",
	);
	await save(
		"review.js",
		await readFile(`${collection}/review.js`),
		"Small accessible theme/view/clipboard controls; no runtime image rendering",
	);
	const manifest = {
		$schema: "https://hexly.ai/brands/schema-v2.json",
		schemaVersion: 2,
		project: project.id,
		version: "1.0.0",
		method: "archived-artwork",
		designedAt: "2026-09-13",
		canonical: `https://hexly.ai/projects/${project.id}#brand`,
		root: `https://hexly.ai${root}`,
		source,
		brandBaseline: inventory.baseline,
		scope,
		officialProjectIdentity: officialIdentity,
		campaignInterpretation: campaign,
		hero: {
			method: "authored-composition",
			nativeGPTOutput: false,
			crop: false,
			recolor: false,
			placements: heroPlacements,
		},
		license:
			"Separated source rights in license.txt; MIT only for authored support work, SIL OFL 1.1 for actual font resources",
		sourceAdoption:
			"This Hexly campaign kit has no new source-repository adoption; existing catalogue provenance is unchanged",
		files: await Promise.all(
			files
				.toSorted((a, b) => a.name.localeCompare(b.name, "en"))
				.map(async ({ name, role }) => {
					const data = await readFile(`${output}/${name}`);
					return {
						path: `${root}/${name}`,
						role,
						bytes: data.length,
						sha256: hash(data),
					};
				}),
		),
	};
	await writeFile(`${output}/manifest.json`, json(manifest));
	if ((await readdir(output)).length !== files.length + 1)
		throw new Error(`Unexpected unowned output files: ${output}`);
	project.brandKit = {
		version: "1.0.0",
		root,
		method: "archived-artwork",
		scope: "hexly-campaign",
		sourceAdoptionRevision: null,
		lockup: { width: lockupWidth, height: lockupHeight },
		texture: {
			name: recipe.pattern.name,
			description: recipe.pattern.description,
		},
		hero: {
			width: 2400,
			height: 960,
			themed: true,
			alt: {
				en: `${family.foreground.subject?.en ?? project.subject} on a Hexly campaign canvas`,
				zh: `${family.foreground.subject?.zh ?? project.title}，置于 Hexly 宣发画布`,
			},
			caption: recipe.caption,
		},
		description: recipe.description,
		guidelines,
	};
	await writeFile(`src/data/projects/${project.id}.json`, json(project));
	await writeFile(
		`${source}/verification.json`,
		json({
			project: project.id,
			officialIdentity: originalPixels,
			campaign: foregroundPixels,
			originalFileHash: hash(original),
			campaignFileHash: hash(foreground),
			originalAndCampaignBytesEqual: campaign.sameBytesAsOfficial,
			heroPlacements,
			texture: { width: 512, height: 512, transparentPerimeterPx: 40 },
			wordmark: {
				width: wordmarkMeta.width,
				height: wordmarkMeta.height,
				includesFullGlyphBounds: true,
			},
			lockup: { width: lockupWidth, height: lockupHeight },
			manifestSha256: hash(await readFile(`${output}/manifest.json`)),
			files: files.length,
		}),
	);
	console.info(
		`${project.id}: ${files.length} files, native ${family.foreground.width}px, ${campaign.sameBytesAsOfficial ? "same official identity" : "separate campaign identity"}, ${basename(study)}`,
	);
}
