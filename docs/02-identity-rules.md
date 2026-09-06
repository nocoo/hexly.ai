# Shared identity and content rules

## Current identities

- Keep a stable lowercase, hyphenated asset slug; the display name may retain punctuation and brand capitalization.
- Each project has a title, English and Chinese descriptions, its existing emoji, a source repository, a category, a logo record, a foreground/accent color, and a background color.
- A project website must come from its repository metadata, README, or deployment configuration. Do not construct presumed live domains from repository names.
- Prefer the repository's root `logo.png`, then its documented application logo, app icon, or favicon. Preserve the original bytes in `public/logos/originals/` with a normalized filename.
- Record the source repository, source path, revision, file dimensions, and SHA-256. Record whether the source was a checked-out revision or a locally modified asset.
- Derive display sizes without redrawing, recoloring, stretching, or cropping original artwork. Transparent padding and rounded-square presentation are display treatments.
- If no independent image exists, preserve the profile emoji as the current identity. Clearly record that it is an emoji identity, not a recovered original logo.
- Read colors from actual theme tokens where available. Otherwise sample the actual logo and record that method. Do not invent an unverified brand palette for a project with no source evidence.
- Display palette values as selectable/copyable hex colors. Include foreground/accent, background, and evidenced supplementary colors.
- Keep source descriptions and translations factual. Avoid adding features or deployment claims that the source does not support.

## Regenerating previews and profiles

`src/data/projects.json` is the reviewed source of truth. The first import has 65 projects, 42 preserved source images, and 23 existing profile emojis. Emoji identities were rendered with the macOS Apple Color Emoji font and are stored separately in `public/logos/emoji/`; they are not represented as recovered original logos.

After intentionally editing a project's asset or metadata, run `bun run assets:build`, `bun run docs:profiles`, and `bun run assets:check`. The image command reads only the checked-in source files, preserves their bytes, and recreates the 32/64/160/1024 px display versions. Ordinary builds use the checked-in derivatives and do not access sibling repositories or GitHub.

Theme colors are converted to sRGB hex from the recorded HSL/OKLCH tokens. Additional swatches are actual pixels sampled from the current artwork. Projects without an opaque background use `transparent`. A GitHub link is used when a current website has not been verified; legacy project links intentionally lead to their repositories.

## Future animal family

Frogie and Pew are the reference identities: a recognizable animal, one dominant hue, and multicolored geometric fragments used as accents. Large animals generally use head portraits; smaller animals may use their full bodies.

The later cleanup must preserve the original backup and provenance, create a separate version, and inspect the candidate at artwork, app icon, sidebar, and favicon sizes in both themes before replacing a live identity. Naming, animal choice, principal colors, and logo-generation prompts belong in the individual project profile.

## Profile maintenance reference

The workflow checkout currently has no separate GitHub-profile maintenance skill. The relevant existing procedure was retrieved from nmem: `e42a5dde-192d-495f-bc21-4d303cabeb3a` (GitHub project metadata and profile updates).

Its shared rules are: English repository descriptions prefixed by the project's emoji; profile entries use the same emoji and description; deduplicate entries; exclude forks; keep skills and MCP servers in their own section; keep old projects in the legacy section. This phase reads the profile as input and maintains its own audited catalogue.
