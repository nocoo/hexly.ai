import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";

const study = dirname(fileURLToPath(import.meta.url));
const repo = resolve(process.argv[2] ?? "../ocelot");
const origin = "http://127.0.0.1:5174";
const evidence = join(study, "inspection/source-browser");
await mkdir(evidence, { recursive: true });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const provenance = JSON.parse(
	await readFile(join(repo, "assets/brand/provenance.json"), "utf8"),
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = {
	checkedAt: new Date().toISOString(),
	origin,
	browser: browser.version(),
	assets: [],
	cases: [],
	errors: [],
	existingBrowserTests: {
		passed: [
			"Basalt breadcrumbs and collapsed rail",
			"Light desktop accessibility and preferences",
			"Dark desktop accessibility and preferences",
			"Mobile drawer, outline and reduced motion",
		],
		baselineCorrection:
			"The published navigation change uses Basalt L0 (#f3f5f7 / #12161c). Two existing test expectations still named the old rail colors; only those expected values were corrected and both tests passed on rerun.",
	},
};

async function inspectMarks(page, state) {
	const marks = await page
		.locator("img.ocelot-mark")
		.evaluateAll(async (images) =>
			Promise.all(
				images.map(async (image) => {
					await image.decode();
					const style = getComputedStyle(image);
					const rect = image.getBoundingClientRect();
					return {
						path: new URL(image.currentSrc).pathname,
						width: rect.width,
						height: rect.height,
						naturalWidth: image.naturalWidth,
						radius: style.borderRadius,
						background: style.backgroundColor,
						shadow: style.boxShadow,
						opacity: style.opacity,
						filter: style.filter,
					};
				}),
			),
		);
	assert(marks.length >= 1);
	for (const mark of marks) {
		assert(["/logo-80.png", "/logo-160.png"].includes(mark.path));
		assert.equal(mark.width, mark.height);
		assert.equal(mark.radius, "0px");
		assert.equal(mark.shadow, "none");
		assert.equal(mark.background, "rgba(0, 0, 0, 0)");
		assert.equal(mark.opacity, "1");
		assert.equal(mark.filter, "none");
	}
	assert(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	);
	report.cases.push({ ...state, marks, overflow: false });
}

try {
	for (const theme of ["light", "dark"]) {
		const context = await browser.newContext({
			viewport: { width: 1440, height: 1000 },
			colorScheme: theme,
			reducedMotion: "reduce",
		});
		const page = await context.newPage();
		page.on("pageerror", (error) => report.errors.push(error.message));
		await page.goto(`${origin}/?repo=101&note=README.md`);
		await expect(page.locator("#document-title")).toBeVisible();
		await expect(page.locator(".loading-line")).toHaveCount(0);
		await page.evaluate(() => document.fonts.ready);
		await inspectMarks(page, {
			theme,
			layout: "desktop",
			state: "expanded sidebar and article footer",
		});
		await page
			.getByRole("button", { name: "切换知识库导航", exact: true })
			.click();
		await expect(page.locator(".ocelot-sidebar")).toHaveCSS("width", "68px");
		await expect(page.locator(".brand .ocelot-mark")).toHaveCSS(
			"width",
			"23px",
		);
		await inspectMarks(page, {
			theme,
			layout: "desktop",
			state: "collapsed rail",
		});
		await page.screenshot({ path: join(evidence, `rail-${theme}.png`) });
		await page.locator(".article-footer").scrollIntoViewIfNeeded();
		await expect(page.locator(".article-footer .ocelot-mark")).toBeVisible();
		await page.screenshot({ path: join(evidence, `footer-${theme}.png`) });
		await page.route("**/api/repositories", (route) =>
			route.fulfill({ json: [] }),
		);
		await page.goto(origin);
		await expect(page.locator(".empty-reading .ocelot-mark")).toBeVisible();
		await expect(page.locator(".empty-reading .ocelot-mark")).toHaveCSS(
			"width",
			"57px",
		);
		await inspectMarks(page, {
			theme,
			layout: "desktop",
			state: "empty reader; synthetic empty repository list",
		});
		await page.screenshot({ path: join(evidence, `empty-${theme}.png`) });
		await page.unroute("**/api/repositories");
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(`${origin}/?repo=101&note=README.md`);
		await expect(page.locator("#document-title")).toBeVisible();
		await page
			.getByRole("button", { name: "切换知识库导航", exact: true })
			.click();
		const drawer = page.getByRole("dialog", {
			name: "知识库导航",
			exact: true,
		});
		await expect(drawer).toBeVisible();
		await expect(drawer.locator("img.ocelot-mark")).toBeVisible();
		await inspectMarks(page, {
			theme,
			layout: "mobile",
			state: "navigation drawer",
		});
		await page.screenshot({ path: join(evidence, `drawer-${theme}.png`) });
		assert.deepEqual(
			await page
				.locator('link[rel="icon"]')
				.evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
			["/favicon-32.png", "/favicon-16.png"],
		);
		await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
			"href",
			"/apple-touch-icon.png",
		);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			"content",
			"https://hexly.ai/og/ocelot.jpg",
		);
		if (theme === "light")
			for (const file of provenance.files) {
				const bytes = await readFile(join(repo, file.path));
				assert.equal(hash(bytes), file.sha256);
				if (!file.path.startsWith("public/")) {
					assert(bytes.equals(await readFile(join(study, file.derivedFrom))));
					continue;
				}
				const response = await context.request.get(
					`${origin}/${file.path.slice(7)}`,
				);
				assert.equal(response.status(), 200);
				assert.equal(hash(await response.body()), file.sha256);
				if (file.role.startsWith("transparent"))
					assert(file.clearPixels > 0 && file.opaquePixels > 0);
				else assert.equal(file.opaquePixels, file.width * file.height);
				report.assets.push(file);
			}
		await context.close();
	}
	assert.deepEqual(report.errors, []);
	report.status = "passed";
	await writeFile(
		join(evidence, "checks.json"),
		`${JSON.stringify(report, null, "\t")}\n`,
	);
	console.log(
		`Ocelot: ${report.cases.length} consumer states, ${report.assets.length} served assets, both themes; passed.`,
	);
} finally {
	await browser.close();
}
