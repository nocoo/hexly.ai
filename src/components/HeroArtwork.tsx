import { assetUrl } from "../model/assets";
import type { Theme } from "../model/project";

export type HeroPage = "projects" | "brand" | "status";

const dimensions: Record<
	HeroPage,
	Record<Theme, { width: number; height: number }>
> = {
	projects: {
		light: { width: 1536, height: 1080 },
		dark: { width: 1536, height: 1080 },
	},
	brand: {
		light: { width: 1514, height: 1297 },
		dark: { width: 1530, height: 1310 },
	},
	status: {
		light: { width: 1536, height: 1027 },
		dark: { width: 1536, height: 1032 },
	},
};

export function HeroArtwork({
	page,
	theme,
	alt = "",
}: {
	page: HeroPage;
	theme: Theme;
	alt?: string;
}) {
	const basePath = `/brands/hexly-ai/v1.0.2/headers/${page}`;
	const src = assetUrl(`${basePath}${theme === "dark" ? "-dark" : ""}.webp`);
	const { width, height } = dimensions[page][theme];
	return (
		<img
			className="hero-candidate-backdrop"
			src={src}
			alt={alt}
			width={width}
			height={height}
			fetchPriority="high"
			decoding="async"
			draggable={false}
		/>
	);
}
