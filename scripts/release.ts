import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	chooseVersion,
	releaseNotes,
	releaseOptions,
	updateChangelog,
} from "./release-model";

const repository = "nocoo/hexly.ai";
const options = releaseOptions(process.argv.slice(2));

async function output(...command: string[]) {
	const process = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });
	const [stdout, stderr, code] = await Promise.all([
		new Response(process.stdout).text(),
		new Response(process.stderr).text(),
		process.exited,
	]);
	if (code !== 0) throw new Error(`${command[0]} failed: ${stderr.trim()}`);
	return stdout.trim();
}

async function run(...command: string[]) {
	const code = await Bun.spawn(command, {
		stdout: "inherit",
		stderr: "inherit",
	}).exited;
	if (code !== 0) throw new Error(`${command.join(" ")} failed (${code}).`);
}

if ((await output("git", "branch", "--show-current")) !== "main") {
	throw new Error("Release from main.");
}
if (await output("git", "status", "--porcelain")) {
	throw new Error(
		"Commit the working tree before releasing or previewing a release.",
	);
}
if (!options.dryRun) {
	const origin = await output("git", "remote", "get-url", "origin");
	if (
		!/^((https:\/\/github\.com\/)|(git@github\.com:))nocoo\/hexly\.ai(?:\.git)?$/.test(
			origin,
		)
	) {
		throw new Error("The origin must be nocoo/hexly.ai.");
	}
	await run("gh", "auth", "status");
	await run("git", "fetch", "origin", "main", "--tags");
	await run("git", "merge-base", "--is-ancestor", "origin/main", "HEAD");
}

const manifest = JSON.parse(await readFile("package.json", "utf8"));
const tags = (
	await output("git", "tag", "--merged", "HEAD", "--sort=-version:refname")
)
	.split("\n")
	.filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag));
const previousTag = tags[0];
const previous = previousTag
	? {
			version: previousTag.slice(1),
			releasedAt: Date.parse(
				(await output(
					"git",
					"for-each-ref",
					"--format=%(taggerdate:iso8601-strict)",
					`refs/tags/${previousTag}`,
				)) || (await output("git", "log", "-1", "--format=%cI", previousTag)),
			),
		}
	: null;
const changedLines = previousTag
	? (await output("git", "diff", "--numstat", `${previousTag}..HEAD`))
			.split("\n")
			.reduce((total, line) => {
				const [added, removed] = line.split("\t");
				return total + (Number(added) || 0) + (Number(removed) || 0);
			}, 0)
	: 0;
const version = chooseVersion({
	current: manifest.version,
	requested: options.requested,
	previous,
	changedLines,
	now: Date.now(),
});
const tag = `v${version}`;
if (await output("git", "tag", "--list", tag)) {
	throw new Error(
		`${tag} already exists; published tags are never overwritten.`,
	);
}
const commits = (
	await output(
		"git",
		"log",
		"--reverse",
		"--format=%H%x09%s",
		previousTag ? `${previousTag}..HEAD` : "HEAD",
	)
)
	.split("\n")
	.filter(Boolean)
	.map((line) => {
		const [hash = "", ...subject] = line.split("\t");
		return { hash, subject: subject.join("\t") };
	});
const notes = releaseNotes(commits);
console.info(
	`Release ${manifest.version} → ${version}; ${commits.length} commits since ${previousTag ?? "repository creation"}.`,
);
if (options.dryRun) {
	console.info(
		`${notes}\n\nDry run: no files, refs, or remote resources changed.`,
	);
	process.exit(0);
}

manifest.version = version;
await writeFile("package.json", `${JSON.stringify(manifest, null, "\t")}\n`);
const changelogFile = Bun.file("CHANGELOG.md");
await writeFile(
	"CHANGELOG.md",
	updateChangelog(
		(await changelogFile.exists()) ? await changelogFile.text() : "",
		version,
		new Date().toISOString().slice(0, 10),
		notes,
	),
);
await run("bun", "install", "--lockfile-only", "--frozen-lockfile");
await run("git", "add", "--", "package.json", "bun.lock", "CHANGELOG.md");
if (await output("git", "diff", "--cached", "--name-only")) {
	await run("git", "commit", "-m", `chore: release ${tag}`);
}
const revision = await output("git", "rev-parse", "HEAD");
await run("git", "push", "origin", "main");

let runId: number | undefined;
for (let attempt = 0; attempt < 18; attempt++) {
	const runs: { databaseId: number }[] = JSON.parse(
		await output(
			"gh",
			"run",
			"list",
			"--repo",
			repository,
			"--workflow",
			"ci.yml",
			"--commit",
			revision,
			"--event",
			"push",
			"--json",
			"databaseId",
			"--limit",
			"1",
		),
	);
	runId = runs[0]?.databaseId;
	if (runId) break;
	await Bun.sleep(10_000);
}
if (!runId)
	throw new Error(`No CI run found for ${revision}. No tag was created.`);
await run(
	"gh",
	"run",
	"watch",
	String(runId),
	"--repo",
	repository,
	"--exit-status",
	"--interval",
	"10",
);
const workflow: { jobs: { name: string; conclusion: string }[]; url: string } =
	JSON.parse(
		await output(
			"gh",
			"run",
			"view",
			String(runId),
			"--repo",
			repository,
			"--json",
			"jobs,url",
		),
	);
if (
	!workflow.jobs.some(
		(job) => job.name === "Deploy" && job.conclusion === "success",
	)
) {
	throw new Error("Production deployment did not succeed. No tag was created.");
}
await run("bun", "scripts/verify-deployment.ts", revision);
await run("git", "tag", "-a", tag, revision, "-m", `hexly.ai ${tag}`);
await run("git", "push", "origin", `refs/tags/${tag}`);
const temporary = await mkdtemp(join(tmpdir(), "hexly-release-"));
try {
	const notesFile = join(temporary, "notes.md");
	await writeFile(
		notesFile,
		`${notes}\n\n[Verified CI and deployment](${workflow.url})\n`,
	);
	await run(
		"gh",
		"release",
		"create",
		tag,
		"--repo",
		repository,
		"--verify-tag",
		"--title",
		tag,
		"--notes-file",
		notesFile,
		"--latest",
	);
} finally {
	await rm(temporary, { recursive: true, force: true });
}
console.info(`Published https://github.com/${repository}/releases/tag/${tag}`);
