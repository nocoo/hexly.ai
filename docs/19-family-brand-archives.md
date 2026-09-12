# Complete Hexly project brand archives

The v0.10.0 collection completes the 54 active projects other than Snail. The
catalogue contains 75 projects: 55 active and 20 archived. Snail's published
2.0.0 kit and 1.0.0 history remain unchanged. Hexly itself has a separate site
identity and is not an extra directory project.

The [inventory and gap matrix](brand-archives/README.md) was recorded against
site v0.9.0, commit `d600805f7c2833d601bc32d6e3db0b02360eb0c6`, before implementation.
Its [machine-readable record](brand-archives/inventory-0.10.0.json) preserves
every project, its scope, original paths/hashes, native dimensions, source
method, family comparison and protected catalogue metadata. The live catalogue
and sitemap matched that baseline. This release adds no project and changes no
product repository or GitHub-profile content.

## Original identity and campaign scope

| Surface or asset | Authority and rule |
| --- | --- |
| Official project identity | Keep its existing geometry, proportions, colors and exact file bytes. Preserve source URL, revision and original filename. |
| Independent product website | Its own palette, theme, typography and UI remain independent. This work does not prescribe changes to them. |
| Hexly project introduction and archive | Use Hexly's actual paper/ink surfaces, Space Grotesk, Geist Mono, restrained terracotta point, rounded frames, fine borders and generous spacing. |
| Hexly-authored video, Deck, social or other campaign | Use the same Hexly surface language around an unchanged project mark. A small accent may quote an evidenced artwork color. |
| Hexly family study or generated campaign Hero | Record it as `campaignInterpretation`, with its own source and adoption state. It does not replace `officialProjectIdentity`. |

49 family foregrounds are already byte-identical to their recorded project
identity. Basalt, clip, Fundly, DreamRO and Meowth retain distinct originals and
family studies. Their existing `family.status: "review"` stays intact; the
original download and campaign artwork are separately labeled. A Hexly kit
version is neither a product release nor evidence of new source adoption.

## What each kit contains

All 54 projects already had archived artwork: 24 generated animals, 19 generated
material/architectural identities, 10 retained originals and one supplied
illustration. There were **zero new image-generation calls** in this collection.
Objects remain objects; originals retain their identities. The Hero images are
authored layouts of complete existing images, not native GPT Image outputs.

| Role | Versioned export |
| --- | --- |
| Exact original project identity | `official-logo.<original extension>` |
| Exact existing campaign foreground | `logo.png`, `mark-light.png`, `mark-dark.png` — identical bytes in both themes |
| Small transparent mark | `mark-{16,24,32,48,64,128,256,512}.png`, plus 1024 only when native resolution permits |
| Campaign typography | `wordmark-light.svg`, `wordmark-dark.svg`; real Space Grotesk 600 glyph outlines with full descender bounds |
| Mark and typography | `lockup-light.png`, `lockup-dark.png`; raster composition, never advertised as native vector artwork |
| Presentation icon | Light/dark PNG masters and 512px exports; the light master preserves the existing approved presentation |
| Browser/platform assets | Transparent six-entry `favicon.ico`, Apple touch PNG, 192px PWA PNG |
| Desktop Hero | `hero.webp`, `hero-dark.webp`, and lossless PNG downloads, 2400 × 960 |
| Mobile Hero | `hero-square.webp`, `hero-square-dark.webp`, independently composed at 1024 × 1024 |
| Supporting texture | Light/dark SVG and transparent PNG, 512px seamless tile |
| Source and usage | `manifest.json`, `provenance.json`, `tokens.json`, `guide.md`, `license.txt`, exact historical prompt when applicable |
| Independent specimen page | `review.html`, CSS/JS, exact official Hexly mark, actual font files and OFL notices |

There are 48–50 exported files per project, plus its manifest. Full-size source
masters remain in Git and Workers Static Assets, as requested. Browsing loads
the WebP Hero and appropriate small marks; it does not load all master downloads
or perform runtime rendering. There is no new movie, render cache, storage
binding or production image service.

The whole original square is uniformly scaled into each canvas. An existing
edge-entry portrait meets the canvas baseline; its anatomy is not extended or
trimmed. Physical objects use a quiet paper stage in wide and mobile compositions. The
mobile image is composed separately rather than cropped from the desktop Hero.
R2Shot remains 920px native, Hooky 900px and Poké Pocket 960px; historical larger
presentation exports are described as such, never as new native detail.

## Typography, spacing and texture

The source is the repository's actual Space Grotesk 600, with the site's
`-1/23 em` tracking, outlined by fontTools. Glyph bounds include accents and
descenders before adding canvas padding. Font bytes and OFL notices are
checksummed; no substitute font or recreated Hexly mark is introduced.

Use at least 1/8 of the mark canvas height as external clear space around
standalone marks and lockups. Navigation prefers 24px, with 16px the minimum;
the guide gives a measured minimum width for each wordmark and lockup. At 16px,
fine facets naturally soften. Small transparent marks have no added background,
mask, shadow, extra red dot or opacity reduction. Intentional source frame
entries stay intact.

Each project has different motif geometry. Lily leaves and ripples belong to
Frogie, stripe sweeps to Pew, circuit paths to Matrix, roof construction marks
to Basalt, and pane outlines with a returning route to hermes on herdr. The
complete linework sits inside a 432px region of a 512px tile, leaving a transparent
40px perimeter for clean repetition. Ink opacity is 3.6%, accent 2.2%; motifs
are decorative and never the only carrier of information. Theme specimens own
their text contrast independently of the surrounding site theme.

Hexly campaign tokens are `#f0f0e9` paper, `#30372e` ink, `#bf5c3c` accent;
dark mode uses `#1e2824`, `#e6e9dc`, `#e79670`. These do not replace any original
Logo palette or independent product UI tokens. Original artwork color evidence
remains in the catalogue and historical family archive. A single point acts as
a composition anchor; it is not attached to the project mark or presented as a
health indicator.

## Manifest and provenance

[Schema v2](../public/brands/schema-v2.json) describes collected
`method: "archived-artwork"` kits. The catalogue references each kit once through
its optional `brandKit`, with `scope: "hexly-campaign"`. The manifest records:

- `officialProjectIdentity`: source/export paths, source revision, bytes,
  SHA-256, native dimensions and decoded RGBA SHA-256; `modified: false`.
- `campaignInterpretation`: independent source/export and digests, source
  method, family adoption status, whether it matches the official bytes,
  `replacesOfficialIdentity: false`, `newGenerationCalls: 0`.
- Scope: product UI unchanged, official identity not recolored, campaign not
  replacing official identity.
- Hero: authored composition, no crop or recolor, exact placements for both
  canvases, `nativeGPTOutput: false`.
- Every exported file's role, byte count and SHA-256.

`src/model/brand-manifest.ts` adds cross-field checks: identity exports must
match the file list, paths must stay inside their immutable version, and
same-byte/source-method claims must agree. Snail's existing native/generated
kits keep their original manifests; they are not rewritten into this schema.

`provenance.json` links historical generation requests/responses/prompts/raw
hashes at the pinned baseline revision, when those records actually exist. It
also records the authored recipe/exporter hashes and original finishing pass.
Retained originals and the supplied illustration have no invented model call.
Future GPT Image campaigns must record their actual model, prompt, raw bytes,
review and derivation separately; they must not silently replace an original.

License statements follow source evidence. MIT covers newly authored support
code/text/layout; it does not relicense preserved imagery. Space Grotesk and
Geist Mono keep SIL OFL 1.1. The 10 retained originals have no independently
established original artwork license in these records. Poké Pocket preserves
the supplied illustration and its source/adaptation history; its artist and
redistribution license are not established, and no blanket MIT grant is made.

## Routes and downloads

Use `/projects/<id>#brand` for the canonical archive. The main Projects
catalogue and secondary `/logos` wall use the same project data. Existing
`/logos/<id>` links redirect to that brand anchor, while historical asset roots
continue serving their original files. Hermes uses the current ID
`hermes-on-herdr`, but its old family files remain under `hermes-gateway-herdr`;
always read `family.root` instead of constructing it from the current ID.

New immutable URLs follow `https://hexly.ai/brands/<id>/v1.0.0/`. For example:

- [Frogie archive](https://hexly.ai/projects/frogie#brand),
  [manifest](https://hexly.ai/brands/frogie/v1.0.0/manifest.json),
  [specimens](https://hexly.ai/brands/frogie/v1.0.0/review.html).
- [Basalt archive](https://hexly.ai/projects/basalt#brand), with separately
  recorded source identity and campaign tower.
- [Snail archive](https://hexly.ai/projects/snail#brand), unchanged v2.

Download the manifest and only the required roles. Verify their bytes and
SHA-256, then pin the published Hexly commit and manifest hash in the consuming
project's own adoption record. No product files are copied by this release.
Build-generated sitemap, canonical HTML, JSON-LD, share metadata and `llms.txt`
continue using the canonical project routes. Standalone specimens are noindex
and point back to the project archive.

## Authoring and maintenance

Source files are `artwork/brands/<id>/v1.0.0/{recipe.json,wordmark.svg,verification.json}`.
The frozen collection tooling is `artwork/brands/collection-2026-09/`.
Before these roots are committed, the authoring sequence is:

```sh
uv run --with fonttools==4.60.1 --with brotli==1.1.0 python artwork/brands/collection-2026-09/outline.py
# Format only the target recipes and mutable tool sources before export.
bun artwork/brands/collection-2026-09/export.ts
bun run assets:build
bun run docs:profiles
bun run assets:check
```

The exporter accepts target IDs to inspect one uncommitted kit; both tools
refuse to overwrite a version already present in `HEAD`. For a subsequent
revision, create a new immutable version, recipe and dated authoring record;
do not edit the frozen source/export bytes to reuse a published URL. Preserve
original paths and the old kit, update only the new `brandKit` selection, and
repeat the affected checks. Do not run a formatter over copied original SVGs:
`official-logo.*` is excluded from Biome because its bytes are source evidence,
and remains protected by hash and browser accessibility tests.

Verification is in `tests/{unit,http,browser}/brand-collection.*`: full inventory
coverage, protected catalogue metadata, exact file/decoded pixel colors, font
bounds, transparent ICO entries, distinct seamless motifs, complete Hero
placements, all served downloads, old routes, project navigation, English and
Chinese, both themes and desktop/320px mobile layouts. Existing Snail tests
remain active. Browser tests save Hero and wordmark screenshots; selected pages
also receive axe checks. These are Chromium checks, not Safari/Firefox claims.
The [collection inspection record](../artwork/brands/collection-2026-09/inspection/)
keeps compact contact sheets and the actual acceptance results.

The feature commit and site v0.10.0 release commit are separate. Follow
[the release workflow](05-release.md): exact-SHA CI and Deploy, production
version/revision and HTTP verification, then annotated tag and GitHub Release.
The release record is the authority for publication; a local export is not.
