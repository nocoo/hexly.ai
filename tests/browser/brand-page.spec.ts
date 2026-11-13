import sharp from "sharp";
import { brandCopy, brandSizes } from "../../src/data/brand-copy";
import { copy } from "../../src/data/copy";
import { scanAccessibility } from "./accessibility";
import { desktop, expect, test, touch } from "./fixtures";

test("keeps native-size marks and navigation separate at intermediate widths", async ({
	page,
}) => {
	await page.goto("/brand");
	await expect(page.locator(".brand-page")).toBeVisible();
	for (const width of [601, 640, 768, 1024, 1200, 1288]) {
		await page.setViewportSize({ width, height: 1000 });
		const geometry = await page.evaluate(() => {
			const nav = document
				.querySelector(".view-links")
				?.getBoundingClientRect();
			const surfaces = document
				.querySelector(".site-header .surface-links")
				?.getBoundingClientRect();
			if (!nav || !surfaces) throw new Error("Missing header navigation");
			return {
				overlap:
					nav.left < surfaces.right &&
					surfaces.left < nav.right &&
					nav.top < surfaces.bottom &&
					surfaces.top < nav.bottom,
				marks: [
					...document.querySelectorAll<HTMLImageElement>(".brand-size img"),
				].map((image) => {
					const mark = image.getBoundingClientRect();
					const stage = image.parentElement?.getBoundingClientRect();
					return (
						!!stage &&
						mark.left >= stage.left &&
						mark.right <= stage.right &&
						mark.width === Number(image.getAttribute("width"))
					);
				}),
			};
		});
		expect(geometry.overlap, `${width}px navigation`).toBe(false);
		expect(geometry.marks.every(Boolean), `${width}px mark containment`).toBe(
			true,
		);
	}
});

for (const [name, options, locale, theme] of [
	["desktop light", desktop, "en", "light"],
	["desktop dark", desktop, "en", "dark"],
	["mobile light", touch, "zh", "light"],
	[
		"mobile dark",
		{ ...touch, viewport: { width: 320, height: 844 } },
		"zh",
		"dark",
	],
] as const) {
	test.describe(`Brand ${name}`, () => {
		test.use(options);
		test("separates the identity library from templates and preserves its actual-size specimens", async ({
			page,
		}) => {
			const t = brandCopy[locale];
			await page.addInitScript(
				({ locale, theme }) => {
					localStorage.setItem("hexly:locale", locale);
					localStorage.setItem("hexly:theme", theme);
				},
				{ locale, theme },
			);
			await page.goto("/templates");
			await expect(page.locator(".video-intro")).toBeVisible();
			await expect(page.locator(".site-identity, .brand-page")).toHaveCount(0);
			await expect(page.locator("[data-video-template]")).toHaveCount(5);
			await expect(page.locator(".template-example")).toHaveCount(5);
			const navigation = page.getByRole("navigation", {
				name: copy[locale].views,
			});
			await navigation
				.getByRole("button", { name: copy[locale].brandPage, exact: true })
				.click();
			await expect(page).toHaveURL(/\/brand$/);
			await expect(page).toHaveTitle("Brand — hexly.ai");
			await expect(page.getByRole("heading", { level: 1 })).toHaveText(
				`${t.title}.`,
			);
			await expect(
				navigation.getByRole("button", {
					name: copy[locale].brandPage,
					exact: true,
				}),
			).toHaveAttribute("aria-pressed", "true");
			await page.evaluate(() => document.fonts.ready);
			for (const size of brandSizes) {
				const mark = page.locator(`.brand-size[data-size="${size}"] img`);
				await mark.evaluate((image: HTMLImageElement) => image.decode());
				const bounds = await mark.boundingBox();
				const stage = await mark.locator("..").boundingBox();
				if (!bounds || !stage) throw new Error("Missing mark specimen");
				expect(bounds.width).toBe(size);
				expect(bounds.height).toBe(size);
				expect(bounds.x).toBeGreaterThanOrEqual(stage.x);
				expect(bounds.x + bounds.width).toBeLessThanOrEqual(
					stage.x + stage.width,
				);
				await expect(mark).toHaveCSS("filter", "none");
			}
			await expect(page.locator(".brand-lockup-grid .brand-mark")).toHaveCount(
				2,
			);
			await expect(
				page.locator(".brand-lockup-grid .brand-wordmark"),
			).toHaveCount(3);
			for (const wordmark of await page
				.locator(".brand-page .brand-wordmark")
				.all()) {
				await expect(wordmark).toHaveText("hexly.ai");
				await expect(wordmark).toHaveCSS("font-family", /Space Grotesk/);
			}
			await expect(page.locator(".brand-app-icon")).toHaveCount(4);
			for (const mode of ["light", "dark"]) {
				const square = page.locator(
					`.brand-app-icon[data-theme="${mode}"][data-shape="square"]`,
				);
				const rounded = page.locator(
					`.brand-app-icon[data-theme="${mode}"][data-shape="rounded"]`,
				);
				await expect(square).toHaveCSS("mask-image", "none");
				await expect(rounded).not.toHaveCSS("mask-image", "none");
				await rounded.locator("..").evaluate((stage) => {
					stage.style.background = "#bf5c3c";
				});
				const pixels = await sharp(await rounded.screenshot())
					.removeAlpha()
					.raw()
					.toBuffer();
				expect(pixels[0]).toBeGreaterThan(180);
				expect(pixels[0]).toBeLessThan(201);
				expect(pixels[1]).toBeGreaterThan(80);
				expect(pixels[1]).toBeLessThan(106);
				await rounded.locator("..").evaluate((stage) => {
					stage.style.removeProperty("background");
				});
			}
			await expect(page.locator(".brand-surface")).toHaveCount(4);
			await expect(page.locator(".brand-surface-paper")).toHaveCSS(
				"background-color",
				"rgb(240, 240, 233)",
			);
			await expect(page.locator(".brand-surface-paper .brand-dot")).toHaveCSS(
				"color",
				"rgb(191, 92, 60)",
			);
			await expect(page.locator(".brand-surface-night")).toHaveCSS(
				"background-color",
				"rgb(30, 40, 36)",
			);
			await expect(page.locator(".brand-surface-night .brand-dot")).toHaveCSS(
				"color",
				"rgb(231, 150, 112)",
			);
			await expect(
				page.getByRole("button", { name: t.guide, exact: true }),
			).toBeVisible();
			await expect(
				page.getByRole("link", { name: t.markdown }),
			).toHaveAttribute("href", "/agents/brand.md");
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				"https://hexly.ai/brand",
			);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
			expect((await scanAccessibility(page)).violations).toEqual([]);
			await page.locator('.brand-section-links a[href="#surfaces"]').click();
			await expect(page).toHaveURL(/\/brand#surfaces$/);
			await page.reload();
			await expect(page.locator(".brand-page")).toBeVisible();
			await page.goBack();
			await expect(page).toHaveURL(/\/brand$/);
			await page.goBack();
			await expect(page).toHaveURL(/\/templates$/);
			await expect(page.locator(".video-intro")).toBeVisible();
		});
	});
}
