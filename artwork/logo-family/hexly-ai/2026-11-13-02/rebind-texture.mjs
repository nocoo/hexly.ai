import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

const previousRoot = "/textures/hexly-ai/v1.0.1";
const root = "/textures/hexly-ai/v1.0.2";
const path = "src/data/projects/hexly-ai.json";
const project = JSON.parse(await readFile(path, "utf8"));
const manifest = JSON.parse(
	await readFile(`public${previousRoot}/manifest.json`, "utf8"),
);
const provenance = JSON.parse(
	await readFile(`public${previousRoot}/provenance.json`, "utf8"),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const stringify = (value) => `${JSON.stringify(value, null, "\t")}\n`;
const previousIdentity = manifest.officialProjectIdentity;
const original = await readFile(`public${project.logo.original}`);
const identity = {
	path: project.logo.original,
	sha256: hash(original),
	rgbaSha256: hash(await sharp(original).ensureAlpha().raw().toBuffer()),
	width: project.logo.width,
	height: project.logo.height,
	bytes: original.length,
	source: project.logo.sourceUrl,
	kind: project.logo.kind,
};
const relocate = (value) =>
	JSON.parse(JSON.stringify(value).replaceAll(previousRoot, root));
const generations = relocate(manifest.generations);
project.brandTexture = { ...project.brandTexture, root, version: "1.0.2" };
const output = `public${root}`;
await mkdir(output, { recursive: true });
const save = async (name, bytes) => {
	try {
		await writeFile(`${output}/${name}`, bytes, { flag: "wx" });
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		assert.ok(
			(await readFile(`${output}/${name}`)).equals(Buffer.from(bytes)),
			name,
		);
	}
};
for (const file of manifest.files) {
	const name = basename(file.path);
	if (name === "provenance.json") continue;
	let bytes = await readFile(`public${file.path}`);
	assert.equal(hash(bytes), file.sha256);
	if (["guide.md", "review.html"].includes(name)) {
		let text = bytes
			.toString()
			.replaceAll(previousRoot, root)
			.replaceAll(previousIdentity.path, identity.path)
			.replaceAll(previousIdentity.sha256, identity.sha256)
			.replaceAll("v1.0.1", "v1.0.2");
		if (name === "guide.md")
			text +=
				"\n## Identity binding update\n\nVersion 1.0.2 reuses every texture image and original generation/approval record byte-for-byte from v1.0.1. Only the current Logo association and package metadata change. No image generation, crop, recolor or new surface design occurred. The previous package remains immutable.\n";
		bytes = Buffer.from(text);
	}
	await save(name, bytes);
}
const nextProvenance = {
	...provenance,
	version: "1.0.2",
	officialProjectIdentity: identity,
	generations,
	identityBindingUpdate: {
		date: "2026-11-15",
		previousRoot,
		previousIdentity,
		reason:
			"Associate unchanged texture bytes with the explicitly adopted two-tone Hexly Logo.",
		generationCalls: 0,
		texturePixelsUnchanged: true,
	},
};
await save("provenance.json", stringify(nextProvenance));
const files = await Promise.all(
	manifest.files.map(async (file) => {
		const name = basename(file.path);
		const bytes = await readFile(`${output}/${name}`);
		if (!["provenance.json", "guide.md", "review.html"].includes(name))
			assert.equal(hash(bytes), file.sha256);
		return {
			...file,
			path: `${root}/${name}`,
			bytes: bytes.length,
			sha256: hash(bytes),
		};
	}),
);
await save(
	"manifest.json",
	stringify({
		...manifest,
		root,
		version: "1.0.2",
		catalogue: project.brandTexture,
		officialProjectIdentity: identity,
		generations,
		files,
	}),
);
await writeFile(path, stringify(project));
console.info(
	"Rebound texture metadata to the selected identity; all image and generation-receipt bytes are unchanged.",
);
