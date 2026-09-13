# Shared identity and content rules

## Current identities

- Keep a stable lowercase, hyphenated asset slug; the display name may retain punctuation and brand capitalization.
- An explicit project rename may change the catalogue slug and public route. Preserve the profile number and add Static Assets redirects for former page URLs. Historical artwork paths and export prefixes come from `family.root`, independently of the current catalogue ID; original bytes, checksums and past study records remain unchanged.
- Each project has a title, English and Chinese descriptions, its existing emoji, a source repository, a category, an explicit repository `archived` flag, a logo record, a foreground/accent color, and a background color.
- Record archive status from repository metadata, independently of the GitHub profile's Legacy section. All excludes archived repositories; Archived selects them across all existing categories. Keep product categories and put redraw status on the card.
- A project website must come from its repository metadata, README, or deployment configuration. Do not construct presumed live domains from repository names.
- Prefer the repository's root `logo.png`, then its documented application logo, app icon, or favicon. Preserve the original bytes in `public/logos/originals/` with a normalized filename.
- Record the source repository, source path, revision, file dimensions, and SHA-256. Record whether the source was a checked-out revision or a locally modified asset.
- An explicitly requested entry for an uncommitted project uses a null inspected revision and a checksummed local snapshot under `docs/sources/`. Preserve each inspected file and verify its hash with the assets. Keep README links hidden until an inspected source commit exists; never invent a commit or an available README. Original application artwork can link to its preserved local asset while remote source provenance is pending.
- When an approved family replaces a logo, keep the previous original's filename and hash stable. Store the replacement with a versioned filename, record a source revision containing those exact bytes, and add its presentation/history metadata under `family`.
- Local refinements use `family.status: "review"` and their own `foreground` paths, native dimensions, and checksum. Keep `project.logo` tied to the actual source repository. All candidate artwork views and downloads must use that candidate foreground. A Refined badge describes the drawing, not adoption or deployment.
- Derive display sizes without redrawing, recoloring, stretching, or cropping original artwork. Transparent padding and rounded-square presentation are display treatments.
- If no independent image exists, preserve the profile emoji as the current identity. Clearly record that it is an emoji identity, not a recovered original logo.
- Read colors from actual theme tokens where available. Otherwise sample the actual logo and record that method. Do not invent an unverified brand palette for a project with no source evidence.
- Display palette values as selectable/copyable hex colors. Include foreground/accent, background, and evidenced supplementary colors.
- Keep source descriptions and translations factual. Avoid adding features or deployment claims that the source does not support.

## Regenerating previews and profiles

The original project's Logo shape, proportions, colors and exact bytes are
authoritative. Hexly's paper/ink/terracotta palette, typography, red point and
editorial composition apply only to the Hexly archive and Hexly-authored
promotional material. Independent product websites retain their complete
palettes, themes and UI; an archive update is not a product design migration.
A small local accent may quote an evidenced Logo color, but never recolor the
Logo itself. Keep `officialProjectIdentity` separate from
`campaignInterpretation` in every collected kit, including future generated
Heroes. A campaign interpretation does not establish product adoption.

`src/data/projects/` is the reviewed source of truth, with one JSON file per project and `index.json` for catalogue order. The first import has 65 projects, 42 preserved source images, and 23 existing profile emojis. Emoji identities were rendered with the macOS Apple Color Emoji font and are stored separately in `public/logos/emoji/`; they are not represented as recovered original logos. The site loads the published catalogue from `/data/projects.json`.

Before authoring, restore the required local materials with `bun run assets:hydrate` or the project-scoped command in the [R2 skill](../.agents/skills/hexly-r2-media/SKILL.md). After intentionally editing a project's asset or metadata, run `bun run assets:build`, `bun run docs:profiles`, and `bun run assets:check`. The image command reads the restored local source files, preserves their bytes, and recreates the 32/64/160/1024 px display versions. Publish new immutable files through the inventory/plan/publish/verify sequence before committing their catalogue references. Git retains source records, SVG geometry, licenses and hashes; binary materials live in R2. Ordinary builds resolve CDN URLs from metadata and do not require those binary working files, sibling repositories or runtime GitHub access.

Theme colors are converted to sRGB hex from the recorded HSL/OKLCH tokens. Additional swatches are actual pixels sampled from the current artwork. Projects without an opaque background use `transparent`. A GitHub link is used when a current website has not been verified; legacy project links intentionally lead to their repositories.

## Animal family studies

Frogie and Pew are the reference identities: a recognizable animal, one dominant hue, and multicolored geometric fragments used as accents. Large animals generally use head portraits; smaller animals may use their full bodies.

The later cleanup must preserve the original backup and provenance, create a separate version, and inspect the candidate at artwork, app icon, sidebar, and favicon sizes in both themes before replacing a live identity. Naming, animal choice, principal colors, and logo-generation prompts belong in the individual project profile.

The active art direction and archive convention are in [the logo family guide](06-logo-family.md). Versioned candidates, raw generations, prompts, references, masks, and finishing passes live in `artwork/logo-family/` until reviewed for promotion.

Refined presentation tiles include their own background and contact shadows. Large README logos, app tiles, and social images may use them at full size with one rounded-square boundary; do not pad them inside another colored tile. Small sidebar/header marks and browser favicons use the transparent foreground, without a background tile, motif, glow, or additional corner mask. Root `logo.png` is the canonical foreground; keep square/rounded presentation masters separate. Apply each platform's masking contract to touch, PWA, and native application icons. The [usage and adoption SOP](07-logo-usage-sop.md) records the consumer audit and completion checklist.

Every completed candidate has a static `review.html` and a complete `/logos/<project>` before/after page, plus all master and small-size exports. Presentation reference boards appear only in static study HTML and Git. Background-only adjustments require a new finishing pass and byte-identical transparent/white masters. Preserve historical public manifests and verify them even after the catalogue selects a newer pass. Follow the current session's local-only or publication authorization.

## Commissioned vector brand kits

An explicit brief for a new scalable product identity can use original SVG
construction, with exact site tokens and licensed font outlines. Preserve the
native masters and design history in `artwork/brands/<project>/v<version>/` and
curated web exports under `public/brands/<project>/v<version>/`. The optional
catalogue `brandKit` keeps its immutable root/version and a separate, nullable
source-adoption revision. Do not fabricate an old source logo, model response,
raw-image approval or source adoption to fit the image-study schema.

Supply light/dark marks, wordmarks, lockups, app icons, transparent SVG/ICO
favicons, explicit usage/size rules, license notices and per-file SHA-256. Keep
the original SVG backup under `public/logos/originals/`. Use the shared detail,
palette and small-size views; the standalone specimen guide supplements them.
Snail v1.0.0 remains the first native vector kit and is preserved as history.

A generated replacement can pair the existing `family` record with a versioned
`brandKit.method: "gpt-image-2"`. Deliver real PNG/WebP artwork, native wide and
square compositions, independently authored repeatable theme textures, and
licensed wordmark outlines. Keep the full family comparison and exact image
checkpoints; do not call a raster or SVG wrapper a native vector. Previous kit
exports remain immutable. Source-adoption status is independent of Hexly brand
publication. See [Snail 2.0.0 and its preserved v1 history](18-snail-brand.md).

When the owner limits work to Hexly, record a null profile revision and document
the boundary. Source-project adoption and profile maintenance remain separate
work; a pending implementation is not described as a deployed application.

Existing artwork can use `brandKit.method: "archived-artwork"` with explicit
`scope: "hexly-campaign"`. The [complete archive guide](19-family-brand-archives.md)
defines schema-v2 manifests, full-canvas wide/mobile compositions, independently
repeatable theme textures, exact original-file and decoded-pixel checks, and
immutable export tools. No new generation is claimed for such a composition.
Keep original source rights separate from MIT-authored support work and OFL
typography. Snail's published v1/v2 files keep their original schema and bytes.

## Profile maintenance reference

The canonical maintenance skill is `workflow/agents/skills/zhengli-update-github-readme/SKILL.md`, with a reference entry in `nocoo/skills/zhengli-update-github-readme/SKILL.md`. The metadata convention is also recorded in nmem: `e42a5dde-192d-495f-bc21-4d303cabeb3a`.

Every GitHub-profile project update must also update the corresponding entry in this site's catalogue, logo backup, palette, and generated project profile. Preserve unrelated profile entries and existing asset provenance. Record the profile commit before referencing it in a new catalogue entry, and run the asset and documentation generators followed by the relevant quality gates.

Shared rules include English repository descriptions prefixed by the project's emoji, matching profile descriptions, deduplicated entries, exclusion of forks, and preservation of the Games, Skills & MCP, and Legacy sections. The v0.1.0 catalogue adds hexly.ai itself, bringing the total to 66 projects with 43 original images and 23 emoji identities.

On 2026-09-08 the owner requested that the site omit its own project, leaving 69 projects (49 active and 20 archived). The September 9 InfoSpace addition brings the catalogue to 70 projects (50 active and 20 archived). The site's own identity is preserved separately in `src/data/site-identity.json` and its historical profile. Default display order is animals, templates, games, then tools, using the dated popularity snapshot in `src/data/project-order.json`. InfoSpace leads the final tools group; all other projects keep their relative order. Existing numbered profile filenames remain stable across membership and display-order changes.

The September 10 Showtime addition brings the catalogue to 71 projects (51 active and 20 archived). Showtime leads the final tools group before InfoSpace and is first in the curated Tools filter through `featuredTools`; A–Z remains alphabetical. Its original local source snapshot remains unchanged after the repository's first publication. The owner-approved classic black-and-white clapperboard uses material-series study `2026-09-10-02 / 03`, with green confined to the independent presentation. Bilingual README work and source-agent icon adoption have separate provenance. See [Showtime onboarding](13-showtime-onboarding.md).

The September 11 Coffee and Hermes Gateway additions bring the catalogue to 73 projects (53 active and 20 archived). Both use the Tools category. Their records are appended, preserving all previous order and numbered profile paths. The source-backed bilingual overviews distinguish Coffee's published static application from Gateway's local offline core and unverified real integration. The owner approved both native material identities; study `2026-09-11-01 / 01` is adopted in each local source, bringing the independent-image count to 59. Exact source commits, original backups, separate website colors and complete review pages are recorded in [the onboarding record](14-new-tools-onboarding.md). Publication remains separate from local adoption.

The September 11 Ocelot addition brings the catalogue to 74 projects (54 active and 20 archived), with 60 independent images and 14 emoji identities. Ocelot uses the animal display family and the Tools product category. Its native fragmented portrait, finishing `2026-09-11-01 / 03`, is published in the source repository with separate transparent application/favicon assets and rounded README artwork. The original SVG badge, exact source/profile revisions, actual blue-gray theme and complete static/catalogue reviews are preserved in [Ocelot onboarding](15-ocelot-onboarding.md). No production homepage is assumed.
