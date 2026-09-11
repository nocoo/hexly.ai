import type { Locale, Theme } from "./project";
import { resolveTimeZone } from "./time-zone";

export const preferenceKeys = {
	locale: "hexly:locale",
	theme: "hexly:theme",
	timeZone: "hexly:time-zone",
};

export function resolveLocale(saved: string | null, language: string): Locale {
	if (saved === "en" || saved === "zh") return saved;
	return language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function resolveTheme(saved: string | null, systemDark: boolean): Theme {
	if (saved === "light" || saved === "dark") return saved;
	return systemDark ? "dark" : "light";
}

export function readPreferences(
	storage: Pick<Storage, "getItem"> | null,
	language: string,
	systemDark: boolean,
): { locale: Locale; theme: Theme; timeZone: string } {
	try {
		return {
			locale: resolveLocale(
				storage?.getItem(preferenceKeys.locale) ?? null,
				language,
			),
			theme: resolveTheme(
				storage?.getItem(preferenceKeys.theme) ?? null,
				systemDark,
			),
			timeZone: resolveTimeZone(
				storage?.getItem(preferenceKeys.timeZone) ?? null,
			),
		};
	} catch {
		return {
			locale: resolveLocale(null, language),
			theme: resolveTheme(null, systemDark),
			timeZone: "local",
		};
	}
}

export function savePreference(
	storage: Pick<Storage, "setItem"> | null,
	key: keyof typeof preferenceKeys,
	value: string,
): boolean {
	try {
		if (!storage) return false;
		storage.setItem(preferenceKeys[key], value);
		return true;
	} catch {
		return false;
	}
}
