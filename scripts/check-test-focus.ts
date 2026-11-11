import { readFileSync } from "node:fs";
import process from "node:process";
import { violations } from "./test-focus";
import { collectTests } from "./test-focus-files";

const problems = collectTests().flatMap((path) =>
	violations(path, readFileSync(path, "utf8")),
);

if (problems.length) {
	for (const problem of problems) console.error(problem);
	console.error(
		`Test focus guard failed: ${problems.length} focused, pending or unconditionally skipped test(s).`,
	);
	process.exit(1);
}
console.info("Test focus guard passed: no focused, pending or skipped tests.");
