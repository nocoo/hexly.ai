import type { Locale } from "../model/project";

export const surfaceIds = ["play", "journal", "resume", "portfolio"] as const;

export type SurfaceId = (typeof surfaceIds)[number];

export function surfaceHref(id: SurfaceId, locale: Locale): string {
	switch (id) {
		case "play":
			return `https://lizheng.me/${locale}/`;
		case "journal":
			return "https://lizheng.blog/";
		case "resume":
			return `https://lizheng.dev/${locale}/`;
		case "portfolio":
			return "/";
	}
}
