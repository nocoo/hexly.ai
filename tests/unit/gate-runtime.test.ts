import { describe, expect, it } from "vitest";
import { GateFailure, runPhase } from "../../scripts/gate-runtime";

describe("gate phases", () => {
	it("passes a successful command", async () => {
		await expect(
			runPhase({
				label: "probe",
				command: ["sh", "-c", "exit 0"],
				timeout: 30,
			}),
		).resolves.toBeUndefined();
	});

	it("fails a command with a non-zero exit code", async () => {
		await expect(
			runPhase({
				label: "probe",
				command: ["sh", "-c", "exit 7"],
				timeout: 30,
			}),
		).rejects.toThrowError(/probe failed \(exit 7\)/);
	});

	it("blocks and kills the process group when a phase exceeds its timeout", async () => {
		const started = performance.now();
		const failure = await runPhase({
			label: "probe",
			command: ["sh", "-c", "sleep 30 & sleep 30"],
			timeout: 1,
		}).catch((error: unknown) => error);
		expect(failure).toBeInstanceOf(GateFailure);
		expect((failure as Error).message).toMatch(/exceeded its 1s timeout/);
		expect(performance.now() - started).toBeLessThan(10_000);
	});

	it("reports a command that cannot start", async () => {
		await expect(
			runPhase({
				label: "probe",
				command: ["definitely-not-a-real-binary"],
				timeout: 5,
			}),
		).rejects.toThrowError(/could not start/);
	});
});
