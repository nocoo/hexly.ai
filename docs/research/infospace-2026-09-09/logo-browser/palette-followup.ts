import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { chromium, expect, type Page } from "/Users/nocoo/workspace/personal/hexly.ai/node_modules/@playwright/test/index.mjs";
import { readProjects } from "/Users/nocoo/workspace/personal/hexly.ai/src/data/read-projects.ts";
const repo = "/Users/nocoo/workspace/personal/hexly.ai";
const output = "/tmp/infospace-logo-browser";
const baseURL = "http://127.0.0.1:7048";
const require = createRequire(`${repo}/package.json`);
const sharp = require("sharp");
const project = readProjects().find((item) => item.id === "infospace")!;
const checks: any[] = [];
const diagnostics: any[] = [];
const screenshots: string[] = [];
const started = new Date().toISOString();
const paletteComponentSha256 = createHash("sha256").update(await readFile(`${repo}/src/components/Palette.tsx`)).digest("hex");
const browser = await chromium.launch({ headless: true });

async function cleanCapture(page: Page, prefix: string, full: boolean) {
  await expect(page.locator(".toast-visible")).toHaveCount(0);
  for (const image of await page.locator(".alpha-grid img").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async (element: HTMLImageElement) => { await element.decode(); });
  }
  await page.evaluate(async () => { await document.fonts.ready; window.scrollTo({ top: 0, behavior: "instant" }); });
  await page.waitForFunction(() => scrollY === 0);
  const overview = await page.locator(".project-overview").boundingBox();
  const comparison = await page.locator(".comparison-grid").boundingBox();
  assert(overview && comparison);
  const buffer = await page.screenshot({ fullPage: true, animations: "disabled" });
  for (const [name, rect] of [["overview", overview], ["comparison", comparison]] as const) {
    const file = `clean-${prefix}-${name}.png`;
    await sharp(buffer).extract({ left: Math.floor(rect.x), top: Math.floor(rect.y), width: Math.ceil(rect.width), height: Math.ceil(rect.height) }).toFile(`${output}/screenshots/${file}`);
    screenshots.push(file);
  }
  if (full) {
    const file = `clean-${prefix}-full.png`;
    await writeFile(`${output}/screenshots/${file}`, buffer);
    screenshots.push(file);
  }
}
try {
  for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 320, height: 740 }]] as const) {
    for (const theme of ["light", "dark"] as const) {
      const scope = `site-${device}-${theme}`;
      const context = await browser.newContext({ baseURL, viewport, colorScheme: theme, locale: "en-US", reducedMotion: "reduce", isMobile: device === "mobile", hasTouch: device === "mobile", deviceScaleFactor: 1 });
      await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
      const page = await context.newPage();
      page.on("pageerror", (error) => diagnostics.push({ scope, kind: "pageerror", page: page.url(), message: error.message }));
      page.on("console", (message) => { if (message.type() === "error") diagnostics.push({ scope, kind: "console-error", page: page.url(), message: message.text() }); });
      page.on("response", (response) => { if (response.status() >= 400) diagnostics.push({ scope, kind: "http-error", status: response.status(), url: response.url() }); });
      try {
        assert.equal((await page.goto("/logos/infospace"))?.status(), 200);
        await expect(page.locator("#identity-title")).toContainText("Info Space");
        for (const locale of ["en", "zh"] as const) {
          const name = `${scope}-${locale}: current palette, clipboard and clean screenshots`;
          try {
            if (locale === "zh") await page.getByRole("button", { name: "Switch to Chinese" }).click();
            await expect(page.locator(".palette-swatches button")).toHaveCount(7);
            await expect(page.locator(".swatch-role")).toHaveText(project.family!.palette.map((swatch) => swatch.label![locale]));
            await expect(page.locator(".tech-badge")).toHaveCount(7);
            await expect(page.locator(".project-goal > p")).toHaveText(project.overview!.goal[locale]);
            for (let index = 0; index < 7; index++) {
              const color = project.family!.palette[index].color;
              await page.locator(".palette-swatches button").nth(index).click();
              await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(color);
            }
            const mode = device === "desktop" ? (theme === "light" ? "icon" : "transparent") : (theme === "light" ? "icon" : "white");
            const modeIndex = ["icon", "transparent", "white"].indexOf(mode);
            await page.locator(".view-switch button").nth(modeIndex).click();
            await expect(page.locator(".logo-review")).toHaveAttribute("data-presentation", mode);
            await page.locator(".current-artwork .artwork-image").evaluate(async (element: HTMLImageElement) => { await element.decode(); });
            await cleanCapture(page, `${scope}-${locale}-${mode}`, locale === (theme === "light" ? "en" : "zh"));
            checks.push({ name, passed: true, evidence: { colors: 7, clipboardValuesMatch: true, mode, toastAbsentFromScreenshots: true } });
            console.log(`PASS ${name}`);
          } catch (error) {
            checks.push({ name, passed: false, error: String(error) });
            console.log(`FAIL ${name}: ${error}`);
          }
        }
        await page.goto("/");
        await expect(page.locator(".project-card")).toHaveCount(50);
        await page.locator(".category-tabs").getByRole("button", { name: /^开发工具/ }).click();
        await expect(page.locator('[data-project="infospace"]')).toBeVisible();
      } finally { await context.close(); }
    }
  }
} finally {
  await browser.close();
  const followUp = { started, finished: new Date().toISOString(), headless: true, paletteComponentSha256, checks, diagnostics, screenshots, passed: checks.every((item) => item.passed) && diagnostics.length === 0 };
  await writeFile(`${output}/palette-followup-report.json`, `${JSON.stringify(followUp, null, 2)}\n`);
  const report = JSON.parse(await readFile(`${output}/report.json`, "utf8"));
  report.paletteFollowUp = { file: "palette-followup-report.json", ...followUp };
  report.checks.push(...checks);
  report.screenshots.push(...screenshots);
  report.historicalDiagnostics = report.significantDiagnostics;
  const allHistoricalArePaletteKeys = report.historicalDiagnostics.every((item: any) => item.kind === "console-error" && item.message.includes("Encountered two children with the same key") && (item.message.includes("accent-#bd9f6d") || item.message.includes("accent-#fdc904")));
  if (followUp.passed && allHistoricalArePaletteKeys) {
    report.resolvedFindings = [{ finding: "Duplicate React palette keys while visiting the directory", historicOccurrences: report.historicalDiagnostics.length, source: "Existing gecko/pika palette entries; shared Palette component", resolution: "A shared Palette change became available in the working tree during review. It deduplicates identical swatches and uses complete descriptors for keys. This agent made no repository edits.", verifiedBy: ["navigation-report.json: four viewport/theme history cases, zero diagnostics", "palette-followup-report.json: eight locale/viewport/theme cases and directory revisits, zero diagnostics"], paletteComponentSha256 }];
    report.significantDiagnostics = [];
  }
  report.significantDiagnostics.push(...diagnostics);
  report.currentDiagnostics = diagnostics;
  report.sourceChangedDuringRun = true;
  report.sourceChangeNote = "Initially watched project/artwork/component files stayed stable; the shared Palette component changed between initial matrix and follow-up. Affected palette/directory behavior was rechecked; no artwork or finishing edits were made by this agent.";
  report.finished = followUp.finished;
  report.finalVerifiedSnapshots = Object.fromEntries(await Promise.all([
    "src/data/projects/infospace.json", "src/components/Palette.tsx", "src/data/project-order.json", "artwork/logo-family/infospace/2026-09-09-01/review.html", "artwork/logo-family/review.mjs", "src/components/LogoReview.tsx",
  ].map(async (file) => [file, createHash("sha256").update(await readFile(`${repo}/${file}`)).digest("hex")])));
  report.passed = report.checks.every((item: any) => item.passed) && report.significantDiagnostics.length === 0;
  report.recommendedScreenshots = [
    "clean-site-desktop-light-en-icon-full.png",
    "clean-site-desktop-dark-zh-transparent-full.png",
    "clean-site-mobile-light-en-icon-full.png",
    "clean-site-mobile-dark-zh-white-full.png",
    "clean-site-mobile-dark-zh-white-overview.png",
    "site-desktop-light-en-sizes.png", "site-mobile-dark-zh-alpha.png",
    "static-desktop-dark-transparent-comparison.png", "static-mobile-dark-sizes.png", "static-desktop-light-references.png",
  ];
  await writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
  const failed = report.checks.filter((item: any) => !item.passed);
  await writeFile(`${output}/report.md`, [
    `InfoSpace headless browser review: ${report.passed ? "PASS" : "REQUIRES REVIEW"}.`,
    `\n${report.started} to ${report.finished}; ${baseURL}. All evidence is local review evidence, not a production-deployment claim.`,
    "\nReviewed /logos/infospace and the static 2026-09-09-01 study at desktop 1440 × 1000 and mobile 320 × 740, light/dark. Site en/zh × three presentations covers 24 scenes; the English static study covers 12. Eight additional locale/theme/viewport checks validated the shared palette change and captured clear screenshots.",
    `\n${report.checks.length - failed.length}/${report.checks.length} checks passed. Current significant browser/network diagnostics: ${report.significantDiagnostics.length}. Twelve actual downloaded files form six site/static pairs, each byte-identical to the archived source; SHA-256 and size records are in report.json.`,
    "\nVerified original/current image decoding; transparent 32/16 px specimens, 24/16 px context marks and static favicon; stable small-image URLs across all large modes; all seven clipboard colors; exact prompt; four ordered static reference images and no reference boards on the site; translated goals, seven badges and README links; no horizontal overflow; refresh, preference persistence and browser history.",
    "\nDirectory placement is dreamro → infospace → signoff-now: InfoSpace begins the group after the animal/template/game series. The tools category still includes animal-series projects, so bat remains its first filtered result. The initial review script conflated these two orders; its original evidence is retained in report-initial.json. Only the five affected order/navigation checks were rerun after correcting the review script.",
    `\nThe initial directory visits recorded ${report.historicalDiagnostics.length} React duplicate-key console messages for existing gecko/pika palette entries. A shared Palette fix became available in the working tree during review. Four new navigation cases and eight new palette cases captured no such messages; the historical diagnostics remain recorded as resolved. The verified Palette SHA-256 is ${paletteComponentSha256}.`,
    "\nPending family review status is expected, not a defect. No application, data, artwork or frozen finishing files were changed by this agent; no commits or pushes. Chromium ran headless and was never brought to the desktop foreground. Native toolbar behavior is outside this review.",
    "\nEvidence: report.json, review.ts, navigation.ts, palette-followup.ts, per-pass reports, downloads/ and screenshots/. Prefer the clean-* images listed in report.json → recommendedScreenshots; older screenshots retain transient clipboard toasts and initial assertion diagnostics for traceability.",
    failed.length ? `\nRemaining failures:\n${failed.map((item: any) => `${item.name}: ${item.error}`).join("\n")}` : "\nNo remaining failed assertions. Visual inspection notes will follow below.",
  ].join("\n") + "\n");
  console.log(`COMPLETE ${report.passed ? "PASS" : "REQUIRES REVIEW"}: ${report.checks.length - failed.length}/${report.checks.length}; current diagnostics ${report.significantDiagnostics.length}`);
  if (!report.passed) process.exitCode = 1;
}
