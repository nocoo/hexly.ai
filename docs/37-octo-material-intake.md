# Octo and material identity intake

## Authorized local scope

The owner approved the exact Octo seahorse and five material sources on
2026-10-18, including restoring Hexly to the catalogue. This is a local adoption
and dev-review task. No R2 upload, Git push, release, production deployment,
remote profile edit, Access change or Kuma operation is authorized here.

| Project | Category | Study / finishing | Local source adoption |
| --- | --- | --- | --- |
| Hexly | design | 2026-10-18-02 / 01 | `assets/brand/source.json`; ignored root copies match the committed native archive receipt |
| Base CI | tools | 2026-10-18-01 / 01 | `21addbd41b72b82e8d9e2dbe1352be75305126e2` |
| Base CLI | tools | 2026-10-18-01 / 01 | `4fd686d49ed15473ef9d0c3436c90e601c2723d4` |
| Base MCP | tools | 2026-10-18-01 / 01 | `240060f549a147a65d7358e22a96d58a6cd11fbe` |
| Next AI | ai | 2026-10-18-01 / 01 | `61d2fd325dff69215b29be87a95843a15b471c84` |
| Octo | everyday | 2026-10-18-07 / 02 | `0d0bcae39f7cb5fd4a22248f63bde57fed29cf01` |

The profile commit is `ba9e19ea8343b456dd7640d89b2c873f66753543`, also local.
The source lane's exact file hashes and checks are retained in
[source-adoption-report.json](sources/intake-2026-10-18/source-adoption-report.json).
Octo's unrelated dashboard changes remain controller-owned in that repository.

## Artwork and actual consumers

Octo is a native 2048px PNG from `gpt-image-2.5-sunburst`. Finishing pass 02
moves the full foreground right by 96 integer pixels without scaling, repainting
or changing opaque RGB. The crown, snout and side fin remain complete; only the
lower neck enters the frame. The previous clipped pass remains archived.

The five material sources are native 1024px JPEGs from the built-in image tool,
with **unknown model**, not a claimed Image 2.5 result. Their 2048px exports are
declared upscales. Each keeps native palette coordinates, complete source bytes,
foreground masks, independent material patterns and documented small-size limits.

Source roots use the exact transparent master; READMEs use the separate rounded
presentation. Actual small consumers use transparent artwork: Octo sidebar and
favicon, Next AI example headers/favicons, Hexly header/favicon and current
Video Kit compositions. Generic OAuth success/error symbols and Octo skeleton
loading bars are not brand consumers and remain unchanged. Shared Next AI React
controls receive no forced product branding. Published standard outro movies and
the old Video Kit SVG/font provenance remain immutable.
Hexly's effective touch icon uses the new opaque square presentation; the
historical root touch-icon URL remains unchanged.

Hexly's original root file had an existing recovery entry. Its bytes are retained
at the versioned location in `assets/brand/historical-root.json`; its R2 key, hash
and publication receipt do not change. New root copies stay ignored and have
their own inventory entries. No binary is force-added to Git.

New `/icons/<id>/v1.0.0` packages copy the approved native square and rounded
masters byte-for-byte; they do not recompose backgrounds or apply a second mask.
The scoped exporter verifies 2,968,690 fully opaque pixels without RGB changes.
New social cards and display previews use fresh paths; historical URLs remain.

## Catalogue, reviews and monitoring

The catalogue has 90 projects: 57 active and 33 archived. The original 84 project
records and their relative order remain byte-for-byte unchanged. The six IDs are
appended; Octo joins the animal popularity order using its separately recorded
snapshot. Existing numbered profiles remain stable, including Hexly at 66.

`src/data/projects/hexly-ai.json` is the single current Hexly identity. The site
share card uses `/api/share/site.json`; the Hexly project uses
`/api/share/hexly-ai.json`. Both are real independent Worker routes.

`src/data/logo-review-pages.json` names the seven deployable static reviews.
HTML, shared CSS/JS and provenance documents remain exact application documents;
their material links map to immutable inventory objects. Raw HTTP preserves
HTML bytes while browser navigation receives the existing download enhancement.
Generation and finishing receipts are not rewritten to change adoption status.

Octo is included once at `https://octo.hexly.ai/api/live`. Its existing public
endpoint already returns sanitized 200/503 JSON with no-store and a D1 check.
The two personal sites and Hexly remain the last three targets, with no duplicate
Hexly target or changed historical D1 ID. Local status is labeled demo data;
production reachability and the first real Cron observation remain unverified.

## Evidence and remaining publication work

Static review commit: `cf40e47c89ab72dbd56e0cd1425c14f668555f7f`. Its dated
verification is a historical snapshot, not an assertion of later browser checks.
Current browser checks live in `tests/browser/intake.spec.ts`; the standard
`bun run verify` also covers source hashes, current and historical public archives,
lint/types, unit coverage, real local HTTP, Chromium and deployment dry-run.

The final local run passed in 151.6 seconds: 403 unit tests, 28 real HTTP tests
and 83 Chromium tests. Configured coverage was 99.41% statements, 98.43% branches,
99.41% functions and 100% lines; this does not close the separately documented
L1 enforcement gaps. Explicit full-history asset verification also passed all
126 finishing passes and 77 public archives. Google Chrome 155 checked 24
project viewport/theme combinations, seven static reviews and the demo Status
page. Screenshots and logs remain in the ignored local
`.test-results/intake-2026-10-18/` directory; checksums and outcomes are retained
in [local-verification.json](sources/intake-2026-10-18/local-verification.json).
These automated checks are not owner dev acceptance.

The independent Octo dashboard audit verified the adopted master bytes, both
sidebar states, mobile/light/dark marks, DPR 2 selection, PNG/ICO favicon and
touch icon. It also found a 9px brand-axis shift between expanded and collapsed
sidebar states. That existing shell-layout issue remains with the separate
dashboard task; the brand-only commit does not alter layout or business behavior.

Known source-lane limits: Base CI's `actionlint` is unavailable. The Next AI Vite
example had no installed local dependencies, so its build/browser acceptance is
not claimed. Next example build and 11 Chromium tests passed. The four preexisting
Next AI dirty files were preserved exactly. README layout evidence uses local
Bun Markdown with approximate GitHub CSS, not remote GitHub rendering.

Dev runs in the dedicated Herdr `dev server` tab with
`VITE_LOCAL_MATERIALS=1 bun run dev` at `https://index.dev.hexly.ai`. After owner
acceptance, publication requires separate authorization, scoped R2 plan/upload
and full-byte verification, source/profile pushes, exact-revision site deployment,
and production Octo health/Status observation. Prepared URLs alone prove none of
those external steps.
