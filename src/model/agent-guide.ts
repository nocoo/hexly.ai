import { brandCopy, brandSizes } from "../data/brand-copy";
import { assetUrl } from "./assets";
import { projectTexture } from "./brand";
import { isChromeWebStoreProject } from "./catalogue";
import type { Locale, Project } from "./project";
import { projectApiPath, projectApiPrompt } from "./project-api";
import { siteOrigin } from "./routes";
import { healthEndpoint } from "./status";

export function agentGuidePath(pagePath: string) {
	const path = new URL(pagePath, siteOrigin).pathname.replace(/\/+$/, "");
	return `/agents/${path ? path.slice(1) : "index"}.md`;
}

export function agentGuide(
	pagePath: string,
	projects: Project[],
	locale: Locale = "en",
) {
	const url = new URL(pagePath, siteOrigin);
	const path = url.pathname.replace(/\/+$/, "") || "/";
	const project = projects.find((item) => path === `/projects/${item.id}`);
	const resources: { label: string; href: string }[] = [];
	const instructions: string[] = [];
	let title = "Hexly project catalogue";
	if (project) {
		instructions.push(projectApiPrompt(project, locale));
		resources.push({
			label: "Single-project identity API",
			href: `${siteOrigin}${projectApiPath(project)}`,
		});
		title = `${project.title} — project and identity`;
		instructions.push(
			project.description.en,
			`Project ID: ${project.id}. Catalogue state: ${project.archived ? "archived" : "active"}. This is not a product release or health assertion.`,
			`Repository: ${project.repository}\n${isChromeWebStoreProject(project) ? "Install from Chrome Web Store" : "Website"}: ${project.website ?? "not listed"}`,
			project.logo.kind === "candidate"
				? `Hexly review candidate (not adopted by the source project): ${assetUrl(project.logo.original)}\nCandidate SHA-256: ${project.logo.sha256}\nStudy: ${project.logo.sourceUrl}`
				: `Original project identity: ${assetUrl(project.logo.original)}\nOriginal SHA-256: ${project.logo.sha256}\nSource: ${project.logo.sourceUrl}`,
			"Reuse the approved downloadable files. Preserve the original Logo geometry, proportions, colors and bytes. Hexly campaign styling belongs to this archive and Hexly promotional material; the product's own palette and UI remain independent.",
		);
		if (project.archived)
			instructions.push(
				"Archived project: basic support only. Preserve existing pages, links, downloads, licenses and provenance, including already completed artwork. Exclude this project from bulk redesign, new brand/media generation and gap-filling unless the owner explicitly requests it by name.",
			);
		if (project.family) {
			const family = project.family;
			const supplied = !!family.method;
			instructions.push(
				`Family artwork: ${assetUrl(family.foreground.original)}\nFamily SHA-256: ${family.foreground.sha256}\nRecorded adoption state: ${family.status}. Do not treat a review candidate as an adopted product identity.`,
			);
			resources.push({
				label: supplied ? "Presentation brief" : "Exact generation prompt",
				href: assetUrl(`${family.root}/${supplied ? "brief" : "prompt"}.txt`),
			});
			instructions.push(
				supplied
					? "The archived text is a presentation brief for retained/supplied artwork, not a generation prompt."
					: "The exact generation prompt is a historical source record. Read it for context; adopting the existing assets does not require running it again.",
			);
		}
		if (project.presentationIcon) {
			resources.push({
				label: "Current textured icon manifest",
				href: assetUrl(`${project.presentationIcon.root}/manifest.json`),
			});
			instructions.push(
				"Use the current rounded presentation as delivered on Hexly pages. Original foreground geometry/colors are preserved. iOS and Apple touch files are opaque squares for platform masking. Native dimensions and resampling are recorded in the icon manifest; source-product adoption remains separate.",
			);
		}
		if (project.brandKit) {
			instructions.push(
				`Brand kit: v${project.brandKit.version}. Read its manifest roles and license records before choosing official identity versus Hexly campaign artwork. Verify the selected files against that manifest.`,
			);
			resources.push({
				label: "Brand asset manifest",
				href: assetUrl(`${project.brandKit.root}/manifest.json`),
			});
		}
		const texture = projectTexture(project);
		if (texture?.model) {
			instructions.push(
				`Current decorative surface: ${texture.name.en}, generated with ${texture.model}. Reuse its approved PNG/WebP; it is separate from the original Logo. Display one complete canvas without repetition or cropping. Exact light/dark prompts and generation receipts are in the texture archive.`,
			);
			for (const theme of ["light", "dark"])
				resources.push(
					{
						label: `${theme} surface: original PNG`,
						href: assetUrl(`${texture.root}/texture-${theme}.png`),
					},
					{
						label: `Exact ${theme} surface prompt`,
						href: assetUrl(`${texture.root}/texture-${theme}-prompt.txt`),
					},
				);
			if (project.brandTexture) {
				instructions.push(
					`Texture pack v${project.brandTexture.version} has its own version, independent of the identity kit and application. Existing kit textures remain historical. Keep the active pack's manifest and use its measured surface opacity ${project.brandTexture.surfaceOpacity} on a separate background layer; Logo and text stay fully opaque.`,
				);
				resources.push(
					{
						label: "Active texture manifest and hashes",
						href: assetUrl(`${texture.root}/manifest.json`),
					},
					{
						label: "Texture usage and license",
						href: assetUrl(`${texture.root}/guide.md`),
					},
				);
			}
		}
		for (const video of project.media?.videos ?? [])
			instructions.push(
				`Project recording: ${video.title.en}\nMP4: ${assetUrl(video.src)}\nSHA-256: ${video.sha256}\nVersion: ${video.version}`,
			);
		for (const shot of project.media?.screenshots ?? []) {
			instructions.push(
				`Project screenshot: ${shot.alt.en}\nOriginal: ${assetUrl(shot.src)}\nDimensions: ${shot.width} × ${shot.height}${shot.preview ? `\nPage preview: ${assetUrl(shot.preview)}` : ""}${shot.thumbnail ? `\nThumbnail: ${assetUrl(shot.thumbnail)}` : ""}\nPreserve the full image and its original product colors; these are product materials, not a new Logo or a product-release assertion.`,
			);
			if (shot.source)
				resources.push({
					label: `Screenshot ${shot.id}: source, license and SHA-256 receipts`,
					href: `https://github.com/nocoo/hexly.ai/blob/main/${shot.source}`,
				});
		}
		const endpoint = healthEndpoint(project);
		if (endpoint)
			instructions.push(
				`Public health endpoint: ${endpoint}. Read fresh observations; a login page or redirect is not healthy.`,
			);
		resources.push({
			label: "Project catalogue JSON",
			href: `${siteOrigin}/data/projects.json`,
		});
	} else if (path === "/brand") {
		title = "Hexly brand usage";
		instructions.push(
			...brandCopy[locale].rules,
			`The Brand page shows the transparent mark at ${brandSizes.join(", ")} CSS pixels, horizontal and stacked signatures, a wordmark-only treatment, and paper, ivory, dark and transparent surfaces.`,
			"The standard wordmark uses Space Grotesk: the name at weight 600, the domain suffix at weight 400, and the site's terracotta point. Keep the existing site colors and do not invent new palettes for these examples.",
			"App-icon specimens show light and dark square artwork plus an Apple-style continuous-corner approximation. Keep actual platform deliveries square and unmasked; the app platform owns its final mask. Do not apply this presentation mask to transparent header or favicon marks.",
			"Reuse published identity files from the catalogue and verify their recorded hashes. Local development may show a selected, unpublished candidate; a local preview does not authorize an upload or establish a public asset URL.",
		);
		resources.push(
			{
				label: "Hexly identity archive",
				href: `${siteOrigin}/projects/hexly-ai#brand`,
			},
			{
				label: "Design tokens and layout contract",
				href: "https://github.com/nocoo/hexly.ai/blob/main/docs/42-site-design-system.md",
			},
			{
				label: "Published project catalogue",
				href: `${siteOrigin}/data/projects.json`,
			},
		);
	} else if (path === "/status") {
		title = "Hexly service status";
		instructions.push(
			"Read GET /api/status for the latest stored observations. Targets are non-archived independent HTTPS catalogue websites plus lizheng.dev, lizheng.me and hexly.ai, using each exact origin plus /api/live. Worker domains are excluded. Firefly monitors lizheng.blog; Ellie monitors bbs.tongji.net. The three additional sites appear last with the Hexly identity.",
			"Checks run every five minutes. Keep only seven days of history. Timestamps, buckets, retention and availability calculations use UTC; the browser's time zone only changes display.",
			"Preserve the returned statuses and observation times. Missing or stale checks are unknown. Redirects, HTML and login pages are never healthy. Do not claim a fresh observation from this static guide. Local development uses labelled mock data, never production health evidence.",
		);
		resources.push(
			{ label: "Status observations JSON", href: `${siteOrigin}/api/status` },
			{
				label: "Monitored endpoints JSON",
				href: `${siteOrigin}/data/status-targets.json`,
			},
			{
				label: "Project catalogue JSON",
				href: `${siteOrigin}/data/projects.json`,
			},
		);
	} else {
		if (path === "/logos") title = "Hexly identity gallery";
		instructions.push(
			"Use the project catalogue JSON as the source of truth for IDs, bilingual descriptions, repositories, websites, identity records and optional media. Follow each /projects/<id> page and its agent guide for exact asset URLs and hashes.",
			"The default directory excludes archived projects. An entry being listed does not prove its product is released or its website is healthy. Read the status API for observed health.",
			"Reuse original brand assets and preserve their geometry, proportions, colors, license and provenance. Hexly campaign artwork is labelled separately from official project identity. Do not recolor a project's Logo or transfer the Hexly promotional palette into its product UI.",
			"Use existing project recordings when media.videos is present. Otherwise omit the video section.",
			"Optional media.screenshots contains ordered product previews. Use preview/thumbnail derivatives for browsing, src for the full-resolution original, and source for versioned provenance and hashes. Preserve aspect ratios and omit this section when the list is absent or empty.",
			"Optional brandTexture selects an independently versioned Hexly campaign surface; otherwise use brandKit.texture. Follow each project's Agent guide for the active light/dark PNGs, exact prompts and manifest. Reuse accepted textures as whole canvases and keep original identity colors, product UI and archived state unchanged.",
		);
		resources.push(
			{
				label: "Project catalogue JSON",
				href: `${siteOrigin}/data/projects.json`,
			},
			{ label: "Share metadata", href: `${siteOrigin}/api/share.json` },
		);
	}
	return {
		path: agentGuidePath(path),
		resources,
		body: `# ${title}\n\nPage: ${siteOrigin}${path}${url.search}${url.hash}\n\n${instructions.join("\n\n")}\n\n## Sources\n\n${resources.map((resource) => `- [${resource.label}](${resource.href})`).join("\n")}\n- [Agent index](${siteOrigin}/llms.txt)\n- [Published site version and revision](${siteOrigin}/api/live)\n`,
	};
}
