# 16 · Hexly Video Kit

The 2.0.0 composition kit provides independent openings, content layouts and endings in both site themes. Website and kit versions remain separate. The recorded Hermes-on-Herdr film uses its own checkout of kit 1.0.0 pinned to `e1b220a7643e8275134b0bff0a11d703c047abbe`; its production source stays in the consumer repository. Finished films can appear in project details through the [R2 media catalogue](17-project-media.md), without adding their scripts, voices, logs or binaries here.

## One family, independent parts

The system has five openings, five content layouts and five endings, each in the site's light and dark themes. Selection is independent: 5 × 5 × 5 × 2 = 250 base compositions. Individual content scenes can also override the overall layout through `scene.template`.

| Family | Designs |
|---|---|
| Opening | Signal, Frame, Index, Horizon, Stack |
| Content | Launch, Essential, Showcase, Columns, Bento |
| Ending | Signature, Line, Frame, Split, Colophon |

Launch and Essential retain their original typographic direction. The other content layouts are new implementations. The old three layouts, their aliases, preview movies, posters and downloadable decks have been removed. Historical binaries remain recoverable from the verified original-history backup; see [Git recovery](23-git-history-recovery.md).

## Immutable design DNA

| Element | Source and rule |
|---|---|
| Mark | The exact SVG paths, 0 0 36 40 viewBox, 33×36 dimensions and 1.6 stroke from `src/components/Icon.tsx`. No redraw or non-uniform scaling. |
| Wordmark | Space Grotesk 600, 23 px base size, −1 px spacing, 11 px gap. `hexly` uses ink, the dot accent, `ai` muted/400. The reveal clips horizontally with 25% vertical bleed for glyph ink; never crop its descenders to the line box. |
| Light | Paper #f0f0e9, ink #30372e, muted #68705f, accent #bf5c3c, surface #f8f8f2 and soft #e8ebdf, from `base.css`. |
| Dark | Page #1e2824, ink #e6e9dc, muted #a0aa9a, accent #e79670, surface #27332c and soft #26352b, from `base.css`. |
| Small copy | Blend the existing muted token with 16% ink where needed to keep small labels readable on soft paper. Do not invent a new palette. |
| Fonts | The site's licensed Space Grotesk and Geist Mono; Noto Sans SC for Chinese, with OFL/source/hash evidence in the kit. |
| Red point | The existing #bc7252 location motif; one useful focal point, line endpoint or terminal mark. Never decorative confetti. |
| Geometry | Shared rounded panels, fine borders and an eight-pixel spacing unit. Chrome uses a 32 px edge inset; landscape content has an independent 80 px inset, 152 px top and 110 px bottom. |
| Motion | One quintic smoothstep with zero endpoint velocity/acceleration; layered 18–32 px travel, no spring bounce. Frame perspective and paper layers settle deterministically from frame numbers. |
| Signature | Official mark appears alone at the frame center, then moves left while the complete wordmark appears; product caption follows. Frame and Split finish in their left column; Line settles at the lower left. No personal FamilyBrand in the film. |

Deck and reduced-motion modes use settled layouts. The player starts paused, carries no shared silent audio tags and loads no movie. All project artwork keeps its original proportions and colors; uploaded screenshots are contained, not cropped or silently used for another project. Text cells measure the loaded fonts and scale long Latin or Chinese copy as a group, without truncation or clipping.

## Sources and boundaries

```text
packages/video-kit/src/schema.ts       strict v2 project/composition/manifest contracts
packages/video-kit/src/brand.ts        real palettes, geometry and motion constants
packages/video-kit/src/Identity.tsx    official mark, wordmark and reveal
packages/video-kit/src/SceneElements.tsx shared canvas, edge chrome, typography and artwork
packages/video-kit/src/Openings.tsx    five independent openings
packages/video-kit/src/Scenes.tsx      five independent content layouts
packages/video-kit/src/Endings.tsx     five independent endings
packages/video-kit/src/Film.tsx        one timeline for preview, deck and offline render
src/data/videos.json                  sole public collection metadata
src/data/template-examples.json       historical source of verified standard-outro records
src/model/videos.ts                   single catalogue-to-project adapter
src/components/Templates.tsx           collection and base composition selector
src/components/TemplateExamples.tsx    ready-to-use standard outros and Agent handoffs
scripts/video-site-assets.ts           font/license/schema/manifest public boundary
scripts/review-video.ts                local browser still/contact-sheet review
packages/video-kit/scripts/render.ts   explicit still/deck/video offline export
```

The manifest has no sample-media fields. `video:check` rejects media files in `public/video-assets`, validates all three five-member families, checks both themes and verifies licensed source bytes. Brand asset URLs keep version 1.0.0 while the layout kit is version 2.0.0. This avoids changing immutable font URLs for a layout-only edit.

`/templates` adapts the catalogue for all 15 component cards. The selector shows the chosen project in both preview modes; adding a screenshot stays client-side. URL state preserves the project, opening, content layout, ending, theme and part/view selection. Downloaded JSON also preserves the screenshot and effective motion/format choices. The player pauses on theme changes and keeps the current page. Old layouts are not redirected to an unrelated replacement.

`/templates#outros` presents five ready-to-use standard Hexly endings. Append any
original clip to any project without configuring or regenerating it. All five
appear on every template detail. These light, silent MP4s stay independent of
project/theme controls. Files, posters and HTML-rendered 4K stills live on R2;
`/templates/outros.json` provides references, hashes and reuse semantics. The old
`#examples` anchor and `/templates/examples.json` index remain compatible.
Native playback begins after a click. Every page and clip has copyable Agent
instructions. See [standard outros](24-standard-outro-examples.md) and
[Agent guides](25-agent-guides.md).

## Verification and export

See the [kit README](../packages/video-kit/README.md) for executable commands and the complete API. Use `--mode deck` to create actual PPTX/PDF without regenerating a movie, or `--mode stills` for inspection frames. Video encoding requires the explicit `video` or `all` mode. Every output directory is fresh and separate from public assets.

Tests cover all catalogue projects, all 250 base compositions, strict schema rejection, navigation round trips, actual brand assets, browser mixing/theme switches, screenshots/configuration parity and responsive accessibility. Browser review produces 30 real stills and three contact sheets. The [local review record](video-kit/2.0.0/review.md) distinguishes inspected frames and export proofs from movies, which are not regenerated for this task.

The local redesign record predates publication. Current publication follows the
site's GitHub Releases and exact revision at `/api/live`; downstream productions
pin a published source SHA. The five Workflow-made examples consume kit 2.0.0
at site v0.11.1 and do not change the shared component implementation.
