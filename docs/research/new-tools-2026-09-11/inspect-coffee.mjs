import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const repo = "/Users/nocoo/workspace/personal/coffee";
const root = "artwork/logo-family/coffee/2026-09-11-01";
const evidence = `${root}/inspection/source-browser`;
await mkdir(evidence, { recursive: true });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const source = JSON.parse(await readFile(`${repo}/assets/brand/source.json`, "utf8"));
for (const file of source.masterFiles) {
	const bytes = await readFile(`${repo}/${file.path}`);
	assert.equal(hash(bytes), file.sha256);
	const selected = file.role.startsWith("Independent") ? `${root}/finishing/01/background.png` : `${root}/finishing/01/exports/coffee-${file.role}-2048.png`;
	assert(bytes.equals(await readFile(selected)));
}
const assets = [];
for (const [file, width, height, transparent] of [
	["favicon-16.png", 16, 16, true], ["favicon.png", 32, 32, true], ["logo-80.png", 80, 80, true],
	["icon-192.png", 192, 192, false], ["icon-512.png", 512, 512, false], ["icon-maskable-512.png", 512, 512, false], ["og.png", 1536, 1024, false],
]) {
	const bytes = await readFile(`${repo}/public/${file}`);
	const decoded = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	assert.equal(decoded.info.width, width);
	assert.equal(decoded.info.height, height);
	let clearPixels = 0;
	let solidPixels = 0;
	for (let at = 3; at < decoded.data.length; at += 4) {
		if (decoded.data[at] === 0) clearPixels++;
		if (decoded.data[at] === 255) solidPixels++;
	}
	if (transparent) {
		assert(clearPixels > width * height * 0.4 && solidPixels > 0);
		assert.equal(decoded.data[3], 0);
	} else assert.equal(solidPixels, width * height);
	assets.push({ path: `public/${file}`, width, height, bytes: bytes.length, sha256: hash(bytes), clearPixels, solidPixels });
}
const manifest = JSON.parse(await readFile(`${repo}/public/manifest.webmanifest`, "utf8"));
assert.equal(manifest.icons.find((icon) => icon.purpose === "maskable")?.src, "/icon-maskable-512.png");
const finishing = JSON.parse(await readFile(`${root}/inspection/finishing-01.json`, "utf8"));
const maskableRadius = finishing.maximumRadiusAt2048 * 0.94;
assert(maskableRadius < 2048 * 0.4);
for (const [file, image] of [["README.md", "assets/brand/icon-rounded.png"], ["docs/README.en.md", "../assets/brand/icon-rounded.png"]]) assert((await readFile(`${repo}/${file}`, "utf8")).includes(`<img src="${image}"`));

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-unsafe-swiftshader"] });
const checks = [];
const errors = [];
try {
	for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
		for (const theme of ["daylight", "espresso", "terroir"]) {
			const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
			await context.addInitScript((theme) => localStorage.setItem("coffee.preferences.v1", JSON.stringify({ locale: "en", theme, flat: true })), theme);
			const page = await context.newPage();
			page.on("pageerror", (error) => errors.push(error.message));
			page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
			for (const path of ["/brew", "/display"]) {
				await page.goto(`http://127.0.0.1:4174${path}?lang=en`, { waitUntil: "networkidle" });
				await page.locator(path === "/display" ? ".exhibition-header .brand-mark" : ".site-header .brand-mark").waitFor();
				const result = await page.evaluate(async () => {
					await document.fonts.ready;
					const marks = await Promise.all([...document.querySelectorAll(".brand-mark")].map(async (image) => {
						await image.decode();
						const style = getComputedStyle(image);
						return { src: image.getAttribute("src"), naturalWidth: image.naturalWidth, width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height, background: style.backgroundColor, radius: style.borderRadius, shadow: style.boxShadow, filter: style.filter };
					}));
					return { theme: document.documentElement.dataset.theme, overflow: document.documentElement.scrollWidth > innerWidth + 1, marks, faviconLinks: [...document.querySelectorAll('link[rel="icon"]')].map((link) => link.getAttribute("href")) };
				});
				assert.equal(result.theme, theme);
				assert.equal(result.overflow, false);
				assert(result.marks.length >= (path === "/display" ? 1 : 2));
				for (const mark of result.marks) {
					assert.equal(mark.src, "/logo-80.png");
					assert.equal(mark.naturalWidth, 80);
					assert.equal(mark.width, mark.height);
					assert.equal(mark.background, "rgba(0, 0, 0, 0)");
					assert.equal(mark.radius, "0px");
					assert.equal(mark.shadow, "none");
					assert.equal(mark.filter, "none");
				}
				assert.deepEqual(result.faviconLinks, ["/favicon-16.png", "/favicon.png"]);
				if (theme !== "terroir") await page.screenshot({ path: `${evidence}/${viewportName}-${theme}-${path.slice(1)}.png` });
				checks.push({ viewport: viewportName, path, ...result });
			}
			await context.close();
		}
	}
	const context = await browser.newContext();
	const page = await context.newPage();
	let release;
	const pending = new Promise((resolve) => { release = resolve; });
	await page.route("**/assets/Journal-*.js", async (route) => { await pending; await route.continue(); });
	await page.goto("http://127.0.0.1:4174/journal?lang=en");
	await page.locator(".loading-page .brand-mark").waitFor();
	assert.equal(await page.locator(".loading-page .brand-mark").getAttribute("src"), "/logo-80.png");
	release();
	await page.locator(".journal-page").waitFor();
	checks.push({ path: "/journal", loadingMark: "/logo-80.png", resumed: true });
	const notFound = await context.request.get("http://127.0.0.1:4174/404.html");
	assert((await notFound.text()).includes('href="/favicon.png"'));
	for (const asset of assets) {
		const response = await context.request.get(`http://127.0.0.1:4174/${asset.path.slice(7)}`);
		assert.equal(response.status(), 200);
		assert.equal(hash(await response.body()), asset.sha256);
	}
	assert.deepEqual(errors, []);
	await writeFile(`${evidence}/checks.json`, `${JSON.stringify({ checkedAt: new Date().toISOString(), baseUrl: "http://127.0.0.1:4174", browser: browser.version(), assets, platformMaskable: { foregroundScale: 0.94, maximumRadiusAt2048: maskableRadius, safeRadiusAt2048: 819.2 }, checks, errors }, null, "\t")}\n`);
	console.log(`Coffee: ${assets.length} decoded and served assets, ${checks.length} browser checks, all three themes, no overflow or errors.`);
} finally {
	await browser.close();
}
