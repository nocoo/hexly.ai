import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

for (const colorScheme of ["light", "dark"] as const) {
	test(`previews the actual API and copies integration instructions in ${colorScheme}`, async ({
		page,
		context,
	}, testInfo) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		await page.emulateMedia({ colorScheme });
		await page.goto("/projects/life-ai#api");
		const section = page.locator("#api");
		await expect(
			section.getByRole("heading", { name: "API integration" }),
		).toBeVisible();
		const preview = section.locator(".api-preview");
		await expect(preview).toContainText("https://github.com/nocoo/life.ai");
		await expect(preview.locator("img")).toHaveJSProperty("naturalWidth", 64);
		await section.getByRole("button", { name: "Copy request" }).click();
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
			"curl --fail 'https://hexly.ai/api/projects/nocoo/life.ai'",
		);
		await section
			.getByRole("button", { name: "Copy integration prompt" })
			.click();
		const prompt = await page.evaluate(() => navigator.clipboard.readText());
		expect(prompt).toContain("https://hexly.ai/api/projects/nocoo/life.ai");
		expect(prompt).toContain('role="project-identity"');
		expect(prompt).toContain("one hour");
		await section.getByText("Logo sizes and usage", { exact: false }).click();
		await expect(section.locator(".api-logo-variant").first()).toBeVisible();
		await expect(
			section.locator(".api-logo-variant").filter({ hasText: "16 × 16" }),
		).toContainText("Transparent");
		await section.getByText("View JSON response", { exact: true }).click();
		await expect(section.locator("textarea").first()).toHaveValue(
			/"repo": "life.ai"/,
		);
		await expect(section.locator("textarea").first()).toHaveCSS(
			"white-space",
			"pre-wrap",
		);
		await section.screenshot({
			path: testInfo.outputPath(`api-${colorScheme}.png`),
		});
		const scan = await new AxeBuilder({ page })
			.include("#api")
			.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
			.analyze();
		expect(scan.violations).toEqual([]);
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		).toBe(true);
		await page.getByRole("button", { name: "Switch to Chinese" }).click();
		await expect(
			section.getByRole("heading", { name: "API 集成" }),
		).toBeVisible();
		await section.getByRole("button", { name: "复制集成 Prompt" }).click();
		expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
			"project.description.zh",
		);
	});
}

test("recovers from API failure and updates during project navigation", async ({
	page,
}) => {
	let fail = true;
	await page.route("**/api/projects/nocoo/rio", (route) =>
		fail
			? route.fulfill({
					status: 503,
					contentType: "application/json",
					body: '{"error":"Unavailable"}',
				})
			: route.continue(),
	);
	await page.goto("/projects/rio#api");
	const section = page.locator("#api");
	await expect(section.locator("p[role=status]")).toContainText(
		"temporarily unavailable",
	);
	fail = false;
	await section.getByRole("button", { name: "Retry", exact: true }).click();
	await expect(section.locator(".api-preview")).toContainText("Rio");
	await page.locator(".picker-item").filter({ hasText: "Pew" }).first().click();
	await expect(section.locator(".api-preview")).toContainText("Pew");
	await expect(section.locator(".api-request")).toContainText(
		"/api/projects/nocoo/pew",
	);
});
