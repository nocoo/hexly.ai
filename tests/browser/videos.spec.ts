import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import sharp from "sharp";
import {
	endingIds,
	parseFilm,
	templateIds,
} from "../../packages/video-kit/src/schema";
import workflow from "../../src/data/projects/microsoft-teams-send-as-workflow.json" with {
	type: "json",
};
import { videoCopy } from "../../src/data/video-copy";

test("the collection shows the chosen project in 5 openings, 5 layouts and 5 endings, in both themes", async ({
	page,
}) => {
	const errors: string[] = [];
	const media: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("request", (request) => {
		if (/\.(mp4|webm)(\?|$)/.test(request.url())) media.push(request.url());
	});
	await page.goto("/templates");
	await page.getByLabel("Your project", { exact: true }).selectOption("bogo");
	const library = page.getByRole("group", { name: "Component family" });
	for (const family of ["Content", "Openings", "Endings"]) {
		await library
			.getByRole("button", { name: new RegExp(`^${family}`) })
			.click();
		await expect(page.locator("[data-video-template]")).toHaveCount(5);
		for (const theme of ["Light", "Dark"]) {
			await page
				.getByRole("group", { name: "Preview theme" })
				.getByRole("button", { name: theme, exact: true })
				.click();
			await expect(
				page.locator(
					`.video-card .vk-canvas[data-video-theme="${theme.toLowerCase()}"]`,
				),
			).toHaveCount(5);
		}
	}
	await page.getByLabel("Your project", { exact: true }).selectOption("pew");
	await expect(
		library.getByRole("button", { name: /^Endings/ }),
	).toHaveAttribute("aria-pressed", "true");
	await page.reload();
	await expect(
		library.getByRole("button", { name: /^Endings/ }),
	).toHaveAttribute("aria-pressed", "true");
	await page.getByLabel("Your project", { exact: true }).selectOption("bogo");
	await page
		.getByRole("link", { name: "Explore: Colophon", exact: true })
		.click();
	await expect(
		page.locator('.vk-stage [data-ending="colophon"]'),
	).toBeVisible();
	await expect(page.locator(".vk-stage [data-hexly-caption]")).toContainText(
		"Bogo",
	);
	expect(await page.locator("video").count()).toBe(0);
	expect(media).toEqual([]);
	expect(errors).toEqual([]);
});

test("mixes every content layout, preserves independent choices and switches between Video and Deck", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto("/templates/launch?project=bogo&opening=stack&ending=frame");
	for (const template of templateIds) {
		await page
			.getByLabel("Content template", { exact: true })
			.selectOption(template);
		await expect(
			page.locator(
				`.vk-stage [data-video-scene="content"][data-template="${template}"]`,
			),
		).toBeVisible();
		await expect(page.locator(".vk-stage [data-video-title]")).toHaveText(
			"Bogo",
		);
		for (const theme of ["Dark", "Light"]) {
			await page
				.getByRole("group", { name: "Preview theme" })
				.getByRole("button", { name: theme, exact: true })
				.click();
			await expect(page.locator(".vk-stage .vk-canvas")).toHaveAttribute(
				"data-video-theme",
				theme.toLowerCase(),
			);
		}
		await page
			.getByRole("button", { name: "Deck / PPT Preview", exact: true })
			.click();
		await expect(page.locator(".vk-deck-controls span")).toHaveText("4 / 7");
		await page.getByRole("button", { name: "Next slide", exact: true }).click();
		await expect(page.locator(".vk-deck-controls span")).toHaveText("5 / 7");
		await page
			.getByRole("button", { name: "Previous slide", exact: true })
			.click();
		await page
			.getByRole("button", { name: "Video Preview", exact: true })
			.click();
		await expect(page.getByLabel("Opening", { exact: true })).toHaveValue(
			"stack",
		);
		await expect(page.getByLabel("Ending", { exact: true })).toHaveValue(
			"frame",
		);
	}
	await page
		.getByLabel("Your project", { exact: true })
		.selectOption(workflow.id);
	await expect(page.locator(".vk-stage [data-video-title]")).toHaveText(
		workflow.title,
	);
	await page.reload();
	await expect(page.getByLabel("Your project", { exact: true })).toHaveValue(
		workflow.id,
	);
	await expect(page.getByLabel("Opening", { exact: true })).toHaveValue(
		"stack",
	);
	await expect(page.getByLabel("Ending", { exact: true })).toHaveValue("frame");
	await page.emulateMedia({ reducedMotion: "no-preference" });
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

test("exports exactly the chosen composition and local screenshot, without mixing project uploads", async ({
	page,
}) => {
	await page.goto(
		"/templates/showcase?project=bogo&mode=deck&theme=dark&opening=frame&ending=colophon",
	);
	await page
		.locator('.video-upload input[type="file"]')
		.setInputFiles("docs/screenshots/directory-light.png");
	await expect(
		page.getByRole("button", { name: "Remove screenshot", exact: true }),
	).toBeVisible();
	await expect(page.locator('.vk-stage img[src^="data:"]')).toBeVisible();
	await page
		.getByLabel("Content template", { exact: true })
		.selectOption("columns");
	await page.getByLabel("Opening", { exact: true }).selectOption("index");
	await page.getByLabel("Ending", { exact: true }).selectOption("split");
	await page
		.getByRole("group", { name: "Preview theme" })
		.getByRole("button", { name: "Light", exact: true })
		.click();
	await page
		.getByLabel("Frame format", { exact: true })
		.selectOption("portrait");
	const downloading = page.waitForEvent("download");
	await page.getByRole("button", { name: /Download setup/ }).click();
	const file = await downloading;
	expect(file.suggestedFilename()).toBe("bogo-columns-index-split-light.json");
	const stream = await file.createReadStream();
	const chunks: Buffer[] = [];
	for await (const chunk of stream) chunks.push(chunk);
	const config = parseFilm(JSON.parse(Buffer.concat(chunks).toString()));
	expect(config).toMatchObject({
		schemaVersion: 2,
		template: "columns",
		theme: "light",
		opening: "index",
		ending: "split",
		format: "portrait",
		motion: "reduced",
		project: { id: "bogo" },
	});
	expect(config.project.screenshot?.src).toMatch(/^data:image\/png;base64,/);
	expect(config.scenes).toHaveLength(7);
	await page
		.getByRole("button", { name: "Video Preview", exact: true })
		.click();
	await expect(page.locator(".vk-preview")).toHaveAttribute(
		"data-motion",
		"reduced",
	);
	await expect(page.getByLabel("Reduce motion", { exact: true })).toBeChecked();
	await page.getByLabel("Your project", { exact: true }).selectOption("pew");
	await expect(page.locator('.vk-stage img[src^="data:"]')).toHaveCount(0);
	await page.goBack();
	await expect(page.getByLabel("Your project", { exact: true })).toHaveValue(
		"bogo",
	);
	await expect(
		page.getByRole("button", { name: "Remove screenshot", exact: true }),
	).toHaveCount(0);
});

test("keeps long Latin and Chinese copy complete inside the cover and chapter cells", async ({
	page,
}) => {
	const title =
		"Microsoft Teams Workflow and Knowledge Management for Distributed Product Teams";
	const summary = {
		en: "A project brings together people, documents, interfaces and dependable tools. "
			.repeat(8)
			.slice(0, 500),
		zh: "这是一个用于检查长段文字排版的本地测试项目。支持资料整理、协作记录与工作流程。"
			.repeat(20)
			.slice(0, 500),
	};
	await page.route("**/data/projects.json", async (route) => {
		const response = await route.fetch();
		const data = await response.json();
		const project = data.find((item: { id: string }) => item.id === "bogo");
		project.title = title;
		project.description = summary;
		await route.fulfill({ response, json: data });
	});
	await page.goto("/templates/showcase?project=bogo&mode=deck");
	for (const locale of ["en", "zh"] as const) {
		if (locale === "zh")
			await page.getByRole("button", { name: "Switch to Chinese" }).click();
		for (const format of ["landscape", "portrait"]) {
			await page.locator(".vk-format select").selectOption(format);
			for (const opening of ["index", "horizon", "stack", null]) {
				if (opening)
					await page
						.locator(".video-composition select")
						.first()
						.selectOption(opening);
				else await page.locator(".vk-chapter-grid button").nth(2).click();
				if (opening) {
					await expect(page.locator(".vk-stage [data-video-title]")).toHaveText(
						title,
					);
					await expect(page.locator(".vk-stage [data-video-body]")).toHaveText(
						summary[locale],
					);
				} else {
					await expect(
						page.locator(".vk-stage [data-video-body]"),
					).toContainText(title);
				}
				await page.evaluate(() => document.fonts.ready);
				await expect
					.poll(() =>
						page.locator(".vk-stage .vk-canvas").evaluate((canvas) => {
							const overflow: string[] = [];
							for (const element of canvas.querySelectorAll(
								"[data-video-title], [data-video-body]",
							)) {
								const bounds = element.getBoundingClientRect();
								let parent = element.parentElement;
								while (parent && canvas.contains(parent)) {
									const style = getComputedStyle(parent);
									if (
										parent.hasAttribute("data-fit-cell") ||
										style.overflow === "hidden"
									) {
										const cell = parent.getBoundingClientRect();
										if (
											bounds.top < cell.top - 1 ||
											bounds.bottom > cell.bottom + 1 ||
											bounds.left < cell.left - 1 ||
											bounds.right > cell.right + 1
										)
											overflow.push(element.textContent ?? "");
									}
									parent = parent.parentElement;
								}
							}
							return overflow;
						}),
					)
					.toEqual([]);
			}
		}
	}
});

test("has a narrow Chinese deck, an independent dark canvas and compact site navigation", async ({
	page,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 780 });
	await page.goto("/templates/columns?project=pew&mode=deck&theme=dark");
	await expect(page.locator(".vk-stage [data-video-title]")).toContainText(
		"Pew",
	);
	await page.getByRole("button", { name: "Switch to Chinese" }).click();
	await expect(
		page.getByRole("button", { name: videoCopy.zh.config, exact: false }),
	).toBeVisible();
	await expect(page.locator(".vk-stage .vk-canvas")).toHaveAttribute(
		"data-video-theme",
		"dark",
	);
	expect(await page.locator(".view-link-label").allTextContents()).toEqual([
		"项目",
		"模板",
		"状态",
	]);
	await page.getByRole("button", { name: "主题：浅色；切换为深色" }).click();
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

for (const theme of ["light", "dark"] as const) {
	test(`preserves the complete wordmark ink in every ${theme} ending and logo reveal`, async ({
		page,
		isMobile,
	}) => {
		for (const [index, ending] of [...endingIds, "logo"].entries()) {
			const mode = (index + Number(theme === "dark")) % 2 ? "deck" : "video";
			const query = new URLSearchParams({
				project: "hexly-ai",
				theme,
				mode,
				ending: ending === "logo" ? "signature" : ending,
				part: "outro",
			});
			await page.goto(`/templates/launch?${query}`);
			if (ending === "logo")
				await page
					.locator(".vk-chapter-grid")
					.getByRole("button", { name: /Logo reveal/ })
					.click();
			if (isMobile && ending === "logo")
				await page
					.getByLabel("Frame format", { exact: true })
					.selectOption("portrait");
			const wordmark = page.locator(".vk-stage [data-hexly-wordmark]");
			await expect(wordmark).toHaveText("hexly.ai");
			await page.evaluate(() => document.fonts.ready);
			await expect(page.locator('.vk-stage [data-scene="logo"]')).toHaveCSS(
				"opacity",
				"1",
			);
			await expect(wordmark).toHaveCSS("opacity", "1");
			// Compare painted ink, not DOM bounds: descenders can exceed a line box.
			// Capture with vertical room, then isolate the wordmark from other artwork.
			const stage = page.locator(".vk-stage > div").first();
			const masked = await stage.screenshot();
			const bounds = await wordmark.boundingBox();
			const canvas = await stage.boundingBox();
			if (!bounds || !canvas)
				throw new Error("Missing wordmark or canvas bounds");
			const pixelScale = (await sharp(masked).metadata()).width / canvas.width;
			const padding = bounds.height / 2;
			const crop = {
				left: Math.floor((bounds.x - canvas.x - padding) * pixelScale),
				top: Math.floor((bounds.y - canvas.y - padding) * pixelScale),
				width: Math.ceil((bounds.width + padding * 2) * pixelScale),
				height: Math.ceil((bounds.height + padding * 2) * pixelScale),
			};
			await wordmark.evaluate((element) => {
				element.style.overflow = "visible";
				element.style.clipPath = "none";
			});
			const unmasked = await stage.screenshot();
			expect(
				(await sharp(masked).extract(crop).raw().toBuffer()).equals(
					await sharp(unmasked).extract(crop).raw().toBuffer(),
				),
				`${ending}, ${theme}, ${mode}: the settled mask must not cut off glyph ink`,
			).toBe(true);
		}
	});
}
