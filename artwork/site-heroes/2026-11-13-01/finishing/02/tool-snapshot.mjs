import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const matte = [252, 252, 252];

export function extractMatte(rgb, width, height) {
	assert.equal(rgb.length, width * height * 3);
	assert(width > 0 && height > 0);
	const count = width * height;
	const background = new Uint8Array(count);
	const queue = new Uint32Array(count);
	let head = 0;
	let tail = 0;
	const neighbors = (index, visit) => {
		const x = index % width;
		if (x > 0) visit(index - 1);
		if (x + 1 < width) visit(index + 1);
		if (index >= width) visit(index - width);
		if (index + width < count) visit(index + width);
	};
	const visit = (index) => {
		if (background[index]) return;
		const at = index * 3;
		const low = Math.min(rgb[at], rgb[at + 1], rgb[at + 2]);
		const high = Math.max(rgb[at], rgb[at + 1], rgb[at + 2]);
		if (low < 247 || high - low > 7) return;
		background[index] = 1;
		queue[tail++] = index;
	};
	for (let x = 0; x < width; x++) {
		visit(x);
		visit((height - 1) * width + x);
	}
	for (let y = 0; y < height; y++) {
		visit(y * width);
		visit(y * width + width - 1);
	}
	while (head < tail) neighbors(queue[head++], visit);
	assert(
		tail > count * 0.1 && tail < count * 0.95,
		"Inspect the foreground coverage",
	);
	let backgroundPixels = tail;
	let removedComponents = 0;
	let removedPixels = 0;
	const seen = new Uint8Array(count);
	for (let start = 0; start < count; start++) {
		if (background[start] || seen[start]) continue;
		head = 0;
		tail = 0;
		const foreground = (index) => {
			if (background[index] || seen[index]) return;
			seen[index] = 1;
			queue[tail++] = index;
		};
		foreground(start);
		while (head < tail) neighbors(queue[head++], foreground);
		if (tail >= 16) continue;
		for (let index = 0; index < tail; index++) background[queue[index]] = 1;
		backgroundPixels += tail;
		removedPixels += tail;
		removedComponents++;
	}
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
		if (distance[index] >= 4) continue;
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
	let opaquePixels = 0;
	for (let index = 0; index < count; index++) {
		if (background[index]) continue;
		let opacity = 1;
		const at = index * 3;
		if (distance[index] <= 2) {
			const x = index % width;
			const y = Math.floor(index / width);
			let nearest = -1;
			let best = Infinity;
			for (let dy = -6; dy <= 6; dy++) {
				for (let dx = -6; dx <= 6; dx++) {
					const nx = x + dx;
					const ny = y + dy;
					const squared = dx * dx + dy * dy;
					if (
						nx < 0 ||
						nx >= width ||
						ny < 0 ||
						ny >= height ||
						squared >= best
					)
						continue;
					const candidate = ny * width + nx;
					if (distance[candidate] < 4) continue;
					nearest = candidate;
					best = squared;
				}
			}
			if (nearest >= 0) {
				let dot = 0;
				let energy = 0;
				let observedEnergy = 0;
				for (let channel = 0; channel < 3; channel++) {
					const observed = matte[channel] - rgb[at + channel];
					const foreground = matte[channel] - rgb[nearest * 3 + channel];
					dot += observed * foreground;
					energy += foreground * foreground;
					observedEnergy += observed * observed;
				}
				if (energy > 0 && dot / Math.sqrt(energy * observedEnergy) >= 0.98)
					opacity = Math.max(0.02, Math.min(1, dot / energy));
			}
		}
		const value = Math.round(opacity * 255);
		alpha[index] = value;
		if (value === 255) opaquePixels++;
		else softPixels++;
		for (let channel = 0; channel < 3; channel++) {
			rgba[index * 4 + channel] =
				value === 255
					? rgb[at + channel]
					: Math.max(
							0,
							Math.min(
								255,
								Math.round(
									matte[channel] +
										(rgb[at + channel] - matte[channel]) / opacity,
								),
							),
						);
		}
		rgba[index * 4 + 3] = value;
	}
	return {
		rgba,
		alpha,
		statistics: {
			backgroundPixels,
			opaquePixels,
			softPixels,
			removedComponents,
			removedPixels,
		},
	};
}

async function main() {
	const root = path.resolve(import.meta.dirname);
	const pass = path.join(root, "finishing/02");
	const publicRoot = path.resolve("public/brands/hexly-ai/v1.0.1/headers");
	await mkdir(path.dirname(pass), { recursive: true });
	await mkdir(pass);
	await mkdir(publicRoot, { recursive: true });
	const files = [];
	for (const [page, study] of [
		["projects", path.join(root, "projects")],
		["templates", path.resolve(root, "../2026-11-13-02/templates")],
		["brand", path.join(root, "brand")],
		["status", path.join(root, "status")],
	]) {
		const response = JSON.parse(
			await readFile(path.join(study, "response.json"), "utf8"),
		);
		const review = JSON.parse(
			await readFile(path.join(study, "raw-review.json"), "utf8"),
		);
		assert.equal(review.status, "approved");
		assert.equal(review.imageSha256, response.output.sha256);
		const source = await readFile(path.join(study, response.output.path));
		assert.equal(hash(source), response.output.sha256);
		const { data: rgb, info } = await sharp(source)
			.removeAlpha()
			.toColourspace("srgb")
			.raw()
			.toBuffer({ resolveWithObject: true });
		assert.equal(info.width, 1536);
		assert.equal(info.height, 1024);
		const result = extractMatte(rgb, info.width, info.height);
		for (let x = 0; x < info.width; x++) {
			assert.equal(result.alpha[x], 0);
			assert.equal(result.alpha[(info.height - 1) * info.width + x], 0);
		}
		for (let y = 0; y < info.height; y++) {
			assert.equal(result.alpha[y * info.width], 0);
			assert.equal(result.alpha[y * info.width + info.width - 1], 0);
		}
		assert.equal(
			result.alpha[512 * info.width + 768],
			255,
			`${page}: preserve the solid center`,
		);
		const transparent = await sharp(result.rgba, {
			raw: { width: info.width, height: info.height, channels: 4 },
		})
			.png()
			.toBuffer();
		const directory = path.join(pass, page);
		await mkdir(directory);
		await writeFile(path.join(directory, "transparent.png"), transparent);
		await sharp(result.alpha, {
			raw: { width: info.width, height: info.height, channels: 1 },
		})
			.png()
			.toFile(path.join(directory, "alpha-mask.png"));
		for (const [theme, background] of [
			["light", "#f0f0e9"],
			["dark", "#1e2824"],
		]) {
			await sharp(transparent)
				.flatten({ background })
				.resize(768)
				.png()
				.toFile(path.join(directory, `on-${theme}.png`));
		}
		const delivery = await sharp(transparent)
			.resize(960)
			.webp({ lossless: true })
			.toBuffer();
		await writeFile(path.join(directory, "hero-960.webp"), delivery);
		await writeFile(path.join(publicRoot, `${page}-960.webp`), delivery, {
			flag: "wx",
		});
		await writeFile(path.join(publicRoot, `${page}.png`), transparent, {
			flag: "wx",
		});
		files.push({
			page,
			source: path.relative(root, path.join(study, response.output.path)),
			sourceSha256: hash(source),
			width: info.width,
			height: info.height,
			transparentSha256: hash(transparent),
			delivery: `/brands/hexly-ai/v1.0.1/headers/${page}-960.webp`,
			deliverySha256: hash(delivery),
			deliveryBytes: delivery.length,
			...result.statistics,
		});
		console.log(
			`${page}: transparent master and 960px delivery saved; ${result.statistics.opaquePixels} opaque source pixels preserved.`,
		);
	}
	await writeFile(
		path.join(pass, "tool-snapshot.mjs"),
		await readFile(import.meta.filename),
	);
	await writeFile(
		path.join(pass, "manifest.json"),
		`${JSON.stringify({ createdAt: new Date().toISOString(), generationCalls: 0, method: "Exterior-connected near-white extraction with two-pixel local edge matting. Enclosed pale material remains opaque; no native repositioning, crop or recolor.", matte: { minimumChannel: 247, maximumChroma: 7, red: 252, green: 252, blue: 252 }, toolSha256: hash(await readFile(import.meta.filename)), files, publication: "Local preview only; not uploaded." }, null, "\t")}\n`,
	);
}

if (import.meta.main) await main();
