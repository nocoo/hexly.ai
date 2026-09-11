import { describe, expect, it } from "vitest";
import { formatStatusTime, resolveTimeZone } from "../../src/model/time-zone";

describe("status display time zones", () => {
	it("keeps Local automatic and recovers from invalid saved zones", () => {
		expect(resolveTimeZone(null)).toBe("local");
		expect(resolveTimeZone("local")).toBe("local");
		expect(resolveTimeZone("UTC")).toBe("UTC");
		expect(resolveTimeZone("America/New_York")).toBe("America/New_York");
		expect(resolveTimeZone("not-a-time-zone")).toBe("local");
	});

	it("converts UTC timestamps across dates and fractional offsets", () => {
		const time = Date.parse("2026-09-11T20:50:00Z");
		const utc = formatStatusTime(time, "en", "UTC", true);
		expect(utc).toMatch(/^11 Sep/);
		expect(utc).toContain("20:50");
		const shanghai = formatStatusTime(time, "en", "Asia/Shanghai", true);
		expect(shanghai).toMatch(/^12 Sep/);
		expect(shanghai).toContain("04:50");
		expect(shanghai).toContain("GMT+8");
		expect(formatStatusTime(time, "en", "Asia/Kathmandu", true)).toContain(
			"02:35 GMT+5:45",
		);
		expect(formatStatusTime(time, "zh", "Asia/Shanghai")).toBe("9月12日");
	});

	it.each([
		["2026-03-08T06:30:00Z", "01:30 GMT-5"],
		["2026-03-08T07:30:00Z", "03:30 GMT-4"],
		["2026-11-01T05:30:00Z", "01:30 GMT-4"],
		["2026-11-01T06:30:00Z", "01:30 GMT-5"],
	])("uses the offset at %s through daylight-saving changes", (iso, label) => {
		expect(
			formatStatusTime(Date.parse(iso), "en", "America/New_York", true),
		).toContain(label);
	});
});
