import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const run = new URL("./", import.meta.url);
const raw = await readFile(new URL("raw/generated.png", run));
const { data: rgb, info } = await sharp(raw)
	.removeAlpha()
	.raw()
	.toBuffer({ resolveWithObject: true });
const { width, height } = info;
const alpha = await sharp(
	await readFile(new URL("finishing/01/alpha-mask.png", run)),
)
	.extractChannel(0)
	.raw()
	.toBuffer();
const seen = new Uint8Array(alpha.length);
const queue = new Uint32Array(alpha.length);
const components = [];
for (let seed = 0; seed < alpha.length; seed++) {
	if (!alpha[seed] || seen[seed]) continue;
	let head = 0;
	let tail = 1;
	queue[0] = seed;
	seen[seed] = 1;
	let left = width;
	let top = height;
	let right = 0;
	let bottom = 0;
	const samples = [];
	let minimumChannel = 255;
	let maximumChannel = 0;
	while (head < tail) {
		const index = queue[head++];
		const x = index % width;
		const y = Math.floor(index / width);
		left = Math.min(left, x);
		right = Math.max(right, x);
		top = Math.min(top, y);
		bottom = Math.max(bottom, y);
		const color = Array.from(rgb.subarray(index * 3, index * 3 + 3));
		minimumChannel = Math.min(minimumChannel, ...color);
		maximumChannel = Math.max(maximumChannel, ...color);
		if (samples.length < 5) samples.push({ x, y, rgb: color });
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
				const neighbor = ny * width + nx;
				if (!alpha[neighbor] || seen[neighbor]) continue;
				seen[neighbor] = 1;
				queue[tail++] = neighbor;
			}
		}
	}
	components.push({
		pixels: tail,
		bounds: { left, top, right, bottom },
		minimumChannel,
		maximumChannel,
		samples,
	});
}
components.sort((a, b) => b.pixels - a.pixels);
const removed = components.slice(1);
if (removed.some((component) => component.pixels >= 64))
	throw new Error("Inspect a new cleanup threshold before continuing.");
const tiles = [];
for (const [index, component] of removed.entries()) {
	const { left, top, right, bottom } = component.bounds;
	const x = Math.max(0, left - 6);
	const y = Math.max(0, top - 6);
	const crop = await sharp(raw)
		.extract({
			left: x,
			top: y,
			width: Math.min(width - x, right - x + 7),
			height: Math.min(height - y, bottom - y + 7),
		})
		.resize(128, 128, { fit: "contain", kernel: "nearest" })
		.png()
		.toBuffer();
	tiles.push({
		input: crop,
		left: (index % 6) * 144 + 8,
		top: Math.floor(index / 6) * 144 + 8,
	});
}
const directory = new URL("inspection/", run);
await mkdir(directory, { recursive: true });
const sheet = await sharp({
	create: {
		width: 864,
		height: Math.ceil(removed.length / 6) * 144,
		channels: 3,
		background: "#69815f",
	},
})
	.composite(tiles)
	.png()
	.toBuffer();
await writeFile(new URL("cleanup-01.png", directory), sheet);
const report = {
	sourceSha256: createHash("sha256").update(raw).digest("hex"),
	failedPass: "01",
	failure:
		"Rounded-clearance check failed at 57.8 px because isolated native background residue reached the top edge.",
	threshold: 64,
	retained: components[0],
	removedPixels: removed.reduce((sum, component) => sum + component.pixels, 0),
	removed,
	contactSheet: "cleanup-01.png",
	contactSheetOrder:
		"Descending component size, row-major; every crop includes six native pixels of context.",
};
await writeFile(
	new URL("cleanup-01.json", directory),
	`${JSON.stringify(report, null, "\t")}\n`,
);
console.log(
	JSON.stringify({
		retainedPixels: report.retained.pixels,
		removedRegions: removed.length,
		removedPixels: report.removedPixels,
		ranges: removed.map(({ minimumChannel, maximumChannel }) => [
			minimumChannel,
			maximumChannel,
		]),
	}),
);
