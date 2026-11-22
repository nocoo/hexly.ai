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

	const navItems: {
		view: View;
		href: string;
		icon: "grid" | "folder" | "activity";
		label: string;
		active: boolean;
	}[] = [
		{
			view: "directory",
			href: homeHref,
			icon: "grid",
			label: t.directory,
			active: ["directory", "logos", "project"].includes(view),
		},
		{
			view: "brand",
			href: homeHref === "/" ? "/brand" : "https://hexly.ai/brand",
			icon: "folder",
			label: t.brandPage,
			active: view === "brand",
		},
		{
			view: "status",
			href: homeHref === "/" ? "/status" : "/",
			icon: "activity",
			label: t.status,
			active: view === "status",
		},
	];

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
						className="site-header-nav-backdrop"
						data-open={menuOpen ? "true" : "false"}
						aria-hidden="true"
						onClick={() => setMenuOpen(false)}
					/>
					<div
						id="mobile-nav-drawer"
						className="site-header-nav-drawer"
						data-open={menuOpen ? "true" : "false"}
					>
						<nav className="view-links" aria-label={t.views}>
							{navItems.map((item) => (
								<a
									key={item.view}
									href={item.href}
									aria-current={item.active ? "page" : undefined}
									title={item.label}
									onClick={(event) => {
										if (
											event.button ||
											event.metaKey ||
											event.ctrlKey ||
											event.shiftKey ||
											event.altKey
										)
											return;
										event.preventDefault();
										selectView(item.view);
									}}
								>
									<Icon name={item.icon} />
									<span className="view-link-label">{item.label}</span>
								</a>
							))}
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
							aria-label={t.menu}
							title={t.menu}
							onClick={() => setMenuOpen((open) => !open)}
						>
							<Icon name="menu" className="menu-icon-bars" />
							<Icon name="close" className="menu-icon-close" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
