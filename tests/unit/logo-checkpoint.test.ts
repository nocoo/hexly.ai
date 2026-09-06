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

for (const [name, review] of [
	["missing", undefined],
	["pending", { status: "pending", imageSha256 }],
	["rejected", { status: "rejected", imageSha256 }],
	[
		"approval for another image",
		{ status: "approved", imageSha256: "b".repeat(64) },
	],
] as const) {
	test(`refuses finishing with ${name} raw approval before processing artwork`, async () => {
		const study = await mkdtemp(join(tmpdir(), "hexly-raw-review-"));
		try {
			await writeFile(
				join(study, "response.json"),
				JSON.stringify({
					status: "succeeded",
					output: { path: "raw/generated-white.png", sha256: imageSha256 },
				}),
			);
			if (review)
				await writeFile(join(study, "raw-review.json"), JSON.stringify(review));
			await expect(
				execute(process.execPath, [tool, study, "01"]),
			).rejects.toThrow(
				review ? "Owner approval of this exact raw image" : "raw-review.json",
			);
			expect(await readdir(study)).not.toContain("finishing");
		} finally {
			await rm(study, { recursive: true, force: true });
		}
	});
}
