# Hexly Video Kit: family and publication contract

The reusable kit lives in `packages/video-kit`; the website library is
[`/videos`](https://hexly.ai/videos). The [package README](../packages/video-kit/README.md)
documents runnable Vite/Remotion examples, configuration, components and real
MP4/PPTX/PDF export commands. [Credits](../packages/video-kit/CREDITS.md) record
asset permission and dependency licensing.

## Family DNA

| Invariant | Source and rule |
| --- | --- |
| Mark | Exact three paths, viewBox and stroke from `src/components/Icon.tsx`; uniform scaling only. No redraw, crop, warp, rotated logo plane or substituted personal wordmark. |
| Wordmark | Space Grotesk, weight 600, `hexly` in ink, dot in terracotta, `ai` in muted ink at weight 400. Base size 23, letter spacing −1, mark gap 11. |
| Type | Space Grotesk for statements; Geist Mono for labels, folios and metadata; the site's Noto Sans SC family for Chinese. Keep licensed local font bytes with the kit. |
| Ground | Paper `#f0f0e9`, surface `#f8f8f2`, soft paper `#e8ebdf`. Every 1.0.0 template uses the light palette. Site dark mode surrounds the same light film canvas. |
| Hierarchy | Ink `#30372e`, secondary `#68705f`, line `#d4d8cb`; terracotta `#bf5c3c` is an accent, not a body-text replacement. CTA uses ink on paper for contrast. |
| Red dot | Existing location motif `#bc7252`; use one focal/section indicator. Do not scatter decorative dots or invent a particle system. A dot never replaces a text status label. |
| Geometry | Eight-unit rhythm, 112-unit landscape safe margin, 8/24/28 radius scale. Deliberate borders and room around content. |
| Motion | Shared quintic smoothstep, zero end velocity/acceleration, 18-unit entrance travel, 0.55–0.9 second settling and 0.09–0.14 second hierarchy delays. No spring overshoot, bounce or random drift. |

The source of these rules is `src/brand.ts` and `src/motion.ts` in the package,
with provenance in `brand-source.json`. `BrandMark`, `BrandLockup`, `HexlyReveal`
and `RedDot` are the shared primitives. Project colors and logos retain their
catalogue provenance; the templates do not recolor the Hexly family around each
project. Screenshots are contain-fit and optional.

Launch uses asymmetric paper cards; Studio adds restrained depth; Editorial adds
folio and figure structure; Pulse emphasizes sourced facts; Essential removes
secondary framing and centers a short statement. Density, composition and pace
change; the brand language does not. Studio's three cuboids may move in depth,
while official/project logo artwork remains on an independent front-facing panel.

Logo reveals follow one sequence: official mark alone at the center; at 1.25s
it moves left while the complete wordmark is exposed over 1.05s; at 2.5s the
caption begins to appear. The whole lockup finishes centered. LogoReveal and
Outro both use this primitive. Normal films can choose either closing component;
the standard sampler demonstrates both.

Reduced motion shows settled composition states with no spatial transition.
Deck always uses these settled states. The online player starts paused, follows
`prefers-reduced-motion`, provides explicit play/seek and scene navigation, and
keeps scene text in accessible DOM outside the film. Browser previews are not
final renders; standard sample downloads are labeled separately from the selected
project's configurable preview.

## Ownership and static boundary

```text
packages/video-kit/            shared brand, scenes, schema, player, offline renderer
src/model/videos.ts            one catalogue-to-project adapter
src/data/videos.json           public template/project metadata manifest
src/components/Videos.tsx      library and project/template selection
public/video-assets/           reviewed hash-named WebP/MP4/PPTX/PDF only
docs/video-kit/1.0.0/           small visual regression/reference evidence
.video-work/                   ignored project render inputs
packages/video-kit/outputs/    ignored full renders
packages/video-kit/.cache/     ignored Remotion cache
```

`scripts/video-site-assets.ts` validates and emits public schemas/manifest and
licensed fonts. It does not copy source production folders. `video:assets`
publishes only four reviewed file types per template; `video:check` verifies
hashes, byte budgets and the absence of undeclared files. Public assets use
immutable versioned/hash paths; manifest and schema routes revalidate. No D1,
Cron, queue, server rendering or new paid service is needed for the Video Kit.

The separate status capability retains its existing D1 and five-minute Cron.
Adding a monitored website updates only its existing catalogue record; it also
becomes available to the single video project adapter automatically.

## Change and acceptance

1. Review the live Git state and neighboring agents before edits. Preserve an
   unknown or concurrent change; do not reset, stash or overwrite it.
2. Change generic kit code independently of any product's production. Pin kit and
   asset versions; consumers pin a published repository SHA.
3. Validate types, schemas, manifest and representative interactions. Render one
   representative film for each changed template and inspect decoded MP4 frames,
   scene contact sheets, actual PPTX pages/notes and PDF page count. Compare them
   with the site and the [1.0.0 reference](video-kit/1.0.0/review.md).
4. Complete the existing lint/build/quality gates and atomic commits. Publish via
   the normal site release; verify production routes, assets and Video/Deck with
   project selection on desktop and mobile before reporting the published SHA.

The Hermes handoff is limited to the published package/API and public library.
Hermes scripts, voices, narration, custom scenes, production logs and final
videos stay in its own production archive. `manifest.projects` can later link a
separately approved finished project; the initial five-template release leaves
that list empty.
