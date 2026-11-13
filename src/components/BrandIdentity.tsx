import identity from "../data/projects/hexly-ai.json";
import { assetUrl, localMaterials } from "../model/assets";

export function BrandMark({ size = 36 }: { size?: number } = {}) {
	const preview = localMaterials();
	const root = preview
		? "/logos/family/hexly-ai/2026-11-13-02/02"
		: identity.family.root;
	const pixels = size > 64 ? 512 : preview ? 128 : 64;
	return (
		<img
			className="brand-mark"
			src={assetUrl(`${root}/transparent-${pixels}.png`)}
			alt=""
			width={size}
			height={size}
			aria-hidden="true"
		/>
	);
}

export function BrandWordmark() {
	return (
		<span>
			hexly<span className="brand-dot">.</span>
			<span className="brand-domain">ai</span>
		</span>
	);
}
