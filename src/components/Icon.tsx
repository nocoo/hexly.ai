export type IconName =
	| "arrow"
	| "search"
	| "sun"
	| "moon"
	| "close"
	| "download"
	| "link"
	| "check"
	| "chevron"
	| "github"
	| "globe"
	| "expand"
	| "folder"
	| "settings"
	| "left"
	| "right"
	| "languages"
	| "grid"
	| "image"
	| "activity"
	| "refresh"
	| "clock"
	| "info";

const paths: Record<IconName, string> = {
	arrow: "M5 19 19 5M5 5h14v14",
	search: "m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
	sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
	moon: "M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z",
	close: "m6 6 12 12M6 18 18 6",
	download: "M12 3v12m-5-5 5 5 5-5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5",
	link: "M10 13a5 5 0 0 0 7 .3l3-3a5 5 0 0 0-7-7l-1.8 1.8M14 11a5 5 0 0 0-7-.3l-3 3a5 5 0 0 0 7 7l1.8-1.8",
	check: "m5 12 4 4L19 6",
	chevron: "m7 10 5 5 5-5",
	github:
		"M9 19c-5 1.5-5-2.5-7-3m14 5v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C7.5 2.4 6.5 2.7 6.5 2.7a4.4 4.4 0 0 0-.1 3.2A4.7 4.7 0 0 0 5 9.2c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21",
	globe:
		"M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18",
	expand: "M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5",
	folder:
		"M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z",
	settings:
		"M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",
	left: "m14 6-6 6 6 6",
	right: "m10 6 6 6-6 6",
	languages: "m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6",
	grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
	image:
		"M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM3 16l5-5 4 4 3-3 6 6M15 7h.01",
	activity: "M2 12h5l3-8 4 16 3-8h5",
	refresh: "M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 3M18 18a8 8 0 0 1-13-3",
	clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2",
	info: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 11v6M12 7h.01",
};

export function Icon({
	name,
	className = "",
}: {
	name: IconName;
	className?: string;
}) {
	return (
		<svg
			className={`icon ${className}`}
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d={paths[name]} />
		</svg>
	);
}

export function BrandMark() {
	return (
		<svg
			className="brand-mark"
			width="33"
			height="36"
			viewBox="0 0 36 40"
			fill="none"
			aria-hidden="true"
		>
			<path d="m18 2 15.6 9v18L18 38 2.4 29V11Z" fill="currentColor" />
			<path
				d="m18 9 9.5 5.5v11L18 31l-9.5-5.5v-11Z"
				stroke="var(--page)"
				strokeWidth="1.6"
			/>
			<path
				d="M18 9v22M8.5 14.5l19 11m0-11-19 11"
				stroke="var(--page)"
				strokeWidth="1.6"
			/>
		</svg>
	);
}
