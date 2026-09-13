import routes from "../data/asset-routes.json" with { type: "json" };
import storage from "../data/media-storage.json" with { type: "json" };

const aliases: Record<string, string> = routes;

/** Catalogue/manifests retain canonical identity paths; delivery has its own origin. */
export function assetKeyForPath(path: string): string | null {
	if (
		!/^\/[a-zA-Z0-9/_.-]+$/.test(path) ||
		path.split("/").includes("..") ||
		!/\.[a-zA-Z0-9]+$/.test(path) ||
		/\.(html|js|css)$/.test(path)
	)
		return null;
	return (
		aliases[path] ??
		(/^\/(?:brands\/[^/]+\/v\d+\.\d+\.\d+\/|logos\/family\/|video-kit\/\d+\.\d+\.\d+\/)/.test(
			path,
		)
			? path.slice(1)
			: null)
	);
}

export function assetUrl(value: string): string {
	const relative = value.startsWith("https://hexly.ai/")
		? value.slice("https://hexly.ai".length)
		: value;
	const path = relative.split(/[?#]/)[0] ?? "";
	const key = assetKeyForPath(path);
	return key ? `${storage.origin}/${key}${relative.slice(path.length)}` : value;
}
