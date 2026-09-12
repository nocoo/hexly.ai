# Snail — generated animal identity and source-team handoff

Snail is a private library for collecting, organizing and playing videos. Its
current Hexly identity is **brand 2.0.0**, a fragmented terracotta snail with an
ink-and-olive body and one forward red point. The owner rejected v1.0.0 and
commissioned actual GPT Image animal artwork. The old vector kit remains an
immutable historical version.

## Scope and source status

Only `hexly.ai` is written. The starting branch was clean `main`, equal to
`origin/main`, at `352eb2652d4e11c876ef84152fc8e02f8d5ed331` (site v0.8.0).
Codex owns integration and publication. Grok `w1:p7` and Pi `w1:p8` supplied
read-only candidate and integration reviews. Snail Codex `w36:p1` owns all writes
in its own repository; no profile text change is needed for this logo replacement.

Snail's latest owner-relayed source report identifies application main
`fd5b6842d5090347e9296f9f591b77d17ee21f10`, a deployed **0.1.0 candidate** with
successful CI/deployment and anonymous JSON health. Authenticated upload and
Connector acceptance are pending normal owner login; there is no product tag or
GitHub Release. This report is attribution, not a claim of new production tests
by the Hexly brand task. The earlier [initial product snapshot](sources/snail-2026-09-12.json)
and [handoff](sources/snail-2026-09-12-handoff.md) remain unchanged.

The v1 brand was published at Hexly `352eb2652d4e11c876ef84152fc8e02f8d5ed331`
and separately adopted by Snail at
`fe5f72e8a0d960a81acadc5704a04e1c4ed4f607`. **v2 source adoption is pending**.
The catalogue therefore retains `family.status: "review"` and a null v2
`brandKit.sourceAdoptionRevision`. The UI says “Brand selected · Source adoption
pending,” avoiding a false application adoption or a misleading local-only label.

## Generation, selection and finishing

Six successful Azure OpenAI v1 `/images/edits` requests used `gpt-image-2`, quality
`high`. Runs `2026-09-13-01` to `03` are native 2048-square animal candidates;
runs `04` to `06` are independent native 2560 × 1024 compositions. Each request
retains the exact prompt, reference order and hashes, actual request ID,
sanitized response, original PNG/C2PA bytes and its raw-review decision.

Square references are the real Frogie finishing 02, Pew finishing 04 and Ocelot
finishing 03 assets. Heroes use their corresponding square first, then Frogie
and Ocelot. Eagle and the old Snail symbol were not submitted to the model.
Codex selected **Returning (01) + Hero (04)** under the owner's delegated batch
acceptance. The owner did not review the exact new bytes. Grok preferred Turning
(02) for expression; the [selection record](../artwork/brands/snail/v2.0.0/selection.json)
retains that disagreement and the small-size/framing rationale.

Finishing `01` uses exterior-connected near-white extraction. It retains the
separate red point and all animal anatomy, adds independent paper, spiral/trail,
grain and shallow shadows, and leaves the native frame at scale 1 and offset
[0, 0]. **1,227,417 fully opaque pixels are identical** to the source;
10,123 boundary pixels carry alpha. Actual rounded-outline clearance is
145.5px against the 128px requirement. No crop, repositioning, recoloring,
geometry retouch or post-generation composition repair was performed.

The wide Hero PNG is the untouched model output. WebP conversion retains its
entire frame. Narrow screens use the independent square presentation, not a
crop of the wide image. The animal remains raster: there is no native or traced
animal SVG. The wordmark reuses the exact licensed Space Grotesk 600 outlines;
512px repeatable spiral/trail SVG textures are independently authored support
geometry and have separate light/dark token variants.

## Files and public entry points

| Purpose | Location |
| --- | --- |
| Catalogue and single status source | `src/data/projects/snail.json` |
| Project, responsive Hero and complete brand review | https://hexly.ai/projects/snail#brand |
| Brand recipe, selection, measurements and review source | `artwork/brands/snail/v2.0.0/` |
| All six requests and untouched candidates | `artwork/logo-family/snail/2026-09-13-{01..06}/` |
| Selected frozen extraction and ten export sizes | `artwork/logo-family/snail/2026-09-13-01/finishing/01/` |
| Complete local study | `artwork/logo-family/snail/2026-09-13-01/review.html` |
| Immutable public kit | `public/brands/snail/v2.0.0/` |
| Standalone specimens | https://hexly.ai/brands/snail/v2.0.0/review.html |
| All kit files, byte lengths and SHA-256 | https://hexly.ai/brands/snail/v2.0.0/manifest.json |
| Usage, clear space, sizes, theme and integration guide | https://hexly.ai/brands/snail/v2.0.0/guide.md |
| Exact generation, selection and processing provenance | https://hexly.ai/brands/snail/v2.0.0/provenance.json |
| Existing family comparison/export interface | `/logos/family/snail/2026-09-13-01/01/` |
| New original backup | `public/logos/originals/snail-v2-0-0.png` |
| Preserved previous kit | https://hexly.ai/brands/snail/v1.0.0/review.html |
| Regenerated share image | https://hexly.ai/og/snail.jpg |

The old manifest SHA-256 remains
`11b8203d41030ad5317b94fd8a2a19d7a7b1077f174410b89caea4fd0d082ec8`;
the old mark is
`bd936c17cf3d2c64c09150a7e4d7fd07206278505f781a8e4eb162fac2bdb00a`.
Its source masters, original backup, font resources and published exports are
not rewritten. `project.logo` preserves that source provenance; `family` drives
new default cards, directory/gallery, detail, transparent previews, templates
and share images.

## Usage and maintenance

Use full transparent PNGs in navigation and the six-entry ICO in browser tabs.
Keep tile backgrounds and rounding for large presentations. Mark minimum is
16px, navigation preference 24px, wordmark minimum 72px and lockup minimum 160px.
A 16px specimen prioritizes shell/silhouette; small antennae, facets and the
point soften. Do not invent extra points, filters or masks to compensate.

UI colors and font remain the actual Hexly paper/ink/terracotta system.
`palette.json` separately records sampled raster colors and source coordinates.
The decorative 512px texture uses 3.8% ink and 3.2% accent, transparent boundaries
and 360–480 CSS-pixel repeat size. Cards and the archive choose it from the actual
site theme; all wordmark descenders retain their full bounds.

`brandKit.method: "gpt-image-2"` selects PNG assets, while native kits retain SVG
compatibility. `BrandKit` supplements the existing complete family comparison:
previous/current, three presentation modes, all small sizes, palette, edge
inspection and exact prompt/downloads. Reference boards stay in static specimens
and Git, outside the React product archive. The Hero is separate optional brand
metadata, never a screenshot or a fabricated product video.

The exporter refuses an already committed version. Any later export-byte change
requires a new version; preserve all earlier raw studies and frozen finishing
passes. Format mutable source files before exporting, then run asset/profile
regeneration and verify every historical manifest. Do not format frozen
finishing or sanitized request/response records.

Authored code/texture and any owner-held generated-output rights use the MIT
notice in the kit; Azure generation and rights limits are stated explicitly.
Space Grotesk retains its original SIL OFL 1.1 notices. The unmodified Hexly mark
is supplied as a separate endorsement resource, not confused with Snail.

## Verification and handoff

Meaningful checks cover generated-kit schema and native-kit compatibility,
old/new asset hashes, native dimensions, opaque-pixel equality, real ICO entries,
transparent texture seams, desktop/mobile and light/dark review, bilingual UI,
no overflow, true downloads, clipboard and accessibility. The archive records
actual visual snapshots and results under `artwork/brands/snail/v2.0.0/` outside
frozen finishing. Repository quality gates and the normal release pipeline are
required; no source product health observation is seeded or changed by this work.

After the matching successful CI and Deploy jobs, verify the production detail,
manifest and actual asset bytes. Send `w36:p1` the **published full Hexly SHA**,
brand 2.0.0, immutable URLs and manifest SHA-256. Snail should pin that commit,
copy selected exact bytes, preserve MIT/OFL and record its own adoption commit.
App and OS themes may differ: choose wordmark/texture by the app theme; the
transparent animal and favicon are theme neutral. A pending authentication gate
must not be dismissed by this brand publication.
