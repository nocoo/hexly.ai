import { copy } from "../data/copy";
import type { Locale, Theme, View } from "../model/project";
import { BrandMark, Icon } from "./Icon";
import { SurfaceLinks } from "./SurfaceLinks";

export function Header({
	view,
	locale,
	theme,
	onView,
	onLocale,
	onTheme,
}: {
	view: View;
	locale: Locale;
	theme: Theme;
	onView: (view: View) => void;
	onLocale: () => void;
	onTheme: () => void;
}) {
	const t = copy[locale];
	const home = () => onView("directory");
	return (
		<header className="site-header">
			<div className="site-header-bar">
				<div className="site-header-inner shell">
					<a
						href="/"
						className="brand"
						onClick={(event) => {
							event.preventDefault();
							home();
						}}
						aria-label="hexly.ai"
					>
						<BrandMark />
						<span>
							hexly<span className="brand-dot">.</span>
							<span className="brand-domain">ai</span>
						</span>
					</a>
					<nav className="view-links" aria-label={t.views}>
						<button
							type="button"
							onClick={() => onView("directory")}
							aria-pressed={view === "directory"}
							aria-label={t.directory}
							title={t.directory}
						>
							<Icon name="grid" />
							<span className="view-link-label">{t.directory}</span>
						</button>
						<button
							type="button"
							onClick={() => onView("logos")}
							aria-pressed={view === "logos"}
							aria-label={t.gallery}
							title={t.gallery}
						>
							<Icon name="image" />
							<span className="view-link-label">{t.gallery}</span>
						</button>
					</nav>
					<SurfaceLinks locale={locale} onPortfolio={home} />
					<div className="preferences">
						<button
							className="icon-toggle"
							type="button"
							onClick={onLocale}
							aria-label={t.language}
							title={t.language}
						>
							<Icon name="languages" />
						</button>
						<button
							type="button"
							className="icon-toggle theme-toggle"
							onClick={onTheme}
							aria-label={theme === "light" ? t.light : t.dark}
							title={theme === "light" ? t.light : t.dark}
						>
							<Icon name="sun" className="theme-sun" />
							<Icon name="moon" className="theme-moon" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
