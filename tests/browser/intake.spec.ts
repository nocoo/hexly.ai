import { readFile } from "node:fs/promises";
import { digest } from "../../scripts/asset-storage";
import reviews from "../../src/data/logo-review-pages.json" with {
	type: "json",
};
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import { expect, test } from "./fixtures";

const ids = ["hexly-ai", "base-ci", "base-cli", "base-mcp", "next-ai", "octo"];
for (const project of readProjects().filter((p) => ids.includes(p.id))) {
	test(`${project.id} preserves its adopted identity in desktop and mobile reviews`, async ({
		page,
	}) => {
		const family = project.family;
		const icon = project.presentationIcon;
		if (!family || !icon) throw new Error("Missing adopted identity");
		await page.goto(`/projects/${project.id}#brand`);
		await expect(page.locator("#identity-title")).toContainText(project.title);
		await expect(
			page.locator(".identity-heading .logo-composed img"),
		).toHaveAttribute("src", assetUrl(`${icon.root}/rounded-160.webp`));
		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1000 });
			for (const theme of ["light", "dark"]) {
				if ((await page.locator("html").getAttribute("data-theme")) !== theme)
					await page.locator(".theme-toggle").click();
				for (const name of ["Transparent", "White", "Icon"]) {
					await page.getByRole("button", { name, exact: true }).click();
					await page
						.locator(".artwork-image")
						.evaluate((image: HTMLImageElement) => image.decode());
					for (const image of await page
						.locator(
							'.size-section img[width="32"], .size-section img[width="24"], .size-section img[width="16"]',
						)
						.all())
						await expect(image).toHaveAttribute(
							"src",
							assetUrl(family.foreground.display),
						);
				}
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth,
					),
				).toBe(true);
				for (const image of await page.locator(".alpha-well img").all()) {
					await image.scrollIntoViewIfNeeded();
					await image.evaluate((element: HTMLImageElement) => element.decode());
				}
			}
		}
		await expect(page.locator(".previous-artwork")).toHaveCount(
			project.id === "hexly-ai" ? 1 : 0,
		);
		await page.getByRole("tab", { name: "Downloads & archive" }).click();
		const pending = page.waitForEvent("download");
		await page
			.getByRole("link", { name: "Download original", exact: true })
			.click();
		const download = await pending;
		const path = await download.path();
		if (!path) throw new Error("Download missing");
		expect(digest(await readFile(path))).toBe(project.logo.sha256);
	});
}

test("selected static reviews are real build documents with working modes and exact raw downloads", async ({
	page,
	request,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	for (const file of reviews) {
		const response = await request.get(`/${file}`);
		expect(response.ok()).toBe(true);
		expect(digest(await response.body())).toBe(digest(await readFile(file)));
		await page.goto(`/${file}`);
		await expect(
			page.locator('script[src="/material-downloads.js"]'),
		).toHaveCount(1);
		await page.setViewportSize({ width: 390, height: 844 });
		for (const view of ["transparent", "white", "icon"]) {
			await page.locator(`button[data-view="${view}"]`).click();
			await page
				.locator("#candidate")
				.evaluate((image: HTMLImageElement) => image.decode());
			await expect(page.locator("body")).toHaveAttribute("data-view", view);
		}
		await page.locator("#theme-switch").click();
		await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		).toBe(true);
		const swatch = page.locator("button[data-color]").first();
		const color = await swatch.getAttribute("data-color");
		await swatch.click();
		await expect(page.locator("#copy-status")).toContainText(`Copied ${color}`);
		const raw = page
			.locator('a[download][href$="/raw.jpg"], a[download][href$="/raw.png"]')
			.first();
		const href = await raw.getAttribute("href");
		if (!href?.startsWith("/logos/family/"))
			throw new Error("Missing native download");
		const pending = page.waitForEvent("download");
		await raw.click();
		const downloaded = await (await pending).path();
		if (!downloaded) throw new Error("Missing raw bytes");
		expect(digest(await readFile(downloaded))).toBe(
			digest(await readFile(`public${href}`)),
		);
	}
});

test("site share metadata and Hexly project metadata have independent endpoints", async ({
	request,
	page,
}) => {
	const site = await request.get("/api/share/site.json");
	const project = await request.get("/api/share/hexly-ai.json");
	expect(site.status()).toBe(200);
	expect(project.status()).toBe(200);
	expect((await site.json()).canonical).toBe("https://hexly.ai/");
	expect((await project.json()).canonical).toBe(
		"https://hexly.ai/projects/hexly-ai",
	);
	await page.goto("/status");
	await expect(page.locator('[data-service="octo"]')).toHaveCount(1);
	await expect(page.locator('[data-service="hexly-ai"]')).toHaveCount(1);
});
