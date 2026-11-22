import { scanAccessibility } from "./accessibility";
import { expect, test } from "./fixtures";

for (const [width, theme, locale] of [
	[1440, "light", "en"],
	[768, "dark", "en"],
	[651, "light", "en"],
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
		const heroLayouts: {
			top: number;
			height: number;
			columns: string;
			headingFits: boolean;
		}[] = [];
		for (const path of ["/", "/logos", "/projects/pew", "/brand", "/status"]) {
			await test.step(path, async () => {
				await page.goto(path);
				await expect(page.locator("html")).toHaveAttribute(
					"data-app-ready",
					"true",
				);
				await expect(page.locator("main")).toBeVisible();
				await page.evaluate(() => document.fonts.ready);
				if (["/", "/brand", "/status"].includes(path)) {
					const hero = page.locator(".hero");
					await expect(hero).toBeVisible();
					heroLayouts.push(
						await hero.evaluate((element) => ({
							top: element.getBoundingClientRect().top + scrollY,
							height: element.getBoundingClientRect().height,
							columns: getComputedStyle(element).gridTemplateColumns,
							headingFits:
								(element.querySelector("h1")?.scrollWidth ?? 0) <=
								(element.querySelector("h1")?.clientWidth ?? 0) + 1,
						})),
					);
				}
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
					]
						.filter((element) => box(element).height > 0)
						.map((element) => ({
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
		expect(heroLayouts).toHaveLength(3);
		for (const hero of heroLayouts) expect(hero.headingFits).toBe(true);
		if (width >= 651) {
			for (const hero of heroLayouts) {
				expect(hero.top).toBeCloseTo(heroLayouts[0]?.top ?? 0, 1);
				expect(hero.height).toBe(544);
				expect(hero.columns).toBe(heroLayouts[0]?.columns);
			}
		}
	});
}

test("mobile header renders a 64px single row and toggles navigation drawer", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");

	const header = page.locator(".site-header");
	const menuToggle = page.locator(".menu-toggle");
	const drawer = page.locator("#mobile-nav-drawer");

	expect((await header.boundingBox())?.height).toBe(65);
	await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
	await expect(drawer).toHaveAttribute("data-open", "false");

	await menuToggle.click();
	await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
	await expect(drawer).toHaveAttribute("data-open", "true");
	for (const link of await page.locator(".view-links a").all()) {
		expect((await link.boundingBox())?.height).toBe(44);
	}

	await page.keyboard.press("Escape");
	await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
	await expect(drawer).toHaveAttribute("data-open", "false");
	await expect(menuToggle).toBeFocused();
});
