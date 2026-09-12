import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import provenance from "../packages/video-kit/brand-source.json";
import { kitVersion } from "../packages/video-kit/src/brand";
import {
	parseVideoManifest,
	schemaDocuments,
} from "../packages/video-kit/src/schema";
import manifest from "../src/data/videos.json";

/** Explicit public boundary: licensed fonts, schemas and metadata, never render outputs. */
export function videoSiteAssets(): Plugin {
	const json = (value: unknown) => `${JSON.stringify(value)}\n`;
	const files = () => [
		{
			fileName: "videos/manifest.json",
			type: "application/json",
			source: json(parseVideoManifest(manifest)),
		},
		...Object.entries(schemaDocuments()).map(([file, schema]) => ({
			fileName: `videos/${file}`,
			type: "application/schema+json",
			source: json(schema),
		})),
		...provenance.assets.map((asset) => {
			const fileName = `video-kit/${kitVersion}/hexly/${asset.file}`;
			return {
				fileName,
				type: asset.file.endsWith(".woff2")
					? "font/woff2"
					: "text/plain; charset=utf-8",
				source: readFileSync(resolve("packages/video-kit/public", fileName)),
			};
		}),
	];
	return {
		name: "video-kit-public-assets",
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				const path = new URL(request.url ?? "/", "http://localhost").pathname;
				if (!path.startsWith("/videos/") && !path.startsWith("/video-kit/"))
					return next();
				const file = files().find((item) => `/${item.fileName}` === path);
				if (!file || !["GET", "HEAD"].includes(request.method ?? ""))
					return next();
				response.setHeader("Content-Type", file.type);
				response.end(request.method === "HEAD" ? undefined : file.source);
			});
		},
		generateBundle() {
			for (const { fileName, source } of files())
				this.emitFile({ type: "asset", fileName, source });
		},
	};
}
