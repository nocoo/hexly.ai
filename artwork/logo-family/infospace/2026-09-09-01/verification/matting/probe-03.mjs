import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import sharp from "sharp";

const study = path.resolve(import.meta.dirname, "../..");
const output = import.meta.dirname;
const source = await readFile(path.join(study, "raw/generated.png"));
const tool = await readFile(
	path.join(study, "../../tools/finish_study.mjs"),
	"utf8",
);
const extract = vm.runInNewContext(
	`${tool.slice(tool.indexOf("function extractWhite("), tool.indexOf("function backgroundSvg("))}\nextractWhite;`,
	{ Buffer },
);
const { data: rgb, info } = await sharp(source)
	.removeAlpha()
	.toColourspace("srgb")
	.raw()
	.toBuffer({ resolveWithObject: true });
const { width, height } = info;
const pixel = (x, y) =>
	Array.from(rgb.subarray((y * width + x) * 3, (y * width + x) * 3 + 3));
const luminance = (x, y) => {
	const [r, g, b] = pixel(x, y);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Local Vision supplies a measured interior silhouette, not replacement RGB.
// A row-filled contour is valid for this closed physical tray with no holes.
const visionBytes = await readFile(path.join(output, "vision-mask.png"));
const vision = await sharp(visionBytes).extractChannel(0).raw().toBuffer();
const leftEdge = [];
const rightEdge = [];
for (let y = 0; y < height; y++) {
	let left = -1;
	let right = -1;
	for (let x = 0; x < width; x++) {
		if (vision[y * width + x] < 240) continue;
		if (left < 0) left = x;
		right = x;
	}
	if (left >= 0 && right - left > 8) {
		leftEdge.push([Math.max(0, left - 1), y]);
		rightEdge.push([Math.min(width - 1, right + 1), y]);
	}
}
const refine = (edge, direction) => {
	const refined = edge.map(([hint, y]) => {
		let bestX = hint;
		let bestGradient = -Infinity;
		for (let x = hint - 10; x <= hint + 10; x++) {
			if (x < 3 || x >= width - 3) continue;
			const gradient = direction * (luminance(x + 1, y) - luminance(x - 1, y));
			if (gradient > bestGradient) {
				bestGradient = gradient;
				bestX = x;
			}
		}
		return [bestX + 0.5, y];
	});
	return refined.map(([x, y], index) => {
		if (index < 4 || index >= refined.length - 4) return [x, y];
		const neighborhood = refined
			.slice(index - 2, index + 3)
			.map((point) => point[0])
			.sort((a, b) => a - b);
		return [neighborhood[2], y];
	});
};
const points = [...refine(leftEdge, -1), ...refine(rightEdge, 1).reverse()];
const protectionSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048"><title>InfoSpace foreground protection diagnostic</title><rect width="2048" height="2048" fill="black"/><polygon points="${points.map((point) => point.join(",")).join(" ")}" fill="white"/></svg>`;
const protection = await sharp(Buffer.from(protectionSvg))
	.extractChannel(0)
	.raw()
	.toBuffer();
const settings = {
	minimumChannel: 50,
	maximumChroma: 16,
	backgroundRgb: [251, 251, 252],
	edgeBand: 2,
	interiorDistance: 4,
	searchRadius: 7,
	minimumColorAlignment: 0.98,
	maximumMatteEnergy: 500,
	minimumComponentPixels: 0,
	foregroundRegionsAt2048: [
		{
			name: "Opaque physical tray interior from measured local Vision confidence",
			points,
		},
	],
	calibrationNote:
		"Exterior-connected low-chroma matte and contact-shadow removal, with an interior protection contour derived from local macOS Vision confidence >= 240 and an outward native luminance-gradient search within ten pixels of the confidence edge and a five-row median. The closed tray has no background holes. This protects neutral reflections and opaque metal/paper without changing source colors; the outer-eight-pixel background mode remains separate.",
};
const result = extract(rgb, width, height, settings, protection);
await mkdir(output, { recursive: true });
const foreground = await sharp(result.rgba, {
	raw: { width, height, channels: 4 },
})
	.png()
	.toBuffer();
await writeFile(
	path.join(output, "probe-03-settings.json"),
	`${JSON.stringify(settings, null, "\t")}\n`,
);
await writeFile(path.join(output, "probe-03-protection.svg"), protectionSvg);
await writeFile(path.join(output, "probe-03-transparent.png"), foreground);
for (const [name, background] of [
	["dark", "#17211d"],
	["light", "#f6f5ef"],
]) {
	await sharp(foreground)
		.flatten({ background })
		.resize(1024)
		.png()
		.toFile(path.join(output, `probe-03-${name}.png`));
}
await sharp(foreground)
	.flatten({ background: "#17211d" })
	.extract({ left: 1340, top: 1440, width: 420, height: 320 })
	.resize(840, 640)
	.png()
	.toFile(path.join(output, "probe-03-lower-edge.png"));
const samples = [
	[1690, 1550],
	[1700, 1550],
	[1500, 1690],
	[1500, 1696],
	[1500, 1700],
	[1250, 1640],
	[700, 700],
	[1420, 650],
	[760, 1050],
	[1450, 1100],
];
let opaquePixels = 0;
let opaqueDifferences = 0;
for (let i = 0; i < width * height; i++) {
	if (result.alpha[i] !== 255) continue;
	opaquePixels++;
	if (
		result.rgba[i * 4] !== rgb[i * 3] ||
		result.rgba[i * 4 + 1] !== rgb[i * 3 + 1] ||
		result.rgba[i * 4 + 2] !== rgb[i * 3 + 2]
	)
		opaqueDifferences++;
}
const report = {
	sourceSha256: createHash("sha256").update(source).digest("hex"),
	toolSha256: createHash("sha256").update(tool).digest("hex"),
	statistics: result.statistics,
	opaquePixels,
	opaqueDifferences,
	samples: samples.map(([x, y]) => ({
		pixel: [x, y],
		rgb: pixel(x, y),
		alpha: result.alpha[y * width + x],
	})),
	protection: {
		method: "Local macOS Vision interior mask",
		threshold: 240,
		gradientSearchRadius: 10,
		medianRows: 5,
		points: points.length,
		maskSha256: createHash("sha256").update(visionBytes).digest("hex"),
	},
};
await writeFile(
	path.join(output, "probe-03-report.json"),
	`${JSON.stringify(report, null, "\t")}\n`,
);
console.log(JSON.stringify(report));
