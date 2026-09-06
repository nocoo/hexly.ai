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
	if (compact)
		return (
			<span
				className="palette-mini"
				role="img"
				aria-label={`${t.palette}: ${colors.map((swatch) => swatch.color).join(", ")}`}
			>
				{colors.map((swatch) => (
					<span
						key={`${swatch.role}-${swatch.color}`}
						className={swatch.color === "transparent" ? "checkerboard" : ""}
						style={{ backgroundColor: swatch.color }}
						title={swatch.color}
					/>
				))}
			</span>
		);
	return (
		<div className="palette-swatches">
			{colors.map((swatch) => (
				<button
					type="button"
					key={`${swatch.role}-${swatch.color}`}
					className="palette-swatch"
					onClick={() => onCopy?.(swatch.color)}
					aria-label={`${t.copyColor} ${swatch.color}`}
					title={swatch.source}
				>
					<span
						className={`swatch-color ${swatch.color === "transparent" ? "checkerboard" : ""}`}
						style={{ backgroundColor: swatch.color }}
					/>
					<span className="swatch-value">
						{swatch.color === "transparent" ? t.transparent : swatch.color}
					</span>
					<span className="swatch-role">
						{swatch.label?.[locale] ?? t[swatch.role]}
					</span>
				</button>
			))}
		</div>
	);
}
