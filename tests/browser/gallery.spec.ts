import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";
import { filterProjects } from "../../src/model/catalogue";

const projects = readProjects();
const ordered = filterProjects(projects, "", "all");
const firstVisible = ordered[0];
const frogieIndex = ordered.findIndex((project) => project.id === "frogie");
const afterFrogie = ordered[frogieIndex + 1];

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
		await page.goto(`/logos/${id}`);
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
		if (project.website) {
			await expect(website).toBeVisible();
			await expect(website).toHaveText("Visit website");
			await expect(website).toHaveAttribute("href", project.website);
		} else {
			await expect(website).toHaveCount(0);
		}
		await expect(page.locator(".artwork-image")).toHaveAttribute(
			"src",
			`${family.root}/icon-1024.webp`,
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
			family.status === "adopted" ? "Adopted family identity" : "Local preview",
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
					const canvas = document.createElement("canvas");
					canvas.width = 32;
					canvas.height = 32;
					const context = canvas.getContext("2d");
					if (!context) throw new Error("Canvas context unavailable");
					context.drawImage(image, 0, 0, 32, 32);
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
		await expect(page.locator(".sidebar-sample")).toContainText(
			project.description.en,
		);
		await expect(page.locator(".alpha-grid img")).toHaveCount(2);
		for (const image of await page.locator(".alpha-grid img").all())
			await expect(image).toHaveAttribute("src", family.foreground.display);
		for (const link of await page.locator(".alpha-grid a").all())
			await expect(link).toHaveAttribute("href", family.foreground.original);
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
			`${family.root}/${adapted ? "source.jpg" : retained ? "source.png" : "raw.png"}`,
		);
		if (retained) {
			await expect(
				page.getByRole("link", { name: "Untouched generation" }),
			).toHaveCount(0);
			await expect(page.locator(".identity-archive")).toContainText(
				"Original artwork retained",
			);
			expect(family.foreground.sha256).toBe(project.logo.sha256);
			expect(family.previous.sha256).toBe(project.logo.sha256);
		}
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
	if (!afterFrogie) throw new Error("Frogie has no following identity.");
	await page.goto("/logos/frogie");
	await page.getByRole("button", { name: "Next identity" }).click();
	await expect(page).toHaveURL(new RegExp(`/logos/${afterFrogie.id}$`));
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
	await expect(page.locator(".previous-artwork")).toBeVisible();
	await page.reload();
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
	await page.getByRole("button", { name: "Previous identity" }).click();
	await expect(page).toHaveURL(/\/logos\/frogie$/);
	await page.goBack();
	await expect(page.locator("#identity-title")).toContainText(
		afterFrogie.title,
	);
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

test("browses filtered identities with arrow keys, wraps, and preserves history", async ({
	page,
}) => {
	await page.goto("/logos/pew?q=pew&sort=az");
	await expect(page.locator(".picker-item")).toHaveCount(2);
	await expect(
		page.getByRole("button", { name: "Previous identity" }),
	).toHaveAttribute("aria-keyshortcuts", "ArrowLeft");
	await expect(
		page.getByRole("button", { name: "Next identity" }),
	).toHaveAttribute("aria-keyshortcuts", "ArrowRight");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/logos\/pew-game\?q=pew&sort=az$/);
	await expect(page.locator("#identity-title")).toContainText("Pew Game");
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(/\/logos\/pew\?q=pew&sort=az$/);
	await page.keyboard.press("ArrowLeft");
	await expect(page).toHaveURL(/\/logos\/pew-game\?q=pew&sort=az$/);
	await page.goBack();
	await expect(page).toHaveURL(/\/logos\/pew\?q=pew&sort=az$/);
	await page.goForward();
	await expect(page).toHaveURL(/\/logos\/pew-game\?q=pew&sort=az$/);
	await page
		.getByRole("combobox", { name: "Project categories" })
		.selectOption("games");
	await expect(page.locator(".picker-item")).toHaveCount(1);
	await expect(
		page.getByRole("button", { name: "Next identity" }),
	).toBeDisabled();
	await expect(
		page.getByRole("button", { name: "Previous identity" }),
	).toBeDisabled();
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
	await page.goto("/logos/pew?q=pew");
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

test("keeps the artwork in place when descriptions wrap or projects change", async ({
	page,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await page.goto("/logos/frogie");
	for (const locale of ["en", "zh"]) {
		if (locale === "zh")
			await page.getByRole("button", { name: "Switch to Chinese" }).click();
		// Switching locale loads the CJK font before layout can be measured.
		await page.evaluate(() => document.fonts.ready);
		await page.locator(".identity-github").focus();
		await page.evaluate(() =>
			window.scrollTo({ top: 300, behavior: "instant" }),
		);
		const start = await page.locator(".logo-review").boundingBox();
		if (!start) throw new Error("Missing artwork review");
		await page.locator(".identity-description").evaluate((element) => {
			element.textContent = `${element.textContent} `.repeat(10);
		});
		const wrapped = await page.locator(".logo-review").boundingBox();
		expect(wrapped?.y).toBeCloseTo(start.y, 0);
		for (let index = 0; index < 7; index += 1) {
			await page.keyboard.press("ArrowRight");
			const current = await page.locator(".logo-review").boundingBox();
			expect(current?.y).toBeCloseTo(start.y, 0);
			expect(await page.evaluate(() => scrollY)).toBeGreaterThan(280);
			expect(await page.evaluate(() => scrollY)).toBeLessThan(320);
		}
	}
});

test("searches the gallery, labels emoji identities, and recovers from empty or unknown selections", async ({
	page,
}) => {
	if (!firstVisible) throw new Error("The catalogue has no visible projects.");
	await page.goto("/logos/unknown-project");
	await expect(page.locator("#identity-title")).toContainText(
		firstVisible.title,
	);
	await expect(page).toHaveURL(new RegExp(`/logos/${firstVisible.id}$`));
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
