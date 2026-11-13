export type HeroObjectKind = "projects" | "templates" | "brand" | "status";

export const heroObjectKinds: HeroObjectKind[] = [
	"projects",
	"templates",
	"brand",
	"status",
];

export const heroObjectPalette = {
	ink: "#30372e",
	moss: "#76816a",
	paper: "#f0f0e9",
	ivory: "#f8f8f2",
	accent: "#bf5c3c",
	line: "#d4d8cb",
};

const orientations: Record<HeroObjectKind, readonly [number, number, number]> =
	{
		projects: [0.06, -0.15, -0.04],
		templates: [0.03, -0.2, -0.05],
		brand: [0.04, -0.12, -0.08],
		status: [0, -0.18, 0.04],
	};

export function heroObjectPose(
	kind: HeroObjectKind,
	seconds: number,
	moving: boolean,
) {
	const [x, y, z] = orientations[kind];
	const time = moving && Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
	return {
		x: x + Math.sin(time * 0.45) * 0.025,
		y: y + Math.sin(time * 0.32) * 0.045,
		z: z + Math.sin(time * 0.26) * 0.012,
		lift: Math.sin(time * 0.55) * 0.025,
	};
}

export function shouldAnimateHero(
	intersecting: boolean,
	documentVisible: boolean,
	reducedMotion: boolean,
	renderer: "webgl" | "svg",
) {
	return (
		intersecting && documentVisible && !reducedMotion && renderer === "webgl"
	);
}
