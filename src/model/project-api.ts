import { assetUrl } from "./assets";
import type { Locale, Project } from "./project";
import { siteOrigin } from "./routes";

export const projectApiPrefix = "/api/projects";

export interface ProjectLogoVariant {
	id: string;
	url: string;
	width: number;
	height: number;
	format: string;
	background: "transparent" | "opaque" | "original";
	role: "project-identity" | "hexly-campaign";
	usage: "original" | "navigation" | "presentation" | "apple-touch-icon";
	theme: "any" | "light" | "dark";
}

export function projectOwner(project: Pick<Project, "repository">) {
	return new URL(project.repository).pathname.split("/")[1] ?? "";
}

export function projectApiPath(project: Pick<Project, "repository" | "repo">) {
	return `${projectApiPrefix}/${encodeURIComponent(projectOwner(project).toLowerCase())}/${encodeURIComponent(project.repo.toLowerCase())}`;
}

export function projectApi(project: Project) {
	const logos: ProjectLogoVariant[] = [];
	const add = (
		id: string,
		path: string,
		width: number,
		height: number,
		background: ProjectLogoVariant["background"],
		role: ProjectLogoVariant["role"],
		usage: ProjectLogoVariant["usage"],
		theme: ProjectLogoVariant["theme"] = "any",
	) => {
		logos.push({
			id,
			url: assetUrl(path),
			width,
			height,
			format: path.split(".").at(-1) ?? "",
			background,
			role,
			usage,
			theme,
		});
	};
	add(
		"original",
		project.logo.original,
		project.logo.width,
		project.logo.height,
		"original",
		"project-identity",
		"original",
	);
	for (const size of [32, 64, 160, 256, 512, 1024]) {
		add(
			`identity-${size}`,
			`/logos/display/${project.id}-${size}.webp`,
			size,
			size,
			project.logo.kind === "emoji" ? "transparent" : "original",
			"project-identity",
			"navigation",
		);
	}
	const family = project.family;
	if (family) {
		const role =
			family.foreground.sha256 === project.logo.sha256
				? "project-identity"
				: "hexly-campaign";
		add(
			"foreground-original",
			family.foreground.original,
			family.foreground.width,
			family.foreground.height,
			"transparent",
			role,
			"navigation",
		);
		add(
			"foreground-1024",
			family.foreground.display,
			1024,
			1024,
			"transparent",
			role,
			"navigation",
		);
		for (const size of [32, 64, 160, 256, 512, 1024]) {
			add(
				`background-${size}`,
				`${family.root}/icon-${size}.webp`,
				size,
				size,
				"opaque",
				"hexly-campaign",
				"presentation",
			);
		}
		add(
			"background-original",
			`${family.root}/icon.png`,
			family.foreground.width,
			family.foreground.height,
			"opaque",
			"hexly-campaign",
			"presentation",
		);
		add(
			"white-original",
			`${family.root}/white.png`,
			family.foreground.width,
			family.foreground.height,
			"opaque",
			"hexly-campaign",
			"presentation",
			"light",
		);
		if (project.brandKit?.method === "archived-artwork") {
			const root = project.brandKit.root;
			for (const size of [16, 24, 32, 48, 64, 128, 256, 512]) {
				add(
					`transparent-${size}`,
					`${root}/mark-${size}.png`,
					size,
					size,
					"transparent",
					role,
					"navigation",
				);
			}
			for (const theme of ["light", "dark"] as const) {
				add(
					`tile-${theme}-512`,
					`${root}/icon-${theme}-512.png`,
					512,
					512,
					"opaque",
					"hexly-campaign",
					"presentation",
					theme,
				);
			}
			add(
				"apple-touch-icon",
				`${root}/apple-touch-icon.png`,
				180,
				180,
				"opaque",
				"hexly-campaign",
				"apple-touch-icon",
				"light",
			);
		}
	}
	const icon = (size: number) =>
		logos.find(
			(logo) =>
				logo.width === size &&
				logo.background === "transparent" &&
				logo.role === "project-identity",
		)?.url ?? assetUrl(`/logos/display/${project.id}-${size}.webp`);
	return {
		schemaVersion: 1,
		id: project.id,
		owner: projectOwner(project),
		repo: project.repo,
		title: project.title,
		description: project.description,
		emoji: project.emoji,
		category: project.category,
		archived: project.archived,
		github: project.repository,
		website: project.website,
		url: `${siteOrigin}/projects/${project.id}`,
		icons: { small: icon(64), large: icon(512) },
		logos,
		brand: {
			manifest: project.brandKit
				? assetUrl(`${project.brandKit.root}/manifest.json`)
				: null,
			source: project.logo.sourceUrl,
			originalSha256: project.logo.sha256,
		},
	};
}

export type ProjectApi = ReturnType<typeof projectApi>;

export function projectApiPrompt(
	project: Pick<Project, "repo" | "title" | "repository">,
	locale: Locale,
) {
	const endpoint = `${siteOrigin}${projectApiPath(project)}`;
	return `Integrate ${project.title} using the Hexly single-project identity API.

GET ${endpoint}
No authentication. Public CORS. Request exactly one GitHub owner/repository pair; include the owner in the path and preserve repository dots and hyphens. Owner and repository names are case-insensitive. Current projects belong to nocoo; never assume that owner for future integrations. No list, batch, search or query parameters. Do not fetch the full catalogue.

Example:
const response = await fetch(${JSON.stringify(endpoint)});
if (!response.ok) throw new Error(\`Hexly API HTTP \${response.status}\`);
const project = await response.json();
const title = project.title;
const description = project.description.${locale};
const github = project.github;
const icon = project.icons.small;

Expect a single JSON object: schemaVersion (1), id (Hexly slug), owner (GitHub user or organization), repo (GitHub repository name), title, description {en, zh}, emoji, category, archived, github, website (string or null), url (Hexly detail page), icons {small, large}, logos[], and brand {manifest, source, originalSha256}. Use owner/repo together as the integration key. Small/large icons are 64/512px. Each logo has id, url, width, height, format, background, role, usage and theme. URLs are absolute HTTPS CDN URLs; use the returned URLs unchanged and preserve aspect ratio with object-fit: contain. Use textContent or framework text bindings for text, not innerHTML.

Logo selection:
- Prefer icons.small for a 24–32px header/sidebar and icons.large for a larger project card. These preserve the project identity, never silently adopting a different campaign drawing.
- For navigation and browser favicons, select role="project-identity", background="transparent", usage="navigation". Prefer a PNG matching the required resolution (16/32px favicon; roughly 2x CSS size for high-DPI UI). Do not add a background tile, mask, shadow, crop or recolor the mark.
- Opaque presentation variants are intended for README artwork, promotional cards and large standalone illustrations. Choose theme="light" or "dark" for the surrounding surface; theme="any" preserves its original presentation. Use usage="apple-touch-icon" only when an opaque platform icon is needed.
- role="hexly-campaign" is separately labelled artwork for Hexly-related presentation. It does not authorize replacing the product's own Logo, favicon, colors or UI. Check brand.manifest and its license/provenance before adopting campaign materials.
- background="original" preserves the source background; transparency is not guaranteed. Some projects only have original/emoji assets. Missing variants are unavailable: do not fabricate URLs or claim transparency. Use icons.small/large as supplied when no suitable transparent identity exists.
- Keep original geometry, colors, bytes, licenses and provenance. brand.originalSha256 verifies the original logo only, not its derivatives. Do not regenerate or upload new logos for this integration.

Cache successful metadata for at most one hour. Edge responses also cache for one hour; previously cached metadata may remain visible for up to one hour after deployment. Do not cache failures as project data. A 404 means unknown repository; 400 means invalid request; 405 means unsupported method; 503 means temporarily unavailable. Handle network failures, nullable website and archived projects explicitly. An entry is not proof of service health. No polling or credentials are needed.

Verify the integrated title, ${locale} description, GitHub destination, logo aspect ratio, light/dark contrast, mobile layout and failure state. Fetch current metadata rather than copying the preview as permanent configuration.
`;
}
