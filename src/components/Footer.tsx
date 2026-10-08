import { copy } from "../data/copy";
import type { Locale } from "../model/project";
import { FamilyBrand } from "./FamilyBrand";

export function Footer({ locale }: { locale: Locale }) {
	const t = copy[locale];
	const year = new Date().getFullYear();
	return (
		<footer className="site-footer">
			<div className="site-footer-inner shell">
				<div className="site-footer-body">
					<div className="site-footer-identity">
						<FamilyBrand locale={locale} />
						<p lang="en">
							<span className="footer-copyright-full">
								{t.copyright.replace("{year}", String(year))}
							</span>
							<span className="footer-copyright-short">
								{t.copyrightShort.replace("{year}", String(year))}
							</span>
						</p>
					</div>
					<nav
						className="public-formats"
						aria-label={locale === "zh" ? "阅读格式" : "Reading formats"}
					>
						<a href="/llms.txt" lang="en">
							{t.llms}
						</a>
					</nav>
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
