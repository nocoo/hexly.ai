import AxeBuilder from "@axe-core/playwright";
import snail from "../../docs/sources/snail-retired-2026-09-13.json" with {
	type: "json",
};
import { expect, test } from "./fixtures";

if (!snail?.brandKit || !snail.family)
	throw new Error("Missing Snail animal kit");
const kit = snail.brandKit;

test("removes Snail from the directory and forwards its project page to Zhe", async ({
	page,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await page.goto("/?q=snail");
	await expect(page.locator('[data-project="snail"]')).toHaveCount(0);
	await page.goto("/projects/snail");
	await expect(page).toHaveURL(/\/projects\/zhe$/);
	await expect(page.locator("#identity-title")).toContainText("Zhe");
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
});

test("the standalone Snail study keeps full compositions, transparent small marks and traceable downloads", async ({
	page,
	context,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto(`${kit.root}/review.html`);
	for (const name of ["Transparent", "White", "Icon"] as const) {
		const button = page.getByRole("button", { name, exact: true });
		await button.click();
		await expect(button).toHaveAttribute("aria-pressed", "true");
	}
	for (const theme of ["light", "dark"]) {
		if ((await page.locator("body").getAttribute("data-theme")) !== theme)
			await page.locator("#theme-switch").click();
		for (const image of await page
			.locator(".hero img, .edges img, .specimen img")
			.all())
			await image.evaluate((node: HTMLImageElement) => node.decode());
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		).toBe(true);
		await expect(page.locator(".app-name img")).toHaveCSS("width", "24px");
		await expect(page.locator(".tab img")).toHaveCSS("width", "16px");
		await expect(page.locator(".app-name img")).toHaveCSS(
			"border-radius",
			"0px",
		);
		const accessibility = await new AxeBuilder({ page }).analyze();
		expect(accessibility.violations).toEqual([]);
	}
	await page.getByRole("button", { name: /Terracotta #bf5c3c/ }).click();
	await expect(page.locator("#copy-status")).toHaveText("Copied #bf5c3c");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"#bf5c3c",
	);
	await page
		.getByText("Read the exact icon generation prompt", { exact: true })
		.click();
	await expect(
		page.locator('pre[data-source="./prompt-icon.txt"]'),
	).toContainText("snail");
	await page
		.getByText("View the family references and candidate record", {
			exact: true,
		})
		.click();
	for (const image of await page.locator(".references img").all())
		await image.evaluate((node: HTMLImageElement) => node.decode());
	const download = page.waitForEvent("download");
	await page.getByRole("link", { name: "Favicon ICO ↗", exact: true }).click();
	expect((await download).suggestedFilename()).toBe("favicon.ico");
	expect(errors).toEqual([]);
});
