import type { Plugin } from "vite";
import {
	parseVideoManifest,
	schemaDocuments,
} from "../packages/video-kit/src/schema";
import examples from "../src/data/template-examples.json" with { type: "json" };
import manifest from "../src/data/videos.json";

/** Public metadata and verified CDN references; render outputs never enter the build. */
export function videoSiteAssets(): Plugin {
	const json = (value: unknown) => `${JSON.stringify(value)}\n`;
	const files = () => [
		{
			fileName: "templates/manifest.json",
			type: "application/json",
			source: json(parseVideoManifest(manifest)),
		},
		{
			fileName: "templates/examples.json",
			type: "application/json",
			source: json(examples),
		},
		...Object.entries(schemaDocuments()).map(([file, schema]) => ({
			fileName: `templates/${file}`,
			type: "application/schema+json",
			source: json(schema),
		})),
	];
	return {
		name: "video-kit-public-assets",
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				const path = new URL(request.url ?? "/", "http://localhost").pathname;
				if (!path.startsWith("/templates/") && !path.startsWith("/video-kit/"))
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
