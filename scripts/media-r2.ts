import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { copyFile, mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import storage from "../src/data/media-storage.json";

const root = fileURLToPath(new URL("../", import.meta.url));
const cacheControl = "public, max-age=31536000, immutable";
const types: Record<string, string> = {
	".mp4": "video/mp4",
	".webm": "video/webm",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".vtt": "text/vtt; charset=utf-8",
};

export async function planMedia(input: {
	project: string;
	video: string;
	version: string;
	file: string;
}) {
	const { project, video, version, file } = input;
	if (![project, video].every((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)))
		throw new Error("Use catalogue and video IDs made of lowercase slugs.");
	if (!existsSync(join(root, "src/data/projects", `${project}.json`)))
		throw new Error(`Unknown catalogue project: ${project}`);
	if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version))
		throw new Error("Use the video's independent X.Y.Z version, without v.");
	const extension = extname(file).toLowerCase();
	const contentType = types[extension];
	if (!contentType)
		throw new Error("Use MP4, WebM, PNG, JPEG, WebP or WebVTT.");
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
	const key = `projects/${project}/videos/${video}/v${version}/${stem || "asset"}-${sha256.slice(0, 12)}${extension}`;
	return {
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
			version: { type: "string" },
			file: { type: "string" },
			upload: { type: "boolean", default: false },
		},
	});
	const { project, video, version, file } = values;
	if (!project || !video || !version || !file)
		throw new Error(
			"Required: --project <id> --video <id> --version X.Y.Z --file <path>. Add --upload to publish.",
		);
	const input = { project, video, version, file: resolve(file) };
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
