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

export interface PaletteColor {
	color: string;
	role: "primary" | "background" | "accent";
	source: string;
}

export interface Project {
	id: string;
	repo: string;
	title: string;
	emoji: string;
	description: Record<Locale, string>;
	category: Exclude<Category, "all">;
	website: string | null;
	websiteSource: string | null;
	repository: string;
	subject: string;
	reference: boolean;
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
