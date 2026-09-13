import projectIds from "../data/projects/index.json" with { type: "json" };

export const siteOrigin = "https://hexly.ai";

const projects = new Set(projectIds);

/** Page aliases only. Logo files and their archived paths are never rewritten. */
export function legacyRoute(
	pathname: string,
): { path: string; anchor?: string } | undefined {
	const path = pathname.replace(/\/+$/, "") || "/";
	if (path === "/projects") return { path: "/" };
	if (path === "/videos" || path.startsWith("/videos/"))
		return { path: path.replace(/^\/videos/, "/templates") };
	const logo = /^\/logos\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path);
	const slug = logo?.[1] ?? path.slice(1);
	if (slug === "hermes-gateway-herdr")
		return { path: "/projects/hermes-on-herdr", anchor: "brand" };
	if (projects.has(slug))
		return {
			path: `/projects/${slug}`,
			...(logo ? { anchor: "brand" } : {}),
		};
	return undefined;
}
