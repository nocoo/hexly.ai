import { copy } from "../data/copy";
import identity from "../data/site-identity.json" with { type: "json" };
import { filterProjects } from "./catalogue";
import type { Locale, Project } from "./project";

export const siteOrigin = "https://hexly.ai";

export const homeTitle = "hexly.ai — A little universe of projects";
export const homeDescription =
	"A personal collection of useful tools, playful experiments, and colorful identities. Built by Zheng Li.";
export const homeHeading = "Small ideas A little universe.";
export const galleryTitle = "Logo gallery — hexly.ai";

export interface DiscoveryPage {
	path: string;
	title: string;
	description: string;
	canonical: string;
	image: string;
	imageAlt: string;
	heading: string;
	bodyHtml: string;
	jsonLd: unknown;
}

const surfaces = [
	{ href: "https://lizheng.me/en/", name: "Play" },
	{ href: "https://lizheng.blog/", name: "Journal" },
	{ href: "https://lizheng.dev/en/", name: "Résumé" },
	{ href: `${siteOrigin}/`, name: "Portfolio" },
] as const;

export function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

export function absoluteUrl(path: string): string {
	return path === "/" ? `${siteOrigin}/` : `${siteOrigin}${path}`;
}

export function socialImage(project?: Project): string {
	if (!project) return `${siteOrigin}/og.jpg`;
	return `${siteOrigin}/og/${project.id}.jpg`;
}

export interface ShareImage {
	url: string;
	type: "image/jpeg";
	width: number;
	height: number;
	alt: string;
}

export interface ShareCard {
	id: string;
	name: string;
	emoji: string;
	title: string;
	description: Record<Locale, string>;
	canonical: string;
	image: ShareImage;
	twitterCard: "summary_large_image";
	siteName: string;
	website: string | null;
	repository: string;
	archived: boolean;
}

export interface ShareIndex {
	origin: string;
	docs: string;
	site: string;
	projects: { id: string; name: string; href: string }[];
}

function shareImage(url: string, alt: string): ShareImage {
	return {
		url,
		type: "image/jpeg",
		width: 1200,
		height: 630,
		alt,
	};
}

export function siteShareCard(): ShareCard {
	return {
		id: identity.id,
		name: identity.title,
		emoji: identity.emoji,
		title: homeTitle,
		description: {
			en: homeDescription,
			zh: copy.zh.heroDescription,
		},
		canonical: `${siteOrigin}/`,
		image: shareImage(socialImage(), "hexly.ai mark on warm paper"),
		twitterCard: "summary_large_image",
		siteName: "hexly.ai",
		website: identity.website,
		repository: identity.repository,
		archived: false,
	};
}

export function projectShareCard(project: Project): ShareCard {
	return {
		id: project.id,
		name: project.title,
		emoji: project.emoji,
		title: `${project.title} — hexly.ai`,
		description: project.description,
		canonical: absoluteUrl(`/logos/${project.id}`),
		image: shareImage(socialImage(project), `${project.title} identity`),
		twitterCard: "summary_large_image",
		siteName: "hexly.ai",
		website: project.website,
		repository: project.repository,
		archived: project.archived,
	};
}

export function shareIndex(projects: Project[]): ShareIndex {
	return {
		origin: siteOrigin,
		docs: "https://github.com/nocoo/hexly.ai/blob/main/docs/10-social-share.md",
		site: absoluteUrl(`/api/share/${identity.id}.json`),
		projects: projects.map((project) => ({
			id: project.id,
			name: project.title,
			href: absoluteUrl(`/api/share/${project.id}.json`),
		})),
	};
}

export function shareFiles(
	projects: Project[],
): { fileName: string; source: string }[] {
	const json = (value: unknown) => `${JSON.stringify(value)}\n`;
	return [
		{ fileName: "api/share.json", source: json(shareIndex(projects)) },
		{
			fileName: `api/share/${identity.id}.json`,
			source: json(siteShareCard()),
		},
		...projects.map((project) => ({
			fileName: `api/share/${project.id}.json`,
			source: json(projectShareCard(project)),
		})),
	];
}

export function pageForPath(
	pathname: string,
	projects: Project[],
): DiscoveryPage {
	const path = pathname.replace(/\/$/, "") || "/";
	const match = /^\/logos(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?$/.exec(path);
	if (!match) return homePage(projects);
	const id = match[1];
	if (!id) return galleryPage(projects);
	const project = projects.find((entry) => entry.id === id);
	return project ? projectPage(project) : galleryPage(projects);
}

export function discoveryPages(projects: Project[]): DiscoveryPage[] {
	return [
		homePage(projects),
		galleryPage(projects),
		...projects.map((project) => projectPage(project)),
	];
}

export function sitemapXml(pages: DiscoveryPage[]): string {
	const urls = pages
		.map((page) => `<url><loc>${escapeHtml(page.canonical)}</loc></url>`)
		.join("");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`;
}

export function llmsDocument(projects: Project[]): string {
	const visible = filterProjects(projects, "", "all");
	const archived = filterProjects(projects, "", "archive");
	const link = (project: Project, locale: "en" | "zh") =>
		`- [${project.title}](${absoluteUrl(`/logos/${project.id}`)}): ${project.description[locale]}`;
	return `# ${homeTitle}

> ${homeDescription}
>
> ${copy.zh.heroDescription}

Public pages welcome search and AI crawlers. JavaScript is not required to read this file, the sitemap, or the HTML snapshots.

## English

- [hexly.ai](${siteOrigin}/): ${homeDescription}
- [Logo gallery](${siteOrigin}/logos): ${copy.en.galleryDescription}

${visible.map((project) => link(project, "en")).join("\n")}

## 中文

- [hexly.ai](${siteOrigin}/): ${copy.zh.heroDescription}
- [Logo 图鉴](${siteOrigin}/logos): ${copy.zh.galleryDescription}

${visible.map((project) => link(project, "zh")).join("\n")}

## Archived

${archived.map((project) => link(project, "en")).join("\n")}

## Related sites

- [Play](https://lizheng.me/en/): Personal website with interactive devices. [中文](https://lizheng.me/zh/)
- [Journal](https://lizheng.blog/): Essays and notes.
- [Résumé](https://lizheng.dev/en/): Professional identity and engineering leadership. [中文](https://lizheng.dev/zh/)

## Discovery

- [Sitemap](${siteOrigin}/sitemap.xml)
- [Crawler policy](${siteOrigin}/robots.txt)
- [Project catalogue JSON](${siteOrigin}/data/projects.json)
- [Share metadata API](${siteOrigin}/api/share.json)
`;
}

export function applyPageToHtml(html: string, page: DiscoveryPage): string {
	const json = JSON.stringify(page.jsonLd).replaceAll("<", "\\u003c");
	let next = html;
	next = replaceTag(
		next,
		/<title>[^<]*<\/title>/,
		`<title>${escapeHtml(page.title)}</title>`,
	);
	next = replaceMeta(next, "description", page.description, "name");
	next = replaceMeta(next, "og:title", page.title, "property");
	next = replaceMeta(next, "og:description", page.description, "property");
	next = replaceMeta(next, "og:url", page.canonical, "property");
	next = replaceMeta(next, "og:image", page.image, "property");
	next = replaceMeta(
		next,
		"og:image:type",
		page.image.endsWith(".jpg") ? "image/jpeg" : "image/png",
		"property",
	);
	next = replaceMeta(next, "og:image:alt", page.imageAlt, "property");
	next = replaceMeta(next, "twitter:title", page.title, "name");
	next = replaceMeta(next, "twitter:description", page.description, "name");
	next = replaceMeta(next, "twitter:image", page.image, "name");
	next = replaceMeta(next, "twitter:image:alt", page.imageAlt, "name");
	next = next.replace(
		/<link rel="canonical" href="[^"]*"\s*\/?>/,
		`<link rel="canonical" href="${escapeHtml(page.canonical)}" />`,
	);
	if (next.includes('type="application/ld+json"'))
		next = next.replace(
			/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
			`<script type="application/ld+json">${json}</script>`,
		);
	else
		next = next.replace(
			"</head>",
			`<script type="application/ld+json">${json}</script>\n</head>`,
		);
	next = next.replace(
		/<noscript>[\s\S]*?<\/noscript>/,
		"<noscript>hexly.ai is a collection of projects by Zheng Li. JavaScript is optional; this page already includes the heading and project list.</noscript>",
	);
	next = next.replace(
		/<div id="root">[\s\S]*?<\/div>/,
		`<div id="root">${page.bodyHtml}</div>`,
	);
	return next;
}

function homePage(projects: Project[]): DiscoveryPage {
	const visible = filterProjects(projects, "", "all");
	return {
		path: "/",
		title: homeTitle,
		description: homeDescription,
		canonical: `${siteOrigin}/`,
		image: socialImage(),
		imageAlt: "hexly.ai mark on warm paper",
		heading: homeHeading,
		bodyHtml: snapshotHtml(homeHeading, homeDescription, "/", visible),
		jsonLd: {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebSite",
					"@id": `${siteOrigin}/#website`,
					url: `${siteOrigin}/`,
					name: "hexly.ai",
					description: homeDescription,
					publisher: { "@id": "https://lizheng.me/#person" },
				},
				{
					"@type": "CollectionPage",
					"@id": `${siteOrigin}/#collection`,
					url: `${siteOrigin}/`,
					name: homeTitle,
					description: homeDescription,
					isPartOf: { "@id": `${siteOrigin}/#website` },
					mainEntity: itemList(visible, "Active projects"),
					hasPart: itemList(
						filterProjects(projects, "", "archive"),
						"Archived projects",
					),
				},
			],
		},
	};
}

function galleryPage(projects: Project[]): DiscoveryPage {
	const visible = filterProjects(projects, "", "all");
	const description = copy.en.galleryDescription;
	return {
		path: "/logos",
		title: galleryTitle,
		description,
		canonical: `${siteOrigin}/logos`,
		image: socialImage(),
		imageAlt: "hexly.ai identity collection",
		heading: copy.en.galleryTitle,
		bodyHtml: snapshotHtml(
			copy.en.galleryTitle,
			description,
			"/logos",
			visible,
		),
		jsonLd: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			url: `${siteOrigin}/logos`,
			name: galleryTitle,
			description,
			isPartOf: { "@id": `${siteOrigin}/#website` },
			mainEntity: itemList(visible, "Active identities"),
		},
	};
}

function projectPage(project: Project): DiscoveryPage {
	const path = `/logos/${project.id}`;
	const canonical = absoluteUrl(path);
	const image = socialImage(project);
	return {
		path,
		title: `${project.title} — hexly.ai`,
		description: project.description.en,
		canonical,
		image,
		imageAlt: `${project.title} identity`,
		heading: project.title,
		bodyHtml: snapshotHtml(
			`${project.title} ${project.emoji}`,
			project.description.en,
			path,
			[],
			project,
		),
		jsonLd: {
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			name: project.title,
			description: project.description.en,
			url: canonical,
			image,
			applicationCategory: project.category,
			author: { "@id": "https://lizheng.me/#person" },
			isPartOf: { "@id": `${siteOrigin}/#collection` },
		},
	};
}

function itemList(projects: Project[], name: string) {
	return {
		"@type": "ItemList",
		name,
		numberOfItems: projects.length,
		itemListElement: projects.map((project, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: absoluteUrl(`/logos/${project.id}`),
			name: project.title,
		})),
	};
}

function snapshotHtml(
	heading: string,
	description: string,
	current: string,
	projects: Project[],
	project?: Project,
): string {
	const nav = surfaces
		.map((surface) => {
			const currentAttr =
				surface.name === "Portfolio" && current.startsWith("/")
					? ' aria-current="true"'
					: "";
			return `<a href="${surface.href}"${currentAttr}>${surface.name}</a>`;
		})
		.join(" ");
	const items = project
		? `<p><a href="${escapeHtml(project.repository)}">GitHub</a>${project.website ? ` · <a href="${escapeHtml(project.website)}">${escapeHtml(project.website)}</a>` : ""}</p>`
		: `<ul>${projects
				.map(
					(entry) =>
						`<li><a href="/logos/${entry.id}">${escapeHtml(entry.title)}</a> — ${escapeHtml(entry.description.en)}</li>`,
				)
				.join("")}</ul>`;
	return `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p><nav>${nav}</nav>${items}</main>`;
}

function replaceMeta(
	html: string,
	key: string,
	value: string,
	kind: "name" | "property",
): string {
	const pattern = new RegExp(`<meta ${kind}="${key}" content="[^"]*"\\s*/?>`);
	return html.replace(
		pattern,
		`<meta ${kind}="${key}" content="${escapeHtml(value)}" />`,
	);
}

function replaceTag(html: string, pattern: RegExp, next: string): string {
	return html.replace(pattern, next);
}
