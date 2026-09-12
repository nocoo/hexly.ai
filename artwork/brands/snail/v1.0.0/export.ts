// Run from the repository root. Published v1.0.0 bytes must remain immutable.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { hexly, palettes } from "../../../../packages/video-kit/src/brand";

const source = "artwork/brands/snail/v1.0.0";
const root = "/brands/snail/v1.0.0";
const output = `public${root}`;
if (
	spawnSync("git", ["cat-file", "-e", `HEAD:${output}/manifest.json`], {
		stdio: "ignore",
	}).status === 0
) {
	throw new Error(
		"This brand version is committed. Create a new version; preserve the published bytes.",
	);
}
await mkdir(output, { recursive: true });
const master = await readFile(`${source}/mark.svg`, "utf8");
const wordmark = await readFile(`${source}/wordmark.svg`, "utf8");
const inner = (svg: string) =>
	svg
		.replace(/<svg[^>]*>|<\/svg>/g, "")
		.replace(/<(title|desc)>[\s\S]*?<\/\1>/g, "")
		.trim();
const dark = (svg: string) =>
	svg
		.replaceAll(palettes.light.ink, palettes.dark.ink)
		.replaceAll(palettes.light.accent, palettes.dark.accent);
const svg = (width: number, height: number, title: string, body: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${title}</title>${body}</svg>\n`;
const files: { name: string; role: string }[] = [];
async function save(name: string, bytes: string | Buffer, role: string) {
	await writeFile(`${output}/${name}`, bytes);
	files.push({ name, role });
}
const adaptive = master.replace(
	"</svg>",
	`<style>@media(prefers-color-scheme:dark){g{stroke:${palettes.dark.ink}}circle{fill:${palettes.dark.accent}}}</style></svg>`,
);
const lockup = svg(
	454,
	192,
	"Snail logo and wordmark",
	`<g fill="none" transform="translate(10 16) scale(.625)">${inner(master)}</g><g transform="translate(174 32)">${inner(wordmark)}</g>`,
);
for (const theme of ["light", "dark"] as const) {
	const convert = theme === "dark" ? dark : (value: string) => value;
	await save(`mark-${theme}.svg`, convert(master), "Transparent product mark");
	await save(
		`wordmark-${theme}.svg`,
		convert(wordmark),
		"Outlined Space Grotesk 600 wordmark",
	);
	await save(
		`lockup-${theme}.svg`,
		convert(lockup),
		"Horizontal logo and wordmark",
	);
	const icon = svg(
		256,
		256,
		"Snail application icon",
		`<path fill="${palettes[theme].page}" d="M0 0h256v256H0z"/><g fill="none">${inner(convert(master))}</g>`,
	);
	await save(
		`icon-${theme}.svg`,
		icon,
		"Square presentation; platform supplies the mask",
	);
	await save(
		`logo-${theme}.png`,
		await sharp(Buffer.from(convert(master)))
			.resize(1024)
			.png()
			.toBuffer(),
		"1024px transparent raster master",
	);
	await save(
		`icon-${theme}-512.png`,
		await sharp(Buffer.from(icon)).resize(512).png().toBuffer(),
		"512px application icon; purpose any",
	);
	for (const size of [16, 24, 32, 48, 64, 128, 256]) {
		await save(
			`mark-${theme}-${size}.png`,
			await sharp(Buffer.from(convert(master)))
				.resize(size)
				.png()
				.toBuffer(),
			`${size}px transparent application mark`,
		);
	}
	if (theme === "light") {
		await save(
			"apple-touch-icon.png",
			await sharp(Buffer.from(icon)).resize(180).png().toBuffer(),
			"180px opaque Apple touch icon",
		);
		await save(
			"icon-192.png",
			await sharp(Buffer.from(icon)).resize(192).png().toBuffer(),
			"192px application icon; purpose any",
		);
	}
}
await save(
	"mark.svg",
	adaptive,
	"Transparent mark following the system color scheme",
);
await save(
	"favicon.svg",
	adaptive,
	"Adaptive browser favicon; no background tile",
);
await save(
	"mark-mono.svg",
	master.replaceAll(palettes.light.accent, palettes.light.ink),
	"One-color foreground; exact geometry retained",
);

// PNG-backed ICO entries preserve full alpha and all requested native sizes.
const icoSizes = [16, 32, 48, 64, 128, 256];
const icoImages = await Promise.all(
	icoSizes.map((size) =>
		sharp(
			Buffer.from(master.replaceAll(palettes.light.ink, palettes.light.accent)),
		)
			.resize(size)
			.png()
			.toBuffer(),
	),
);
const header = Buffer.alloc(6 + icoSizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
let offset = header.length;
for (const [index, size] of icoSizes.entries()) {
	const entry = 6 + index * 16;
	const bytes = icoImages[index];
	if (!bytes) throw new Error("Missing ICO entry");
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
	"Transparent terracotta fallback; 16/32/48/64/128/256px",
);
await save(
	"license.txt",
	await readFile("LICENSE"),
	"MIT license for the original Snail geometry and archive code",
);
await save(
	"space-grotesk-ofl.txt",
	await readFile("node_modules/@fontsource-variable/space-grotesk/LICENSE"),
	"SIL OFL 1.1 and original font authors",
);
await save(
	"space-grotesk.woff2",
	await readFile(
		"node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
	),
	"Unmodified site font for the standalone guide",
);
await save(
	"hexly-mark.svg",
	svg(
		36,
		40,
		"Hexly official mark",
		`<path fill="${palettes.light.accent}" d="${hexly.mark.outer}"/><g fill="none" stroke="${palettes.light.page}" stroke-width="${hexly.mark.strokeWidth}"><path d="${hexly.mark.inner}"/><path d="${hexly.mark.facets}"/></g>`,
	),
	"Unmodified official family geometry; endorsement only",
);
for (const name of ["guide.md", "review.html", "review.css", "tokens.json"]) {
	await save(
		name,
		await readFile(`${source}/${name}`),
		"Brand usage, review and evidenced design tokens",
	);
}
const manifest = {
	schemaVersion: 1,
	project: "snail",
	version: "1.0.0",
	method: "original-vector",
	designedAt: "2026-09-12",
	canonical: "https://hexly.ai/projects/snail#brand",
	root: `https://hexly.ai${root}`,
	source: "artwork/brands/snail/v1.0.0",
	brandBaseline: "a55baf21a2f0842c0580098e54d4479e41847593",
	font: {
		family: "Space Grotesk",
		weight: 600,
		package: "@fontsource-variable/space-grotesk@5.3.0",
		outlines: "Unmodified glyphs; site tracking -1/23 em",
		license: "SIL OFL 1.1",
	},
	license: "MIT (original geometry and code); SIL OFL 1.1 (font)",
	sourceAdoption:
		"Separate from this Hexly publication; the Snail team integrates the pinned assets.",
	files: await Promise.all(
		files
			.sort((a, b) => a.name.localeCompare(b.name, "en"))
			.map(async ({ name, role }) => {
				const bytes = await readFile(`${output}/${name}`);
				return {
					path: `${root}/${name}`,
					role,
					bytes: bytes.length,
					sha256: createHash("sha256").update(bytes).digest("hex"),
				};
			}),
	),
};
await writeFile(
	`${output}/manifest.json`,
	`${JSON.stringify(manifest, null, "\t")}\n`,
);
await mkdir("public/logos/originals", { recursive: true });
await writeFile("public/logos/originals/snail-v1-0-0.svg", master);
const actualFiles = await readdir(output);
if (actualFiles.length !== manifest.files.length + 1)
	throw new Error("Unexpected files in the versioned export");
console.info(
	`Exported ${files.length} Snail assets plus a checksummed manifest.`,
);
