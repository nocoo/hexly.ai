import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { categoryLabels, copy } from "../src/data/copy";
import identity from "../src/data/projects/hexly-ai.json";
import { readProjects } from "../src/data/read-projects";
import type { Project } from "../src/model/project";
import {
	siteCardKey,
	socialCardFillsTile,
	socialCardFingerprint,
	socialCardIconPath,
	socialCardRendererSha,
} from "../src/model/social-card";

const directory = "public/og";
const registryPath = "src/data/social-cards.json";
const { values } = parseArgs({
	options: {
		project: { type: "string", multiple: true },
		site: { type: "boolean", default: false },
		check: { type: "boolean", default: false },
	},
});

interface CardRecord {
	path: string;
	bytes: number;
	sha256: string;
	fingerprint: string;
	renderedAt: string;
}

interface Registry {
	schemaVersion: 1;
	renderer: string;
	recordedAt: string;
	site: CardRecord;
	projects: Record<string, CardRecord>;
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

const sha = (buffer: Buffer | string) =>
	createHash("sha256").update(buffer).digest("hex");
const dataUrl = async (path: string, type: string) =>
	`data:${type};base64,${(await readFile(path)).toString("base64")}`;
const mark = `<img width="36" height="36" alt="" src="${await dataUrl(`public${identity.family.root}/transparent-64.png`, "image/png")}">`;

async function artworkSource(project: Project) {
	const iconPath = socialCardIconPath(project);
	return {
		src: await dataUrl(iconPath, "image/webp"),
		plain: !(await socialCardFillsTile(iconPath)),
		background: project.colors.background,
		iconPath,
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
	const markStyle =
		plain && background ? ` style="--mark-background: ${background}"` : "";
	return `<main class="social-card">
<header>
<span class="social-brand">${mark}<span>hexly<span class="domain">.ai</span></span></span>
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
for (const id of values.project ?? [])
	if (!projects.some((project) => project.id === id))
		throw new Error(`Unknown project: ${id}`);

const registry: Registry = await readFile(registryPath, "utf8")
	.then((text) => JSON.parse(text) as Registry)
	.catch(() => ({
		schemaVersion: 1 as const,
		renderer: "scripts/create-social.ts",
		recordedAt: "",
		site: {
			path: "",
			bytes: 0,
			sha256: "",
			fingerprint: "",
			renderedAt: "",
		},
		projects: {},
	}));

const rendererSha256 = await socialCardRendererSha();

async function inputFingerprint(
	key: string,
	title: string,
	description: string,
	category: string,
	archived: boolean,
	iconPath: string,
) {
	return socialCardFingerprint({
		key,
		title,
		description,
		category,
		archived,
		iconSha256: sha(await readFile(iconPath)),
		rendererSha256,
	});
}

const homeArt = await artworkSource(identity as Project);
const selected = values.project
	? projects.filter((project) => values.project?.includes(project.id))
	: projects;
const includeSite = values.site || !values.project;

const targets: {
	key: string;
	html: string;
	iconPath: string;
	fingerprint: string;
}[] = [];
if (includeSite)
	targets.push({
		key: siteCardKey,
		html: cardHtml({
			label: "PORTFOLIO",
			title: `${copy.en.heroFirst}\n${copy.en.heroSecond}.`,
			subtitle: "",
			footer: "ANIMALS · TEMPLATES · GAMES · TOOLS",
			image: homeArt.src,
			plain: homeArt.plain,
			background: homeArt.background,
		}),
		iconPath: homeArt.iconPath,
		fingerprint: await inputFingerprint(
			"site",
			`${copy.en.heroFirst} ${copy.en.heroSecond}`,
			"",
			"portfolio",
			false,
			homeArt.iconPath,
		),
	});
for (const project of selected) {
	const art = await artworkSource(project);
	targets.push({
		key: project.id,
		html: cardHtml({
			label: categoryLabels.en[project.category].toUpperCase(),
			title: project.title,
			subtitle: project.description.en,
			footer: project.archived ? "ARCHIVED" : "A LITTLE UNIVERSE",
			image: art.src,
			plain: art.plain,
			background: art.background,
		}),
		iconPath: art.iconPath,
		fingerprint: await inputFingerprint(
			project.id,
			project.title,
			project.description.en,
			project.category,
			project.archived,
			art.iconPath,
		),
	});
}

const problem = (key: string, detail: string) =>
	`${key}: ${detail}\n\nRun \`bun run social:build --project <id>\` or \`bun run social:build\`.`;

if (values.check) {
	const problems: string[] = [];
	for (const project of projects) {
		const record = registry.projects[project.id];
		if (!record) {
			problems.push(problem(project.id, `missing from ${registryPath}`));
			continue;
		}
		const art = await artworkSource(project);
		const expected = await inputFingerprint(
			project.id,
			project.title,
			project.description.en,
			project.category,
			project.archived,
			art.iconPath,
		);
		if (record.fingerprint !== expected)
			problems.push(
				problem(project.id, `inputs changed since ${record.renderedAt}`),
			);
		const bytes = await readFile(`public${record.path}`).catch(() => null);
		if (!bytes)
			problems.push(problem(project.id, `missing file ${record.path}`));
		else if (sha(bytes) !== record.sha256)
			problems.push(problem(project.id, `file differs from ${registryPath}`));
	}
	const expectedSite = await inputFingerprint(
		"site",
		`${copy.en.heroFirst} ${copy.en.heroSecond}`,
		"",
		"portfolio",
		false,
		homeArt.iconPath,
	);
	if (!registry.site.path)
		problems.push(problem("site", `missing from ${registryPath}`));
	else if (registry.site.fingerprint !== expectedSite)
		problems.push(problem("site", "inputs changed since generated"));
	if (problems.length) {
		console.error(`Stale social cards:\n\n${problems.join("\n\n")}`);
		process.exit(1);
	}
	console.info(
		`Social cards match their inputs (${projects.length + 1} checked).`,
	);
	process.exit(0);
}

const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
const written: string[] = [];
const unchanged: string[] = [];
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
try {
	const page = await browser.newPage({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: 2,
	});
	await page.route("**/*", (route) => route.abort());
	for (const target of targets) {
		await page.setContent(
			`<!doctype html><html><head><meta charset="utf-8"><style>${styles}</style></head><body>${target.html}</body></html>`,
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
			throw new Error(`Social image too large: ${target.key}`);
		const digest = sha(buffer);
		const path = `/og/${target.key}-${today}-${digest.slice(0, 6)}.jpg`;
		const previous =
			target.key === siteCardKey
				? registry.site
				: registry.projects[target.key];
		const record: CardRecord = {
			path,
			bytes: buffer.length,
			sha256: digest,
			fingerprint: target.fingerprint,
			renderedAt:
				previous?.path === path && previous.sha256 === digest
					? previous.renderedAt
					: today,
		};
		const present = await readFile(`public${path}`)
			.then(() => true)
			.catch(() => false);
		if (!present || record.renderedAt === today) {
			await writeFile(`public${path}`, buffer);
			written.push(path);
		} else unchanged.push(path);
		if (target.key === siteCardKey) registry.site = record;
		else registry.projects[target.key] = record;
	}
} finally {
	await browser.close();
}

const next: Registry = {
	schemaVersion: 1,
	renderer: "scripts/create-social.ts",
	recordedAt: today,
	site: registry.site,
	projects: Object.fromEntries(
		Object.entries(registry.projects).sort(([a], [b]) => a.localeCompare(b)),
	),
};
await writeFile(registryPath, `${JSON.stringify(next, null, "\t")}\n`);
console.info(
	`Social cards: ${targets.length} rendered, ${written.length} written, ${unchanged.length} unchanged. Registry: ${registryPath}`,
);
