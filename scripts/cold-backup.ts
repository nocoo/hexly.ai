import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import coldStorage from "../src/data/cold-storage.json" with { type: "json" };

function walk(target: string): string[] {
	if (!existsSync(target)) throw new Error(`Missing backup path: ${target}`);
	const st = statSync(target);
	if (st.isFile()) return [target];
	const out: string[] = [];
	for (const entry of readdirSync(target, { withFileTypes: true })) {
		if (entry.name.startsWith(".") || entry.isSymbolicLink()) continue;
		const full = join(target, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out.sort();
}

function sha256(path: string): string {
	return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function md5(path: string): string {
	return createHash("md5").update(readFileSync(path)).digest("hex");
}

if (import.meta.main) {
	const { positionals, values } = parseArgs({
		args: process.argv.slice(2).filter((s) => s !== "--"),
		allowPositionals: true,
		options: {
			project: { type: "string" },
			folder: { type: "string", default: "futureColdBackups" },
			outDir: { type: "string", default: ".wrangler/cold-backup" },
			upload: { type: "boolean", default: false },
		},
	});

	const project = values.project;
	if (!project || !/^[a-z0-9-]+$/.test(project)) {
		throw new Error(
			"Required: --project <slug> <path1> [path2 ...] [--folder futureColdBackups] [--upload]",
		);
	}
	if (positionals.length === 0) {
		throw new Error("Provide at least one file or directory path to archive.");
	}
	const folderMap = coldStorage.folders as Record<string, string>;
	const folderId = folderMap[values.folder];
	if (!folderId) {
		throw new Error(
			`Unknown cold-storage folder key "${values.folder}". Valid keys: ${Object.keys(folderMap).join(", ")}`,
		);
	}

	const root = process.cwd();
	const files = [...new Set(positionals.flatMap((p) => walk(resolve(root, p))))]
		.map((abs) => ({
			abs,
			rel: relative(root, abs),
			bytes: statSync(abs).size,
		}))
		.sort((a, b) => a.rel.localeCompare(b.rel));

	if (files.length === 0) {
		throw new Error("No files matched the supplied paths.");
	}

	const date = new Date().toISOString().slice(0, 10);
	const outDir = resolve(root, values.outDir);
	mkdirSync(outDir, { recursive: true });
	const bundleName = `${project}-${date}.tar.zst`;
	const manifestName = `${project}-${date}.manifest.json`;
	const bundlePath = join(outDir, bundleName);
	const manifestPath = join(outDir, manifestName);

	const stageDir = join(outDir, `.stage-${project}-${Date.now()}`);
	mkdirSync(stageDir, { recursive: true });
	const entries: { path: string; bytes: number; sha256: string }[] = [];
	try {
		for (const f of files) {
			const dst = join(stageDir, f.rel);
			mkdirSync(dirname(dst), { recursive: true });
			execFileSync("ln", ["-s", f.abs, dst]);
			entries.push({ path: f.rel, bytes: f.bytes, sha256: sha256(f.abs) });
		}
		execFileSync(
			"sh",
			[
				"-c",
				`tar -chf - -C "${stageDir}" . | zstd -1 -T0 -f -o "${bundlePath}"`,
			],
			{ stdio: "inherit" },
		);
	} finally {
		rmSync(stageDir, { recursive: true, force: true });
	}

	const bundleBytes = statSync(bundlePath).size;
	const bundleSha256 = sha256(bundlePath);
	const bundleMd5 = md5(bundlePath);
	const manifest = {
		schemaVersion: 1,
		createdAt: new Date().toISOString(),
		project,
		destination: {
			provider: coldStorage.provider,
			account: coldStorage.account,
			rootFolderName: coldStorage.rootFolderName,
			rootFolderId: coldStorage.rootFolderId,
			rootFolderUrl: coldStorage.rootFolderUrl,
			folderKey: values.folder,
			folderId,
		},
		bundle: {
			filename: bundleName,
			bytes: bundleBytes,
			sha256: bundleSha256,
			md5: bundleMd5,
			fileCount: entries.length,
			rawBytes: entries.reduce((s, e) => s + e.bytes, 0),
		},
		entries,
	};
	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);

	if (!values.upload) {
		console.info(
			JSON.stringify(
				{
					mode: "dry-run",
					bundlePath,
					manifestPath,
					destination: `${coldStorage.account} -> My Drive/${coldStorage.rootFolderName}/${values.folder} (${folderId})`,
					bundle: manifest.bundle,
				},
				null,
				2,
			),
		);
		process.exit(0);
	}

	const uploadOne = (filePath: string, mimeType: string) => {
		const out = execFileSync(
			"gdrive",
			[
				"mutate",
				"upload",
				filePath,
				"--parent",
				folderId,
				"--mime-type",
				mimeType,
			],
			{ encoding: "utf8", timeout: 30 * 60_000 },
		);
		const match =
			out.match(/ID:\s*([A-Za-z0-9_-]+)/) ?? out.match(/"id"\s*:\s*"([^"]+)"/);
		const fileId = match?.[1];
		if (!fileId) {
			throw new Error(`Could not extract file ID from gdrive output: ${out}`);
		}
		const info = JSON.parse(
			execFileSync("gdrive", ["readonly", "info", fileId, "--json"], {
				encoding: "utf8",
			}),
		) as { size?: string; webViewLink?: string };
		const expectedBytes = statSync(filePath).size;
		if (Number(info.size) !== expectedBytes) {
			throw new Error(
				`Remote size mismatch for ${basename(filePath)}: expected ${expectedBytes}, got ${info.size}`,
			);
		}
		return {
			filename: basename(filePath),
			fileId,
			bytes: expectedBytes,
			url: info.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`,
		};
	};

	const uploadedBundle = uploadOne(bundlePath, "application/zstd");
	const uploadedManifest = uploadOne(manifestPath, "application/json");
	console.info(
		JSON.stringify(
			{
				mode: "uploaded-verified",
				destination: `${coldStorage.account} -> My Drive/${coldStorage.rootFolderName}/${values.folder}`,
				folderId,
				bundle: uploadedBundle,
				manifest: uploadedManifest,
			},
			null,
			2,
		),
	);
}
