import { expect, test } from "@playwright/test";
import projects from "../../src/data/projects.json" with { type: "json" };

test("inspects an original at artwork, app, sidebar, and favicon sizes", async ({
	page,
}) => {
	await page.goto("/?view=logos&project=frogie");
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await expect(page.locator(".artwork-image")).toHaveAttribute(
		"src",
		"/logos/display/frogie-1024.webp",
	);
	await page
		.locator(".artwork-image")
		.evaluate((node) => (node as HTMLImageElement).decode());
	await expect(page.locator(".asset-label")).toHaveText("Family reference");
	for (const [selector, size] of [
		[".app-preview .logo-tile", 80],
		[".preview-workspace .logo-plain", 24],
		[".browser-tab .logo-plain", 16],
	] as const) {
		await expect(page.locator(selector)).toHaveCSS("width", `${size}px`);
		await expect(page.locator(selector)).toHaveCSS("height", `${size}px`);
	}
	for (const [name, className] of [
		["Light", "white"],
		["Dark", "black"],
		["Transparent", "transparent"],
		["Paper", "paper"],
	]) {
		const button = page.getByRole("button", {
			name: `Preview background: ${name}`,
			exact: true,
		});
		await button.click();
		await expect(button).toHaveAttribute("aria-pressed", "true");
		await expect(page.locator(".artwork-stage")).toHaveClass(
			`artwork-stage surface-${className}`,
		);
	}
	await page.getByRole("button", { name: "Next identity" }).click();
	await expect(page.locator("#identity-title")).toContainText("Pew");
	await page.getByRole("button", { name: "Previous identity" }).click();
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	const downloadEvent = page.waitForEvent("download");
	await page.getByRole("link", { name: "Download original" }).click();
	const download = await downloadEvent;
	expect(download.suggestedFilename()).toBe("frogie.png");
	expect(await download.failure()).toBeNull();
	await expect(
		page.getByRole("link", { name: "View asset source" }),
	).toHaveAttribute(
		"href",
		/github\.com\/nocoo\/frogie\/blob\/[a-f0-9]+\/logo\.png/,
	);
});

test("copies current palette colors and a reusable gallery link", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/?view=logos&project=pew");
	await page
		.getByRole("button", { name: "Copy color #851ded", exact: true })
		.click();
	await expect(page.locator(".toast")).toHaveText("Copied #851ded");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"#851ded",
	);
	await page.getByRole("button", { name: "Copy gallery link" }).click();
	const link = await page.evaluate(() => navigator.clipboard.readText());
	expect(new URL(link).search).toBe("?view=logos&project=pew");
	await page.goto(link);
	await expect(page.locator("#identity-title")).toContainText("Pew");
});

test("searches the gallery, labels emoji identities, and recovers from empty or unknown selections", async ({
	page,
}) => {
	await page.goto("/?view=logos&project=unknown-project");
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	const search = page.getByRole("searchbox", { name: "Search projects" });
	await search.fill("uptime kuma");
	await expect(page.locator(".picker-item")).toHaveCount(1);
	await expect(page.locator("#identity-title")).toContainText(
		"Uptime Kuma Skill",
	);
	await expect(page.locator(".asset-label")).toHaveText("Emoji identity");
	await expect(page.locator(".identity-footer")).toContainText("profile emoji");
	await expect(
		page.getByRole("link", { name: "Download identity" }),
	).toHaveAttribute("href", "/logos/emoji/uptime-kuma-skill.png");
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
	await search.fill("there-is-no-such-project");
	await expect(
		page.getByRole("heading", { name: "Nothing here just yet." }),
	).toBeVisible();
	await page.getByRole("button", { name: "Reset filters" }).click();
	await expect(page.locator(".picker-item")).toHaveCount(projects.length);
	await page.locator(".picker-item").filter({ hasText: "Backy" }).click();
	await expect(page.locator("#identity-title")).toContainText("Backy");
	await expect(page).toHaveURL(/project=backy/);
});
