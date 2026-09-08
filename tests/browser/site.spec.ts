import { expect, test } from "@playwright/test";
import manifest from "../../package.json" with { type: "json" };
import projects from "../../src/data/projects.json" with { type: "json" };
import { filterProjects } from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";

const catalogue = projects as Project[];
const active = catalogue.filter((project) => !project.archived);
const archived = catalogue.filter((project) => project.archived);
const ordered = filterProjects(catalogue, "", "all");
const firstVisible = ordered[0];
const tiers = [
	active.filter((project) => project.family),
	active.filter((project) => !project.family),
];

test("renders active projects with local logos and working destinations", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});
	await page.goto("/");
	await expect(page).toHaveTitle(/hexly.ai/);
	await expect(page.locator(".site-footer .site-version")).toHaveText(
		`v${manifest.version}`,
	);
	const surfaces = page.getByRole("navigation", {
		name: "Surfaces",
		exact: true,
	});
	await expect(
		surfaces.getByRole("link", { name: "Portfolio", exact: true }),
	).toHaveAttribute("aria-current", "true");
	await expect(
		surfaces.getByRole("link", { name: "Play", exact: true }),
	).toHaveAttribute("href", "https://lizheng.me/en/");
	await expect(
		surfaces.getByRole("link", { name: "Journal", exact: true }),
	).toHaveAttribute("href", "https://lizheng.blog/");
	await expect(
		surfaces.getByRole("link", { name: "Résumé", exact: true }),
	).toHaveAttribute("href", "https://lizheng.dev/en/");
	await expect(
		page.locator(".site-footer").getByRole("link", { name: "zheng li." }),
	).toHaveAttribute("href", "https://lizheng.me/en/");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Small ideasA little universe.",
	);
	await expect(page.locator(".project-card")).toHaveCount(active.length);
	expect(
		await page.locator(".card-github").evaluateAll((links) =>
			links.map((link) => ({
				label: link.textContent?.trim(),
				href: link.getAttribute("href"),
			})),
		),
	).toEqual(
		ordered.map((project) => ({
			label: "GitHub",
			href: project.repository,
		})),
	);
	const refined = active.filter((project) => project.family);
	for (const project of refined) {
		const { id } = project;
		await expect(
			page.locator(`[data-project="${id}"] .logo-family img`),
		).toHaveAttribute("src", new RegExp(`${project.family?.root}/icon-`));
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
	await expect(page.locator('[data-project="pew"] .card-main')).toHaveAttribute(
		"href",
		"/logos/pew",
	);
	await expect(
		page.locator('[data-project="frogie"] .card-main'),
	).toHaveAttribute("href", "/logos/frogie");
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
	const names = await page.locator(".project-card h3").allTextContents();
	expect(names).toEqual(
		tiers.flatMap((tier) =>
			tier
				.map((project) => project.title)
				.toSorted((a, b) => a.localeCompare(b, "en")),
		),
	);
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
	await page.getByRole("button", { name: "主题：浅色；切换为深色" }).click();
	await page.reload();
	await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
	await page.getByRole("searchbox", { name: "搜索项目" }).fill("本地工作台");
	await expect(page.locator(".project-card")).toHaveCount(1);
	await expect(page.locator(".project-card h3")).toContainText("Frogie");
	await page.getByRole("button", { name: "清空搜索" }).click();
	await expect(page.locator(".project-card")).toHaveCount(active.length);
	await expect(
		page.getByRole("link", { name: "查看 GitHub 项目: Frogie", exact: true }),
	).toHaveAttribute("href", "https://github.com/nocoo/frogie");
	await page.getByRole("button", { name: "主题：深色；切换为浅色" }).click();
	await page.getByRole("button", { name: "切换为英文" }).click();
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
		.getByRole("link", { name: "View logo: Pew", exact: true })
		.click({ position: { x: 8, y: 8 } });
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
	await page
		.locator(".site-header")
		.getByRole("link", { name: "hexly.ai", exact: true })
		.click();
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
		.getByRole("link", { name: "View logo: Uptime Kuma Skill" })
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
	await expect(page.locator("#identity-title")).toContainText(
		firstVisible?.title ?? "",
	);
	await page.goBack();
	await expect(page.locator("#identity-title")).toContainText(
		"Uptime Kuma Skill",
	);
});

test("keeps repository clicks separate and supports card links in another tab", async ({
	page,
	context,
}) => {
	await context.route("https://github.com/nocoo/pew", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<title>Pew repository</title>",
		}),
	);
	await page.goto("/");
	const card = page.locator('[data-project="pew"]');
	const repositoryPage = page.waitForEvent("popup");
	await card.getByRole("link", { name: "View on GitHub: Pew" }).click();
	const repository = await repositoryPage;
	await expect(repository).toHaveURL("https://github.com/nocoo/pew");
	await expect(page).toHaveURL(/\/$/);
	await repository.close();
	const detailPage = context.waitForEvent("page");
	await card
		.getByRole("link", { name: "View logo: Pew" })
		.click({ button: "middle" });
	const detail = await detailPage;
	await detail.waitForURL(/\/logos\/pew$/, {
		waitUntil: "domcontentloaded",
	});
	await expect(detail.locator("#identity-title")).toContainText("Pew");
	await expect(page).toHaveURL(/\/$/);
	await detail.close();
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
			page.getByRole("button", { name: "主题：深色；切换为浅色" }),
		).toBeVisible();
	});
});
