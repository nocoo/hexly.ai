import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const study = dirname(fileURLToPath(import.meta.url));
const pass = process.argv[2] ?? "03";
const root = join(study, "finishing", pass);
const out = join(study, "inspection");
await mkdir(out, { recursive: true });
const nativeBytes = await readFile(join(study, "raw/generated.png"));
const rawSha256 = createHash("sha256").update(nativeBytes).digest("hex");
const native = await sharp(nativeBytes).ensureAlpha().raw().toBuffer();
const foreground = await sharp(join(root, "extracted-foreground.png"))
	.ensureAlpha()
	.raw()
	.toBuffer();
const width = 2048;
const pixels = width * width;
let opaquePixels = 0;
let changedOpaquePixels = 0;
for (let i = 0; i < pixels; i++) {
	if (foreground[i * 4 + 3] !== 255) continue;
	opaquePixels++;
	if ([0, 1, 2].some((c) => foreground[i * 4 + c] !== native[i * 4 + c]))
		changedOpaquePixels++;
}
if (changedOpaquePixels) throw new Error("Opaque foreground colors changed");

const artworkSamples = [
	["Warm gold", "暖金色", 1000, 600],
	["Sand facet", "砂色切面", 940, 540],
	["Ivory muzzle", "象牙色口鼻", 1260, 1200],
	["Dark markings", "深色斑纹", 650, 1080],
	["Coral bird", "珊瑚色纸鸟", 1690, 550],
	["Saffron wing", "藏红花色纸翼", 1855, 480],
	["Teal fold", "青绿色折面", 1790, 590],
].map(([label, zh, x, y]) => {
	const offset = (y * width + x) * 4;
	const rgb = [...native.subarray(offset, offset + 3)];
	const alpha = foreground[offset + 3];
	if (alpha !== 255) throw new Error(`Palette sample is not opaque: ${label}`);
	return {
		label,
		zh,
		x,
		y,
		rgb,
		hex: `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`,
		alpha,
	};
});

const visited = new Uint8Array(pixels);
const queue = new Int32Array(pixels);
const components = [];
for (let start = 0; start < pixels; start++) {
	if (visited[start] || foreground[start * 4 + 3] < 16) continue;
	let head = 0;
	let tail = 1;
	queue[0] = start;
	visited[start] = 1;
	const bounds = [width, width, 0, 0];
	while (head < tail) {
		const pixel = queue[head++];
		const x = pixel % width;
		const y = Math.floor(pixel / width);
		bounds[0] = Math.min(bounds[0], x);
		bounds[1] = Math.min(bounds[1], y);
		bounds[2] = Math.max(bounds[2], x);
		bounds[3] = Math.max(bounds[3], y);
		for (let dy = -1; dy <= 1; dy++)
			for (let dx = -1; dx <= 1; dx++) {
				const nx = x + dx;
				const ny = y + dy;
				const next = ny * width + nx;
				if (
					nx < 0 ||
					nx >= width ||
					ny < 0 ||
					ny >= width ||
					visited[next] ||
					foreground[next * 4 + 3] < 16
				)
					continue;
				visited[next] = 1;
				queue[tail++] = next;
			}
	}
	components.push({ pixels: tail, bounds });
}
components.sort((a, b) => b.pixels - a.pixels);

const radius = width * 0.23;
function clearance(x, y) {
	const dx = Math.abs(x + 0.5 - width / 2) - (width / 2 - radius);
	const dy = Math.abs(y + 0.5 - width / 2) - (width / 2 - radius);
	return (
		radius -
		Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) -
		Math.min(Math.max(dx, dy), 0)
	);
}
const protectedFeatures = [
	["Near ear", [105, 475, 640, 1060]],
	["Far ear", [835, 105, 1190, 525]],
	["Eyes, muzzle and whiskers", [700, 650, 1585, 1450]],
	["Complete paper bird", [1480, 285, 1970, 825]],
].map(([label, bounds]) => {
	let minimumClearance = Infinity;
	let clippedPixels = 0;
	let visiblePixels = 0;
	for (let y = bounds[1]; y <= bounds[3]; y++)
		for (let x = bounds[0]; x <= bounds[2]; x++) {
			if (foreground[(y * width + x) * 4 + 3] < 16) continue;
			visiblePixels++;
			const distance = clearance(x, y);
			minimumClearance = Math.min(minimumClearance, distance);
			if (distance < 0) clippedPixels++;
		}
	if (clippedPixels) throw new Error(`Protected feature is clipped: ${label}`);
	return {
		label,
		bounds,
		visiblePixels,
		minimumRoundedOutlineClearance: minimumClearance,
		clippedPixels,
	};
});
const exports = [];
for (const name of (await readdir(join(root, "exports"))).sort()) {
	const bytes = await readFile(join(root, "exports", name));
	const { data, info } = await sharp(bytes)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	let clearPixels = 0;
	let solidPixels = 0;
	for (let i = 3; i < data.length; i += 4) {
		if (data[i] === 0) clearPixels++;
		if (data[i] === 255) solidPixels++;
	}
	exports.push({
		path: `exports/${name}`,
		bytes: bytes.length,
		sha256: createHash("sha256").update(bytes).digest("hex"),
		width: info.width,
		height: info.height,
		clearPixels,
		solidPixels,
	});
}
const settings = JSON.parse(
	await readFile(join(root, "settings.json"), "utf8"),
);
const report = {
	pass,
	rawSha256,
	opaquePixels,
	changedOpaquePixels,
	artworkSamples,
	alphaComponentThreshold: 16,
	components,
	protectedFeatures,
	placement: {
		scale: 1,
		offset: [0, 0],
		intentionalBoundaryIntersections: ["bottom", "lower-left"],
		note: "The approved shoulder enters through the canvas. Protected features use the actual rounded outline; a global whole-body clearance rule does not apply.",
	},
	exports,
};
await writeFile(
	join(out, `finishing-${pass}.json`),
	`${JSON.stringify(report, null, 2)}\n`,
);
await writeFile(
	join(study, "palette.json"),
	`${JSON.stringify({ project: "ocelot", study: "2026-09-11-01", finishing: pass, nativeSource: { path: "raw/generated.png", sha256: rawSha256, width, height: width }, artworkSamples, presentation: { recipe: `finishing/${pass}/settings.json`, colors: settings.background }, applicationTheme: { revision: "8875681e705893181af21715edee51d418299d87", path: "src/views/styles.css", light: { primary: "#435e73", background: "#fefefd", rail: "#f3f5f7", ink: "#283440" }, dark: { primary: "#a3bbcd", background: "#151c24", rail: "#12161c", ink: "#d8e0e7" }, note: "Published navigation CSS tokens, separate from native artwork and designed presentation. Rail resolves the Basalt L0 background." } }, null, 2)}\n`,
);
const sizes = [128, 64, 48, 32, 24, 16];
const layers = [];
for (let row = 0; row < 4; row++) {
	const dark = row >= 2;
	const role = row % 2 ? "transparent" : "rounded";
	layers.push({
		input: Buffer.from(
			`<svg width="960" height="170"><rect width="960" height="170" fill="${dark ? "#151c24" : "#f5f7f9"}"/><text x="16" y="22" fill="${dark ? "#d8e0e7" : "#283440"}" font-family="sans-serif" font-size="14">${dark ? "Dark" : "Light"} ${role}</text></svg>`,
		),
		top: row * 170,
		left: 0,
	});
	for (let column = 0; column < sizes.length; column++) {
		const size = sizes[column];
		layers.push({
			input: join(root, `exports/ocelot-${role}-${size}.png`),
			top: row * 170 + 32 + Math.floor((128 - size) / 2),
			left: column * 160 + Math.floor((160 - size) / 2),
		});
	}
}
await sharp({
	create: { width: 960, height: 680, channels: 4, background: "white" },
})
	.composite(layers)
	.png()
	.toFile(join(out, `sizes-${pass}.png`));
console.log(
	JSON.stringify({
		opaquePixels,
		changedOpaquePixels,
		artworkSamples,
		components,
		protectedFeatures,
		exports: exports.length,
	}),
);
