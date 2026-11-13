import { scanAccessibility } from "./accessibility";
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
				if (view === "gallery") {
					const category = page.getByRole("combobox");
					await expect(category).toHaveCSS("appearance", "none");
					const inset = await category.evaluate((select) => {
						const style = getComputedStyle(select);
						return {
							arrow: style.backgroundPositionX.split(",")[0],
							size: style.backgroundSize.split(",")[0],
							right: Number.parseFloat(style.paddingRight),
							left: Number.parseFloat(style.paddingLeft),
						};
					});
					expect(inset.left).toBe(12);
					expect(inset.arrow).toBe("calc(100% - 12px)");
					expect(inset.size).toBe("16px 16px");
					expect(inset.right).toBe(inset.left * 2 + 16);
				}

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
				const scan = await scanAccessibility(page);
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
			});
		}
	});
}
