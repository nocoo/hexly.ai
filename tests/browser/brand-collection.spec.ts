import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";

const targets = readProjects().filter(
	(project) => project.brandKit?.method === "archived-artwork",
);
const representatives = new Set([
	"frogie",
	"pew",
	"r2shot",
	"basalt",
	"matrix",
	"fundly",
	"hermes-on-herdr",
	"pokepocket",
]);

for (const project of targets) {
	test(`${project.id} keeps its project navigation, original colors and usable light/dark brand archive`, async ({
		page,
		isMobile,
	}, testInfo) => {
		if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
		const kit = project.brandKit;
		if (!kit) throw new Error("Missing collection kit");
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(`/?q=${encodeURIComponent(project.title)}`);
		const link = page.locator(`[data-project="${project.id}"] .card-main`);
		await expect(link).toHaveAttribute("href", `/projects/${project.id}`);
		await link.click();
		await expect(page.locator("#identity-title")).toContainText(project.title);
		for (const theme of ["light", "dark"]) {
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
			await expect(page.locator(".brand-kit-intro")).toHaveCSS(
				"background-image",
				new RegExp(`texture-${theme}\\.svg`),
			);
			await expect(page.locator(".brand-official-source img")).toHaveAttribute(
				"src",
				project.logo.original,
			);
			await expect(page.locator(".brand-official-source img")).toHaveCSS(
				"opacity",
				"1",
			);
			await expect(page.locator(".brand-official-source img")).toHaveCSS(
				"border-radius",
				"0px",
			);
			await page.locator(".brand-kit-specimens").scrollIntoViewIfNeeded();
			for (const image of await page.locator(".brand-kit-specimens img").all())
				await image.evaluate((node: HTMLImageElement) => node.decode());
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
			if (representatives.has(project.id))
				expect(
					(await new AxeBuilder({ page }).include(".brand-kit").analyze())
						.violations,
				).toEqual([]);
			await page
				.locator(".brand-hero")
				.screenshot({ path: testInfo.outputPath(`hero-${theme}.png`) });
			await page
				.locator(".brand-kit-specimens")
				.screenshot({ path: testInfo.outputPath(`wordmarks-${theme}.png`) });
		}
		await page.getByRole("button", { name: "Switch to Chinese" }).click();
		await expect(page.locator(".brand-scope-note")).toContainText(
			"项目标志保留原色",
		);
		await expect(page.locator(".brand-texture-study h3")).toHaveText(
			kit.texture?.name.zh ?? "",
		);
		const pending = page.waitForEvent("download");
		await page.locator('.brand-kit a[href$="/favicon.ico"]').click();
		expect((await pending).suggestedFilename()).toBe("favicon.ico");
		expect(errors).toEqual([]);
	});
}

for (const project of targets.filter((p) => representatives.has(p.id))) {
	test(`${project.id} standalone specimens retain full frames, source rights, real downloads and mobile controls`, async ({
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
			expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
		}
		await expect(page.locator(".comparison")).toContainText(
			"Project identity / Original bytes",
		);
		await expect(page.locator(".comparison")).toContainText(
			"Hexly family / Campaign artwork",
		);
		if (project.id === "pokepocket")
			await expect(
				page
					.locator("#download-title")
					.locator("..")
					.locator("..")
					.locator(".."),
			).toContainText("Artist and redistribution license are not established");
	});
}
