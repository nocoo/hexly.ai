import type { CSSProperties } from "react";
import { assetUrl } from "../model/assets";
import type { Project } from "../model/project";

export function Logo({
	project,
	size = 80,
	framed = true,
	className = "",
	eager = false,
}: {
	project: Project;
	size?: number;
	framed?: boolean;
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
	const src = project.family
		? framed
			? `${project.family.root}/icon-${pixels}.webp`
			: project.family.foreground.display
		: `/logos/display/${project.id}-${pixels}.webp`;
	const kit = project.family ? undefined : project.brandKit;
	const kitAsset = framed ? "icon" : "mark";
	return (
		<span
			className={`${framed ? "logo-tile" : "logo-plain"} ${(project.family || kit) && framed ? "logo-family" : ""} ${className}`}
			style={style}
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
