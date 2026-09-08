import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";

const startedAt = new Date().toISOString();
const projects = readProjects().filter((item) => !item.archived);
expect(projects).toHaveLength(49);
const revision = process.argv[2];
const baseURL = (process.argv[3] ?? "https://hexly.ai").replace(/\/$/u, "");
const expectedVersion = process.argv[4] ?? "0.5.0";
const artifactDirectory = process.argv[5] ?? "/tmp/hexly-readme-release-0.5.0";
await mkdir(artifactDirectory, { recursive: true });
if (!revision || !/^[a-f0-9]{40}$/.test(revision)) {
	throw new Error("Pass the full published revision.");
}
const live = await fetch(`${baseURL}/api/live?readme=${Date.now()}`, {
	cache: "no-store",
}).then((response) => {
	if (!response.ok)
		throw new Error(`Live metadata returned ${response.status}`);
	return response.json();
});
expect(live.version).toBe(expectedVersion);
expect(live.revision).toBe(revision);
const results: {
	id: string;
	languages: string[];
	technologyCount: number;
	passedAt: string;
}[] = [];
const browser = await chromium.launch();
try {
	for (const project of projects) {
		const id = project.id;
		if (!project.overview) throw new Error(`Missing local overview: ${id}`);
		const context = await browser.newContext({
			locale: "en-US",
			viewport: { width: 1440, height: 1000 },
		});
		const page = await context.newPage();
		await page.goto(`${baseURL}/logos/${id}`, {
			waitUntil: "domcontentloaded",
		});
		const section = page.locator(".project-overview");
		for (const locale of ["en", "zh"] as const) {
			await page.setViewportSize({ width: 1440, height: 1000 });
			if (locale === "zh") {
				await page.getByRole("button", { name: "Switch to Chinese" }).click();
			}
			await expect(section.locator(".project-goal > p")).toHaveText(
				project.overview.goal[locale],
				{ timeout: 15000 },
			);
			await expect(section.locator(".tech-name")).toHaveText(
				project.overview.techStack.map((item) => item.name),
			);
			await expect(section.locator(".tech-role")).toHaveText(
				project.overview.techStack.map((item) => item.role[locale]),
			);
			await expect(section.getByRole("link")).toHaveAttribute(
				"href",
				`${project.repository}/blob/main/${locale === "en" ? "docs/README.en.md" : "README.md"}`,
			);
			await page.setViewportSize({ width: 320, height: 740 });
			await section.scrollIntoViewIfNeeded();
			await page.evaluate(() => document.fonts.ready);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
			if (["lyre", "signoff-now"].includes(id)) {
				await page.evaluate(() => scrollTo(0, 0));
				await page.screenshot({
					fullPage: true,
					path: `${artifactDirectory}/${id}-${locale}-320.png`,
				});
			}
		}
		console.log(
			`${id}: bilingual goal, stack, README links and 320 px layout verified`,
		);
		results.push({
			id,
			languages: ["en", "zh"],
			technologyCount: project.overview.techStack.length,
			passedAt: new Date().toISOString(),
		});
		await context.close();
	}
} finally {
	await browser.close();
}
await writeFile(
	`${artifactDirectory}/production-overviews.json`,
	`${JSON.stringify(
		{
			startedAt,
			completedAt: new Date().toISOString(),
			version: live.version,
			baseURL,
			revision,
			browser: "Chromium",
			viewports: [
				{ width: 1440, height: 1000 },
				{ width: 320, height: 740 },
			],
			checks: [
				"bilingual goal",
				"technology names",
				"bilingual technology roles",
				"README URLs",
				"no 320 px horizontal overflow",
			],
			projects: results,
		},
		null,
		2,
	)}\n`,
);
