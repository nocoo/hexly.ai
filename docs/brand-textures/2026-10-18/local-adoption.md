# Local texture adoption

The owner approved the 12 native images on 2026-10-18 and requested a local site
preview. Authorization is recorded in `authorization.json`; no further image
generation was needed.

## Current surfaces

| Project | Texture | Presentation icon | Card opacity |
| --- | --- | --- | --- |
| Hexly | 1.0.1 | 1.0.2 | 0.40 |
| Base CI | 1.0.1 | 1.0.2 | 0.45 |
| Base CLI | 1.0.1 | 1.0.2 | 0.45 |
| Base MCP | 1.0.1 | 1.0.2 | 0.45 |
| Next AI | 1.0.1 | 1.0.2 | 0.45 |
| Octo | 1.0.1 | 1.0.2 | 0.37 |
| Sleepy | Existing 1.0.1 | 1.0.1 | Unchanged |
| Zoo | Existing 1.0.1 | Existing 1.0.0 | Unchanged |

Six independent texture packs provide native light/dark PNGs, full and 320px
WebPs, exact prompts, approved source records, licenses and standalone reviews.
Card opacity comes from each export's pixel-based contrast measurement, targeting
at least 4.7:1. Full specimens use a single complete canvas without tiling.

Seven presentation packs use the established texture-composition recipe: native
foreground at its original position over the light texture at 0.7 opacity, on
the Hexly paper token, with the existing continuous-corner presentation mask.
All fully opaque foreground pixels retain their original RGB values. Octo's
edge-entry portrait has 1,729 foreground pixels intersecting the outline; its
bottom-entry composition is intentional, not a complete-body clearance claim.
All other updated icons have zero outline intersections. Original transparent
masters, source-product identities, historical family studies and Zoo are
unchanged. Hexly's touch icon follows the new presentation pack; its transparent
browser favicon stays unchanged.

## Reproduce and verify

```sh
bun .agents/skills/hexly-brand-textures/scripts/export.ts \
  --inventory docs/brand-textures/2026-10-18/adoption-inventory.json \
  --output .video-work/texture-adoptions-2026-10-18-final.json
node artwork/icon-texture-rollout/2026-10-18-textures/compose.mjs
bunx --no-install vitest run tests/unit/project-textures.test.ts
bun run verify
```

The catalogue selects the exported metadata. Composition evidence is in
`docs/icon-texture-rollout/2026-10-18-textures/composition.json`. Existing packages
are validated rather than overwritten on repeat runs. The first local v1.0.0
texture packs and v1.0.1 icons for the six new projects remain immutable history;
their replacement records add missing inspection fields without changing PNGs.
See `Retrospective.md` for the failed gate and correction.

Use `VITE_LOCAL_MATERIALS=1` only in ignored `.env.development.local`, then run
the daily development server and inspect `https://index.dev.hexly.ai/`, canonical
`/projects/<id>#texture` pages and the new `/textures/<id>/v1.0.1/review.html`
archives. Production builds continue to use CDN URLs, which are not published
by this local task. Upload and exact-revision release verification remain
separate work requiring authorization. Do not remove ignored material files:
they are inventoried locally but have not been uploaded.

## Acceptance evidence

- `bun run verify` passed in 162.5 seconds: 409 unit tests, 28 real HTTP tests
  and 83 Chromium journeys, plus configured static/security/asset/deploy checks.
- Coverage: statements 99.41%, branches 98.43%, functions 99.41%, lines 100%.
- `local-browser-check.json` records 32 local project/theme/viewport cases,
  16 byte-identical native PNG downloads and six functioning standalone reviews.
- Desktop (1360px) and mobile (390px) checks preserve square specimens,
  no-repeat rendering, current icon/texture URLs and zero horizontal overflow.
- Local screenshots are in `.video-work/texture-adoption-2026-10-18/`.
  The `*-390-specimen.png` captures inspect each complete Octo square after
  reduced-motion scrolling. Whole-section captures exceed the application
  scrollport and are not evidence of complete framing.
- Original identity/family/palette/archive metadata and every pre-existing
  inventory entry compare unchanged against the pre-adoption commit.
- Chrome opened the local homepage and Octo texture section for owner review.
