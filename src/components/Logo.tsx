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
	const src =
		size <= 16
			? `/logos/display/${project.id}-32.webp`
			: size <= 32
				? `/logos/display/${project.id}-64.webp`
				: project.logo.thumbnail;
	return (
		<span
			className={`${framed ? "logo-tile" : "logo-plain"} ${className}`}
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
