/// <reference types="vite/client" />
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
	const pack = path.match(
		/^\/(textures|icons)\/([a-z0-9-]+)\/v(\d+\.\d+\.\d+)\/([a-zA-Z0-9][a-zA-Z0-9._-]*)$/,
	);
	return (
		aliases[path] ??
		(pack ? `projects/${pack[2]}/${pack[1]}/v${pack[3]}/${pack[4]}` : null) ??
		(/^\/(?:brands\/[^/]+\/v\d+\.\d+\.\d+\/|logos\/family\/|video-kit\/\d+\.\d+\.\d+\/)/.test(
			path,
		)
			? path.slice(1)
			: null)
	);
}

export function assetUrl(
	value: string,
	local = import.meta.env?.DEV &&
		import.meta.env.MODE === "development" &&
		import.meta.env.VITE_LOCAL_MATERIALS === "1",
): string {
	if (local && value.startsWith(`${storage.origin}/`)) {
		const remote = value.slice(storage.origin.length + 1);
		const key = remote.split(/[?#]/)[0] ?? "";
		const path =
			Object.keys(aliases).find((path) => aliases[path] === key) ??
			`/${key.replace(/^projects\/([^/]+)\/(textures|icons)\//, "$2/$1/")}`;
		if (assetKeyForPath(path) === key)
			return `${path}${remote.slice(key.length)}`;
	}
	const relative = value.startsWith("https://hexly.ai/")
		? value.slice("https://hexly.ai".length)
		: value;
	const path = relative.split(/[?#]/)[0] ?? "";
	const key = assetKeyForPath(path);
	if (key && local) return relative;
	return key ? `${storage.origin}/${key}${relative.slice(path.length)}` : value;
}
