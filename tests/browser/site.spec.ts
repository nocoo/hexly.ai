import { expect, test } from "@playwright/test";
import manifest from "../../package.json" with { type: "json" };
import projects from "../../src/data/projects.json" with { type: "json" };

const active = projects.filter((project) => !project.archived);
const archived = projects.filter((project) => project.archived);

test("renders active projects with local logos, redraw badges, and working destinations", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});
	await page.goto("/");
	await expect(page).toHaveTitle(/hexly.ai/);
	await expect(page.locator(".version-pill")).toHaveText(
		`v${manifest.version}`,
	);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Small ideas.A little universe.",
	);
	await expect(page.locator(".project-card")).toHaveCount(active.length);
	await expect(page.locator(".refined-badge")).toHaveCount(2);
	for (const id of ["frogie", "pew"]) {
		await expect(
			page.locator(`[data-project="${id}"] .refined-badge`),
		).toHaveText("Refined");
		await expect(
			page.locator(`[data-project="${id}"] .logo-family img`),
		).toHaveAttribute("src", /\/03\/icon-/);
	}
	await page.locator(".project-card img").evaluateAll(async (images) => {
		await Promise.all(
			images.map(async (node) => {
				const image = node as HTMLImageElement;
				image.loading = "eager";
				await image.decode();
			}),
		);
	});
	await expect(page.locator('[data-project="pew"] h3 a')).toHaveAttribute(
		"href",
		"https://pew.md",
	);
	await expect(page.locator('[data-project="frogie"] h3 a')).toHaveAttribute(
		"href",
		"https://github.com/nocoo/frogie",
	);
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
	expect(errors).toEqual([]);
});

test("combines search and categories, resets empty results, and sorts by name", async ({
	page,
}) => {
	await page.goto("/");
	const search = page.getByRole("searchbox", { name: "Search projects" });
	await page.keyboard.press("/");
	await expect(search).toBeFocused();
	await search.fill("pew");
	await expect(page.locator(".project-card")).toHaveCount(2);
	await page.getByRole("button", { name: /^AI & agents/ }).click();
	await expect(page.locator(".project-card")).toHaveCount(1);
	await expect(page.locator(".project-card h3")).toContainText("Pew");
	await search.fill("there-is-no-such-project");
	await expect(
		page.getByRole("heading", { name: "Nothing here just yet." }),
	).toBeVisible();
	await page.getByRole("button", { name: "Reset filters" }).click();
	await expect(page.locator(".project-card")).toHaveCount(active.length);
	await expect(search).toHaveValue("");
	await search.fill("backup");
	await search.press("Escape");
	await expect(search).toHaveValue("");
	await page.getByLabel("Sort projects").selectOption("az");
	const names = await page.locator(".project-card h3 a").allTextContents();
	expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
	await expect(page).toHaveURL(/sort=az/);
});

test("remembers language and theme across reloads and searches Chinese descriptions", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Switch to Chinese" }).click();
	await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
	await expect(page.getByRole("heading", { level: 1 })).toContainText(
		"一整个小宇宙。",
	);
	await page.getByRole("button", { name: "切换到深色主题" }).click();
	await page.reload();
	await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
	await page.getByRole("searchbox", { name: "搜索项目" }).fill("本地工作台");
	await expect(page.locator(".project-card")).toHaveCount(1);
	await expect(page.locator(".project-card h3")).toContainText("Frogie");
	await page.getByRole("button", { name: "清空搜索" }).click();
	await expect(page.locator(".project-card")).toHaveCount(active.length);
	await expect(
		page.locator('[data-project="frogie"] .refined-badge'),
	).toHaveText("已重绘");
	await page.getByRole("button", { name: "切换到浅色主题" }).click();
	await page.getByRole("button", { name: "Switch to English" }).click();
	await page.reload();
	await expect(page.locator("html")).toHaveAttribute("lang", "en");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("restores directory filters with browser back and reloads a shared identity", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByRole("searchbox", { name: "Search projects" }).fill("pew");
	await page
		.locator('[data-project="pew"]')
		.getByRole("button", { name: "View logo: Pew", exact: true })
		.click();
	await expect(page).toHaveURL(/\/logos\/pew$/);
	await expect(page.locator("#identity-title")).toContainText("Pew");
	await page.reload();
	await expect(page.locator("#identity-title")).toContainText("Pew");
	await page.goBack();
	await expect(
		page.getByRole("searchbox", { name: "Search projects" }),
	).toHaveValue("pew");
	await expect(page.locator(".project-card")).toHaveCount(2);
	await page
		.getByRole("navigation", { name: "Main navigation" })
		.getByRole("button", { name: "Logo gallery" })
		.click();
	await expect(page.locator(".picker-item")).toHaveCount(active.length);
	await page.getByRole("link", { name: "hexly.ai", exact: true }).click();
	await expect(page.locator(".project-card")).toHaveCount(active.length);
});

test("keeps archived projects accessible through their category and direct logo paths", async ({
	page,
}) => {
	await page.goto("/");
	await expect(page.locator('[data-project="uptime-kuma-skill"]')).toHaveCount(
		0,
	);
	await page.getByRole("button", { name: /^Archived/ }).click();
	await expect(page.locator(".project-card")).toHaveCount(archived.length);
	await page
		.locator('[data-project="uptime-kuma-skill"]')
		.getByRole("button", { name: "View logo: Uptime Kuma Skill" })
		.click();
	await expect(page.locator("#identity-title")).toContainText(
		"Uptime Kuma Skill",
	);
	await expect(page).toHaveURL(/\/logos\/uptime-kuma-skill\?category=archive$/);
	await page.goto("/logos/uptime-kuma-skill");
	await page.reload();
	await expect(page.locator("#identity-title")).toContainText(
		"Uptime Kuma Skill",
	);
	await expect(
		page.getByRole("combobox", { name: "Project categories" }),
	).toHaveValue("archive");
	await expect(page.locator(".picker-item")).toHaveCount(archived.length);
	await page
		.getByRole("combobox", { name: "Project categories" })
		.selectOption("all");
	await expect(page.locator(".picker-item")).toHaveCount(active.length);
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await page.goBack();
	await expect(page.locator("#identity-title")).toContainText(
		"Uptime Kuma Skill",
	);
});

test.describe("system preferences", () => {
	test.use({ locale: "zh-CN", colorScheme: "dark" });
	test("uses the browser language and theme for a new visitor", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
		await expect(
			page.getByRole("button", { name: "切换到浅色主题" }),
		).toBeVisible();
	});
});
