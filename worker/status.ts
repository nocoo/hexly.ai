import {
	CHECK_INTERVAL,
	type CheckResult,
	HOUR,
	RETENTION,
	type StatusHour,
	type StatusSnapshot,
	type StatusTarget,
} from "../src/model/status";

type ProbeFetch = (input: string, init: RequestInit) => Promise<Response>;
const MAX_BODY = 65_536;
const TIMEOUT = 8_000;

async function probe(
	target: StatusTarget,
	slot: number,
	fetchImpl: ProbeFetch,
): Promise<CheckResult> {
	const started = performance.now();
	let httpStatus: number | null = null;
	const result = (
		status: CheckResult["status"],
		error: string | null,
		version: string | null = null,
	): CheckResult => ({
		...target,
		slot,
		checkedAt: Date.now(),
		status,
		httpStatus,
		latencyMs:
			httpStatus === null ? null : Math.round(performance.now() - started),
		error,
		version,
	});
	try {
		const response = await fetchImpl(target.endpoint, {
			method: "GET",
			redirect: "manual",
			cache: "no-store",
			headers: {
				Accept: "application/json",
				"Cache-Control": "no-cache",
				"User-Agent": "hexly-status/1.0 (+https://status.hexly.ai)",
			},
			signal: AbortSignal.timeout(TIMEOUT),
		});
		httpStatus = response.status;
		if (!response.ok) {
			await response.body?.cancel();
			if (httpStatus >= 300 && httpStatus < 400)
				return result("unconfigured", "redirect");
			if ([401, 403, 404].includes(httpStatus))
				return result(
					"unconfigured",
					httpStatus === 404 ? "not_found" : "http_error",
				);
			return result(httpStatus === 429 ? "degraded" : "down", "http_error");
		}
		if (
			!/\bapplication\/(?:[\w.-]+\+)?json\b/i.test(
				response.headers.get("content-type") ?? "",
			)
		) {
			await response.body?.cancel();
			return result("unconfigured", "invalid_json");
		}
		const reader = response.body?.getReader();
		let bytes = 0;
		let text = "";
		const decoder = new TextDecoder();
		if (reader) {
			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					bytes += value.byteLength;
					if (bytes > MAX_BODY) {
						await reader.cancel();
						return result("unconfigured", "body_too_large");
					}
					text += decoder.decode(value, { stream: true });
				}
			} finally {
				reader.releaseLock();
			}
		}
		text += decoder.decode();
		let body: unknown;
		try {
			body = JSON.parse(text);
		} catch {
			return result("unconfigured", "invalid_json");
		}
		if (
			!body ||
			typeof body !== "object" ||
			!("status" in body) ||
			typeof body.status !== "string"
		)
			return result("unconfigured", "invalid_health");
		const status = body.status.toLowerCase();
		const version =
			"version" in body && typeof body.version === "string"
				? body.version.slice(0, 64)
				: null;
		if (["ok", "healthy", "up", "operational"].includes(status))
			return result("operational", null, version);
		if (["degraded", "warn", "warning"].includes(status))
			return result("degraded", "reported_degraded", version);
		if (["error", "unhealthy", "down"].includes(status))
			return result("down", "reported_down", version);
		return result("unconfigured", "invalid_health", version);
	} catch (error) {
		return result(
			"down",
			error instanceof Error &&
				["TimeoutError", "AbortError"].includes(error.name)
				? "timeout"
				: "network",
		);
	}
}

export async function checkEndpoint(
	target: StatusTarget,
	slot: number,
	fetchImpl: ProbeFetch = fetch,
): Promise<CheckResult> {
	const first = await probe(target, slot, fetchImpl);
	return first.status === "down" || first.httpStatus === 429
		? probe(target, slot, fetchImpl)
		: first;
}

export async function checkTargets(
	targets: StatusTarget[],
	slot: number,
	fetchImpl: ProbeFetch = fetch,
): Promise<CheckResult[]> {
	let cursor = 0;
	const results: CheckResult[] = [];
	await Promise.all(
		Array.from({ length: Math.min(6, targets.length) }, async () => {
			while (cursor < targets.length) {
				const index = cursor++;
				const target = targets[index];
				if (target)
					results[index] = await checkEndpoint(target, slot, fetchImpl);
			}
		}),
	);
	return results;
}

async function loadTargets(env: Env): Promise<StatusTarget[]> {
	const response = await env.ASSETS.fetch(
		new Request("https://hexly.ai/data/status-targets.json"),
	);
	if (!response.ok) throw new Error("Status target manifest unavailable");
	return response.json<StatusTarget[]>();
}

export async function storeChecks(
	db: D1Database,
	checks: CheckResult[],
	now: number,
): Promise<void> {
	const insert =
		db.prepare(`INSERT INTO checks (project_id, endpoint, slot, checked_at, status, http_status, latency_ms, error_code, version)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(project_id, slot) DO NOTHING`);
	await db.batch([
		...checks.map((check) =>
			insert.bind(
				check.id,
				check.endpoint,
				check.slot,
				check.checkedAt,
				check.status,
				check.httpStatus,
				check.latencyMs,
				check.error,
				check.version,
			),
		),
		db.prepare("DELETE FROM checks WHERE checked_at < ?").bind(now - RETENTION),
	]);
}

export async function runStatusChecks(
	env: Env,
	scheduledTime: number,
): Promise<void> {
	let checks: CheckResult[] = [];
	try {
		// Local and test schedules only exercise retention, never public endpoints.
		if (env.STATUS_MODE !== "live") return;
		checks = await checkTargets(
			await loadTargets(env),
			Math.floor(scheduledTime / CHECK_INTERVAL) * CHECK_INTERVAL,
		);
	} finally {
		await storeChecks(env.STATUS_DB, checks, Date.now());
	}
	console.info(
		JSON.stringify({
			event: "status_checks_complete",
			count: checks.length,
			scheduledTime,
		}),
	);
}

export async function readStatus(
	db: D1Database,
	targets: StatusTarget[],
	now: number,
	mode: StatusSnapshot["mode"],
): Promise<StatusSnapshot> {
	const from = `FROM checks AS c JOIN json_each(?) AS target
		ON c.project_id = json_extract(target.value, '$.id') AND c.endpoint = json_extract(target.value, '$.endpoint')
		WHERE c.checked_at >= ? AND c.checked_at <= ?`;
	const bindings = [JSON.stringify(targets), now - RETENTION, now];
	const [latest, history] = await db.batch([
		db
			.prepare(`SELECT project_id AS id, endpoint, slot, checked_at AS checkedAt, status, http_status AS httpStatus, latency_ms AS latencyMs, error_code AS error, version
			FROM (SELECT c.*, ROW_NUMBER() OVER (PARTITION BY project_id ORDER BY checked_at DESC, slot DESC) AS position ${from}) WHERE position = 1`)
			.bind(...bindings),
		db
			.prepare(`SELECT project_id AS id, CAST(checked_at / ${HOUR} AS INTEGER) * ${HOUR} AS hour,
			COUNT(*) AS total, SUM(status = 'operational') AS passed, SUM(status = 'degraded') AS degraded,
			SUM(status = 'down') AS down, SUM(status = 'unconfigured') AS unconfigured, ROUND(AVG(latency_ms)) AS latencyMs
			${from} GROUP BY project_id, hour ORDER BY hour`)
			.bind(...bindings),
	]);
	if (!latest || !history) throw new Error("Missing status query result");
	const last = new Map(
		(latest.results as CheckResult[]).map((check) => [check.id, check]),
	);
	const byProject = new Map<string, StatusHour[]>();
	for (const { id, ...hour } of history.results as (StatusHour & {
		id: string;
	})[]) {
		const hours = byProject.get(id) ?? [];
		hours.push(hour);
		byProject.set(id, hours);
	}
	return {
		mode,
		generatedAt: now,
		windowStart: now - RETENTION,
		intervalSeconds: CHECK_INTERVAL / 1000,
		retentionDays: 7,
		services: targets.map((target) => ({
			...target,
			latest: last.get(target.id) ?? null,
			history: byProject.get(target.id) ?? [],
		})),
	};
}

export async function statusResponse(env: Env): Promise<Response> {
	try {
		const snapshot = await readStatus(
			env.STATUS_DB,
			await loadTargets(env),
			Date.now(),
			env.STATUS_MODE === "live" ? "live" : "demo",
		);
		return Response.json(snapshot, {
			headers: {
				"Cache-Control":
					env.STATUS_MODE === "live" ? "public, max-age=60" : "no-store",
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error) {
		console.error(
			JSON.stringify({
				event: "status_read_failed",
				error: error instanceof Error ? error.message : "Unknown error",
			}),
		);
		return Response.json(
			{ error: "Status data is temporarily unavailable" },
			{
				status: 503,
				headers: {
					"Cache-Control": "no-store",
					"X-Content-Type-Options": "nosniff",
				},
			},
		);
	}
}
