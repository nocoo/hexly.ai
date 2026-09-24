const headers = {
	"Content-Type": "application/json; charset=utf-8",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
	"X-Content-Type-Options": "nosniff",
};

export async function projectApiResponse(
	request: Request,
	env: Env,
	ctx?: ExecutionContext,
): Promise<Response> {
	const url = new URL(request.url);
	const error = (status: number, message: string) =>
		new Response(
			request.method === "HEAD" ? null : JSON.stringify({ error: message }),
			{
				status,
				headers: {
					...headers,
					"Cache-Control": "no-store",
					...(status === 405 ? { Allow: "GET, HEAD, OPTIONS" } : {}),
				},
			},
		);
	if (request.method === "OPTIONS")
		return new Response(null, { status: 204, headers });
	if (!["GET", "HEAD"].includes(request.method))
		return error(405, "Method not allowed");
	if (url.search)
		return error(
			400,
			"Query parameters are not supported; request one repository name",
		);
	let repo: string;
	let owner: string;
	try {
		const parts = url.pathname.slice("/api/projects/".length).split("/");
		if (parts.length !== 2)
			return error(400, "A single owner/repository pair is required");
		owner = decodeURIComponent(parts[0] ?? "").toLowerCase();
		repo = decodeURIComponent(parts[1] ?? "").toLowerCase();
	} catch {
		return error(400, "Invalid repository name");
	}
	if (
		!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/.test(owner) ||
		!/^[a-z0-9_-][a-z0-9._-]{0,99}$/.test(repo)
	)
		return error(400, "A valid owner and repository name are required");
	const key = new Request(`${url.origin}/api/projects/${owner}/${repo}`);
	try {
		let response =
			env.STATUS_MODE === "live" ? await caches.default.match(key) : undefined;
		if (!response) {
			const asset = await env.ASSETS.fetch(
				new Request(`${url.origin}/data/project-api/${owner}/${repo}.json`),
			);
			if (asset.status >= 500)
				return error(503, "Project API temporarily unavailable");
			if (
				!asset.ok ||
				!asset.headers.get("Content-Type")?.includes("application/json")
			)
				return error(404, "Repository not found");
			response = new Response(asset.body, {
				headers: {
					...headers,
					"Cache-Control": "public, max-age=3600",
					Date: new Date().toUTCString(),
				},
			});
			if (env.STATUS_MODE === "live" && ctx) {
				ctx.waitUntil(
					caches.default.put(key, response.clone()).catch(() => {
						console.error(
							JSON.stringify({ event: "project_api_cache_write_failed" }),
						);
					}),
				);
			}
		}
		return request.method === "HEAD"
			? new Response(null, { headers: response.headers })
			: response;
	} catch {
		return error(503, "Project API temporarily unavailable");
	}
}
