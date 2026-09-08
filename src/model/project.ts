export type Locale = "en" | "zh";
export type Theme = "light" | "dark";
export type View = "directory" | "logos";
export type Category =
	| "all"
	| "ai"
	| "tools"
	| "everyday"
	| "design"
	| "games"
	| "extensions"
	| "archive";

export interface ProjectOverview {
	goal: Record<Locale, string>;
	techStack: {
		name: string;
		role: Record<Locale, string>;
	}[];
	verified: {
		date: string;
		revision: string;
		sources: string[];
	};
}

export interface PaletteColor {
	color: string;
	role: "primary" | "background" | "accent";
	source: string;
	label?: Record<Locale, string>;
}

export interface LogoFamily {
	id: string;
	status: "review" | "adopted";
	updated: string;
	finishing: string;
	root: string;
	archive: string;
	method?: "retained-original" | "reference-adaptation";
	series?: "material" | "character";
	model?: string;
	foreground: {
		subject?: Record<Locale, string>;
		original: string;
		display: string;
		width: number;
		height: number;
		sha256: string;
	};
	previous: {
		original: string;
		sourceUrl: string;
		width: number;
		height: number;
		sha256: string;
	};
	direction: {
		aspect: "composition" | "drawing" | "presentation";
		title: Record<Locale, string>;
		description: Record<Locale, string>;
	}[];
	palette: PaletteColor[];
	sizeNote: Record<Locale, string>;
}

export interface Project {
	id: string;
	repo: string;
	title: string;
	emoji: string;
	description: Record<Locale, string>;
	overview?: ProjectOverview;
	category: Exclude<Category, "all">;
	website: string | null;
	websiteSource: string | null;
	repository: string;
	subject: string;
	reference: boolean;
	archived: boolean;
	logo: {
		kind: "original" | "emoji";
		original: string;
		thumbnail: string;
		display: string;
		sourcePath: string;
		sourceUrl: string;
		modified: boolean;
		width: number;
		height: number;
		bytes: number;
		sha256: string;
	};
	family?: LogoFamily;
	theme: Partial<
		Record<"primary" | "background" | "ink", { value: string; source: string }>
	>;
	colors: {
		primary: string;
		background: string;
		ink: string;
		palette: PaletteColor[];
	};
	source: {
		profileRevision: string;
		profileSection: string;
		description: string;
		repositoryRevision: string;
	};
}
