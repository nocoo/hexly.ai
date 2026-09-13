import { readFile } from "node:fs/promises";
import { digest, readInventory } from "../../scripts/asset-storage";
import { expect, test } from "./fixtures";

test("downloads a CDN favicon with its original filename and exact bytes", async ({
	page,
}) => {
	await page.goto("/projects/snail");
	const path = "/brands/snail/v2.0.0/favicon.ico";
	const asset = readInventory().files.find((file) => file.path === path);
	if (!asset) throw new Error("Missing favicon fixture");
	const link = page.locator('.brand-kit a[href$="/favicon.ico"]');
	await expect(link).toHaveAttribute("href", `https://h.no.mt${path}`);
	const pending = page.waitForEvent("download");
	await link.click();
	const download = await pending;
	expect(download.suggestedFilename()).toBe("favicon.ico");
	const file = await download.path();
	if (!file) throw new Error("No downloaded file");
	expect(digest(await readFile(file))).toBe(asset.sha256);
});
