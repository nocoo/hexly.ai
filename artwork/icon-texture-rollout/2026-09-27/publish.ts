import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import retirement from "../../../docs/brand-textures/2026-09-27-material-rollout/retirement-plan.json" with {
	type: "json",
};
import {
	publish,
	readInventory,
	verifiedBytes,
} from "../../../scripts/asset-storage";

const phase = process.argv[2];
if (!["textures", "icons"].includes(phase ?? ""))
	throw new Error("Choose textures or icons");
const receiptKeys = new Set(
	(await readFile("docs/assets/publication.jsonl", "utf8"))
		.trim()
		.split("\n")
		.map((line) => JSON.parse(line).key),
);
const retiredSources = new Set(
	retirement.localCandidates.map((file) => file.source),
);
const selected = readInventory().files.filter(
	(file) =>
		!receiptKeys.has(file.key) &&
		!retiredSources.has(file.source) &&
		(phase === "icons"
			? file.path?.startsWith("/icons/")
			: !file.path?.startsWith("/icons/")),
);
const output = `docs/icon-texture-rollout/2026-09-27/publication-${phase}.json`;
const files: typeof selected = existsSync(output)
	? JSON.parse(await readFile(output, "utf8")).files
	: [...new Map(selected.map((file) => [file.key, file])).values()];
const current = new Map(
	readInventory().files.map((file) => [file.key, file.sha256]),
);
for (const file of files)
	if (current.get(file.key) !== file.sha256)
		throw new Error(`Publication plan changed: ${file.key}`);
await writeFile(
	output,
	`${JSON.stringify({ phase, plannedAt: new Date().toISOString(), files }, null, "\t")}\n`,
);
console.info(
	`${phase}: ${files.length} objects, ${files.reduce((total, file) => total + file.bytes, 0)} bytes`,
);
await publish(files, 8);
for (let at = 0; at < files.length; at += 8)
	await Promise.all(files.slice(at, at + 8).map((file) => verifiedBytes(file)));

await writeFile(
	output,
	`${JSON.stringify({ phase, verifiedAt: new Date().toISOString(), files }, null, "\t")}\n`,
);
