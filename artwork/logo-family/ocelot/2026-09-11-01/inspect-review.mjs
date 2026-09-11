import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";

const origin = "https://index.dev.hexly.ai";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const modes = ["icon", "transparent", "white"];
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function decodeImages(page) {
	await page.locator("img").evaluateAll(async (images) => {
		for (const image of images) image.loading = "eager";
		await Promise.all(images.map((image) => image.decode()));
	});
	await page.evaluate(() => document.fonts.ready);
}

// The established usage audit checks decoded alpha and the actual CSS size.
async function inspectMarks(page, selector) {
	const marks = page.locator(selector);
	await expect(marks).toHaveCount(4);
	const result = await marks.evaluateAll(async (images) =>
		Promise.all(
			images.map(async (image) => {
				await image.decode();
				const canvas = document.createElement("canvas");
				canvas.width = canvas.height = 32;
				const context = canvas.getContext("2d");
				context.drawImage(image, 0, 0, 32, 32);
				const pixels = context.getImageData(0, 0, 32, 32).data;
				let transparentPixels = 0;
				for (let at = 3; at < pixels.length; at += 4)
					if (pixels[at] === 0) transparentPixels++;
				const style = getComputedStyle(image);
				return {
					path: new URL(image.src).pathname,
					width: image.getBoundingClientRect().width,
					height: image.getBoundingClientRect().height,
					transparentPixels,
					radius: style.borderRadius,
					shadow: style.boxShadow,
					background: style.backgroundColor,
				};
			}),
		),
	);
	assert.deepEqual(
		result.map((mark) => mark.width),
		[32, 16, 24, 16],
	);
	for (const mark of result) {
		assert.equal(mark.height, mark.width);
		assert(mark.transparentPixels > 128);
		assert.equal(mark.radius, "0px");
		assert.equal(mark.shadow, "none");
		assert.equal(mark.background, "rgba(0, 0, 0, 0)");
	}
	return result;
}

try {
	for (const id of ["ocelot"]) {
		const project = JSON.parse(
			await readFile(`src/data/projects/${id}.json`, "utf8"),
		);
		const family = project.family;
		const study = `artwork/logo-family/${id}/${family.id}`;
		const evidence = `${study}/inspection/review-browser`;
		await mkdir(evidence, { recursive: true });
		const prompt = await readFile(`${study}/prompt.txt`, "utf8");
		const report = {
			checkedAt: new Date().toISOString(),
			origin,
			browser: browser.version(),
			cases: [],
			downloads: [],
			errors: [],
		};
		for (const [layout, viewport] of [
			["desktop", { width: 1440, height: 1000 }],
			["mobile", { width: 390, height: 844 }],
		]) {
			const context = await browser.newContext({
				viewport,
				locale: "en-US",
				colorScheme: "light",
				reducedMotion: "reduce",
				ignoreHTTPSErrors: true,
			});
			await context.grantPermissions(["clipboard-read", "clipboard-write"], {
				origin,
			});
			const page = await context.newPage();
			page.on("pageerror", (error) => report.errors.push(error.message));
			page.on("console", (message) => {
				if (message.type() === "error") report.errors.push(message.text());
			});
			for (const surface of ["catalogue", "static"]) {
				const isSite = surface === "catalogue";
				const route = isSite ? `/logos/${id}` : `/${study}/review.html`;
				const response = await page.goto(`${origin}${route}`);
				assert.equal(response.status(), 200);
				await page.locator(isSite ? ".artwork-image" : "#candidate").waitFor();
				await decodeImages(page);
				const markSelector = isSite
					? ".size-section .logo-plain img"
					: ".size-section img.foreground-mark";
				if (isSite) {
					await expect(page.locator(".previous-artwork img")).toHaveAttribute(
						"src",
						`${family.root}/previous-1024.webp`,
					);
					await expect(
						page.locator(".current-artwork figcaption"),
					).toContainText("Adopted family identity");
					await expect(page.locator(".reference-grid")).toHaveCount(0);
					await expect(
						page.getByText("View the presentation references", { exact: true }),
					).toHaveCount(0);
					if (id === "ocelot") {
						await expect(page.locator(".theme-palette")).toContainText(
							"#435e73",
						);
						await expect(page.locator(".theme-palette")).toContainText(
							"#fefefd",
						);
					} else await expect(page.locator(".theme-palette")).toHaveCount(0);
				} else {
					await expect(page.locator(".original-tile img")).toHaveAttribute(
						"src",
						family.previous.original,
					);
					const favicon = new URL(
						await page.locator('link[rel="icon"]').getAttribute("href"),
						page.url(),
					);
					assert(favicon.pathname.endsWith(`/${id}-transparent-16.png`));
					assert.equal(
						hash(await (await context.request.get(favicon.href)).body()),
						hash(await readFile(favicon.pathname.slice(1))),
					);
				}
				for (const theme of ["light", "dark"]) {
					if (theme === "dark")
						await page
							.locator(isSite ? ".theme-toggle" : "#theme-switch")
							.click();
					for (const locale of isSite ? ["en", "zh"] : ["en"]) {
						if (isSite) {
							const current = await page.locator("html").getAttribute("lang");
							if (current !== (locale === "zh" ? "zh-CN" : "en"))
								await page
									.getByRole("button", {
										name: locale === "zh" ? "Switch to Chinese" : "切换为英文",
										exact: true,
									})
									.click();
							await expect(page.locator("body")).toContainText(
								project.overview.goal[locale],
							);
						}
						await expect(
							page.locator(isSite ? "html" : "body"),
						).toHaveAttribute("data-theme", theme);
						const cases = [];
						for (const [index, mode] of modes.entries()) {
							await page.locator(".view-switch button").nth(index).click();
							await expect(
								page.locator(isSite ? ".logo-review" : "body"),
							).toHaveAttribute(
								isSite ? "data-presentation" : "data-view",
								mode,
							);
							await decodeImages(page);
							const target = isSite
								? `${family.root}/${mode === "transparent" ? "transparent" : mode}.png`
								: `./finishing/${family.finishing}/exports/${id}-${mode === "icon" ? "icon" : mode}-2048.png`;
							await expect(
								page.locator(
									isSite ? ".current-artwork .review-tile" : "#candidate-link",
								),
							).toHaveAttribute("href", target);
							cases.push({
								mode,
								marks: await inspectMarks(page, markSelector),
							});
						}
						await page.locator(".view-switch button").first().click();
						await decodeImages(page);
						await expect(page.locator(".alpha-grid img")).toHaveCount(2);
						if (isSite)
							for (const image of await page.locator(".alpha-grid img").all())
								await expect(image).toHaveAttribute(
									"src",
									family.foreground.display,
								);
						assert(
							await page.evaluate(
								() => document.documentElement.scrollWidth <= innerWidth + 1,
							),
						);
						const filename = `${surface}-${layout}-${locale}-${theme}.png`;
						if (
							!isSite ||
							(locale === "en" && theme === "light") ||
							(locale === "zh" && theme === "dark")
						)
							await page.screenshot({
								path: `${evidence}/${filename}`,
								fullPage: true,
								animations: "disabled",
							});
						report.cases.push({
							surface,
							layout,
							locale,
							theme,
							route,
							modes: cases,
							overflow: false,
						});
					}
				}
				const palette = page.locator(
					isSite ? ".palette-swatch" : ".swatches button",
				);
				await expect(palette).toHaveCount(family.palette.length);
				for (const [index, color] of family.palette.entries()) {
					await palette.nth(index).click();
					await expect
						.poll(() => page.evaluate(() => navigator.clipboard.readText()))
						.toBe(isSite ? color.color : color.color.toUpperCase());
				}
				await page
					.locator(
						isSite ? ".identity-archive summary" : ".archive details summary",
					)
					.first()
					.click();
				await expect(
					page.locator(isSite ? ".generation-prompt" : "#generation-prompt"),
				).toHaveText(prompt);
				if (!isSite) {
					await page
						.getByText("View the presentation references", { exact: true })
						.click();
					await expect(page.locator(".reference-grid img")).toHaveCount(4);
					await decodeImages(page);
				}
				const links = page.locator(".download-links a");
				await expect(links).toHaveCount(6);
				for (const link of await links.all()) {
					const url = new URL(await link.getAttribute("href"), page.url());
					const download = await context.request.get(url.href);
					assert.equal(download.status(), 200);
					const file = url.pathname.startsWith("/logos/")
						? `public${url.pathname}`
						: url.pathname.slice(1);
					const bytes = await download.body();
					assert.equal(hash(bytes), hash(await readFile(file)));
					if (layout === "desktop")
						report.downloads.push({
							surface,
							path: url.pathname,
							bytes: bytes.length,
							sha256: hash(bytes),
						});
				}
				const downloadEvent = page.waitForEvent("download");
				await links.first().click();
				const actualDownload = await downloadEvent;
				assert.equal(await actualDownload.failure(), null);
				assert.equal(
					hash(await readFile(await actualDownload.path())),
					family.foreground.sha256,
				);
				if (isSite) {
					await page.reload();
					await expect(page.locator("#identity-title")).toContainText(
						project.title,
					);
					assert.equal(new URL(page.url()).pathname, `/logos/${id}`);
					await page.goto(`${origin}/logos/coffee`);
					await page.goBack();
					await expect(page.locator("#identity-title")).toContainText(
						project.title,
					);
				}
				console.log(
					`${id}: ${surface} ${layout}, modes/themes, clipboard and exact downloads passed.`,
				);
			}
			await context.close();
		}
		assert.deepEqual(report.errors, []);
		report.status = "passed";
		await writeFile(
			`${evidence}/checks.json`,
			`${JSON.stringify(report, null, "\t")}\n`,
		);
	}
} finally {
	await browser.close();
}
