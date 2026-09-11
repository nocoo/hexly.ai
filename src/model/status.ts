import type { Project } from "./project";

export const CHECK_INTERVAL = 300_000;
export const RETENTION = 7 * 24 * 60 * 60 * 1000;
export const HOUR = 60 * 60 * 1000;
export const checkStatuses = [
	"operational",
	"degraded",
	"down",
	"unconfigured",
] as const;
export type CheckStatus = (typeof checkStatuses)[number];
export type DisplayStatus = CheckStatus | "unknown";

export interface StatusTarget {
	id: string;
	endpoint: string;
}

export interface CheckResult extends StatusTarget {
	slot: number;
	checkedAt: number;
	status: CheckStatus;
	httpStatus: number | null;
	latencyMs: number | null;
	error: string | null;
	version: string | null;
}

export interface StatusHour {
	hour: number;
	total: number;
	passed: number;
	degraded: number;
	down: number;
	unconfigured: number;
	latencyMs: number | null;
}

export interface StatusService extends StatusTarget {
	latest: CheckResult | null;
	history: StatusHour[];
}

export interface StatusSnapshot {
	mode: "live" | "demo";
	generatedAt: number;
	windowStart: number;
	intervalSeconds: number;
	retentionDays: number;
	services: StatusService[];
}

const distributionHosts = new Set([
	"chromewebstore.google.com",
	"chrome.google.com",
	"addons.mozilla.org",
	"apps.apple.com",
	"play.google.com",
	"npmjs.com",
	"www.npmjs.com",
	"pypi.org",
	"github.com",
]);

export function healthEndpoint(
	project: Pick<Project, "website" | "archived">,
): string | null {
	if (project.archived || !project.website) return null;
	try {
		const url = new URL(project.website);
		if (
			url.protocol !== "https:" ||
			url.username ||
			url.password ||
			distributionHosts.has(url.hostname)
		)
			return null;
		return `${url.origin}/api/live`;
	} catch {
		return null;
	}
}

export function statusTargets(projects: Project[]): StatusTarget[] {
	return projects.flatMap((project) => {
		const endpoint = healthEndpoint(project);
		return endpoint ? [{ id: project.id, endpoint }] : [];
	});
}

export function currentStatus(
	latest: CheckResult | null,
	now: number,
): DisplayStatus {
	return !latest || now - latest.checkedAt > CHECK_INTERVAL * 2
		? "unknown"
		: latest.status;
}

export function hourStatus(hour: StatusHour | null): DisplayStatus {
	if (!hour?.total) return "unknown";
	if (hour.passed === hour.total) return "operational";
	if (hour.down === hour.total) return "down";
	if (hour.unconfigured === hour.total) return "unconfigured";
	return "degraded";
}

export function historySlots(
	history: StatusHour[],
	now: number,
	hours: number,
): { time: number; data: StatusHour | null }[] {
	const end = Math.floor(now / HOUR) * HOUR;
	const byHour = new Map(history.map((hour) => [hour.hour, hour]));
	return Array.from({ length: hours }, (_, index) => {
		const time = end - (hours - 1 - index) * HOUR;
		return { time, data: byHour.get(time) ?? null };
	});
}

export function sampleTotals(history: StatusHour[]) {
	const total = history.reduce((sum, hour) => sum + hour.total, 0);
	const passed = history.reduce((sum, hour) => sum + hour.passed, 0);
	return { total, passed, percentage: total ? (passed / total) * 100 : null };
}

export function parseStatusSnapshot(value: unknown): StatusSnapshot {
	const snapshot = value as StatusSnapshot | null;
	if (
		!snapshot ||
		!["live", "demo"].includes(snapshot.mode) ||
		!Number.isFinite(snapshot.generatedAt) ||
		!Number.isFinite(snapshot.windowStart) ||
		snapshot.intervalSeconds !== CHECK_INTERVAL / 1000 ||
		snapshot.retentionDays !== RETENTION / (24 * HOUR) ||
		!Array.isArray(snapshot.services) ||
		snapshot.services.some(
			(service) =>
				!service ||
				typeof service.id !== "string" ||
				typeof service.endpoint !== "string" ||
				!Array.isArray(service.history) ||
				service.history.some(
					(hour) =>
						!hour ||
						![
							hour.hour,
							hour.total,
							hour.passed,
							hour.degraded,
							hour.down,
							hour.unconfigured,
						].every(Number.isFinite),
				) ||
				(service.latest !== null &&
					(!service.latest ||
						!Number.isFinite(service.latest.checkedAt) ||
						!checkStatuses.includes(service.latest.status))),
		)
	)
		throw new Error("Invalid status response");
	return snapshot;
}
