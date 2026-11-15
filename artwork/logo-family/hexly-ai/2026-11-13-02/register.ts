import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import {
	assetKey,
	digest,
	filesIn,
	readInventory,
	type StoredAsset,
} from "../../../../scripts/asset-storage";
import { mediaTypes } from "../../../../scripts/media-r2";
import identity from "../../../../src/data/projects/hexly-ai.json";
import cards from "../../../../src/data/social-cards.json";

const study = "artwork/logo-family/hexly-ai/2026-11-13-02";
const provenance = `${study}/adoption.json`;
const document = readInventory();
const records = new Map(document.files.map((file) => [file.source, file]));
const original = new Map(document.files.map((file) => [file.source, file]));
const selected: StoredAsset[] = [];
const add = async (
	source: string,
	path: string | undefined,
	project = "hexly-ai",
	role: StoredAsset["role"] = "hexly-campaign",
	key?: string,
) => {
	const bytes = await readFile(source);
	const sha256 = digest(bytes);
	const entry: StoredAsset = {
		source,
		...(path ? { path } : {}),
		version: path?.startsWith("/logos/family/")
			? "historical"
			: (path?.match(/\/v(\d+\.\d+\.\d+)\//)?.[1] ?? "1.0.0"),
		key:
			key ??
			(path
				? assetKey(path, sha256, project)
				: `archives/sources/v1.0.0/${sha256}${extname(source)}`),
		bytes: bytes.length,
		sha256,
		contentType: mediaTypes[extname(source)] ?? "application/octet-stream",
		project,
		role,
		provenance,
	};
	const old = records.get(source);
	if (old) {
		assert.equal(old.sha256, sha256, `Immutable source changed: ${source}`);
		selected.push(old);
	} else {
		records.set(source, entry);
		selected.push(entry);
	}
};
for (const directory of [
	`public${identity.family.root}`,
	`public${identity.presentationIcon.root}`,
	`public${identity.brandTexture.root}`,
	"packages/video-kit/public/video-kit/1.2.0/hexly",
])
	for (const source of filesIn(directory)) {
		const path = source.startsWith("public/")
			? source.slice(6)
			: source.slice("packages/video-kit/public".length);
		await add(source, path);
	}
await add(
	`public${identity.logo.original}`,
	identity.logo.original,
	"hexly-ai",
	"official-project-identity",
);
for (const size of [32, 64, 160, 256, 512, 1024]) {
	const path = identity.logo.display.replace("1024.webp", `${size}.webp`);
	await add(`public${path}`, path);
}
for (const [project, card] of [
	["hexly-ai", cards.site],
	...Object.entries(cards.projects),
] as const)
	await add(`public${card.path}`, card.path, project);
const publicByHash = new Map(selected.map((file) => [file.sha256, file.key]));
for (const source of [
	`${study}/raw/generated.png`,
	...filesIn(`${study}/finishing/02`).filter((path) =>
		/\.(png|webp)$/.test(path),
	),
]) {
	const key = publicByHash.get(digest(await readFile(source)));
	await add(source, `/${source}`, "hexly-ai", "source-archive", key);
}
const oldRoot = records.get("logo.png");
assert(oldRoot);
assert(
	document.files.some(
		(file) =>
			file.source !== "logo.png" &&
			file.key === oldRoot.key &&
			file.sha256 === oldRoot.sha256,
	),
);
assert.equal(
	digest(await readFile("logo.png")),
	identity.family.foreground.sha256,
);
records.set("logo.png", {
	...oldRoot,
	key: `${identity.family.root.slice(1)}/transparent.png`,
	bytes: identity.logo.bytes,
	sha256: identity.family.foreground.sha256,
	provenance,
});
for (const [source, record] of original)
	if (source !== "logo.png") assert.deepEqual(records.get(source), record);
document.files = [...records.values()].sort((a, b) =>
	a.source.localeCompare(b.source),
);
await writeFile(
	"docs/assets/inventory.json",
	`${JSON.stringify(document, null, 2)}\n`,
);
const routes = JSON.parse(
	await readFile("src/data/asset-routes.json", "utf8"),
) as Record<string, string>;
for (const file of selected)
	if (
		file.path &&
		file.key !== file.path.slice(1) &&
		!/^\/(textures|icons)\/[^/]+\/v[^/]+\//.test(file.path)
	)
		routes[file.path] = file.key;
await writeFile(
	"src/data/asset-routes.json",
	`${JSON.stringify(routes, null, "\t")}\n`,
);
readInventory();
const objects = [...new Map(selected.map((file) => [file.key, file])).values()];
await writeFile(
	`${study}/publication-plan.json`,
	`${JSON.stringify(
		{
			project: "hexly-ai",
			scope:
				"Selected identity, platform exports, current Video Kit mark and shared Hexly badge on existing share cards only",
			objects: objects.map((file) => ({
				key: file.key,
				sha256: file.sha256,
				source: file.source,
			})),
		},
		null,
		"\t",
	)}\n`,
);
console.info(
	`Registered ${records.size - original.size} scoped source paths and ${objects.length} publication objects. All prior rows except the authorized root-logo alias are unchanged.`,
);
