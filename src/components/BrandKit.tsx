import { brandAsset } from "../model/brand";
import type { Locale, Project } from "../model/project";
import "../styles/brand-kits.css";

export function BrandHero({
	kit,
	locale,
}: {
	kit: NonNullable<Project["brandKit"]>;
	locale: Locale;
}) {
	if (!kit.hero) return null;
	return (
		<figure className="brand-hero">
			<picture>
				<source
					media="(max-width: 640px)"
					srcSet={`${kit.root}/hero-square.webp`}
					width={1024}
					height={1024}
				/>
				<img
					src={`${kit.root}/hero.webp`}
					width={kit.hero.width}
					height={kit.hero.height}
					alt={kit.hero.alt[locale]}
					fetchPriority="high"
					decoding="async"
				/>
			</picture>
			<figcaption>
				<span>{kit.hero.caption[locale]}</span>
				<a href={`${kit.root}/hero.png`} download>
					{locale === "zh" ? "下载图像" : "Download artwork"} ↗
				</a>
			</figcaption>
		</figure>
	);
}

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
	const generated = kit.method === "gpt-image-2";
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
						<a href={brandAsset(kit, "lockup", theme)} download>
							<img
								src={brandAsset(kit, "lockup", theme)}
								width={454}
								height={192}
								alt={`${project.title} — ${theme === "light" ? (zh ? "浅色字标组合" : "light logo and wordmark") : zh ? "深色字标组合" : "dark logo and wordmark"}`}
							/>
						</a>
						<figcaption>
							Space Grotesk 600 · {theme === "light" ? "#30372e" : "#e6e9dc"}
							{!generated && ` / ${theme === "light" ? "#bf5c3c" : "#e79670"}`}
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
						{generated
							? zh
								? "GPT Image 图像 · 转曲字标 · 透明 PNG · 多尺寸 ICO"
								: "GPT Image artwork · Outlined type · Transparent PNG · Multi-size ICO"
							: zh
								? "原生 SVG · 透明 PNG · 真实多尺寸 ICO"
								: "Native SVG · Transparent PNG · Multi-size ICO"}
					</p>
				</div>
				<div className="brand-kit-assets">
					{(
						[
							["mark", zh ? "标志" : "Mark"],
							["wordmark", zh ? "字标" : "Wordmark"],
							["lockup", zh ? "组合" : "Lockup"],
							["icon", zh ? "图标" : "App icon"],
						] as const
					).map(([file, name]) => (
						<div key={file}>
							<span>
								{name}{" "}
								<small>
									{generated && file !== "wordmark" ? "PNG" : "SVG"}
								</small>
							</span>
							<a
								href={brandAsset(kit, file, "light")}
								download
								aria-label={`${name} ${generated && file !== "wordmark" ? "PNG" : "SVG"} — ${zh ? "浅色" : "light"}`}
							>
								{zh ? "浅色" : "Light"} ↓
							</a>
							<a
								href={brandAsset(kit, file, "dark")}
								download
								aria-label={`${name} ${generated && file !== "wordmark" ? "PNG" : "SVG"} — ${zh ? "深色" : "dark"}`}
							>
								{zh ? "深色" : "Dark"} ↓
							</a>
						</div>
					))}
				</div>
				<div className="download-links">
					{[
						...(generated
							? [
									["logo.png", zh ? "透明主文件" : "Transparent master"],
									["hero.png", zh ? "原幅 Hero" : "Full-frame hero"],
									["texture-light.svg", zh ? "浅色底纹" : "Paper texture"],
									["texture-dark.svg", zh ? "深色底纹" : "Night texture"],
								]
							: [["favicon.svg", "Favicon SVG"]]),
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
							? `${generated ? "GPT Image 2 生成动物主视觉" : "Hexly 原创矢量档案"}；源项目集成由 ${project.title} 团队独立完成。`
							: `${generated ? "Animal artwork generated with GPT Image 2" : "Original Hexly vector archive"}; source-project integration is a separate handoff.`}
				</p>
				{kit.previousVersion && (
					<p className="review-caption">
						<a
							href={`/brands/${project.id}/v${kit.previousVersion}/review.html`}
						>
							{zh ? "历史版本" : "Previous identity"} · v{kit.previousVersion} ↗
						</a>
						{" · "}
						{zh
							? "原始资产与来源记录完整保留。"
							: "Original assets and provenance preserved."}
					</p>
				)}
			</div>
		</section>
	);
}
