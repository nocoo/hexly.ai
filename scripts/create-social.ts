import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { categoryLabels, copy } from "../src/data/copy";
import { readProjects } from "../src/data/read-projects";
import { escapeHtml } from "../src/model/discovery";
import type { Project } from "../src/model/project";

const directory = "public/og";
const markSvg = `<svg width="33" height="36" viewBox="0 0 36 40" fill="none" aria-hidden="true"><path d="m18 2 15.6 9v18L18 38 2.4 29V11Z" fill="currentColor"/><path d="m18 9 9.5 5.5v11L18 31l-9.5-5.5v-11Z" stroke="#f0f0e9" stroke-width="1.6"/><path d="M18 9v22M8.5 14.5l19 11m0-11-19 11" stroke="#f0f0e9" stroke-width="1.6"/></svg>`;

const dataUrl = async (path: string, type: string) =>
	`data:${type};base64,${(await readFile(path)).toString("base64")}`;

async function artworkSrc(project?: Project): Promise<{
	src: string;
	plain: boolean;
	background?: string;
}> {
	if (!project)
		return {
			src: await dataUrl(
				"public/logos/display/hexly-ai-1024.webp",
				"image/webp",
			),
			plain: true,
			background: "#f4ece6",
		};
	if (project.family)
		return {
			src: await dataUrl(
				`public${project.family.root}/icon-1024.webp`,
				"image/webp",
			),
			plain: false,
		};
	return {
		src: await dataUrl(
			`public/logos/display/${project.id}-1024.webp`,
			"image/webp",
		),
		plain: true,
		background: project.colors.background,
	};
}

function titleSize(title: string, lines: number): number {
	if (lines > 1) return 72;
	if (title.length > 14) return 64;
	if (title.length > 8) return 80;
	return 100;
}

function cardHtml({
	label,
	title,
	subtitle,
	footer,
	image,
	plain,
	background,
}: {
	label: string;
	title: string;
	subtitle: string;
	footer: string;
	image: string;
	plain: boolean;
	background?: string;
}): string {
	const lines = title.split("\n").length;
	const markClass = plain ? "social-mark social-plain" : "social-mark";
	const markStyle = background
		? ` style="--mark-background: ${background}"`
		: "";
	return `<main class="social-card">
<header>
<span class="social-brand">${markSvg}<span>hexly<span class="domain">.ai</span></span></span>
<span>${escapeHtml(label)}</span>
</header>
<div class="social-copy">
<h1 style="font-size: ${titleSize(title, lines)}px">${escapeHtml(title)}</h1>
${subtitle ? `<p class="social-role">${escapeHtml(subtitle)}</p>` : ""}
</div>
<figure class="${markClass}"${markStyle}><img src="${image}" alt=""></figure>
<footer>
<span>${escapeHtml(footer)}</span>
<strong>hexly.ai</strong>
</footer>
</main>`;
}

const fonts = (
	await Promise.all([
		dataUrl(
			"node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
			"font/woff2",
		),
		dataUrl(
			"node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
			"font/woff2",
		),
	])
).map(
	(src, index) =>
		`@font-face { font-family: "${index === 0 ? "Space Grotesk Variable" : "Geist Mono Variable"}"; font-style: normal; font-weight: 100 900; src: url("${src}") format("woff2"); }`,
);
const styles = `${fonts.join("\n")}\n${await readFile("scripts/social.css", "utf8")}`;
const projects = readProjects();
await mkdir(directory, { recursive: true });

const homeArt = await artworkSrc();
const cards = [
	{
		file: "public/og.jpg",
		html: cardHtml({
			label: "PORTFOLIO",
			title: `${copy.en.heroFirst}\n${copy.en.heroSecond}.`,
			subtitle: "",
			footer: "ANIMALS · TEMPLATES · GAMES · TOOLS",
			image: homeArt.src,
			plain: homeArt.plain,
			background: homeArt.background,
		}),
	},
	...(await Promise.all(
		projects.map(async (project) => {
			const art = await artworkSrc(project);
			return {
				file: `${directory}/${project.id}.jpg`,
				html: cardHtml({
					label: categoryLabels.en[project.category].toUpperCase(),
					title: project.title,
					subtitle: project.description.en,
					footer: project.archived ? "ARCHIVED" : "A LITTLE UNIVERSE",
					image: art.src,
					plain: art.plain,
					background: art.background,
				}),
			};
		}),
	)),
];

const browser = await chromium.launch();
try {
	const page = await browser.newPage({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: 2,
	});
	await page.route("**/*", (route) => route.abort());
	for (const card of cards) {
		await page.setContent(
			`<!doctype html><html><head><meta charset="utf-8"><style>${styles}</style></head><body>${card.html}</body></html>`,
		);
		await page.evaluate(async () => {
			await document.fonts.ready;
			await Promise.all([...document.images].map((image) => image.decode()));
		});
		const raster = await page.screenshot({ animations: "disabled" });
		const buffer = await sharp(raster)
			.resize(1200, 630)
			.jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
			.toBuffer();
		if (buffer.length > 400_000)
			throw new Error(`Social image too large: ${card.file}`);
		await writeFile(card.file, buffer);
	}
} finally {
	await browser.close();
}
console.info(`Wrote ${cards.length} typeset social cards.`);
