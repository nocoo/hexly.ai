import { readFile } from "node:fs/promises";
import snail from "../../docs/sources/snail-retired-2026-09-13.json" with {
	type: "json",
};
import { digest, readInventory } from "../../scripts/asset-storage";
import { scanAccessibility } from "./accessibility";
import { expect, test, touch } from "./fixtures";

if (!snail?.brandKit || !snail.family)
	throw new Error("Missing Snail animal kit");
const kit = snail.brandKit;
test.use(touch);

test("the standalone Snail study keeps full compositions, transparent small marks and traceable downloads", async ({
	page,
	context,
	request,
	isMobile,
}) => {
	if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	const html = readInventory().files.find(
		(file) => file.path === `${kit.root}/review.html`,
	);
	const icon = readInventory().files.find(
		(file) => file.path === `${kit.root}/favicon.ico`,
	);
	if (!html || !icon) throw new Error("Missing Snail archive fixture");
	expect(
		digest(await (await request.get(`${kit.root}/review.html`)).body()),
	).toBe(html.sha256);
	await page.goto(`${kit.root}/review.html`);
	await expect(
		page.locator('script[src="/material-downloads.js"]'),
	).toHaveCount(1);
	await page
		.locator(".hero img")
		.first()
		.evaluate((image: HTMLImageElement) => image.decode());
	expect((await scanAccessibility(page)).violations).toEqual([]);
	await page.getByRole("button", { name: /Terracotta #bf5c3c/ }).click();
	await expect(page.locator("#copy-status")).toHaveText("Copied #bf5c3c");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"#bf5c3c",
	);
	await page
		.getByText("Read the exact icon generation prompt", { exact: true })
		.click();
	await expect(
		page.locator('pre[data-source="./prompt-icon.txt"]'),
	).toContainText("snail");
	await page
		.getByText("View the family references and candidate record", {
			exact: true,
		})
		.click();
	for (const image of await page.locator(".references img").all())
		await image.evaluate((node: HTMLImageElement) => node.decode());
	const download = page.waitForEvent("download");
	await page.getByRole("link", { name: "Favicon ICO ↗", exact: true }).click();
	const downloaded = await download;
	expect(downloaded.suggestedFilename()).toBe("favicon.ico");
	const file = await downloaded.path();
	if (!file) throw new Error("Missing downloaded Snail favicon");
	expect(digest(await readFile(file))).toBe(icon.sha256);
	expect(errors).toEqual([]);
});
