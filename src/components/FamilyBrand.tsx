import { surfaceHref } from "../data/surfaces";
import type { Locale } from "../model/project";

export function FamilyBrand({ locale }: { locale: Locale }) {
	return (
		<a
			className="brand-wordmark"
			href={surfaceHref("play", locale)}
			lang="en"
			aria-label="zheng li."
		>
			<span className="brand-grid" aria-hidden="true">
				<i />
				<i />
				<i />
				<i />
			</span>
			zheng li<span className="brand-dot">.</span>
		</a>
	);
}
