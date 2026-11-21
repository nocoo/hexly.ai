import projectIds from "../src/data/projects/index.json" with { type: "json" };
import { assetKeyForPath, assetUrl } from "../src/model/assets";
import { legacyRoute } from "../src/model/routes";
import { projectApiResponse } from "./project-api";
import { runStatusChecks, statusResponse } from "./status";

const slugs = new Set(projectIds);

function isKnownHtmlPath(path: string): boolean {
	if (
		path === "/" ||
		path === "/logos" ||
		path === "/brand" ||
		path === "/status"
	)
		return true;
	const project = /^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path)?.[1];
	if (project && slugs.has(project)) return true;
	return /^\/(brands|textures|artwork\/logo-family|logos\/family)\//.test(path);
}

function notFoundHtmlResponse(method: string): Response {
	const headers = {
		"Content-Type": "text/html; charset=utf-8",
		"Cache-Control": "no-store",
		"X-Robots-Tag": "noindex",
	};
	return new Response(
		method === "HEAD"
			? null
			: '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Not found — hexly.ai</title></head><body><main><h1>Page not found.</h1><p><a href="/">Back to hexly.ai</a></p></main></body></html>',
		{ status: 404, headers },
	);
}

function noindex(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("X-Robots-Tag", "noindex");
	return new Response(response.body, { status: response.status, headers });
}

function cors(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("X-Robots-Tag", "noindex");
	return new Response(response.body, { status: response.status, headers });
}

function shareResponse(
	body: string,
	status: number,
	contentType: string,
): Response {
	return new Response(body, {
		status,
		headers: {
			"Content-Type": contentType,
			"Access-Control-Allow-Origin": "*",
			"X-Robots-Tag": "noindex",
		},
	});
}

export default {
	async scheduled(controller: ScheduledController, env: Env): Promise<void> {
		await runStatusChecks(env, controller.scheduledTime);
	},
	async fetch(
		request: Request,
		env: Env,
		ctx?: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);
		const host = (request.headers.get("Host") ?? url.host)
			.split(":")[0]
			?.toLowerCase();
		let changed = false;
		if (host === "www.hexly.ai") {
			url.hostname = "hexly.ai";
			url.protocol = "https:";
			url.port = "";
			changed = true;
		}
		const originalPath = url.pathname.replace(/\/+$/, "") || "/";
		if (env.STATUS_MODE === "live" && assetKeyForPath(url.pathname)) {
			if (!["GET", "HEAD"].includes(request.method))
				return new Response(null, {
					status: 405,
					headers: { Allow: "GET, HEAD" },
				});
			return new Response(null, {
				status: 302,
				headers: {
					Location: assetUrl(`${url.pathname}${url.search}`),
					"Cache-Control": "public, max-age=300",
				},
			});
		}
		if (host === "status.hexly.ai" && originalPath === "/") {
			url.pathname = "/status";
			return env.ASSETS.fetch(new Request(url, request));
		}
		const legacy = legacyRoute(originalPath);
		if (legacy) {
			url.pathname = legacy.path;
			if (legacy.anchor && !url.hash) url.hash = legacy.anchor;
			changed = true;
		}
		const path = url.pathname.replace(/\/+$/, "") || "/";
		if (
			host === "status.hexly.ai" &&
			(legacy ||
				path === "/logos" ||
				path === "/brand" ||
				/^\/projects\/[a-z0-9-]+$/.test(path))
		) {
			url.hostname = "hexly.ai";
			url.protocol = "https:";
			url.port = "";
			return Response.redirect(url.toString(), 301);
		}
		if (changed) {
			return new Response(null, {
				status: 301,
				headers: { Location: url.toString() },
			});
		}
		if (path === "/api/projects" || path.startsWith("/api/projects/")) {
			return noindex(await projectApiResponse(request, env, ctx));
		}
		if (path === "/api/status") {
			if (!["GET", "HEAD"].includes(request.method))
				return Response.json(
					{ error: "Method not allowed" },
					{
						status: 405,
						headers: { Allow: "GET, HEAD", "X-Robots-Tag": "noindex" },
					},
				);
			const key = new Request(`${url.origin}/api/status`);
			const cached =
				env.STATUS_MODE === "live"
					? await caches.default.match(key)
					: undefined;
			const response = cached ?? (await statusResponse(env));
			if (!cached && response.ok && env.STATUS_MODE === "live" && ctx)
				ctx.waitUntil(caches.default.put(key, response.clone()));
			return noindex(
				request.method === "HEAD"
					? new Response(null, {
							status: response.status,
							headers: response.headers,
						})
					: response,
			);
		}
		if (path === "/api/share.json" || path.startsWith("/api/share/")) {
			const id = /^\/api\/share\/([a-z0-9]+(?:-[a-z0-9]+)*)\.json$/.exec(
				path,
			)?.[1];
			if (
				path !== "/api/share.json" &&
				(!id || (id !== "site" && !slugs.has(id)))
			) {
				return shareResponse(
					JSON.stringify({ error: "Not found" }),
					404,
					"application/json; charset=utf-8",
				);
			}
			return cors(await env.ASSETS.fetch(request));
		}
		let response = await env.ASSETS.fetch(request);
		if (
			response.status === 200 &&
			response.headers.get("Content-Type")?.includes("text/html") &&
			!isKnownHtmlPath(path)
		) {
			return notFoundHtmlResponse(request.method);
		}
		const reviewDocument =
			/^\/(brands|textures|artwork\/logo-family)\//.test(path) &&
			/\/review(?:\.html)?$/.test(path) &&
			response.status === 200 &&
			response.headers.get("Content-Type")?.includes("text/html");
		if (reviewDocument) {
			response = new Response(response.body, response);
			response.headers.append("Vary", "Accept, Sec-Fetch-Dest");
		}
		if (
			request.method === "GET" &&
			reviewDocument &&
			(request.headers.get("Sec-Fetch-Dest") === "document" ||
				request.headers.get("Accept")?.includes("text/html")) &&
			response.status === 200
		) {
			// Enhance the browser view, preserving raw fetch/download responses and all frozen source bytes.
			const enhanced = new HTMLRewriter()
				.on("body", {
					element(element) {
						element.append(
							'<script type="module" src="/material-downloads.js"></script>',
							{ html: true },
						);
					},
				})
				.transform(response);
			enhanced.headers.delete("ETag");
			enhanced.headers.set("Cache-Control", "no-store");
			return enhanced;
		}
		return response;
	},
} satisfies ExportedHandler<Env>;
