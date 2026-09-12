import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { navigationPath, parseNavigation } from "../../src/model/navigation";
import {
	CHECK_INTERVAL,
	type CheckResult,
	currentStatus,
	HOUR,
	healthEndpoint,
	historySlots,
	hourStatus,
	parseStatusSnapshot,
	RETENTION,
	type StatusHour,
	type StatusSnapshot,
	sampleTotals,
	statusTargets,
} from "../../src/model/status";

const now = Date.UTC(2026, 8, 11, 12);
const check: CheckResult = {
	id: "backy",
	endpoint: "https://backy.hexly.ai/api/live",
	checkedAt: now,
	slot: now,
	status: "operational",
	httpStatus: 200,
	latencyMs: 120,
	error: null,
	version: "1.0.0",
};
const hour: StatusHour = {
	hour: now,
	total: 12,
	passed: 12,
	degraded: 0,
	down: 0,
	unconfigured: 0,
	latencyMs: 120,
};
const snapshot: StatusSnapshot = {
	mode: "live",
	generatedAt: now,
	windowStart: now - RETENTION,
	intervalSeconds: 300,
	retentionDays: 7,
	services: [
		{ id: check.id, endpoint: check.endpoint, latest: check, history: [hour] },
	],
};

describe("status coverage and navigation", () => {
	it("includes the three deployed Hexly sites at their exact health paths", () => {
		const targets = statusTargets(readProjects());
		for (const id of ["gecko", "neo", "wooly"]) {
			expect(targets.filter((target) => target.id === id)).toEqual([
				{ id, endpoint: `https://${id}.hexly.ai/api/live` },
			]);
		}
		const wooly = targets.find((target) => target.id === "wooly");
		expect(wooly?.endpoint).toBe("https://wooly.hexly.ai/api/live");
		expect(wooly?.endpoint).not.toContain("/login");
	});
	it.each([
		null,
		"",
		"invalid",
		"http://example.com",
		"https://user:password@example.com",
		"https://chromewebstore.google.com/detail/example",
		"https://www.npmjs.com/package/unseal",
	])("excludes unsupported website %s", (website) => {
		expect(healthEndpoint({ website, archived: false })).toBeNull();
	});
	it("uses only active independent website origins", () => {
		expect(
			healthEndpoint({
				website: "https://example.com/path?q=value#fragment",
				archived: false,
			}),
		).toBe("https://example.com/api/live");
		expect(
			healthEndpoint({ website: "https://example.com", archived: true }),
		).toBeNull();
		const projects = readProjects();
		const targets = statusTargets(projects);
		expect(targets).toContainEqual({
			id: "backy",
			endpoint: "https://backy.hexly.ai/api/live",
		});
		expect(
			targets.some((target) =>
				["hooky", "unseal", "uptime-kuma-skill"].includes(target.id),
			),
		).toBe(false);
		const state = parseNavigation("/status/", "?q=backy", projects);
		expect(state.view).toBe("status");
		expect(navigationPath(state)).toBe("/status?q=backy");
	});
});

describe("honest history", () => {
	it("expires a current status after two missed sampling intervals", () => {
		expect(currentStatus(null, now)).toBe("unknown");
		expect(currentStatus(check, now + 2 * CHECK_INTERVAL)).toBe("operational");
		expect(currentStatus(check, now + 2 * CHECK_INTERVAL + 1)).toBe("unknown");
	});
	it("distinguishes missing, complete, and mixed hourly observations", () => {
		expect(hourStatus(null)).toBe("unknown");
		expect(hourStatus({ ...hour, total: 0 })).toBe("unknown");
		expect(hourStatus(hour)).toBe("operational");
		expect(hourStatus({ ...hour, passed: 0, down: 12 })).toBe("down");
		expect(hourStatus({ ...hour, passed: 0, unconfigured: 12 })).toBe(
			"unconfigured",
		);
		expect(hourStatus({ ...hour, passed: 11, down: 1 })).toBe("degraded");
		const slots = historySlots([hour], now + HOUR, 24);
		expect(slots).toHaveLength(24);
		expect(slots[22]?.data).toEqual(hour);
		expect(slots[23]).toEqual({ time: now + HOUR, data: null });
		expect(sampleTotals([])).toEqual({ total: 0, passed: 0, percentage: null });
		expect(sampleTotals([hour, { ...hour, passed: 0, down: 12 }])).toEqual({
			total: 24,
			passed: 12,
			percentage: 50,
		});
	});
	it("accepts a valid snapshot and an explicitly empty service", () => {
		expect(parseStatusSnapshot(snapshot)).toEqual(snapshot);
		expect(
			parseStatusSnapshot({
				...snapshot,
				mode: "demo",
				services: [{ ...snapshot.services[0], latest: null, history: [] }],
			}).mode,
		).toBe("demo");
	});
	it.each([
		null,
		{},
		{ ...snapshot, mode: "other" },
		{ ...snapshot, generatedAt: NaN },
		{ ...snapshot, windowStart: Infinity },
		{ ...snapshot, intervalSeconds: 60 },
		{ ...snapshot, retentionDays: 30 },
		{ ...snapshot, services: {} },
		...[
			null,
			{},
			{ id: 1 },
			{ id: "backy", endpoint: 3 },
			{ id: "backy", endpoint: check.endpoint, history: null },
			{ ...snapshot.services[0], latest: undefined },
			{ ...snapshot.services[0], latest: { ...check, checkedAt: "bad" } },
			{ ...snapshot.services[0], latest: { ...check, status: "good" } },
			{ ...snapshot.services[0], history: [null] },
			{ ...snapshot.services[0], history: [{ ...hour, total: "bad" }] },
		].map((service) => ({ ...snapshot, services: [service] })),
	])("rejects a malformed feed without presenting it as healthy", (value) => {
		expect(() => parseStatusSnapshot(value)).toThrow("Invalid status response");
	});
});
