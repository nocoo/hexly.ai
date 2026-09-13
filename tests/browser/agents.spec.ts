import AxeBuilder from "@axe-core/playwright";
import { agentCopy } from "../../src/data/agent-copy";
import { readProjects } from "../../src/data/read-projects";
import { outroInstructions, standardOutros } from "../../src/model/agent-guide";
import { expect, test } from "./fixtures";

for (const colorScheme of ["light", "dark"] as const) {
	test(`copies useful page-specific instructions in ${colorScheme} on every site surface`, async ({
		page,
		context,
	}, testInfo) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		await page.emulateMedia({ colorScheme });
		for (const path of [
			"/",
			"/logos",
			"/projects/frogie",
			"/status",
			"/templates/launch?project=pew&theme=dark&ending=split",
		]) {
			await page.goto(path);
			const guide = page.getByRole("region", { name: "For agents" });
			await expect(guide).toBeVisible();
			const text = await guide.locator("pre").textContent();
			await guide.getByRole("button", { name: "Copy instructions" }).click();
			await expect
				.poll(() => page.evaluate(() => navigator.clipboard.readText()))
				.toBe(text);
			await expect(
				guide.getByRole("button", { name: "Copy instructions" }),
			).toHaveText("Copied");
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		}
		const guide = page.locator("#agent-guide");
		await guide.screenshot({
			path: testInfo.outputPath(`agent-guide-${colorScheme}.png`),
		});
		await guide.locator("summary").click();
		await expect(guide.locator("pre")).toContainText(
			"--project pew --template launch --theme dark",
		);
		await expect(guide.locator("pre")).toHaveCSS("white-space", "pre-wrap");
		const scan = await new AxeBuilder({ page })
			.include("#agent-guide")
			.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
			.analyze();
		expect(scan.violations).toEqual([]);
		await page.getByRole("button", { name: "Switch to Chinese" }).click();
		await expect(
			guide.getByRole("heading", { name: agentCopy.zh.region }),
		).toBeVisible();
		await expect(
			guide.getByRole("button", { name: agentCopy.zh.copy }),
		).toBeVisible();
		await expect(guide.locator("pre")).toContainText("--locale zh");
	});
}

test("copies an original outro handoff without downloading or regenerating the movie", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	const movies: string[] = [];
	page.on("request", (request) => {
		if (request.url().endsWith(".mp4")) movies.push(request.url());
	});
	await page.goto("/templates#outros");
	const outro = standardOutros.outros[0];
	if (!outro) throw new Error("Expected a standard outro");
	const card = page.locator(`[data-template-example="${outro.video.id}"]`);
	await card.getByRole("button", { name: "Copy for agent" }).click();
	await expect
		.poll(() => page.evaluate(() => navigator.clipboard.readText()))
		.toBe(outroInstructions(outro));
	await card.locator("summary").click();
	await expect(card.locator("pre")).toContainText(outro.video.sha256);
	await expect(page.locator("video")).toHaveCount(0);
	expect(movies).toEqual([]);
});

test("copies exact archived prompt bytes and refreshes guides during in-app navigation", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	const generated = readProjects().find(
		(project) => project.family && !project.family.method,
	);
	if (!generated) throw new Error("Expected an archived generation prompt");
	await page.goto(`/projects/${generated.id}`);
	const copy = page.getByRole("button", { name: "Copy exact prompt" });
	await expect(copy).toBeEnabled();
	await copy.click();
	await expect
		.poll(() => page.evaluate(() => navigator.clipboard.readText()))
		.toBe(await page.locator(".generation-prompt").textContent());
	await page.keyboard.press("ArrowRight");
	await expect(page).toHaveURL(new RegExp(`/projects/${generated.id}$`));
	await page.locator(".project-template-link").click();
	await expect(
		page.locator('head link[rel="alternate"][type="text/markdown"]'),
	).toHaveAttribute("href", "/agents/templates.md");
	await expect(page.locator("#agent-guide pre")).toContainText(
		`--project ${generated.id}`,
	);
});

test("offers selectable text when clipboard permission is unavailable", async ({
	page,
}) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator.clipboard, "writeText", {
			value: async () => {
				throw new Error("Clipboard permission denied by fixture");
			},
		});
	});
	await page.goto("/templates#agent-guide");
	const guide = page.locator("#agent-guide");
	await guide.getByRole("button", { name: "Copy instructions" }).click();
	await expect(guide.getByRole("status")).toContainText("Copy failed");
	await guide.locator("summary").click();
	await expect(guide.locator("pre")).toBeVisible();
	await expect(
		guide.getByRole("link", { name: "Plain Markdown" }),
	).toHaveAttribute("href", "/agents/templates.md");
});
