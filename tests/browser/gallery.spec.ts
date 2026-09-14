import { readFile } from "node:fs/promises";
import storage from "../../src/data/media-storage.json" with { type: "json" };
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import {
	filterProjects,
	isChromeWebStoreProject,
} from "../../src/model/catalogue";
import { expect, test } from "./fixtures";

// Brand checks stay local; recorded media is exercised in project-media.spec.ts.
const projects = readProjects().map((project) => ({
	...project,
	media: undefined,
}));
const ordered = filterProjects(projects, "", "all");
const firstVisible = ordered[0];
const frogieIndex = ordered.findIndex((project) => project.id === "frogie");
const afterFrogie = ordered[frogieIndex + 1];

test.beforeEach(async ({ page }) => {
	// The initial crawler snapshot can request its poster before React mounts.
	await page.route(
		`${storage.origin}/projects/hermes-on-herdr/videos/**`,
		(route) =>
			route.fulfill({
				contentType: "image/svg+xml",
				headers: { "Access-Control-Allow-Origin": "*" },
				body: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"/>',
			}),
	);
	await page.route("**/data/projects.json", (route) =>
		route.fulfill({ json: projects }),
	);
});

test("shows evidenced website colors separately from a tool's artwork palette", async ({
	page,
}) => {
	await page.goto("/projects/coffee");
	await expect(page.locator(".theme-palette")).toContainText("#c7d9a9");
	await expect(page.locator(".theme-palette")).toContainText("#f8f6f0");
	await expect(
		page.getByRole("button", { name: "Copy color #c68664", exact: true }),
	).toBeVisible();
	await page.goto("/projects/hermes-on-herdr");
	await expect(page.locator("#identity-title")).toContainText(
		"hermes on herdr",
	);
	await expect(
		page.getByRole("button", { name: "Copy color #2c3f52", exact: true }),
	).toBeVisible();
	await expect(page.locator(".theme-palette")).toHaveCount(0);
});

for (const id of projects
	.filter((project) => project.family)
	.map((project) => project.id)) {
	test(`compares refined ${id} with its original at artwork and application sizes`, async ({
		page,
	}) => {
		const project = projects.find((item) => item.id === id);
		if (!project?.family) throw new Error(`Missing refinement: ${id}`);
		const family = project.family;
		const retained = family.method === "retained-original";
		const adapted = family.method === "reference-adaptation";
		const supplied = retained || adapted;
		await page.goto(`/projects/${id}`);
		await expect(page.locator("#identity-title")).toContainText(project.title, {
			timeout: 15_000,
		});
		const repository = page
			.locator(".identity-heading")
			.getByRole("link", { name: `View on GitHub: ${project.title}` });
		await expect(repository).toBeVisible();
		await expect(repository).toHaveText("GitHub");
		await expect(repository).toHaveAttribute("href", project.repository);
		const website = page.locator(".identity-website");
		if (isChromeWebStoreProject(project)) {
			await expect(website).toHaveCount(0);
			await expect(
				page.getByRole("link", { name: `Add to Chrome: ${project.title}` }),
			).toHaveAttribute("href", project.website ?? "");
		} else if (project.website) {
			await expect(website).toBeVisible();
			await expect(website).toHaveText("Visit website");
			await expect(website).toHaveAttribute("href", project.website);
		} else {
			await expect(website).toHaveCount(0);
		}
		await expect(page.locator(".artwork-image")).toHaveAttribute(
			"src",
			assetUrl(`${family.root}/icon-1024.webp`),
		);
		await expect(async () => {
			await page.locator(".artwork-image").evaluate(async (node) => {
				const image = node as HTMLImageElement;
				if (!image.naturalWidth) throw new Error("Artwork image is not ready.");
				await image.decode();
			});
		}).toPass();
		await expect(page.locator(".asset-label")).toHaveText("Refined");
		await expect(page.locator(".current-artwork figcaption")).toContainText(
			family.status === "adopted"
				? "Adopted family identity"
				: project.brandKit?.method === "gpt-image-2"
					? "Source adoption pending"
					: "Local preview",
		);
		for (const [selector, size] of [
			[".size-grid figure:nth-child(1) .logo-tile", 128],
			[".size-grid figure:nth-child(2) .logo-tile", 64],
			[".size-grid figure:nth-child(3) .logo-plain", 32],
			[".size-grid figure:nth-child(4) .logo-plain", 16],
			[".preview-workspace .logo-plain", 24],
			[".browser-tab .logo-plain", 16],
		] as const) {
			await expect(page.locator(selector)).toHaveCSS("width", `${size}px`);
			await expect(page.locator(selector)).toHaveCSS("height", `${size}px`);
		}
		for (const mark of await page.locator(".size-section .logo-plain").all()) {
			await expect(mark).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
			await expect(mark).toHaveCSS("border-radius", "0px");
			await expect(mark).toHaveCSS("box-shadow", "none");
			await expect(mark.locator("img")).toHaveCSS("border-radius", "0px");
			let transparentPixels = 0;
			await expect(async () => {
				transparentPixels = await mark.locator("img").evaluate(async (node) => {
					const image = node as HTMLImageElement;
					if (!image.naturalWidth) throw new Error("Mark image is not ready.");
					await image.decode();
					// Read the same displayed CDN bytes with CORS before inspecting pixels.
					const readable = new Image();
					readable.crossOrigin = "anonymous";
					readable.src = image.currentSrc;
					await readable.decode();
					const canvas = document.createElement("canvas");
					canvas.width = 32;
					canvas.height = 32;
					const context = canvas.getContext("2d");
					if (!context) throw new Error("Canvas context unavailable");
					context.drawImage(readable, 0, 0, 32, 32);
					const pixels = context.getImageData(0, 0, 32, 32).data;
					let count = 0;
					for (let offset = 3; offset < pixels.length; offset += 4) {
						if (pixels[offset] === 0) count += 1;
					}
					return count;
				});
			}).toPass();
			expect(transparentPixels).toBeGreaterThan(128);
		}
		if (family.previous) {
			await expect(page.locator(".previous-artwork img")).toHaveAttribute(
				"src",
				assetUrl(`${family.root}/previous-1024.webp`),
			);
		} else {
			await expect(page.locator(".previous-artwork")).toHaveCount(0);
			await expect(page.locator(".current-artwork figcaption")).toContainText(
				"First identity",
			);
		}
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
				assetUrl(
					value === "icon"
						? `${family.root}/icon-1024.webp`
						: family.foreground.display,
				),
			);
			await expect(
				page.locator(".current-artwork .review-tile"),
			).toHaveAttribute(
				"href",
				assetUrl(
					value === "transparent"
						? family.foreground.original
						: `${family.root}/${value}.png`,
				),
			);
		}
		await expect(page.locator(".sidebar-sample")).toContainText(
			project.description.en,
		);
		await expect(page.locator(".alpha-grid img")).toHaveCount(2);
		for (const image of await page.locator(".alpha-grid img").all())
			await expect(image).toHaveAttribute(
				"src",
				assetUrl(family.foreground.display),
			);
		for (const link of await page.locator(".alpha-grid a").all())
			await expect(link).toHaveAttribute(
				"href",
				assetUrl(family.foreground.original),
			);
		await page
			.getByText(
				supplied
					? "Read the presentation brief"
					: "Read the exact generation prompt",
				{ exact: true },
			)
			.click();
		const prompt = await readFile(
			new URL(
				`../../public${family.root}/${supplied ? "brief" : "prompt"}.txt`,
				import.meta.url,
			),
			"utf8",
		);
		await expect(page.locator(".generation-prompt")).toHaveText(prompt);
		await expect(page.locator(".reference-grid")).toHaveCount(0);
		await expect(
			page.getByText("View the presentation references", { exact: true }),
		).toHaveCount(0);
		await expect(
			page.getByRole("link", {
				name: adapted
					? "Original illustration"
					: retained
						? "Untouched original"
						: "Untouched generation",
			}),
		).toHaveAttribute(
			"href",
			assetUrl(
				`${family.root}/${adapted ? "source.jpg" : retained ? "source.png" : "raw.png"}`,
			),
		);
		if (retained) {
			await expect(
				page.getByRole("link", { name: "Untouched generation" }),
			).toHaveCount(0);
			await expect(page.locator(".identity-archive")).toContainText(
				"Original artwork retained",
			);
			expect(family.foreground.sha256).toBe(project.logo.sha256);
			expect(family.previous?.sha256).toBe(project.logo.sha256);
		}
		const downloadEvent = page.waitForEvent("download");
		await page
			.getByRole("link", { name: "Download original", exact: true })
			.click();
		const download = await downloadEvent;
		expect(download.suggestedFilename()).toBe(`${id}-transparent.png`);
		expect(await download.failure()).toBeNull();
		await expect(
			page.getByRole("link", { name: "View asset source" }),
		).toHaveAttribute("href", assetUrl(project.logo.sourceUrl));
	});
}

test("uses one top project picker and preserves browser history", async ({
	page,
}) => {
	if (!afterFrogie) throw new Error("Frogie has no following identity.");
	await page.goto("/projects/frogie");
	await expect(
		page.locator(".identity-pagination, .detail-breadcrumb"),
	).toHaveCount(0);
	await expect(page.locator("#brand .gallery-selector")).toHaveCount(0);
	expect(
		await page
			.locator(".picker-heading")
			.evaluate(
				(element) =>
					element === document.querySelector("main")?.firstElementChild,
			),
	).toBe(true);
	await expect(
		page.locator(".picker-heading").getByRole("searchbox"),
	).toBeInViewport();
	await page
		.locator(".picker-item")
		.filter({ hasText: afterFrogie.title })
		.click();
	await expect(page).toHaveURL(new RegExp(`/projects/${afterFrogie.id}$`));
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
	await expect(page.locator(".previous-artwork")).toBeVisible();
	await page.reload();
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
	await page.locator(".picker-item").filter({ hasText: "Frogie" }).click();
	await expect(page).toHaveURL(/\/projects\/frogie$/);
	await page.goBack();
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
});

test("pins only the carousel and centers the selected project, including both ends and resized views", async ({
	page,
}) => {
	const middle = ordered[Math.floor(ordered.length / 2)];
	const last = ordered.at(-1);
	if (!firstVisible || !middle || !last)
		throw new Error("The picker needs its catalogue.");
	const centerError = () =>
		page.locator('.picker-item[aria-pressed="true"]').evaluate((element) => {
			const item = element.getBoundingClientRect();
			const carousel = element.parentElement?.getBoundingClientRect();
			return carousel
				? Math.abs(
						item.left + item.width / 2 - carousel.left - carousel.width / 2,
					)
				: Infinity;
		});
	await page.goto(`/projects/${middle.id}`);
	await page.evaluate(() => document.fonts.ready);
	await expect.poll(centerError).toBeLessThanOrEqual(1);
	await page.locator('.project-section-nav a[href="#brand"]').click();
	await expect
		.poll(() =>
			page.locator(".gallery-selector").evaluate((element) => {
				const header = document
					.querySelector(".site-header")
					?.getBoundingClientRect();
				return header
					? Math.abs(element.getBoundingClientRect().top - header.bottom)
					: Infinity;
			}),
		)
		.toBeLessThanOrEqual(1);
	await expect(page.locator(".picker-heading")).not.toBeInViewport();
	await expect
		.poll(() =>
			page
				.locator("#brand")
				.evaluate((element) =>
					Math.abs(
						element.getBoundingClientRect().top -
							(document
								.querySelector(".gallery-selector")
								?.getBoundingClientRect().bottom ?? 0) -
							20,
					),
				),
		)
		.toBeLessThanOrEqual(1);
	for (const project of [firstVisible, last, middle]) {
		await page
			.locator(".picker-item")
			.nth(ordered.findIndex((item) => item.id === project.id))
			.click();
		await expect(page.locator("#identity-title")).toContainText(project.title);
		await expect.poll(centerError).toBeLessThanOrEqual(1);
	}
	await page.setViewportSize({ width: 320, height: 740 });
	await expect.poll(centerError).toBeLessThanOrEqual(1);
	await page.getByRole("searchbox").fill("pew");
	await expect(page.locator(".picker-item")).toHaveCount(2);
	await expect.poll(centerError).toBeLessThanOrEqual(1);
});

test("offers the official installation badge for both Chrome extensions in light, dark and Chinese", async ({
	page,
}) => {
	for (const id of ["hooky", "r2shot"]) {
		const project = projects.find((item) => item.id === id);
		if (!project?.website) throw new Error(`Missing store URL: ${id}`);
		await page.goto(`/projects/${id}`);
		const badge = page.locator(".identity-chrome-store");
		await expect(badge).toHaveAttribute(
			"aria-label",
			`Add to Chrome: ${project.title}`,
		);
		await expect(badge).toHaveAttribute("href", project.website);
		await expect(badge).toHaveAttribute("target", "_blank");
		await expect(page.locator(".identity-website")).toHaveCount(0);
		await expect(page.locator(".identity-github")).toHaveAttribute(
			"href",
			project.repository,
		);
		for (const theme of ["light", "dark"]) {
			await page.evaluate(
				(value) => (document.documentElement.dataset.theme = value),
				theme,
			);
			await badge.locator("img").evaluate(async (node) => {
				const image = node as HTMLImageElement;
				await image.decode();
				if (image.naturalWidth !== 340 || image.naturalHeight !== 96)
					throw new Error("Official badge did not decode intact.");
			});
			await expect(badge.locator("img")).toHaveCSS("width", "170px");
			await expect(badge.locator("img")).toHaveCSS("height", "48px");
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		}
	}
	await page.getByRole("button", { name: "Switch to Chinese" }).click();
	await expect(page.locator(".identity-chrome-store")).toHaveAttribute(
		"aria-label",
		"添加至 Chrome: R2Shot",
	);
	await page.locator('.project-section-nav a[href="#brand"]').click();
	await expect(page).toHaveURL(/#brand$/);
	await page.getByRole("searchbox").fill("hooky");
	await expect(page).toHaveURL(/\/projects\/hooky\?q=hooky$/);
	await expect(page.locator(".gallery-selector")).toBeInViewport();
	await expect(page.locator(".identity-chrome-store")).toHaveAttribute(
		"aria-label",
		"添加至 Chrome: Hooky",
	);
});

test("copies current palette colors and a reusable gallery link", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/projects/pew");
	await page
		.getByRole("button", { name: "Copy color #bfb2cf", exact: true })
		.click();
	await expect(page.locator(".toast")).toHaveText("Copied #bfb2cf");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"#bfb2cf",
	);
	await page.getByRole("button", { name: "Copy project link" }).click();
	const link = await page.evaluate(() => navigator.clipboard.readText());
	expect(new URL(link).pathname).toBe("/projects/pew");
	expect(new URL(link).search).toBe("");
	await page.goto(link);
	await expect(page.locator("#identity-title")).toContainText("Pew");
});

test("browses filtered identities with arrow keys, wraps, and preserves history", async ({
	page,
}) => {
	await page.goto("/projects/pew?q=pew&sort=az");
	await expect(page.locator(".picker-item")).toHaveCount(2);
	await expect(
		page.locator('.picker-item[aria-pressed="true"]'),
	).toHaveAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight");
	await expect(page.locator(".identity-pagination")).toHaveCount(0);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/projects\/pew-game\?q=pew&sort=az$/);
	await expect(page.locator("#identity-title")).toContainText("Pew Game");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/projects\/pew\?q=pew&sort=az$/);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/\/projects\/pew-game\?q=pew&sort=az$/);
	await page.goBack();
	await expect(page).toHaveURL(/\/projects\/pew\?q=pew&sort=az$/);
	await page.goForward();
	await expect(page).toHaveURL(/\/projects\/pew-game\?q=pew&sort=az$/);
	await page
		.getByRole("combobox", { name: "Project categories" })
		.selectOption("games");
	await expect(page.locator(".picker-item")).toHaveCount(1);
	await expect(
		page.locator('.picker-item[aria-pressed="true"]'),
	).not.toHaveAttribute("aria-keyshortcuts");
	await page.locator(".identity-github").focus();
	const singleUrl = page.url();
	const historyLength = await page.evaluate(() => history.length);
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(singleUrl);
	expect(await page.evaluate(() => history.length)).toBe(historyLength);
	await page.getByRole("searchbox").fill("there-is-no-such-project");
	await page.getByRole("button", { name: "Reset filters" }).focus();
	const emptyUrl = page.url();
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(emptyUrl);
});

test("keeps arrow keys in editable controls and ignores modified or handled keys", async ({
	page,
}) => {
	await page.goto("/projects/pew?q=pew");
	const url = page.url();
	const search = page.getByRole("searchbox", { name: "Search projects" });
	await search.focus();
	await search.press("End");
	await search.press("ArrowLeft");
	await expect(page).toHaveURL(url);
	await expect(search).toBeFocused();
	const category = page.getByRole("combobox", { name: "Project categories" });
	await category.focus();
	const prevented = await category.evaluate(
		(element) =>
			!element.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "ArrowRight",
					bubbles: true,
					cancelable: true,
				}),
			),
	);
	expect(prevented).toBe(false);
	await expect(page).toHaveURL(url);
	const editableDefaults = await page.evaluate(() => {
		const results: boolean[] = [];
		for (const tag of ["textarea", "div"]) {
			const element = document.createElement(tag);
			if (tag === "div") element.contentEditable = "true";
			document.body.append(element);
			element.focus();
			results.push(
				element.dispatchEvent(
					new KeyboardEvent("keydown", {
						key: "ArrowLeft",
						bubbles: true,
						cancelable: true,
					}),
				),
			);
			element.remove();
		}
		return results;
	});
	expect(editableDefaults).toEqual([true, true]);
	await expect(page).toHaveURL(url);
	await page.locator(".identity-github").focus();
	for (const modifier of ["Alt", "Control", "Meta", "Shift"])
		await page.keyboard.press(`${modifier}+ArrowRight`);
	await expect(page).toHaveURL(url);
	await page.evaluate(() => {
		document.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowRight",
				isComposing: true,
				bubbles: true,
				cancelable: true,
			}),
		);
		const handled = new KeyboardEvent("keydown", {
			key: "ArrowRight",
			bubbles: true,
			cancelable: true,
		});
		handled.preventDefault();
		document.dispatchEvent(handled);
	});
	await expect(page).toHaveURL(url);
	await page
		.getByRole("navigation", { name: "Main navigation" })
		.getByRole("button", { name: "Projects", exact: true })
		.click();
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/$/);
});

test("keeps the brand section aligned while switching projects and languages", async ({
	page,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await page.goto("/projects/frogie#brand");
	for (const locale of ["en", "zh"]) {
		if (locale === "zh")
			await page.getByRole("button", { name: "Switch to Chinese" }).click();
		await page.evaluate(() => document.fonts.ready);
		await page
			.locator("#brand")
			.evaluate((element) => element.scrollIntoView());
		await page
			.locator('.picker-item[aria-pressed="true"]')
			.evaluate((element) =>
				(element as HTMLElement).focus({ preventScroll: true }),
			);
		const start = await page
			.locator("#brand")
			.evaluate((element) => element.getBoundingClientRect().top);
		expect(start).toBeGreaterThan(0);
		for (let index = 0; index < 7; index += 1) {
			await page.keyboard.press("ArrowRight");
			await expect(page).toHaveURL(/#brand$/);
			// Native scrolling rounds positions; section edges retain fractional pixels.
			await expect
				.poll(() =>
					page
						.locator("#brand")
						.evaluate(
							(element, top) =>
								Math.abs(element.getBoundingClientRect().top - top),
							start,
						),
				)
				.toBeLessThanOrEqual(1);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		}
	}
});

test("searches the gallery, labels emoji identities, and recovers from empty or unknown selections", async ({
	page,
}) => {
	if (!firstVisible) throw new Error("The catalogue has no visible projects.");
	await page.goto("/projects/unknown-project");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Project not found.",
	);
	await expect(page).toHaveURL(/\/projects\/unknown-project$/);
	await page.getByRole("button", { name: "Reset filters" }).click();
	await expect(page.locator(".project-card")).toHaveCount(ordered.length);
	await page.goto(`/projects/${firstVisible.id}#brand`);
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
	).toHaveAttribute("href", assetUrl("/logos/emoji/uptime-kuma-skill.png"));
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
	await expect(page).toHaveURL(/\/projects\/backy$/);
});
