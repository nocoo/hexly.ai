import AxeBuilder from "@axe-core/playwright";
import { readProjects } from "../../src/data/read-projects";
import { expect, test } from "./fixtures";

const projects = readProjects();

test("unpublished projects keep their overview without unavailable README links", async ({
	page,
}) => {
	const frogie = projects.find((project) => project.id === "frogie");
	if (!frogie?.overview) throw new Error("Missing overview: frogie");
	const pending = {
		...frogie,
		overview: {
			...frogie.overview,
			verified: {
				...frogie.overview.verified,
				revision: null,
				snapshot: {
					path: "docs/sources/pending-project.json",
					sha256: "a".repeat(64),
				},
			},
		},
	};
	await page.route("**/data/projects.json", (route) =>
		route.fulfill({ json: [pending] }),
	);
	await page.goto("/projects/frogie");
	for (const locale of ["en", "zh"] as const) {
		if (locale === "zh")
			await page.getByRole("button", { name: "Switch to Chinese" }).click();
		await expect(
			page.locator(".project-overview .project-goal > p"),
		).toHaveText(pending.overview.goal[locale]);
		await expect(page.locator(".project-readme")).toHaveCount(0);
	}
});

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
				await page.goto(`/projects/${id}`);
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

test("switches project overviews without moving artwork and keeps archived pages compatible", async ({
	page,
}) => {
	const frogie = projects.find((project) => project.id === "frogie");
	if (!frogie?.overview) throw new Error("Missing overview: frogie");
	await page.goto("/projects/snaky#brand");
	await expect(page.locator(".project-overview")).toBeVisible();
	await expect(page.locator("#brand")).toBeInViewport();
	const artworkTop = await page
		.locator(".logo-review")
		.evaluate((element) => element.getBoundingClientRect().top);
	await page.locator(".picker-item").filter({ hasText: "Frogie" }).click();
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await expect(page.locator(".project-overview .project-goal > p")).toHaveText(
		frogie.overview.goal.en,
	);
	await expect(page.locator(".project-overview .tech-name")).toHaveText(
		frogie.overview.techStack.map((technology) => technology.name),
	);
	await expect
		.poll(() =>
			page
				.locator(".logo-review")
				.evaluate((element) => element.getBoundingClientRect().top),
		)
		.toBeCloseTo(artworkTop, 0);
	await page.goto("/projects/uptime-kuma-skill");
	await expect(page.locator("#identity-title")).toContainText(
		"Uptime Kuma Skill",
	);
	await expect(page.locator(".project-overview")).toHaveCount(0);
});
