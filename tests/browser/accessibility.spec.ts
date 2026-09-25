import AxeBuilder from "@axe-core/playwright";
import { desktop, expect, test, touch } from "./fixtures";

for (const [theme, options] of [
	["light", desktop],
	["dark", touch],
] as const) {
	test.describe(`${theme} theme`, () => {
		test.use({
			...options,
			colorScheme: theme,
			locale: theme === "dark" ? "zh-CN" : "en-US",
		});
		for (const [view, path] of [
			["directory", "/"],
			["logo wall", "/logos"],
			["gallery", "/projects/frogie"],
			["status", "/status"],
		] as const) {
			test(`${view} has accessible content and fits the viewport`, async ({
				page,
				isMobile,
			}) => {
				if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
				await page.goto(path);
				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				if (view === "status")
					await expect(page.locator(".status-demo")).toBeVisible();

				if (view === "directory") {
					await expect(page.locator(".site-header .preferences")).toHaveCSS(
						"border-left-width",
						isMobile ? "0px" : "1px",
					);
					if (isMobile) {
						await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
						await expect(page.locator("html")).toHaveAttribute(
							"data-theme",
							"dark",
						);
						await expect(
							page.getByRole("button", { name: "主题：深色；切换为浅色" }),
						).toBeVisible();
					}
				}

				await page.evaluate(() => document.fonts.ready);
				const scan = await new AxeBuilder({ page })
					.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
					.analyze();
				expect(scan.violations).toEqual([]);
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth,
					),
				).toBe(true);
				expect(
					await page
						.locator("body")
						.evaluate((element) =>
							Number.parseFloat(getComputedStyle(element).transitionDuration),
						),
				).toBeLessThanOrEqual(0.001);
				if (view === "gallery") {
					for (const label of isMobile
						? ["图标", "白底", "透明"]
						: ["Icon", "White", "Transparent"]) {
						await page
							.getByRole("button", {
								name: label,
								exact: true,
							})
							.click();
						const surface = await new AxeBuilder({ page })
							.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
							.analyze();
						expect(surface.violations).toEqual([]);
					}
				}
			});
		}
	});
}
