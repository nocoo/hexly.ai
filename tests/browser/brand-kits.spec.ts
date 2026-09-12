import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("browses Snail's bilingual brand archive, theme variants and real downloads", async ({
	page,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await page.goto("/?q=snail");
	await expect(
		page.locator('[data-project="snail"] .card-main'),
	).toHaveAttribute("href", "/projects/snail");
	await page.locator('[data-project="snail"] .card-main').click();
	await expect(page.locator("#identity-title")).toContainText("Snail");
	await expect(page.locator(".project-readme")).toHaveCount(0);
	for (const locale of ["en", "zh"] as const) {
		if (locale === "zh")
			await page.getByRole("button", { name: "Switch to Chinese" }).click();
		for (const theme of ["light", "dark"] as const) {
			if ((await page.locator("html").getAttribute("data-theme")) !== theme)
				await page.locator(".theme-toggle").click();
			await expect(
				page.locator(`.identity-heading .logo-theme-${theme}`),
			).toBeVisible();
			await expect(page.locator(".brand-kit")).toContainText(
				locale === "en" ? "One point of focus" : "只留一个焦点",
			);
			await page.locator(".brand-kit-specimens").scrollIntoViewIfNeeded();
			for (const image of await page.locator(".brand-kit-specimens img").all())
				await image.evaluate((node: HTMLImageElement) => node.decode());
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		}
	}
	const pendingDownload = page.waitForEvent("download");
	await page.locator('.brand-kit a[href$="/favicon.ico"]').click();
	expect((await pendingDownload).suggestedFilename()).toBe("favicon.ico");
	const results = await new AxeBuilder({ page })
		.include(".brand-kit")
		.analyze();
	expect(results.violations).toEqual([]);
});
