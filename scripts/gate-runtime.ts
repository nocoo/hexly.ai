import { spawn } from "node:child_process";
import process from "node:process";

export interface Phase {
	label: string;
	command: string[];
	cwd?: string;
	timeout: number;
	env?: Record<string, string>;
}

export class GateFailure extends Error {}

const seconds = (started: number) =>
	`${((performance.now() - started) / 1000).toFixed(1)}s`;

const groupAlive = (pid: number) => {
	try {
		process.kill(-pid, 0);
		return true;
	} catch {
		return false;
	}
};

/** Terminates the whole process group; a leaked VS Code-style child must not outlive the phase. */
async function stopGroup(pid: number) {
	for (const signal of ["SIGTERM", "SIGKILL"] as const) {
		try {
			process.kill(-pid, signal);
		} catch {
			return;
		}
		const deadline = Date.now() + 2000;
		while (groupAlive(pid) && Date.now() < deadline)
			await new Promise((accept) => setTimeout(accept, 25));
		if (!groupAlive(pid)) return;
	}
}

/** Runs one phase in its own process group; a timeout kills the group and fails the gate. */
export async function runPhase(phase: Phase): Promise<void> {
	const started = performance.now();
	console.info(`Gate: ${phase.label} (timeout ${phase.timeout}s)`);
	await new Promise<void>((accept, reject) => {
		const child = spawn(phase.command[0] ?? "", phase.command.slice(1), {
			cwd: phase.cwd ?? process.cwd(),
			env: phase.env ?? process.env,
			stdio: ["ignore", "inherit", "inherit"],
			detached: true,
		});
		let timedOut = false;
		const timer = setTimeout(() => {
			timedOut = true;
			if (child.pid) void stopGroup(child.pid);
		}, phase.timeout * 1000);
		child.once("error", (error) => {
			clearTimeout(timer);
			reject(
				new GateFailure(`${phase.label} could not start: ${error.message}`),
			);
		});
		child.once("exit", (code, signal) => {
			clearTimeout(timer);
			if (timedOut)
				return reject(
					new GateFailure(
						`${phase.label} exceeded its ${phase.timeout}s timeout`,
					),
				);
			if (code !== 0)
				return reject(
					new GateFailure(
						`${phase.label} failed (exit ${code ?? signal ?? "unknown"})`,
					),
				);
			accept();
		});
	});
	console.info(`Gate: ${phase.label} passed in ${seconds(started)}`);
}

export function capture(command: string[], cwd = process.cwd()): string {
	const decoder = new TextDecoder();
	const result = Bun.spawnSync(command, {
		cwd,
		stdout: "pipe",
		stderr: "pipe",
	});
	if (result.exitCode !== 0)
		throw new GateFailure(
			`${command.join(" ")} failed: ${decoder.decode(result.stderr).trim()}`,
		);
	return decoder.decode(result.stdout).trim();
}
