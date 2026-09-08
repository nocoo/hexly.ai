import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import sharp from "sharp";
import manifest from "../../package.json" with { type: "json" };
import { readProjects } from "../../src/data/read-projects";

const projects = readProjects();

test("serves the built document and security policy through Workers HTTP", async ({
	request,
}) => {
	const response = await request.get("/");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("text/html");
	expect(response.headers()["x-content-type-options"]).toBe("nosniff");
	expect(response.headers()["content-security-policy"]).toContain(
		"script-src 'self'",
	);
	expect(response.headers()["content-security-policy"]).toContain(
		"frame-ancestors 'none'",
	);
	expect(response.headers()["strict-transport-security"]).toContain(
		"max-age=31536000",
	);
	const html = await response.text();
	expect(html).toContain('href="https://hexly.ai/"');
	expect(html).toContain('id="root"');
	expect(html).toContain("<h1>");
	expect(html).toContain("Frogie");
	expect(html).toContain("https://lizheng.me/en/");
	expect(html).toContain('property="og:image"');
	expect(html).toContain("application/ld+json");
	expect(html).not.toContain("/src/main.tsx");
});

test("serves compiled code, styles, and self-hosted fonts with cache headers", async ({
	request,
}) => {
	const html = await (await request.get("/")).text();
	for (const [extension, contentType] of [
		["js", "javascript"],
		["css", "text/css"],
	]) {
		const path = html.match(new RegExp(`/assets/[^" ]+\\.${extension}`))?.[0];
		expect(path).toBeTruthy();
		const response = await request.get(path ?? "/missing-build-asset");
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain(contentType);
		expect(response.headers()["cache-control"]).toContain("immutable");
		if (extension === "css") {
			const css = await response.text();
			const fonts = [...new Set(css.match(/\/assets\/[^)" ]+\.woff2/g))];
			expect(fonts).toHaveLength(3);
			for (const font of fonts) {
				const fontResponse = await request.get(font);
				expect(fontResponse.status()).toBe(200);
				expect(fontResponse.headers()["content-type"]).toContain("font/woff2");
			}
		}
	}
});

test("reloads gallery links and serves the external preference bootstrap", async ({
	request,
}) => {
	for (const path of [
		"/logos",
		"/logos/frogie",
		"/logos/pew",
		"/logos/firefly",
		"/logos/uptime-kuma-skill",
	]) {
		const response = await request.get(path);
		expect(response.status(), path).toBe(200);
		expect(response.headers()["content-type"]).toContain("text/html");
		expect(await response.text()).toContain('id="root"');
	}
	const preferences = await request.get("/preferences.js");
	expect(preferences.status()).toBe(200);
	expect(preferences.headers()["content-type"]).toContain("javascript");
	expect(await preferences.text()).toContain("hexly:theme");
});

test("publishes the project catalogue as JSON", async ({ request }) => {
	const response = await request.get("/data/projects.json");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("application/json");
	const body = await response.json();
	expect(body).toHaveLength(projects.length);
	expect(body[0]?.id).toBe("frogie");
});

test("reports the deployed version and revision without caching", async ({
	request,
}) => {
	const response = await request.get("/api/live");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("application/json");
	expect(response.headers()["cache-control"]).toBe("no-store");
	const metadata = await response.json();
	expect(metadata).toMatchObject({
		status: "ok",
		name: "hexly.ai",
		version: manifest.version,
	});
	expect(metadata.revision).toMatch(/^[a-f0-9]{40}$/);
});

for (const id of ["frogie", "pew", "pokepocket", "node-image-uploader"]) {
	test(`downloads the preserved ${id} identity without changing its bytes`, async ({
		request,
	}) => {
		const project = projects.find((entry) => entry.id === id);
		if (!project) throw new Error(`Missing project: ${id}`);
		const response = await request.get(project.logo.original);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain(
			project.logo.original.endsWith(".svg") ? "image/svg+xml" : "image/png",
		);
		expect(response.headers()["cache-control"]).toContain("max-age=86400");
		const bytes = await response.body();
		expect(bytes.byteLength).toBe(project.logo.bytes);
		expect(createHash("sha256").update(bytes).digest("hex")).toBe(
			project.logo.sha256,
		);
	});
}

test("serves genuine WebP artwork and small icon variants", async ({
	request,
}) => {
	for (const size of [32, 64, 160, 256, 512, 1024]) {
		const response = await request.get(`/logos/display/pew-${size}.webp`);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain("image/webp");
		const metadata = await sharp(await response.body()).metadata();
		expect(metadata.format).toBe("webp");
		expect([metadata.width, metadata.height]).toEqual([size, size]);
	}
});

test("publishes crawler documents, unique project HTML, and real icons", async ({
	request,
}) => {
	const robots = await request.get("/robots.txt");
	expect(robots.status()).toBe(200);
	expect(await robots.text()).toContain(
		"Sitemap: https://hexly.ai/sitemap.xml",
	);
	const sitemap = await request.get("/sitemap.xml");
	expect(sitemap.status()).toBe(200);
	expect(sitemap.headers()["content-type"]).toContain("xml");
	const map = await sitemap.text();
	expect(map).toContain("<loc>https://hexly.ai/</loc>");
	expect(map).toContain("<loc>https://hexly.ai/logos/frogie</loc>");
	const llms = await request.get("/llms.txt");
	expect(llms.status()).toBe(200);
	expect(llms.headers()["content-type"]).toContain("text/plain");
	expect(await llms.text()).toContain("https://lizheng.me/en/");
	const frogie = await request.get("/logos/frogie");
	expect(frogie.status()).toBe(200);
	const page = await frogie.text();
	expect(page).toContain("<title>Frogie — hexly.ai</title>");
	expect(page).toContain(
		'<link rel="canonical" href="https://hexly.ai/logos/frogie" />',
	);
	expect(page).not.toContain(
		'<link rel="canonical" href="https://hexly.ai/" />',
	);
	expect(page.match(/<h1>/g)?.length).toBe(1);
	expect(page).toContain("https://hexly.ai/og/frogie.jpg");
	const home = await (await request.get("/")).text();
	expect(home).toContain("Active projects");
	expect(home).toContain("Archived projects");
	const social = await request.get("/og/frogie.jpg");
	expect(social.status()).toBe(200);
	expect(social.headers()["content-type"]).toContain("image/jpeg");
	expect((await social.body()).byteLength).toBeLessThan(400_000);
	const projectsRedirect = await request.get("/projects", {
		maxRedirects: 0,
	});
	expect(projectsRedirect.status()).toBe(301);
	expect(projectsRedirect.headers().location).toMatch(/\/$/);
	const frogieRedirect = await request.get("/frogie", { maxRedirects: 0 });
	expect(frogieRedirect.status()).toBe(301);
	expect(frogieRedirect.headers().location).toContain("/logos/frogie");
	const favicon = await request.get("/favicon.svg");
	expect(favicon.status()).toBe(200);
	expect(favicon.headers()["content-type"]).toContain("image/svg+xml");
	for (const [path, type] of [
		["/favicon.ico", "image/png"],
		["/apple-touch-icon.png", "image/png"],
		["/og.png", "image/png"],
	] as const) {
		const response = await request.get(path);
		expect(response.status(), path).toBe(200);
		expect(response.headers()["content-type"], path).toContain(type);
	}
});

for (const id of projects
	.filter((project) => project.family)
	.map((project) => project.id)) {
	test(`serves the complete ${id} refinement and preserved predecessor`, async ({
		request,
	}) => {
		const family = projects.find((project) => project.id === id)?.family;
		if (!family) throw new Error(`${id} must have its family archive`);
		const manifestResponse = await request.get(`${family.root}/manifest.json`);
		expect(manifestResponse.status()).toBe(200);
		const manifest: {
			files: { path: string; bytes: number; sha256: string }[];
		} = await manifestResponse.json();
		for (const file of manifest.files) {
			const response = await request.get(file.path);
			expect(response.status(), file.path).toBe(200);
			const data = await response.body();
			expect(data.length, file.path).toBe(file.bytes);
			expect(createHash("sha256").update(data).digest("hex"), file.path).toBe(
				file.sha256,
			);
		}
		const original = await (await request.get(family.previous.original)).body();
		expect(createHash("sha256").update(original).digest("hex")).toBe(
			family.previous.sha256,
		);
		const icon = await sharp(
			await (await request.get(`${family.root}/icon.png`)).body(),
		).metadata();
		expect([icon.width, icon.height]).toEqual([
			family.foreground.width,
			family.foreground.height,
		]);
		const foreground = await (
			await request.get(family.foreground.original)
		).body();
		expect(createHash("sha256").update(foreground).digest("hex")).toBe(
			family.foreground.sha256,
		);
		const preview = await sharp(
			await (await request.get(family.foreground.display)).body(),
		).metadata();
		expect([preview.width, preview.height, preview.hasAlpha]).toEqual([
			1024,
			1024,
			true,
		]);
	});
}
