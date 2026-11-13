import sharp from "sharp";
import { expect, test } from "./fixtures";

const pages = [
	["projects", "/"],
	["templates", "/templates"],
	["brand", "/brand"],
	["status", "/status"],
] as const;

for (const [width, theme] of [
	[1440, "light"],
	[1440, "dark"],
	[390, "light"],
	[320, "dark"],
] as const) {
	test(`renders genuine 3D objects without the retired artwork at ${width}px ${theme}`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.addInitScript((theme) => {
			localStorage.setItem("hexly:locale", "en");
			localStorage.setItem("hexly:theme", theme);
		}, theme);
		const retired: string[] = [];
		page.on("request", (request) => {
			if (
				request.url().includes("/headers/") &&
				/\.(webp|png)/.test(request.url())
			)
				retired.push(request.url());
		});
		for (const [kind, path] of pages) {
			await page.goto(path);
			const object = page.locator(`[data-hero-object="${kind}"]`);
			await object.scrollIntoViewIfNeeded();
			await expect(object.locator(".hero-object-stage")).toHaveAttribute(
				"data-renderer",
				"webgl",
			);
			await expect(object).toHaveAttribute("data-motion", "reduced");
			await expect(object.locator("canvas")).toHaveCount(1);
			await expect(page.locator(".hero-artwork")).toHaveCount(0);
			const stats = await sharp(await object.screenshot()).stats();
			expect(
				Math.max(...stats.channels.slice(0, 3).map((channel) => channel.stdev)),
			).toBeGreaterThan(8);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
			if (kind === "projects") {
				await expect(page.locator(".floating-logo")).toHaveCount(6);
				await page.locator(".floating-logo").first().click();
				await expect(page).toHaveURL(/\/projects\//);
			}
		}
		expect(retired).toEqual([]);
	});
}

test("supports gentle motion, a real pause control, reduced motion and offscreen suspension", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.goto("/templates");
	const object = page.locator('[data-hero-object="templates"]');
	await object.scrollIntoViewIfNeeded();
	await expect(object.locator(".hero-object-stage")).toHaveAttribute(
		"data-renderer",
		"webgl",
	);
	await expect(object).toHaveAttribute("data-motion", "running");
	const canvas = object.locator("canvas");
	const first = await sharp(await canvas.screenshot())
		.raw()
		.toBuffer();
	await expect
		.poll(async () =>
			first.equals(
				await sharp(await canvas.screenshot())
					.raw()
					.toBuffer(),
			),
		)
		.toBe(false);
	await object.getByRole("button", { name: "Pause 3D motion" }).click();
	await expect(object).toHaveAttribute("data-motion", "paused");
	const paused = await sharp(await canvas.screenshot())
		.raw()
		.toBuffer();
	await page.waitForTimeout(150);
	expect(
		paused.equals(
			await sharp(await canvas.screenshot())
				.raw()
				.toBuffer(),
		),
	).toBe(true);
	await object.getByRole("button", { name: "Resume 3D motion" }).click();
	await expect(object).toHaveAttribute("data-motion", "running");
	await page.evaluate(() =>
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: "instant",
		}),
	);
	await expect(object).toHaveAttribute("data-motion", "paused");
	await object.scrollIntoViewIfNeeded();
	await expect(object).toHaveAttribute("data-motion", "running");
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(object).toHaveAttribute("data-motion", "reduced");
	await expect(object.getByRole("button")).toHaveCount(0);
});

test("renders the same procedural object as a static SVG when WebGL is unavailable", async ({
	page,
}) => {
	await page.addInitScript(() => {
		const getContext = HTMLCanvasElement.prototype.getContext;
		Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
			value(context: string, ...args: unknown[]) {
				if (context === "webgl2") return null;
				return Reflect.apply(getContext, this, [context, ...args]);
			},
		});
	});
	await page.goto("/brand");
	const object = page.locator('[data-hero-object="brand"]');
	await object.scrollIntoViewIfNeeded();
	await expect(object.locator(".hero-object-stage")).toHaveAttribute(
		"data-renderer",
		"svg",
	);
	await expect(object).toHaveAttribute("data-motion", "static");
	await expect(object.locator("canvas")).toHaveCount(0);
	expect(await object.locator("svg path").count()).toBeGreaterThan(50);
	await expect(object.getByRole("button")).toHaveCount(0);
});

test("handles context loss without breaking the page and releases a departing scene", async ({
	page,
}) => {
	await page.goto("/templates");
	const scene = page.locator('[data-hero-object="templates"]');
	await expect(scene.locator(".hero-object-stage")).toHaveAttribute(
		"data-renderer",
		"webgl",
	);
	const old = await scene.locator("canvas").elementHandle();
	if (!old) throw new Error("Missing WebGL canvas");
	await page
		.getByRole("navigation", { name: "Main navigation" })
		.getByRole("button", { name: "Brand", exact: true })
		.click();
	await expect(
		page.locator('[data-hero-object="brand"] .hero-object-stage'),
	).toHaveAttribute("data-renderer", "webgl");
	expect(await old.evaluate((node) => node.isConnected)).toBe(false);
	await expect
		.poll(() =>
			old.evaluate((node: HTMLCanvasElement) =>
				node.getContext("webgl2")?.isContextLost(),
			),
		)
		.toBe(true);
	await old.dispose();
	await page
		.locator('[data-hero-object="brand"] canvas')
		.evaluate((node: HTMLCanvasElement) => {
			const extension = node
				.getContext("webgl2")
				?.getExtension("WEBGL_lose_context");
			if (!extension) throw new Error("Missing WebGL context-loss extension");
			extension.loseContext();
		});
	await expect(
		page.locator('[data-hero-object="brand"] .hero-object-stage'),
	).toHaveAttribute("data-renderer", "svg");
	await expect(page.locator('[data-hero-object="brand"]')).toHaveAttribute(
		"data-motion",
		"static",
	);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Brand.");
});
