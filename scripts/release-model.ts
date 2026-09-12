export type Bump = "patch" | "minor" | "major";

export interface DeploymentRun {
	databaseId: number;
	headSha: string;
	displayTitle: string;
	event: string;
}

export function deploymentRunFor(
	runs: DeploymentRun[],
	sourceRunId: number,
	revision: string,
) {
	return runs.find(
		(run) =>
			run.headSha === revision &&
			run.event === "workflow_run" &&
			run.displayTitle === `Deploy CI ${sourceRunId}`,
	)?.databaseId;
}

export function parseVersion(value: string): [number, number, number] {
	if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) {
		throw new Error(`Expected an X.Y.Z version, received: ${value}`);
	}
	const parts = value.split(".").map(Number);
	if (!parts.every(Number.isSafeInteger)) {
		throw new Error("Version components must be safe integers.");
	}
	return parts as [number, number, number];
}

export function releaseOptions(args: string[]) {
	const positional = args.filter(
		(argument) => argument !== "--" && argument !== "--dry-run",
	);
	if (positional.length > 1) {
		throw new Error("Pass only one bump type or explicit version.");
	}
	const requested = positional[0];
	if (requested && !["patch", "minor", "major"].includes(requested)) {
		parseVersion(requested);
	}
	return { requested, dryRun: args.includes("--dry-run") };
}

export function chooseVersion({
	current,
	requested,
	previous,
	changedLines,
	now,
}: {
	current: string;
	requested?: string;
	previous: { version: string; releasedAt: number } | null;
	changedLines: number;
	now: number;
}): string {
	const parts = parseVersion(current);
	if (requested && !["patch", "minor", "major"].includes(requested)) {
		const next = parseVersion(requested);
		for (const index of [0, 1, 2] as const) {
			if (next[index] > parts[index]) break;
			if (next[index] < parts[index]) {
				throw new Error("A release cannot lower the package version.");
			}
		}
		return requested;
	}
	if (!requested && (!previous || previous.version !== current)) return current;
	const bump =
		requested ??
		(previous &&
		(now - previous.releasedAt > 3 * 24 * 60 * 60 * 1000 || changedLines > 500)
			? "minor"
			: "patch");
	if (bump === "major") return `${parts[0] + 1}.0.0`;
	if (bump === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
	return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function releaseNotes(commits: { hash: string; subject: string }[]) {
	const groups = new Map<string, string[]>();
	const headings: Record<string, string> = {
		feat: "Features",
		fix: "Fixes",
		docs: "Documentation",
		test: "Tests",
	};
	for (const commit of commits) {
		if (/^chore: release v?\d+\.\d+\.\d+$/.test(commit.subject)) continue;
		const match = commit.subject.match(/^(\w+)(?:\([^)]*\))?!?: (.+)$/);
		const heading = headings[match?.[1] ?? ""] ?? "Maintenance";
		const entries = groups.get(heading) ?? [];
		entries.push(
			`- ${match?.[2] ?? commit.subject} ([${commit.hash.slice(0, 7)}](https://github.com/nocoo/hexly.ai/commit/${commit.hash}))`,
		);
		groups.set(heading, entries);
	}
	return (
		[...groups]
			.map(([heading, entries]) => `### ${heading}\n\n${entries.join("\n")}`)
			.join("\n\n") || "- Initial release."
	);
}

export function updateChangelog(
	existing: string,
	version: string,
	date: string,
	notes: string,
) {
	const sections = existing.trim().split(/(?=^## )/m);
	const preamble = sections[0]?.startsWith("# ")
		? sections.shift()?.trim()
		: "# Changelog";
	return `${[
		preamble,
		`## [${version}] - ${date}\n\n${notes}`,
		...sections
			.filter((section) => !section.startsWith(`## [${version}]`))
			.map((section) => section.trim())
			.filter(Boolean),
	].join("\n\n")}\n`;
}
