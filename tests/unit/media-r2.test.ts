import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { planMedia, publishMedia } from "../../scripts/media-r2";

vi.mock("node:child_process", () => ({
	spawnSync: vi.fn(() => ({ status: 0 })),
}));
const directory = await mkdtemp(join(tmpdir(), "hexly-media-test-"));
const file = join(directory, "Example Film.mp4");
const bytes = Buffer.from("local test bytes; never uploaded");
await writeFile(file, bytes);
const input = {
	project: "hermes-on-herdr",
	video: "context-en",
	version: "1.0.0",
	file,
};
const asset = await planMedia(input);
const served = (body = bytes) =>
	new Response(body, {
		headers: {
			"Content-Type": "video/mp4",
			"Content-Length": String(body.length),
		},
	});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.clearAllMocks();
});
afterAll(() => rm(directory, { recursive: true, force: true }));

describe("versioned R2 media", () => {
	it("separates new project material kinds and independent versions", async () => {
		const image = join(directory, "Library Cover.webp");
		await writeFile(image, bytes);
		const material = await planMedia({
			project: "snail",
			kind: "screenshots",
			asset: "library",
			version: "1.2.0",
			file: image,
		});
		expect(material.key).toMatch(
			/^projects\/snail\/screenshots\/library\/v1\.2\.0\/library-cover-[a-f0-9]{12}\.webp$/,
		);
		expect(material).toMatchObject({
			kind: "screenshots",
			version: "1.2.0",
			contentType: "image/webp",
		});
		await expect(
			planMedia({ ...input, kind: "screenshots" }),
		).rejects.toThrow();
		await expect(
			planMedia({
				project: "snail",
				kind: "../../bad",
				asset: "library",
				version: "1.0.0",
				file: image,
			}),
		).rejects.toThrow();
	});
	it("produces stable URLs from bytes and separates project, film and version", async () => {
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		expect(asset).toMatchObject({
			bucket: "hexlyai",
			sha256,
			bytes: bytes.length,
			contentType: "video/mp4",
		});
		expect(asset.url).toBe(
			`https://h.no.mt/projects/hermes-on-herdr/videos/context-en/v1.0.0/example-film-${sha256.slice(0, 12)}.mp4`,
		);
		for (const patch of [
			{ version: "1.1.0" },
			{ video: "walkthrough" },
			{ project: "pew" },
		]) {
			expect((await planMedia({ ...input, ...patch })).key).not.toBe(asset.key);
		}
		const revised = join(directory, "Revised.mp4");
		await writeFile(revised, "different recording");
		expect((await planMedia({ ...input, file: revised })).sha256).not.toBe(
			sha256,
		);
		expect(spawnSync).not.toHaveBeenCalled();
	});
	it.each([
		{ project: "../hermes-on-herdr" },
		{ project: "not-a-catalogue-project" },
		{ video: "../../overwrite" },
		{ version: "latest" },
		{ version: "01.0.0" },
		{ file: join(directory, ".env") },
	])("rejects unsafe or unversioned publication inputs", async (patch) => {
		await expect(planMedia({ ...input, ...patch })).rejects.toThrow();
		expect(spawnSync).not.toHaveBeenCalled();
	});
	it("reuses verified existing bytes without issuing a write", async () => {
		const request = vi
			.fn()
			.mockResolvedValueOnce(new Response(null))
			.mockResolvedValueOnce(served());
		vi.stubGlobal("fetch", request);
		expect((await publishMedia(asset, file)).action).toBe("reused");
		expect(spawnSync).not.toHaveBeenCalled();
		expect(
			new URL(String(request.mock.calls[0]?.[0])).searchParams.has("inspect"),
		).toBe(true);
	});
	it("stops on an authorization failure before any upload", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 403 })),
		);
		await expect(publishMedia(asset, file)).rejects.toThrow("HTTP 403");
		expect(spawnSync).not.toHaveBeenCalled();
	});
	it("preserves an existing object whose content differs", async () => {
		const other = Buffer.alloc(bytes.length, 65);
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce(new Response(null))
				.mockResolvedValueOnce(served(other)),
		);
		await expect(publishMedia(asset, file)).rejects.toThrow(
			"checksum mismatch",
		);
		expect(spawnSync).not.toHaveBeenCalled();
	});
	it("uploads a missing object with explicit remote MIME and cache settings, then verifies it", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce(new Response(null, { status: 404 }))
				.mockResolvedValueOnce(served()),
		);
		expect((await publishMedia(asset, file)).action).toBe("uploaded");
		expect(spawnSync).toHaveBeenCalledWith(
			"wrangler",
			expect.arrayContaining([
				`${asset.bucket}/${asset.key}`,
				"--remote",
				"--content-type",
				"video/mp4",
				"--cache-control",
				asset.cacheControl,
			]),
			expect.objectContaining({ timeout: 120_000 }),
		);
	});
});
