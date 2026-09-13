import { readFileSync } from "node:fs";
import type { Plugin } from "vite";
import storage from "../src/data/media-storage.json" with { type: "json" };
import { assetKeyForPath, assetUrl } from "../src/model/assets";
import { filesIn } from "./asset-storage";

const applicationFiles = new Set([
	"public/_headers",
	"public/_redirects",
	"public/robots.txt",
	"public/preferences.js",
]);
export function applicationPublicFiles() {
	return filesIn("public").filter(
		(path) => applicationFiles.has(path) || /\.(html|js|css)$/.test(path),
	);
}

export function siteAssets(): Plugin {
	return {
		name: "r2-site-materials",
		enforce: "pre",
		transform(code, id) {
			if (!id.endsWith(".css")) return;
			return code.replace(
				/url\((["']?)(\/[^\s)'"?]+)\1\)/g,
				(match, quote: string, path: string) => {
					const url = assetUrl(path);
					return url === path ? match : `url(${quote}${url}${quote})`;
				},
			);
		},
		transformIndexHtml: {
			order: "pre",
			handler: (html) => ({
				html: html.replace(
					/\b(href|src)="(\/[^" ]+)"/g,
					(_match, attribute: string, path: string) =>
						`${attribute}="${assetUrl(path)}"`,
				),
				tags: [
					{
						tag: "link",
						attrs: {
							rel: "preconnect",
							href: storage.origin,
							crossorigin: "anonymous",
						},
						injectTo: "head",
					},
				],
			}),
		},
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				const url = new URL(request.url ?? "/", "http://localhost");
				if (!["GET", "HEAD"].includes(request.method ?? "")) return next();
				const key = assetKeyForPath(url.pathname);
				if (key) {
					response.writeHead(302, {
						Location: assetUrl(`${url.pathname}${url.search}`),
						"Cache-Control": "public, max-age=300",
					});
					response.end();
					return;
				}
				const file = applicationPublicFiles().find(
					(path) => path.slice(6) === url.pathname,
				);
				if (!file || file.endsWith("_headers") || file.endsWith("_redirects"))
					return next();
				if (file.endsWith("/review.html"))
					response.setHeader("Vary", "Accept, Sec-Fetch-Dest");
				response.setHeader(
					"Content-Type",
					file.endsWith(".html")
						? "text/html; charset=utf-8"
						: file.endsWith(".js")
							? "text/javascript; charset=utf-8"
							: file.endsWith(".css")
								? "text/css; charset=utf-8"
								: "text/plain; charset=utf-8",
				);
				response.end(
					request.method === "HEAD"
						? undefined
						: file.endsWith("/review.html") &&
								(request.headers["sec-fetch-dest"] === "document" ||
									request.headers.accept?.includes("text/html"))
							? readFileSync(file, "utf8").replace(
									"</body>",
									'<script type="module" src="/src/material-downloads.ts"></script></body>',
								)
							: readFileSync(file),
				);
			});
		},
		generateBundle() {
			for (const file of applicationPublicFiles())
				this.emitFile({
					type: "asset",
					fileName: file.slice(7),
					source: readFileSync(file),
				});
		},
		writeBundle: {
			order: "post",
			sequential: true,
			handler() {
				let bytes = 0;
				for (const path of filesIn("dist")) {
					if (
						/\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp[34]|wav|webm|vtt|pdf|pptx|zip)$/i.test(
							path,
						)
					)
						throw new Error(`Material leaked into Worker deploy: ${path}`);
					bytes += readFileSync(path).byteLength;
				}
				if (bytes > 20 * 1024 * 1024)
					throw new Error(`Worker assets exceed 20 MiB: ${bytes}`);
				console.info(
					`Worker deploy boundary: ${bytes.toLocaleString()} bytes; materials served by R2.`,
				);
			},
		},
	};
}
