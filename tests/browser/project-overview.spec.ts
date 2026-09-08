import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";

const projects = readProjects();

for (const theme of ["light", "dark"] as const) {
	test.describe(`${theme} project overview`, () => {
		test.use({ colorScheme: theme });
		for (const id of ["snaky", "steed"]) {
			test(`${id} translates its goal, badges and README link`, async ({
				page,
				isMobile,
			}, testInfo) => {
				const project = projects.find((item) => item.id === id);
				if (!project?.overview) throw new Error(`Missing overview: ${id}`);
				const overview = project.overview;
				if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
				await page.goto(`/logos/${id}`);
				await expect(page.locator("#identity-title")).toContainText(
					project.title,
				);
				await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

				for (const locale of ["en", "zh"] as const) {
					if (locale === "zh") {
						await page
							.getByRole("button", { name: "Switch to Chinese" })
							.click();
					}
					const section = page.getByRole("region", {
						name: locale === "en" ? "Project goal" : "项目目标",
					});
					await expect(section).toBeVisible();
					await expect(section.locator(".project-goal > p")).toHaveText(
						overview.goal[locale],
					);
					const stack = section.getByRole("list", {
						name: locale === "en" ? "Tech stack" : "技术栈",
					});
					await expect(stack.getByRole("listitem")).toHaveCount(
						overview.techStack.length,
					);
					await expect(stack.locator(".tech-name")).toHaveText(
						overview.techStack.map((technology) => technology.name),
					);
					await expect(stack.locator(".tech-role")).toHaveText(
						overview.techStack.map((technology) => technology.role[locale]),
					);
					await expect(
						section.getByRole("link", {
							name: locale === "en" ? "Read README" : "阅读 README",
						}),
					).toHaveAttribute(
						"href",
						`${project.repository}/blob/main/${locale === "en" ? "docs/README.en.md" : "README.md"}`,
					);
					await section.scrollIntoViewIfNeeded();
					await page.evaluate(() => document.fonts.ready);
					expect(
						await page.evaluate(
							() => document.documentElement.scrollWidth <= innerWidth,
						),
					).toBe(true);
					const scan = await new AxeBuilder({ page })
						.include(".project-overview")
						.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
						.analyze();
					expect(scan.violations).toEqual([]);
					await testInfo.attach(`${id}-${locale}-${theme}`, {
						body: await section.screenshot({
							path: testInfo.outputPath(`${id}-${locale}-${theme}.png`),
						}),
						contentType: "image/png",
					});
				}
			});
		}
	});
}

test("removes the overview for unreviewed and archived projects without moving the artwork", async ({
	page,
}) => {
	await page.goto("/logos/snaky");
	await expect(page.locator(".project-overview")).toBeVisible();
	const artworkTop = await page
		.locator(".logo-review")
		.evaluate((element) => element.getBoundingClientRect().top + scrollY);
	await page.locator(".picker-item").filter({ hasText: "Frogie" }).click();
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await expect(page.locator(".project-overview")).toHaveCount(0);
	expect(
		await page
			.locator(".logo-review")
			.evaluate((element) => element.getBoundingClientRect().top + scrollY),
	).toBeCloseTo(artworkTop, 0);
	await page.goto("/logos/uptime-kuma-skill");
	await expect(page.locator("#identity-title")).toContainText(
		"Uptime Kuma Skill",
	);
	await expect(page.locator(".project-overview")).toHaveCount(0);
});
