import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const directory = path.dirname(fileURLToPath(import.meta.url));
const run = path.dirname(directory);
const screenshots = path.join(run, "previews/browser");
await mkdir(screenshots, { recursive: true });
const origin = "https://index.dev.hexly.ai";
const family = "/logos/family/bogo/2026-09-07-05/04";
const staticPath = "/artwork/logo-family/bogo/2026-09-07-05/review.html";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const report = {
	checkedAt: new Date().toISOString(),
	cases: [],
	downloads: [],
	source: {},
};
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function decodeImages(page) {
	await page.locator("img").evaluateAll(async (images) => {
		for (const image of images) image.loading = "eager";
		await Promise.all(images.map((image) => image.decode()));
	});
}

try {
	for (const [name, viewport] of [
		["desktop", { width: 1440, height: 1000 }],
		["mobile", { width: 390, height: 844 }],
	]) {
		const context = await browser.newContext({
			viewport,
			ignoreHTTPSErrors: true,
			locale: "en-US",
			colorScheme: "light",
			reducedMotion: "reduce",
		});
		await context.grantPermissions(["clipboard-read", "clipboard-write"], {
			origin,
		});
		const page = await context.newPage();
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(`${origin}/logos/bogo`);
		await page.locator(".artwork-image").waitFor();
		await decodeImages(page);
		assert.equal(
			await page.locator(".artwork-image").getAttribute("src"),
			`${family}/icon-1024.webp`,
		);
		assert.equal(
			await page.locator(".previous-artwork img").getAttribute("src"),
			`${family}/previous-1024.webp`,
		);
		assert.equal(await page.locator(".reference-grid").count(), 0);
		assert.equal(await page.locator(".alpha-grid img").count(), 2);
		for (const image of await page.locator(".alpha-grid img").all())
			assert.equal(
				await image.getAttribute("src"),
				`${family}/transparent-1024.webp`,
			);
		await page.screenshot({
			path: path.join(screenshots, `site-${name}-light.png`),
			fullPage: true,
		});
		for (const [label, mode] of [
			["Transparent", "transparent"],
			["White", "white"],
			["Icon", "icon"],
		]) {
			await page.getByRole("button", { name: label, exact: true }).click();
			assert.equal(
				await page.locator(".logo-review").getAttribute("data-presentation"),
				mode,
			);
			await decodeImages(page);
		}
		await page
			.getByRole("button", { name: "Copy color #b7a186", exact: true })
			.click();
		assert.equal(
			await page.evaluate(() => navigator.clipboard.readText()),
			"#b7a186",
		);
		await page
			.getByRole("button", { name: "Copy gallery link", exact: true })
			.click();
		const shared = new URL(
			await page.evaluate(() => navigator.clipboard.readText()),
		);
		assert.equal(shared.pathname, "/logos/bogo");
		assert.equal(shared.search, "");
		await page
			.getByRole("button", { name: "Switch to Chinese", exact: true })
			.click();
		assert.match(
			await page.locator(".current-artwork figcaption").innerText(),
			/已采用的家族 Logo/,
		);
		await page
			.getByRole("button", { name: "切换到深色主题", exact: true })
			.click();
		await page.waitForFunction(
			() => !document.querySelector(".toast")?.textContent?.trim(),
		);
		await page.screenshot({
			path: path.join(screenshots, `site-${name}-dark-zh.png`),
			fullPage: true,
		});
		assert.ok(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		);
		await page.reload();
		assert.equal(new URL(page.url()).pathname, "/logos/bogo");
		await page.locator(".artwork-image").waitFor();
		assert.match(await page.locator("#identity-title").innerText(), /Bogo/);
		await page
			.getByRole("button", { name: "Switch to English", exact: true })
			.click();
		await page
			.getByText("Read the exact generation prompt", { exact: true })
			.click();
		await page.waitForFunction(() =>
			document
				.querySelector(".generation-prompt")
				?.textContent.includes("HEAD CLOSE-UP"),
		);
		const downloadEvent = page.waitForEvent("download");
		await page
			.getByRole("link", { name: "Download original", exact: true })
			.click();
		const download = await downloadEvent;
		assert.equal(await download.failure(), null);
		assert.equal(
			sha256(await readFile(await download.path())),
			"54bff5a21a25489a94b5ad3d816332dc7082ed4a41510d782a3c33a05a17fac1",
		);
		await page
			.getByRole("button", { name: "Next identity", exact: true })
			.click();
		assert.notEqual(new URL(page.url()).pathname, "/logos/bogo");
		await page.goBack();
		assert.equal(new URL(page.url()).pathname, "/logos/bogo");
		report.cases.push({
			surface: "catalogue",
			viewport: name,
			languages: ["en", "zh"],
			themes: ["light", "dark"],
			modes: ["icon", "transparent", "white"],
			download: "exact transparent master",
			clipboard: true,
			history: true,
			overflow: false,
		});

		await page.goto(`${origin}${staticPath}`);
		await decodeImages(page);
		await page.screenshot({
			path: path.join(screenshots, `static-${name}-light.png`),
			fullPage: true,
		});
		for (const mode of ["transparent", "white", "icon"]) {
			await page.locator(`button[data-view="${mode}"]`).click();
			assert.equal(await page.locator("body").getAttribute("data-view"), mode);
			await decodeImages(page);
		}
		await page.locator("#theme-switch").click();
		assert.equal(await page.locator("body").getAttribute("data-theme"), "dark");
		await page.screenshot({
			path: path.join(screenshots, `static-${name}-dark.png`),
			fullPage: true,
		});
		await page.locator('button[data-color="#B7A186"]').click();
		assert.equal(
			await page.evaluate(() => navigator.clipboard.readText()),
			"#B7A186",
		);
		await page
			.getByText("Read the exact generation prompt", { exact: true })
			.click();
		assert.match(
			await page.locator("#generation-prompt").innerText(),
			/HEAD CLOSE-UP/,
		);
		await page
			.getByText("View the family and presentation references", { exact: true })
			.click();
		assert.equal(await page.locator(".reference-grid img").count(), 5);
		assert.ok(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		);
		for (const link of await page.locator(".download-links a").all()) {
			const url = new URL(await link.getAttribute("href"), page.url());
			const response = await context.request.get(url.href);
			assert.equal(response.status(), 200);
			if (name === "desktop")
				report.downloads.push({
					path: url.pathname,
					bytes: (await response.body()).length,
					sha256: sha256(await response.body()),
				});
		}
		report.cases.push({
			surface: "static",
			viewport: name,
			themes: ["light", "dark"],
			modes: ["icon", "transparent", "white"],
			references: 5,
			downloads: 6,
			clipboard: true,
			overflow: false,
		});
		assert.deepEqual(errors, []);
		await context.close();
	}
	const context = await browser.newContext({
		viewport: { width: 1440, height: 1000 },
		ignoreHTTPSErrors: true,
	});
	const page = await context.newPage();
	await page.goto("https://bogo.dev.hexly.ai");
	const logo = page.locator('aside img[alt="bogo"]');
	await logo.waitFor();
	await logo.evaluate((image) => image.decode());
	await page.screenshot({
		path: path.join(screenshots, "bogo-sidebar-expanded.png"),
		clip: { x: 0, y: 0, width: 260, height: 56 },
	});
	await page
		.getByRole("button", { name: "Collapse sidebar", exact: true })
		.click();
	await page
		.getByRole("button", { name: "Expand sidebar", exact: true })
		.waitFor();
	await logo.screenshot({
		path: path.join(screenshots, "bogo-sidebar-collapsed.png"),
	});
	const assets = [];
	for (const file of ["logo-24.png", "logo-80.png", "favicon.png"]) {
		const response = await context.request.get(
			`https://bogo.dev.hexly.ai/${file}`,
		);
		assert.equal(response.status(), 200);
		const bytes = await response.body();
		assert.equal(
			sha256(bytes),
			sha256(
				await readFile(
					`/Users/nocoo/workspace/personal/bogo/packages/ui/public/${file}`,
				),
			),
		);
		assets.push({ file, sha256: sha256(bytes) });
	}
	assert.equal(
		await page.locator('link[rel="icon"]').getAttribute("href"),
		"/favicon.png",
	);
	report.source = {
		origin: "https://bogo.dev.hexly.ai",
		sidebarExpanded: true,
		sidebarCollapsed: true,
		displayedLogoPixels: 20,
		assets,
		captureScope:
			"Brand header and logo only; no personal knowledge-base content archived.",
	};
	await context.close();
	report.status = "passed";
	await writeFile(
		path.join(directory, "browser-check.json"),
		`${JSON.stringify(report, null, "\t")}\n`,
	);
	console.log(
		JSON.stringify({
			status: report.status,
			surfaces: report.cases.length,
			source: report.source.origin,
			downloads: report.downloads.length,
		}),
	);
} finally {
	await browser.close();
}
