import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

function sha256(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}

function extractWhite(rgb, width, height, settings) {
	const count = width * height;
	const background = new Uint8Array(count);
	const queue = new Uint32Array(count);
	let head = 0;
	let tail = 0;
	const neighbors = (index, visit) => {
		const x = index % width;
		if (x > 0) visit(index - 1);
		if (x < width - 1) visit(index + 1);
		if (index >= width) visit(index - width);
		if (index < count - width) visit(index + width);
		if (x > 0 && index >= width) visit(index - width - 1);
		if (x < width - 1 && index >= width) visit(index - width + 1);
		if (x > 0 && index < count - width) visit(index + width - 1);
		if (x < width - 1 && index < count - width) visit(index + width + 1);
	};
	const visitWhite = (index) => {
		if (background[index]) return;
		const start = index * 3;
		const low = Math.min(rgb[start], rgb[start + 1], rgb[start + 2]);
		const high = Math.max(rgb[start], rgb[start + 1], rgb[start + 2]);
		if (low < settings.minimumChannel || high - low > settings.maximumChroma)
			return;
		background[index] = 1;
		queue[tail++] = index;
	};
	for (let x = 0; x < width; x++) {
		visitWhite(x);
		visitWhite((height - 1) * width + x);
	}
	for (let y = 1; y < height - 1; y++) {
		visitWhite(y * width);
		visitWhite(y * width + width - 1);
	}
	while (head < tail) neighbors(queue[head++], visitWhite);
	let backgroundPixels = tail;
	let removedComponents = 0;
	let removedComponentPixels = 0;
	if (settings.minimumComponentPixels > 0) {
		const seen = new Uint8Array(count);
		for (let start = 0; start < count; start++) {
			if (background[start] || seen[start]) continue;
			head = 0;
			tail = 0;
			const visitForeground = (index) => {
				if (background[index] || seen[index]) return;
				seen[index] = 1;
				queue[tail++] = index;
			};
			visitForeground(start);
			while (head < tail) neighbors(queue[head++], visitForeground);
			if (tail >= settings.minimumComponentPixels) continue;
			for (let index = 0; index < tail; index++) background[queue[index]] = 1;
			backgroundPixels += tail;
			removedComponentPixels += tail;
			removedComponents++;
		}
	}
	if (backgroundPixels < count * 0.1 || backgroundPixels > count * 0.95)
		throw new Error("Unexpected foreground coverage; inspect the white matte.");

	const distance = new Uint8Array(count).fill(255);
	head = 0;
	tail = 0;
	for (let index = 0; index < count; index++) {
		if (background[index]) {
			distance[index] = 0;
			continue;
		}
		neighbors(index, (neighbor) => {
			if (background[neighbor] && distance[index] === 255) {
				distance[index] = 1;
				queue[tail++] = index;
			}
		});
	}
	while (head < tail) {
		const index = queue[head++];
		if (distance[index] >= settings.interiorDistance) continue;
		neighbors(index, (neighbor) => {
			if (distance[neighbor] === 255) {
				distance[neighbor] = distance[index] + 1;
				queue[tail++] = neighbor;
			}
		});
	}

	const rgba = Buffer.alloc(count * 4);
	const alpha = Buffer.alloc(count);
	let softPixels = 0;
	let left = width;
	let top = height;
	let right = 0;
	let bottom = 0;
	for (let index = 0; index < count; index++) {
		if (background[index]) continue;
		const x = index % width;
		const y = Math.floor(index / width);
		const source = index * 3;
		let opacity = 1;
		if (distance[index] <= settings.edgeBand) {
			let nearest = -1;
			let bestDistance = Infinity;
			const radius = settings.searchRadius;
			for (let dy = -radius; dy <= radius; dy++) {
				for (let dx = -radius; dx <= radius; dx++) {
					const nx = x + dx;
					const ny = y + dy;
					const candidateDistance = dx * dx + dy * dy;
					if (
						nx < 0 ||
						nx >= width ||
						ny < 0 ||
						ny >= height ||
						candidateDistance >= bestDistance
					)
						continue;
					const candidate = ny * width + nx;
					if (distance[candidate] < settings.interiorDistance) continue;
					nearest = candidate;
					bestDistance = candidateDistance;
				}
			}
			if (nearest >= 0) {
				let dot = 0;
				let foregroundEnergy = 0;
				let observedEnergy = 0;
				for (let channel = 0; channel < 3; channel++) {
					const matte = settings.backgroundRgb[channel];
					const observed = matte - rgb[source + channel];
					const foreground = matte - rgb[nearest * 3 + channel];
					dot += observed * foreground;
					foregroundEnergy += foreground * foreground;
					observedEnergy += observed * observed;
				}
				const alignment = dot / Math.sqrt(foregroundEnergy * observedEnergy);
				if (
					foregroundEnergy > 0 &&
					(alignment >= settings.minimumColorAlignment ||
						observedEnergy < settings.maximumMatteEnergy)
				)
					opacity = Math.max(0.01, Math.min(1, dot / foregroundEnergy));
			}
		}
		alpha[index] = Math.round(opacity * 255);
		if (alpha[index] < 255) softPixels++;
		for (let channel = 0; channel < 3; channel++) {
			const matte = settings.backgroundRgb[channel];
			rgba[index * 4 + channel] = Math.max(
				0,
				Math.min(
					255,
					Math.round(matte + (rgb[source + channel] - matte) / opacity),
				),
			);
		}
		rgba[index * 4 + 3] = alpha[index];
		left = Math.min(left, x);
		top = Math.min(top, y);
		right = Math.max(right, x);
		bottom = Math.max(bottom, y);
	}
	return {
		rgba,
		alpha,
		statistics: {
			backgroundPixels,
			foregroundPixels: count - backgroundPixels,
			softEdgePixels: softPixels,
			removedComponents,
			removedComponentPixels,
			bounds: { left, top, right, bottom },
		},
	};
}

function backgroundSvg(size, colors) {
	const tones = {
		motif: { color: colors.motif, opacity: colors.motifOpacity },
		highlight: { color: "#ffffff", opacity: colors.highlightOpacity },
		ribbon: { color: "#ffffff", opacity: colors.ribbonOpacity },
	};
	if (!colors.pattern?.name || !colors.pattern.layers?.length)
		throw new Error("Provide a named, project-specific background pattern.");
	const layers = colors.pattern.layers.map(({ d, tone, strokeWidth }) => {
		const paint = tones[tone];
		if (!paint || !d)
			throw new Error("A background path needs a known tone and geometry.");
		return strokeWidth
			? `<path d="${d}" fill="none" stroke="${paint.color}" stroke-width="${strokeWidth}" opacity="${paint.opacity}"/>`
			: `<path d="${d}" fill="${paint.color}" opacity="${paint.opacity}"/>`;
	});
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
<title>${colors.pattern.name}</title>
<defs><radialGradient id="field" cx="26%" cy="14%" r="115%"><stop stop-color="${colors.light}"/><stop offset=".52" stop-color="${colors.base}"/><stop offset="1" stop-color="${colors.shade}"/></radialGradient></defs>
<path fill="url(#field)" d="M0 0h1024v1024H0z"/>
<g stroke-linecap="round">${layers.join("\n")}</g></svg>`;
}

async function makeShadow(alpha, width, height, settings) {
	const rgba = Buffer.alloc(width * height * 4);
	const scale = width / 2048;
	const [dx, dy] = settings.offsetAt2048.map((value) =>
		Math.round(value * scale),
	);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const nx = x + dx;
			const ny = y + dy;
			if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
			const target = (ny * width + nx) * 4;
			rgba[target] = settings.color[0];
			rgba[target + 1] = settings.color[1];
			rgba[target + 2] = settings.color[2];
			rgba[target + 3] = Math.round(alpha[y * width + x] * settings.opacity);
		}
	}
	return sharp(rgba, { raw: { width, height, channels: 4 } })
		.blur(Math.max(0.3, settings.blurAt2048 * scale))
		.png()
		.toBuffer();
}

async function placeLayer(bytes, width, height, framing = {}) {
	const scale = framing.scale ?? 1;
	const offset = framing.offsetAt2048 ?? [0, 0];
	if (offset.length !== 2 || offset.some((value) => !Number.isFinite(value)))
		throw new Error(
			"Placement offset must contain two finite pixel coordinates.",
		);
	if (scale === 1 && offset.every((value) => value === 0)) return bytes;
	const placedWidth = Math.round(width * scale);
	const placedHeight = Math.round(height * scale);
	const left =
		Math.floor((width - placedWidth) / 2) +
		Math.round((offset[0] * width) / 2048);
	const top =
		Math.floor((height - placedHeight) / 2) +
		Math.round((offset[1] * height) / 2048);
	const cropLeft = Math.max(0, -left);
	const cropTop = Math.max(0, -top);
	const cropWidth = Math.min(placedWidth - cropLeft, width - Math.max(0, left));
	const cropHeight = Math.min(
		placedHeight - cropTop,
		height - Math.max(0, top),
	);
	if (cropWidth <= 0 || cropHeight <= 0)
		throw new Error(
			"Placement moves the complete foreground outside the canvas.",
		);
	const resized =
		scale === 1
			? bytes
			: await sharp(bytes).resize(placedWidth, placedHeight).png().toBuffer();
	const placed =
		cropLeft ||
		cropTop ||
		cropWidth !== placedWidth ||
		cropHeight !== placedHeight
			? await sharp(resized)
					.extract({
						left: cropLeft,
						top: cropTop,
						width: cropWidth,
						height: cropHeight,
					})
					.png()
					.toBuffer()
			: resized;
	return sharp({
		create: {
			width,
			height,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.composite([
			{
				input: placed,
				left: Math.max(0, left),
				top: Math.max(0, top),
			},
		])
		.png()
		.toBuffer();
}

async function makeEmission(rgb, alpha, width, height, settings) {
	const mask = Buffer.alloc(width * height);
	const rgba = Buffer.alloc(width * height * 4);
	const factor = width / 2048;
	const [cx, cy, rx, ry] = settings.mask.ellipseAt2048.map(
		(value) => value * factor,
	);
	let selectedPixels = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const index = y * width + x;
			if (!alpha[index] || ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 1)
				continue;
			const [red, green, blue] = rgb.subarray(index * 3, index * 3 + 3);
			if (
				red < settings.mask.minimumRed ||
				green < settings.mask.minimumGreen ||
				blue > settings.mask.maximumBlue ||
				red - blue < settings.mask.minimumWarmth
			)
				continue;
			mask[index] = alpha[index];
			selectedPixels++;
		}
	}
	if (!selectedPixels)
		throw new Error(`Emission source mask is empty: ${settings.name}`);
	const softened = await sharp(mask, { raw: { width, height, channels: 1 } })
		.blur(settings.blurAt2048 * factor)
		.extractChannel(0)
		.raw()
		.toBuffer();
	if (softened.length !== width * height)
		throw new Error(`Unexpected emission mask channels: ${settings.name}`);
	let renderedAlpha = 0;
	for (let index = 0; index < width * height; index++) {
		for (let channel = 0; channel < 3; channel++)
			rgba[index * 4 + channel] = settings.color[channel];
		rgba[index * 4 + 3] = Math.round(softened[index] * settings.opacity);
		renderedAlpha += rgba[index * 4 + 3];
	}
	if (!renderedAlpha)
		throw new Error(`Rendered emission is empty: ${settings.name}`);
	return {
		mask: await sharp(mask, { raw: { width, height, channels: 1 } })
			.png()
			.toBuffer(),
		layer: await sharp(rgba, { raw: { width, height, channels: 4 } })
			.png()
			.toBuffer(),
		selectedPixels,
		renderedAlpha,
	};
}

function inspectPlacement(alpha, width, height, cornerRadius) {
	const radius = width * cornerRadius;
	let minimumClearance = Infinity;
	let clippedPixels = 0;
	const bounds = { left: width, top: height, right: 0, bottom: 0 };
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (alpha[y * width + x] < 16) continue;
			const qx = Math.abs(x + 0.5 - width / 2) - (width / 2 - radius);
			const qy = Math.abs(y + 0.5 - height / 2) - (height / 2 - radius);
			const clearance =
				radius -
				(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
					Math.min(Math.max(qx, qy), 0));
			minimumClearance = Math.min(minimumClearance, clearance);
			if (clearance < 0) clippedPixels++;
			bounds.left = Math.min(bounds.left, x);
			bounds.top = Math.min(bounds.top, y);
			bounds.right = Math.max(bounds.right, x);
			bounds.bottom = Math.max(bounds.bottom, y);
		}
	}
	return {
		bounds,
		visibleAlphaThreshold: 16,
		minimumRoundedEdgeClearance: minimumClearance,
		clippedPixels,
	};
}

const runArgument = process.argv[2];
const pass = process.argv[3];
if (!runArgument || !/^\d{2}$/.test(pass ?? ""))
	throw new Error(
		"Usage: bun finish_study.mjs <study-directory> <finishing-pass: 01>",
	);
const run = path.resolve(runArgument);
const response = JSON.parse(
	await readFile(path.join(run, "response.json"), "utf8"),
);
if (response.status !== "succeeded")
	throw new Error("No successful source generation.");
const reviewBytes = await readFile(path.join(run, "raw-review.json"));
const review = JSON.parse(reviewBytes);
if (
	review.status !== "approved" ||
	review.imageSha256 !== response.output.sha256
)
	throw new Error(
		"Owner approval of this exact raw image is required before finishing.",
	);
const settingsBytes = await readFile(path.join(run, "presentation.json"));
const settings = JSON.parse(settingsBytes);
const sourceBytes = await readFile(path.join(run, response.output.path));
if (sha256(sourceBytes) !== response.output.sha256)
	throw new Error("Raw output differs from its recorded generation hash.");
const destination = path.join(run, "finishing", pass);
try {
	await stat(destination);
	throw new Error("Finishing pass already exists; use a new number.");
} catch (error) {
	if (error.code !== "ENOENT") throw error;
}
const { data: rgb, info } = await sharp(sourceBytes)
	.removeAlpha()
	.toColourspace("srgb")
	.raw()
	.toBuffer({ resolveWithObject: true });
const { width, height } = info;
if (width !== height)
	throw new Error("This icon study requires a square master.");
const { rgba, alpha, statistics } = extractWhite(
	rgb,
	width,
	height,
	settings.matte,
);
await mkdir(path.join(destination, "exports"), { recursive: true });
await mkdir(path.join(destination, "previews"));
const files = [];
async function save(name, bytes) {
	await writeFile(path.join(destination, name), bytes);
	files.push({ path: name, bytes: bytes.length, sha256: sha256(bytes) });
}
await save("settings.json", settingsBytes);
await save("raw-review.json", reviewBytes);
await save("tool-snapshot.mjs", await readFile(new URL(import.meta.url)));
const foreground = await sharp(rgba, { raw: { width, height, channels: 4 } })
	.png()
	.toBuffer();
await save("extracted-foreground.png", foreground);
await save(
	"alpha-mask.png",
	await sharp(alpha, { raw: { width, height, channels: 1 } })
		.png()
		.toBuffer(),
);
const svg = backgroundSvg(width, settings.background);
await save("background.svg", Buffer.from(svg));
const backgroundRaw = await sharp(Buffer.from(svg))
	.removeAlpha()
	.raw()
	.toBuffer();
let noiseState = settings.background.grainSeed;
for (let index = 0; index < width * height; index++) {
	noiseState = (Math.imul(1664525, noiseState) + 1013904223) >>> 0;
	const noise =
		((noiseState / 4294967296) * 2 - 1) * settings.background.grainAmplitude;
	for (let channel = 0; channel < 3; channel++) {
		const offset = index * 3 + channel;
		backgroundRaw[offset] = Math.max(
			0,
			Math.min(255, Math.round(backgroundRaw[offset] + noise)),
		);
	}
}
const background = await sharp(backgroundRaw, {
	raw: { width, height, channels: 3 },
})
	.png()
	.toBuffer();
await save("background.png", background);
const placementScale = settings.framing?.scale ?? 1;
if (
	!Number.isFinite(placementScale) ||
	placementScale < 0.5 ||
	placementScale > 1
)
	throw new Error("Foreground placement scale must be between 0.5 and 1.");
const placedForeground = await placeLayer(
	foreground,
	width,
	height,
	settings.framing,
);
const placementChanged =
	placementScale !== 1 ||
	(settings.framing?.offsetAt2048 ?? []).some((value) => value !== 0);
const presentationAlpha = placementChanged
	? await sharp(placedForeground).extractChannel(3).raw().toBuffer()
	: alpha;
const placement = inspectPlacement(
	presentationAlpha,
	width,
	height,
	settings.cornerRadius,
);
const requiredClearance = settings.framing?.minimumClearanceAt2048;
if (
	requiredClearance !== undefined &&
	placement.minimumRoundedEdgeClearance < (requiredClearance * width) / 2048
)
	throw new Error(
		`Insufficient rounded-corner clearance: ${placement.minimumRoundedEdgeClearance.toFixed(1)} pixels`,
	);
if (placementChanged) {
	await save("foreground-placement.png", placedForeground);
	await save(
		"presentation-alpha-mask.png",
		await sharp(presentationAlpha, {
			raw: { width, height, channels: 1 },
		})
			.png()
			.toBuffer(),
	);
}
const shadows = [];
for (const [index, shadow] of settings.shadows.entries()) {
	const bytes = await makeShadow(presentationAlpha, width, height, shadow);
	await save(`shadow-${index + 1}.png`, bytes);
	shadows.push({ input: bytes });
}
const emissions = [];
const emissionReports = [];
for (const light of settings.emission ?? []) {
	if (!/^[a-z0-9-]+$/.test(light.name))
		throw new Error("Emission names must be lowercase filename-safe labels.");
	const result = await makeEmission(rgb, alpha, width, height, light);
	const layer = await placeLayer(result.layer, width, height, settings.framing);
	await save(`glow-${light.name}-mask.png`, result.mask);
	await save(`glow-${light.name}.png`, layer);
	emissions.push({ input: layer, blend: light.blend });
	emissionReports.push({
		name: light.name,
		selectedPixels: result.selectedPixels,
		renderedAlpha: result.renderedAlpha,
		maskCoordinates: "Native source pixels, before icon placement",
	});
}
const square = await sharp(background)
	.composite([...shadows, ...emissions, { input: placedForeground }])
	.png()
	.toBuffer();
const roundedMask = Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${width * settings.cornerRadius}" fill="white"/></svg>`,
);
const rounded = await sharp(square)
	.composite([{ input: roundedMask, blend: "dest-in" }])
	.png()
	.toBuffer();
for (const size of settings.exportSizes) {
	if (size > width)
		throw new Error("Exports may not upscale the native master.");
	for (const [kind, bytes] of [
		["transparent", placedForeground],
		["icon", square],
		["rounded", rounded],
	]) {
		const output =
			size === width
				? bytes
				: await sharp(bytes).resize(size, size).png().toBuffer();
		await save(`exports/${settings.project}-${kind}-${size}.png`, output);
	}
}
await save(
	`exports/${settings.project}-white-${width}.png`,
	await sharp(placedForeground)
		.flatten({ background: "#ffffff" })
		.png()
		.toBuffer(),
);
for (const [name, color] of [
	["light", "#f6f5ef"],
	["dark", "#17211d"],
]) {
	await save(
		`previews/on-${name}-1024.png`,
		await sharp(placedForeground)
			.flatten({ background: color })
			.resize(1024, 1024)
			.png()
			.toBuffer(),
	);
}
await save(
	"manifest.json",
	Buffer.from(
		`${JSON.stringify(
			{
				createdAt: new Date().toISOString(),
				pass,
				tool: "artwork/logo-family/tools/finish_study.mjs",
				toolSha256: sha256(await readFile(new URL(import.meta.url))),
				sharp: sharp.versions.sharp,
				input: {
					path: `../../${response.output.path}`,
					sha256: sha256(sourceBytes),
					width,
					height,
				},
				method:
					"Border-connected near-white extraction; recipe-specific edge alpha matting and color decontamination. Enclosed highlights and disconnected artwork are preserved. No global white deletion or subject cropping.",
				settings,
				statistics,
				placement: {
					scale: placementScale,
					offsetAt2048: settings.framing?.offsetAt2048 ?? [0, 0],
					...placement,
				},
				emission: emissionReports,
				files,
			},
			null,
			"\t",
		)}\n`,
	),
);
console.log(
	JSON.stringify(
		{
			destination,
			dimensions: [width, height],
			statistics,
			files: files.length,
		},
		null,
		2,
	),
);
