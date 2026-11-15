import identity from "../data/projects/hexly-ai.json";
import { assetUrl } from "../model/assets";

export function BrandMark({ size = 36 }: { size?: number } = {}) {
	const root = identity.family.root;
	const pixels = size > 64 ? 512 : 128;
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
