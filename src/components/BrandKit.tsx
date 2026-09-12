import type { Locale, Project } from "../model/project";
import "../styles/brand-kits.css";

export function BrandKit({
	project,
	kit,
	locale,
}: {
	project: Project;
	kit: NonNullable<Project["brandKit"]>;
	locale: Locale;
}) {
	const zh = locale === "zh";
	const label = zh ? "品牌资产" : "Brand assets";
	return (
		<section className="brand-kit" aria-label={label}>
			<div className="brand-kit-intro">
				<p className="eyebrow">
					HEXLY FAMILY / {project.title} / v{kit.version}
				</p>
				<p>{kit.description[locale]}</p>
			</div>
			<div className="brand-kit-specimens">
				{(["light", "dark"] as const).map((theme) => (
					<figure key={theme} className={`brand-kit-${theme}`}>
						<span className="eyebrow">
							{theme === "light"
								? zh
									? "01 / 纸上"
									: "01 / Paper"
								: zh
									? "02 / 夜间"
									: "02 / After hours"}
						</span>
						<a href={`${kit.root}/lockup-${theme}.svg`} download>
							<img
								src={`${kit.root}/lockup-${theme}.svg`}
								width={454}
								height={192}
								alt={`${project.title} — ${theme === "light" ? (zh ? "浅色字标组合" : "light logo and wordmark") : zh ? "深色字标组合" : "dark logo and wordmark"}`}
							/>
						</a>
						<figcaption>
							Space Grotesk 600 ·{" "}
							{theme === "light" ? "#30372e / #bf5c3c" : "#e6e9dc / #e79670"}
						</figcaption>
					</figure>
				))}
			</div>
			<div className="direction-grid">
				{kit.guidelines.map((item, index) => (
					<article key={item.title.en}>
						<p className="eyebrow">
							0{index + 1} / {zh ? "使用规范" : "Usage"}
						</p>
						<h3>{item.title[locale]}</h3>
						<p>{item.description[locale]}</p>
					</article>
				))}
			</div>
			<div className="brand-kit-downloads">
				<div className="review-section-heading">
					<h3>{label}</h3>
					<p>
						{zh
							? "原生 SVG · 透明 PNG · 真实多尺寸 ICO"
							: "Native SVG · Transparent PNG · Multi-size ICO"}
					</p>
				</div>
				<div className="brand-kit-assets">
					{[
						["mark", zh ? "标志" : "Mark"],
						["wordmark", zh ? "字标" : "Wordmark"],
						["lockup", zh ? "组合" : "Lockup"],
						["icon", zh ? "图标" : "App icon"],
					].map(([file, name]) => (
						<div key={file}>
							<span>
								{name} <small>SVG</small>
							</span>
							<a
								href={`${kit.root}/${file}-light.svg`}
								download
								aria-label={`${name} SVG — ${zh ? "浅色" : "light"}`}
							>
								{zh ? "浅色" : "Light"} ↓
							</a>
							<a
								href={`${kit.root}/${file}-dark.svg`}
								download
								aria-label={`${name} SVG — ${zh ? "深色" : "dark"}`}
							>
								{zh ? "深色" : "Dark"} ↓
							</a>
						</div>
					))}
				</div>
				<div className="download-links">
					{[
						["favicon.svg", "Favicon SVG"],
						["favicon.ico", "Favicon ICO"],
						["logo-light.png", zh ? "浅色 PNG" : "Light PNG"],
						["logo-dark.png", zh ? "深色 PNG" : "Dark PNG"],
						["apple-touch-icon.png", "Apple touch"],
						[
							"manifest.json",
							zh ? "全部文件与 SHA-256" : "All files & SHA-256",
						],
					].map(([file, name]) => (
						<a key={file} href={`${kit.root}/${file}`} download>
							{name}
							<span aria-hidden="true">↓</span>
						</a>
					))}
				</div>
				<p className="brand-kit-provenance">
					<a href={`${kit.root}/guide.md`}>
						{zh ? "完整规范与集成方式" : "Usage & integration"} ↗
					</a>
					<a href={`${kit.root}/review.html`}>
						{zh ? "独立品牌样张" : "Standalone specimens"} ↗
					</a>
					<a href={`${kit.root}/license.txt`}>MIT</a> ·{" "}
					<a href={`${kit.root}/space-grotesk-ofl.txt`}>
						Space Grotesk / SIL OFL 1.1
					</a>
				</p>
				<p className="review-caption">
					{kit.sourceAdoptionRevision
						? zh
							? "源项目已记录资产集成版本。"
							: "Asset adoption is recorded in the source project."
						: zh
							? `Hexly 原创矢量档案；源项目集成由 ${project.title} 团队独立完成。`
							: "Original Hexly vector archive; source-project integration is a separate handoff."}
				</p>
			</div>
		</section>
	);
}
