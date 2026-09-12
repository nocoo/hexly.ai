import type { Locale, Project, Theme } from "./project";

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

export function brandTexture(kit: Project["brandKit"]) {
	return kit && rasterBrand(kit)
		? {
				"--brand-texture-light": `url("${kit.root}/texture-light.svg")`,
				"--brand-texture-dark": `url("${kit.root}/texture-dark.svg")`,
			}
		: undefined;
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
