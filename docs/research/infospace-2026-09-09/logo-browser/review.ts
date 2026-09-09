import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { chromium, expect, type Page, type Locator } from "/Users/nocoo/workspace/personal/hexly.ai/node_modules/@playwright/test/index.mjs";
import { readProjects } from "/Users/nocoo/workspace/personal/hexly.ai/src/data/read-projects.ts";
import { filterProjects } from "/Users/nocoo/workspace/personal/hexly.ai/src/model/catalogue.ts";

const repo = "/Users/nocoo/workspace/personal/hexly.ai";
const output = "/tmp/infospace-logo-browser";
const baseURL = "http://127.0.0.1:7048";
const studyPath = "/artwork/logo-family/infospace/2026-09-09-01";
const staticPath = `${studyPath}/review.html`;
const projects = readProjects();
const project = projects.find((item) => item.id === "infospace")!;
assert(project?.family && project.overview);
const family = project.family;
const expectedOrder = filterProjects(projects, "").map((item) => item.id);
const expectedTools = filterProjects(projects, "", "tools").map((item) => item.id);
const orderSnapshot = JSON.parse(await readFile(`${repo}/src/data/project-order.json`, "utf8"));
const rankedSeries = new Set([...orderSnapshot.animals.map((item: { id: string }) => item.id), ...orderSnapshot.templates, ...orderSnapshot.games]);
const hash = (data: Buffer | string) => createHash("sha256").update(data).digest("hex");
const promptBytes = await readFile(`${repo}${studyPath}/prompt.txt`);
const promptText = promptBytes.toString("utf8");
const started = new Date().toISOString();
const checks: any[] = [];
const diagnostics: any[] = [];
const screenshots: string[] = [];
const downloads: any[] = [];
const snapshots = async () => Object.fromEntries(await Promise.all([
  "src/data/projects/infospace.json", "artwork/logo-family/infospace/2026-09-09-01/review.html",
  "artwork/logo-family/review.mjs", "src/components/LogoReview.tsx", "src/components/Palette.tsx", "src/data/project-order.json",
].map(async (file) => [file, hash(await readFile(join(repo, file)))])));
const beforeSnapshots = await snapshots();
await mkdir(`${output}/downloads`, { recursive: true });
await mkdir(`${output}/screenshots`, { recursive: true });
const browser = await chromium.launch({ headless: true });
let siteDownloadsDone = false;
let staticDownloadsDone = false;

async function check(name: string, fn: () => Promise<any>, page?: Page) {
  try {
    const evidence = await fn();
    checks.push({ name, passed: true, evidence });
    console.log(`PASS ${name}`);
    return evidence;
  } catch (error) {
    const detail = error instanceof Error ? error.stack ?? error.message : String(error);
    checks.push({ name, passed: false, error: detail });
    console.log(`FAIL ${name}: ${String(error)}`);
    if (page && !page.isClosed()) {
      const file = `failure-${checks.length}.png`;
      await page.screenshot({ path: `${output}/screenshots/${file}`, fullPage: true, animations: "disabled" }).catch(() => {});
      screenshots.push(file);
    }
    return undefined;
  }
}
function instrument(page: Page, scope: string) {
  page.setDefaultTimeout(8000);
  page.on("pageerror", (error) => diagnostics.push({ scope, kind: "pageerror", message: error.message }));
  page.on("console", (message) => {
    if (message.type() === "error") diagnostics.push({ scope, kind: "console-error", message: message.text() });
  });
  page.on("response", (response) => {
    if (response.status() >= 400) diagnostics.push({ scope, kind: "http-error", status: response.status(), url: response.url() });
  });
  page.on("requestfailed", (request) => diagnostics.push({ scope, kind: "requestfailed", error: request.failure()?.errorText, url: request.url() }));
}
async function screenshot(page: Page, filename: string, locator?: Locator) {
  await expect(page.locator(".toast-visible")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready.then(() => null));
  if (locator) {
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: `${output}/screenshots/${filename}`, animations: "disabled" });
  } else {
    await page.screenshot({ path: `${output}/screenshots/${filename}`, fullPage: true, animations: "disabled" });
  }
  screenshots.push(filename);
}
async function decodeImages(page: Page, selector: string) {
  const images = page.locator(selector);
  const result: any[] = [];
  for (let index = 0; index < await images.count(); index++) {
    const image = images.nth(index);
    if (!(await image.evaluate((element: HTMLImageElement) => element.complete))) await image.scrollIntoViewIfNeeded();
    result.push(await image.evaluate(async (element: HTMLImageElement) => {
      await element.decode();
      if (!element.naturalWidth || !element.naturalHeight) throw new Error(`Image did not decode: ${element.src}`);
      return { src: element.currentSrc, width: element.naturalWidth, height: element.naturalHeight, displayWidth: element.width, displayHeight: element.height };
    }));
  }
  return result;
}
async function smallMarks(page: Page, selector: string) {
  return page.locator(selector).evaluateAll(async (elements) => Promise.all(elements.map(async (element) => {
    const img = element as HTMLImageElement;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext("2d")!;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0, opaque = 0, partial = 0;
    for (let i = 3; i < rgba.length; i += 4) {
      if (rgba[i] === 0) clear++; else if (rgba[i] === 255) opaque++; else partial++;
    }
    const corners = [3, (canvas.width - 1) * 4 + 3, (canvas.height - 1) * canvas.width * 4 + 3, rgba.length - 1].map((index) => rgba[index]);
    const style = getComputedStyle(img);
    return { src: img.currentSrc, width: canvas.width, height: canvas.height, clear, opaque, partial, corners, borderRadius: style.borderRadius, backgroundColor: style.backgroundColor };
  })));
}
function verifySmallMarks(marks: any[]) {
  assert.equal(marks.length, 4);
  assert.deepEqual(marks.map((item) => item.width), [32, 16, 24, 16]);
  for (const mark of marks) {
    assert(mark.clear > 0 && mark.opaque > 0, `Missing transparent/opaque pixels: ${mark.src}`);
    assert.deepEqual(mark.corners, [0, 0, 0, 0], `Opaque rectangular corner: ${mark.src}`);
    assert.equal(mark.borderRadius, "0px");
  }
}
async function noOverflow(page: Page, selectors: string) {
  const result = await page.evaluate((selectors) => ({
    viewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    elementsOutside: [...document.querySelectorAll(selectors)].map((element) => {
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName, class: element.className, left: rect.left, right: rect.right, width: rect.width };
    }).filter((rect) => rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1)),
  }), selectors);
  assert(result.scrollWidth <= result.viewport, JSON.stringify(result));
  assert.deepEqual(result.elementsOutside, [], JSON.stringify(result));
  return result;
}
const downloadSources = [
  `${studyPath}/finishing/01/exports/infospace-transparent-2048.png`,
  `${studyPath}/finishing/01/exports/infospace-icon-2048.png`,
  `${studyPath}/finishing/01/exports/infospace-rounded-2048.png`,
  `${studyPath}/finishing/01/exports/infospace-white-2048.png`,
  `${studyPath}/raw/generated.png`,
  `${studyPath}/prompt.txt`,
];
async function verifyDownloads(page: Page, selector: string, surface: "site" | "static") {
  const links = page.locator(selector);
  await expect(links).toHaveCount(6);
  const result: any[] = [];
  for (let index = 0; index < 6; index++) {
    const link = links.nth(index);
    const href = await link.evaluate((element: HTMLAnchorElement) => element.href);
    const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
    const filename = `${surface}-${index + 1}-${basename(download.suggestedFilename())}`;
    await download.saveAs(`${output}/downloads/${filename}`);
    const received = await readFile(`${output}/downloads/${filename}`);
    const archiveBytes = await readFile(`${repo}${downloadSources[index]}`);
    assert(received.equals(archiveBytes), `Download differs from frozen source: ${href}`);
    const pathname = new URL(href).pathname;
    const servedPath = pathname.startsWith("/logos/") ? `${repo}/public${pathname}` : `${repo}${pathname}`;
    assert(received.equals(await readFile(servedPath)), `Download differs from served file: ${href}`);
    if (index === 0) assert.equal(hash(received), family.foreground.sha256);
    const item = { surface, label: (await link.innerText()).trim(), href, filename, bytes: received.length, sha256: hash(received), archiveSource: downloadSources[index], equalToFrozenSource: true };
    result.push(item); downloads.push(item);
  }
  return result;
}
async function palette(page: Page, surface: "site" | "static") {
  const selector = surface === "site" ? ".palette-swatches button" : "button[data-color]";
  const buttons = page.locator(selector);
  await expect(buttons).toHaveCount(7);
  const result: any[] = [];
  for (let index = 0; index < 7; index++) {
    const color = surface === "site" ? family.palette[index].color : await buttons.nth(index).getAttribute("data-color");
    assert.equal(color?.toLowerCase(), family.palette[index].color.toLowerCase());
    await buttons.nth(index).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(color);
    if (surface === "static") await expect(page.locator("#copy-status")).toHaveText(`Copied ${color}.`);
    result.push({ color, clipboardMatches: true });
  }
  return result;
}

try {
  await check("catalogue: InfoSpace begins tools group", async () => {
    assert.equal(expectedOrder.length, 50);
    assert.equal(expectedOrder.find((id) => !rankedSeries.has(id)), "infospace");
    assert.equal(expectedOrder.indexOf("infospace"), expectedOrder.indexOf("dreamro") + 1);
    assert.equal(expectedOrder.indexOf("signoff-now"), expectedOrder.indexOf("infospace") + 1);
    return { active: expectedOrder.length, total: projects.length, expectedOrder, expectedTools };
  });
  for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 320, height: 740 }]] as const) {
    for (const theme of ["light", "dark"] as const) {
      const scope = `site-${device}-${theme}`;
      const context = await browser.newContext({ baseURL, viewport, colorScheme: theme, locale: "en-US", reducedMotion: "reduce", isMobile: device === "mobile", hasTouch: device === "mobile", deviceScaleFactor: 1, acceptDownloads: true });
      await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
      const page = await context.newPage(); instrument(page, scope);
      try {
        await check(`${scope}: load original and current assets`, async () => {
          const response = await page.goto("/logos/infospace"); assert.equal(response?.status(), 200);
          await expect(page.locator("#identity-title")).toContainText("Info Space");
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          await expect(page.locator(".previous-artwork .previous-tile")).toHaveAttribute("href", family.previous.original);
          await expect(page.locator(".previous-artwork img")).toHaveAttribute("src", `${family.root}/previous-1024.webp`);
          const source = await context.request.get(family.previous.original); assert.equal(source.status(), 200);
          const original = await source.body(); assert.equal(hash(original), family.previous.sha256); assert.equal(hash(original), project.logo.sha256);
          await expect(page.locator(".direction-grid article")).toHaveCount(3);
          await expect(page.locator(".reference-grid, img[src*='/references/']")).toHaveCount(0);
          return { originalBytes: original.length, originalSha256: hash(original), familyStatusAtStart: family.status };
        }, page);
        for (const locale of ["en", "zh"] as const) {
          const prefix = `${scope}-${locale}`;
          await check(`${prefix}: goal, seven badges, README, direction, prompt and clipboard`, async () => {
            if (locale === "zh") await page.getByRole("button", { name: "Switch to Chinese" }).click();
            const region = page.getByRole("region", { name: locale === "en" ? "Project goal" : "项目目标" });
            await expect(region.locator(".project-goal > p")).toHaveText(project.overview!.goal[locale]);
            await expect(region.locator(".tech-badge")).toHaveCount(7);
            await expect(region.locator(".tech-name")).toHaveText(project.overview!.techStack.map((item) => item.name));
            await expect(region.locator(".tech-role")).toHaveText(project.overview!.techStack.map((item) => item.role[locale]));
            await expect(region.locator(".project-readme")).toHaveAttribute("href", `${project.repository}/blob/main/${locale === "en" ? "docs/README.en.md" : "README.md"}`);
            await expect(page.locator(".direction-grid h3")).toHaveText(family.direction.map((item) => item.title[locale]));
            await expect(page.locator(".direction-grid article > p:last-child")).toHaveText(family.direction.map((item) => item.description[locale]));
            const details = page.locator(".identity-archive details");
            if (!(await details.getAttribute("open") !== null)) await details.locator("summary").click();
            await expect.poll(() => page.locator(".generation-prompt").textContent()).toBe(promptText);
            await details.locator("summary").click();
            await expect(page.locator(".identity-archive .download-links a")).toHaveCount(6);
            const copied = await palette(page, "site");
            await screenshot(page, `${prefix}-overview.png`, region);
            return { badges: 7, readmeLocale: locale, exactPromptSha256: hash(promptBytes), copied };
          }, page);
          let baselineSmall: string[] | undefined;
          for (const [index, mode] of ["icon", "transparent", "white"].entries()) {
            await check(`${prefix}-${mode}: presentation, image decoding, alpha and layout`, async () => {
              await page.locator(".view-switch button").nth(index).click();
              await expect(page.locator(".logo-review")).toHaveAttribute("data-presentation", mode);
              await expect(page.locator(".view-switch button").nth(index)).toHaveAttribute("aria-pressed", "true");
              const current = page.locator(".current-artwork .artwork-image");
              await expect(current).toHaveAttribute("src", mode === "icon" ? `${family.root}/icon-1024.webp` : family.foreground.display);
              await expect(page.locator(".current-artwork .review-tile")).toHaveAttribute("href", mode === "transparent" ? family.foreground.original : `${family.root}/${mode}.png`);
              const imageInfo = await decodeImages(page, ".logo-review .comparison-grid img, .size-grid img, .context-grid img, .alpha-grid img");
              const marks = await smallMarks(page, '.size-grid img[width="32"], .size-grid img[width="16"], .context-grid img');
              verifySmallMarks(marks);
              const urls = marks.map((mark) => mark.src);
              for (const url of urls) assert.equal(new URL(url).pathname, family.foreground.display);
              if (baselineSmall) assert.deepEqual(urls, baselineSmall); else baselineSmall = urls;
              const background = await page.locator(".current-artwork .review-tile").evaluate((element) => ({ color: getComputedStyle(element).backgroundColor, image: getComputedStyle(element).backgroundImage }));
              if (mode === "white") assert.equal(background.color, "rgb(255, 255, 255)");
              if (mode === "transparent") assert(background.image.includes("gradient"));
              const overflow = await noOverflow(page, ".comparison-grid, .project-overview, .tech-badge, .direction-grid article, .size-grid figure, .context-grid > div, .alpha-grid figure, .identity-archive .download-links");
              if (locale === (theme === "light" ? "en" : "zh")) {
                await screenshot(page, `${prefix}-${mode}-comparison.png`, page.locator(".comparison-grid"));
                const fullMode = device === "desktop" ? (theme === "light" ? "icon" : "transparent") : (theme === "light" ? "icon" : "white");
                if (mode === fullMode) await screenshot(page, `${prefix}-${mode}-full.png`);
                if (mode === "transparent") {
                  await screenshot(page, `${prefix}-sizes.png`, page.locator(".size-section"));
                  await screenshot(page, `${prefix}-alpha.png`, page.locator(".alpha-section"));
                }
              }
              return { imageInfo, marks, background, overflow, referenceImagesOnSite: 0 };
            }, page);
          }
        }
        if (!siteDownloadsDone) {
          const result = await check(`${scope}: six actual downloads match frozen files`, () => verifyDownloads(page, ".identity-archive .download-links a", "site"), page);
          if (result) siteDownloadsDone = true;
        }
        await check(`${scope}: refresh, preferences, history and first tools placement`, async () => {
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
          assert.deepEqual(await page.locator(".project-card").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-project"))), expectedOrder);
          await page.locator(".category-tabs").getByRole("button", { name: /^开发工具/ }).click();
          await expect(page.locator(".project-card")).toHaveCount(expectedTools.length);
          assert.deepEqual(await page.locator(".project-card").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-project"))), expectedTools);
          await expect(page.locator(".project-card").first()).toHaveAttribute("data-project", expectedTools[0]);
          await screenshot(page, `${scope}-tools-placement.png`, page.locator('[data-project="infospace"]'));
          const directoryURL = page.url();
          await page.locator('[data-project="infospace"] .card-main').click();
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
          return { activeOrderMatches: true, firstProjectAfterRankedSeries: "infospace", toolsFilterFirst: expectedTools[0], directoryURL, galleryURL, refresh: true, history: true, themeAndLocalePersist: true };
        }, page);
      } finally { await context.close(); }
    }
  }

  for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 320, height: 740 }]] as const) {
    for (const theme of ["light", "dark"] as const) {
      const scope = `static-${device}-${theme}`;
      const context = await browser.newContext({ baseURL, viewport, colorScheme: theme, locale: "en-US", reducedMotion: "reduce", isMobile: device === "mobile", hasTouch: device === "mobile", deviceScaleFactor: 1, acceptDownloads: true });
      await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
      const page = await context.newPage(); instrument(page, scope);
      try {
        await check(`${scope}: load, exact prompt, four references and clipboard`, async () => {
          const response = await page.goto(staticPath); assert.equal(response?.status(), 200);
          await expect(page.locator("#study-title")).toContainText("Info Space");
          if (theme === "dark") await page.locator("#theme-switch").click();
          await expect(page.locator("body")).toHaveAttribute("data-theme", theme);
          await expect(page.locator("#theme-switch")).toHaveAttribute("aria-pressed", String(theme === "dark"));
          await expect(page.locator(".original-tile img")).toHaveAttribute("src", project.logo.original);
          await page.getByText("Read the exact generation prompt", { exact: true }).click();
          await expect.poll(() => page.locator("#generation-prompt").textContent()).toBe(promptText);
          await page.getByText("Read the exact generation prompt", { exact: true }).click();
          const references = page.locator("details").filter({ has: page.locator(".reference-grid") });
          await references.locator("summary").click();
          await expect(references.locator("img")).toHaveCount(4);
          const images = await decodeImages(page, ".reference-grid img");
          assert.deepEqual(images.map((item) => new URL(item.src).pathname), [
            `${studyPath}/references/infospace-workspace.png`,
            "/artwork/logo-family/signoff-now/2026-09-07-01/raw/generated.png",
            "/artwork/logo-family/references/ref01.jpeg", "/artwork/logo-family/references/ref02.jpeg",
          ]);
          const referenceOverflow = await noOverflow(page, ".reference-grid, .reference-grid a, .reference-grid img");
          if (device === "desktop" && theme === "light") await screenshot(page, `${scope}-references.png`, references);
          await references.locator("summary").click();
          return { exactPromptSha256: hash(promptBytes), references: images, referenceOverflow, copied: await palette(page, "static") };
        }, page);
        let baselineSmall: string[] | undefined;
        const expectedFavicon = `${studyPath}/finishing/01/exports/infospace-transparent-32.png`;
        for (const mode of ["icon", "transparent", "white"] as const) {
          await check(`${scope}-${mode}: presentation, image decoding, alpha, favicon and layout`, async () => {
            await page.locator(`button[data-view="${mode}"]`).click();
            await expect(page.locator("body")).toHaveAttribute("data-view", mode);
            await expect(page.locator(`button[data-view="${mode}"]`)).toHaveAttribute("aria-pressed", "true");
            const expectedAsset = `./finishing/01/exports/infospace-${mode}-${mode === "white" ? 2048 : 1024}.png`;
            await expect(page.locator("#candidate")).toHaveAttribute("src", expectedAsset);
            assert.equal(new URL(await page.locator("#candidate-link").evaluate((element: HTMLAnchorElement) => element.href)).pathname, `${studyPath}/finishing/01/exports/infospace-${mode}-2048.png`);
            const imageInfo = await decodeImages(page, ".comparison-grid img, .size-grid img, .context-grid img, .alpha-grid img");
            const marks = await smallMarks(page, ".size-grid .foreground-mark, .context-grid .foreground-mark");
            verifySmallMarks(marks);
            const urls = marks.map((mark) => mark.src);
            if (baselineSmall) assert.deepEqual(urls, baselineSmall); else baselineSmall = urls;
            assert.equal(new URL(await page.locator('link[rel="icon"]').evaluate((element: HTMLLinkElement) => element.href)).pathname, expectedFavicon);
            const favicon = await page.evaluate(async (url) => {
              const image = new Image(); image.src = url; await image.decode();
              const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
              const context = canvas.getContext("2d")!; context.drawImage(image, 0, 0);
              const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
              let clear = 0, opaque = 0;
              for (let i = 3; i < rgba.length; i += 4) { if (rgba[i] === 0) clear++; if (rgba[i] === 255) opaque++; }
              return { width: image.naturalWidth, height: image.naturalHeight, clear, opaque };
            }, expectedFavicon);
            assert.equal(favicon.width, 32); assert.equal(favicon.height, 32); assert(favicon.clear > 0 && favicon.opaque > 0);
            const background = await page.locator("#candidate-link").evaluate((element) => ({ color: getComputedStyle(element).backgroundColor, image: getComputedStyle(element).backgroundImage }));
            if (mode === "white") assert.equal(background.color, "rgb(255, 255, 255)");
            if (mode === "transparent") assert(background.image.includes("gradient"));
            const overflow = await noOverflow(page, ".comparison-grid, .direction-grid article, .size-grid figure, .context-grid > div, .alpha-grid figure, .download-links");
            await screenshot(page, `${scope}-${mode}-comparison.png`, page.locator(".comparison-grid"));
            const fullMode = device === "desktop" ? (theme === "light" ? "icon" : "transparent") : (theme === "light" ? "white" : "icon");
            if (mode === fullMode) await screenshot(page, `${scope}-${mode}-full.png`);
            if (mode === "transparent") await screenshot(page, `${scope}-sizes.png`, page.locator(".size-section"));
            return { imageInfo, marks, favicon, background, overflow };
          }, page);
        }
        if (!staticDownloadsDone) {
          const result = await check(`${scope}: six actual downloads match frozen files`, () => verifyDownloads(page, ".archive .download-links a", "static"), page);
          if (result) staticDownloadsDone = true;
        }
        await check(`${scope}: direct refresh remains usable`, async () => {
          await page.reload();
          await expect(page.locator("#study-title")).toContainText("Info Space");
          await expect(page.locator("body")).toHaveAttribute("data-theme", "light");
          await expect(page.locator("body")).toHaveAttribute("data-view", "icon");
          await page.locator("#theme-switch").click();
          await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");
          await page.locator('button[data-view="transparent"]').click();
          await expect(page.locator("body")).toHaveAttribute("data-view", "transparent");
          return { refresh: true, staticDefaults: "light/icon", controlsWorkAfterRefresh: true };
        }, page);
      } finally { await context.close(); }
    }
  }
  await check("both surfaces: all six matching downloads captured", async () => {
    assert(siteDownloadsDone && staticDownloadsDone);
    assert.equal(downloads.length, 12);
    for (let index = 0; index < 6; index++) {
      assert.equal(downloads[index].sha256, downloads[index + 6].sha256);
      assert.equal(downloads[index].bytes, downloads[index + 6].bytes);
    }
    return { downloadPairs: 6, files: 12 };
  });
} finally {
  await browser.close();
  const endSnapshots = await snapshots();
  const significantDiagnostics = diagnostics.filter((item) => item.kind !== "requestfailed" || item.error !== "net::ERR_ABORTED");
  const report = {
    started, finished: new Date().toISOString(), baseURL, headless: true,
    desktopFocusRequested: false, evidenceOnly: true, activeProjects: expectedOrder.length,
    reviewedProject: { id: project.id, family: { status: family.status, root: family.root, foregroundSha256: family.foreground.sha256, previousSha256: family.previous.sha256 }, overviewVerified: project.overview!.verified },
    matrix: { site: "2 viewports × 2 themes × 2 locales × 3 presentations = 24", static: "2 viewports × 2 themes × 3 presentations = 12; English static study" },
    beforeSnapshots, endSnapshots, sourceChangedDuringRun: JSON.stringify(beforeSnapshots) !== JSON.stringify(endSnapshots),
    passed: checks.every((item) => item.passed) && significantDiagnostics.length === 0,
    checks, diagnostics, significantDiagnostics, downloads, screenshots,
  };
  await writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
  const failures = checks.filter((item) => !item.passed);
  const summary = [
    `InfoSpace headless browser review: ${report.passed ? "PASS" : "REQUIRES REVIEW"}.`,
    `\nLocal Vite site ${baseURL}; ${started} to ${report.finished}.`,
    "\nDesktop 1440 × 1000 and mobile 320 × 740; site en/zh and light/dark; all three artwork presentations. Static study uses English and was checked at both widths/themes in all modes.",
    `\n${checks.length - failures.length}/${checks.length} checks passed; ${significantDiagnostics.length} significant browser/network diagnostics. ${downloads.length} actual downloads saved and compared with the exact archived source bytes. ${screenshots.length} screenshots saved.`,
    "\nChecks cover original/current image decoding, 32/16 px specimens and 24/16 px context marks retaining transparent pixels and source URLs as large modes switch, transparent static favicon, all seven palette clipboard values, exact prompt text, four ordered static reference images, absence of reference boards on the site, translated goals/seven badges/README links, horizontal layout, directory order, refresh and browser history.",
    `\nFamily status at start was ${family.status}; this is the expected pending-source-commit state, not a failure. ${report.sourceChangedDuringRun ? "Some watched source files changed during review; see before/end checksums." : "Watched source-file checksums were stable during review."}`,
    "\nNo repository files, frozen finishing files, commits or pushes were changed. Chromium ran headless; no browser was brought to the desktop foreground. Native toolbar behavior is outside this review.",
    failures.length ? `\nFailures:\n${failures.map((item) => `- ${item.name}: ${item.error}`).join("\n")}` : "\nNo failed assertions.",
    significantDiagnostics.length ? `\nDiagnostics:\n${JSON.stringify(significantDiagnostics, null, 2)}` : "\nNo page JavaScript, console or HTTP errors captured.",
    "\nMachine-readable measurements, checksums, evidence names and per-scenario results: report.json. Visual inspection notes will be added after screenshot review.",
  ].join("\n");
  await writeFile(`${output}/report.md`, `${summary}\n`);
  console.log(`COMPLETE ${report.passed ? "PASS" : "REQUIRES REVIEW"}: ${checks.length - failures.length}/${checks.length}; report ${output}/report.json`);
  if (!report.passed) process.exitCode = 1;
}
