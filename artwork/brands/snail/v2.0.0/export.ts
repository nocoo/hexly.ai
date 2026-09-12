// Run from hexly.ai. Committed brand versions are immutable.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { palettes } from "../../../../packages/video-kit/src/brand";

const source = "artwork/brands/snail/v2.0.0";
const root = "/brands/snail/v2.0.0";
const output = `public${root}`;
const study = "artwork/logo-family/snail/2026-09-13-01";
const finishing = `${study}/finishing/01`;
const previous = "public/brands/snail/v1.0.0";
const sizes = [2048, 1024, 512, 256, 128, 64, 48, 32, 24, 16];
const sha256 = (bytes: Buffer) =>
	createHash("sha256").update(bytes).digest("hex");
if (
	spawnSync("git", ["cat-file", "-e", `HEAD:${output}/manifest.json`], {
		stdio: "ignore",
	}).status === 0
) {
	throw new Error("This version is committed; create a new version instead.");
}
await mkdir(output, { recursive: true });
const selected = JSON.parse(await readFile(`${source}/selection.json`, "utf8"));
const foreground = await readFile(
	`${finishing}/exports/snail-transparent-2048.png`,
);
const square = await readFile(`${finishing}/exports/snail-icon-2048.png`);
const raw = await readFile(`${study}/raw/generated.png`);
const hero = await readFile(`${selected.selectedHero}/raw/generated.png`);
const extraction = JSON.parse(
	await readFile(`${finishing}/manifest.json`, "utf8"),
);
if (
	extraction.placement.scale !== 1 ||
	extraction.placement.offsetAt2048.some((n: number) => n !== 0)
)
	throw new Error(
		"Snail keeps its native framing; no placement transform is allowed.",
	);
for (const [bytes, width, height] of [
	[raw, 2048, 2048],
	[foreground, 2048, 2048],
	[hero, 2560, 1024],
] as const) {
	const metadata = await sharp(bytes).metadata();
	if (metadata.width !== width || metadata.height !== height)
		throw new Error("A source no longer has its recorded native dimensions.");
}
for (const [archive, bytes] of [
	[study, raw],
	[selected.selectedHero, hero],
] as const) {
	const decision = JSON.parse(
		await readFile(`${archive}/raw-review.json`, "utf8"),
	);
	if (decision.status !== "approved" || decision.imageSha256 !== sha256(bytes))
		throw new Error("Exact-byte processing authorization is missing.");
}
const rawPixels = await sharp(raw).ensureAlpha().raw().toBuffer();
const foregroundPixels = await sharp(foreground).ensureAlpha().raw().toBuffer();
let opaquePixels = 0;
let changedOpaquePixels = 0;
let softEdgePixels = 0;
for (let i = 0; i < foregroundPixels.length; i += 4) {
	if (foregroundPixels[i + 3] === 255) {
		opaquePixels++;
		if (
			rawPixels[i] !== foregroundPixels[i] ||
			rawPixels[i + 1] !== foregroundPixels[i + 1] ||
			rawPixels[i + 2] !== foregroundPixels[i + 2]
		)
			changedOpaquePixels++;
	} else if ((foregroundPixels[i + 3] ?? 0) > 0) softEdgePixels++;
}
if (changedOpaquePixels || opaquePixels < 1_000_000)
	throw new Error("The accepted opaque artwork has changed.");
const opaqueEquality = {
	opaquePixels,
	changedOpaquePixels,
	softEdgePixels,
	method:
		"Compare every fully opaque extracted pixel to the same native source coordinate; no resampling",
};
const files: { name: string; role: string }[] = [];
async function save(name: string, bytes: string | Buffer, role: string) {
	await writeFile(`${output}/${name}`, bytes);
	files.push({ name, role });
}
function json(value: unknown) {
	const result = spawnSync(
		"node_modules/.bin/biome",
		["format", "--stdin-file-path=brand.json"],
		{
			input: `${JSON.stringify(value, null, "\t")}\n`,
			encoding: "utf8",
		},
	);
	if (result.status !== 0) throw new Error(result.stderr);
	return result.stdout;
}

// These are independently authored, repeatable support graphics, not an AI SVG.
function texture(theme: "light" | "dark") {
	const colors = palettes[theme];
	return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>Snail returning paths — ${theme} seamless texture</title><g fill="none" stroke="${colors.ink}" stroke-width="1.8" stroke-linejoin="round" opacity=".038"><path d="M60 216 42 160 56 102 100 60 160 42 219 58 264 101 279 160 263 216 220 257 163 272 110 255 72 214 59 162 73 114 110 79 158 65 207 79 242 116 253 161 239 205 206 235 163 246 124 231 99 197 91 161 104 130 131 109 163 102 193 115 211 140 215 167 200 189 177 199 155 194 142 178 141 160 153 149 165 149"/><path d="M54 400C100 343 150 332 197 354S270 419 328 416 411 378 458 340"/></g><g fill="none" stroke="${colors.accent}" stroke-width="1.4" stroke-linejoin="round" opacity=".032"><path d="m310 96 58 22 24 46 44 21 22 47M296 288l46-25 50 17 23 44"/></g></svg>\n`;
}

const samples = [
	{
		point: [620, 1250],
		name: "Terracotta shell",
		zh: "陶土螺壳",
		role: "primary",
	},
	{ point: [660, 610], name: "Shell shadow", zh: "壳内暗面", role: "accent" },
	{ point: [780, 890], name: "Sunlit facet", zh: "浅色切面", role: "accent" },
	{ point: [1480, 1260], name: "Olive ink", zh: "橄榄墨色", role: "accent" },
	{
		point: [1875, 1040],
		name: "Returning point",
		zh: "重逢红点",
		role: "accent",
	},
].map(({ point, name, zh, role }) => {
	const [x, y] = point;
	if (x === undefined || y === undefined)
		throw new Error("Missing sample coordinate");
	const offset = (y * 2048 + x) * 4;
	if (foregroundPixels[offset + 3] !== 255)
		throw new Error("Palette sample is not opaque");
	return {
		color: `#${rawPixels.subarray(offset, offset + 3).toString("hex")}`,
		role,
		label: { en: name, zh },
		point,
		source: `Native Snail output SHA-256 ${sha256(raw)}; opaque sRGB pixel (${x}, ${y}); artwork/brands/snail/v2.0.0/palette.json`,
	};
});
await writeFile(
	`${source}/palette.json`,
	json({
		method:
			"Exact native opaque sRGB pixel samples; raster colors are distinct from Hexly UI tokens",
		source: `${study}/raw/generated.png`,
		sha256: sha256(raw),
		samples,
		presentation: {
			color: palettes.light.page,
			role: "background",
			label: { en: "Hexly paper", zh: "Hexly 纸色" },
			source:
				"src/styles/base.css and the independent Snail finishing/01/settings.json background.base",
		},
	}),
);

await save(
	"logo.png",
	foreground,
	"Native 2048px transparent master; original opaque animal pixels preserved",
);
await save(
	"raw-icon.png",
	raw,
	"Untouched native GPT Image square PNG with original provenance metadata",
);
await save(
	"hero.png",
	hero,
	"Untouched native 2560×1024 GPT Image hero; no cropping or compositing",
);
await save(
	"hero.webp",
	await sharp(hero).webp({ quality: 90, effort: 6 }).toBuffer(),
	"Full native hero frame, optimized WebP",
);
await save(
	"hero-square.webp",
	await sharp(square).resize(1024).webp({ quality: 90, effort: 6 }).toBuffer(),
	"Mobile hero from the separately generated square; no crop of the wide hero",
);
await save(
	"white.png",
	await readFile(`${finishing}/exports/snail-white-2048.png`),
	"Extracted native artwork over pure white",
);
await save(
	"icon-rounded.png",
	await readFile(`${finishing}/exports/snail-rounded-2048.png`),
	"Rounded large presentation; never use as a transparent navigation mark",
);
for (const size of sizes) {
	await save(
		`mark-${size}.png`,
		await readFile(`${finishing}/exports/snail-transparent-${size}.png`),
		`${size}px transparent foreground, complete native composition`,
	);
}
for (const theme of ["light", "dark"] as const) {
	const vector = texture(theme);
	await save(
		`texture-${theme}.svg`,
		vector,
		"Authored seamless spiral/trail support graphic; 512px tile, no animal tracing",
	);
	await save(
		`texture-${theme}.png`,
		await sharp(Buffer.from(vector)).png().toBuffer(),
		"512px transparent raster of the authored seamless texture",
	);
	const darkField = await sharp({
		create: {
			width: 2048,
			height: 2048,
			channels: 4,
			background: palettes.dark.page,
		},
	})
		.composite([
			{
				input: await sharp(Buffer.from(texture("dark")))
					.resize(2048)
					.png()
					.toBuffer(),
			},
			{ input: foreground },
		])
		.png()
		.toBuffer();
	const icon = theme === "light" ? square : darkField;
	await save(
		`mark-${theme}.png`,
		foreground,
		"Same unaltered transparent animal in both themes; no recoloring",
	);
	await save(
		`logo-${theme}.png`,
		await sharp(foreground).resize(1024).png().toBuffer(),
		"1024px transparent foreground; theme-neutral original colors",
	);
	await save(
		`icon-${theme}.png`,
		icon,
		"2048px square application presentation; platform supplies masking",
	);
	await save(
		`icon-${theme}-512.png`,
		await sharp(icon).resize(512).png().toBuffer(),
		"512px square application icon",
	);
	const wordmark = await readFile(`${previous}/wordmark-${theme}.svg`);
	await save(
		`wordmark-${theme}.svg`,
		wordmark,
		"Unchanged outlined Space Grotesk 600 letters; original font license retained",
	);
	const lockup = await sharp({
		create: {
			width: 1362,
			height: 576,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.composite([
			{
				input: await sharp(foreground).resize(576).png().toBuffer(),
				left: 0,
				top: 0,
			},
			{
				input: await sharp(wordmark).resize(780).png().toBuffer(),
				left: 558,
				top: 91,
			},
		])
		.png()
		.toBuffer();
	await save(
		`lockup-${theme}.png`,
		lockup,
		"Transparent raster composition of generated animal and licensed outlined wordmark; not native SVG",
	);
}
await save(
	"icon-192.png",
	await sharp(square).resize(192).png().toBuffer(),
	"192px PWA icon, purpose any",
);
await save(
	"apple-touch-icon.png",
	await sharp(square).resize(180).png().toBuffer(),
	"180px opaque Apple touch presentation",
);

const icoSizes = [16, 32, 48, 64, 128, 256];
const icoImages = await Promise.all(
	icoSizes.map((size) => readFile(`${output}/mark-${size}.png`)),
);
const header = Buffer.alloc(6 + icoSizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
let offset = header.length;
for (const [index, size] of icoSizes.entries()) {
	const entry = 6 + index * 16;
	const bytes = icoImages[index];
	if (!bytes) throw new Error("Missing ICO image");
	header[entry] = header[entry + 1] = size === 256 ? 0 : size;
	header.writeUInt16LE(1, entry + 4);
	header.writeUInt16LE(32, entry + 6);
	header.writeUInt32LE(bytes.length, entry + 8);
	header.writeUInt32LE(offset, entry + 12);
	offset += bytes.length;
}
await save(
	"favicon.ico",
	Buffer.concat([header, ...icoImages]),
	"Real transparent PNG-backed ICO: 16/32/48/64/128/256px; same full animal",
);
for (const name of [
	"space-grotesk-ofl.txt",
	"space-grotesk.woff2",
	"hexly-mark.svg",
]) {
	await save(
		name,
		await readFile(`${previous}/${name}`),
		"Byte-preserved official Hexly/font resource from v1.0.0",
	);
}
const tokens = {
	project: "snail",
	version: "2.0.0",
	sourceRevision: "352eb2652d4e11c876ef84152fc8e02f8d5ed331",
	ui: {
		source: "src/styles/base.css",
		light: palettes.light,
		dark: palettes.dark,
	},
	font: {
		family: "Space Grotesk",
		weight: 600,
		letterSpacingEm: -1 / 23,
		license: "SIL OFL 1.1",
	},
	artwork: {
		palette:
			"Sampled native pixels in palette.json; generated animal colors are not asserted to equal UI hex tokens",
		onePoint: true,
		preserveNativeFrame: true,
		minimumMarkPx: 16,
		preferredNavigationPx: 24,
		minimumWordmarkWidthPx: 72,
		minimumLockupWidthPx: 160,
	},
	texture: {
		tile: [512, 512],
		source: "Authored SVG in export.ts",
		inkOpacity: 0.038,
		accentOpacity: 0.032,
		recommendedTileCssPx: [360, 480],
		decorative: true,
	},
};
await save(
	"tokens.json",
	json(tokens),
	"Actual Hexly theme/font tokens and distinct raster-artwork usage rules",
);
const generations = await Promise.all(
	["01", "02", "03", "04", "05", "06"].map(async (id) => {
		const archive = `artwork/logo-family/snail/2026-09-13-${id}`;
		const request = JSON.parse(
			await readFile(`${archive}/request.json`, "utf8"),
		);
		const response = JSON.parse(
			await readFile(`${archive}/response.json`, "utf8"),
		);
		return {
			archive,
			selected: id === "01" || id === "04",
			model: request.parameters.model,
			provider: request.provider,
			requestId: response.requestId,
			promptSha256: request.promptSha256,
			output: response.output,
			references: request.images,
		};
	}),
);
await save(
	"provenance.json",
	json({
		project: "snail",
		brandVersion: "2.0.0",
		method: "gpt-image-2",
		generations,
		selection: selected,
		processing: {
			source: `${finishing}/manifest.json`,
			sourceSha256: extraction.input.sha256,
			opaqueColorsPreserved: true,
			opaqueEquality,
			crop: false,
			recolor: false,
			placement: extraction.placement,
		},
		historicalBrand: {
			version: "1.0.0",
			root: "https://hexly.ai/brands/snail/v1.0.0/",
			manifestSha256:
				"11b8203d41030ad5317b94fd8a2a19d7a7b1077f174410b89caea4fd0d082ec8",
			adoptionRevision: "fe5f72e8a0d960a81acadc5704a04e1c4ed4f607",
		},
		sourceAdoptionRevision: null,
		sourceScope:
			"Only hexly.ai was written; Snail consumes a pinned published version separately",
	}),
	"Actual GPT Image requests/output hashes, delegated selection, processing and preserved v1 history",
);
for (const name of [
	"guide.md",
	"license.txt",
	"review.html",
	"review.css",
	"review.js",
	"palette.json",
]) {
	await save(
		name,
		await readFile(`${source}/${name}`),
		"Brand usage, licensing, specimens and measured native colors",
	);
}
await save(
	"prompt-icon.txt",
	await readFile(`${study}/prompt.txt`),
	"Exact submitted square-generation prompt",
);
await save(
	"prompt-hero.txt",
	await readFile(`${selected.selectedHero}/prompt.txt`),
	"Exact submitted wide-generation prompt",
);
const manifest = {
	schemaVersion: 1,
	project: "snail",
	version: "2.0.0",
	method: "gpt-image-2",
	designedAt: "2026-09-13",
	canonical: "https://hexly.ai/projects/snail#brand",
	root: `https://hexly.ai${root}`,
	source,
	brandBaseline: "352eb2652d4e11c876ef84152fc8e02f8d5ed331",
	license:
		"MIT for authored work and any owner-held generated-output rights; SIL OFL 1.1 for Space Grotesk; see license.txt",
	sourceAdoption:
		"Pending separate Snail integration; brand publication is independent of the application release",
	files: await Promise.all(
		files
			.sort((a, b) => a.name.localeCompare(b.name, "en"))
			.map(async ({ name, role }) => {
				const bytes = await readFile(`${output}/${name}`);
				return {
					path: `${root}/${name}`,
					role,
					bytes: bytes.length,
					sha256: sha256(bytes),
				};
			}),
	),
};
await writeFile(`${output}/manifest.json`, json(manifest));
// The workbench and deployed specimen share one maintained page and asset set.
const review = await readFile(`${source}/review.html`, "utf8");
await writeFile(
	`${study}/review.html`,
	review
		.replace(
			"<head>",
			'<head>\n\t\t<base href="../../../../public/brands/snail/v2.0.0/">',
		)
		.replaceAll('src="/logos/', 'src="../../../logos/'),
);
const backup = "public/logos/originals/snail-v2-0-0.png";
try {
	await writeFile(backup, foreground, { flag: "wx" });
} catch (error) {
	if (
		(error as NodeJS.ErrnoException).code !== "EEXIST" ||
		!(await readFile(backup)).equals(foreground)
	)
		throw error;
}
if ((await readdir(output)).length !== files.length + 1)
	throw new Error("Unexpected versioned output files");
console.info(
	`Exported ${files.length} Snail v2 assets, exact native frames and checksummed manifest.`,
);
