import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { readProjects } from "../../src/data/read-projects";
import { assetUrl } from "../../src/model/assets";
import { desktop, expect, test, touch } from "./fixtures";

for (const [colorScheme, options, id] of [
	["light", desktop, "frogie"],
	["dark", touch, "coffee"],
] as const) {
	test.describe(`textured icons / ${colorScheme}`, () => {
		test.use(options);
		test(`${id} uses the same composed icon in navigation, review and downloads`, async ({
			page,
		}) => {
			const project = readProjects().find((p) => p.id === id);
			if (!project?.presentationIcon) throw new Error(id);
			const root = project.presentationIcon.root;
			await page.emulateMedia({ colorScheme });
			await page.goto(`/projects/${id}`);
			const heading = page.locator(".identity-heading .logo-composed img");
			await expect(heading).toHaveAttribute(
				"src",
				assetUrl(`${root}/rounded-160.webp`),
			);
			await expect(heading).toHaveJSProperty("naturalWidth", 160);
			await expect(heading).toHaveCSS("border-radius", "0px");
			await expect(heading).toHaveCSS("filter", "none");
			const artwork = page.locator(".current-artwork .artwork-image");
			await artwork.scrollIntoViewIfNeeded();
			await expect(artwork).toHaveAttribute(
				"src",
				assetUrl(`${root}/rounded-1024.webp`),
			);
			await expect(artwork.locator("..")).toHaveCSS("border-radius", "0px");
			const downloadLink = page
				.locator(".identity-archive")
				.getByRole("link", { name: "Rounded icon" });
			const downloading = page.waitForEvent("download");
			await downloadLink.click();
			const download = await downloading;
			const path = await download.path();
			if (!path) throw new Error("Download missing");
			const digest = (bytes: Uint8Array) =>
				createHash("sha256").update(bytes).digest("hex");
			expect(digest(await readFile(path))).toBe(
				digest(await readFile(`public${root}/rounded.png`)),
			);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		});
	});
}
