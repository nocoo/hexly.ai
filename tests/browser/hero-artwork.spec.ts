import { expect, test } from "./fixtures";

test("removes retired hero renderers and serves approved page artworks", async ({
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
		await expect(hero.locator("canvas, [data-hero-object]")).toHaveCount(0);
		await expect(hero.locator(".hero-candidate-backdrop")).toHaveCount(1);
	}
	await page.goto("/");
	await page.locator(".project-card").first().click();
	await expect(page).toHaveURL(/\/projects\/[^/]+$/);
	expect(retiredRequests).toEqual([]);
});
