import { execFile } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { expect, test } from "vitest";

const execute = promisify(execFile);
const tool = fileURLToPath(
	new URL("../../artwork/logo-family/tools/finish_study.mjs", import.meta.url),
);
const imageSha256 = "a".repeat(64);

for (const mode of ["generated", "retained", "adapted"] as const) {
	const retained = mode !== "generated";
	const adapted = mode === "adapted";
	const reviewName = retained ? "source-review.json" : "raw-review.json";
	for (const [name, review] of [
		["missing", undefined],
		["pending", { status: "pending", imageSha256 }],
		["rejected", { status: "rejected", imageSha256 }],
		[
			"approval for another image",
			{ status: "approved", imageSha256: "b".repeat(64) },
		],
	] as const) {
		test(`refuses ${mode} finishing with ${name} approval before processing artwork`, async () => {
			const study = await mkdtemp(join(tmpdir(), "hexly-logo-review-"));
			try {
				await writeFile(
					join(study, "presentation.json"),
					JSON.stringify(
						retained
							? {
									sourceMode: adapted
										? "prepared-transparent"
										: "retained-transparent",
								}
							: {},
					),
				);
				const artwork = { path: "source.png", sha256: imageSha256 };
				await writeFile(
					join(study, retained ? "source.json" : "response.json"),
					JSON.stringify(
						retained
							? {
									kind: adapted ? "reference-adaptation" : "retained-original",
									generationCalls: 0,
									artwork,
								}
							: { status: "succeeded", output: artwork },
					),
				);
				if (review)
					await writeFile(join(study, reviewName), JSON.stringify(review));
				await expect(
					execute(process.execPath, [tool, study, "01"]),
				).rejects.toThrow(
					review ? "Owner approval of this exact raw image" : reviewName,
				);
				expect(await readdir(study)).not.toContain("finishing");
			} finally {
				await rm(study, { recursive: true, force: true });
			}
		});
	}
}
