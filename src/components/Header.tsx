import { useEffect, useRef, useState } from "react";
import { copy } from "../data/copy";
import type { Locale, Theme, View } from "../model/project";
import { BrandMark, BrandWordmark } from "./BrandIdentity";
import { Icon } from "./Icon";
import { SurfaceLinks } from "./SurfaceLinks";

export function Header({
	view,
	locale,
	theme,
	onView,
	onLocale,
	onTheme,
	homeHref = "/",
}: {
	view: View;
	locale: Locale;
	theme: Theme;
	onView: (view: View) => void;
	onLocale: () => void;
	onTheme: () => void;
	homeHref?: string;
}) {
	const t = copy[locale];
	const [menuOpen, setMenuOpen] = useState(false);
	const headerRef = useRef<HTMLElement>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const prevViewRef = useRef(view);

	const selectView = (next: View) => {
		setMenuOpen(false);
		onView(next);
	};
	const home = () => selectView("directory");

	useEffect(() => {
		if (prevViewRef.current === view) return;
		prevViewRef.current = view;
		setMenuOpen(false);
	}, [view]);

	useEffect(() => {
		if (!menuOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			setMenuOpen(false);
			menuButtonRef.current?.focus();
		};
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (target instanceof Node && headerRef.current?.contains(target)) {
				return;
			}
			setMenuOpen(false);
		};
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("pointerdown", onPointerDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [menuOpen]);

	return (
		<header className="site-header" ref={headerRef}>
			<div className="site-header-bar">
				<div className="site-header-inner shell">
					<a
						href={homeHref}
						className="brand"
						onClick={(event) => {
							event.preventDefault();
							home();
						}}
					>
						<BrandMark />
						<BrandWordmark />
					</a>
					<div
						id="mobile-nav-drawer"
						className="site-header-nav-drawer"
						data-open={menuOpen ? "true" : "false"}
					>
						<nav className="view-links" aria-label={t.views}>
							<button
								type="button"
								onClick={() => selectView("directory")}
								aria-pressed={["directory", "logos", "project"].includes(view)}
								title={t.directory}
							>
								<Icon name="grid" />
								<span className="view-link-label">{t.directory}</span>
							</button>
							<button
								type="button"
								onClick={() => selectView("brand")}
								aria-pressed={view === "brand"}
								title={t.brandPage}
							>
								<Icon name="folder" />
								<span className="view-link-label">{t.brandPage}</span>
							</button>
							<button
								type="button"
								onClick={() => selectView("status")}
								aria-pressed={view === "status"}
								title={t.status}
							>
								<Icon name="activity" />
								<span className="view-link-label">{t.status}</span>
							</button>
						</nav>
						<SurfaceLinks
							locale={locale}
							portfolioHref={homeHref}
							onPortfolio={home}
						/>
					</div>
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
						<button
							ref={menuButtonRef}
							type="button"
							className="icon-toggle menu-toggle"
							aria-expanded={menuOpen}
							aria-controls="mobile-nav-drawer"
							aria-label={menuOpen ? t.closeMenu : t.openMenu}
							title={menuOpen ? t.closeMenu : t.openMenu}
							onClick={() => setMenuOpen((open) => !open)}
						>
							<Icon name={menuOpen ? "close" : "menu"} />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
