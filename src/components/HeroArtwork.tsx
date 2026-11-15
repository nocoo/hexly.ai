import { assetUrl } from "../model/assets";

export type HeroPage = "projects" | "brand" | "status";

export function HeroArtwork({ page, alt }: { page: HeroPage; alt: string }) {
	const basePath = `/brands/hexly-ai/v1.0.2/headers/${page}`;
	return (
		<picture>
			<source
				srcSet={assetUrl(`${basePath}-dark.webp`)}
				media="(prefers-color-scheme: dark)"
			/>
			<img
				className="hero-candidate-backdrop"
				src={assetUrl(`${basePath}.webp`)}
				alt={alt}
				decoding="async"
				draggable={false}
			/>
		</picture>
	);
}
