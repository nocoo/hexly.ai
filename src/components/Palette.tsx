import { copy } from "../data/copy";
import type { Locale, PaletteColor, Project } from "../model/project";

export function Palette({
	project,
	locale,
	compact = false,
	colors = project.colors.palette,
	onCopy,
}: {
	project: Project;
	locale: Locale;
	compact?: boolean;
	colors?: PaletteColor[];
	onCopy?: (value: string) => void;
}) {
	const t = copy[locale];
	const swatches = Array.from(
		new Map(colors.map((swatch) => [JSON.stringify(swatch), swatch])),
	);
	if (compact)
		return (
			<span
				className="palette-mini"
				role="img"
				aria-label={`${t.palette}: ${swatches.map(([, swatch]) => swatch.color).join(", ")}`}
			>
				{swatches.map(([key, swatch]) => (
					<span
						key={key}
						className={swatch.color === "transparent" ? "checkerboard" : ""}
						style={{ backgroundColor: swatch.color }}
						title={swatch.color}
					/>
				))}
			</span>
		);
	return (
		<div className="palette-swatches">
			{swatches.map(([key, swatch]) => {
				const value =
					swatch.color === "transparent" ? t.transparent : swatch.color;
				const role = swatch.label?.[locale] ?? t[swatch.role];
				return (
					<button
						type="button"
						key={key}
						className="palette-swatch"
						onClick={() => onCopy?.(swatch.color)}
						title={swatch.source}
					>
						<span
							className={`swatch-color ${swatch.color === "transparent" ? "checkerboard" : ""}`}
							style={{ backgroundColor: swatch.color }}
							aria-hidden="true"
						/>
						<span className="sr-only">{`${t.copyColor} `}</span>
						<span className="swatch-value">{value}</span>
						<span className="swatch-role">{role}</span>
					</button>
				);
			})}
		</div>
	);
}
