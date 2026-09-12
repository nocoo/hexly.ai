// Sourced from hexly.ai at e8dbbca; see brand-source.json and CREDITS.md.
export const kitVersion = "2.0.0";
// Brand assets are unchanged. Keep their immutable URLs independent of layout versions.
export const brandAssetVersion = "1.0.0";
export const palettes = {
	light: {
		page: "#f0f0e9",
		ink: "#30372e",
		muted: "#68705f",
		accent: "#bf5c3c",
		line: "#d4d8cb",
		surface: "#f8f8f2",
		soft: "#e8ebdf",
		shadow: "#35442c",
	},
	dark: {
		page: "#1e2824",
		ink: "#e6e9dc",
		muted: "#a0aa9a",
		accent: "#e79670",
		line: "#3d4940",
		surface: "#27332c",
		soft: "#26352b",
		shadow: "#070d09",
	},
} as const;

export type Palette = { [K in keyof typeof palettes.light]: string };
export const hexly = {
	...palettes.light,
	sans: '"Space Grotesk Variable", "Journey CJK", sans-serif',
	mono: '"Geist Mono Variable", "Journey CJK", monospace',
	mark: {
		width: 33,
		height: 36,
		viewBox: "0 0 36 40",
		outer: "m18 2 15.6 9v18L18 38 2.4 29V11Z",
		inner: "m18 9 9.5 5.5v11L18 31l-9.5-5.5v-11Z",
		facets: "M18 9v22M8.5 14.5l19 11m0-11-19 11",
		strokeWidth: 1.6,
	},
	wordmark: {
		size: 23,
		weight: 600,
		letterSpacing: -1,
		lineHeight: 1,
		gap: 11,
	},
} as const;

export const layouts = {
	launch: {
		label: "Launch",
		enter: 0.7,
		stagger: 0.12,
	},
	essential: {
		label: "Essential",
		enter: 0.8,
		stagger: 0.14,
	},
	showcase: { label: "Showcase", enter: 0.85, stagger: 0.12 },
	columns: { label: "Columns", enter: 0.7, stagger: 0.1 },
	bento: { label: "Bento", enter: 0.8, stagger: 0.11 },
} as const;

// Site geometry and the existing warm location indicator; no new brand palette.
export const family = {
	radius: { small: 8, panel: 24, object: 28 },
	space: { unit: 8, edge: 32, safe: 80, top: 152, bottom: 110 },
	dot: { color: "#bc7252", highlight: "#ffe1b4", glow: "#dd956b" },
	motion: { travel: 18, settle: 0.7, transition: 0.32 },
} as const;
