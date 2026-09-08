import projectIds from "../src/data/projects/index.json" with { type: "json" };

interface Env {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const slugs = new Set(projectIds);

function cors(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("Access-Control-Allow-Origin", "*");
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
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const host = (request.headers.get("Host") ?? url.host)
			.split(":")[0]
			?.toLowerCase();
		let changed = false;
		if (host === "www.hexly.ai") {
			url.hostname = "hexly.ai";
			url.protocol = "https:";
			changed = true;
		}
		const path = url.pathname.replace(/\/+$/, "") || "/";
		if (path === "/projects") {
			url.pathname = "/";
			changed = true;
		} else {
			const slug = path.slice(1);
			if (slug && !path.startsWith("/logos/") && slugs.has(slug)) {
				url.pathname = `/logos/${slug}`;
				changed = true;
			}
		}
		if (changed) {
			return new Response(null, {
				status: 301,
				headers: { Location: url.toString() },
			});
		}
		if (path === "/api/share.json" || path.startsWith("/api/share/")) {
			const id = /^\/api\/share\/([a-z0-9]+(?:-[a-z0-9]+)*)\.json$/.exec(
				path,
			)?.[1];
			if (
				path !== "/api/share.json" &&
				(!id || (id !== "hexly-ai" && !slugs.has(id)))
			) {
				return shareResponse(
					JSON.stringify({ error: "Not found" }),
					404,
					"application/json; charset=utf-8",
				);
			}
			return cors(await env.ASSETS.fetch(request));
		}
		return env.ASSETS.fetch(request);
	},
};
