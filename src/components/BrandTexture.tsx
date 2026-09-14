import { assetUrl } from "../model/assets";
import { brandTextureAsset, projectTexture } from "../model/brand";
import type { Locale, Project } from "../model/project";
import { AssetLink } from "./AssetLink";

export function BrandTexture({
	project,
	locale,
}: {
	project: Project;
	locale: Locale;
}) {
	const texture = projectTexture(project);
	if (!texture) return null;
	const zh = locale === "zh";
	return (
		<section
			className="brand-texture-study"
			data-texture-display={texture.display}
			id="texture"
			aria-label={zh ? "底纹设计" : "Texture design"}
		>
			<div className="review-section-heading">
				<h3>{texture.name[locale]}</h3>
				<p>{texture.description[locale]}</p>
			</div>
			<div className="brand-texture-specimens">
				{(["light", "dark"] as const).map((theme) => (
					<figure key={theme} className={`brand-kit-${theme}`}>
						<div
							style={{
								backgroundImage: `url("${assetUrl(brandTextureAsset(texture, theme))}")`,
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
							<AssetLink
								href={
									texture.model
										? `${texture.root}/texture-${theme}.png`
										: brandTextureAsset(texture, theme)
								}
								download
							>
								{texture.model
									? "PNG"
									: (texture.format ?? "svg").toUpperCase()}{" "}
								↓
							</AssetLink>
						</figcaption>
					</figure>
				))}
			</div>
			{texture.model && (
				<p className="brand-kit-provenance">
					<span>
						GPT Image · {texture.model.endsWith("flare") ? "Flare" : "Sunburst"}
					</span>
					{(["light", "dark"] as const).map((theme) => (
						<AssetLink
							key={theme}
							href={`${texture.root}/texture-${theme}-prompt.txt`}
						>
							{zh
								? theme === "light"
									? "浅色原始 Prompt"
									: "深色原始 Prompt"
								: `${theme === "light" ? "Paper" : "Night"} generation prompt`}{" "}
							↗
						</AssetLink>
					))}
					{project.brandTexture && (
						<>
							<AssetLink href={`${texture.root}/manifest.json`}>
								{zh ? "底纹文件与哈希" : "Texture files & hashes"} ↗
							</AssetLink>
							<AssetLink href={`${texture.root}/guide.md`}>
								{zh ? "使用说明" : "Usage guide"} ↗
							</AssetLink>
							<AssetLink href={`${texture.root}/review.html`}>
								{zh ? "独立预览" : "Open specimens"} ↗
							</AssetLink>
						</>
					)}
				</p>
			)}
		</section>
	);
}
