import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const run = new URL("./", import.meta.url);
const pass = "03";
const file = (name) => new URL(`finishing/${pass}/${name}`, run);
const raw = await readFile(new URL("raw/generated.png", run));
const rgb = await sharp(raw).removeAlpha().raw().toBuffer();
const extracted = await sharp(await readFile(file("extracted-foreground.png")))
	.ensureAlpha()
	.raw()
	.toBuffer();
let opaquePixels = 0;
let changedOpaquePixels = 0;
for (let index = 0; index < 2048 * 2048; index++) {
	if (extracted[index * 4 + 3] !== 255) continue;
	opaquePixels++;
	if (
		[0, 1, 2].some(
			(channel) => extracted[index * 4 + channel] !== rgb[index * 3 + channel],
		)
	)
		changedOpaquePixels++;
}
if (changedOpaquePixels)
	throw new Error("Opaque native artwork was recolored.");
let boardInteriorHoles = 0;
for (let y = 850; y < 1730; y++) {
	for (let x = 420; x < 1680; x++) {
		if (extracted[(y * 2048 + x) * 4 + 3] !== 255) boardInteriorHoles++;
	}
}
if (boardInteriorHoles)
	throw new Error("The slate or its lettering has alpha holes.");
const samples = [
	["Charcoal slate", 1080, 920],
	["Ivory stripe", 1000, 390],
	["White production marking", 850, 1250],
	["Brushed silver hinge", 500, 500],
].map(([label, x, y]) => {
	const index = y * 2048 + x;
	if (extracted[index * 4 + 3] !== 255)
		throw new Error(`Pale surface erased: ${label}`);
	const color = Array.from(rgb.subarray(index * 3, index * 3 + 3));
	return {
		label,
		x,
		y,
		rgb: color,
		hex: `#${color.map((value) => value.toString(16).padStart(2, "0")).join("")}`,
		alpha: 255,
	};
});
const sizes = [2048, 1024, 512, 256, 128, 64, 48, 32, 24, 16];
const exports = [];
for (const size of sizes) {
	for (const kind of ["transparent", "icon", "rounded"]) {
		const name = `exports/showtime-${kind}-${size}.png`;
		const bytes = await readFile(file(name));
		const metadata = await sharp(bytes).metadata();
		if (metadata.width !== size || metadata.height !== size)
			throw new Error(`Wrong dimensions: ${name}`);
		exports.push({
			path: name,
			width: size,
			height: size,
			bytes: bytes.length,
			sha256: createHash("sha256").update(bytes).digest("hex"),
		});
	}
}
const manifest = JSON.parse(await readFile(file("manifest.json"), "utf8"));
if (
	manifest.placement.clippedPixels ||
	manifest.placement.minimumRoundedEdgeClearance < 128
)
	throw new Error("Invalid rounded placement.");
const composites = [];
const widths = [128, 64, 48, 32, 24, 16];
for (const [row, color] of ["#f6f5ef", "#17211d"].entries()) {
	for (const [column, size] of widths.entries()) {
		for (const [variant, kind] of ["icon", "transparent"].entries()) {
			const bytes = await readFile(
				file(`exports/showtime-${kind}-${size}.png`),
			);
			const panel = await sharp({
				create: { width: 154, height: 154, channels: 3, background: color },
			})
				.composite([
					{
						input: bytes,
						left: Math.floor((154 - size) / 2),
						top: Math.floor((154 - size) / 2),
					},
				])
				.png()
				.toBuffer();
			composites.push({
				input: panel,
				left: column * 160,
				top: (row * 2 + variant) * 160,
			});
		}
	}
}
const directory = new URL("inspection/", run);
await mkdir(directory, { recursive: true });
const sheet = await sharp({
	create: { width: 960, height: 640, channels: 3, background: "#728568" },
})
	.composite(composites)
	.png()
	.toBuffer();
await writeFile(new URL("sizes-03.png", directory), sheet);
const report = {
	pass,
	rawSha256: createHash("sha256").update(raw).digest("hex"),
	opaquePixels,
	changedOpaquePixels,
	boardInteriorHoles,
	samples,
	placement: manifest.placement,
	exports,
	sizeSheet: "sizes-03.png",
	sizeSheetColumns: widths,
	sizeSheetRows: [
		"Light presentation",
		"Light transparent",
		"Dark presentation",
		"Dark transparent",
	],
};
await writeFile(
	new URL("finishing-03.json", directory),
	`${JSON.stringify(report, null, "\t")}\n`,
);
console.log(
	JSON.stringify(
		{
			opaquePixels,
			changedOpaquePixels,
			boardInteriorHoles,
			samples,
			exportCount: exports.length,
			placement: report.placement,
		},
		null,
		2,
	),
);
