import type { Locale } from "./project";

export function resolveTimeZone(saved: string | null): string {
	if (!saved || saved === "local") return "local";
	try {
		return new Intl.DateTimeFormat("en", {
			timeZone: saved,
		}).resolvedOptions().timeZone;
	} catch {
		return "local";
	}
}

export function formatStatusTime(
	time: number,
	locale: Locale,
	timeZone: string,
	withTime = false,
) {
	return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-GB", {
		month: "short",
		day: "numeric",
		timeZone,
		...(withTime
			? {
					hour: "2-digit",
					minute: "2-digit",
					hourCycle: "h23",
					timeZoneName: "shortOffset",
				}
			: {}),
	}).format(time);
}
