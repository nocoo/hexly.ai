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
	sitemapXml,
	socialImage,
} from "../../src/model/discovery";

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
<meta property="og:image" content="https://hexly.ai/og.png" />
<meta property="og:image:alt" content="old" />
<meta name="twitter:title" content="old" />
<meta name="twitter:description" content="old" />
<meta name="twitter:image" content="https://hexly.ai/og.png" />
<meta name="twitter:image:alt" content="old" />
<script type="application/ld+json">{}</script>
</head><body><noscript>old</noscript><div id="root"></div></body></html>`;

describe("crawler discovery documents", () => {
	it("lists the homepage, gallery, and every project in the sitemap", () => {
		const xml = sitemapXml(discoveryPages(projects));
		expect(xml).toContain("<loc>https://hexly.ai/</loc>");
		expect(xml).toContain("<loc>https://hexly.ai/logos</loc>");
		expect(xml).toContain("<loc>https://hexly.ai/logos/frogie</loc>");
		expect(xml).toContain(
			"<loc>https://hexly.ai/logos/uptime-kuma-skill</loc>",
		);
		expect(xml.match(/<url>/g)?.length).toBe(projects.length + 2);
	});
	it("writes a plain-text index with series links and both languages", () => {
		const text = llmsDocument(projects);
		expect(text).toContain(homeTitle);
		expect(text).toContain("https://lizheng.me/en/");
		expect(text).toContain("https://lizheng.blog/");
		expect(text).toContain("https://lizheng.dev/en/");
		expect(text).not.toContain("[Portfolio](https://hexly.ai/)");
		expect(text).toContain("/logos/frogie");
		expect(text).toContain(frogie.description.zh);
		expect(text).toContain("/sitemap.xml");
		expect(text).toContain("/data/projects.json");
	});
	it("builds unique page metadata and readable HTML snapshots", () => {
		const home = pageForPath("/", projects);
		const gallery = pageForPath("/logos/", projects);
		const page = pageForPath("/logos/frogie", projects);
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
		expect(page.canonical).toBe("https://hexly.ai/logos/frogie");
		expect(page.title).toBe("Frogie — hexly.ai");
		expect(page.description).toBe(frogie.description.en);
		expect(page.bodyHtml).toContain(frogie.repository);
		expect(socialImage(frogie)).toContain("/icon.png");
		expect(absoluteUrl("/logos/pew")).toBe("https://hexly.ai/logos/pew");
	});
	it("replaces the shared HTML shell with the selected page", () => {
		const page = pageForPath("/logos/frogie", projects);
		const html = applyPageToHtml(shell, page);
		expect(html).toContain("<title>Frogie — hexly.ai</title>");
		expect(html).toContain(`content="${frogie.description.en}"`);
		expect(html).toContain('href="https://hexly.ai/logos/frogie"');
		expect(html).toContain('"@type":"SoftwareApplication"');
		expect(html).toContain("<h1>Frogie 🐸</h1>");
		expect(html).not.toContain("<title>old</title>");
	});
	it("escapes HTML in titles and unknown paths fall back to the gallery", () => {
		expect(escapeHtml('A & B <C> "D"')).toBe(
			"A &amp; B &lt;C&gt; &quot;D&quot;",
		);
		expect(pageForPath("/missing", projects).path).toBe("/");
		expect(pageForPath("/logos/not-a-project", projects).path).toBe("/logos");
	});
});
