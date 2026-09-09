import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { chromium, expect } from "/Users/nocoo/workspace/personal/hexly.ai/node_modules/@playwright/test/index.mjs";
import { readProjects } from "/Users/nocoo/workspace/personal/hexly.ai/src/data/read-projects.ts";
import { filterProjects } from "/Users/nocoo/workspace/personal/hexly.ai/src/model/catalogue.ts";

const output = "/tmp/infospace-logo-browser";
const repo = "/Users/nocoo/workspace/personal/hexly.ai";
const baseURL = "http://127.0.0.1:7048";
const report = JSON.parse(await readFile(`${output}/report-initial.json`, "utf8"));
const projects = readProjects();
const expectedOrder = filterProjects(projects, "").map((item) => item.id);
const expectedTools = filterProjects(projects, "", "tools").map((item) => item.id);
const series = JSON.parse(await readFile(`${repo}/src/data/project-order.json`, "utf8"));
const ranked = new Set([...series.animals.map((item: any) => item.id), ...series.templates, ...series.games]);
const started = new Date().toISOString();
const checks: any[] = [];
const screenshots: string[] = [];
const diagnostics: any[] = [];
const browser = await chromium.launch({ headless: true });

async function run(name: string, fn: () => Promise<any>, page?: any) {
  try {
    checks.push({ name, passed: true, evidence: await fn(), validationPass: "corrected-curated-order-and-navigation-only" });
    console.log(`PASS ${name}`);
  } catch (error) {
    checks.push({ name, passed: false, error: String(error), validationPass: "corrected-curated-order-and-navigation-only" });
    console.log(`FAIL ${name}: ${error}`);
    if (page) {
      const filename = `navigation-failure-${checks.length}.png`;
      await page.screenshot({ path: `${output}/screenshots/${filename}`, fullPage: true });
      screenshots.push(filename);
    }
  }
}
try {
  await run("catalogue: InfoSpace begins tools group", async () => {
    assert.equal(expectedOrder.length, 50);
    assert.equal(expectedOrder.find((id) => !ranked.has(id)), "infospace");
    assert.equal(expectedOrder.indexOf("infospace"), expectedOrder.indexOf("dreamro") + 1);
    assert.equal(expectedOrder.indexOf("signoff-now"), expectedOrder.indexOf("infospace") + 1);
    return { active: expectedOrder.length, expectedOrder, expectedTools, firstAfterAnimalTemplateGameSeries: "infospace", toolsFilterFirst: expectedTools[0], note: "The tools category retains animal-series entries; its first result is bat. Default-group placement is dreamro → infospace → signoff-now." };
  });
  for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 320, height: 740 }]] as const) {
    for (const theme of ["light", "dark"] as const) {
      const scope = `site-${device}-${theme}`;
      const context = await browser.newContext({ baseURL, viewport, colorScheme: theme, locale: "en-US", reducedMotion: "reduce", isMobile: device === "mobile", hasTouch: device === "mobile", deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.on("pageerror", (error) => diagnostics.push({ scope, kind: "pageerror", message: error.message }));
      page.on("console", (message) => { if (message.type() === "error") diagnostics.push({ scope, kind: "console-error", page: page.url(), message: message.text(), location: message.location() }); });
      page.on("response", (response) => { if (response.status() >= 400) diagnostics.push({ scope, kind: "http-error", status: response.status(), url: response.url() }); });
      await run(`${scope}: refresh, preferences, history and first tools placement`, async () => {
        assert.equal((await page.goto("/logos/infospace"))?.status(), 200);
        await expect(page.locator("#identity-title")).toContainText("Info Space");
        await page.getByRole("button", { name: "Switch to Chinese" }).click();
        await page.reload();
        await expect(page.locator("#identity-title")).toContainText("Info Space");
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect(page.getByRole("region", { name: "项目目标" })).toBeVisible();
        await page.locator(".theme-toggle").click();
        const inverseTheme = theme === "light" ? "dark" : "light";
        await expect(page.locator("html")).toHaveAttribute("data-theme", inverseTheme);
        await page.reload();
        await expect(page.locator("html")).toHaveAttribute("data-theme", inverseTheme);
        await page.locator(".theme-toggle").click();
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await page.goto("/");
        await expect(page.locator(".project-card")).toHaveCount(expectedOrder.length);
        const actual = await page.locator(".project-card").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-project")));
        assert.deepEqual(actual, expectedOrder);
        assert.deepEqual(actual.slice(actual.indexOf("infospace") - 1, actual.indexOf("infospace") + 2), ["dreamro", "infospace", "signoff-now"]);
        const card = page.locator('[data-project="infospace"]');
        await card.scrollIntoViewIfNeeded();
        const placementImage = `${scope}-directory-placement.png`;
        await page.screenshot({ path: `${output}/screenshots/${placementImage}`, animations: "disabled" });
        screenshots.push(placementImage);
        await page.locator(".category-tabs").getByRole("button", { name: /^开发工具/ }).click();
        await expect(page.locator(".project-card")).toHaveCount(expectedTools.length);
        assert.deepEqual(await page.locator(".project-card").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-project"))), expectedTools);
        await expect(page.locator(".project-card").first()).toHaveAttribute("data-project", expectedTools[0]);
        const toolsImage = `${scope}-tools-placement.png`;
        await card.screenshot({ path: `${output}/screenshots/${toolsImage}`, animations: "disabled" });
        screenshots.push(toolsImage);
        const directoryURL = page.url();
        await card.locator(".card-main").click();
        await expect(page.locator("#identity-title")).toContainText("Info Space");
        const galleryURL = page.url();
        assert.equal(new URL(galleryURL).pathname, "/logos/infospace");
        await page.reload();
        await expect(page.locator("#identity-title")).toContainText("Info Space");
        await page.goBack();
        await expect(page).toHaveURL(directoryURL);
        await expect(page.locator(".project-card").first()).toHaveAttribute("data-project", expectedTools[0]);
        await page.goForward();
        await expect(page).toHaveURL(galleryURL);
        await expect(page.locator("#identity-title")).toContainText("Info Space");
        return { activeOrderMatches: true, firstAfterRankedSeries: "infospace", neighbors: ["dreamro", "infospace", "signoff-now"], toolsFilterFirst: expectedTools[0], directoryURL, galleryURL, refresh: true, history: true, themeAndLocalePersist: true };
      }, page);
      await context.close();
    }
  }
} finally {
  await browser.close();
  const navigation = { started, finished: new Date().toISOString(), headless: true, checks, diagnostics, screenshots };
  await writeFile(`${output}/navigation-report.json`, `${JSON.stringify(navigation, null, 2)}\n`);
  const corrections = new Map(checks.map((item) => [item.name, item]));
  report.checks = report.checks.map((item: any) => corrections.get(item.name) ?? item);
  report.screenshots = [...report.screenshots, ...screenshots];
  report.diagnostics = [...report.diagnostics, ...diagnostics];
  report.significantDiagnostics = [...report.significantDiagnostics, ...diagnostics];
  report.finished = navigation.finished;
  report.validationNotes = [{ kind: "review-harness-correction", originalEvidence: "report-initial.json", note: "Initial order assertions incorrectly required InfoSpace to be the first tools-category result. This conflicts with the existing animal-first curated order: bat belongs to the tools category. The contract is the first project after animal/template/game series, which is InfoSpace immediately after dreamro and before signoff-now. Corrected only this review script, reran the five affected order/navigation checks, and retained all 59 unaffected results. No application files changed." }];
  report.navigationSourceSnapshot = Object.fromEntries(await Promise.all(Object.keys(report.endSnapshots).map(async (file) => [file, createHash("sha256").update(await readFile(`${repo}/${file}`)).digest("hex")])));
  report.sourceChangedDuringRun ||= JSON.stringify(report.endSnapshots) !== JSON.stringify(report.navigationSourceSnapshot);
  report.passed = report.checks.every((item: any) => item.passed) && report.significantDiagnostics.length === 0;
  await writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
  const failed = report.checks.filter((item: any) => !item.passed);
  await writeFile(`${output}/report.md`, [
    `InfoSpace headless browser review: ${report.passed ? "PASS" : "REQUIRES REVIEW"}.`,
    `\n${report.started} to ${report.finished}; local Vite site ${baseURL}.`,
    "\nReviewed /logos/infospace and /artwork/logo-family/infospace/2026-09-09-01/review.html at desktop 1440 × 1000 and mobile 320 × 740, light/dark. Site en/zh × three presentations (24 scenes), static English × three presentations (12 scenes).",
    `\n${report.checks.length - failed.length}/${report.checks.length} checks passed; ${report.significantDiagnostics.length} significant browser/network errors. Twelve actual downloaded files form six byte-identical site/static pairs, each matching the archived source.`,
    "\nVerified original/current image decoding; transparent 32/16 px specimens, 24/16 px context marks and static favicon; stable small-image URLs across large presentation modes; all seven clipboard colors; exact prompt; four ordered static reference images; no reference boards on the site; translated goals, seven badges and README links; no horizontal overflow; refresh, preferences and browser history.",
    "\nDirectory placement is dreamro → infospace → signoff-now, with InfoSpace first after the animal/template/game series. The tools category retains those animal entries, so bat is the first filtered result. The initial review script assumed these two orders were identical; report-initial.json preserves that mistake. Only the five affected order/navigation checks were rerun after correcting the review script; the 59 unaffected results were retained.",
    `\nPending review status is expected and was not considered a defect. Watched source files ${report.sourceChangedDuringRun ? "changed during review; compare snapshot checksums" : "were stable during review"}.`,
    "\nNo application, data or frozen finishing files were changed; no commits or pushes. Chromium was headless and never brought to the desktop foreground. Native toolbar behavior is outside this review.",
    `\nEvidence: report.json, navigation-report.json, review.ts, navigation.ts, downloads/ and screenshots/ (${report.screenshots.length} images, including retained initial assertion-failure screenshots).`,
    failed.length ? `\nRemaining failures:\n${failed.map((item: any) => `${item.name}: ${item.error}`).join("\n")}` : "\nNo remaining failed assertions. Visual inspection notes will be added after screenshot review.",
  ].join("\n") + "\n");
  console.log(`COMPLETE ${report.passed ? "PASS" : "REQUIRES REVIEW"}: ${report.checks.length - failed.length}/${report.checks.length}`);
  if (!report.passed) process.exitCode = 1;
}
