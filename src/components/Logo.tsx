import type { CSSProperties } from "react";
import { assetUrl } from "../model/assets";
import type { Project } from "../model/project";

export function Logo({
	project,
	size = 80,
	framed = true,
	foreground = false,
	className = "",
	eager = false,
}: {
	project: Project;
	size?: number;
	framed?: boolean;
	foreground?: boolean;
	className?: string;
	eager?: boolean;
}) {
	const style = {
		"--logo-size": `${size}px`,
		"--project-color": project.colors.primary,
		"--project-background": project.colors.background,
	} as CSSProperties;
	const pixels =
		size <= 16
			? 32
			: size <= 32
				? 64
				: size <= 80
					? 160
					: size <= 128
						? 256
						: size <= 256
							? 512
							: 1024;
	const composed = foreground ? undefined : project.presentationIcon;
	const src =
		foreground && project.family
			? project.family.foreground.display
			: composed
				? `${composed.root}/rounded-${pixels}.webp`
				: project.family
					? framed
						? `${project.family.root}/icon-${pixels}.webp`
						: project.family.foreground.display
					: project.logo.display.replace(/1024\.webp$/, `${pixels}.webp`);
	const kit =
		project.family || project.presentationIcon ? undefined : project.brandKit;
	const kitAsset = framed && !foreground ? "icon" : "mark";
	const cover =
		!foreground &&
		!project.family &&
		!kit &&
		!composed &&
		project.logo.fit === "cover";
	return (
		<span
			className={`${cover ? "logo-plain logo-cover" : composed ? "logo-plain logo-composed" : `${framed ? "logo-tile" : "logo-plain"} ${(project.family || kit) && framed ? "logo-family" : ""}`} ${className}`}
			style={
				cover
					? ({
							...style,
							"--logo-zoom": `${project.logo.zoom ?? 1}`,
						} as CSSProperties)
					: style
			}
		>
			<img
				src={assetUrl(kit ? `${kit.root}/${kitAsset}-light.svg` : src)}
				className={kit ? "logo-theme-light" : undefined}
				width={size}
				height={size}
				alt=""
				loading={eager ? "eager" : "lazy"}
				decoding="async"
				draggable={false}
			/>
			{kit && (
				<img
					className="logo-theme-dark"
					src={assetUrl(`${kit.root}/${kitAsset}-dark.svg`)}
					width={size}
					height={size}
					alt=""
					loading={eager ? "eager" : "lazy"}
					decoding="async"
					draggable={false}
				/>
			)}
		</span>
	);
}
