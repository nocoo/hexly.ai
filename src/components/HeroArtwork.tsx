import { assetUrl, localMaterials } from "../model/assets";

export type HeroArtworkPage = "projects" | "templates" | "brand" | "status";

export function HeroArtwork({ page }: { page: HeroArtworkPage }) {
	if (!localMaterials()) return null;
	return (
		<img
			className={`hero-artwork hero-artwork-${page}`}
			src={assetUrl(`/brands/hexly-ai/v1.0.1/headers/${page}-960.webp`)}
			width={1536}
			height={1024}
			alt=""
			aria-hidden="true"
			decoding="async"
			fetchPriority="high"
			draggable={false}
		/>
	);
}
