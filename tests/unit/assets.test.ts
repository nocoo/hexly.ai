import { execFileSync, spawnSync } from "node:child_process";
import {
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
	assetKey,
	authenticatedRequest,
	digest,
	readInventory,
	verifiedBytes,
	verifiedPublication,
} from "../../scripts/asset-storage";
import { readProjects } from "../../src/data/read-projects";
import { assetKeyForPath, assetUrl } from "../../src/model/assets";

describe("R2 material delivery", () => {
	it("rejects forced material additions while preserving source files and local hydration", () => {
		const directory = mkdtempSync(join(tmpdir(), "hexly-tracked-assets-test-"));
		const script = resolve("scripts/asset-storage.ts");
		const repositoryVariables = new Set(
			execFileSync("git", ["rev-parse", "--local-env-vars"], {
				encoding: "utf8",
			})
				.trim()
				.split("\n"),
		);
		const env = Object.fromEntries(
			Object.entries(process.env).filter(
				([name]) => !repositoryVariables.has(name),
			),
		);
		const git = (...args: string[]) =>
			execFileSync("git", args, {
				cwd: directory,
				encoding: "utf8",
				env,
			}).trim();
		const check = () =>
			spawnSync("bun", [script, "check-tracked"], {
				cwd: directory,
				encoding: "utf8",
				env,
			});
		try {
			git("init", "-b", "main");
			expect(git("rev-parse", "--absolute-git-dir")).toBe(
				realpathSync(join(directory, ".git")),
			);
			for (const [path, bytes] of [
				[".gitignore", "*.PNG\n"],
				["identity.svg", '<svg xmlns="http://www.w3.org/2000/svg"/>'],
				["dependency.tgz", "required vendored code fixture"],
				["new logo.PNG", "hydrated material fixture"],
			] as const)
				writeFileSync(join(directory, path), bytes);
			git("add", "--", ".gitignore", "identity.svg", "dependency.tgz");
			expect(check().status).toBe(0);
			git("add", "-f", "--", "new logo.PNG");
			const rejected = check();
			expect(rejected.status).not.toBe(0);
			expect(rejected.stderr).toContain("Tracked material binaries (1)");
			expect(rejected.stderr).toContain("new logo.PNG");
			git("rm", "--cached", "--", "new logo.PNG");
			expect(check().status).toBe(0);
			expect(readFileSync(join(directory, "new logo.PNG"), "utf8")).toBe(
				"hydrated material fixture",
			);
		} finally {
			rmSync(directory, { recursive: true, force: true });
		}
	});
	it("retries a disconnected response body and stops on conflicting bytes", async () => {
		const bytes = new TextEncoder().encode("complete fixture");
		const template = readInventory().files[0];
		if (!template) throw new Error("Missing asset fixture");
		const file = {
			...template,
			bytes: bytes.length,
			sha256: digest(bytes),
		};
		const request = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(
					new ReadableStream({
						start(controller) {
							controller.error(new Error("Disconnected body fixture"));
						},
					}),
				),
			)
			.mockResolvedValueOnce(
				new Response(bytes, { headers: { "Content-Type": file.contentType } }),
			);
		vi.stubGlobal("fetch", request);
		try {
			expect(await verifiedBytes(file)).toEqual(bytes);
			expect(request).toHaveBeenCalledTimes(2);
			request.mockReset().mockResolvedValue(new Response("wrong bytes"));
			await expect(verifiedBytes(file)).rejects.toThrow(
				"checksum/size mismatch",
			);
			expect(request).toHaveBeenCalledTimes(1);
		} finally {
			vi.unstubAllGlobals();
		}
	});
	it("recovers an expired credential once, but stops on denied or changed-account access", async () => {
		const auth = { token: "expired-fixture", account: "fixture-account" };
		const operation = vi
			.fn()
			.mockResolvedValueOnce(new Response("Expired", { status: 401 }))
			.mockResolvedValueOnce(new Response("Uploaded"));
		const result = await authenticatedRequest(auth, operation, () => ({
			token: "renewed-fixture",
			account: "fixture-account",
		}));
		expect(result.status).toBe(200);
		expect(operation.mock.calls).toEqual([
			["expired-fixture"],
			["renewed-fixture"],
		]);
		expect(auth.token).toBe("renewed-fixture");
		operation
			.mockReset()
			.mockResolvedValue(new Response("Denied", { status: 401 }));
		await expect(
			authenticatedRequest(auth, operation, () => ({ ...auth })),
		).rejects.toThrow("without a credential refresh");
		expect(operation).toHaveBeenCalledTimes(1);
		operation
			.mockReset()
			.mockResolvedValue(new Response("Denied", { status: 401 }));
		await expect(
			authenticatedRequest(auth, operation, () => ({
				token: "another-fixture",
				account: "different-account",
			})),
		).rejects.toThrow("account changed");
		expect(operation).toHaveBeenCalledTimes(1);
		operation
			.mockReset()
			.mockImplementation(async () => new Response("Denied", { status: 401 }));
		const denied = await authenticatedRequest(auth, operation, () => ({
			token: "rotated-but-denied-fixture",
			account: auth.account,
		}));
		expect(denied.status).toBe(401);
		expect(operation).toHaveBeenCalledTimes(2);
	});
	it("keeps page navigation separate from immutable asset transport", () => {
		for (const path of [
			"/",
			"/projects/snail",
			"/logos/snail",
			"/templates",
			"/api/live",
			"/brands/snail/v2.0.0/review",
			"/brands/snail/v2.0.0/",
			"/logos/family/frogie/batch/review",
			"/brands/snail/v2.0.0/review.html",
			"/brands/snail/v2.0.0/review.js",
			"//untrusted.test/a.png",
			"/brands/../bad.png",
			"/brands/%2e%2e/bad.png",
			"/missing.png",
		]) {
			expect(assetKeyForPath(path)).toBeNull();
			expect(assetUrl(path)).toBe(path);
		}
		const path = "/brands/snail/v2.0.0/mark-light.png";
		expect(assetUrl(`${path}?download=1#image`)).toBe(
			`https://h.no.mt${path}?download=1#image`,
		);
		expect(assetUrl(`https://hexly.ai${path}`)).toBe(`https://h.no.mt${path}`);
		expect(assetUrl(`https://other.test${path}`)).toBe(
			`https://other.test${path}`,
		);
		expect(assetUrl("data:image/svg+xml,test")).toBe("data:image/svg+xml,test");
		expect(assetUrl("/video-kit/1.0.0/hexly/journey-cjk.woff2")).toBe(
			"https://h.no.mt/video-kit/1.0.0/hexly/journey-cjk.woff2",
		);
	});
	it("inventories all projects, preserves original Logo bytes, and maps every public material", () => {
		const inventory = readInventory();
		expect(inventory.files.length).toBeGreaterThan(9000);
		for (const project of readProjects()) {
			const original = inventory.files.find(
				(f) => f.path === project.logo.original,
			);
			expect(original?.sha256, project.id).toBe(project.logo.sha256);
			expect(
				digest(readFileSync(`public${project.logo.original}`)),
				project.id,
			).toBe(project.logo.sha256);
		}
		for (const file of inventory.files.filter(
			(f) => f.path && !/\.(html|css|js)$/.test(f.path),
		)) {
			expect(assetKeyForPath(file.path ?? ""), file.source).toBe(file.key);
			for (const alias of file.aliases ?? [])
				expect(assetKeyForPath(alias)).toBe(file.key);
		}
	});
	it("rejects invalid CLI selectors before any upload or hydration", () => {
		for (const args of [
			["--scope", "everything"],
			["--project", "unknown-project"],
			["--limit", "0"],
			["--limit", "NaN"],
		]) {
			const result = spawnSync(
				"bun",
				["scripts/asset-storage.ts", "plan", ...args],
				{ encoding: "utf8" },
			);
			expect(result.status).not.toBe(0);
			expect(result.stderr).toMatch(
				/Scope must|Unknown catalogue project|Limit must/,
			);
		}
	});
	it("requires the canonical CDN bytes after a cached 404 and rejects conflicting origin bytes", async () => {
		const bytes = new TextEncoder().encode("asset fixture");
		const file = {
			...readInventory().files[0],
			source: "public/fixture.png",
			key: "fixture.png",
			bytes: bytes.length,
			sha256: digest(bytes),
			contentType: "image/png",
			project: "hexly-ai",
			role: "hexly-campaign" as const,
			version: "1.0.0",
			provenance: "test fixture",
		};
		const response = (body: Uint8Array<ArrayBuffer>) =>
			new Response(body, { headers: { "Content-Type": "image/png" } });
		const request = vi
			.fn()
			.mockResolvedValueOnce(new Response("Not found", { status: 404 }))
			.mockResolvedValueOnce(response(bytes))
			.mockResolvedValueOnce(response(bytes));
		vi.stubGlobal("fetch", request);
		try {
			expect(await verifiedPublication(file, 0)).toEqual(bytes);
			expect(
				request.mock.calls.map(([url]) => String(url).split("?")[0]),
			).toEqual(Array(3).fill("https://h.no.mt/fixture.png"));
			expect(request.mock.calls[1]?.[0]).toContain("?inspect=");
			expect(request.mock.calls[2]?.[0]).toBe("https://h.no.mt/fixture.png");
			request
				.mockReset()
				.mockResolvedValueOnce(new Response("Not found", { status: 404 }))
				.mockResolvedValueOnce(
					response(new TextEncoder().encode("wrong bytes")),
				);
			await expect(verifiedPublication(file, 0)).rejects.toThrow(
				"checksum/size mismatch",
			);
			expect(request).toHaveBeenCalledTimes(2);
		} finally {
			vi.unstubAllGlobals();
		}
	});
	it("versions loose files by bytes while preserving package-relative paths", () => {
		const sha = "a".repeat(64);
		expect(assetKey("/logos/originals/pew.png", sha, "pew")).toBe(
			"projects/pew/identity/v1.0.0/pew-aaaaaaaaaaaa.png",
		);
		expect(assetKey("/fonts/journey-cjk.woff2", sha, "hexly-ai")).toBe(
			"shared/site/v1.0.0/journey-cjk-aaaaaaaaaaaa.woff2",
		);
		expect(assetKey("/brands/snail/v2.0.0/manifest.json", sha, "snail")).toBe(
			"brands/snail/v2.0.0/manifest.json",
		);
	});
});
