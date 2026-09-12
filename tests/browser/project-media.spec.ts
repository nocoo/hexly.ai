import { createHash } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";
import type { Project } from "../../src/model/project";
import { screenshotFixture, videoFixture } from "../fixtures/project-media";

const projects = readProjects();
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
	await page.route("https://media.hexly.ai/test/**", (route) => {
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
	await page.goto("/projects/frogie");
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await expect(page.locator(".project-media")).toHaveCount(0);
	await expect(
		page.locator('.project-section-nav a[href="#media"]'),
	).toHaveCount(0);
	await expect(page.locator("#overview")).toBeVisible();
	await expect(page.locator("#brand")).toBeVisible();
	await page.goto("/");
	await expect(page.locator(".project-card").first()).toBeVisible();
	await expect(page.locator(".card-video")).toHaveCount(0);
	await expect(page.getByRole("checkbox", { name: "With video" })).toHaveCount(
		0,
	);
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
});

test("filters recorded projects, selects multiple videos and restores hash history", async ({
	page,
}, testInfo) => {
	const second = {
		...videoFixture,
		id: "walkthrough",
		title: { en: "Walkthrough sample", zh: "操作示例" },
		src: "https://media.hexly.ai/test/walkthrough.webm",
	};
	const requests = await mockMedia(page, {
		videos: [videoFixture, second],
		screenshots: [screenshotFixture],
	});
	await page.goto("/");
	await page.getByRole("checkbox", { name: "With video" }).check();
	await expect(page.locator(".project-card")).toHaveCount(1);
	await expect(page).toHaveURL(/\?media=video$/);
	await page.locator(".card-video").click();
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
});

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
