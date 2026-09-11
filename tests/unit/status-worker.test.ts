import { readFileSync } from "node:fs";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { getPlatformProxy, type PlatformProxy } from "wrangler";
import {
	CHECK_INTERVAL,
	type CheckResult,
	HOUR,
	RETENTION,
} from "../../src/model/status";
import {
	checkEndpoint,
	checkTargets,
	readStatus,
	runStatusChecks,
	statusResponse,
	storeChecks,
} from "../../worker/status";

const target = {
	id: "test-service",
	endpoint: "https://example.invalid/api/live",
};
const healthy = () =>
	Response.json({ status: "ok", name: "test-service", version: "1.2.3" });

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("public endpoint probes", () => {
	it("requires JSON health and bounds public version data", async () => {
		const fetcher = vi.fn(async () => healthy());
		expect(await checkEndpoint(target, 0, fetcher)).toMatchObject({
			...target,
			slot: 0,
			status: "operational",
			version: "1.2.3",
			httpStatus: 200,
			error: null,
		});
		expect(fetcher).toHaveBeenCalledWith(
			target.endpoint,
			expect.objectContaining({
				redirect: "manual",
				cache: "no-store",
				signal: expect.any(AbortSignal),
			}),
		);
		expect(
			(
				await checkEndpoint(target, 0, async () =>
					Response.json({ status: "healthy", version: "x".repeat(100) }),
				)
			).version,
		).toHaveLength(64);
	});
	it.each([
		[
			() =>
				new Response("<html>SPA fallback</html>", {
					headers: { "content-type": "text/html" },
				}),
			"unconfigured",
			"invalid_json",
		],
		[
			() =>
				new Response("{", { headers: { "content-type": "application/json" } }),
			"unconfigured",
			"invalid_json",
		],
		[
			() => Response.json({ name: "missing status" }),
			"unconfigured",
			"invalid_health",
		],
		[
			() => Response.json({ status: "surprise" }),
			"unconfigured",
			"invalid_health",
		],
		[
			() => Response.json({ status: "degraded" }),
			"degraded",
			"reported_degraded",
		],
		[() => Response.json({ status: "down" }), "down", "reported_down"],
		[() => new Response(null, { status: 302 }), "unconfigured", "redirect"],
		[() => new Response(null, { status: 404 }), "unconfigured", "not_found"],
		[() => new Response(null, { status: 401 }), "unconfigured", "http_error"],
		[() => new Response(null, { status: 403 }), "unconfigured", "http_error"],
		[() => new Response(null, { status: 429 }), "degraded", "http_error"],
		[() => new Response(null, { status: 503 }), "down", "http_error"],
		[
			() =>
				new Response("x".repeat(65_537), {
					headers: { "content-type": "application/json" },
				}),
			"unconfigured",
			"body_too_large",
		],
	] as const)(
		"classifies failed or non-health responses without fake uptime",
		async (response, status, error) => {
			const fetcher = vi.fn(async () => response());
			expect(await checkEndpoint(target, 0, fetcher)).toMatchObject({
				status,
				error,
			});
			expect(fetcher).toHaveBeenCalledTimes(
				status === "down" || (await response()).status === 429 ? 2 : 1,
			);
		},
	);
	it("retries connection failures and timeouts once, without leaking raw errors", async () => {
		for (const name of ["Error", "TimeoutError", "AbortError"]) {
			const error = new Error("private upstream information");
			error.name = name;
			const fetcher = vi.fn(async () => {
				throw error;
			});
			const result = await checkEndpoint(target, 0, fetcher);
			expect(result).toMatchObject({
				status: "down",
				error: name === "Error" ? "network" : "timeout",
				httpStatus: null,
				latencyMs: null,
			});
			expect(fetcher).toHaveBeenCalledTimes(2);
			expect(JSON.stringify(result)).not.toContain(error.message);
		}
		const recovery = vi
			.fn()
			.mockResolvedValueOnce(new Response(null, { status: 503 }))
			.mockResolvedValueOnce(healthy());
		expect((await checkEndpoint(target, 0, recovery)).status).toBe(
			"operational",
		);
	});
	it("caps concurrency at six and records one result per target", async () => {
		let active = 0;
		let maximum = 0;
		const fetcher = async () => {
			maximum = Math.max(maximum, ++active);
			await new Promise((resolve) => setTimeout(resolve, 5));
			active--;
			return healthy();
		};
		const targets = Array.from({ length: 20 }, (_, index) => ({
			...target,
			id: String(index),
		}));
		const results = await checkTargets(targets, 0, fetcher);
		expect(maximum).toBe(6);
		expect(results.map((result) => result.id)).toEqual(
			targets.map((entry) => entry.id),
		);
		expect(await checkTargets([], 0, fetcher)).toEqual([]);
	});
});

describe("Wrangler SQLite D1 retention and scheduled writes", () => {
	let proxy: PlatformProxy<Env>;
	let env: Env;
	const now = Date.UTC(2026, 8, 11, 12, 30);
	const result = (patch: Partial<CheckResult> = {}): CheckResult => ({
		...target,
		slot: now,
		checkedAt: now,
		status: "operational",
		httpStatus: 200,
		latencyMs: 123,
		error: null,
		version: "1.0.0",
		...patch,
	});
	beforeAll(async () => {
		proxy = await getPlatformProxy<Env>({
			environment: "test",
			remoteBindings: false,
			persist: false,
		});
		await proxy.env.STATUS_DB.batch(
			readFileSync("migrations/0001_status_checks.sql", "utf8")
				.split(";")
				.filter((sql) => sql.trim())
				.map((sql) => proxy.env.STATUS_DB.prepare(sql)),
		);
	}, 30_000);
	afterAll(async () => {
		await proxy?.dispose();
	});
	beforeEach(async () => {
		await proxy.env.STATUS_DB.prepare("DELETE FROM checks").run();
		env = {
			...proxy.env,
			STATUS_MODE: "test",
			ASSETS: {
				fetch: vi.fn(async () => Response.json([target])),
				connect: () => {
					throw new Error("No network connections in tests");
				},
			},
		};
	});
	it("deduplicates slots, prunes expired rows, and returns real hourly counts", async () => {
		await storeChecks(
			env.STATUS_DB,
			[
				result({ slot: now - RETENTION - 1, checkedAt: now - RETENTION - 1 }),
				result({ slot: now - CHECK_INTERVAL, checkedAt: now - CHECK_INTERVAL }),
				result({ status: "down", httpStatus: 503, error: "http_error" }),
			],
			now,
		);
		await storeChecks(env.STATUS_DB, [result()], now);
		const snapshot = await readStatus(env.STATUS_DB, [target], now, "live");
		expect(snapshot.services[0]?.latest?.status).toBe("down");
		expect(snapshot.services[0]?.history).toEqual([
			{
				hour: Math.floor(now / HOUR) * HOUR,
				total: 2,
				passed: 1,
				down: 1,
				degraded: 0,
				unconfigured: 0,
				latencyMs: 123,
			},
		]);
		expect(
			await env.STATUS_DB.prepare("SELECT COUNT(*) AS n FROM checks").first(
				"n",
			),
		).toBe(2);
	});
	it("excludes expired, future, removed, and changed-endpoint records even before cleanup", async () => {
		await storeChecks(
			env.STATUS_DB,
			[
				result(),
				result({ id: "archived" }),
				result({ slot: 1, endpoint: "https://old.invalid/api/live" }),
				result({ slot: 2, checkedAt: now + HOUR }),
				result({ slot: 3, checkedAt: now - RETENTION - 1 }),
			],
			now - HOUR,
		);
		const snapshot = await readStatus(
			env.STATUS_DB,
			[target, { ...target, id: "new" }],
			now,
			"live",
		);
		expect(snapshot.services).toHaveLength(2);
		expect(snapshot.services[0]?.history[0]?.total).toBe(1);
		expect(snapshot.services[1]).toMatchObject({ latest: null, history: [] });
		expect(snapshot.windowStart).toBe(now - RETENTION);
	});
	it("cleans up in test mode and when manifest loading fails, without public probes", async () => {
		const time = Date.now();
		const seed = () =>
			storeChecks(
				env.STATUS_DB,
				[result({ checkedAt: time - RETENTION - 1 })],
				time - HOUR,
			);
		const fetcher = vi.fn(async () => {
			throw new Error("Unexpected public fetch");
		});
		vi.stubGlobal("fetch", fetcher);
		await seed();
		await runStatusChecks(env, time);
		expect(
			await env.STATUS_DB.prepare("SELECT COUNT(*) AS n FROM checks").first(
				"n",
			),
		).toBe(0);
		expect(env.ASSETS.fetch).not.toHaveBeenCalled();
		await seed();
		env.STATUS_MODE = "live";
		vi.mocked(env.ASSETS.fetch).mockResolvedValue(
			new Response(null, { status: 503 }),
		);
		await expect(runStatusChecks(env, time)).rejects.toThrow(
			"manifest unavailable",
		);
		expect(
			await env.STATUS_DB.prepare("SELECT COUNT(*) AS n FROM checks").first(
				"n",
			),
		).toBe(0);
		expect(fetcher).not.toHaveBeenCalled();
	});
	it("awaits a scheduled write and exposes a read-only feed", async () => {
		env.STATUS_MODE = "live";
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => healthy()),
		);
		const scheduledTime = Date.now();
		await runStatusChecks(env, scheduledTime);
		const response = await statusResponse(env);
		expect(response.status).toBe(200);
		expect(response.headers.get("cache-control")).toBe("public, max-age=60");
		const snapshot = await response.json<{
			mode: string;
			services: { latest: CheckResult }[];
		}>();
		expect(snapshot.mode).toBe("live");
		expect(snapshot.services[0]?.latest).toMatchObject({
			status: "operational",
			slot: Math.floor(scheduledTime / CHECK_INTERVAL) * CHECK_INTERVAL,
		});
		env.STATUS_MODE = "demo";
		expect((await statusResponse(env)).headers.get("cache-control")).toBe(
			"no-store",
		);
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.mocked(env.ASSETS.fetch).mockRejectedValue(
			new Error("Asset read failure"),
		);
		const failed = await statusResponse(env);
		expect(failed.status).toBe(503);
		expect(await failed.text()).not.toContain("Asset read failure");
	});
});
