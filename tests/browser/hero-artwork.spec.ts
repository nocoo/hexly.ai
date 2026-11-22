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
		const artwork = hero.locator(".hero-candidate-backdrop");
		await expect(artwork).toHaveCount(1);
		await expect(artwork).toHaveAttribute("fetchpriority", "high");
		await expect(artwork).toHaveAttribute("alt", "");
	}
	await page.goto("/");
	const heroImg = page.locator(".hero .hero-candidate-backdrop");
	await expect(heroImg).toHaveAttribute("src", /projects\.webp$/);
	await page.getByRole("button", { name: /Switch to dark theme/i }).click();
	await expect(heroImg).toHaveAttribute("src", /projects-dark\.webp$/);
	await page.getByRole("button", { name: /Switch to light theme/i }).click();
	await expect(heroImg).toHaveAttribute("src", /projects\.webp$/);
	await page.locator(".project-card").first().click();
	await expect(page).toHaveURL(/\/projects\/[^/]+$/);
	expect(retiredRequests).toEqual([]);
});
