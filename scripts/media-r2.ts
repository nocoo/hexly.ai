import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { copyFile, mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import storage from "../src/data/media-storage.json" with { type: "json" };

const root = fileURLToPath(new URL("../", import.meta.url));
export const cacheControl = "public, max-age=31536000, immutable";
export const mediaTypes: Record<string, string> = {
	".mp4": "video/mp4",
	".webm": "video/webm",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".vtt": "text/vtt; charset=utf-8",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".woff": "font/woff",
	".ttf": "font/ttf",
	".otf": "font/otf",
	".gif": "image/gif",
	".avif": "image/avif",
	".mp3": "audio/mpeg",
	".wav": "audio/wav",
	".pdf": "application/pdf",
	".pptx":
		"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".zip": "application/zip",
	".json": "application/json; charset=utf-8",
	".txt": "text/plain; charset=utf-8",
	".md": "text/plain; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
};

export async function planMedia(input: {
	project: string;
	video?: string;
	kind?: string;
	asset?: string;
	version: string;
	file: string;
}) {
	const { project, video, version, file } = input;
	const kind = video ? "videos" : input.kind;
	const assetId = video ?? input.asset;
	if (
		!assetId ||
		![project, assetId].every((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
	)
		throw new Error("Use catalogue and asset IDs made of lowercase slugs.");
	if (
		!kind ||
		![
			"videos",
			"identity",
			"heroes",
			"textures",
			"screenshots",
			"social",
			"fonts",
			"audio",
			"documents",
		].includes(kind) ||
		(video && (input.kind || input.asset))
	)
		throw new Error(
			"Use --video, or --kind and --asset, with a supported material kind.",
		);
	if (
		project !== "hexly-ai" &&
		!existsSync(join(root, "src/data/projects", `${project}.json`))
	)
		throw new Error(`Unknown catalogue project: ${project}`);
	if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version))
		throw new Error("Use the asset's independent X.Y.Z version, without v.");
	const extension = extname(file).toLowerCase();
	const contentType = mediaTypes[extension];
	if (!contentType)
		throw new Error(
			"Unsupported material format; see mediaTypes in scripts/media-r2.ts.",
		);
	const source = await stat(file);
	if (!source.isFile() || source.size === 0)
		throw new Error("Upload a non-empty media file.");
	const hash = createHash("sha256");
	for await (const chunk of createReadStream(file)) hash.update(chunk);
	const sha256 = hash.digest("hex");
	const stem = basename(file, extname(file))
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	const key = `projects/${project}/${kind}/${assetId}/v${version}/${stem || "asset"}-${sha256.slice(0, 12)}${extension}`;
	return {
		project,
		kind,
		asset: assetId,
		version,
		bucket: storage.bucket,
		key,
		url: `${storage.origin}/${key}`,
		filename: basename(file),
		bytes: source.size,
		sha256,
		contentType,
		cacheControl,
	};
}

export async function publishMedia(
	asset: Awaited<ReturnType<typeof planMedia>>,
	file: string,
) {
	// A unique query keeps the existence probe from caching a 404 on the public URL.
	const probe = new URL(asset.url);
	probe.searchParams.set("inspect", randomUUID());
	const existing = await fetch(probe, {
		method: "HEAD",
		redirect: "error",
		signal: AbortSignal.timeout(20_000),
	});
	if (existing.status !== 200 && existing.status !== 404)
		throw new Error(
			`CDN inspection returned HTTP ${existing.status}; stopped.`,
		);
	if (existing.status === 404) {
		const result = spawnSync(
			"wrangler",
			[
				"r2",
				"object",
				"put",
				`${asset.bucket}/${asset.key}`,
				"--file",
				file,
				"--remote",
				"--content-type",
				asset.contentType,
				"--cache-control",
				asset.cacheControl,
			],
			{ cwd: root, stdio: "inherit", timeout: 120_000 },
		);
		if (result.error) throw result.error;
		if (result.status !== 0)
			throw new Error("Wrangler upload failed; stopped.");
	}
	const response = await fetch(asset.url, {
		redirect: "error",
		signal: AbortSignal.timeout(120_000),
	});
	if (
		response.status !== 200 ||
		!response.body ||
		response.headers.get("content-type")?.split(";")[0] !==
			asset.contentType.split(";")[0] ||
		Number(response.headers.get("content-length")) !== asset.bytes
	)
		throw new Error(
			"Public object response, MIME type or size does not match.",
		);
	const hash = createHash("sha256");
	const reader = response.body.getReader();
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		hash.update(value);
	}
	if (hash.digest("hex") !== asset.sha256)
		throw new Error("Public checksum mismatch. Do not overwrite; investigate.");
	return { ...asset, action: existing.status === 200 ? "reused" : "uploaded" };
}

if (import.meta.main) {
	const { values } = parseArgs({
		args: process.argv.slice(2).filter((arg) => arg !== "--"),
		options: {
			project: { type: "string" },
			video: { type: "string" },
			kind: { type: "string" },
			asset: { type: "string" },
			version: { type: "string" },
			file: { type: "string" },
			upload: { type: "boolean", default: false },
		},
	});
	const { project, video, kind, asset, version, file } = values;
	if (!project || !(video || (kind && asset)) || !version || !file)
		throw new Error(
			"Required: --project <id> (--video <id> | --kind <kind> --asset <id>) --version X.Y.Z --file <path>. Add --upload to publish.",
		);
	const input = { project, video, kind, asset, version, file: resolve(file) };
	if (!values.upload) {
		console.info(JSON.stringify(await planMedia(input), null, 2));
	} else {
		// Freeze the supplied bytes; a consumer may continue editing its own output.
		const temporary = await mkdtemp(join(tmpdir(), "hexly-r2-upload-"));
		try {
			const frozen = join(temporary, basename(file));
			await copyFile(input.file, frozen);
			const asset = await planMedia({ ...input, file: frozen });
			console.info(JSON.stringify(await publishMedia(asset, frozen), null, 2));
		} finally {
			await rm(temporary, { recursive: true, force: true });
		}
	}
}
