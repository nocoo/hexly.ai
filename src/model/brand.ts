import type { Project, Theme } from "./project";

type Kit = NonNullable<Project["brandKit"]>;

export function brandAsset(
	kit: Kit,
	asset: "mark" | "wordmark" | "lockup" | "icon",
	theme: Theme,
) {
	const format =
		kit.method === "gpt-image-2" && asset !== "wordmark" ? "png" : "svg";
	return `${kit.root}/${asset}-${theme}.${format}`;
}

export function brandTexture(kit: Project["brandKit"]) {
	return kit?.method === "gpt-image-2"
		? {
				"--brand-texture-light": `url("${kit.root}/texture-light.svg")`,
				"--brand-texture-dark": `url("${kit.root}/texture-dark.svg")`,
			}
		: undefined;
}
