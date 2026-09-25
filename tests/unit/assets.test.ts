import { execFileSync, spawnSync } from "node:child_process";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
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
	it("keeps independently versioned texture packs on R2 and review documents on the Worker", () => {
		const path = "/textures/frogie/v1.0.0/texture-light-320.webp";
		const key = "projects/frogie/textures/v1.0.0/texture-light-320.webp";
		expect(assetKey(path, "a".repeat(64), "frogie")).toBe(key);
		expect(assetKeyForPath(path)).toBe(key);
		expect(assetUrl(path)).toBe(`https://h.no.mt/${key}`);
		expect(() => assetKey(path, "a".repeat(64), "pew")).toThrow(
			"Texture path and catalogue project disagree",
		);
		for (const path of [
			"/textures/frogie/v1.0.0/review.html",
			"/textures/frogie/v1.0.0/review.js",
			"/textures/frogie/v1.0.0/review.css",
			"/textures/frogie/v1.0.0/../outside.png",
		])
			expect(assetKeyForPath(path)).toBeNull();
	});
	it("keeps screenshot versions and project namespaces independent of identity assets", () => {
		const hash = "a".repeat(64);
		expect(
			assetKey(
				"/screenshots/hooky/store-01/v1.2.0/original.png",
				hash,
				"hooky",
			),
		).toBe(
			"projects/hooky/screenshots/store-01/v1.2.0/original-aaaaaaaaaaaa.png",
		);
		expect(
			assetKey(
				"/screenshots/r2shot/workspace/v2.0.0/thumbnail.webp",
				hash,
				"r2shot",
			),
		).toBe(
			"projects/r2shot/screenshots/workspace/v2.0.0/thumbnail-aaaaaaaaaaaa.webp",
		);
		expect(() =>
			assetKey(
				"/screenshots/hooky/store-01/v1.0.0/original.png",
				hash,
				"r2shot",
			),
		).toThrow("Screenshot path and catalogue project disagree");
	});
	it("keeps test-mode URLs on R2 when the local preview flag is present", () => {
		const path = "/brands/pi-agent-policy/v1.0.3/texture-light.webp";
		try {
			vi.stubEnv("VITE_LOCAL_MATERIALS", "1");
			expect(assetUrl(path)).toBe(`https://h.no.mt${path}`);
		} finally {
			vi.unstubAllEnvs();
		}
	});
	it("resolves API CDN image URLs to hydrated files only in local development", () => {
		const paths = [
			"/brands/frogie/v1.0.0/mark-64.png",
			"/logos/display/frogie-64.webp",
			"/textures/frogie/v1.0.0/texture-light.webp",
		];
		const urls = paths.map((path) => assetUrl(path));
		try {
			vi.stubEnv("DEV", true);
			vi.stubEnv("MODE", "development");
			vi.stubEnv("VITE_LOCAL_MATERIALS", "1");
			for (const [i, url] of urls.entries())
				expect(assetUrl(`${url}?v=1#sample`)).toBe(`${paths[i]}?v=1#sample`);
			expect(assetUrl("https://example.test/logo.png")).toBe(
				"https://example.test/logo.png",
			);
			expect(assetUrl("https://h.no.mt/unknown.png")).toBe(
				"https://h.no.mt/unknown.png",
			);
			vi.stubEnv("MODE", "production");
			for (const url of urls) expect(assetUrl(url)).toBe(url);
		} finally {
			vi.unstubAllEnvs();
		}
	});
	it("keeps existing source recovery URLs when a new kit duplicates the same bytes", () => {
		const directory = mkdtempSync(
			join(tmpdir(), "hexly-inventory-version-test-"),
		);
		const script = resolve("scripts/asset-storage.ts");
		const localVars = execFileSync("git", ["rev-parse", "--local-env-vars"], {
			encoding: "utf8",
		})
			.trim()
			.split("\n");
		const env = Object.fromEntries(
			Object.entries(process.env).filter(([name]) => !localVars.includes(name)),
		);
		const git = (...args: string[]) =>
			execFileSync("git", args, { cwd: directory, env, stdio: "ignore" });
		const write = (path: string, body: string) => {
			mkdirSync(dirname(join(directory, path)), { recursive: true });
			writeFileSync(join(directory, path), body);
		};
		const inventory = () => {
			const result = spawnSync("bun", [script, "inventory"], {
				cwd: directory,
				env,
				encoding: "utf8",
			});
			expect(result.status, result.stderr).toBe(0);
			return JSON.parse(
				readFileSync(join(directory, "docs/assets/inventory.json"), "utf8"),
			);
		};
		try {
			git("init", "-b", "main");
			git(
				"-c",
				"user.name=Fixture",
				"-c",
				"user.email=fixture@example.test",
				"commit",
				"--allow-empty",
				"-m",
				"fixture",
			);
			write("src/data/projects/index.json", "[]");
			for (const path of [
				"src/fonts/journey-cjk.woff2",
				"node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
				"node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
			])
				write(path, `font fixture ${path}`);
			write(
				"public/brands/pi-agent-policy/v1.0.0/logo.png",
				"same image fixture",
			);
			write("artwork/old/logo.png", "same image fixture");
			const previous = inventory().files.find(
				(f: { source: string }) => f.source === "artwork/old/logo.png",
			);
			expect(previous.key).toBe("brands/pi-agent-policy/v1.0.0/logo.png");
			write(
				"public/brands/pi-agent-policy/v1.0.1/logo.png",
				"same image fixture",
			);
			write("artwork/new/logo.png", "same image fixture");
			const next = inventory();
			expect(
				next.files.find(
					(f: { source: string }) => f.source === previous.source,
				),
			).toEqual(previous);
			expect(
				next.files.find(
					(f: { source: string }) => f.source === "artwork/new/logo.png",
				).key,
			).toBe("brands/pi-agent-policy/v1.0.1/logo.png");
		} finally {
			rmSync(directory, { recursive: true, force: true });
		}
	});
	it("keeps retired materials discoverable without reopening project publication", () => {
		expect(readProjects().some((project) => project.id === "snail")).toBe(
			false,
		);
		const run = (...args: string[]) =>
			spawnSync("bun", ["scripts/asset-storage.ts", ...args], {
				encoding: "utf8",
			});
		const plan = run("plan", "--project", "snail");
		expect(plan.status).toBe(0);
		expect(JSON.parse(plan.stdout).objects).toBeGreaterThan(0);
		const url = run(
			"url",
			"/brands/snail/v2.0.0/favicon.ico",
			"--project",
			"snail",
		);
		expect(url.status).toBe(0);
		expect(url.stdout).toContain(
			"https://h.no.mt/brands/snail/v2.0.0/favicon.ico",
		);
		for (const [command, project] of [
			["publish", "snail"],
			["plan", "unregistered-project"],
		] as const) {
			const rejected = run(command, "--project", project);
			expect(rejected.status).not.toBe(0);
			expect(rejected.stderr).toContain(
				`Unknown catalogue project: ${project}`,
			);
		}
	});
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
	it("keeps the official Chrome store badge bytes and third-party rights distinct", () => {
		const badge = readInventory().files.find(
			(file) =>
				file.path === "/badges/chrome-web-store/v1.0.0/chrome-web-store.png",
		);
		expect(badge?.role).toBe("third-party-badge");
		expect(badge?.sha256).toBe(
			"fbf289fca885e58a1507cc8c69a9df68f35e83e683825b3ad6cd617b0a17d79c",
		);
		expect(digest(readFileSync(badge?.source ?? ""))).toBe(badge?.sha256);
		const receipt = JSON.parse(readFileSync(badge?.provenance ?? "", "utf8"));
		expect(receipt.source.rightsHolder).toBe("Google LLC");
		expect(receipt.source.guidance).toBe(
			"https://developer.chrome.com/docs/webstore/branding",
		);
		expect(receipt.files[0]).toMatchObject({
			width: 340,
			height: 96,
			sha256: badge?.sha256,
		});
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
