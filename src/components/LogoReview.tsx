import { type CSSProperties, useState } from "react";
import { categoryLabels, copy } from "../data/copy";
import { destination } from "../model/catalogue";
import type { Locale, Project } from "../model/project";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { LogoArchive } from "./LogoArchive";
import { Palette } from "./Palette";

export function LogoReview({
	project,
	locale,
	onCopy,
}: {
	project: Project;
	locale: Locale;
	onCopy: (value: string) => void;
}) {
	const t = copy[locale];
	const { family } = project;
	const [view, setView] = useState<"icon" | "transparent" | "white">("icon");
	const tileStyle = {
		"--identity-background": project.colors.background,
		"--family-background": family
			? `url("${family.root}/background-1024.webp")`
			: "none",
	} as CSSProperties;
	const currentImage =
		family && view === "icon"
			? `${family.root}/icon-1024.webp`
			: project.logo.display;
	const currentDownload =
		family && view !== "transparent"
			? `${family.root}/${view === "icon" ? "icon" : "white"}.png`
			: project.logo.original;

	return (
		<div className="logo-review" data-presentation={view}>
			<section aria-label={t.artwork}>
				<div className="comparison-toolbar">
					<p>{family ? t.comparisonDescription : t.artwork}</p>
					<fieldset className="view-switch" aria-label={t.presentation}>
						{(["icon", "transparent", "white"] as const).map((value) => (
							<button
								type="button"
								key={value}
								aria-pressed={view === value}
								onClick={() => setView(value)}
							>
								{value === "white" ? t.pureWhite : t[value]}
							</button>
						))}
					</fieldset>
				</div>
				<div className={`comparison-grid ${family ? "" : "comparison-single"}`}>
					{family && (
						<figure className="previous-artwork">
							<div className="art-well">
								<a
									className="review-tile previous-tile"
									style={tileStyle}
									href={family.previous.original}
									target="_blank"
									rel="noreferrer"
									aria-label={`${t.openOriginal}: ${t.previousArtwork}`}
								>
									<img
										src={`${family.root}/previous-1024.webp`}
										alt={`${project.title} — ${t.previousArtwork}`}
										width={1024}
										height={1024}
									/>
								</a>
							</div>
							<figcaption>
								<strong>{t.previousArtwork}</strong>
								<a
									href={family.previous.sourceUrl}
									target="_blank"
									rel="noreferrer"
								>
									{t.previousSource} ↗
								</a>
							</figcaption>
						</figure>
					)}
					<figure className="current-artwork">
						<div className="art-well">
							<a
								className={`review-tile ${family ? "family-tile" : "baseline-tile"}`}
								style={tileStyle}
								href={currentDownload}
								target="_blank"
								rel="noreferrer"
								aria-label={t.openOriginal}
							>
								<img
									className="artwork-image"
									src={currentImage}
									width={1024}
									height={1024}
									alt={`${project.title} — ${project.subject}`}
									fetchPriority="high"
								/>
							</a>
						</div>
						<figcaption>
							<strong>{t.currentArtwork}</strong>
							<span>
								{family ? `${t.approved} · ${family.adopted}` : t.preserved}
							</span>
						</figcaption>
					</figure>
				</div>
			</section>

			{family && (
				<section className="direction-grid" aria-label={t.artDirection}>
					{family.direction.map((item, index) => (
						<article key={item.aspect}>
							<p className="eyebrow">
								0{index + 1} / {t[item.aspect]}
							</p>
							<h3>{item.title[locale]}</h3>
							<p>{item.description[locale]}</p>
						</article>
					))}
				</section>
			)}

			<section
				className="review-section size-section"
				aria-labelledby="size-title"
			>
				<div className="review-section-heading">
					<h3 id="size-title">{t.sizes}</h3>
					<p>{t.sizesDescription}</p>
				</div>
				<div className="size-grid">
					{(
						[
							[128, t.appIcon],
							[64, t.launcher],
							[32, t.sidebar],
							[16, t.favicon],
						] as const
					).map(([size, label]) => (
						<figure key={size}>
							<div className="size-well">
								<Logo project={project} size={size} eager />
							</div>
							<figcaption>
								<strong>{size} px</strong>
								<span>{label}</span>
							</figcaption>
						</figure>
					))}
				</div>
				<div className="context-grid">
					<div className="sidebar-sample">
						<span className="context-label">{t.sidebar} / 24 px</span>
						<div className="preview-workspace">
							<Logo project={project} size={24} framed={false} eager />
							<strong>{project.title}</strong>
							<span>{categoryLabels[locale][project.category]}</span>
						</div>
						<p>{project.description[locale]}</p>
					</div>
					<div className="browser-sample">
						<span className="context-label">{t.favicon} / 16 px</span>
						<div className="browser-tab">
							<Logo project={project} size={16} framed={false} eager />
							<span>{project.title}</span>
							<Icon name="close" />
						</div>
						<p className="browser-address">
							<Icon name="globe" />
							{new URL(destination(project)).hostname}
						</p>
					</div>
				</div>
				{family && <p className="review-caption">{family.sizeNote[locale]}</p>}
			</section>

			<section
				className="review-section palette-section"
				aria-labelledby="palette-title"
			>
				<div className="review-section-heading">
					<h3 id="palette-title">{t.palette}</h3>
					<p>{family ? t.familyPaletteDescription : t.paletteDescription}</p>
				</div>
				<Palette
					project={project}
					locale={locale}
					colors={family?.palette}
					onCopy={onCopy}
				/>
				<p className="review-caption">{t.copyHint}</p>
				{family && (
					<p className="theme-palette">
						{t.themePalette}
						<span>
							<i style={{ backgroundColor: project.colors.primary }} />
							{project.colors.primary}
						</span>
						<span>
							<i style={{ backgroundColor: project.colors.background }} />
							{project.colors.background}
						</span>
					</p>
				)}
			</section>

			<section
				className="review-section alpha-section"
				aria-labelledby="alpha-title"
			>
				<div className="review-section-heading">
					<h3 id="alpha-title">{t.alphaTitle}</h3>
					<p>{t.alphaDescription}</p>
				</div>
				<div className="alpha-grid">
					{(["light", "dark"] as const).map((surface) => (
						<figure key={surface}>
							<a
								className={`alpha-well alpha-${surface}`}
								href={project.logo.original}
								target="_blank"
								rel="noreferrer"
								aria-label={`${t.openOriginal}: ${surface === "light" ? t.white : t.black}`}
							>
								<img
									src={project.logo.display}
									alt={`${project.title} — ${surface === "light" ? t.lightSetting : t.darkSetting}`}
									loading="lazy"
									width={1024}
									height={1024}
								/>
							</a>
							<figcaption>
								<strong>{surface === "light" ? t.white : t.black}</strong>
								<span>
									{surface === "light" ? t.lightSetting : t.darkSetting}
								</span>
							</figcaption>
						</figure>
					))}
				</div>
			</section>
			{family && (
				<LogoArchive family={family} project={project} locale={locale} />
			)}
		</div>
	);
}
