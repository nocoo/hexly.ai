import { expect, test } from "@playwright/test";

test("Given a visitor, when opening the site, then its identity is visible", async ({
	page,
}) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/hexly.ai/);
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
