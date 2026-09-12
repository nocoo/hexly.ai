import {
	brandAsset,
	brandFormat,
	brandSourceLabel,
	rasterBrand,
} from "../model/brand";
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
	const themes = kit.hero.themed
		? (["light", "dark"] as const)
		: (["light"] as const);
	return (
		<figure className="brand-hero">
			{themes.map((theme) => (
				<picture
					key={theme}
					className={kit.hero?.themed ? `logo-theme-${theme}` : undefined}
				>
					<source
						media="(max-width: 640px)"
						srcSet={`${kit.root}/hero-square${theme === "dark" ? "-dark" : ""}.webp`}
						width={1024}
						height={1024}
					/>
					<img
						src={`${kit.root}/hero${theme === "dark" ? "-dark" : ""}.webp`}
						width={kit.hero?.width}
						height={kit.hero?.height}
						alt={kit.hero?.alt[locale]}
						fetchPriority="high"
						decoding="async"
					/>
				</picture>
			))}
			<figcaption>
				<span>{kit.hero.caption[locale]}</span>
				{themes.map((theme) => (
					<a
						key={theme}
						className={kit.hero?.themed ? `logo-theme-${theme}` : undefined}
						href={`${kit.root}/hero${theme === "dark" ? "-dark" : ""}.png`}
						download
					>
						{locale === "zh" ? "下载图像" : "Download artwork"} ↗
					</a>
				))}
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
	const raster = rasterBrand(kit);
	const collected = kit.method === "archived-artwork";
	return (
		<section className="brand-kit" aria-label={label}>
			<div className="brand-kit-intro">
				<p className="eyebrow">
					HEXLY FAMILY / {project.title} / v{kit.version}
				</p>
				<p>{kit.description[locale]}</p>
				{collected && (
					<p className="brand-scope-note">
						{zh
							? "Hexly 宣发档案 · 页面与宣发色系属于 Hexly，项目标志保留原色；不改变产品站点的色板或主题。"
							: "Hexly campaign archive · Page and campaign colors belong to Hexly. Project marks retain their original colors; product-site palettes and themes remain independent."}
					</p>
				)}
			</div>
			{collected && (
				<p className="brand-official-source">
					<img
						src={project.logo.original}
						alt=""
						width={32}
						height={32}
						loading="lazy"
					/>
					<span>
						{zh ? "项目身份 · 原始文件" : "Project identity · Original bytes"}
					</span>
					<a href={project.logo.original} download>
						{zh ? "下载原始 Logo" : "Download original Logo"} ↓
					</a>
				</p>
			)}
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
								width={kit.lockup?.width ?? 454}
								height={kit.lockup?.height ?? 192}
								alt={`${project.title} — ${theme === "light" ? (zh ? "浅色字标组合" : "light logo and wordmark") : zh ? "深色字标组合" : "dark logo and wordmark"}`}
							/>
						</a>
						<figcaption>
							Space Grotesk 600 · {theme === "light" ? "#30372e" : "#e6e9dc"}
							{!raster && ` / ${theme === "light" ? "#bf5c3c" : "#e79670"}`}
						</figcaption>
					</figure>
				))}
			</div>
			{kit.texture && (
				<section
					className="brand-texture-study"
					aria-label={zh ? "底纹设计" : "Texture design"}
				>
					<div className="review-section-heading">
						<h3>{kit.texture.name[locale]}</h3>
						<p>{kit.texture.description[locale]}</p>
					</div>
					<div className="brand-texture-specimens">
						{(["light", "dark"] as const).map((theme) => (
							<figure key={theme} className={`brand-kit-${theme}`}>
								<div
									style={{
										backgroundImage: `url("${kit.root}/texture-${theme}.svg")`,
									}}
								/>
								<figcaption>
									<span>
										{theme === "light"
											? zh
												? "浅纸"
												: "Paper"
											: zh
												? "夜纸"
												: "Night"}
									</span>
									<a href={`${kit.root}/texture-${theme}.svg`} download>
										SVG ↓
									</a>
								</figcaption>
							</figure>
						))}
					</div>
				</section>
			)}
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
						{raster
							? zh
								? `${brandSourceLabel(project, locale)} · 转曲字标 · 透明 PNG · 多尺寸 ICO`
								: `${brandSourceLabel(project, locale)} · Outlined type · Transparent PNG · Multi-size ICO`
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
								{name} <small>{brandFormat(kit, file).toUpperCase()}</small>
							</span>
							<a
								href={brandAsset(kit, file, "light")}
								download
								aria-label={`${name} ${brandFormat(kit, file).toUpperCase()} — ${zh ? "浅色" : "light"}`}
							>
								{zh ? "浅色" : "Light"} ↓
							</a>
							<a
								href={brandAsset(kit, file, "dark")}
								download
								aria-label={`${name} ${brandFormat(kit, file).toUpperCase()} — ${zh ? "深色" : "dark"}`}
							>
								{zh ? "深色" : "Dark"} ↓
							</a>
						</div>
					))}
				</div>
				<div className="download-links">
					{[
						...(raster
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
					<a href={`${kit.root}/license.txt`}>
						{zh ? "许可与来源" : "License & source"}
					</a>{" "}
					·{" "}
					<a href={`${kit.root}/space-grotesk-ofl.txt`}>
						Space Grotesk / SIL OFL 1.1
					</a>
				</p>
				<p className="review-caption">
					{collected
						? zh
							? "已有主视觉完整保留；Hero 为独立版式合成，未重新生成图像。本次品牌包由 Hexly 发布，产品仓库与原有采用记录保持独立。"
							: "Existing artwork preserved in full. Heroes are authored compositions, with no new image generation. This Hexly kit is published independently of product repositories and their prior adoption records."
						: kit.sourceAdoptionRevision
							? zh
								? "源项目已记录资产集成版本。"
								: "Asset adoption is recorded in the source project."
							: zh
								? `${raster ? "GPT Image 2 生成动物主视觉" : "Hexly 原创矢量档案"}；源项目集成由 ${project.title} 团队独立完成。`
								: `${raster ? "Animal artwork generated with GPT Image 2" : "Original Hexly vector archive"}; source-project integration is a separate handoff.`}
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
