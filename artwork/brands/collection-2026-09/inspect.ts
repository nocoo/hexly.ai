// Contact sheets are inspection evidence, never deployment assets.
// bun artwork/brands/collection-2026-09/inspect.ts <output-directory>
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import inventory from "../../../docs/brand-archives/inventory-0.10.0.json";

const output = process.argv[2];
if (
	!output ||
	resolve(output) === resolve("public") ||
	resolve(output).startsWith(`${resolve("public")}/`)
)
	throw new Error("Choose an inspection directory outside public assets");
await mkdir(output, { recursive: true });
const projects = inventory.projects.filter(
	(project) => project.scope === "target",
);
const files: { path: string; sha256: string; projects: string[] }[] = [];
const hash = (bytes: Buffer) =>
	createHash("sha256").update(bytes).digest("hex");
for (let start = 0; start < projects.length; start += 9) {
	const batch = projects.slice(start, start + 9);
	for (const mode of ["wide", "mobile", "lockups"] as const) {
		const tileWidth = mode === "mobile" ? 200 : 600;
		const tileHeight = mode === "wide" ? 240 : mode === "mobile" ? 200 : 160;
		const columns = mode === "mobile" ? 3 : 1;
		const width = tileWidth * 2 * columns;
		const rowHeight = tileHeight + 28;
		const layers: sharp.OverlayOptions[] = [];
		for (const [index, project] of batch.entries()) {
			const x = (index % columns) * tileWidth * 2;
			const y = Math.floor(index / columns) * rowHeight;
			layers.push({
				input: Buffer.from(
					`<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth * 2}" height="28"><text x="12" y="19" font-family="sans-serif" font-size="14" fill="#30372e">${project.id} · light / dark</text></svg>`,
				),
				left: x,
				top: y,
			});
			for (const [themeIndex, theme] of ["light", "dark"].entries()) {
				const file =
					mode === "lockups"
						? `lockup-${theme}.png`
						: `hero${mode === "mobile" ? "-square" : ""}${theme === "dark" ? "-dark" : ""}.webp`;
				const image = await sharp(`public/brands/${project.id}/v1.0.0/${file}`)
					.resize(tileWidth, tileHeight, {
						fit: "contain",
						background: theme === "light" ? "#f8f8f2" : "#1e2824",
					})
					.flatten({ background: theme === "light" ? "#f8f8f2" : "#1e2824" })
					.png()
					.toBuffer();
				layers.push({
					input: image,
					left: x + themeIndex * tileWidth,
					top: y + 28,
				});
			}
		}
		const path = `${mode}-${String(start / 9 + 1).padStart(2, "0")}.webp`;
		const bytes = await sharp({
			create: {
				width,
				height: Math.ceil(batch.length / columns) * rowHeight,
				channels: 3,
				background: "#f0f0e9",
			},
		})
			.composite(layers)
			.webp({ quality: 88 })
			.toBuffer();
		await writeFile(`${output}/${path}`, bytes);
		files.push({ path, sha256: hash(bytes), projects: batch.map((p) => p.id) });
	}
}
await writeFile(
	`${output}/contact-sheets.json`,
	`${JSON.stringify(
		{
			purpose:
				"Complete existing artwork and typography on both Hexly themes; contact sheets are scaled inspection composites, not campaign output masters",
			baseline: inventory.baseline,
			manifests: await Promise.all(
				projects.map(async (p) => {
					const path = `public/brands/${p.id}/v1.0.0/manifest.json`;
					return { project: p.id, path, sha256: hash(await readFile(path)) };
				}),
			),
			files,
		},
		null,
		"\t",
	)}\n`,
);
console.info(
	`Saved ${files.length} contact sheets covering ${projects.length} projects to ${output}`,
);
