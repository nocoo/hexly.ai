import examples from "../data/template-examples.json" with { type: "json" };
import { assetUrl } from "./assets";
import type { Locale, Project } from "./project";
import { siteOrigin } from "./routes";
import { healthEndpoint } from "./status";
import { findVideo, videoManifest } from "./videos";

/** The legacy example index and the reusable library share the same asset records. */
export const standardOutros = {
	schemaVersion: 1,
	collection: examples.collection,
	version: examples.version,
	kitVersion: examples.kitVersion,
	usage: "reuse-as-is",
	projectIndependent: true,
	source: examples.source,
	outros: examples.examples,
} as const;

export function outroInstructions(
	outro: (typeof standardOutros.outros)[number],
) {
	return `# Use the Hexly standard outro: ${outro.video.title.en}

Use this existing brand-only ending in any Hexly project. Download and append the original clip; no project configuration or regeneration is required. The template/ending IDs describe its source composition, not a restriction on which project or content layout can use it.

- MP4: ${outro.video.src}
- SHA-256: ${outro.video.sha256}
- Version: ${outro.video.version}
- Format: ${outro.width} × ${outro.height}, ${outro.fps} fps, ${outro.video.durationSeconds} seconds; light theme; no audio or transparency.
- 4K still: ${outro.still.src}
- Still SHA-256: ${outro.still.sha256}
- Poster: ${outro.video.poster}
- Manifest: ${siteOrigin}/templates/outros.json

Verify the downloaded SHA-256, then place the full clip at the end of your timeline. Preserve the Logo, wordmark, original colors, framing and timing. Keep project-specific captions and content outside this standard ending. Account for the silent ending when editing the project's audio. Use the existing full-canvas 4K still for a deck closing slide.

The still was rendered from the matching HTML composition, not extracted from MP4. Preserve source attribution and the recorded Hexly MIT / font OFL notices. Production provenance: https://github.com/nocoo/hexly.ai/blob/main/${outro.video.source}
`;
}

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
		title = `${project.title} — project and identity`;
		instructions.push(
			project.description.en,
			`Project ID: ${project.id}. Catalogue state: ${project.archived ? "archived" : "active"}. This is not a product release or health assertion.`,
			`Repository: ${project.repository}\nWebsite: ${project.website ?? "not listed"}`,
			`Original project identity: ${assetUrl(project.logo.original)}\nOriginal SHA-256: ${project.logo.sha256}\nSource: ${project.logo.sourceUrl}`,
			"Reuse the approved downloadable files. Preserve the original Logo geometry, proportions, colors and bytes. Hexly campaign styling belongs to this archive and Hexly promotional material; the product's own palette and UI remain independent.",
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
		if (project.brandKit) {
			instructions.push(
				`Brand kit: v${project.brandKit.version}. Read its manifest roles and license records before choosing official identity versus Hexly campaign artwork. Verify the selected files against that manifest.`,
			);
			resources.push({
				label: "Brand asset manifest",
				href: assetUrl(`${project.brandKit.root}/manifest.json`),
			});
		}
		for (const video of project.media?.videos ?? [])
			instructions.push(
				`Project recording: ${video.title.en}\nMP4: ${assetUrl(video.src)}\nSHA-256: ${video.sha256}\nVersion: ${video.version}`,
			);
		const endpoint = healthEndpoint(project);
		if (endpoint)
			instructions.push(
				`Public health endpoint: ${endpoint}. Read fresh observations; a login page or redirect is not healthy.`,
			);
		resources.push({
			label: "Project catalogue JSON",
			href: `${siteOrigin}/data/projects.json`,
		});
	} else if (path === "/templates" || path.startsWith("/templates/")) {
		const template = findVideo(path.split("/")[2]);
		title = template
			? `${template.title} — Hexly templates`
			: "Hexly templates and standard outros";
		instructions.push(
			"Standard outros are ready-to-use, project-independent brand clips. Choose any of the five and append its existing MP4 to any Hexly project. No new generation, project setup or template-specific rendering is needed to use these endings.",
			"All five published clips are light, silent, six-second 1920 × 1080 / 30 fps files. Each also has a full-canvas HTML-rendered 4K still for deck slides. Project/theme selectors change the separate live composition preview, not these immutable clips. There are no published dark or intro MP4s in this library.",
			...standardOutros.outros.map(
				(outro) =>
					`### ${outro.video.title.en}\nID: ${outro.video.id}\nMP4: ${outro.video.src}\nSHA-256: ${outro.video.sha256}\n4K still: ${outro.still.src}`,
			),
			"Preserve the full frame, Hexly Logo/wordmark, colors and timing. Verify file hashes against the standard-outro manifest. Keep product-specific copy outside the standard clip and handle its silent audio tail in your editing timeline.",
			"## Configurable content\nThe separate Video Kit supplies five openings, five content layouts and five endings in both themes. Reuse the existing components; configure your project content instead of rebuilding a template. Browser previews are lightweight; final video/deck exports run locally.",
		);
		if (template)
			instructions.push(
				`${template.title}: ${template.description.en}\nBest for: ${template.use.en}`,
			);
		const selected = projects.find(
			(item) => item.id === url.searchParams.get("project"),
		);
		const opening =
			videoManifest.openings.find(
				(item) => item.id === url.searchParams.get("opening"),
			)?.id ?? "signal";
		const ending =
			videoManifest.endings.find(
				(item) => item.id === url.searchParams.get("ending"),
			)?.id ?? "signature";
		const theme = url.searchParams.get("theme") === "dark" ? "dark" : "light";
		const command = `bun run video:render -- --locale ${locale} --project ${selected?.id ?? "hexly-ai"} --template ${template?.id ?? "launch"} --theme ${theme} --opening ${opening} --ending ${ending}`;
		instructions.push(
			`To render new project content, fetch the published revision from ${siteOrigin}/api/live and pin that Git SHA when obtaining packages/video-kit. Follow the kit README for dependencies and licenses. From the Hexly checkout:\n\n\`\`\`sh\n${command} --mode video\n${command} --mode deck\n\`\`\`\n\nThese commands render a new composition, not the standard outros above. Keep output in the default ignored .video-work directory. If the preview uses a local screenshot, download its setup and render with --props /path/to/setup.json to preserve that image.`,
		);
		resources.push(
			{
				label: "Standard outro files and hashes",
				href: `${siteOrigin}/templates/outros.json`,
			},
			{
				label: "Component manifest",
				href: `${siteOrigin}/templates/manifest.json`,
			},
			{
				label: "Film parameter schema",
				href: `${siteOrigin}/templates/film-v2.schema.json`,
			},
			{
				label: "Video Kit guide and source",
				href: "https://github.com/nocoo/hexly.ai/tree/main/packages/video-kit",
			},
		);
	} else if (path === "/status") {
		title = "Hexly service status";
		instructions.push(
			"Read GET /api/status for the latest stored observations. The catalogue is the target source: non-archived independent HTTPS websites, using their exact origin plus /api/live.",
			"Checks run every five minutes. Keep only seven days of history. Timestamps, buckets, retention and availability calculations use UTC; the browser's time zone only changes display.",
			"Preserve the returned statuses and observation times. Missing or stale checks are unknown. Redirects, HTML and login pages are never healthy. Do not claim a fresh observation from this static guide. Local development uses labelled mock data, never production health evidence.",
		);
		resources.push(
			{ label: "Status observations JSON", href: `${siteOrigin}/api/status` },
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
			"Use existing project recordings when media.videos is present. Otherwise omit the video section. Standard Hexly outros are already rendered and can be used across projects without regeneration.",
		);
		resources.push(
			{
				label: "Project catalogue JSON",
				href: `${siteOrigin}/data/projects.json`,
			},
			{
				label: "Standard outro files and hashes",
				href: `${siteOrigin}/templates/outros.json`,
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
