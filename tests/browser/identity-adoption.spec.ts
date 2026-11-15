import { expect, test } from "./fixtures";

const root = "https://h.no.mt/logos/family/hexly-ai/2026-11-13-02/02";

for (const [theme, width] of [
	["light", 1440],
	["dark", 390],
] as const) {
	test(`serves the adopted identity on all site surfaces in ${theme}`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.addInitScript(
			(theme) => localStorage.setItem("hexly:theme", theme),
			theme,
		);
		for (const path of [
			"/",
			"/brand",
			"/status",
			"/projects/hexly-ai",
			"/templates",
		]) {
			await page.goto(path);
			await expect(page.locator("html")).toHaveAttribute(
				"data-app-ready",
				"true",
			);
			const mark = page.locator(".site-header .brand-mark");
			await expect(mark).toHaveAttribute("src", `${root}/transparent-128.png`);
			await expect
				.poll(() =>
					mark.evaluate((image) => {
						const element = image as HTMLImageElement;
						return element.complete && element.naturalWidth > 0;
					}),
				)
				.toBe(true);
			await expect(mark).toHaveCSS("filter", "none");
			await expect(mark).toHaveCSS("box-shadow", "none");
			await expect(mark).toHaveCSS("clip-path", "none");
			await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
				"href",
				`${root}/transparent-32.png`,
			);
			await expect(
				page.locator('link[rel="apple-touch-icon"]'),
			).toHaveAttribute(
				"href",
				"https://h.no.mt/projects/hexly-ai/icons/v1.0.4/apple-touch-icon.png",
			);
			if (path === "/brand") {
				for (const source of await page
					.locator(".brand-page .brand-mark")
					.evaluateAll((images) =>
						images.map((image) => image.getAttribute("src")),
					))
					expect(source).toContain(root);
			}
		}
	});
}
