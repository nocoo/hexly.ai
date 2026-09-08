import projectIds from "../src/data/projects/index.json" with { type: "json" };

interface Env {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const slugs = new Set(projectIds);

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
		return env.ASSETS.fetch(request);
	},
};
