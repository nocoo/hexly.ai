import { desktop, expect, test } from "./fixtures";

const clientScript = /\/assets\/[^/]+\.js$/;
const stylesheet = /\/assets\/[^/]+\.css$/;

function gate() {
	let release = () => {};
	const wait = new Promise<void>((resolve) => {
		release = resolve;
	});
	return { wait, release };
}

test.describe("English directory startup", () => {
	test.use({
		...desktop,
		locale: "en-US",
		colorScheme: "light",
	});

	test("reveals the complete view without showing its snapshot or loading state", async ({
		page,
	}) => {
		const css = gate();
		const script = gate();
		const data = gate();
		let catalogueRequests = 0;
		page.on("request", (request) => {
			if (request.url().endsWith("/data/projects.json")) catalogueRequests++;
		});
		await page.route(stylesheet, async (route) => {
			await css.wait;
			await route.continue();
		});
		await page.route(clientScript, async (route) => {
			await script.wait;
			await route.continue();
		});
		await page.route("**/data/projects.json", async (route) => {
			await data.wait;
			await route.continue();
		});
		try {
			const preload = page.waitForRequest("**/data/projects.json");
			await page.goto("/", { waitUntil: "commit" });
			await expect(page.locator("#root > main > h1")).toBeAttached();
			await expect(page.locator("#root")).toHaveCSS("visibility", "hidden");
			await preload;

			css.release();
			await page.waitForFunction(() =>
				[...document.styleSheets].some((sheet) =>
					sheet.href?.includes("/assets/"),
				),
			);

			script.release();
			await expect(page.locator(".site-header")).toBeAttached();

			data.release();
			await expect(page.locator(".directory-main")).toBeVisible();
			await expect(page.locator("#root .empty-state")).toHaveCount(0);
			await expect(page.locator("#startup-error")).not.toBeVisible();
			expect(catalogueRequests).toBe(1);
		} finally {
			css.release();
			script.release();
			data.release();
			await page.unrouteAll({ behavior: "wait" });
		}
	});
});

test("offers a working retry when the client script fails", async ({
	page,
}) => {
	await page.route(clientScript, (route) => route.abort());
	await page.goto("/projects/pew?sort=az", {
		waitUntil: "domcontentloaded",
	});
	await expect(page.locator("#startup-error")).toBeVisible();
	await expect(page.locator("#root")).not.toBeVisible();
	await page.unroute(clientScript);
	await page.getByRole("button", { name: "Reload the page" }).click();
	await expect(page.locator("#identity-title")).toContainText("Pew");
	await expect(page.locator(".gallery-main")).toBeVisible();
	await expect(page).toHaveURL(/\/projects\/pew\?sort=az$/);
	await expect(page.locator("#startup-error")).not.toBeVisible();
});

test("shows the catalogue error with a retry instead of an empty page", async ({
	page,
}) => {
	await page.route("**/data/projects.json", (route) =>
		route.fulfill({ status: 503, contentType: "application/json", body: "{}" }),
	);
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: "The collection could not be loaded." }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Reload the page" }),
	).toBeVisible();
	await expect(page.locator("#startup-error")).not.toBeVisible();

	await page.unroute("**/data/projects.json");
	await page.getByRole("button", { name: "Reload the page" }).click();
	await expect(page.locator(".directory-main")).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "The collection could not be loaded." }),
	).toHaveCount(0);
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });
	test("keeps the static project list readable", async ({ page }) => {
		await page.goto("/");
		await expect(
			page.getByRole("heading", { name: "Small ideas A little universe." }),
		).toBeVisible();
		await expect(
			page.locator("#root").getByRole("link", { name: "Pew", exact: true }),
		).toBeVisible();
		await expect(page.locator("#startup-error")).not.toBeVisible();
	});
});
