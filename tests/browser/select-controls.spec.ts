import { expect, test } from "./fixtures";

for (const [width, theme] of [
	[1440, "light"],
	[320, "dark"],
] as const) {
	test(`keeps native selects styled and their arrows inset at ${width}px`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.addInitScript((theme) => {
			localStorage.setItem("hexly:locale", "en");
			localStorage.setItem("hexly:theme", theme);
		}, theme);
		for (const path of [
			"/templates",
			"/templates/launch",
			"/projects/pew",
			"/status",
		]) {
			await test.step(path, async () => {
				await page.goto(path);
				const selects = page.locator("main select");
				await expect(selects.first()).toBeVisible();
				if (path.startsWith("/templates")) {
					await page
						.getByLabel("Your project", { exact: true })
						.selectOption("microsoft-teams-send-as-workflow");
					await expect(
						page.getByLabel("Your project", { exact: true }),
					).toHaveValue("microsoft-teams-send-as-workflow");
				}
				for (const select of await selects.all()) {
					await expect(select).toHaveClass(/control-select/);
					await expect(select).toHaveCSS("appearance", "none");
					await expect(select).toHaveCSS("padding-right", "40px");
					await expect(select).toHaveCSS("padding-left", "12px");
					await expect(select).toHaveCSS("height", "44px");
					await expect(select).toHaveCSS("text-overflow", "ellipsis");
					const layout = await select.evaluate((element) => {
						const bounds = element.getBoundingClientRect();
						const style = getComputedStyle(element);
						return {
							right: bounds.right,
							left: bounds.left,
							width: bounds.width,
							arrow: style.backgroundPosition,
							image: style.backgroundImage,
						};
					});
					expect(layout.right).toBeLessThanOrEqual(width);
					expect(layout.left).toBeGreaterThanOrEqual(0);
					expect(layout.width).toBeGreaterThan(80);
					expect(layout.arrow).toContain("12px");
					expect(layout.image).toContain("svg+xml");
				}
				await selects.first().focus();
				await expect(selects.first()).toBeFocused();
				await expect(selects.first()).toHaveCSS("outline-style", "solid");
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth,
					),
				).toBe(true);
			});
		}
	});
}
