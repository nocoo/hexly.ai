# Shared identity and content rules

## Current identities

- Keep a stable lowercase, hyphenated asset slug; the display name may retain punctuation and brand capitalization.
- Each project has a title, English and Chinese descriptions, its existing emoji, a source repository, a category, an explicit repository `archived` flag, a logo record, a foreground/accent color, and a background color.
- Record archive status from repository metadata, independently of the GitHub profile's Legacy section. All excludes archived repositories; Archived selects them across all existing categories. Keep product categories and put redraw status on the card.
- A project website must come from its repository metadata, README, or deployment configuration. Do not construct presumed live domains from repository names.
- Prefer the repository's root `logo.png`, then its documented application logo, app icon, or favicon. Preserve the original bytes in `public/logos/originals/` with a normalized filename.
- Record the source repository, source path, revision, file dimensions, and SHA-256. Record whether the source was a checked-out revision or a locally modified asset.
- When an approved family replaces a logo, keep the previous original's filename and hash stable. Store the replacement with a versioned filename, record a source revision containing those exact bytes, and add its presentation/history metadata under `family`.
- Local refinements use `family.status: "review"` and their own `foreground` paths, native dimensions, and checksum. Keep `project.logo` tied to the actual source repository. All candidate artwork views and downloads must use that candidate foreground. A Refined badge describes the drawing, not adoption or deployment.
- Derive display sizes without redrawing, recoloring, stretching, or cropping original artwork. Transparent padding and rounded-square presentation are display treatments.
- If no independent image exists, preserve the profile emoji as the current identity. Clearly record that it is an emoji identity, not a recovered original logo.
- Read colors from actual theme tokens where available. Otherwise sample the actual logo and record that method. Do not invent an unverified brand palette for a project with no source evidence.
- Display palette values as selectable/copyable hex colors. Include foreground/accent, background, and evidenced supplementary colors.
- Keep source descriptions and translations factual. Avoid adding features or deployment claims that the source does not support.

## Regenerating previews and profiles

`src/data/projects/` is the reviewed source of truth, with one JSON file per project and `index.json` for catalogue order. The first import has 65 projects, 42 preserved source images, and 23 existing profile emojis. Emoji identities were rendered with the macOS Apple Color Emoji font and are stored separately in `public/logos/emoji/`; they are not represented as recovered original logos. The site loads the published catalogue from `/data/projects.json`.

After intentionally editing a project's asset or metadata, run `bun run assets:build`, `bun run docs:profiles`, and `bun run assets:check`. The image command reads only the checked-in source files, preserves their bytes, and recreates the 32/64/160/1024 px display versions. Ordinary builds use the checked-in derivatives and do not access sibling repositories or GitHub.

Theme colors are converted to sRGB hex from the recorded HSL/OKLCH tokens. Additional swatches are actual pixels sampled from the current artwork. Projects without an opaque background use `transparent`. A GitHub link is used when a current website has not been verified; legacy project links intentionally lead to their repositories.

## Animal family studies

Frogie and Pew are the reference identities: a recognizable animal, one dominant hue, and multicolored geometric fragments used as accents. Large animals generally use head portraits; smaller animals may use their full bodies.

The later cleanup must preserve the original backup and provenance, create a separate version, and inspect the candidate at artwork, app icon, sidebar, and favicon sizes in both themes before replacing a live identity. Naming, animal choice, principal colors, and logo-generation prompts belong in the individual project profile.

The active art direction and archive convention are in [the logo family guide](06-logo-family.md). Versioned candidates, raw generations, prompts, references, masks, and finishing passes live in `artwork/logo-family/` until reviewed for promotion.

Refined presentation tiles include their own background and contact shadows. Large README logos, app tiles, and social images may use them at full size with one rounded-square boundary; do not pad them inside another colored tile. Small sidebar/header marks and browser favicons use the transparent foreground, without a background tile, motif, glow, or additional corner mask. Root `logo.png` is the canonical foreground; keep square/rounded presentation masters separate. Apply each platform's masking contract to touch, PWA, and native application icons. The [usage and adoption SOP](07-logo-usage-sop.md) records the consumer audit and completion checklist.

Every completed candidate has a static `review.html` and a complete `/logos/<project>` before/after page, plus all master and small-size exports. Presentation reference boards appear only in static study HTML and Git. Background-only adjustments require a new finishing pass and byte-identical transparent/white masters. Preserve historical public manifests and verify them even after the catalogue selects a newer pass. Follow the current session's local-only or publication authorization.

## Profile maintenance reference

The canonical maintenance skill is `workflow/agents/skills/zhengli-update-github-readme/SKILL.md`, with a reference entry in `nocoo/skills/zhengli-update-github-readme/SKILL.md`. The metadata convention is also recorded in nmem: `e42a5dde-192d-495f-bc21-4d303cabeb3a`.

Every GitHub-profile project update must also update the corresponding entry in this site's catalogue, logo backup, palette, and generated project profile. Preserve unrelated profile entries and existing asset provenance. Record the profile commit before referencing it in a new catalogue entry, and run the asset and documentation generators followed by the relevant quality gates.

Shared rules include English repository descriptions prefixed by the project's emoji, matching profile descriptions, deduplicated entries, exclusion of forks, and preservation of the Games, Skills & MCP, and Legacy sections. The v0.1.0 catalogue adds hexly.ai itself, bringing the total to 66 projects with 43 original images and 23 emoji identities.

On 2026-09-08 the owner requested that the site omit its own project, leaving 69 projects (49 active and 20 archived). The September 9 InfoSpace addition brings the catalogue to 70 projects (50 active and 20 archived). The site's own identity is preserved separately in `src/data/site-identity.json` and its historical profile. Default display order is animals, templates, games, then tools, using the dated popularity snapshot in `src/data/project-order.json`. InfoSpace leads the final tools group; all other projects keep their relative order. Existing numbered profile filenames remain stable across membership and display-order changes.
