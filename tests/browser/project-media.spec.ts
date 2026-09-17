import { createHash } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import type { Project } from "../../src/model/project";
import { screenshotFixture, videoFixture } from "../fixtures/project-media";
import { expect, test } from "./fixtures";

// Exercise media locally; real catalogue recordings must not become CI downloads.
const projects = readProjects().map((project) => ({
	...project,
	media: undefined,
}));
const poster =
	'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><rect width="960" height="540" fill="#f0f0e9"/><rect x="120" y="80" width="720" height="360" rx="18" fill="#fbfbf8" stroke="#d5d8ca"/><circle cx="165" cy="125" r="8" fill="#bf5c3c"/><text x="200" y="134" font-size="28" fill="#30382f">Local playback fixture</text><path d="M165 180H780M165 220H650" stroke="#d5d8ca" stroke-width="12"/></svg>';

async function mockMedia(page: Page, media: Project["media"], clip?: Buffer) {
	const requests: string[] = [];
	await page.route("**/data/projects.json", (route) =>
		route.fulfill({
			json: projects.map((project) =>
				project.id === "pew" ? { ...project, media } : project,
			),
		}),
	);
	await page.route("**/test-media/poster.svg", (route) =>
		route.fulfill({ contentType: "image/svg+xml", body: poster }),
	);
	await page.route("https://h.no.mt/test/**", (route) => {
		requests.push(route.request().url());
		return route.request().url().endsWith(".vtt")
			? route.fulfill({
					contentType: "text/vtt",
					headers: { "Access-Control-Allow-Origin": "*" },
					body: "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nPlayback fixture\n",
				})
			: clip
				? route.fulfill({
						contentType: "video/webm",
						headers: {
							"Access-Control-Allow-Origin": "*",
							"Accept-Ranges": "bytes",
						},
						body: clip,
					})
				: route.fulfill({
						status: 503,
						headers: { "Access-Control-Allow-Origin": "*" },
						body: "Test media unavailable",
					});
	});
	return requests;
}

test("projects without media have a complete detail and no empty video sections", async ({
	page,
}) => {
	await mockMedia(page, undefined);
	await page.goto("/projects/frogie");
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await expect(page.locator(".project-media")).toHaveCount(0);
	await expect(
		page.locator('.project-section-nav a[href="#media"]'),
	).toHaveCount(0);
	await expect(page.locator("#overview")).toBeVisible();
	await expect(page.locator("#brand")).toBeVisible();
});

test("clicks a poster to fetch and play real media with captions and native controls", async ({
	page,
}, testInfo) => {
	// A tiny neutral clip exists only in browser memory; no finished project film enters Git.
	const bytes = await page.evaluate(async () => {
		const canvas = document.createElement("canvas");
		canvas.width = 320;
		canvas.height = 180;
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Canvas unavailable");
		const stream = canvas.captureStream(20);
		const recorder = new MediaRecorder(stream, {
			mimeType: "video/webm;codecs=vp8",
		});
		const chunks: Blob[] = [];
		recorder.ondataavailable = (event) => chunks.push(event.data);
		const recorded = new Promise<Blob>((resolve) => {
			recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
		});
		recorder.start();
		let frame = 0;
		const draw = setInterval(() => {
			context.fillStyle = "#f0f0e9";
			context.fillRect(0, 0, 320, 180);
			context.fillStyle = "#bf5c3c";
			context.fillRect(20 + frame++ * 4, 80, 20, 20);
		}, 50);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		clearInterval(draw);
		recorder.stop();
		const data = new Uint8Array(await (await recorded).arrayBuffer());
		for (const track of stream.getTracks()) track.stop();
		return [...data];
	});
	const clip = Buffer.from(bytes);
	const requests = await mockMedia(
		page,
		{
			videos: [
				{
					...videoFixture,
					durationSeconds: 2,
					sha256: createHash("sha256").update(clip).digest("hex"),
				},
			],
		},
		clip,
	);
	await page.goto("/projects/pew#video-introduction");
	const play = page.getByRole("button", {
		name: "Play video: Playback sample",
	});
	await expect(play).toBeVisible();
	await expect(page.locator("video")).toHaveCount(0);
	expect(requests).toEqual([]);
	await play.click();
	const video = page.locator(".project-film video");
	await expect(video).toHaveAttribute("src", videoFixture.src);
	await expect(video).toHaveAttribute("controls", "");
	await expect(video).toHaveAttribute("playsinline", "");
	await expect
		.poll(() =>
			video.evaluate((element: HTMLVideoElement) => element.currentTime),
		)
		.toBeGreaterThan(0);
	await video.evaluate((element: HTMLVideoElement) => element.pause());
	await expect(video.locator("track")).toHaveCount(2);
	await expect
		.poll(() =>
			video
				.locator('track[srclang="en"]')
				.evaluate((element: HTMLTrackElement) => element.readyState),
		)
		.toBe(2);
	expect(requests).toContain(videoFixture.src);
	const url = page.url();
	await video.focus();
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(url);
	const scan = await new AxeBuilder({ page })
		.include(".project-media")
		.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
		.analyze();
	expect(scan.violations).toEqual([]);
	await page
		.locator(".project-media")
		.screenshot({ path: testInfo.outputPath("native-video.png") });
	await page.unroute("**/data/projects.json");
	await mockMedia(
		page,
		{
			videos: [{ ...videoFixture, captionsBurnedIn: true }],
		},
		clip,
	);
	await page.reload();
	await play.click();
	await expect(video.locator("track")).toHaveCount(2);
	await expect(video.locator("track[default]")).toHaveCount(0);
});

test("opens recordings from project details, selects videos and restores hash history", async ({
	page,
}, testInfo) => {
	const second = {
		...videoFixture,
		id: "walkthrough",
		title: { en: "Walkthrough sample", zh: "操作示例" },
		src: "https://h.no.mt/test/walkthrough.webm",
	};
	const requests = await mockMedia(page, {
		videos: [videoFixture, second],
		screenshots: [screenshotFixture],
	});
	await page.goto("/?media=video");
	await expect(page.locator(".project-card")).toHaveCount(
		projects.filter((project) => !project.archived).length,
	);
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole("checkbox", { name: "With video" })).toHaveCount(
		0,
	);
	await expect(page.locator(".card-video")).toHaveCount(0);
	await page.locator('[data-project="pew"] .card-main').click();
	await page
		.locator('.project-video-list a[href="#video-introduction"]')
		.click();
	await expect(page).toHaveURL(/\/projects\/pew#video-introduction$/);
	await expect(page.locator(".project-screenshots img")).toHaveAttribute(
		"alt",
		screenshotFixture.alt.en,
	);
	await page
		.locator('.project-video-list a[href="#video-walkthrough"]')
		.click();
	await expect(page.locator(".project-film")).toHaveAttribute(
		"id",
		"video-walkthrough",
	);
	await expect(
		page.locator('.project-video-list a[aria-current="true"]'),
	).toContainText("Walkthrough sample");
	await page.goBack();
	await expect(page.locator(".project-film")).toHaveAttribute(
		"id",
		"video-introduction",
	);
	await page.goForward();
	await expect(page.locator(".project-film")).toHaveAttribute(
		"id",
		"video-walkthrough",
	);
	await page.reload();
	await expect(page.locator(".project-film")).toHaveAttribute(
		"id",
		"video-walkthrough",
	);
	await page.locator('.project-section-nav a[href="#brand"]').click();
	await expect(page.locator(".project-film")).toHaveAttribute(
		"id",
		"video-walkthrough",
	);
	expect(requests).toEqual([]);
	await page.locator('.project-section-nav a[href="#media"]').click();
	await page.getByRole("button", { name: "Switch to Chinese" }).click();
	await expect(
		page.getByRole("button", { name: "播放视频: 操作示例" }),
	).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
	await page
		.locator(".project-media")
		.screenshot({ path: testInfo.outputPath("poster-and-screenshots.png") });
});

test("shows a recoverable media failure and supports screenshot-only projects", async ({
	page,
}) => {
	await mockMedia(page, { videos: [videoFixture] });
	await page.goto("/projects/pew");
	await page
		.getByRole("button", { name: "Play video: Playback sample" })
		.click();
	await expect(page.locator(".project-video-error")).toBeVisible();
	await expect(page.locator(".project-video-error a")).toHaveAttribute(
		"href",
		videoFixture.src,
	);
	await page.unroute("**/data/projects.json");
	await mockMedia(page, { screenshots: [screenshotFixture] });
	await page.reload();
	await expect(page.locator(".project-screenshots img")).toBeVisible();
	await expect(page.locator(".project-film")).toHaveCount(0);
	await expect(page.locator(".project-screenshots a")).toHaveAttribute(
		"href",
		screenshotFixture.src,
	);
	const scan = await new AxeBuilder({ page })
		.include(".project-media")
		.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
		.analyze();
	expect(scan.violations).toEqual([]);
	const opener = page.locator(".screenshot-card");
	await opener.click();
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();
	await expect(dialog.locator(".screenshot-focus img")).toHaveAttribute(
		"src",
		screenshotFixture.src,
	);
	await expect(dialog.getByRole("navigation")).toHaveCount(0);
	await expect(dialog.getByRole("button", { name: "Next image" })).toHaveCount(
		0,
	);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/projects\/pew$/);
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(opener).toBeFocused();
});

test("focus preview preserves mixed ratios, thumbnail/keyboard navigation and modal focus", async ({
	page,
}, testInfo) => {
	const shots = [
		{ id: "landscape", width: 1200, height: 750 },
		{ id: "portrait", width: 600, height: 1200 },
		{ id: "wide", width: 1800, height: 600 },
	].map((shot) => ({
		...shot,
		src: `/test-media/gallery-${shot.id}-original.svg`,
		preview: `/test-media/gallery-${shot.id}-preview.svg`,
		thumbnail: `/test-media/gallery-${shot.id}-thumb.svg`,
		alt: { en: `${shot.id} product view`, zh: `${shot.id} 产品预览` },
	}));
	await mockMedia(page, { screenshots: shots });
	const requests: string[] = [];
	await page.route("**/test-media/gallery-*.svg", (route) => {
		const url = route.request().url();
		requests.push(url);
		const shot = shots.find((item) => url.includes(`gallery-${item.id}-`));
		if (!shot) throw new Error(`Unknown image fixture: ${url}`);
		return route.fulfill({
			contentType: "image/svg+xml",
			body: `<svg xmlns="http://www.w3.org/2000/svg" width="${shot.width}" height="${shot.height}"><rect width="100%" height="100%" fill="#f8f8f2"/><rect x="6" y="6" width="${shot.width - 12}" height="${shot.height - 12}" fill="none" stroke="#bf5c3c" stroke-width="12"/><text x="40" y="100" fill="#30372e" font-size="40">${shot.id}</text></svg>`,
		});
	});
	await page.goto("/projects/pew#media");
	const opener = page.locator(".screenshot-card").first();
	await expect(opener).toBeVisible();
	expect(requests.some((url) => url.endsWith("-original.svg"))).toBe(false);
	await opener.focus();
	await page.keyboard.press("Enter");
	const dialog = page.getByRole("dialog");
	const focusedImage = dialog.locator(".screenshot-focus img");
	const thumbs = dialog
		.getByRole("navigation", { name: "Image thumbnails" })
		.getByRole("button");
	await expect(
		dialog.getByRole("button", { name: "Close preview" }),
	).toBeFocused();
	await expect(thumbs).toHaveCount(3);
	await expect(focusedImage).toHaveAttribute("src", shots[0]?.src ?? "");
	const pageUrl = page.url();
	for (const [key, position] of [
		["ArrowRight", 1],
		["End", 2],
		["ArrowRight", 0],
		["ArrowLeft", 2],
		["Home", 0],
	] as const) {
		await page.keyboard.press(key);
		await expect(focusedImage).toHaveAttribute(
			"src",
			shots[position]?.src ?? "",
		);
		await expect(thumbs.nth(position)).toHaveAttribute("aria-current", "true");
		await expect(page).toHaveURL(pageUrl);
	}
	await thumbs.nth(1).click();
	await focusedImage.evaluate((img: HTMLImageElement) => img.decode());
	const box = await focusedImage.boundingBox();
	expect(box).not.toBeNull();
	expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(0.5, 2);
	expect(box?.height).toBeLessThan(page.viewportSize()?.height ?? 0);
	await expect(focusedImage).toHaveCSS("object-fit", "contain");
	const scan = await new AxeBuilder({ page })
		.include(".screenshot-lightbox")
		.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
		.analyze();
	expect(scan.violations).toEqual([]);
	await dialog.screenshot({ path: testInfo.outputPath("portrait-focus.png") });
	for (let i = 0; i < 10; i++) {
		await page.keyboard.press("Tab");
		expect(
			await dialog.evaluate((node) => node.contains(document.activeElement)),
		).toBe(true);
	}
	await page.keyboard.press("/");
	expect(
		await dialog.evaluate((node) => node.contains(document.activeElement)),
	).toBe(true);
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(opener).toBeFocused();
	expect(
		await page.evaluate(() => document.documentElement.style.overflow),
	).toBe("");
	await expect(page).toHaveURL(pageUrl);
});

test("an unavailable full-size image remains closable with a direct original link", async ({
	page,
}) => {
	await mockMedia(page, {
		screenshots: [
			{
				...screenshotFixture,
				src: "/test-media/unavailable.png",
				preview: screenshotFixture.src,
			},
		],
	});
	await page.route("**/test-media/unavailable.png", (route) =>
		route.fulfill({ status: 503, body: "Image unavailable" }),
	);
	await page.goto("/projects/pew#media");
	await page.locator(".screenshot-card").click();
	const dialog = page.getByRole("dialog");
	await expect(dialog.getByRole("alert")).toContainText("could not be loaded");
	await expect(
		dialog.getByRole("link", { name: "Open full-size image" }),
	).toHaveAttribute("href", "/test-media/unavailable.png");
	await dialog.getByRole("button", { name: "Close preview" }).click();
	await expect(dialog).toHaveCount(0);
});

for (const id of ["hooky", "r2shot", "diorama-journey"]) {
	test(`${id} presents the real R2-managed screenshots in both themes`, async ({
		page,
	}, testInfo) => {
		const project = readProjects().find((item) => item.id === id);
		const shots = project?.media?.screenshots ?? [];
		expect(shots).toHaveLength(id === "diorama-journey" ? 1 : 3);
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(`/projects/${id}`);
		await expect(page.locator(".project-film")).toHaveCount(
			id === "diorama-journey" ? 1 : 0,
		);
		await expect(page.locator(".project-film video")).toHaveCount(0);
		await expect(page.locator("#brand .brand-hero")).toHaveCount(1);
		for (const theme of ["light", "dark"]) {
			if (theme === "dark")
				await page
					.getByRole("button", { name: "Theme: Light. Switch to dark theme." })
					.click();
			await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
			await expect(page.locator(".screenshot-card")).toHaveCount(shots.length);
			const first = page.locator(".screenshot-card").first();
			await expect(first.locator("img")).toHaveAttribute(
				"src",
				assetUrl(shots[0]?.preview ?? ""),
			);
			await expect(first.locator("img")).toHaveAttribute(
				"crossorigin",
				"anonymous",
			);
			await first
				.locator("img")
				.evaluate((img: HTMLImageElement) => img.decode());
			await page.locator("#media").screenshot({
				path: testInfo.outputPath(`${id}-${theme}-gallery.png`),
			});
			await first.click();
			const dialog = page.getByRole("dialog");
			await dialog
				.locator(".screenshot-focus img")
				.evaluate((img: HTMLImageElement) => img.decode());
			await expect(dialog.locator(".screenshot-focus img")).toHaveAttribute(
				"src",
				assetUrl(shots[0]?.src ?? ""),
			);
			await expect(dialog.locator(".screenshot-focus img")).toHaveAttribute(
				"crossorigin",
				"anonymous",
			);
			await dialog.screenshot({
				path: testInfo.outputPath(`${id}-${theme}-focus.png`),
			});
			if (shots.length > 1) {
				await dialog.getByRole("navigation").getByRole("button").nth(2).click();
				await expect(dialog.locator(".screenshot-focus img")).toHaveAttribute(
					"src",
					assetUrl(shots[2]?.src ?? ""),
				);
			} else {
				await expect(dialog.getByRole("navigation")).toHaveCount(0);
				await expect(dialog.locator(".screenshot-step")).toHaveCount(0);
			}
			const scan = await new AxeBuilder({ page })
				.include(".screenshot-lightbox")
				.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
				.analyze();
			expect(scan.violations).toEqual([]);
			await page.keyboard.press("Escape");
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		}
		await page.getByRole("button", { name: "Switch to Chinese" }).click();
		await page.locator(".screenshot-card").first().click();
		await expect(page.getByRole("button", { name: "关闭预览" })).toBeVisible();
		await expect(page.getByRole("button", { name: "下一张" })).toHaveCount(
			shots.length > 1 ? 1 : 0,
		);
		await page.getByRole("button", { name: "关闭预览" }).click();
		expect(errors).toEqual([]);
	});
}

test("hash navigation animates, restores history and respects reduced motion", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.goto("/projects/frogie");
	await expect(page.locator("#identity-title")).toBeVisible();
	await page.evaluate(() => document.fonts.ready);
	await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
	for (const action of ["brand", "overview", "back"] as const) {
		const samples = await page.evaluate(async (next) => {
			const positions = [scrollY];
			const record = () => positions.push(scrollY);
			addEventListener("scroll", record);
			if (next === "back") history.back();
			else
				document
					.querySelector<HTMLAnchorElement>(
						`.project-section-nav a[href="#${next}"]`,
					)
					?.click();
			await new Promise<void>((resolve) => {
				let stable = 0;
				let previous = scrollY;
				let count = 0;
				const frame = () => {
					stable = scrollY === previous ? stable + 1 : 0;
					previous = scrollY;
					if ((count++ > 12 && stable > 5) || count > 150) resolve();
					else requestAnimationFrame(frame);
				};
				requestAnimationFrame(frame);
			});
			removeEventListener("scroll", record);
			return positions;
		}, action);
		expect(new Set(samples).size).toBeGreaterThan(3);
		await expect(page).toHaveURL(
			new RegExp(`#${action === "back" ? "brand" : action}$`),
		);
	}
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
	await page.locator('.project-section-nav a[href="#overview"]').click();
	await expect(page.locator("#overview")).toBeInViewport();
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://hexly.ai/projects/frogie",
	);
	await page.getByRole("link", { name: "Try a template" }).click();
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://hexly.ai/templates",
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
		"content",
		"https://hexly.ai/templates",
	);
});
