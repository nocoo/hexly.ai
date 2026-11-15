import { expect, test } from "./fixtures";

test("removes retired hero renderers and keeps the original project links", async ({
	page,
}) => {
	const retiredRequests: string[] = [];
	page.on("request", (request) => {
		if (
			request.url().includes("hero-three-renderer") ||
			request.url().includes("/brands/hexly-ai/v1.0.1/headers/")
		)
			retiredRequests.push(request.url());
	});
	for (const path of ["/brand", "/status", "/"]) {
		await page.goto(path);
		await expect(page.locator("html")).toHaveAttribute(
			"data-app-ready",
			"true",
		);
		const hero = page.locator(".hero");
		await expect(hero).toBeVisible();
		await expect(
			hero.locator("canvas, [data-hero-object], .hero-artwork"),
		).toHaveCount(0);
		if (path !== "/") await expect(hero.locator("img")).toHaveCount(0);
	}
	await expect(page.locator(".floating-logo")).toHaveCount(6);
	await page.locator(".floating-logo").first().click();
	await expect(page).toHaveURL(/\/projects\/[^/]+$/);
	expect(retiredRequests).toEqual([]);
});
