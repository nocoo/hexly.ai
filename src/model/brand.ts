import { assetUrl } from "./assets";
import type { Locale, Project, TextureDescription, Theme } from "./project";

type Kit = NonNullable<Project["brandKit"]>;

export function rasterBrand(kit: Kit) {
	return kit.method === "gpt-image-2" || kit.method === "archived-artwork";
}

export function brandFormat(
	kit: Kit,
	asset: "mark" | "wordmark" | "lockup" | "icon",
) {
	return rasterBrand(kit) && asset !== "wordmark" ? "png" : "svg";
}

export function brandAsset(
	kit: Kit,
	asset: "mark" | "wordmark" | "lockup" | "icon",
	theme: Theme,
) {
	return `${kit.root}/${asset}-${theme}.${brandFormat(kit, asset)}`;
}

export function projectTexture(
	project: Pick<Project, "brandKit" | "brandTexture">,
) {
	if (project.brandTexture) return project.brandTexture;
	const kit = project.brandKit;
	return kit?.texture ? { root: kit.root, ...kit.texture } : undefined;
}

export function brandTexture(
	project: Pick<Project, "brandKit" | "brandTexture">,
) {
	// Older raster kits shipped SVG surfaces before named texture metadata existed.
	const texture =
		projectTexture(project) ??
		(project.brandKit && rasterBrand(project.brandKit)
			? { root: project.brandKit.root }
			: undefined);
	return texture
		? {
				"--brand-texture-light": `url("${assetUrl(brandTextureAsset(texture, "light", !!project.brandTexture))}")`,
				"--brand-texture-dark": `url("${assetUrl(brandTextureAsset(texture, "dark", !!project.brandTexture))}")`,
				"--brand-texture-opacity": project.brandTexture?.surfaceOpacity ?? 0.45,
			}
		: undefined;
}

export function brandTextureAsset(
	texture: Pick<TextureDescription, "format"> & { root: string },
	theme: Theme,
	preview = false,
) {
	return `${texture.root}/texture-${theme}${preview ? "-320" : ""}.${texture.format ?? "svg"}`;
}

export function brandSourceLabel(project: Project, locale: Locale) {
	const zh = locale === "zh";
	if (project.brandKit?.method === undefined)
		return zh ? "原创矢量" : "Original vector";
	if (project.family?.method === "retained-original")
		return zh ? "保留原作" : "Retained original";
	if (project.family?.method === "reference-adaptation")
		return zh ? "提供插画适配" : "Supplied illustration";
	return project.family?.series === "material"
		? zh
			? "GPT Image · 实物"
			: "GPT Image · Object"
		: zh
			? "GPT Image · 动物"
			: "GPT Image · Animal";
}
