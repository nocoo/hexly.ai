interface Env {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (url.hostname === "www.hexly.ai") {
			url.hostname = "hexly.ai";
			url.protocol = "https:";
			return new Response(null, {
				status: 301,
				headers: { Location: url.toString() },
			});
		}
		return env.ASSETS.fetch(request);
	},
};
