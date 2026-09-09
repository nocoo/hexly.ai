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

// The gray reflection belongs to the right wall. Protect its interior up to
// the measured outward luminance transition; do not protect the floor shadow.
const trace = [];
for (let y = 430; y <= 1610; y += 2) {
	let outer = width - 4;
	while (outer > 1500 && Math.min(...pixel(outer, y)) >= 240) outer--;
	let strongest = -Infinity;
	let edge = outer;
	for (let x = Math.max(1500, outer - 65); x <= outer; x++) {
		const gradient = luminance(x + 2, y) - luminance(x - 2, y);
		if (gradient > strongest) {
			strongest = gradient;
			edge = x;
		}
	}
	trace.push({ x: edge - 2, y, gradient: strongest });
}
const points = [[1510, 430], ...trace.map(({ x, y }) => [x, y]), [1490, 1520]];
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
		{ name: "Opaque gray reflection on the right metal wall", points },
	],
	calibrationNote:
		"Exterior-connected low-chroma matte and contact-shadow removal. A native contour-following protection region keeps the right wall's opaque neutral-metal reflection. The background mode is sampled from the outer eight pixels; interior paper, dividers and recesses are not reachable from the exterior.",
};
const result = extract(rgb, width, height, settings, protection);
await mkdir(output, { recursive: true });
const foreground = await sharp(result.rgba, {
	raw: { width, height, channels: 4 },
})
	.png()
	.toBuffer();
await writeFile(
	path.join(output, "probe-01-settings.json"),
	`${JSON.stringify(settings, null, "\t")}\n`,
);
await writeFile(path.join(output, "probe-01-protection.svg"), protectionSvg);
await writeFile(path.join(output, "probe-01-transparent.png"), foreground);
for (const [name, background] of [
	["dark", "#17211d"],
	["light", "#f6f5ef"],
]) {
	await sharp(foreground)
		.flatten({ background })
		.resize(1024)
		.png()
		.toFile(path.join(output, `probe-01-${name}.png`));
}
await sharp(foreground)
	.flatten({ background: "#17211d" })
	.extract({ left: 1340, top: 1440, width: 420, height: 320 })
	.resize(840, 640)
	.png()
	.toFile(path.join(output, "probe-01-lower-edge.png"));
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
	traceSample: trace.filter(({ y }) =>
		[430, 700, 1000, 1300, 1500, 1550, 1610].includes(y),
	),
};
await writeFile(
	path.join(output, "probe-01-report.json"),
	`${JSON.stringify(report, null, "\t")}\n`,
);
console.log(JSON.stringify(report));
