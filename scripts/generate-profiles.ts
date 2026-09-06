import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { Project } from "../src/model/project";

const projects: Project[] = JSON.parse(
	await readFile("src/data/projects.json", "utf8"),
);
await mkdir("docs/profiles", { recursive: true });
const index = [
	"# Project profiles",
	"",
	`All ${projects.length} unique entries from the GitHub profile are represented. Project metadata is maintained in \`src/data/projects.json\`; run \`bun run docs:profiles\` after editing it.`,
	"",
	"| Project | Current identity | Foreground | Background |",
	"| --- | --- | --- | --- |",
];
for (const [position, project] of projects.entries()) {
	const name = `${String(position + 1).padStart(2, "0")}-${project.id}.md`;
	index.push(
		`| [${project.emoji} ${project.title}](${name}) | ${project.family ? "Adopted family" : project.logo.kind === "original" ? "Original asset" : "Profile emoji"} | ${project.colors.primary} | ${project.colors.background} |`,
	);
	const family = project.family;
	const familySection = family
		? `## Adopted animal family

- Adopted: ${family.adopted}; study \`${family.id}\`, finishing \`${family.finishing}\`
- [Full process archive](${family.archive})
- [Square icon](../../public${family.root}/icon.png), [rounded icon](../../public${family.root}/rounded.png), [white version](../../public${family.root}/white.png)
- [Untouched generation](../../public${family.root}/raw.png), [exact prompt](../../public${family.root}/prompt.txt), [public asset checksums](../../public${family.root}/manifest.json)
- [Previous original](../../public${family.previous.original}), copied from [its immutable source](${family.previous.sourceUrl})
- Previous SHA-256: \`${family.previous.sha256}\`
- Generation: ${family.model}, native ${project.logo.width} × ${project.logo.height}; transparent extraction and presentation are separate finishing steps.
- Application previews use the approved square icon without extra padding, backgrounds, or circular masks. Artwork previews retain the transparent foreground.

${family.direction.map((item) => `### ${item.title.en}\n\n${item.description.en}\n\n${item.description.zh}`).join("\n\n")}

Small-size observation: ${family.sizeNote.en}

`
		: "";
	const palette = project.colors.palette
		.map((color) => `| ${color.role} | \`${color.color}\` | ${color.source} |`)
		.join("\n");
	const content = `# ${project.emoji} ${project.title}

## Profile

- Repository: [nocoo/${project.repo}](${project.repository})
- Website: ${project.website ? `[${project.website}](${project.website})` : "No current website verified; navigation opens the repository."}
- Website evidence: ${project.websiteSource ?? "Not applicable"}
- Category: ${project.category}
- English: ${project.description.en}
- Chinese: ${project.description.zh}
- Profile section: ${project.source.profileSection}
- Profile revision: \`${project.source.profileRevision}\`
- Repository revision inspected: \`${project.source.repositoryRevision}\`

## Current logo

![${project.title} identity](../../public${family ? `${family.root}/icon-160.webp` : project.logo.thumbnail})

- Type: ${project.logo.kind === "original" ? "Original project artwork, copied without modification" : "Existing GitHub-profile emoji rendered as a portable PNG; no independent project logo was found"}
- Subject: ${project.subject}
- [Source](${project.logo.sourceUrl}): \`${project.logo.sourcePath}\`
- [Preserved asset](../../public${project.logo.original})
- Original dimensions: ${project.logo.width} × ${project.logo.height}
- Original size: ${project.logo.bytes} bytes
- SHA-256: \`${project.logo.sha256}\`
- Locally modified source: ${project.logo.modified ? "Yes" : "No"}
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
${palette}

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

${familySection}## ${family ? "Further refinements" : "Future family notes"}

${project.reference ? "This is a preferred family reference. Preserve its recognizable subject and balance of dominant color with multicolored details." : "Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments."}

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement.${family ? " Preserve this approved composition and its archived predecessors." : " No new logo is generated in phase one."}
`;
	await writeFile(`docs/profiles/${name}`, content);
}
await writeFile("docs/profiles/README.md", `${index.join("\n")}\n`);
console.info(`Updated ${projects.length} project profiles.`);
