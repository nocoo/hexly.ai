import AxeBuilder from "@axe-core/playwright";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import { brandTextureAsset, projectTexture } from "../../src/model/brand";
import { expect, test } from "./fixtures";

const representatives = new Set([
	"frogie",
	"dove",
	"hooky",
	"matrix",
	"ccbackup",
	"hermes-on-herdr",
	"pi-agent-policy",
]);
for (const project of readProjects().filter((p) => representatives.has(p.id))) {
	test(`${project.id} shows full-canvas theme textures on cards and narrow project archives`, async ({
		page,
		isMobile,
	}, testInfo) => {
		if (isMobile) await page.setViewportSize({ width: 320, height: 800 });
		const texture = projectTexture(project);
		if (!texture) throw new Error(`Missing texture ${project.id}`);
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(
			`/?q=${project.id}${project.archived ? "&category=archive" : ""}`,
		);
		const card = page.locator(`[data-project="${project.id}"] .card-main`);
		await expect(card).toBeVisible();
		// The old repeated background must be cleared, or it bypasses the measured opacity.
		await expect(card).toHaveCSS("background-image", "none");
		await card.click();
		for (const theme of ["light", "dark"] as const) {
			if ((await page.locator("html").getAttribute("data-theme")) !== theme)
				await page.locator(".theme-toggle").click();
			const study = page.locator("#texture");
			await expect(study.locator("h3")).toHaveText(texture.name.en);
			const tiles = study.locator(".brand-texture-specimens figure > div");
			for (const [index, tile] of (await tiles.all()).entries()) {
				const box = await tile.boundingBox();
				expect(box?.width).toBeGreaterThanOrEqual(256);
				expect(box?.width).toBeCloseTo(box?.height ?? 0, 0);
				await expect(tile).toHaveCSS("background-repeat", "no-repeat");
				await expect(tile).toHaveCSS("background-size", "contain");
				const image = brandTextureAsset(
					texture,
					index === 0 ? "light" : "dark",
				);
				await expect(tile).toHaveCSS(
					"background-image",
					`url("${assetUrl(image)}")`,
				);
				await tile.evaluate(async (node) => {
					const image = new Image();
					image.src = getComputedStyle(node).backgroundImage.slice(5, -2);
					await image.decode();
				});
			}
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
			expect(
				(await new AxeBuilder({ page }).include("#texture").analyze())
					.violations,
			).toEqual([]);
			await study.screenshot({
				path: testInfo.outputPath(`${project.id}-${theme}.png`),
				// Capture the complete section below sticky navigation, including tall mobile specimens.
				style:
					".site-header, .gallery-selector { visibility: hidden; } html { scroll-padding-top: 0; } #texture { scroll-margin: 0; }",
			});
		}
		const downloaded = page.waitForEvent("download");
		await page.locator("#texture a[download]").first().click();
		expect((await downloaded).suggestedFilename()).toBe("texture-light.png");
		expect(errors).toEqual([]);
	});
}

test("independent texture review keeps download enhancement and contrasting captions with a dark OS", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/textures/frogie/v1.0.0/review.html");
	await expect(page.locator("h1")).toHaveText("Lily margins");
	await expect(page.locator("figure.light")).toHaveCSS(
		"color",
		"rgb(48, 55, 46)",
	);
	await expect(page.locator("figure.dark")).toHaveCSS(
		"color",
		"rgb(230, 233, 220)",
	);
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
	const pending = page.waitForEvent("download");
	await page.getByRole("link", { name: "Original PNG" }).first().click();
	expect((await pending).suggestedFilename()).toBe("texture-light.png");
});
