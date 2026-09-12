import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";
import { type StatusSnapshot, statusTargets } from "../../src/model/status";

const targets = statusTargets(readProjects());

test.beforeEach(async ({ page, request }) => {
	const snapshot: StatusSnapshot = await (
		await request.get("/api/status")
	).json();
	const sampledAt = Math.max(
		...snapshot.services.map((service) => service.latest?.checkedAt ?? 0),
	);
	expect(sampledAt).toBeGreaterThan(0);
	// Demo D1 is seeded once; slow CI must not age the fixture into a different state.
	await page.clock.setFixedTime(sampledAt + 10_000);
});

test("navigates to status, filters services, and inspects hourly history and the latest check", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Status", exact: true }).click();
	await expect(page).toHaveURL(/\/status$/);
	await expect(page).toHaveTitle("Service status — hexly.ai");
	await expect(page.locator(".status-demo")).toBeVisible();
	await expect(page.locator(".status-service")).toHaveCount(targets.length);
	await page.getByRole("button", { name: /Needs attention/ }).click();
	await expect(page.locator(".status-service")).toHaveCount(5);
	await page.getByRole("button", { name: /All services/ }).click();
	await page.keyboard.press("/");
	const search = page.getByRole("searchbox");
	await expect(search).toBeFocused();
	await search.fill("backy");
	await expect(page.locator(".status-service")).toHaveCount(1);
	const service = page.locator('[data-service="backy"]');
	await service.getByRole("button", { name: /Backy: Operational/ }).click();
	await expect(
		service.getByRole("link", { name: /https:\/\/backy.hexly.ai\/api\/live/ }),
	).toBeVisible();
	await expect(service.getByText("HTTP 200")).toBeVisible();
	await page.getByRole("button", { name: "24 hours", exact: true }).click();
	await expect(service.locator(".status-bar")).toHaveCount(24);
	const history = service.getByRole("slider");
	await history.focus();
	await history.press("ArrowLeft");
	await expect(service.getByRole("tooltip")).toContainText("checks passed");
	await expect(history).toHaveAttribute("aria-valuetext", /GMT/);
	await search.fill("no-such-service");
	await expect(page.getByText("No services match this view.")).toBeVisible();
	await page.getByRole("button", { name: "Clear filters" }).click();
	await expect(page.locator(".status-service")).toHaveCount(targets.length);
	const refreshed = page.waitForResponse((response) =>
		response.url().endsWith("/api/status"),
	);
	await page
		.getByRole("button", { name: "Refresh status", exact: true })
		.click();
	expect((await refreshed).status()).toBe(200);
	await page.reload();
	await expect(page.locator("#status-title")).toHaveText("Service status.");
});

test.describe("status display time zones", () => {
	test.use({ timezoneId: "Asia/Shanghai" });

	test("defaults to local time, converts every date, and preserves UTC history and preferences", async ({
		page,
		request,
	}) => {
		const checkedAt = Date.parse("2026-09-11T20:50:00Z");
		await page.clock.setFixedTime(checkedAt);
		const snapshot: StatusSnapshot = await (
			await request.get("/api/status")
		).json();
		await page.route("**/api/status", (route) =>
			route.fulfill({
				json: {
					...snapshot,
					services: snapshot.services.map((service) => ({
						...service,
						latest: service.latest ? { ...service.latest, checkedAt } : null,
					})),
				},
			}),
		);
		await page.goto("/status");
		const zone = page.getByRole("combobox", { name: "Time zone" });
		await expect(zone).toHaveValue("local");
		await expect(zone.locator("option:checked")).toContainText("Asia/Shanghai");
		const updated = page.locator(".status-update time");
		await expect(updated).toContainText("04:50 GMT+8");
		await expect(updated).toHaveText(/^12 Sep/);
		await expect(updated).toHaveAttribute(
			"datetime",
			"2026-09-11T20:50:00.000Z",
		);
		const axis = page.locator(".status-timeline-labels > span").first();
		await expect(axis).toHaveText(/^5 Sep/);
		const metrics = await page.locator(".status-metrics").innerText();
		const bars = await page
			.locator(".status-bar")
			.evaluateAll((elements) => elements.map((element) => element.className));
		const service = page.locator('[data-service="backy"]');
		await service.getByRole("button", { name: /Backy: Operational/ }).click();
		await expect(service.locator(".status-service-detail time")).toContainText(
			"04:50 GMT+8",
		);
		await service.getByRole("slider").focus();
		await expect(service.getByRole("tooltip")).toContainText("04:00 GMT+8");
		await zone.selectOption("UTC");
		await expect(updated).toContainText("20:50 GMT");
		await expect(updated).toHaveText(/^11 Sep/);
		await expect(axis).toHaveText(/^4 Sep/);
		await expect(service.locator(".status-service-detail time")).toContainText(
			"20:50 GMT",
		);
		await expect(page.locator(".status-metrics")).toHaveText(metrics, {
			useInnerText: true,
		});
		expect(
			await page
				.locator(".status-bar")
				.evaluateAll((elements) =>
					elements.map((element) => element.className),
				),
		).toEqual(bars);
		await service.getByRole("slider").focus();
		await expect(service.getByRole("tooltip")).toContainText("20:00 GMT");
		await page.reload();
		await expect(zone).toHaveValue("UTC");
		await expect(updated).toContainText("20:50 GMT");
		await zone.selectOption("Asia/Tokyo");
		await expect(updated).toContainText("05:50 GMT+9");
		await zone.selectOption("local");
		await expect(updated).toContainText("04:50 GMT+8");
	});
});

test("does not present an empty or stale feed as healthy", async ({
	page,
	request,
}) => {
	const snapshot = await (await request.get("/api/status")).json();
	await page.route("**/api/status", (route) =>
		route.fulfill({ json: { ...snapshot, services: [] } }),
	);
	await page.goto("/status");
	await expect(
		page.getByRole("heading", { name: "Waiting for the first signal" }),
	).toBeVisible();
	await expect(page.locator(".status-bar.status-operational")).toHaveCount(0);
	await page.unroute("**/api/status");
	const now = await page.evaluate(() => Date.now());
	await page.route("**/api/status", (route) =>
		route.fulfill({
			json: {
				...snapshot,
				services: snapshot.services.map(
					(service: { latest: object | null }) => ({
						...service,
						latest: service.latest
							? { ...service.latest, checkedAt: now - 900_000 }
							: null,
					}),
				),
			},
		}),
	);
	await page
		.getByRole("button", { name: "Refresh status", exact: true })
		.click();
	await expect(
		page.getByRole("heading", { name: "Waiting for fresh status data" }),
	).toBeVisible();
	await expect(
		page.locator(".status-service-state.status-operational"),
	).toHaveCount(0);
});

test("reports feed failure and recovers when the user refreshes", async ({
	page,
}) => {
	await page.route("**/api/status", (route) =>
		route.fulfill({ status: 503, json: { error: "unavailable" } }),
	);
	await page.goto("/status");
	await expect(
		page.getByRole("heading", { name: "Status updates are unavailable" }),
	).toBeVisible();
	await page.unroute("**/api/status");
	await page
		.getByRole("button", { name: "Refresh status", exact: true })
		.click();
	await expect(page.locator(".status-demo")).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Some checks need attention" }),
	).toBeVisible();
});
