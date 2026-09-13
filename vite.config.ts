import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import manifest from "./package.json" with { type: "json" };
import { siteAssets } from "./scripts/site-assets";
import { videoSiteAssets } from "./scripts/video-site-assets";
import { readProjects } from "./src/data/read-projects";
import {
	agentFiles,
	applyPageToHtml,
	discoveryPages,
	llmsDocument,
	pageForPath,
	shareFiles,
	sitemapXml,
} from "./src/model/discovery";
import { legacyRoute } from "./src/model/routes";
import { statusTargets } from "./src/model/status";

function canonicalRoutes(): Plugin {
	return {
		name: "canonical-routes",
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				const url = new URL(request.url ?? "/", "http://localhost");
				const redirect = legacyRoute(url.pathname);
				if (!redirect) return next();
				url.pathname = redirect.path;
				if (redirect.anchor) url.hash = redirect.anchor;
				response.writeHead(301, {
					Location: `${url.pathname}${url.search}${url.hash}`,
				});
				response.end();
			});
		},
	};
}

function discoveryAssets(): Plugin {
	const pages = () => discoveryPages(readProjects());
	return {
		name: "discovery-assets",
		transformIndexHtml: {
			order: "post",
			handler(html, ctx) {
				const pathname = new URL(
					ctx.originalUrl ?? ctx.path,
					"http://localhost",
				).pathname;
				return applyPageToHtml(html, pageForPath(pathname, readProjects()));
			},
		},
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				const pathname = new URL(request.url ?? "/", "http://localhost")
					.pathname;
				if (pathname === "/llms.txt") {
					response.setHeader("Content-Type", "text/plain; charset=utf-8");
					response.end(llmsDocument(readProjects()));
					return;
				}
				if (pathname === "/sitemap.xml") {
					response.setHeader("Content-Type", "application/xml; charset=utf-8");
					response.end(sitemapXml(pages()));
					return;
				}
				if (
					pathname.startsWith("/agents/") &&
					["GET", "HEAD"].includes(request.method ?? "")
				) {
					const file = agentFiles(readProjects()).find(
						(item) => `/${item.fileName}` === pathname,
					);
					response.setHeader("Content-Type", "text/markdown; charset=utf-8");
					response.statusCode = file ? 200 : 404;
					response.end(
						request.method === "HEAD"
							? undefined
							: (file?.source ?? "Agent guide not found.\n"),
					);
					return;
				}
				const share = shareFiles(readProjects()).find(
					(file) => `/${file.fileName}` === pathname,
				);
				if (share && ["GET", "HEAD"].includes(request.method ?? "")) {
					response.setHeader("Content-Type", "application/json; charset=utf-8");
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.end(request.method === "HEAD" ? undefined : share.source);
					return;
				}
				next();
			});
		},
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "llms.txt",
				source: llmsDocument(readProjects()),
			});
			this.emitFile({
				type: "asset",
				fileName: "sitemap.xml",
				source: sitemapXml(pages()),
			});
			for (const file of shareFiles(readProjects())) {
				this.emitFile({ type: "asset", ...file });
			}
			for (const file of agentFiles(readProjects())) {
				this.emitFile({ type: "asset", ...file });
			}
		},
		writeBundle() {
			const file = resolve("dist/index.html");
			const html = readFileSync(file, "utf8");
			for (const page of pages()) {
				const rendered = applyPageToHtml(html, page);
				if (page.path === "/") {
					writeFileSync(file, rendered);
					continue;
				}
				const target = resolve("dist", `${page.path.slice(1)}.html`);
				mkdirSync(dirname(target), { recursive: true });
				writeFileSync(target, rendered);
			}
		},
	};
}

function catalogueAssets(): Plugin {
	const build = () => `${JSON.stringify(readProjects())}\n`;
	return {
		name: "catalogue-assets",
		configureServer(server) {
			const directory = resolve("src/data/projects");
			server.watcher.add(directory);
			server.watcher.on("change", (file) => {
				if (file.startsWith(directory)) server.ws.send({ type: "full-reload" });
			});
			server.middlewares.use((request, response, next) => {
				if (
					new URL(request.url ?? "/", "http://localhost").pathname !==
						"/data/projects.json" ||
					!["GET", "HEAD"].includes(request.method ?? "")
				)
					return next();
				response.setHeader("Content-Type", "application/json; charset=utf-8");
				response.end(request.method === "HEAD" ? undefined : build());
			});
		},
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "data/projects.json",
				source: build(),
			});
			this.emitFile({
				type: "asset",
				fileName: "data/status-targets.json",
				source: JSON.stringify(statusTargets(readProjects())),
			});
		},
	};
}

function releaseMetadata(): Plugin {
	const metadata = JSON.stringify({
		status: "ok",
		name: "hexly.ai",
		version: manifest.version,
		revision:
			process.env.GITHUB_SHA ??
			execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
	});
	return {
		name: "release-metadata",
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				if (
					new URL(request.url ?? "/", "http://localhost").pathname !==
						"/api/live" ||
					!["GET", "HEAD"].includes(request.method ?? "")
				)
					return next();
				response.setHeader("Content-Type", "application/json; charset=utf-8");
				response.setHeader("Cache-Control", "no-store");
				response.end(request.method === "HEAD" ? undefined : metadata);
			});
		},
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "api/live",
				source: `${metadata}\n`,
			});
		},
	};
}

export default defineConfig({
	publicDir: false,
	plugins: [
		siteAssets(),
		react(),
		canonicalRoutes(),
		catalogueAssets(),
		videoSiteAssets(),
		discoveryAssets(),
		releaseMetadata(),
	],
	server: {
		host: "127.0.0.1",
		port: 7048,
		strictPort: true,
		allowedHosts: ["index.dev.hexly.ai"],
		proxy: { "/api/status": "http://127.0.0.1:37048" },
	},
	build: {
		target: "es2022",
		rolldownOptions: {
			input: {
				index: resolve("index.html"),
				"material-downloads": resolve("src/material-downloads.ts"),
			},
			output: {
				entryFileNames: (chunk) =>
					chunk.name === "material-downloads"
						? "material-downloads.js"
						: "assets/[name]-[hash].js",
			},
		},
	},
});
