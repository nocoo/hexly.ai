import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const run = path.dirname(fileURLToPath(import.meta.url));
const source = await readFile(path.join(run, "raw/generated.png"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
if (
	sha256(source) !==
	"40919d744626f8def06dcc98ebfd7b85d3474e00387d7edf68b0591ca6b8a1db"
)
	throw new Error("This contour recipe belongs to the owner-approved Bogo 05.");
const { data, info } = await sharp(source)
	.removeAlpha()
	.raw()
	.toBuffer({ resolveWithObject: true });
const sample = ([x, y]) => {
	const sums = [0, 0, 0];
	for (let dy = -2; dy <= 2; dy++) {
		for (let dx = -2; dx <= 2; dx++) {
			const at = ((y + dy) * info.width + x + dx) * 3;
			for (let c = 0; c < 3; c++) sums[c] += data[at + c];
		}
	}
	return sums.map((value) => Math.round(value / 25));
};
const rgb = (value) => `rgb(${value.join(" ")})`;

// All coordinates below use the unchanged native drawing's coordinate space.
// New geometry lives beyond its borders; the approved extraction composites on top.
const facets = [
	{
		name: "left-ear-upper",
		points: [
			[1, 877],
			[-20, 899],
			[1, 897],
		],
		samples: [
			[5, 883],
			[5, 894],
		],
		axis: "y",
	},
	{
		name: "left-ear-lower",
		points: [
			[1, 895],
			[-20, 899],
			[1, 916],
		],
		samples: [
			[5, 898],
			[5, 909],
		],
		axis: "y",
	},
	{
		name: "horn-outer-tip",
		points: [
			[2046, 494],
			[2058, 512],
			[2046, 512],
		],
		samples: [
			[2043, 501],
			[2043, 507],
		],
		axis: "y",
	},
	{
		name: "horn-gold",
		points: [
			[2046, 510],
			[2058, 512],
			[2082, 545],
			[2098, 598],
			[2046, 556],
		],
		samples: [
			[2043, 520],
			[2043, 546],
		],
		axis: "y",
	},
	{
		name: "horn-return",
		points: [
			[2046, 554],
			[2098, 598],
			[2078, 688],
			[2046, 735],
		],
		samples: [
			[2043, 565],
			[2043, 716],
		],
		axis: "y",
	},
	{
		name: "ear-top",
		points: [
			[2046, 1042],
			[2093, 1107],
			[2138, 1176],
			[2046, 1088],
		],
		samples: [
			[2043, 1056],
			[2043, 1080],
		],
		axis: "y",
	},
	{
		name: "ear-fold",
		points: [
			[2046, 1086],
			[2138, 1176],
			[2110, 1201],
			[2046, 1186],
		],
		samples: [
			[2043, 1105],
			[2043, 1174],
		],
		axis: "y",
	},
	{
		name: "ear-lower",
		points: [
			[2046, 1184],
			[2110, 1201],
			[2046, 1226],
		],
		samples: [
			[2043, 1192],
			[2043, 1212],
		],
		axis: "y",
	},
	{
		name: "shoulder-top",
		points: [
			[2046, 1408],
			[2120, 1480],
			[2046, 1533],
		],
		samples: [
			[2043, 1424],
			[2043, 1524],
		],
		axis: "y",
	},
	{
		name: "shoulder-fold",
		points: [
			[2046, 1531],
			[2120, 1480],
			[2190, 1548],
			[2239, 1636],
			[2046, 1613],
		],
		samples: [
			[2043, 1546],
			[2043, 1603],
		],
		axis: "y",
	},
	{
		name: "shoulder-light",
		points: [
			[2046, 1611],
			[2239, 1636],
			[2338, 1800],
			[2118, 1876],
			[2046, 1756],
		],
		samples: [
			[2043, 1624],
			[2043, 1740],
		],
		axis: "y",
	},
	{
		name: "shoulder-mid",
		points: [
			[2046, 1754],
			[2118, 1876],
			[2046, 1905],
		],
		samples: [
			[2043, 1764],
			[2043, 1896],
		],
		axis: "y",
	},
	{
		name: "shoulder-lower",
		points: [
			[2046, 1903],
			[2118, 1876],
			[2338, 1800],
			[2380, 2390],
			[2046, 2390],
		],
		samples: [
			[2043, 1915],
			[2043, 2038],
		],
		axis: "y",
	},
];

const gradients = [];
const paths = [];
const evidence = [];
for (const facet of facets) {
	const colors = facet.samples.map(sample);
	const a = facet.samples[0];
	const b = facet.samples[1];
	gradients.push(
		`<linearGradient id="${facet.name}" gradientUnits="userSpaceOnUse" x1="${facet.axis === "x" ? a[0] : 0}" y1="${facet.axis === "y" ? a[1] : 0}" x2="${facet.axis === "x" ? b[0] : 0}" y2="${facet.axis === "y" ? b[1] : 0}"><stop stop-color="${rgb(colors[0])}"/><stop offset="1" stop-color="${rgb(colors[1])}"/></linearGradient>`,
	);
	paths.push(
		`<polygon points="${facet.points.map((point) => point.join(",")).join(" ")}" fill="url(#${facet.name})"/>`,
	);
	evidence.push({
		...facet,
		sampledRgb: colors,
		sampling: "Mean of a native 5 by 5 pixel patch",
	});
}

const scale = 1638 / 2048;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048"><title>Bogo 05 contour continuation</title><defs>${gradients.join("\n")}</defs><g transform="translate(195 410) scale(${scale})"><path fill="#533b2b" d="M2046 1408L2190 1548L2338 1800L2380 2390H2046Z"/>${paths.join("\n")}</g></svg>\n`;
await mkdir(path.join(run, "input"), { recursive: true });
await writeFile(path.join(run, "input/edge-continuation-03.svg"), svg, {
	flag: "wx",
});
await writeFile(
	path.join(run, "input/edge-continuation-03.json"),
	`${JSON.stringify(
		{
			method:
				"Local vector completion behind the uniformly placed approved extraction; no generation, cloned edge pixels, neck stretching, or repainting of the accepted opaque artwork.",
			source: { path: "../raw/generated.png", sha256: sha256(source) },
			placement: { width: 1638, left: 195, top: 410, nativeWidth: 2048 },
			geometry:
				"Small ear and horn contour tips plus a continuation of the already accepted shoulder through the lower frame.",
			facets: evidence,
			output: {
				path: "edge-continuation-03.svg",
				sha256: sha256(Buffer.from(svg)),
			},
		},
		null,
		"\t",
	)}\n`,
	{ flag: "wx" },
);
console.log(
	JSON.stringify({
		path: "input/edge-continuation-03.svg",
		sha256: sha256(Buffer.from(svg)),
	}),
);
