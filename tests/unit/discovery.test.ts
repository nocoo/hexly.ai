import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import { filterProjects } from "../../src/model/catalogue";
import {
	absoluteUrl,
	applyPageToHtml,
	discoveryPages,
	escapeHtml,
	homeHeading,
	homeTitle,
	llmsDocument,
	pageForPath,
	projectShareCard,
	shareFiles,
	shareIndex,
	sitemapXml,
	siteShareCard,
	socialImage,
} from "../../src/model/discovery";
import { screenshotFixture, videoFixture } from "../fixtures/project-media";

const projects = readProjects();
const frogie = projects.find((project) => project.id === "frogie");
if (!frogie) throw new Error("Frogie is required.");
const visible = filterProjects(projects, "", "all");

const shell = `<!doctype html><html><head>
<title>old</title>
<meta name="description" content="old" />
<link rel="canonical" href="https://hexly.ai/" />
<meta property="og:title" content="old" />
<meta property="og:description" content="old" />
<meta property="og:url" content="https://hexly.ai/" />
<meta property="og:image" content="https://hexly.ai/og.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:alt" content="old" />
<meta name="twitter:title" content="old" />
<meta name="twitter:description" content="old" />
<meta name="twitter:image" content="https://hexly.ai/og.jpg" />
<meta name="twitter:image:alt" content="old" />
<script type="application/ld+json">{}</script>
</head><body><noscript>old</noscript><div id="root"></div></body></html>`;

describe("crawler discovery documents", () => {
	it("includes researched goals and stack in readable HTML with escaped copy", () => {
		const reviewed = {
			...frogie,
			overview: {
				goal: { en: "Inspect <routes> & proxies.", zh: "检查路由。" },
				techStack: [
					{ name: "Swift & SwiftUI", role: { en: "Native <app>", zh: "应用" } },
				],
				verified: {
					date: "2026-09-08",
					revision: "a".repeat(40),
					sources: ["Package.swift"],
				},
			},
		};
		const page = pageForPath("/projects/frogie", [reviewed]);
		expect(page.bodyHtml).toContain("Project goal");
		expect(page.bodyHtml).toContain("Inspect &lt;routes&gt; &amp; proxies.");
		expect(page.bodyHtml).toContain("Swift &amp; SwiftUI");
		expect(page.bodyHtml).toContain("Native &lt;app&gt;");
		expect(page.bodyHtml).not.toContain("<routes>");
	});
	it("lists the homepage, gallery, and every project in the sitemap", () => {
		const xml = sitemapXml(discoveryPages(projects));
		expect(xml).toContain("<loc>https://hexly.ai/</loc>");
		expect(xml).toContain("<loc>https://hexly.ai/logos</loc>");
		expect(xml).toContain("<loc>https://hexly.ai/projects/frogie</loc>");
		expect(xml).toContain(
			"<loc>https://hexly.ai/projects/uptime-kuma-skill</loc>",
		);
		expect(xml).toContain("<loc>https://hexly.ai/status</loc>");
		expect(xml.match(/<url>/g)?.length).toBe(projects.length + 9);
		expect(xml).toContain("<loc>https://hexly.ai/templates/showcase</loc>");
		expect(xml).not.toContain("hexly.ai/videos");
		expect(xml).not.toContain("hexly.ai/logos/");
	});
	it("writes a plain-text index with series links and both languages", () => {
		const text = llmsDocument(projects);
		expect(text).toContain(homeTitle);
		expect(text).toContain("https://lizheng.me/en/");
		expect(text).toContain("https://lizheng.blog/");
		expect(text).toContain("https://lizheng.dev/en/");
		expect(text).not.toContain("[Portfolio](https://hexly.ai/)");
		expect(text).toContain("/projects/frogie");
		expect(text).toContain(frogie.description.zh);
		expect(text).toContain("/sitemap.xml");
		expect(text).toContain("/data/projects.json");
		expect(text).toContain("/api/share.json");
	});
	it("publishes share metadata for product sites", () => {
		const pew = projects.find((project) => project.id === "pew");
		if (!pew) throw new Error("Pew is required.");
		const card = projectShareCard(pew);
		expect(card.canonical).toBe("https://hexly.ai/projects/pew");
		expect(card.title).toBe("Pew — hexly.ai");
		expect(card.image).toEqual({
			url: "https://hexly.ai/og/pew.jpg",
			type: "image/jpeg",
			width: 1200,
			height: 630,
			alt: "Pew identity",
		});
		expect(card.website).toBe("https://pew.md");
		expect(siteShareCard().id).toBe("hexly-ai");
		expect(siteShareCard().image.url).toBe("https://hexly.ai/og.jpg");
		const index = shareIndex(projects);
		expect(index.projects).toHaveLength(projects.length);
		expect(index.projects.find((entry) => entry.id === "pew")).toEqual({
			id: "pew",
			name: "Pew",
			href: "https://hexly.ai/api/share/pew.json",
		});
		expect(shareFiles(projects).map((file) => file.fileName)).toContain(
			"api/share/pew.json",
		);
	});
	it("builds unique page metadata and readable HTML snapshots", () => {
		const home = pageForPath("/", projects);
		const gallery = pageForPath("/logos/", projects);
		const page = pageForPath("/projects/frogie", projects);
		expect(home.canonical).toBe("https://hexly.ai/");
		expect(home.heading).toBe(homeHeading);
		expect(home.bodyHtml).toContain("<h1>");
		expect(home.bodyHtml).toContain("Frogie");
		expect(home.bodyHtml).toContain("https://lizheng.me/en/");
		expect(home.jsonLd).toMatchObject({
			"@graph": [{ "@type": "WebSite" }, { "@type": "CollectionPage" }],
		});
		expect(
			(
				home.jsonLd as { "@graph": { mainEntity: { numberOfItems: number } }[] }
			)["@graph"][1]?.mainEntity.numberOfItems,
		).toBe(visible.length);
		expect(gallery.canonical).toBe("https://hexly.ai/logos");
		expect(page.canonical).toBe("https://hexly.ai/projects/frogie");
		expect(page.title).toBe("Frogie — hexly.ai");
		expect(page.description).toBe(frogie.description.en);
		expect(page.bodyHtml).toContain(frogie.repository);
		expect(socialImage()).toBe("https://hexly.ai/og.jpg");
		expect(socialImage(frogie)).toBe("https://hexly.ai/og/frogie.jpg");
		expect(absoluteUrl("/projects/pew")).toBe("https://hexly.ai/projects/pew");
		const graph = home.jsonLd as {
			"@graph": {
				mainEntity: { name: string; numberOfItems: number };
				hasPart: { name: string; numberOfItems: number };
			}[];
		};
		expect(graph["@graph"][1]?.mainEntity.name).toBe("Active projects");
		expect(graph["@graph"][1]?.hasPart.name).toBe("Archived projects");
		expect(graph["@graph"][1]?.hasPart.numberOfItems).toBe(
			projects.length - visible.length,
		);
	});
	it("replaces the shared HTML shell with the selected page", () => {
		const page = pageForPath("/projects/frogie", projects);
		const html = applyPageToHtml(shell, page);
		expect(html).toContain("<title>Frogie — hexly.ai</title>");
		expect(html).toContain(`content="${frogie.description.en}"`);
		expect(html).toContain('href="https://hexly.ai/projects/frogie"');
		expect(html).toContain('"@type":"SoftwareApplication"');
		expect(html).toContain("<h1>Frogie 🐸</h1>");
		expect(html.match(/<h1>/g)?.length).toBe(1);
		expect(html).toContain('content="https://hexly.ai/og/frogie.jpg"');
		expect(html).toContain('content="image/jpeg"');
		expect(html).not.toContain("<title>old</title>");
	});
	it("escapes HTML in titles and identifies unknown projects", () => {
		expect(escapeHtml('A & B <C> "D"')).toBe(
			"A &amp; B &lt;C&gt; &quot;D&quot;",
		);
		expect(pageForPath("/missing", projects).path).toBe("/");
		expect(pageForPath("/projects/not-a-project", projects)).toMatchObject({
			path: "/projects/not-a-project",
			title: "Project not found — hexly.ai",
		});
	});
	it("canonicalizes aliases without changing archived asset links", () => {
		const page = pageForPath("/projects/frogie", projects);
		expect(pageForPath("/logos/frogie", projects)).toEqual(page);
		expect(pageForPath("/frogie", projects)).toEqual(page);
		expect(pageForPath("/videos/launch", projects)).toEqual(
			pageForPath("/templates/launch", projects),
		);
		expect(page.bodyHtml).toContain(`href="${frogie.logo.original}"`);
		expect(page.bodyHtml).toContain(
			`href="${escapeHtml(frogie.logo.sourceUrl)}"`,
		);
	});
	it("makes optional media readable to crawlers and escapes its metadata", () => {
		const video = {
			...videoFixture,
			title: { en: 'A <video> & "demo"', zh: "示例" },
		};
		const page = pageForPath("/projects/frogie", [
			{ ...frogie, media: { videos: [video] } },
		]);
		expect(page.bodyHtml).toContain('id="video-introduction"');
		expect(page.bodyHtml).toContain("A &lt;video&gt; &amp; &quot;demo&quot;");
		expect(page.bodyHtml).toContain(`href="${video.src}"`);
		expect(page.bodyHtml).not.toContain("A <video>");
		expect(pageForPath("/projects/frogie", projects).bodyHtml).not.toContain(
			'id="video-',
		);
		const screenshot = pageForPath("/projects/frogie", [
			{ ...frogie, media: { screenshots: [screenshotFixture] } },
		]);
		expect(screenshot.bodyHtml).toContain('id="media"');
		expect(screenshot.bodyHtml).toContain(`alt="${screenshotFixture.alt.en}"`);
		expect(screenshot.bodyHtml).not.toContain('id="video-');
	});
});
