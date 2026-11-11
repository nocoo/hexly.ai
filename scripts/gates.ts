import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { historyRange, parsePushRefs } from "./gate-refs";
import { capture, GateFailure, runPhase } from "./gate-runtime";
import {
	assertToolchain,
	gateEnv,
	indexSnapshot,
	linkMaterials,
	prepareDependencies,
	refSnapshot,
} from "./gate-workspace";

const repo = capture(["git", "rev-parse", "--show-toplevel"]);

/** Stage budgets from the System0 standard: 30s/60s commit, 150s/300s push. */
const budget = { commit: 60, push: 300 };

const staticPhases = [
	{ label: "types (S1)", command: ["bun", "run", "typecheck"], timeout: 180 },
	{ label: "lint (S2)", command: ["bun", "run", "lint"], timeout: 120 },
	{
		label: "isolation",
		command: ["bun", "run", "check:isolation"],
		timeout: 60,
	},
];

const securityPhases = [
	{
		label: "dependencies (G2)",
		command: ["osv-scanner", "scan", "source", "--lockfile", "bun.lock"],
		timeout: 180,
	},
	{
		label: "secrets (G1)",
		command: [
			"gitleaks",
			"git",
			".",
			"--no-banner",
			"--redact",
			"--config",
			".gitleaks.toml",
		],
		timeout: 300,
	},
];

const started = performance.now();
/** Budgets apply per verified object: one index, or one pushed commit. */
let stageStarted = started;
const remaining = (stage: number) =>
	Math.floor(stage - (performance.now() - stageStarted) / 1000);

/** Every phase is capped by the stage budget, so a hung phase cannot outlive it. */
async function stagePhase(
	stage: keyof typeof budget,
	phase: { label: string; command: string[]; timeout: number },
	cwd?: { cwd: string; env: Record<string, string> },
) {
	const left = remaining(budget[stage]);
	if (left < 5)
		throw new GateFailure(
			`${phase.label} was not run: the ${budget[stage]}s stage budget is spent`,
		);
	await runPhase({
		...phase,
		timeout: Math.min(phase.timeout, left),
		label:
			phase.timeout > left
				? `${phase.label} (capped to the ${left}s left in the ${budget[stage]}s stage budget)`
				: phase.label,
		...(cwd ?? {}),
	});
}

/** A failing gate keeps what the failing run produced instead of deleting it. */
function retainEvidence(snapshot: string, revision: string) {
	const directory = join(
		repo,
		".wrangler/gate-evidence",
		`${new Date().toISOString().replace(/[:.]/g, "-")}-${revision.slice(0, 7)}`,
	);
	const kept: string[] = [];
	for (const name of [".test-results", "coverage"]) {
		const source = join(snapshot, name);
		if (!existsSync(source)) continue;
		cpSync(source, join(directory, name), { recursive: true });
		kept.push(name);
	}
	if (kept.length)
		console.error(
			`Gate: kept ${kept.join(", ")} at ${directory} — clean it up when the fix is verified`,
		);
}

async function withSnapshot<T>(
	stage: keyof typeof budget,
	revision: string,
	create: () => string,
	run: (snapshot: string) => Promise<T>,
) {
	const snapshot = create();
	let failure: unknown;
	try {
		assertToolchain(snapshot);
		await prepareDependencies(repo, snapshot);
		return await run(snapshot);
	} catch (error) {
		failure = error;
		throw error;
	} finally {
		if (failure) retainEvidence(snapshot, revision);
		const cleaned = performance.now();
		rmSync(snapshot, { recursive: true, force: true });
		if (stage === "push")
			console.info(
				`Gate: snapshot cleaned in ${((performance.now() - cleaned) / 1000).toFixed(1)}s`,
			);
	}
}

async function commit() {
	await stagePhase("commit", {
		label: "tracked materials",
		command: ["bun", "run", "assets:check-tracked"],
		timeout: 60,
	});
	await stagePhase("commit", {
		label: "staged secrets (G1)",
		command: [
			"gitleaks",
			"protect",
			"--staged",
			"--no-banner",
			"--redact",
			"--config",
			".gitleaks.toml",
		],
		timeout: 60,
	});

	const prepared = performance.now();
	await withSnapshot(
		"commit",
		"index",
		() => indexSnapshot(repo),
		async (snapshot) => {
			console.info(
				`Gate: index snapshot prepared in ${((performance.now() - prepared) / 1000).toFixed(1)}s`,
			);
			const cwd = { cwd: snapshot, env: gateEnv(snapshot) };
			for (const phase of [
				{
					label: "test focus guard",
					command: ["bun", "run", "check:focus"],
					timeout: 30,
				},
				{
					label: "types (S1)",
					command: ["bun", "run", "typecheck"],
					timeout: 120,
				},
				{ label: "lint (S2)", command: ["bun", "run", "lint"], timeout: 60 },
				{
					label: "unit coverage (L1)",
					command: ["bun", "run", "test:coverage"],
					timeout: 120,
				},
			])
				await stagePhase("commit", phase, cwd);
		},
	);
}

/** Fails closed when the pushed range cannot be resolved or scanned. */
function pushedCommits(ref: { localOid: string; remoteOid: string | null }) {
	if (ref.remoteOid) {
		try {
			capture(
				["git", "rev-parse", "--verify", `${ref.remoteOid}^{commit}`],
				repo,
			);
		} catch {
			throw new GateFailure(
				`Cannot verify ${ref.localOid}: the remote commit ${ref.remoteOid} is not available locally`,
			);
		}
	}
	const count = Number(
		capture(
			["git", "rev-list", "--count", ...historyRange(ref).split(" ")],
			repo,
		),
	);
	if (!Number.isInteger(count))
		throw new GateFailure(`Cannot count the commits pushed by ${ref.localOid}`);
	return count;
}

async function push() {
	const refs = parsePushRefs(await new Response(Bun.stdin.stream()).text());
	if (!refs.length) {
		console.info("Gate: no pushed commit to verify (deleted refs only).");
		return;
	}
	for (const ref of refs) {
		stageStarted = performance.now();
		const commits = pushedCommits(ref);
		const prepared = performance.now();
		await withSnapshot(
			"push",
			ref.localOid,
			() => refSnapshot(repo, ref.localOid),
			async (snapshot) => {
				console.info(`Gate: verifying pushed commit ${ref.localOid}`);
				linkMaterials(repo, snapshot);
				console.info(
					`Gate: snapshot prepared in ${((performance.now() - prepared) / 1000).toFixed(1)}s`,
				);
				const cwd = {
					cwd: snapshot,
					env: { ...gateEnv(snapshot), RELEASE_REVISION: ref.localOid },
				};
				await stagePhase(
					"push",
					{
						label: "dependencies (G2)",
						command: [
							"osv-scanner",
							"scan",
							"source",
							"--lockfile",
							`${snapshot}/bun.lock`,
						],
						timeout: 120,
					},
					cwd,
				);
				await stagePhase(
					"push",
					{
						label: "secrets in pushed tree (G1)",
						command: [
							"gitleaks",
							"dir",
							".",
							"--no-banner",
							"--redact",
							"--config",
							`${repo}/.gitleaks.toml`,
						],
						timeout: 120,
					},
					cwd,
				);
				if (commits > 0)
					await stagePhase(
						"push",
						{
							label: `secrets in ${commits} new commit(s) (G1)`,
							command: [
								"gitleaks",
								"git",
								repo,
								"--log-opts",
								historyRange(ref),
								"--no-banner",
								"--redact",
								"--config",
								".gitleaks.toml",
							],
							timeout: 120,
						},
						{ cwd: repo, env: gateEnv(snapshot) },
					);
				await stagePhase(
					"push",
					{
						label: "fixture bytes",
						command: ["bun", "run", "assets:prepare-test"],
						timeout: 120,
					},
					cwd,
				);
				await stagePhase(
					"push",
					{
						label: "isolation",
						command: ["bun", "run", "check:isolation"],
						timeout: 30,
					},
					cwd,
				);
				await stagePhase(
					"push",
					{
						label: "build (B1)",
						command: ["bun", "run", "build"],
						timeout: 120,
					},
					cwd,
				);
				await stagePhase(
					"push",
					{
						label: "deploy dry run (B1)",
						command: ["bun", "run", "deploy:check"],
						timeout: 120,
					},
					cwd,
				);
				await stagePhase(
					"push",
					{
						label: "integration (L3)",
						command: ["bun", "run", "test:http"],
						timeout: 180,
					},
					cwd,
				);
				await stagePhase(
					"push",
					{
						label: "e2e (L4)",
						command: ["bun", "run", "test:browser"],
						timeout: 240,
					},
					cwd,
				);
			},
		);
	}
}

const group = process.argv[2] ?? "";

try {
	if (group === "commit") await commit();
	else if (group === "push") await push();
	else if (group === "static" || group === "security") {
		const phases = group === "static" ? staticPhases : securityPhases;
		for (const phase of phases)
			await runPhase({ ...phase, cwd: repo, env: gateEnv(repo) });
	} else
		throw new GateFailure("Expected gate: commit, push, static, or security.");
	console.info(
		`Gate: ${group} passed in ${((performance.now() - started) / 1000).toFixed(1)}s`,
	);
} catch (error) {
	if (error instanceof GateFailure) {
		console.error(`Gate failed: ${error.message}`);
		process.exit(1);
	}
	throw error;
}
