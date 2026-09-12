# Snail — original vector identity and catalogue handoff

Snail is a private video collection, organization and playback library. Its
public repository was created on 2026-09-12; the source team is implementing the
first product release. This change publishes the **brand**, independently of
that application release.

## Scope and ownership

The owner explicitly limited all repository writes to `hexly.ai`. The starting
branch was clean `main`, equal to `origin/main`, at
`a55baf21a2f0842c0580098e54d4479e41847593` (site v0.7.0). Snail Codex `w36:p1`
confirmed through Herdr that it writes only `snail` and keeps a provisional asset
slot until the fixed Hexly publication is handed over. The Snail source and
GitHub profile were not modified by this task.

The [product handoff](sources/snail-2026-09-12-handoff.md) and its
[checksummed snapshot](sources/snail-2026-09-12.json) record the actual public
repository, intended website and confirmed implementation plan. Null source and
profile revisions are deliberate: no unavailable source commit, adoption or
profile update is invented.

## Design

The mark is an original, editable vector: a coiled shell, a low carrying line
and one terracotta point. A private collection is its core idea; the forward
gesture suggests returning to a chosen film. It has no borrowed Eagle geometry,
raster tracing or image-model generation. The explicit scalable product-identity
brief follows native vector construction rather than a generated animal study.

- Paper/ink/terracotta come unchanged from `src/styles/base.css` at the baseline
  above. Dark variants use the actual site dark palette.
- The wordmark is **Snail**, in the site's Space Grotesk 600 with -1/23 em
  tracking. Exact glyphs are outlined; SVG marks need no runtime font request.
- The main mark has a 256-unit canvas, 22-unit rounded strokes and one 24-unit
  point. Clear space is at least one point diameter around the visible artwork.
- Minimum sizes: mark 16px (24px recommended), wordmark 72px wide, lockup 160px
  wide. The smallest coil softens at favicon size; the silhouette remains primary.
- Transparent navigation marks and favicons stay separate from square app
  presentations. The favicon ICO is a real six-entry container with alpha.

## Paths and version

| Purpose | Path |
| --- | --- |
| Project catalogue | `src/data/projects/snail.json` |
| Canonical detail and brand section | `https://hexly.ai/projects/snail#brand` |
| Native master, font outline tool, export recipe, design history | `artwork/brands/snail/v1.0.0/` |
| Immutable SVG/PNG/ICO/font/license exports | `public/brands/snail/v1.0.0/` |
| Public standalone specimens | `https://hexly.ai/brands/snail/v1.0.0/review.html` |
| Public usage guide | `https://hexly.ai/brands/snail/v1.0.0/guide.md` |
| Exact files, bytes and SHA-256 | `https://hexly.ai/brands/snail/v1.0.0/manifest.json` |
| Preserved original | `public/logos/originals/snail-v1-0-0.svg` |
| Site share card | `https://hexly.ai/og/snail.jpg` |

The **brand version is 1.0.0**, separate from both the Hexly site version and the
Snail product version. The native-kit record is optional; existing image-study
archives keep their previous paths, artwork, comparison views and adoption status.
`BrandKit` extends the existing detail's `#brand` section with native wordmark
specimens, practical usage rules, downloads and provenance. Existing small-size,
palette and light/dark edge reviews remain shared.

The catalogue remains the only project and health-target source. Snail joins the
animal display family, the Everyday product category, and automatically produces
`https://snail.hexly.ai/api/live`. The endpoint is a confirmed deployment target;
health is never seeded or claimed from a login page. Snail owns its public health
implementation and precise Access exception. An unknown/down/unconfigured result
before its deployment does not remove the catalogue entry.

Sitemap, crawler HTML, JSON-LD, share metadata and llms.txt derive from the new
catalogue entry. The standalone specimen page is `noindex` and canonicalizes to
the project detail. `/brands/*` serves only versioned files with immutable cache
headers; original historical assets keep their existing cache policy.

## License and maintenance

Original Snail geometry and code follow this repository's MIT license. The
unchanged Space Grotesk font and notices use SIL OFL 1.1. `tokens.json`, the guide
and manifest record their sources and checksums. The official Hexly endorsement
mark copies the exact existing paths, independently of the Snail mark.

For revisions, create a new brand version and retain the old directory. The export
script refuses to overwrite a committed version. `assets:check` verifies both the
active kit's delivery and all historical native-kit manifest hashes. The profile
generator distinguishes this commissioned vector identity from generated artwork
and from source-project adoption.

## Downstream handoff

After the normal site release, send `w36:p1` the actual published full Git SHA,
brand version, public manifest/guide URLs, and the main SVG/PNG/favicon paths.
Snail should pin that Git SHA, copy selected **exact** bytes into its own repo,
verify the manifest hashes, retain MIT/OFL notices and record an adoption commit.
App theme toggles choose explicit light/dark assets; the adaptive favicon follows
the browser's system theme. No Snail scripts, private videos, tokens or application
implementation are part of this Hexly archive.

Local typecheck, lint, build, isolation, asset verification, 240 unit tests,
71 HTTP tests and 218 browser tests passed. The ICO's six entries decode with
alpha. Desktop/mobile light/dark inspection found no horizontal overflow,
browser errors or axe violations; the standalone specimen sheet passed too.
The [contact sheet](../artwork/brands/snail/v1.0.0/contact-sheet.webp) and
[verification record](../artwork/brands/snail/v1.0.0/verification.json) preserve
the actual review. Original family assets and previous project profiles are
unchanged. A bounded public Snail health probe reported `down/network` before
the application's deployment, without writing mock or backfilled observations.

The final release SHA and production result are sent only after successful CI,
the matching Deploy job and an actual production document/asset smoke.
