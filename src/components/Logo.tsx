import type { CSSProperties } from "react";
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
	const pixels = size <= 16 ? 32 : size <= 32 ? 64 : size <= 80 ? 160 : 1024;
	const src = project.family
		? `${project.family.root}/icon-${pixels}.webp`
		: `/logos/display/${project.id}-${pixels}.webp`;
	return (
		<span
			className={`${framed ? "logo-tile" : "logo-plain"} ${project.family ? "logo-family" : ""} ${className}`}
			style={style}
		>
			<img
				src={src}
				width={size * 2}
				height={size * 2}
				alt=""
				loading={eager ? "eager" : "lazy"}
				decoding="async"
				draggable={false}
			/>
		</span>
	);
}
