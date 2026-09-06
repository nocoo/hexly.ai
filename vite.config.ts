import { execFileSync } from "node:child_process";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import manifest from "./package.json" with { type: "json" };

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
	plugins: [react(), releaseMetadata()],
	server: {
		host: "127.0.0.1",
		port: 7048,
		strictPort: true,
		allowedHosts: ["index.dev.hexly.ai"],
	},
	build: { target: "es2022" },
});
