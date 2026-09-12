import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";

const snail = readProjects().find((project) => project.id === "snail");
if (!snail?.brandKit || !snail.family)
	throw new Error("Missing Snail animal kit");
const kit = snail.brandKit;
const foreground = snail.family.foreground;

test("browses Snail's bilingual brand archive, theme variants and real downloads", async ({
	page,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await page.goto("/?q=snail");
	await expect(
		page.locator('[data-project="snail"] .card-main'),
	).toHaveAttribute("href", "/projects/snail");
	for (const theme of ["light", "dark"]) {
		if ((await page.locator("html").getAttribute("data-theme")) !== theme)
			await page.locator(".theme-toggle").click();
		await expect(page.locator('[data-project="snail"] .card-main')).toHaveCSS(
			"background-image",
			new RegExp(`texture-${theme}\\.svg`),
		);
		await expect(
			page.locator('[data-project="snail"] .project-description'),
		).toHaveCSS(
			"color",
			theme === "light" ? "rgb(48, 55, 46)" : "rgb(230, 233, 220)",
		);
	}
	await page.locator('[data-project="snail"] .card-main').click();
	await expect(page.locator("#identity-title")).toContainText("Snail");
	await expect(page.locator(".project-readme")).toHaveCount(0);
	await expect(page.locator(".brand-hero img")).toHaveAttribute(
		"src",
		`${kit.root}/hero.webp`,
	);
	await expect
		.poll(() =>
			page
				.locator(".brand-hero img")
				.evaluate((image: HTMLImageElement) => image.currentSrc),
		)
		.toContain(isMobile ? "hero-square.webp" : "/hero.webp");
	const hero = await page.locator(".brand-hero img").boundingBox();
	if (!hero) throw new Error("Missing hero frame");
	expect(hero.width / hero.height).toBeCloseTo(isMobile ? 1 : 2.5, 1);
	for (const locale of ["en", "zh"] as const) {
		if (locale === "zh")
			await page.getByRole("button", { name: "Switch to Chinese" }).click();
		for (const theme of ["light", "dark"] as const) {
			if ((await page.locator("html").getAttribute("data-theme")) !== theme)
				await page.locator(".theme-toggle").click();
			await expect(
				page.locator(".identity-heading .logo-plain img"),
			).toHaveAttribute("src", foreground.display);
			await expect(page.locator(".brand-kit-intro")).toHaveCSS(
				"background-image",
				new RegExp(`texture-${theme}\\.svg`),
			);
			await expect(page.locator(".brand-kit")).toContainText(
				locale === "en" ? "One point of focus" : "只留一个焦点",
			);
			await page.locator(".brand-kit-specimens").scrollIntoViewIfNeeded();
			for (const image of await page.locator(".brand-kit-specimens img").all())
				await image.evaluate((node: HTMLImageElement) => node.decode());
			await expect(page.locator(`.brand-kit-${theme} img`)).toHaveAttribute(
				"src",
				`${kit.root}/lockup-${theme}.png`,
			);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		}
	}
	await expect(
		page.locator(`.brand-kit a[href="/brands/snail/v1.0.0/review.html"]`),
	).toHaveCount(1);
	const pendingDownload = page.waitForEvent("download");
	await page.locator('.brand-kit a[href$="/favicon.ico"]').click();
	expect((await pendingDownload).suggestedFilename()).toBe("favicon.ico");
	const results = await new AxeBuilder({ page })
		.include(".brand-kit")
		.analyze();
	expect(results.violations).toEqual([]);
});

test("the standalone Snail study keeps full compositions, transparent small marks and traceable downloads", async ({
	page,
	context,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto(`${kit.root}/review.html`);
	for (const name of ["Transparent", "White", "Icon"] as const) {
		const button = page.getByRole("button", { name, exact: true });
		await button.click();
		await expect(button).toHaveAttribute("aria-pressed", "true");
	}
	for (const theme of ["light", "dark"]) {
		if ((await page.locator("body").getAttribute("data-theme")) !== theme)
			await page.locator("#theme-switch").click();
		for (const image of await page
			.locator(".hero img, .edges img, .specimen img")
			.all())
			await image.evaluate((node: HTMLImageElement) => node.decode());
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		).toBe(true);
		await expect(page.locator(".app-name img")).toHaveCSS("width", "24px");
		await expect(page.locator(".tab img")).toHaveCSS("width", "16px");
		await expect(page.locator(".app-name img")).toHaveCSS(
			"border-radius",
			"0px",
		);
		const accessibility = await new AxeBuilder({ page }).analyze();
		expect(accessibility.violations).toEqual([]);
	}
	await page.getByRole("button", { name: /Terracotta #bf5c3c/ }).click();
	await expect(page.locator("#copy-status")).toHaveText("Copied #bf5c3c");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"#bf5c3c",
	);
	await page
		.getByText("Read the exact icon generation prompt", { exact: true })
		.click();
	await expect(
		page.locator('pre[data-source="./prompt-icon.txt"]'),
	).toContainText("snail");
	await page
		.getByText("View the family references and candidate record", {
			exact: true,
		})
		.click();
	for (const image of await page.locator(".references img").all())
		await image.evaluate((node: HTMLImageElement) => node.decode());
	const download = page.waitForEvent("download");
	await page.getByRole("link", { name: "Favicon ICO ↗", exact: true }).click();
	expect((await download).suggestedFilename()).toBe("favicon.ico");
	expect(errors).toEqual([]);
});
