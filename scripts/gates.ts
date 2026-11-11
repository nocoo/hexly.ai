import { rmSync } from "node:fs";
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
const inside = (directory: string) => ({
	cwd: directory,
	env: gateEnv(directory),
});

const staticPhases = [
	{ label: "types", command: ["bun", "run", "typecheck"], timeout: 180 },
	{ label: "lint", command: ["bun", "run", "lint"], timeout: 120 },
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

async function commit() {
	await runPhase({
		label: "tracked materials",
		command: ["bun", "run", "assets:check-tracked"],
		timeout: 120,
	});
	await runPhase({
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
		timeout: 180,
	});

	assertToolchain(repo);
	const prepared = performance.now();
	const snapshot = indexSnapshot(repo);
	try {
		await prepareDependencies(repo, snapshot);
		console.info(
			`Gate: index snapshot prepared in ${((performance.now() - prepared) / 1000).toFixed(1)}s`,
		);
		const cwd = inside(snapshot);
		for (const phase of [
			{
				label: "test focus guard",
				command: ["bun", "run", "check:focus"],
				timeout: 120,
			},
			{
				label: "types (S1)",
				command: ["bun", "run", "typecheck"],
				timeout: 180,
			},
			{ label: "lint (S2)", command: ["bun", "run", "lint"], timeout: 120 },
			{
				label: "unit coverage (L1)",
				command: ["bun", "run", "test:coverage"],
				timeout: 300,
			},
		])
			await runPhase({ ...phase, ...cwd });
	} finally {
		rmSync(snapshot, { recursive: true, force: true });
	}
}

async function push() {
	const refs = parsePushRefs(await new Response(Bun.stdin.stream()).text());
	if (!refs.length) {
		console.info("Gate: no pushed commit to verify (deleted refs only).");
		return;
	}
	assertToolchain(repo);
	for (const ref of refs) {
		const prepared = performance.now();
		const snapshot = refSnapshot(repo, ref.localOid);
		try {
			console.info(`Gate: verifying pushed commit ${ref.localOid}`);
			await prepareDependencies(repo, snapshot);
			linkMaterials(repo, snapshot);
			console.info(
				`Gate: snapshot prepared in ${((performance.now() - prepared) / 1000).toFixed(1)}s`,
			);
			const cwd = {
				cwd: snapshot,
				env: { ...gateEnv(snapshot), RELEASE_REVISION: ref.localOid },
			};
			for (const phase of [
				{
					label: "dependencies (G2)",
					command: [
						"osv-scanner",
						"scan",
						"source",
						"--lockfile",
						`${snapshot}/bun.lock`,
					],
					timeout: 180,
				},
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
					timeout: 300,
				},
				{
					label: "new commits (G1)",
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
					timeout: 300,
				},
				{
					label: "isolation",
					command: ["bun", "run", "check:isolation"],
					timeout: 60,
				},
				{ label: "build (B1)", command: ["bun", "run", "build"], timeout: 300 },
				{
					label: "deploy dry run (B1)",
					command: ["bun", "run", "deploy:check"],
					timeout: 300,
				},
				{
					label: "integration (L3)",
					command: ["bun", "run", "test:http"],
					timeout: 300,
				},
				{
					label: "e2e (L4)",
					command: ["bun", "run", "test:browser"],
					timeout: 480,
				},
			])
				await runPhase({ ...phase, ...cwd });
		} finally {
			const cleaned = performance.now();
			rmSync(snapshot, { recursive: true, force: true });
			console.info(
				`Gate: snapshot cleaned in ${((performance.now() - cleaned) / 1000).toFixed(1)}s`,
			);
		}
	}
}

const group = process.argv[2] ?? "";
const started = performance.now();

try {
	if (group === "commit") await commit();
	else if (group === "push") await push();
	else if (group === "static" || group === "security") {
		const phases = group === "static" ? staticPhases : securityPhases;
		for (const phase of phases) await runPhase({ ...phase, ...inside(repo) });
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
