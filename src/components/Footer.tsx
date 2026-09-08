import { copy } from "../data/copy";
import { appVersion } from "../data/version";
import type { Locale } from "../model/project";
import { FamilyBrand } from "./FamilyBrand";
import { SurfaceLinks } from "./SurfaceLinks";

export function Footer({
	locale,
	onHome,
}: {
	locale: Locale;
	onHome: () => void;
}) {
	const t = copy[locale];
	const year = new Date().getFullYear();
	return (
		<footer className="site-footer">
			<div className="site-footer-inner shell">
				<div className="site-footer-body">
					<div className="site-footer-identity">
						<FamilyBrand locale={locale} />
						<p lang="en">
							{t.copyright.replace("{year}", String(year))}
							{" · "}
							<span className="site-version">v{appVersion}</span>
							{" · "}
							<a href="/llms.txt">{t.llms}</a>
						</p>
					</div>
					<SurfaceLinks locale={locale} footer onPortfolio={onHome} />
				</div>
			</div>
			<div className="site-footer-bottom">
				<div className="site-footer-inner shell">
					<span className="location-signature" lang="en">
						<span className="location-dot" aria-hidden="true" />
						{t.location}
					</span>
					<span className="footer-curiosity" lang="en">
						{t.curiosity}
					</span>
					<a href="#main-content">
						{t.top}
						<span aria-hidden="true">↑</span>
					</a>
				</div>
			</div>
		</footer>
	);
}
