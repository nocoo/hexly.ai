import AxeBuilder from "@axe-core/playwright";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import { brandTextureAsset, projectTexture } from "../../src/model/brand";
import { desktop, expect, test, touch } from "./fixtures";

const targets = readProjects().filter(
	(project) => project.brandKit?.method === "archived-artwork",
);

for (const [id, options] of [
	["frogie", desktop],
	["pi-agent-policy", touch],
	["diorama-journey", desktop],
	["hermes-on-herdr", touch],
] as const) {
	const project = targets.find((item) => item.id === id);
	if (!project) throw new Error(`Missing brand fixture: ${id}`);
	test.describe(`integrated ${id}`, () => {
		test.use(options);
		test(`${project.id} keeps its project navigation, original colors and usable light/dark brand archive`, async ({
			page,
			isMobile,
		}) => {
			if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
			const kit = project.brandKit;
			if (!kit) throw new Error("Missing collection kit");
			const texture = projectTexture(project);
			if (!texture) throw new Error("Missing project texture");
			const errors: string[] = [];
			page.on("pageerror", (error) => errors.push(error.message));
			await page.goto(`/?q=${encodeURIComponent(project.title)}`);
			const link = page.locator(`[data-project="${project.id}"] .card-main`);
			if (project.archived) {
				await expect(link).toHaveCount(0);
				await page.getByRole("button", { name: /^Archived/ }).click();
			}
			await expect(link).toHaveAttribute("href", `/projects/${project.id}`);
			await link.click();
			await expect(page.locator("#identity-title")).toContainText(
				project.title,
			);
			for (const theme of ["light", "dark"] as const) {
				if ((await page.locator("html").getAttribute("data-theme")) !== theme)
					await page.locator(".theme-toggle").click();
				const hero = page.locator(".brand-hero img:visible");
				await expect(hero).toHaveCount(1);
				await hero.evaluate((image: HTMLImageElement) => image.decode());
				const filename = `hero${isMobile ? "-square" : ""}${theme === "dark" ? "-dark" : ""}.webp`;
				expect(
					await hero.evaluate((image: HTMLImageElement) => image.currentSrc),
				).toContain(`${kit.root}/${filename}`);
				const box = await hero.boundingBox();
				if (!box) throw new Error("Missing visible hero");
				expect(box.width / box.height).toBeCloseTo(isMobile ? 1 : 2.5, 1);
				const surface = await page
					.locator(".brand-kit-intro")
					.evaluate(
						(node, single) =>
							getComputedStyle(node, single ? "::before" : null)
								.backgroundImage,
						texture.display === "single",
					);
				expect(surface).toContain(
					assetUrl(brandTextureAsset(texture, theme, !!project.brandTexture)),
				);
				await expect(
					page.locator(".brand-official-source img"),
				).toHaveAttribute("src", assetUrl(project.logo.original));
				await expect(page.locator(".brand-official-source img")).toHaveCSS(
					"opacity",
					"1",
				);
				await expect(page.locator(".brand-official-source img")).toHaveCSS(
					"border-radius",
					"0px",
				);
				await page.locator(".brand-kit-specimens").scrollIntoViewIfNeeded();
				for (const image of await page
					.locator(".brand-kit-specimens img")
					.all())
					await image.evaluate((node: HTMLImageElement) => node.decode());
				if (project.id === "pi-agent-policy") {
					const tiles = page.locator(".brand-texture-specimens figure > div");
					for (const tile of await tiles.all()) {
						const area = await tile.boundingBox();
						expect(area?.height).toBeGreaterThanOrEqual(256);
						expect(area?.width).toBeGreaterThanOrEqual(256);
					}
				}
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth,
					),
				).toBe(true);
				expect(
					(await new AxeBuilder({ page }).include(".brand-kit").analyze())
						.violations,
				).toEqual([]);
			}
			await page.getByRole("button", { name: "Switch to Chinese" }).click();
			await expect(page.locator(".brand-scope-note")).toContainText(
				"项目标志保留原色",
			);
			await expect(page.locator(".brand-texture-study h3")).toHaveText(
				texture.name.zh,
			);

			expect(errors).toEqual([]);
		});
	});
}

for (const [id, options] of [
	["frogie", desktop],
	["pi-agent-policy", touch],
	["pokepocket", touch],
] as const) {
	const project = targets.find((item) => item.id === id);
	if (!project) throw new Error(`Missing standalone fixture: ${id}`);
	test.describe(`standalone ${id}`, () => {
		test.use(options);
		test(`${project.id} standalone specimens retain full frames, source rights and functional presentation controls`, async ({
			page,
			isMobile,
		}) => {
			if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
			await page.goto(`${project.brandKit?.root}/review.html`);
			await expect(page.locator("h1")).toContainText(
				project.brandKit?.hero?.caption.en ?? "",
			);
			for (const theme of ["light", "dark"]) {
				if ((await page.locator("body").getAttribute("data-theme")) !== theme)
					await page.locator("#theme-switch").click();
				for (const view of ["White", "Transparent", "Icon"]) {
					const button = page.getByRole("button", { name: view, exact: true });
					await button.click();
					await expect(button).toHaveAttribute("aria-pressed", "true");
					const image =
						view === "Icon" ? `icon-${theme}-512.png` : "logo-light.png";
					const original =
						view === "Icon"
							? `icon-${theme}.png`
							: view === "White"
								? "white.png"
								: "logo.png";
					await expect(page.locator("#candidate")).toHaveAttribute(
						"src",
						`./${image}`,
					);
					await expect(page.locator("#candidate-link")).toHaveAttribute(
						"href",
						`./${original}`,
					);
					await expect(page.locator("#candidate-link")).toHaveAttribute(
						"data-view",
						view.toLowerCase(),
					);
					await page
						.locator("#candidate")
						.evaluate((node: HTMLImageElement) => node.decode());
				}
				for (const image of await page
					.locator(".hero img:visible, .edges img, .specimen img")
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
				expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
					[],
				);
			}
			if (project.family?.previous === null) {
				await expect(page.locator(".comparison figure")).toHaveCount(1);
				await expect(page.locator(".comparison")).toContainText(
					"First identity",
				);
			} else {
				await expect(page.locator(".comparison")).toContainText(
					"Project identity / Original bytes",
				);
				await expect(page.locator(".comparison")).toContainText(
					"Hexly family / Campaign artwork",
				);
			}
			if (project.id === "pokepocket")
				await expect(
					page
						.locator("#download-title")
						.locator("..")
						.locator("..")
						.locator(".."),
				).toContainText(
					"Artist and redistribution license are not established",
				);
		});
	});
}
