import { createHash } from "node:crypto";
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
			].join("|"),
		)
		.digest("hex");
}

/** Fingerprint of the home share card, which uses the hexly.ai identity. */
export const siteCardKey = "site";
