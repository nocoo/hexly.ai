import { describe, expect, it } from "vitest";
import {
	preferenceKeys,
	readPreferences,
	resolveLocale,
	resolveTheme,
	savePreference,
} from "../../src/model/preferences";

describe("language and theme preferences", () => {
	it("honors explicit settings before the browser's preferences", () => {
		expect(resolveLocale("en", "zh-CN")).toBe("en");
		expect(resolveLocale("zh", "en-US")).toBe("zh");
		expect(resolveLocale(null, "ZH-TW")).toBe("zh");
		expect(resolveLocale("unknown", "fr-FR")).toBe("en");
		expect(resolveTheme("light", true)).toBe("light");
		expect(resolveTheme("dark", false)).toBe("dark");
		expect(resolveTheme(null, true)).toBe("dark");
		expect(resolveTheme("unknown", false)).toBe("light");
	});
	it("reads saved preferences and remains usable with blocked storage", () => {
		const storage = {
			getItem: (key: string) => (key === preferenceKeys.locale ? "zh" : "dark"),
		};
		expect(readPreferences(storage, "en", false)).toEqual({
			locale: "zh",
			theme: "dark",
		});
		expect(readPreferences(null, "en", true)).toEqual({
			locale: "en",
			theme: "dark",
		});
		expect(readPreferences({ getItem: () => null }, "zh", false)).toEqual({
			locale: "zh",
			theme: "light",
		});
		expect(
			readPreferences(
				{
					getItem: () => {
						throw new Error("Blocked");
					},
				},
				"en",
				false,
			),
		).toEqual({ locale: "en", theme: "light" });
	});
	it("saves settings while treating storage failure as non-fatal", () => {
		const values = new Map<string, string>();
		expect(
			savePreference(
				{
					setItem: (key, value) => {
						values.set(key, value);
					},
				},
				"locale",
				"zh",
			),
		).toBe(true);
		expect(values.get(preferenceKeys.locale)).toBe("zh");
		expect(savePreference(null, "theme", "dark")).toBe(false);
		expect(
			savePreference(
				{
					setItem: () => {
						throw new Error("Full");
					},
				},
				"theme",
				"dark",
			),
		).toBe(false);
	});
});
