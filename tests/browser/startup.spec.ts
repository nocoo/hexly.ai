import { expect, test } from "@playwright/test";

const clientScript = /\/assets\/[^/]+\.js$/;
const stylesheet = /\/assets\/[^/]+\.css$/;

function gate() {
	let release = () => {};
	const wait = new Promise<void>((resolve) => {
		release = resolve;
	});
	return { wait, release };
}

for (const scenario of [
	{
		name: "English directory",
		path: "/",
		locale: "en-US",
		colorScheme: "light",
		view: ".directory-main",
		language: "en",
	},
	{
		name: "Chinese gallery",
		path: "/projects/frogie",
		locale: "zh-CN",
		colorScheme: "dark",
		view: ".gallery-main",
		language: "zh-CN",
	},
] as const) {
	test.describe(scenario.name, () => {
		test.use({ locale: scenario.locale, colorScheme: scenario.colorScheme });
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
				await page.goto(scenario.path, { waitUntil: "commit" });
				await expect(page.locator("#root > main > h1")).toBeAttached();
				await expect(page.locator("#root")).toHaveCSS("visibility", "hidden");
				await expect(page.locator("html")).toHaveAttribute(
					"data-theme",
					scenario.colorScheme,
				);
				await expect(page.locator("html")).toHaveAttribute(
					"lang",
					scenario.language,
				);
				await preload;

				css.release();
				await page.waitForFunction(() =>
					[...document.styleSheets].some((sheet) =>
						sheet.href?.includes("/assets/"),
					),
				);
				await expect(page.locator("#root > main > h1")).toBeAttached();
				await expect(page.locator("#root")).not.toBeVisible();

				script.release();
				await expect(page.locator(".site-header")).toBeAttached();
				await expect(page.locator("#root .empty-state")).toBeAttached();
				await expect(page.locator("#root")).not.toBeVisible();

				data.release();
				await expect(page.locator(scenario.view)).toBeVisible();
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
}

test("offers a working retry when the client script fails", async ({
	page,
}) => {
	await page.route(clientScript, (route) => route.abort());
	await page.goto("/projects/frogie?sort=az", {
		waitUntil: "domcontentloaded",
	});
	await expect(page.locator("#startup-error")).toBeVisible();
	await expect(page.locator("#root")).not.toBeVisible();
	await page.unroute(clientScript);
	await page.getByRole("button", { name: "Reload the page" }).click();
	await expect(page.locator("#identity-title")).toContainText("Frogie");
	await expect(page.locator(".gallery-main")).toBeVisible();
	await expect(page).toHaveURL(/\/projects\/frogie\?sort=az$/);
	await expect(page.locator("#startup-error")).not.toBeVisible();
});

test("keeps a readable retry prompt when CSS fails even if React finishes", async ({
	page,
}) => {
	await page.route(stylesheet, (route) => route.abort());
	await page.goto("/", { waitUntil: "domcontentloaded" });
	await expect(page.locator(".directory-main")).toBeAttached();
	await expect(page.locator("#root")).not.toBeVisible();
	await expect(page.locator("#startup-error")).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Reload the page" }),
	).toBeVisible();
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
});

test("shows a retry prompt if React cannot mount", async ({ page }) => {
	await page.addInitScript(() => {
		const matchMedia = window.matchMedia.bind(window);
		window.matchMedia = (query) => {
			if (document.getElementById("root")) {
				throw new Error("Simulated application startup failure");
			}
			return matchMedia(query);
		};
	});
	await page.goto("/", { waitUntil: "domcontentloaded" });
	await expect(page.locator("#startup-error")).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Reload the page" }),
	).toBeVisible();
});

test("recovers when a stalled client finishes after the retry prompt appears", async ({
	page,
}) => {
	await page.clock.install();
	const script = gate();
	await page.route(clientScript, async (route) => {
		await script.wait;
		await route.continue();
	});
	try {
		await page.goto("/", { waitUntil: "commit" });
		await expect(page.locator("#root > main > h1")).toBeAttached();
		await expect(page.locator("#startup-error")).not.toBeVisible();
		await page.clock.fastForward(15000);
		await expect(page.locator("#startup-error")).toBeVisible();
		script.release();
		await expect(page.locator(".directory-main")).toBeVisible();
		await expect(page.locator("#startup-error")).not.toBeVisible();
	} finally {
		script.release();
		await page.unrouteAll({ behavior: "wait" });
	}
});

test("displays content without waiting for images and fonts", async ({
	page,
}) => {
	await page.clock.install();
	const media = gate();
	await page.route("**/*", async (route) => {
		if (["image", "font"].includes(route.request().resourceType())) {
			await media.wait;
		}
		await route.continue();
	});
	try {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.locator(".directory-main")).toBeVisible();
		await expect(page.locator("#hero-title")).toBeVisible();
		expect(await page.evaluate(() => document.fonts.status)).toBe("loading");
		expect(
			await page
				.locator(".hero img")
				.first()
				.evaluate((image) => {
					return (image as HTMLImageElement).complete;
				}),
		).toBe(false);
		await page.clock.fastForward(15000);
		await expect(page.locator("#startup-error")).not.toBeVisible();
	} finally {
		media.release();
		await page.unrouteAll({ behavior: "wait" });
	}
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });
	test("keeps the static project list readable", async ({ page }) => {
		await page.goto("/");
		await expect(
			page.getByRole("heading", { name: "Small ideas A little universe." }),
		).toBeVisible();
		await expect(
			page.locator("#root").getByRole("link", { name: "Frogie", exact: true }),
		).toBeVisible();
		await expect(page.locator("#startup-error")).not.toBeVisible();
	});
});
