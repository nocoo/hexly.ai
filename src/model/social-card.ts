import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import type { Project } from "./project";

/** Local artwork file that a share card renders for a project. */
export function socialCardIconPath(project: Project): string {
	return project.family
		? `public${project.family.root}/icon-1024.webp`
		: `public${project.logo.display}`;
}

/**
 * Everything a share card's pixels depend on, hashed together. `scripts/create-social.ts`
 * records it for each rendered card and the unit test recomputes it, so a title,
 * description, category, archive flag or icon change marks the card stale without
 * rendering anything.
 */
export function socialCardFingerprint(input: {
	key: string;
	title: string;
	description: string;
	category: string;
	archived: boolean;
	iconSha256: string;
	rendererSha256: string;
}): string {
	return createHash("sha256")
		.update(
			[
				input.key,
				input.title,
				input.description,
				input.category,
				input.archived,
				input.iconSha256,
				input.rendererSha256,
			].join("|"),
		)
		.digest("hex");
}

/** Fingerprint of the home share card, which uses the hexly.ai identity. */
export const siteCardKey = "site";

/**
 * A card fills its rounded tile when the artwork already covers the full square:
 * a family tile, or any opaque square image. Artwork with a transparent border
 * keeps a padding instead, so a small icon is not stretched edge to edge.
 */
export async function socialCardFillsTile(path: string): Promise<boolean> {
	const meta = await sharp(path).metadata();
	if (!meta.hasAlpha) return true;
	const { data, info } = await sharp(path)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const corner = (x: number, y: number) =>
		data[(y * info.width + x) * 4 + 3] ?? 0;
	const size = info.width;
	return (
		corner(1, 1) >= 250 &&
		corner(size - 2, 1) >= 250 &&
		corner(1, size - 2) >= 250 &&
		corner(size - 2, size - 2) >= 250
	);
}

/** The template, CSS and helper that determine every card's pixels. */
export async function socialCardRendererSha(): Promise<string> {
	const sources = await Promise.all(
		[
			"scripts/create-social.ts",
			"scripts/social.css",
			"src/model/social-card.ts",
		].map((file) => readFile(file)),
	);
	return createHash("sha256").update(Buffer.concat(sources)).digest("hex");
}
