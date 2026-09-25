import AxeBuilder from "@axe-core/playwright";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import { brandTextureAsset, projectTexture } from "../../src/model/brand";
import { desktop, expect, test, touch } from "./fixtures";

for (const [id, options, opacity] of [
	["frogie", desktop, 0.38],
	["pi-agent-policy", touch, 0.45],
	["ccbackup", touch, 0.42],
] as const) {
	const project = readProjects().find((item) => item.id === id);
	if (!project) throw new Error(`Missing texture fixture: ${id}`);
	test.describe(id, () => {
		test.use(options);
		test(`${project.id} shows full-canvas theme textures on cards and narrow project archives`, async ({
			page,
			isMobile,
		}) => {
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
			for (const theme of ["light", "dark"] as const) {
				if ((await page.locator("html").getAttribute("data-theme")) !== theme)
					await page.locator(".theme-toggle").click();
				const pseudo = await card.evaluate((node) => {
					const style = getComputedStyle(node, "::before");
					return {
						image: style.backgroundImage,
						size: style.backgroundSize,
						repeat: style.backgroundRepeat,
						opacity: Number(style.opacity),
						mask: style.maskImage,
					};
				});
				const root =
					id === "pi-agent-policy"
						? "/brands/pi-agent-policy/v1.0.3"
						: `/textures/${id}/v1.0.0`;
				const filename =
					id === "pi-agent-policy"
						? `texture-${theme}.webp`
						: `texture-${theme}-320.webp`;
				expect(pseudo.image).toContain(assetUrl(`${root}/${filename}`));
				expect(pseudo.size).toBe("contain");
				expect(pseudo.repeat).toBe("no-repeat");
				expect(pseudo.opacity).toBe(opacity);
				expect(pseudo.mask).toContain("linear-gradient");
			}

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
			}
			const downloaded = page.waitForEvent("download");
			await page.locator("#texture a[download]").first().click();
			expect((await downloaded).suggestedFilename()).toBe("texture-light.png");
			expect(errors).toEqual([]);
		});
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
