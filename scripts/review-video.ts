import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { kitVersion, palettes } from "../packages/video-kit/src/brand";
import { parseVideoManifest } from "../packages/video-kit/src/schema";
import { videoHref } from "../src/model/videos";

const { values } = parseArgs({
	args: process.argv.slice(2).filter((arg) => arg !== "--"),
	options: {
		url: { type: "string", default: "http://127.0.0.1:7048" },
		out: { type: "string" },
		project: { type: "string", default: "bogo" },
	},
});
const origin = new URL(values.url);
if (!["127.0.0.1", "localhost", "index.dev.hexly.ai"].includes(origin.hostname))
	throw new Error("Review a local preview server.");
const output = resolve(
	values.out ??
		`.video-work/review-${new Date().toISOString().replace(/[:.]/g, "-")}`,
);
if (existsSync(output))
	throw new Error("Choose a fresh review output directory.");
if (output.startsWith(`${resolve("public")}/`))
	throw new Error("Keep review frames outside public/.");
mkdirSync(join(output, "frames"), { recursive: true });
const manifest = parseVideoManifest(
	JSON.parse(readFileSync("src/data/videos.json", "utf8")),
);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
	viewport: { width: 1600, height: 1100 },
	reducedMotion: "reduce",
});
const errors: string[] = [];
const movies: string[] = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
	if (/\.(mp4|webm)(\?|$)/.test(request.url())) movies.push(request.url());
});
const frames: {
	file: string;
	family: string;
	id: string;
	theme: string;
	sha256: string;
	overflow: string[];
}[] = [];
try {
	for (const family of ["openings", "templates", "endings"] as const) {
		for (const entry of manifest[family])
			for (const theme of manifest.themes) {
				const part =
					family === "openings"
						? "intro"
						: family === "endings"
							? "outro"
							: "content";
				const path = videoHref(
					entry.kind === "template" ? entry.id : "launch",
					values.project,
					"deck",
					{
						theme,
						opening: entry.kind === "opening" ? entry.id : "signal",
						ending: entry.kind === "ending" ? entry.id : "signature",
						part,
					},
				);
				await page.goto(new URL(path, origin).href);
				await page.locator(".vk-stage .vk-canvas").waitFor();
				await page.waitForFunction(() =>
					[
						...document.querySelectorAll(
							".vk-stage .vk-canvas, .vk-stage [data-scene='logo']",
						),
					].every((el) => getComputedStyle(el).opacity === "1"),
				);
				await page.evaluate(() => document.fonts.ready);
				const overflow = await page
					.locator(".vk-stage .vk-canvas")
					.evaluate((canvas) => {
						const box = canvas.getBoundingClientRect();
						return [
							...canvas.querySelectorAll(
								"[data-video-title], [data-video-body], [data-hexly-caption]",
							),
						]
							.filter((el) => {
								const rect = el.getBoundingClientRect();
								return (
									rect.left < box.left - 1 ||
									rect.right > box.right + 1 ||
									rect.top < box.top - 1 ||
									rect.bottom > box.bottom + 1
								);
							})
							.map((el) => el.textContent ?? "");
					});
				const file = `frames/${family}-${entry.id}-${theme}.png`;
				await page
					.locator(".vk-stage > div")
					.first()
					.screenshot({ path: join(output, file) });
				frames.push({
					file,
					family,
					id: entry.id,
					theme,
					overflow,
					sha256: createHash("sha256")
						.update(readFileSync(join(output, file)))
						.digest("hex"),
				});
			}
		const tiles = frames.filter((frame) => frame.family === family);
		const width = 600;
		const height = 338;
		const gutter = 20;
		const label = 36;
		const composites = await Promise.all(
			tiles.map(async (tile, i) => ({
				input: await sharp(
					await sharp(join(output, tile.file))
						.resize(width, height)
						.png()
						.toBuffer(),
				)
					.extend({
						top: label,
						bottom: 0,
						left: 0,
						right: 0,
						background: palettes.light.page,
					})
					.composite([
						{
							input: Buffer.from(
								`<svg width="${width}" height="${label}"><text x="0" y="23" font-family="sans-serif" font-size="15" fill="${palettes.light.ink}">${tile.id.toUpperCase()} / ${tile.theme.toUpperCase()}</text></svg>`,
							),
							top: 0,
							left: 0,
						},
					])
					.png()
					.toBuffer(),
				left: gutter + (i % 2) * (width + gutter),
				top: gutter + Math.floor(i / 2) * (height + label + gutter),
			})),
		);
		await sharp({
			create: {
				width: 2 * width + 3 * gutter,
				height: 5 * (height + label) + 6 * gutter,
				channels: 3,
				background: palettes.light.page,
			},
		})
			.composite(composites)
			.webp({ quality: 92 })
			.toFile(join(output, `${family}.webp`));
		process.stdout.write(`Reviewed ${family}: five designs in both themes.\n`);
	}
	await page.setViewportSize({ width: 320, height: 780 });
	await page.goto(
		new URL("/templates/columns?project=pew&mode=deck&theme=dark", origin).href,
	);
	await page.getByRole("button", { name: "Switch to Chinese" }).click();
	await page.locator(".vk-stage [data-video-title]").waitFor();
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({
		path: join(output, "mobile-zh.png"),
		fullPage: true,
	});
	if (
		await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
	)
		errors.push("Mobile document overflows.");
} finally {
	await browser.close();
}
const report = {
	kitVersion,
	project: values.project,
	frames,
	errors,
	movies,
	uniqueFrames: new Set(frames.map((frame) => frame.sha256)).size,
};
writeFileSync(
	join(output, "review.json"),
	`${JSON.stringify(report, null, 2)}\n`,
);
if (
	errors.length ||
	movies.length ||
	frames.some((frame) => frame.overflow.length) ||
	report.uniqueFrames !== 30
)
	throw new Error(`Review needs attention. See ${output}/review.json`);
process.stdout.write(
	`30 distinct stills, no overflowing text, no video requests. Inspect the contact sheets in ${output}\n`,
);
