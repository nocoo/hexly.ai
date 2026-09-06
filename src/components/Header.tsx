import { copy } from "../data/copy";
import { appVersion } from "../data/version";
import type { Locale, Theme, View } from "../model/project";
import { BrandMark, Icon } from "./Icon";

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
	return (
		<header className="site-header shell">
			<div className="brand-group">
				<a
					href="/"
					className="brand"
					onClick={(event) => {
						event.preventDefault();
						onView("directory");
					}}
					aria-label="hexly.ai"
				>
					<BrandMark />
					<span>
						hexly<span className="brand-domain">.ai</span>
					</span>
				</a>
				<span className="version-pill" title={`${t.version} v${appVersion}`}>
					v{appVersion}
				</span>
			</div>
			<nav
				className="main-nav"
				aria-label={locale === "en" ? "Main navigation" : "主要导航"}
			>
				<button
					type="button"
					onClick={() => onView("directory")}
					aria-pressed={view === "directory"}
				>
					<Icon name="grid" />
					{t.directory}
				</button>
				<button
					type="button"
					onClick={() => onView("logos")}
					aria-pressed={view === "logos"}
				>
					<Icon name="gallery" />
					{t.gallery}
				</button>
			</nav>
			<div className="header-actions">
				<a
					href="https://lizheng.dev"
					target="_blank"
					rel="noreferrer"
					className="about-link"
				>
					{t.about}
					<Icon name="arrow" />
				</a>
				<div className="preferences">
					<button
						className="language-button"
						type="button"
						onClick={onLocale}
						aria-label={t.language}
					>
						<span lang="en" className={locale === "en" ? "is-active" : ""}>
							EN
						</span>
						<span className="language-divider">/</span>
						<span lang="zh" className={locale === "zh" ? "is-active" : ""}>
							中
						</span>
					</button>
					<button
						type="button"
						className="icon-button"
						onClick={onTheme}
						aria-label={theme === "light" ? t.dark : t.light}
						title={theme === "light" ? t.dark : t.light}
					>
						<Icon name={theme === "light" ? "moon" : "sun"} />
					</button>
				</div>
			</div>
		</header>
	);
}
