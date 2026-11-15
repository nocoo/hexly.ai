import { brandCopy, brandSizes } from "../data/brand-copy";
import { agentGuide } from "../model/agent-guide";
import type { Locale, Project } from "../model/project";
import { BrandMark, BrandWordmark } from "./BrandIdentity";
import { CopyButton } from "./CopyButton";
import { PageHero } from "./PageHero";
import "../styles/brand-page.css";

export function BrandPage({
	locale,
	projects,
}: {
	locale: Locale;
	projects: Project[];
}) {
	const t = brandCopy[locale];
	const guide = agentGuide("/brand", projects, locale);
	return (
		<main className="shell brand-page" id="main-content">
			<PageHero
				className="brand-intro"
				headingId="brand-title"
				eyebrow={t.eyebrow}
				title={
					<>
						{t.heroFirst}
						<br />
						<span className="outline-word">{t.heroSecond}</span>
						<span className="headline-period">
							{locale === "zh" ? "。" : "."}
						</span>
					</>
				}
				description={t.description}
				artwork={
					<div className="hero-art hero-art-brand" aria-hidden="true">
						<span className="orbit orbit-one" />
						<span className="orbit orbit-two" />
						<span className="orbit orbit-three" />
						<div className="brand-hero-specimen">
							<svg viewBox="0 0 160 160" width="160" height="160">
								<title>Hexly mark grid</title>
								<line
									x1="80"
									y1="8"
									x2="80"
									y2="152"
									className="brand-hero-guide"
								/>
								<line
									x1="8"
									y1="80"
									x2="152"
									y2="80"
									className="brand-hero-guide"
								/>
								<rect
									x="24"
									y="24"
									width="112"
									height="112"
									rx="26"
									className="brand-hero-frame"
								/>
								<rect
									x="42"
									y="42"
									width="76"
									height="76"
									rx="18"
									className="brand-hero-inset"
								/>
								<rect
									x="62"
									y="62"
									width="36"
									height="36"
									rx="9"
									className="brand-hero-core"
								/>
							</svg>
							<div className="brand-hero-swatches">
								<span className="swatch-paper" />
								<span className="swatch-ivory" />
								<span className="swatch-terracotta" />
							</div>
						</div>
						<span className="hero-art-caption">
							<span />
							{t.heroNote}
							<span />
						</span>
					</div>
				}
			>
				<nav className="brand-section-links" aria-label={t.title}>
					<a href="#sizes">{t.sizes}</a>
					<a href="#lockups">{t.lockups}</a>
					<a href="#app-icons">{t.appIcons}</a>
					<a href="#surfaces">{t.surfaces}</a>
				</nav>
			</PageHero>

			<section
				className="brand-section"
				id="sizes"
				aria-labelledby="brand-sizes-title"
			>
				<div className="brand-section-heading">
					<h2 id="brand-sizes-title">{t.sizes}</h2>
					<p>{t.sizesHint}</p>
				</div>
				<div className="brand-size-grid">
					{brandSizes.map((size) => (
						<figure
							className="brand-specimen brand-size"
							data-size={size}
							key={size}
						>
							<div className="brand-size-stage">
								<BrandMark size={size} />
							</div>
							<figcaption className="mono">
								{size} × {size} px
							</figcaption>
						</figure>
					))}
				</div>
			</section>

			<section
				className="brand-section"
				id="lockups"
				aria-labelledby="brand-lockups-title"
			>
				<div className="brand-section-heading">
					<h2 id="brand-lockups-title">{t.lockups}</h2>
					<p>{t.lockupsHint}</p>
				</div>
				<div className="brand-lockup-grid">
					<figure className="brand-specimen">
						<div className="brand-lockup-stage">
							<div className="brand-lockup">
								<BrandMark size={64} />
								<span className="brand-wordmark">
									<BrandWordmark />
								</span>
							</div>
						</div>
						<figcaption>{t.horizontal}</figcaption>
					</figure>
					<figure className="brand-specimen">
						<div className="brand-lockup-stage">
							<div className="brand-lockup brand-lockup-stacked">
								<BrandMark size={128} />
								<span className="brand-wordmark">
									<BrandWordmark />
								</span>
							</div>
						</div>
						<figcaption>{t.stacked}</figcaption>
					</figure>
					<figure className="brand-specimen">
						<div className="brand-lockup-stage">
							<span className="brand-wordmark brand-wordmark-alone">
								<BrandWordmark />
							</span>
						</div>
						<figcaption>{t.wordmark}</figcaption>
					</figure>
				</div>
			</section>

			<section
				className="brand-section"
				id="app-icons"
				aria-labelledby="brand-app-icons-title"
			>
				<div className="brand-section-heading">
					<h2 id="brand-app-icons-title">{t.appIcons}</h2>
					<p>{t.appIconsHint}</p>
				</div>
				<div className="brand-app-grid">
					{(["light", "dark"] as const).flatMap((theme) =>
						(["square", "rounded"] as const).map((shape) => (
							<figure className="brand-specimen" key={`${theme}-${shape}`}>
								<div className="brand-app-stage">
									<div
										className="brand-app-icon"
										data-theme={theme}
										data-shape={shape}
									>
										<BrandMark size={160} />
									</div>
								</div>
								<figcaption>
									{t[theme]} · {t[shape]}
								</figcaption>
							</figure>
						)),
					)}
				</div>
			</section>

			<section
				className="brand-section"
				id="surfaces"
				aria-labelledby="brand-surfaces-title"
			>
				<div className="brand-section-heading">
					<h2 id="brand-surfaces-title">{t.surfaces}</h2>
					<p>{t.surfacesHint}</p>
				</div>
				<div className="brand-surface-grid">
					{(["paper", "ivory", "night", "transparent"] as const).map(
						(surface) => (
							<figure className="brand-specimen" key={surface}>
								<div
									className={`brand-surface brand-surface-${surface}`}
									data-theme={
										surface === "night"
											? "dark"
											: surface === "transparent"
												? undefined
												: "light"
									}
								>
									<div className="brand-lockup brand-lockup-stacked">
										<BrandMark size={128} />
										<span className="brand-wordmark">
											<BrandWordmark />
										</span>
									</div>
								</div>
								<figcaption>{t[surface]}</figcaption>
							</figure>
						),
					)}
				</div>
			</section>

			<section
				className="brand-section brand-usage"
				id="agent-guide"
				aria-labelledby="brand-usage-title"
			>
				<h2 id="brand-usage-title">{t.usage}</h2>
				<ul>
					{t.rules.map((rule) => (
						<li key={rule}>{rule}</li>
					))}
				</ul>
				<details className="brand-agent-guide">
					<summary>{t.instructions}</summary>
					<pre>{guide.body}</pre>
				</details>
				<div className="brand-guide-links">
					<CopyButton text={guide.body} locale={locale} label={t.guide} />
					<a href={guide.path}>{t.markdown} ↗</a>
					<a href="/projects/hexly-ai#brand">{t.archive} ↗</a>
				</div>
			</section>
		</main>
	);
}
