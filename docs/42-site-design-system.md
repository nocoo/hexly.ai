# Hexly material controls and layout tokens

## Direction and scope

The owner selected the shadow-free two-tone hexagonal identity from
`artwork/logo-family/hexly-ai/2026-11-13-02`, finishing `02`, on 2026-11-13.
Its cream frame, sand-beige inset, brick-red focal area and softly worked edges
set the interface direction: warm, precise and tactile. The original source
and transparent derivatives are unchanged; no new generation was requested.

The site remains a project collection and identity archive, not a component
showcase. Keep the existing content, routes, typography and related-site frame.
Rich project artwork stays prominent; controls reuse the existing homepage
palette, with faint grain, softly worked edges and orange/terracotta highlights.
The owner retained the clean cream-style material and clearer typography, then
specified the actual colors of “Small ideas / A little universe.” rather than
an invented green palette. The final control roles directly reference existing
site tokens: deep headline ink for text, the softer headline green for icons,
and the existing sentence-point accent for selection. No new control hue is
introduced. The Logo, 13 px desktop / 12 px mobile labels, weight 500 and 20 px
line height stay fixed. The selected
Logo has no external shadow or glow.

This pass covers the live React shell, catalogue, logo wall, project tabs and
archives, screenshots/lightbox, API/Agent controls, Templates and status page.
Video Kit's browser controls consume host tokens while keeping standalone
material defaults. Video compositions, frozen historical review documents,
independent product identities and their original textures are not redesigned.

The candidate is selected for the ongoing local VI work. Its material publication
and complete source/catalogue/favicon/Video Kit identity adoption remain separate
from this UI pass; existing production asset selection stays valid until those
immutable materials are published. No R2 upload, push or release is implied.

## Sources of truth

- `src/styles/tokens.css`: spacing, nested radii, controls, responsive shell and
  grid dimensions, and light/dark ceramic surface roles.
- `src/styles/base.css`: existing site palette, fonts, basic controls and shell.
- Feature styles: layout/interaction rules using the shared tokens. Component-local
  fixed spacing must remain on the same scale.
- `src/components/BrandIdentity.tsx`: the same mark and wordmark used by the header and Brand library.
- `src/components/PageHero.tsx` and `src/styles/hero.css`: shared homepage-derived top layout for Projects, Templates, Brand and Status.
- `packages/video-kit/src/site.css`: browser-only host-token integration. Film
  canvas styles and frame geometry remain independent.
- `tests/unit/design-tokens.test.ts`: static spacing and token-ownership guard.
- `tests/browser/design-system.spec.ts`: real control sizes, equal grid gutters,
  page/header/footer alignment, responsive overflow and accessibility.

## Layout contract

| Role | Value |
| --- | --- |
| Spacing step | 4 px; 8 px is the main rhythm |
| Spacing tokens | 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96 px |
| Compact optical adjustment | 1–2 px only; hairlines and focus outlines are not layout spacing |
| Page maximum | 1500 px |
| Page gutters | 32 px desktop, 24 px at ≤1100 px, 16 px at ≤600 px |
| Header | 80 px desktop; 64 + 56 px at ≤1000 px; 64 + 96 px at ≤768 px |
| Page hero | Shared 1.15:1 grid and 544 px minimum desktop height; common title, description and artwork spacing |
| Mark-to-wordmark gap | 4 px, reduced from 11 px |
| Catalogue/card grid gutters | 24 px desktop, 16 px at ≤1100 px |
| Card padding | 20 px desktop, 16 px at ≤1100 px |
| Section rhythm | 48 px desktop, 32 px at ≤600 px |
| Search width | 280 px desktop; fluid in narrow layouts |
| Search/select/control height | 44 px |
| Native select arrow | 16 px, inset 12 px from the right; 40 px text padding |
| Segmented controls | 36 px item + 4 px inset on each side = 44 px |

All native selects use `.control-select`: disable platform chrome, preserve the
native keyboard/menu behavior, and draw the shared inset arrow over the material
background. Project/category/time-zone selects no longer own separate arrow
wrappers. Video Kit uses the same host arrow token and a standalone default.

All pages share `.shell`; feature styles must not redefine page gutter or header
height tokens. Search right edges align with content right edges. Category bars
scroll inside their available grid track instead of calculating a separate
viewport width. Grid cards share equal columns, consistent padding and gutters.
Fluid columns may have fractional widths; alignment means shared track edges,
not rounding individual cards independently.

Only two preserved illustration placements are exempt from the static spacing
check: the independent `zheng li.` footer's `.brand-grid` and the homepage's
`.hero-art` canvas placement. Their optical geometry is not a UI spacing scale.
Artwork percentage insets, line-height ratios and icon geometry are also distinct
from layout margins/padding/gaps.

## Brand page and shared headers

`/brand` owns the VI specimens; Templates is again only its composition library.
The page shows 16/24/32/48/64/96/128/256 px marks, three wordmark treatments, four
backgrounds, readable/copyable Agent instructions and light/dark app-icon forms.
`BrandIdentity` keeps the header and specimens on the same asset selection.

App-icon rounding reuses the immutable
`artwork/icon-texture-review/2026-09-27/ios-style-mask.svg` geometry, inlined by
Vite. It is the existing iOS-style continuous-corner approximation (22.37% radius,
0.6 smoothing), not a certified Apple asset. Square and masked samples are shown
side by side without changing the transparent Logo. Native platform deliveries
must remain opaque, unmasked squares.

The shared hero keeps the homepage's split structure, headline color hierarchy
and mobile reading order. Its desktop type caps at 96 px so the existing English
Templates heading fits two lines, and all four desktop hero sections share a
544 px height. The generated product still lifes and the subsequent
[Three.js study](43-three-hero-objects.md) were both rejected. Neither is active.
The homepage retains its six colorful interactive project Logos and quiet orbit
lines. The other decorative slots remain empty while a new flat editorial
illustration is reviewed, starting with one homepage candidate. Source images
and exact-byte receipts stay archived; the Three.js renderer, controls and
dependencies have been removed. Status observations remain independent of any
decorative illustration.

At narrow/tablet widths the global header gives the four main routes one full
row and the related personal sites another, avoiding overlapping navigation.
Large actual-size specimens span both columns before their full canvas would be
clipped. Browser regression checks include intermediate 601/640 px widths, not
only standard desktop and phone sizes.

## Material and shape

| Role | Light | Dark |
| --- | --- | --- |
| Control face / selection (`--surface`) | `#f8f8f2` | `#27332c` |
| Group field (`--surface-soft`) | `#e8ebdf` | `#26352b` |
| Edge (`--line`) | `#d4d8cb` | `#3d4940` |
| Hover (`--hover`) | `#e2e6d8` | `#344335` |
| Control text (`--ink`, “Small ideas”) | `#30372e` | `#e6e9dc` |
| Secondary icons (`--headline-secondary`, “A little universe”) | `#76816a` | `#a9b59c` |
| Selection point/edge (`--accent`) | `#bf5c3c` | `#e79670` |

Controls retain the faint 0.8% grain and softly lit edge from the cream pass.
There is no blurred gray/black recessed shadow. Both themes resolve through the
original page, surface, line and ink tokens. The existing soft headline colors
were moved from `.outline-word` to `--headline-secondary` without changing their
values or the headline's appearance. They are used for secondary icons, not small
text that would lose contrast. The texture never changes identity bytes or status
semantics. Selected items use a quiet surface step and a 2 px orange/terracotta
inner edge; orange also marks selected navigation icons and the existing brand
point, not large fills. Counters inherit their control foreground so selected-state contrast
stays valid. All foreground roles are tested at 4.5:1 or better against every
control surface in both themes. Inputs retain visible keyboard focus; focus
rings are not decorative glow.

Nested radii are 16 px outside and 12 px inside, separated by the 4 px group
inset. Small tags use 8 px; larger artwork frames use 24 px. The Logo itself is
never masked into these control shapes. It keeps its approved geometry and
transparent canvas.

Space Grotesk, Journey CJK and Geist Mono remain the established type families.
Control labels use the sans family at weight 500 and 20 px line height; compact
counts use the same family at 11/16 px instead of tiny technical monospace.
The brand wordmark and editorial display type retain their existing typography.
The site's paper/forest backgrounds, terracotta accent and semantic status colors
remain authoritative; control colors do not recolor projects or media.

## Verification

Run `bun run verify` after a system change. It checks types, lint, dependencies,
secrets, model coverage, asset integrity, build, Worker dry run, real HTTP and
complete Chromium journeys. The nested-counter contrast regression discovered
while developing the new surfaces is recorded in `Retrospective.md`.
The static color guard requires control roles to reference existing site colors,
then checks every text role against every control surface in both themes, in
addition to the browser accessibility scans.

Local Chromium inspection covers 320, 390, 768, 1024 and 1440 px across the home,
project, template and status routes. The new browser guard additionally checks
logo-wall and composition-workbench grids. Screenshots and measurements are local
review artifacts, not publication evidence.

Review method informed by *unslop*, Damir Sokolovsky (@heydamir), CC BY 4.0.
The existing Hexly identity and this owner's art direction take precedence over
that guide's generic visual recommendations.
