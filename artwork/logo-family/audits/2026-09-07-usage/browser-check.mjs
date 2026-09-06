import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";

const directory = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(directory, "../../../..");
const screenshots = path.join(directory, "browser");
const origin = "https://index.dev.hexly.ai";
const projects = JSON.parse(
	await readFile(path.join(site, "src/data/projects.json"), "utf8"),
).filter((project) =>
	["frogie", "pew", "firefly", "bogo"].includes(project.id),
);
const report = { checkedAt: new Date().toISOString(), cases: [], source: [] };
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
await mkdir(screenshots, { recursive: true });

async function inspectMarks(page, selector) {
	const marks = page.locator(selector);
	await expect(marks).toHaveCount(4);
	const readings = await marks.evaluateAll(async (images) => {
		return Promise.all(
			images.map(async (image) => {
				await image.decode();
				const canvas = document.createElement("canvas");
				canvas.width = canvas.height = 32;
				const context = canvas.getContext("2d");
				context.drawImage(image, 0, 0, 32, 32);
				const pixels = context.getImageData(0, 0, 32, 32).data;
				let transparentPixels = 0;
				for (let index = 3; index < pixels.length; index += 4) {
					if (pixels[index] === 0) transparentPixels += 1;
				}
				const style = getComputedStyle(image);
				const bounds = image.getBoundingClientRect();
				return {
					source: new URL(image.src).pathname,
					width: bounds.width,
					height: bounds.height,
					transparentPixels,
					borderRadius: style.borderRadius,
					boxShadow: style.boxShadow,
					background: style.backgroundColor,
				};
			}),
		);
	});
	for (const reading of readings) {
		assert.ok(reading.transparentPixels > 128);
		assert.equal(reading.borderRadius, "0px");
		assert.equal(reading.boxShadow, "none");
		assert.equal(reading.background, "rgba(0, 0, 0, 0)");
	}
	assert.deepEqual(
		readings.map((reading) => reading.width),
		[32, 16, 24, 16],
	);
	return readings;
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
	for (const [device, viewport] of [
		["desktop", { width: 1440, height: 1000 }],
		["mobile", { width: 390, height: 844 }],
	]) {
		for (const project of projects) {
			const context = await browser.newContext({
				viewport,
				ignoreHTTPSErrors: true,
				locale: "en-US",
				colorScheme: "light",
				reducedMotion: "reduce",
			});
			const page = await context.newPage();
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			for (const surface of ["site", "static"]) {
				const route =
					surface === "site"
						? `/logos/${project.id}`
						: `/artwork/logo-family/${project.id}/${project.family.id}/review.html`;
				const response = await page.goto(`${origin}${route}`);
				assert.equal(response.status(), 200);
				const selector =
					surface === "site"
						? ".size-section .logo-plain img"
						: ".size-section img.foreground-mark";
				if (surface === "site") {
					await expect(
						page.locator(".current-artwork figcaption"),
					).toContainText("Adopted family identity");
					await expect(page.locator(".reference-grid")).toHaveCount(0);
				} else {
					const iconPath = await page
						.locator('link[rel="icon"]')
						.getAttribute("href");
					assert.match(iconPath, /-transparent-32\.png$/);
					const iconResponse = await page.request.get(
						new URL(iconPath, page.url()).href,
					);
					assert.equal(iconResponse.status(), 200);
					const expected = await readFile(
						path.join(
							site,
							`artwork/logo-family/${project.id}/${project.family.id}/finishing/${project.family.finishing}/exports/${project.id}-transparent-32.png`,
						),
					);
					assert.equal(sha256(await iconResponse.body()), sha256(expected));
				}
				for (const theme of ["light", "dark"]) {
					if (theme === "dark") {
						await (surface === "site"
							? page.getByRole("button", {
									name: "Switch to dark theme",
									exact: true,
								})
							: page.locator("#theme-switch")
						).click();
					}
					const marks = await inspectMarks(page, selector);
					await page.locator(".size-section").screenshot({
						path: path.join(
							screenshots,
							`${project.id}-${surface}-${device}-${theme}.png`,
						),
						animations: "disabled",
					});
					const overflow = await page.evaluate(
						() => document.documentElement.scrollWidth - window.innerWidth,
					);
					assert.ok(overflow <= 1);
					report.cases.push({
						project: project.id,
						surface,
						device,
						theme,
						route,
						marks,
						overflow,
					});
				}
				for (const mode of ["transparent", "white", "icon"]) {
					const label = mode[0].toUpperCase() + mode.slice(1);
					await (surface === "site"
						? page.getByRole("button", { name: label, exact: true })
						: page.locator(`button[data-view="${mode}"]`)
					).click();
					await inspectMarks(page, selector);
				}
				console.info(
					`${project.id}: ${surface} ${device} light/dark and all large-view modes passed`,
				);
			}
			assert.deepEqual(errors, []);
			await context.close();
		}
	}

	const context = await browser.newContext({
		ignoreHTTPSErrors: true,
		viewport: { width: 1440, height: 1000 },
		colorScheme: "light",
		reducedMotion: "reduce",
	});
	const page = await context.newPage();
	await page.goto("https://bogo.dev.hexly.ai");
	for (const state of ["expanded", "collapsed"]) {
		if (state === "collapsed") {
			await page
				.getByRole("button", { name: "Collapse sidebar", exact: true })
				.click();
		}
		const mark = page.locator('aside img[src="/logo-24.png"]');
		await expect(mark).toBeVisible();
		await mark.evaluate((image) => image.decode());
		await expect(mark).toHaveCSS("border-radius", "0px");
		await expect(mark).toHaveCSS("width", "20px");
		await expect(page.locator("aside")).toHaveCSS(
			"width",
			state === "expanded" ? "260px" : "68px",
		);
		const bounds = await page.locator("aside").boundingBox();
		await page.screenshot({
			path: path.join(screenshots, `bogo-source-${state}-header.png`),
			clip: { x: bounds.x, y: bounds.y, width: bounds.width, height: 56 },
			animations: "disabled",
		});
		report.source.push({
			project: "bogo",
			state,
			cssSize: 20,
			crop: "Brand header only",
		});
	}
	const faviconPath = await page
		.locator('link[rel="icon"]')
		.getAttribute("href");
	const favicon = await page.request.get(new URL(faviconPath, page.url()).href);
	const expected = await readFile(
		path.join(site, "../bogo/packages/ui/public/favicon.png"),
	);
	assert.equal(sha256(await favicon.body()), sha256(expected));
	await context.close();
	report.status = "passed";
	await writeFile(
		path.join(directory, "browser-check.json"),
		`${JSON.stringify(report, null, 2)}\n`,
	);
	console.info(
		`Passed ${report.cases.length} review cases and both Bogo source sidebar states.`,
	);
} finally {
	await browser.close();
}
