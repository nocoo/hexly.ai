import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { copy } from "../../src/data/copy";
import manifest from "../../src/data/template-examples.json" with {
	type: "json",
};
import { expect, test, touch } from "./fixtures";

test.describe("touch outro library", () => {
	test.use(touch);
	test("browses standard outros and copies an original handoff without fetching movies", async ({
		page,
		context,
	}) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		const movies: string[] = [];
		page.on("request", (request) => {
			if (request.url().endsWith(".mp4")) movies.push(request.url());
		});
		await page.goto("/templates/launch#outros");
		await expect(page.locator("[data-template-example]")).toHaveCount(5);
		await expect(page.locator("#outros")).toContainText("any project");
		await page.goto("/templates#examples");
		await expect(page.locator("[data-template-example]")).toHaveCount(5);
		await expect(page.locator("#template-examples-title")).toBeInViewport();
		await page.goto("/templates#outros");
		await expect(page).toHaveURL(/\/templates#outros$/);
		const section = page.locator("#outros");
		await expect(
			section.getByRole("heading", { name: "Standard outros" }),
		).toBeInViewport();
		await expect(section.locator("[data-template-example]")).toHaveCount(5);
		await expect(page.locator("video")).toHaveCount(0);
		for (const example of manifest.examples) {
			const card = section.getByRole("article", {
				name: example.video.title.en,
				exact: true,
			});
			await expect(
				card.getByRole("link", { name: "Direct link" }),
			).toHaveAttribute("href", example.video.src);
			await expect(
				card.getByRole("link", { name: "4K still" }),
			).toHaveAttribute("href", example.still.src);
		}
		expect(movies).toEqual([]);
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		).toBe(true);
		const scan = await new AxeBuilder({ page })
			.include("#outros")
			.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
			.analyze();
		expect(scan.violations).toEqual([]);
		await page.locator(".theme-toggle").click();
		expect(
			(
				await new AxeBuilder({ page })
					.include("#outros")
					.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
					.analyze()
			).violations,
		).toEqual([]);
		const outro = manifest.examples[0];
		if (!outro) throw new Error("Missing standard outro");
		const card = page.locator(`[data-template-example="${outro.video.id}"]`);
		await card.getByRole("button", { name: "Copy for agent" }).click();
		const handoff = await page.evaluate(() => navigator.clipboard.readText());
		expect(handoff).toContain(`- MP4: ${outro.video.src}`);
		expect(handoff).toContain(`- SHA-256: ${outro.video.sha256}`);
		expect(handoff).toContain(
			"Download and append the original clip; no project configuration or regeneration is required.",
		);
		await card.locator("summary").click();
		await expect(card.locator("pre")).toHaveJSProperty("textContent", handoff);
		await expect(page.locator("video")).toHaveCount(0);

		await page.getByRole("button", { name: "Switch to Chinese" }).click();
		await expect(
			section.getByRole("heading", { name: "标准片尾" }),
		).toBeVisible();
		await expect(section).toContainText("均为浅色、无声");
		await page.getByLabel("选择项目", { exact: true }).selectOption("bogo");
		await page
			.getByRole("group", { name: "预览主题" })
			.getByRole("button", { name: "深色", exact: true })
			.click();
		await expect(
			section.locator(".project-video-poster").first(),
		).toHaveAttribute(
			"aria-label",
			`播放视频: ${manifest.examples[0]?.video.title.zh}`,
		);
		await expect(
			section.locator(".project-video-poster img").first(),
		).toHaveAttribute("src", manifest.examples[0]?.video.poster ?? "");
		expect(movies).toEqual([]);
	});
});

test("starts media only after a click, preserves direct links on failure and downloads original bytes", async ({
	page,
}) => {
	const example = manifest.examples[0];
	if (!example) throw new Error("Expected the published examples");
	await page.route(example.video.src, (route) =>
		route.fulfill({
			status: 503,
			body: "Local playback failure fixture",
			headers: { "Access-Control-Allow-Origin": "*" },
		}),
	);
	await page.goto("/templates#examples");
	const card = page.locator(`[data-template-example="${example.video.id}"]`);
	await expect(card.locator("video")).toHaveCount(0);
	await card
		.getByRole("button", { name: `Play video: ${example.video.title.en}` })
		.click();
	await expect(card.locator("video")).toHaveAttribute("src", example.video.src);
	await expect(card.locator("video")).toHaveAttribute("controls", "");
	await expect(card.locator("video")).toHaveAttribute("playsinline", "");
	await expect(card.getByRole("alert")).toContainText(copy.en.videoFailed);
	await expect(card.getByRole("link", { name: "Direct link" })).toHaveAttribute(
		"href",
		example.video.src,
	);
	await page.unroute(example.video.src);
	const bytes = Buffer.from("local original-download fixture");
	for (const [src, label, type] of [
		[example.video.src, "Download MP4", "video/mp4"],
		[example.still.src, "4K still", "image/png"],
	] as const) {
		await page.route(`${src}*`, (route) =>
			route.fulfill({
				body: bytes,
				contentType: type,
				headers: { "Access-Control-Allow-Origin": "*" },
			}),
		);
		const downloading = page.waitForEvent("download");
		await card.getByRole("link", { name: label }).click();
		const download = await downloading;
		expect(download.suggestedFilename()).toBe(
			new URL(src).pathname.split("/").at(-1),
		);
		const path = await download.path();
		if (!path) throw new Error("Download did not produce a file");
		expect(await readFile(path)).toEqual(bytes);
	}
});
