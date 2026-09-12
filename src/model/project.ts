export type Locale = "en" | "zh";
export type Theme = "light" | "dark";
export type View = "directory" | "logos" | "project" | "templates" | "status";
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
		revision: string | null;
		snapshot?: { path: string; sha256: string };
		sources: string[];
	};
}

export interface ProjectVideo {
	id: string;
	title: Record<Locale, string>;
	src: string;
	poster: string;
	durationSeconds: number;
	language: string;
	version: string;
	sha256: string;
	source: string;
	captionsBurnedIn?: boolean;
	captions?: { src: string; language: string; label: string }[];
}

export interface ProjectScreenshot {
	id: string;
	src: string;
	alt: Record<Locale, string>;
	width: number;
	height: number;
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
	media?: {
		videos?: ProjectVideo[];
		screenshots?: ProjectScreenshot[];
	};
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
	brandKit?: {
		version: string;
		root: string;
		method?: "gpt-image-2";
		previousVersion?: string;
		hero?: {
			width: number;
			height: number;
			alt: Record<Locale, string>;
			caption: Record<Locale, string>;
		};
		sourceAdoptionRevision: string | null;
		description: Record<Locale, string>;
		guidelines: {
			title: Record<Locale, string>;
			description: Record<Locale, string>;
		}[];
	};
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
		profileRevision: string | null;
		profileSection: string;
		description: string;
		repositoryRevision: string | null;
	};
}
