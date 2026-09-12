import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import workflow from "../../src/data/projects/microsoft-teams-send-as-workflow.json" with {
	type: "json",
};
import { videoCopy } from "../../src/data/video-copy";

test("explores all five templates with one real project in Video and Deck", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});
	await page.goto("/videos");
	await expect(page.locator("[data-video-template]")).toHaveCount(5);
	await page.getByLabel("Your project", { exact: true }).selectOption("bogo");
	await page
		.getByRole("link", { name: "Explore template: Launch", exact: true })
		.click();
	for (const name of ["Launch", "Studio", "Editorial", "Pulse", "Essential"]) {
		await page
			.getByRole("navigation", { name: "Template", exact: true })
			.getByRole("link", { name, exact: true })
			.click();
		await expect(page.locator("[data-video-title]")).toContainText("Bogo");
		await page
			.getByRole("button", { name: "Deck / PPT Preview", exact: true })
			.click();
		await expect(page).toHaveURL(
			new RegExp(`/videos/${name.toLowerCase()}\\?project=bogo&mode=deck$`),
		);
		await page.getByRole("button", { name: "Next slide", exact: true }).click();
		await expect(page.locator(".vk-deck-controls span")).toHaveText("2 / 7");
		await page
			.getByRole("button", { name: "Previous slide", exact: true })
			.click();
		await expect(page.locator("[data-video-title]")).toContainText("Bogo");
		await page
			.getByRole("button", { name: "Video Preview", exact: true })
			.click();
	}
	await page
		.getByLabel("Your project", { exact: true })
		.selectOption(workflow.id);
	await expect(page.locator("[data-video-title]")).toHaveText(workflow.title);
	await page.reload();
	await expect(page.getByLabel("Your project", { exact: true })).toHaveValue(
		workflow.id,
	);
	const seek = page.getByRole("slider", { name: "Seek preview", exact: true });
	const initial = Number(await seek.inputValue());
	await page.getByRole("button", { name: "Play preview", exact: true }).click();
	await expect
		.poll(async () => Number(await seek.inputValue()))
		.toBeGreaterThan(initial);
	await page
		.getByRole("button", { name: "Pause preview", exact: true })
		.click();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
	expect(errors).toEqual([]);
});

test("previews a local screenshot, exports the same content, and respects reduced motion", async ({
	page,
}) => {
	await page.goto("/videos/launch?project=bogo&mode=deck");
	await page
		.locator('.video-upload input[type="file"]')
		.setInputFiles("docs/screenshots/directory-light.png");
	await expect(
		page.getByRole("button", { name: "Remove screenshot", exact: true }),
	).toBeVisible();
	await expect(page.locator('.vk-stage img[src^="data:"]')).toBeVisible();
	const downloading = page.waitForEvent("download");
	await page.getByRole("button", { name: /Download project setup/ }).click();
	const file = await downloading;
	expect(file.suggestedFilename()).toBe("bogo-launch.json");
	const stream = await file.createReadStream();
	const chunks: Buffer[] = [];
	for await (const chunk of stream) chunks.push(chunk);
	const config = JSON.parse(Buffer.concat(chunks).toString());
	expect(config.project.id).toBe("bogo");
	expect(config.project.screenshot.src).toMatch(/^data:image\/png;base64,/);
	expect(config.scenes).toHaveLength(7);
	await page
		.getByRole("button", { name: "Video Preview", exact: true })
		.click();
	await expect(page.locator(".vk-preview")).toHaveAttribute(
		"data-motion",
		"reduced",
	);
	await expect(page.getByLabel("Reduce motion", { exact: true })).toBeChecked();
	await page
		.getByRole("button", { name: "Remove screenshot", exact: true })
		.click();
	await expect(page.locator('.vk-stage img[src^="data:"]')).toHaveCount(0);
	await page.getByLabel("Your project", { exact: true }).selectOption("pew");
	await page
		.locator('.video-upload input[type="file"]')
		.setInputFiles("docs/screenshots/directory-light.png");
	await expect(
		page.getByRole("button", { name: "Remove screenshot", exact: true }),
	).toBeVisible();
	await page.goBack();
	await expect(page.getByLabel("Your project", { exact: true })).toHaveValue(
		"bogo",
	);
	await expect(page.locator('.vk-stage img[src^="data:"]')).toHaveCount(0);
	await expect(
		page.getByRole("button", { name: "Remove screenshot", exact: true }),
	).toHaveCount(0);
});

test("has an accessible narrow Chinese deck with the shared site controls", async ({
	page,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 780 });
	await page.goto("/videos/editorial?project=pew&mode=deck");
	await expect(page.locator("[data-video-title]")).toContainText("Pew");
	await page.getByRole("button", { name: "Switch to Chinese" }).click();
	await expect(
		page.getByRole("button", { name: videoCopy.zh.config, exact: false }),
	).toBeVisible();
	await page.getByRole("button", { name: "主题：浅色；切换为深色" }).click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
	await page.evaluate(() => document.fonts.ready);
	expect(
		(
			await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
				.analyze()
		).violations,
	).toEqual([]);
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
});
