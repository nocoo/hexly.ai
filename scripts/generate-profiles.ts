import { mkdir, readdir, writeFile } from "node:fs/promises";
import { readProjects } from "../src/data/read-projects";

const projects = readProjects();
await mkdir("docs/profiles", { recursive: true });
const existingProfiles = await readdir("docs/profiles");
let nextProfileNumber = Math.max(
	0,
	...existingProfiles.map((name) => Number(name.match(/^(\d+)-/)?.[1] ?? 0)),
);
const index = [
	"# Project profiles",
	"",
	`${projects.length} projects are listed in the catalogue. The directory omits hexly.ai itself; its historical profile and brand assets remain preserved. Project metadata is maintained in \`src/data/projects/\`; run \`bun run docs:profiles\` after editing it. Existing profile filenames stay stable when entries are added, removed, or reordered.`,
	"",
	"| Project | Catalogue artwork | Source primary | Source background |",
	"| --- | --- | --- | --- |",
];
for (const project of projects) {
	const name =
		existingProfiles.find((name) => name.endsWith(`-${project.id}.md`)) ??
		`${String(++nextProfileNumber).padStart(2, "0")}-${project.id}.md`;
	index.push(
		`| [${project.emoji} ${project.title}](${name}) | ${project.family ? (project.family.status === "adopted" ? "Adopted family" : "Refined preview") : project.logo.kind === "original" ? "Original asset" : "Profile emoji"} | ${project.colors.primary} | ${project.colors.background} |`,
	);
	const family = project.family;
	const retained = family?.method === "retained-original";
	const material = family?.series === "material";
	const toolWithoutStudy =
		!family && !project.archived && project.category === "tools";
	const adapted = family?.method === "reference-adaptation";
	const supplied = retained || adapted;
	const sourceFile = adapted
		? "source.jpg"
		: retained
			? "source.png"
			: "raw.png";
	const familySection = family
		? `## Refined identity

![${project.title} refined preview](../../public${family.root}/icon-160.webp)

- Status: ${family.status === "adopted" ? "Adopted in the source project" : "Local review; this finishing pass has not been adopted in the source project"}; updated ${family.updated}.
- Study \`${family.id}\`, finishing \`${family.finishing}\`
${family.foreground.subject ? `- Refined subject: ${family.foreground.subject.en}\n` : ""}- Site path: \`/logos/${project.id}\`; [local gallery](https://index.dev.hexly.ai/logos/${project.id})
- [Static review HTML](../../artwork/logo-family/${project.id}/${family.id}/review.html)
- [Full process archive](${family.archive})
- [Transparent foreground](../../public${family.foreground.original}); SHA-256: \`${family.foreground.sha256}\`
- [Square icon](../../public${family.root}/icon.png), [rounded icon](../../public${family.root}/rounded.png), [white version](../../public${family.root}/white.png)
- [${adapted ? "Original illustration" : retained ? "Untouched original" : "Untouched generation"}](../../public${family.root}/${sourceFile}), [${supplied ? "presentation brief" : "exact prompt"}](../../public${family.root}/${supplied ? "brief" : "prompt"}.txt), [public asset checksums](../../public${family.root}/manifest.json)
- [Previous original](../../public${family.previous.original}), copied from [its immutable source](${family.previous.sourceUrl})
- Previous SHA-256: \`${family.previous.sha256}\`
- ${adapted ? `The owner-supplied illustration is extracted and uniformly reframed at native ${family.foreground.width} × ${family.foreground.height}. This is a documented reference adaptation, not a generated portrait. The untouched JPEG and complete extraction history remain archived.` : retained ? `Original artwork retained byte-for-byte at native ${family.foreground.width} × ${family.foreground.height}. Zero image-generation calls; only background, grain, and shadow layers were composed.` : `Generation: ${family.model}, native ${family.foreground.width} × ${family.foreground.height}; transparent extraction and presentation are separate finishing steps.`}
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.${supplied && family.foreground.width < 2048 ? ` Sizes above ${family.foreground.width} px are explicitly recorded upscales; the native master retains its recorded resolution.` : ""}
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
${family.palette.map((color) => `| ${color.role} | \`${color.color}\` | ${color.source} |`).join("\n")}

${family.direction.map((item) => `### ${item.title.en}\n\n${item.description.en}\n\n${item.description.zh}`).join("\n\n")}

Small-size observation: ${family.sizeNote.en}

`
		: "";
	const palette = project.colors.palette
		.map((color) => `| ${color.role} | \`${color.color}\` | ${color.source} |`)
		.join("\n");
	const overview = project.overview;
	const overviewSection = overview
		? `## Project goal

${overview.goal.en}

${overview.goal.zh}

- [中文 README](${project.repository}/blob/main/README.md) · [English README](${project.repository}/blob/main/docs/README.en.md)
- Verified: ${overview.verified.date}; [source revision](${project.repository}/tree/${overview.verified.revision})
- Source files: ${overview.verified.sources.map((path) => `[\`${path}\`](${project.repository}/blob/${overview.verified.revision}/${path})`).join(", ")}

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
${overview.techStack.map((technology) => `| ${technology.name} | ${technology.role.en} | ${technology.role.zh} |`).join("\n")}

`
		: "";
	const content = `# ${project.emoji} ${project.title}

## Profile

- Repository: [nocoo/${project.repo}](${project.repository})
- Website: ${project.website ? `[${project.website}](${project.website})` : "No current website verified; navigation opens the repository."}
- Website evidence: ${project.websiteSource ?? "Not applicable"}
- Category: ${project.category}
- Archived repository: ${project.archived ? "Yes" : "No"}; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: ${project.description.en}
- Chinese: ${project.description.zh}
- Profile section: ${project.source.profileSection}
- Profile revision: \`${project.source.profileRevision}\`
- Repository revision inspected: \`${project.source.repositoryRevision}\`

${overviewSection}## Current logo

![${project.title} source identity](../../public${project.logo.thumbnail})

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

${material ? "This is an owner-directed physical material or architectural identity. Preserve its physical materials, complete silhouette, selected camera and distinct tonal presentation. The animal-series drawing and accessory rules do not apply." : adapted ? "Preserve the owner-selected character illustration, its natural pose, native source resolution and documented transparent extraction. The lower jacket and forearm intentionally continue through the frame; the face, cap and raised ball remain inset." : toolWithoutStudy ? "Keep the current source mark and its provenance. For a future study, choose a recognizable physical object from the tool's actual function and follow the owner's material and composition direction. An animal or fragmented drawing is not required." : project.reference ? "This is a preferred family reference. Preserve its recognizable subject and balance of dominant color with multicolored details." : "Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments."}

${material || toolWithoutStudy ? "Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground." : adapted ? "Keep the character’s lower frame entry, complete expressive features and a separate paper field. Never describe resampled exports as new native detail." : "Use head portraits for large animals and optionally full-body poses for small animals."} Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement.${family ? " Preserve this reviewed composition and its archived predecessors." : " No new logo is generated in phase one."}
`;
	await writeFile(`docs/profiles/${name}`, content);
}
await writeFile("docs/profiles/README.md", `${index.join("\n")}\n`);
console.info(`Updated ${projects.length} project profiles.`);
