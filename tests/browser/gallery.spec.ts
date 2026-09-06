import { expect, test } from "@playwright/test";
import projects from "../../src/data/projects.json" with { type: "json" };

for (const id of ["frogie", "pew"]) {
	test(`compares refined ${id} with its original at artwork and application sizes`, async ({
		page,
	}) => {
		const project = projects.find((item) => item.id === id);
		if (!project?.family) throw new Error(`Missing refinement: ${id}`);
		const { family } = project;
		await page.goto(`/logos/${id}`);
		await expect(page.locator("#identity-title")).toContainText(project.title);
		await expect(page.locator(".artwork-image")).toHaveAttribute(
			"src",
			`${family.root}/icon-1024.webp`,
		);
		await page
			.locator(".artwork-image")
			.evaluate((node) => (node as HTMLImageElement).decode());
		await expect(page.locator(".asset-label")).toHaveText("Refined");
		await expect(page.locator(".current-artwork figcaption")).toContainText(
			"Local preview",
		);
		for (const [selector, size] of [
			[".size-grid figure:nth-child(1) .logo-tile", 128],
			[".size-grid figure:nth-child(2) .logo-tile", 64],
			[".size-grid figure:nth-child(3) .logo-tile", 32],
			[".size-grid figure:nth-child(4) .logo-tile", 16],
			[".preview-workspace .logo-plain", 24],
			[".browser-tab .logo-plain", 16],
		] as const) {
			await expect(page.locator(selector)).toHaveCSS("width", `${size}px`);
			await expect(page.locator(selector)).toHaveCSS("height", `${size}px`);
		}
		await expect(page.locator(".previous-artwork img")).toHaveAttribute(
			"src",
			`${family.root}/previous-1024.webp`,
		);
		for (const [name, value] of [
			["White", "white"],
			["Transparent", "transparent"],
			["Icon", "icon"],
		]) {
			const button = page.getByRole("button", { name, exact: true });
			await button.click();
			await expect(button).toHaveAttribute("aria-pressed", "true");
			await expect(page.locator(".logo-review")).toHaveAttribute(
				"data-presentation",
				value ?? "",
			);
			await expect(page.locator(".artwork-image")).toHaveAttribute(
				"src",
				value === "icon"
					? `${family.root}/icon-1024.webp`
					: family.foreground.display,
			);
			await expect(
				page.locator(".current-artwork .review-tile"),
			).toHaveAttribute(
				"href",
				value === "transparent"
					? family.foreground.original
					: `${family.root}/${value}.png`,
			);
		}
		await expect(page.locator(".sidebar-sample")).toContainText("AI & agents");
		await expect(page.locator(".alpha-grid img")).toHaveCount(2);
		for (const image of await page.locator(".alpha-grid img").all())
			await expect(image).toHaveAttribute("src", family.foreground.display);
		for (const link of await page.locator(".alpha-grid a").all())
			await expect(link).toHaveAttribute("href", family.foreground.original);
		await page
			.getByText("Read the exact generation prompt", { exact: true })
			.click();
		await expect(page.locator(".generation-prompt")).toContainText(
			project.title,
		);
		await expect(page.locator(".reference-grid")).toHaveCount(0);
		await expect(
			page.getByText("View the presentation references", { exact: true }),
		).toHaveCount(0);
		await expect(
			page.getByRole("link", { name: "Untouched generation" }),
		).toHaveAttribute("href", `${family.root}/raw.png`);
		const downloadEvent = page.waitForEvent("download");
		await page.getByRole("link", { name: "Download original" }).click();
		const download = await downloadEvent;
		expect(download.suggestedFilename()).toBe(`${id}-transparent.png`);
		expect(await download.failure()).toBeNull();
		await expect(
			page.getByRole("link", { name: "View asset source" }),
		).toHaveAttribute("href", project.logo.sourceUrl);
	});
}

test("updates the identity path with pagination and browser history", async ({
	page,
}) => {
	await page.goto("/logos/frogie");
	await page.getByRole("button", { name: "Next identity" }).click();
	await expect(page).toHaveURL(/\/logos\/pew$/);
	await expect(page.locator("#identity-title")).toContainText("Pew");
	await expect(page.locator(".previous-artwork")).toBeVisible();
	await page.reload();
	await expect(page.locator("#identity-title")).toContainText("Pew");
	await page.getByRole("button", { name: "Previous identity" }).click();
	await expect(page).toHaveURL(/\/logos\/frogie$/);
	await page.goBack();
	await expect(page.locator("#identity-title")).toContainText("Pew");
});

test("copies current palette colors and a reusable gallery link", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/logos/pew");
	await page
		.getByRole("button", { name: "Copy color #bfb2cf", exact: true })
		.click();
	await expect(page.locator(".toast")).toHaveText("Copied #bfb2cf");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"#bfb2cf",
	);
	await page.getByRole("button", { name: "Copy gallery link" }).click();
	const link = await page.evaluate(() => navigator.clipboard.readText());
	expect(new URL(link).pathname).toBe("/logos/pew");
	expect(new URL(link).search).toBe("");
	await page.goto(link);
	await expect(page.locator("#identity-title")).toContainText("Pew");
});

test("searches the gallery, labels emoji identities, and recovers from empty or unknown selections", async ({
	page,
}) => {
	await page.goto("/logos/unknown-project");
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await expect(page).toHaveURL(/\/logos\/frogie$/);
	const search = page.getByRole("searchbox", { name: "Search projects" });
	await page
		.getByRole("combobox", { name: "Project categories" })
		.selectOption("archive");
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
	await expect(page.locator(".picker-item")).toHaveCount(
		projects.filter((project) => !project.archived).length,
	);
	await page.locator(".picker-item").filter({ hasText: "Backy" }).click();
	await expect(page.locator("#identity-title")).toContainText("Backy");
	await expect(page).toHaveURL(/\/logos\/backy$/);
});
