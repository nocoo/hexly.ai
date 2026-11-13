import { scanAccessibility } from "./accessibility";
import { expect, test } from "./fixtures";

for (const [width, theme, locale] of [
	[1440, "light", "en"],
	[768, "dark", "en"],
	[390, "light", "zh"],
	[320, "dark", "zh"],
] as const) {
	test(`keeps shared controls and page grids aligned at ${width}px in ${theme}`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.addInitScript(
			({ theme, locale }) => {
				localStorage.setItem("hexly:theme", theme);
				localStorage.setItem("hexly:locale", locale);
			},
			{ theme, locale },
		);
		for (const path of [
			"/",
			"/logos",
			"/projects/pew",
			"/templates",
			"/templates/launch",
			"/status",
		]) {
			await test.step(path, async () => {
				await page.goto(path);
				await expect(page.locator("html")).toHaveAttribute(
					"data-app-ready",
					"true",
				);
				await expect(page.locator("main")).toBeVisible();
				if (path.startsWith("/templates"))
					await expect(page.locator(".videos-page")).toBeVisible();
				await page.evaluate(() => document.fonts.ready);
				const geometry = await page.evaluate(() => {
					const box = (element: Element) => element.getBoundingClientRect();
					const shell = (selector: string) => {
						const element = document.querySelector(selector);
						if (!element) throw new Error(`Missing shell: ${selector}`);
						const bounds = box(element);
						const style = getComputedStyle(element);
						return {
							left: bounds.left + Number.parseFloat(style.paddingLeft),
							right: bounds.right - Number.parseFloat(style.paddingRight),
						};
					};
					const header = shell(".site-header-inner");
					const main = shell("main.shell");
					const footer = shell(".site-footer-inner.shell");
					const controls = [
						...document.querySelectorAll(
							".view-links, .search-field, .category-tabs, .collection-views, .video-theme-switch, .video-family-tabs, .status-filters, .status-period, .picker-category",
						),
					].map((element) => ({
						name: element.className,
						height: box(element).height,
					}));
					const grids = [
						...document.querySelectorAll(
							".project-grid, .logo-wall, .video-template-grid",
						),
					].map((element) => {
						const cells = [...element.children].map(box);
						const row = cells.filter(
							(cell) => Math.abs(cell.top - (cells[0]?.top ?? 0)) < 1,
						);
						return {
							left: row[0]?.left,
							right: row.at(-1)?.right,
							gap: Number.parseFloat(getComputedStyle(element).columnGap),
							actualGaps: row
								.slice(1)
								.map((cell, index) => cell.left - (row[index]?.right ?? 0)),
						};
					});
					const brand = document.querySelector(".brand");
					if (!brand) throw new Error("Missing brand");
					return {
						header,
						main,
						footer,
						controls,
						grids,
						brandGap: getComputedStyle(brand).gap,
						overflow: document.documentElement.scrollWidth > innerWidth,
					};
				});
				expect(geometry.overflow).toBe(false);
				expect(geometry.brandGap).toBe("4px");
				for (const shell of [geometry.main, geometry.footer]) {
					expect(shell.left).toBeCloseTo(geometry.header.left, 1);
					expect(shell.right).toBeCloseTo(geometry.header.right, 1);
				}
				for (const control of geometry.controls)
					expect(control.height, control.name).toBe(44);
				for (const grid of geometry.grids) {
					expect(grid.left).toBeCloseTo(geometry.main.left, 1);
					expect(grid.right).toBeCloseTo(geometry.main.right, 1);
					expect(grid.gap % 4).toBe(0);
					for (const gap of grid.actualGaps)
						expect(gap).toBeCloseTo(grid.gap, 1);
				}
				await expect(page.locator(".site-header .brand-mark")).toHaveCSS(
					"filter",
					"none",
				);
				if (path === "/" || path === "/status")
					expect((await scanAccessibility(page)).violations).toEqual([]);
			});
		}
	});
}
