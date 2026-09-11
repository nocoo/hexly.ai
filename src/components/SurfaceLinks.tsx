import { copy } from "../data/copy";
import { type SurfaceId, surfaceHref, surfaceIds } from "../data/surfaces";
import type { Locale } from "../model/project";

export function SurfaceLinks({
	locale,
	footer = false,
	onPortfolio,
	portfolioHref = "/",
}: {
	locale: Locale;
	footer?: boolean;
	onPortfolio: () => void;
	portfolioHref?: string;
}) {
	const t = copy[locale];
	const names: Record<SurfaceId, string> = {
		play: t.play,
		journal: t.journal,
		resume: t.resume,
		portfolio: t.portfolio,
	};
	return (
		<nav
			className="surface-links"
			aria-label={footer ? t.footerSurfaces : t.surfaces}
		>
			{surfaceIds.map((id) => {
				const current = id === "portfolio";
				return (
					<a
						key={id}
						href={current ? portfolioHref : surfaceHref(id, locale)}
						data-surface-link={id}
						aria-current={current ? "true" : undefined}
						lang={locale === "zh" ? "zh-CN" : "en"}
						onClick={
							current
								? (event) => {
										event.preventDefault();
										onPortfolio();
									}
								: undefined
						}
					>
						{names[id]}
					</a>
				);
			})}
		</nav>
	);
}
