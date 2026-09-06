import { copy } from "../data/copy";
import type { Locale } from "../model/project";
import { BrandMark, Icon } from "./Icon";

export function Footer({ locale }: { locale: Locale }) {
	const t = copy[locale];
	return (
		<footer className="site-footer shell">
			<div className="footer-credit">
				<BrandMark />
				<div>
					<p>{t.footer}</p>
					<span>{t.footerNote}</span>
				</div>
			</div>
			<nav aria-label={locale === "en" ? "Elsewhere" : "更多链接"}>
				<a href="https://lizheng.blog" target="_blank" rel="noreferrer">
					{t.blog}
					<Icon name="arrow" />
				</a>
				<a href="https://github.com/nocoo" target="_blank" rel="noreferrer">
					{t.github}
					<Icon name="arrow" />
				</a>
				<button
					type="button"
					onClick={() =>
						window.scrollTo({
							top: 0,
							behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
								.matches
								? "instant"
								: "smooth",
						})
					}
					aria-label={t.top}
				>
					<Icon name="left" />
				</button>
			</nav>
		</footer>
	);
}
