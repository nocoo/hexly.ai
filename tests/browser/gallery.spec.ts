import { readFile } from "node:fs/promises";
import storage from "../../src/data/media-storage.json" with { type: "json" };
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import { filterProjects } from "../../src/model/catalogue";
import { scanAccessibility } from "./accessibility";
import { expect, test, touch } from "./fixtures";

// Brand checks stay local; recorded media is exercised in project-media.spec.ts.
const projects = readProjects().map((project) => ({
	...project,
	media: undefined,
}));
const ordered = filterProjects(projects, "", "all");
const firstVisible = ordered[0];
const afterFrogie = projects.find((project) => project.id === "pew");

test("organizes Xray without losing media, downloads or integration, and isolates tab keyboard navigation", async ({
	page,
}) => {
	await page.unroute("**/data/projects.json");
	await page.goto("/projects/xray");
	await expect(
		page.getByRole("tab", { name: "Project Detail", exact: true }),
	).toHaveAttribute("aria-selected", "true");
	await expect(page.locator(".screenshot-card")).toHaveCount(5);
	await expect(page.locator(".project-overview .tech-name")).toHaveCount(7);
	await expect(page.locator("#api")).toHaveCount(0);
	await expect(page.locator(".identity-share")).toHaveCount(0);
	const overview = page.getByRole("tab", {
		name: "Project Detail",
		exact: true,
	});
	await overview.focus();
	await expect(page.locator("#overview-title")).toHaveText("Overview");
	await expect(page.locator(".brand-hero")).toBeVisible();
	expect(
		await page
			.locator(".brand-hero")
			.evaluate((hero) => hero.nextElementSibling?.id),
	).toBe("overview");
	const beforeTab = await page.evaluate(() => scrollY);
	await overview.press("ArrowRight");
	await expect(
		page.getByRole("tab", { name: "Downloads & archive" }),
	).toBeFocused();
	expect(await page.evaluate(() => scrollY)).toBe(beforeTab);
	await expect(page.locator("#panel-downloads")).toBeVisible();
	await expect(page.locator(".brand-kit-assets a[download]")).toHaveCount(8);
	await expect(page.locator(".identity-archive a[download]")).toHaveCount(8);
	await expect(
		page.getByRole("link", { name: "License & source" }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Copy presentation brief" }),
	).toBeEnabled();
	await page.reload();
	await expect(
		page.getByRole("tab", { name: "Downloads & archive" }),
	).toHaveAttribute("aria-selected", "true");
	await page.getByRole("tab", { name: "Downloads & archive" }).press("End");
	await expect(page.locator("#api .api-preview")).toBeVisible();
	await expect(page.getByRole("region", { name: "For agents" })).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Try a template" }),
	).toHaveAttribute("href", "/templates?project=xray");
	await page.goBack();
	await expect(page.locator("#panel-downloads")).toBeVisible();
	await page.getByRole("button", { name: "Switch to Chinese" }).click();
	await page.locator(".theme-toggle").click();
	await page.setViewportSize({ width: 320, height: 740 });
	for (const name of ["项目详情", "下载与档案", "集成"]) {
		const tab = page.getByRole("tab", { name, exact: true });
		await tab.click();
		await expect(tab).toHaveAttribute("aria-selected", "true");
		const bounds = await page
			.getByRole("tab")
			.evaluateAll((items) =>
				items.map((item) => item.getBoundingClientRect().toJSON()),
			);
		for (let index = 1; index < bounds.length; index++)
			expect(bounds[index].left).toBeGreaterThanOrEqual(
				bounds[index - 1].right,
			);
		expect((await scanAccessibility(page)).violations).toEqual([]);
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		).toBe(true);
	}
});

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
	await page.goto("/projects/coffee#brand");
	await expect(page.locator(".theme-palette")).toContainText("#c7d9a9");
	await expect(page.locator(".theme-palette")).toContainText("#f8f6f0");
	await expect(
		page.getByRole("button", { name: "Copy color #c68664", exact: true }),
	).toBeVisible();
	await page.goto("/projects/hermes-on-herdr#brand");
	await expect(page.locator("#identity-title")).toContainText(
		"hermes on herdr",
	);
	await expect(
		page.getByRole("button", { name: "Copy color #2c3f52", exact: true }),
	).toBeVisible();
	await expect(page.locator(".theme-palette")).toHaveCount(0);
});

test("switches identity presentations and downloads the preserved original", async ({
	page,
}) => {
	const project = projects.find((item) => item.id === "frogie");
	if (!project?.family || !project.presentationIcon)
		throw new Error("Missing Frogie identity");
	const family = project.family;
	await page.goto("/projects/frogie#brand");
	await expect(
		page.locator(".identity-heading .logo-composed img"),
	).toHaveAttribute(
		"src",
		assetUrl(`${project.presentationIcon.root}/rounded-160.webp`),
	);
	await expect(page.locator(".identity-heading .logo-composed img")).toHaveCSS(
		"filter",
		"none",
	);
	await expect(page.locator("#identity-title")).toContainText(project.title);
	await expect(page.locator(".identity-github")).toHaveAttribute(
		"href",
		project.repository,
	);
	await expect(page.locator(".previous-artwork img")).toHaveAttribute(
		"src",
		assetUrl(`${family.root}/previous-1024.webp`),
	);
	for (const [name, view] of [
		["White", "white"],
		["Transparent", "transparent"],
		["Icon", "icon"],
	] as const) {
		const button = page.getByRole("button", { name, exact: true });
		await button.click();
		await expect(button).toHaveAttribute("aria-pressed", "true");
		await expect(page.locator(".logo-review")).toHaveAttribute(
			"data-presentation",
			view,
		);
		await expect(page.locator(".artwork-image")).toHaveAttribute(
			"src",
			assetUrl(
				view === "icon"
					? `${project.presentationIcon.root}/rounded-1024.webp`
					: family.foreground.display,
			),
		);
		await page
			.locator(".artwork-image")
			.evaluate((image: HTMLImageElement) => image.decode());
		await expect(page.locator(".current-artwork .review-tile")).toHaveAttribute(
			"href",
			assetUrl(
				view === "transparent"
					? family.foreground.original
					: `${view === "icon" ? project.presentationIcon.root : family.root}/${view}.png`,
			),
		);
	}
	await page.getByRole("tab", { name: "Downloads & archive" }).click();
	await page
		.getByText("Read the exact generation prompt", { exact: true })
		.click();
	await expect(page.locator(".generation-prompt")).toHaveJSProperty(
		"textContent",
		await readFile(`public${family.root}/prompt.txt`, "utf8"),
	);
	const downloading = page.waitForEvent("download");
	await page
		.getByRole("link", { name: "Download original", exact: true })
		.click();
	const download = await downloading;
	expect(download.suggestedFilename()).toBe("frogie-transparent.png");
	expect(await download.failure()).toBeNull();
	await expect(
		page.getByRole("link", { name: "View asset source" }),
	).toHaveAttribute("href", assetUrl(project.logo.sourceUrl));
});

test("uses one top project picker and preserves browser history", async ({
	page,
}) => {
	if (!afterFrogie) throw new Error("Missing Pew fixture.");
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
	await page.locator('.project-section-nav a[href="#detail"]').click();
	await expect(page.locator("#detail")).toBeInViewport();
	await page.locator(".picker-item").filter({ hasText: /^Pew$/ }).click();
	await expect(page).toHaveURL(
		new RegExp(`/projects/${afterFrogie.id}#detail$`),
	);
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
	await expect(page.locator("#panel-brand")).toBeVisible();
	expect(new URL(page.url()).hash).toBe("#detail");
	await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
	if (!afterFrogie.overview) throw new Error("Missing Pew overview");
	await expect(page.locator(".project-overview .project-goal > p")).toHaveText(
		afterFrogie.overview.goal.en,
	);
	await expect(page.locator(".project-overview .tech-name")).toHaveText(
		afterFrogie.overview.techStack.map((item) => item.name),
	);

	await page.reload();
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
	await page.locator(".picker-item").filter({ hasText: "Frogie" }).click();
	await expect(page).toHaveURL(/\/projects\/frogie#detail$/);
	await page.goBack();
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
});

test("pins the carousel and tabs, and centers edge projects across resized views", async ({
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
	await page.locator("#detail").evaluate((element) => element.scrollIntoView());
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
				.locator("#detail")
				.evaluate((element) =>
					Math.abs(
						element.getBoundingClientRect().top -
							(document
								.querySelector(".project-section-nav")
								?.getBoundingClientRect().bottom ?? 0),
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
test("offers the official installation badge in light, dark and Chinese", async ({
	page,
}) => {
	for (const id of ["hooky"]) {
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
		"添加至 Chrome: Hooky",
	);
	await page.locator('.project-section-nav a[href="#detail"]').click();
	await expect(page).toHaveURL(/#detail$/);
	await page.getByRole("searchbox").fill("hooky");
	await expect(page).toHaveURL(/\/projects\/hooky\?q=hooky$/);
	await expect(page.locator(".gallery-selector")).toBeInViewport();
	await expect(page.locator(".identity-chrome-store")).toHaveAttribute(
		"aria-label",
		"添加至 Chrome: Hooky",
	);
});

test("copies current palette colors", async ({ page, context }) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/projects/pew#brand");
	await page
		.getByRole("button", { name: "Copy color #bfb2cf", exact: true })
		.click();
	await expect(page.locator(".toast")).toHaveText("Copied #bfb2cf");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"#bfb2cf",
	);
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
	await expect(page).toHaveURL(/\/projects\/pew-game\?q=pew&sort=az#detail$/);
	await expect(page.locator("#identity-title")).toContainText("Pew Game");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/projects\/pew\?q=pew&sort=az#detail$/);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/\/projects\/pew-game\?q=pew&sort=az#detail$/);
	await page.goBack();
	await expect(page).toHaveURL(/\/projects\/pew\?q=pew&sort=az#detail$/);
	await page.goForward();
	await expect(page).toHaveURL(/\/projects\/pew-game\?q=pew&sort=az#detail$/);
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

	await page.getByRole("tab", { name: "Integration", exact: true }).click();
	const apiUrl = page.url();
	await page.getByText("View JSON response", { exact: true }).click();
	const textarea = page.locator("#api textarea").first();
	await textarea.focus();
	await textarea.press("ArrowLeft");
	await expect(page).toHaveURL(apiUrl);
	await expect(textarea).toBeFocused();
	const editableDefault = await page.evaluate(() => {
		const element = document.createElement("div");
		element.contentEditable = "true";
		document.body.append(element);
		element.focus();
		const allowed = element.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowLeft",
				bubbles: true,
				cancelable: true,
			}),
		);
		element.remove();
		return allowed;
	});
	expect(editableDefault).toBe(true);
	await expect(page).toHaveURL(apiUrl);
	const historyLength = await page.evaluate(() => history.length);

	await page.locator(".identity-github").focus();

	for (const modifier of ["Alt", "Control", "Meta", "Shift"]) {
		await page.keyboard.press(`${modifier}+ArrowRight`);
		await expect(page).toHaveURL(apiUrl);
		expect(await page.evaluate(() => history.length)).toBe(historyLength);
	}
	for (const kind of ["composing", "handled"] as const) {
		await page.evaluate((value) => {
			const event = new KeyboardEvent("keydown", {
				key: "ArrowRight",
				isComposing: value === "composing",
				bubbles: true,
				cancelable: true,
			});
			if (value === "handled") event.preventDefault();
			document.dispatchEvent(event);
		}, kind);
		await expect(page).toHaveURL(apiUrl);
		expect(await page.evaluate(() => history.length)).toBe(historyLength);
	}

	await page
		.getByRole("navigation", { name: "Main navigation" })
		.getByRole("button", { name: "Projects", exact: true })
		.click();
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/$/);
});

test.describe("touch project switching", () => {
	test.use(touch);
	test("opens Project Detail at page top when switching from another tab", async ({
		page,
	}) => {
		await page.goto("/projects/frogie#downloads");
		await page.locator(".identity-archive").scrollIntoViewIfNeeded();
		await page.locator(".picker-item").filter({ hasText: /^Pew$/ }).click();
		await expect(page).toHaveURL(/\/projects\/pew#detail$/);
		await expect(
			page.getByRole("tab", { name: "Project Detail", exact: true }),
		).toHaveAttribute("aria-selected", "true");
		await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
		await page.emulateMedia({ reducedMotion: "no-preference" });
		await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
		await page.locator("#brand").scrollIntoViewIfNeeded();
		await page
			.locator(".picker-item[aria-pressed=true]")
			.evaluate((element) =>
				(element as HTMLElement).focus({ preventScroll: true }),
			);
		const positions = await page.evaluate(async () => {
			const samples = [scrollY];
			const record = () => samples.push(scrollY);
			addEventListener("scroll", record);
			document.querySelector(".picker-item[aria-pressed=true]")?.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "ArrowRight",
					bubbles: true,
					cancelable: true,
				}),
			);
			await new Promise<void>((resolve) => {
				let frames = 0;
				const sample = () => {
					if ((frames++ > 10 && scrollY === 0) || frames > 180) resolve();
					else requestAnimationFrame(sample);
				};
				requestAnimationFrame(sample);
			});
			removeEventListener("scroll", record);
			return samples;
		});
		await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
		expect(new Set(positions).size).toBeGreaterThan(3);
	});
});

test.describe("searches the gallery, labels emoji identities, and recovers from empty or unknown selections — touch", () => {
	test.use(touch);
	test("searches the gallery, labels emoji identities, and recovers from empty or unknown selections", async ({
		page,
	}) => {
		if (!firstVisible)
			throw new Error("The catalogue has no visible projects.");
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
		await page.getByRole("tab", { name: "Project Detail" }).click();
		await expect(page.locator(".asset-label")).toHaveText("Emoji identity");
		await page.getByRole("tab", { name: "Downloads & archive" }).click();
		await expect(page.locator(".identity-footer")).toContainText(
			"profile emoji",
		);
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
		await expect(page).toHaveURL(/\/projects\/backy#detail$/);
	});
});
