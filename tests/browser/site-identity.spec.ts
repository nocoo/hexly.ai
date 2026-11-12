import { videoCopy } from "../../src/data/video-copy";
import { scanAccessibility } from "./accessibility";
import { desktop, expect, test, touch } from "./fixtures";

for (const [device, options, locale] of [
	["desktop", desktop, "en"],
	["mobile", touch, "zh"],
] as const) {
	for (const theme of ["light", "dark"] as const) {
		test.describe(`visual identity ${device} ${theme}`, () => {
			test.use(options);
			test("stacks the square mark and standard wordmark above the unchanged template library", async ({
				page,
			}) => {
				const t = videoCopy[locale];
				await page.addInitScript(
					({ locale, theme }) => {
						localStorage.setItem("hexly:locale", locale);
						localStorage.setItem("hexly:theme", theme);
					},
					{ locale, theme },
				);
				await page.goto("/templates");
				const identity = page.getByRole("region", { name: t.identity });
				const mark = identity.locator(".brand-mark");
				const wordmark = identity.locator("figcaption");
				await expect(identity).toBeVisible();
				await mark.evaluate((image: HTMLImageElement) => image.decode());
				await page.evaluate(() => document.fonts.ready);
				await expect(wordmark).toHaveText("hexly.ai");
				await expect(wordmark).toHaveCSS("font-family", /Space Grotesk/);
				await expect(mark).toHaveCSS("filter", "none");
				await expect(page.locator(".site-header .brand-mark")).toHaveCSS(
					"filter",
					"none",
				);
				const imageBounds = await mark.boundingBox();
				const wordBounds = await wordmark.boundingBox();
				const sectionBounds = await identity.boundingBox();
				const introBounds = await page.locator(".video-intro").boundingBox();
				if (!imageBounds || !wordBounds || !sectionBounds || !introBounds)
					throw new Error("Missing identity or template bounds");
				expect(imageBounds.width).toBe(imageBounds.height);
				expect(imageBounds.y + imageBounds.height).toBeLessThanOrEqual(
					wordBounds.y,
				);
				expect(
					Math.abs(
						imageBounds.x +
							imageBounds.width / 2 -
							(wordBounds.x + wordBounds.width / 2),
					),
				).toBeLessThan(1);
				expect(sectionBounds.y + sectionBounds.height).toBeLessThanOrEqual(
					introBounds.y,
				);
				const source = await mark.getAttribute("src");
				await page.getByLabel(t.project, { exact: true }).selectOption("bogo");
				await expect(mark).toHaveAttribute("src", source ?? "");
				await expect(page.locator("[data-video-template]")).toHaveCount(5);
				await expect(page.locator(".template-example")).toHaveCount(5);
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth,
					),
				).toBe(true);
				expect((await scanAccessibility(page)).violations).toEqual([]);
				await page.locator('[data-video-template="launch"] a').click();
				await expect(identity).toHaveCount(0);
				await expect(
					page.getByLabel(t.switchTemplate, { exact: true }),
				).toBeVisible();
			});
		});
	}
}
