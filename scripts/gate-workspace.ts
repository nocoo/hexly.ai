import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { capture, GateFailure, runPhase } from "./gate-runtime";

const manifests = [
	"package.json",
	"bun.lock",
	"packages/video-kit/package.json",
];

const material =
	/\.(?:png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|zip|pdf|pptx|mp3|wav|mp4|webm|mov|m4v|mkv|vtt)$/;

/** Reusing installed dependencies is only sound for the declared toolchain and lockfile. */
export function assertToolchain(target: string) {
	const manifest = JSON.parse(
		readFileSync(join(target, "package.json"), "utf8"),
	) as {
		packageManager?: string;
		engines?: Record<string, string>;
	};
	const declared = /^bun@(\S+)$/.exec(manifest.packageManager ?? "")?.[1];
	if (!declared)
		throw new GateFailure(
			"package.json must declare packageManager bun@<version>.",
		);
	const installed = capture(["bun", "--version"]);
	if (installed !== declared)
		throw new GateFailure(
			`Bun ${installed} does not match the declared bun@${declared}; install the declared toolchain before running the gate.`,
		);
	const minimum = Number(
		/(\d+)/.exec(manifest.engines?.node ?? "")?.[1] ?? Number.NaN,
	);
	const current = process.versions.node;
	const major = Number(current.split(".")[0]);
	if (!Number.isFinite(minimum) || major < minimum)
		throw new GateFailure(
			`Node ${current} does not satisfy engines.node ${manifest.engines?.node ?? "(missing)"}.`,
		);
}

/**
 * Hydrated materials are immutable Git-ignored bytes; a commit cannot contain them,
 * so the pushed-tree snapshot borrows the verified worktree copies instead of fetching R2.
 */
export function linkMaterials(repo: string, snapshot: string) {
	const ignored = capture(
		[
			"git",
			"ls-files",
			"--others",
			"--ignored",
			"--exclude-standard",
			"-z",
			"--",
			"public",
			"packages/video-kit/public",
			"artwork",
			"src/fonts",
			"docs/screenshots",
		],
		repo,
	)
		.split("\0")
		.filter((path) => path && material.test(path));
	let linked = 0;
	for (const path of ignored) {
		const target = join(snapshot, path);
		if (existsSync(target)) continue;
		mkdirSync(join(target, ".."), { recursive: true });
		symlinkSync(join(repo, path), target);
		linked++;
	}
	if (linked) console.info(`Gate: linked ${linked} hydrated material file(s)`);
}

export function indexSnapshot(repo: string): string {
	const directory = mkdtempSync(join(tmpdir(), "hexly-index-"));
	capture(["git", "checkout-index", "--all", `--prefix=${directory}/`], repo);
	if (!existsSync(join(directory, "package.json")))
		throw new GateFailure("The Git index snapshot is empty.");
	return directory;
}

export function refSnapshot(repo: string, oid: string): string {
	const directory = mkdtempSync(join(tmpdir(), "hexly-push-"));
	const archive = join(directory, ".source.tar");
	capture(["git", "archive", "--format=tar", "--output", archive, oid], repo);
	capture(["tar", "-xf", archive, "-C", directory]);
	if (!existsSync(join(directory, "package.json")))
		throw new GateFailure(`Commit ${oid} has no package.json.`);
	return directory;
}

function sameManifests(repo: string, snapshot: string) {
	return manifests.every((path) => {
		const installed = join(repo, path);
		const staged = join(snapshot, path);
		if (!existsSync(staged)) return false;
		return readFileSync(installed).equals(readFileSync(staged));
	});
}

/** Workspace packages resolve to the snapshot's own sources, never to the worktree. */
export function workspacePackages(
	repo: string,
): { name: string; directory: string }[] {
	const manifest = JSON.parse(
		readFileSync(join(repo, "package.json"), "utf8"),
	) as { workspaces?: string[] | { packages?: string[] } };
	const patterns = Array.isArray(manifest.workspaces)
		? manifest.workspaces
		: (manifest.workspaces?.packages ?? []);
	const packages: { name: string; directory: string }[] = [];
	for (const pattern of patterns) {
		const root = pattern.replace(/\/\*$/, "");
		const candidates = existsSync(join(repo, root, "package.json"))
			? [root]
			: readdirSync(join(repo, root)).map((entry) => join(root, entry));
		for (const directory of candidates) {
			const path = join(repo, directory, "package.json");
			if (!existsSync(path)) continue;
			const name = (JSON.parse(readFileSync(path, "utf8")) as { name?: string })
				.name;
			if (name) packages.push({ name, directory });
		}
	}
	return packages;
}

function linkInstalledPackages(repo: string, snapshot: string) {
	const installed = join(repo, "node_modules");
	const workspaces = workspacePackages(repo);
	const local = new Set(
		workspaces.map(({ name }) => name.split("/")[0] ?? name),
	);
	mkdirSync(join(snapshot, "node_modules"), { recursive: true });
	for (const entry of readdirSync(installed)) {
		if (entry.startsWith(".") || local.has(entry)) continue;
		symlinkSync(join(installed, entry), join(snapshot, "node_modules", entry));
	}
	symlinkSync(join(installed, ".bin"), join(snapshot, "node_modules/.bin"));
	for (const { name, directory } of workspaces) {
		const target = join(snapshot, "node_modules", name);
		mkdirSync(join(target, ".."), { recursive: true });
		symlinkSync(join(snapshot, directory), target);
		const dependencies = join(repo, directory, "node_modules");
		if (existsSync(dependencies) && !existsSync(join(snapshot, directory)))
			mkdirSync(join(snapshot, directory), { recursive: true });
		if (existsSync(dependencies))
			symlinkSync(dependencies, join(snapshot, directory, "node_modules"));
	}
	mkdirSync(join(snapshot, ".cache"), { recursive: true });
	mkdirSync(join(snapshot, "node_modules/.vite"), { recursive: true });
	mkdirSync(join(snapshot, "node_modules/.vitest"), { recursive: true });
}

/** Links the verified worktree install, or installs the target lockfile in isolation. */
export async function prepareDependencies(repo: string, snapshot: string) {
	if (!existsSync(join(repo, "node_modules")))
		throw new GateFailure(
			"node_modules is required; run bun install --frozen-lockfile.",
		);
	if (sameManifests(repo, snapshot)) {
		linkInstalledPackages(repo, snapshot);
		return;
	}
	console.info(
		"Gate: target manifests differ from the worktree install; installing the target lockfile in isolation",
	);
	await runPhase({
		label: "dependency install (isolated)",
		command: ["bun", "install", "--frozen-lockfile", "--ignore-scripts"],
		cwd: snapshot,
		timeout: 300,
		env: gateEnv(snapshot),
	});
}

/** Snapshot phases must not inherit Git routing or the caller's caches. */
export function gateEnv(snapshot: string): Record<string, string> {
	const env: Record<string, string> = {};
	for (const [key, value] of Object.entries(process.env)) {
		if (value === undefined) continue;
		if (
			/^GIT_(?:DIR|WORK_TREE|INDEX_FILE|PREFIX|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES)$/.test(
				key,
			)
		)
			continue;
		env[key] = value;
	}
	env.CI = "true";
	env.PATH = `${join(snapshot, "node_modules/.bin")}:${process.env.PATH ?? ""}`;
	env.XDG_CACHE_HOME = join(snapshot, ".cache");
	env.XDG_STATE_HOME = join(snapshot, ".cache");
	return env;
}
