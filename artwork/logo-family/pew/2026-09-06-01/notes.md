# Pew study 01 review

Status: **Owner-selected local stripe-motif presentation**, finishing **04**. One Azure generation produced the native 2048 × 2048 image. All four finishing passes use those same untouched bytes. Pew's source repository and production catalogue retain the existing logo pending selection.

Open [the complete local review](https://index.dev.hexly.ai/artwork/logo-family/pew/2026-09-06-01/review.html). It includes the original/candidate comparison, three presentation modes, theme switching, actual app/sidebar/favicon specimens, palettes, light/dark edge views, downloads, references, and the exact prompt.

The same complete before/after comparison is available at [the Pew site path](https://index.dev.hexly.ai/logos/pew), with presentation references kept in the static HTML and Git archive. The site's refined foreground is independent of the preserved original source logo.

## Identity and framing

The zebra keeps the liked three-quarter view toward the viewer's left, upright ears, viewer-right wink, open far eye, ivory/charcoal stripes, dark muzzle, and small rainbow tongue. Connected flat planes follow the approved Frogie drawing language. The tongue is the external interest point, extending into the space beyond the animal's main mass. The first presentation used a proposed pearl-lilac field, `#E3DEEA`; local pass 03 deepens it to `#BFB2CF`. Pass 04 retains that field and the same shallow matte shadows while giving Pew a distinct stripe motif. Pew's existing UI primary, `#851DED`, remains a separate recorded color.

The neck now continues through the bottom and lower-right canvas boundaries. It does not terminate in an internal circular cut. The larger portrait leans into the square while leaving space toward the upper left. The ears, eyes, muzzle, and tongue remain intact inside the final rounded tile.

The native image itself provides this framing; finishing applies no crop, scale, repositioning, or circular bust mask. On the transparent 2048 master, the top and left borders are empty. The bottom intersects the neck at x=1131–2047; the right edge intersects it at y=1449–2047. The rounded icon masks the continuous neck at the tile corner, with no floating gap. These are intentional anatomical continuations, not lost facial features.

## Generation and extraction

Four ordered references were submitted: the original Pew, the approved Frogie square icon, `ref01.jpeg`, and `ref02.jpeg`. Azure Foundry returned one high-quality `gpt-image-2` image in 139.15 seconds, request ID `fb7cb69d-803e-4c72-9b86-ceb5aa1ba5ed`. The [response archive](response.json) records actual dimensions and usage. The raw SHA-256 is `efa6aff9f478cb56ac3bcb390dc935aa6a6f7b9f56b5e98c7df4a1ea11a2746b`.

Pass 01 used a constrained exterior-white threshold suitable for this ivory animal. A dark-background inspection revealed two disconnected threshold remnants. Pass 02 removed those two components, totaling five native pixels. Both passes preserve settings, tool snapshots, masks, layers, exports, and checksums.

The final master contains 2,068,108 transparent, 9,116 partially transparent, and 2,117,080 opaque pixels. Every fully opaque RGB pixel is identical to the generation. Sampled ivory neck, pale ear, white eye highlight, and rainbow tongue remain fully opaque. The separate white derivative has exact `#FFFFFF` wherever the foreground is fully transparent. [Asset checks](previews/asset-check.json) record the evidence; [palette.json](palette.json) records actual color coordinates and provenance.

## Background contrast — finishing 03

The local pass uses base `#BFB2CF`, light `#E0D8E9`, shade `#9F8DB5`, and motif `#6D557F`. Motif, highlight, and ribbon opacities are 0.14, 0.32, and 0.24. The new field gives the ivory portrait stronger separation and makes the curved background layers more visible.

The 2048 transparent master and pure-white derivative remain byte-identical to finishing 02, preserving the pale anatomy, natural edge entry, and all foreground colors. The square icon SHA-256 is `48237907168291cf3b44993ebc18064cf823ea4822874d05b2ec80f2d6e25967`. [Contrast asset checks](previews/contrast-03/asset-check.json) record the comparison. Source-project assets remain unchanged.

[Browser verification](previews/contrast-03/browser-check.json) covers 18 static and 18 site view combinations across 1440, 390, and 320 px, both themes, and all presentation modes. Eight additional accessibility scans passed. All 12 downloads across the two surfaces match the archived bytes. Site refresh, copied paths, bilingual status, image decoding, and absence of reference boards on the React page were verified, with no page errors or failed requests. Eight new screenshots retain both surfaces in light/dark desktop/mobile views.

## Size and browser review

At 128 and 64 px the face, ears, dark muzzle, and rainbow tongue remain recognizable. At 32 and 24 px the zebra's light/dark pattern carries the identity. At 16 px individual facets and the wink merge into the striped head; the tongue is only a small colored point. No alternate favicon drawing was introduced.

Chromium checked all three modes in both themes at 1440 × 1100, 390 × 844, and 320 × 740: 18 view combinations, no horizontal overflow, no failed image decoding, no console errors, and no failed HTTP responses. Six accessibility scans reported no WCAG A/AA violations. Clipboard copying, prompt loading, all three reference images, and all six downloads passed; downloaded bytes match their archived sources.

## Distinct background motif — finishing 04

The owner requested different background texture geometry for every project. Pew now has three tapered stripe ribs fanning through the upper-left negative space, with unequal spacing, fine light edges, and a broader lower stripe. The paths echo its zebra markings and replace the generic curves previously shared with Frogie. The name and exact SVG paths live in `background.pattern` in [presentation.json](presentation.json); [the field comparison](previews/motif-04/backgrounds.png) includes Frogie's preserved curves and Firefly's proposed light orbits.

The base, light, shade, motif, grain, shadow settings, pose, and extraction remain unchanged from pass 03. [Asset checks](previews/motif-04/asset-check.json) confirm byte-identical transparent and pure-white masters. The transparent SHA-256 remains `5c002bb5dcfb31f4db5ca52958e58175ad32bf0a34288828ddf443375b573ecb`; the new square icon SHA-256 is `d3734589bc3d7062c7473421a44570ff7cdd2744a813c756dd2a7eacb4e1f29a`.

[Browser checks](previews/motif-04/browser-check.json) cover 18 static and 18 site view combinations at desktop, mobile, and narrow widths, both themes, and all three artwork modes. Eight accessibility scans and all 12 checksum-verified downloads pass. The before/after comparison, copied `/logos/pew` path, refresh, bilingual review status, and absence of reference boards in the React page were checked, with no overflow, page errors, or failed requests. Eight new screenshots preserve desktop/mobile light/dark views on both surfaces.

The owner explicitly selected this background and asked to keep it; [presentation-review.json](presentation-review.json) records the decision and exact hashes. Source-project adoption and publication remain deferred.

The new raw-image checkpoint does not require regenerating or reapproving this retained foreground for an explicitly requested background-only change. [raw-review.json](raw-review.json) records that scope; pass 04 freezes its own copy. This remains a local preview, not source-project adoption or publication.

## Files

| Artifact | Location |
|---|---|
| Intent and submitted prompt | [brief.md](brief.md), [prompt.txt](prompt.txt) |
| Source identity and API provenance | [sources.json](sources.json), [request.json](request.json), [response.json](response.json) |
| Untouched generation | [raw/generated-white.png](raw/generated-white.png) |
| Transparent master | [pew-transparent-2048.png](finishing/04/exports/pew-transparent-2048.png) |
| Square and rounded masters | [pew-icon-2048.png](finishing/04/exports/pew-icon-2048.png), [pew-rounded-2048.png](finishing/04/exports/pew-rounded-2048.png) |
| Pure-white derivative | [pew-white-2048.png](finishing/04/exports/pew-white-2048.png) |
| Current settings and checksums | [presentation.json](presentation.json), [finishing/04/manifest.json](finishing/04/manifest.json) |
| Earlier extraction and contrast | [finishing/01/](finishing/01/), [finishing/02/](finishing/02/), [finishing/03/](finishing/03/) |
| Browser evidence | [browser-check.json](previews/browser-check.json), [comparison.png](previews/comparison.png), [size-contexts.png](previews/size-contexts.png) |
| Local contrast review evidence | [contrast-03/](previews/contrast-03/) |
| Local motif review evidence | [motif-04/](previews/motif-04/) |
| Original Pew backup | [pew.png](../../../../public/logos/originals/pew.png) |

Each finishing pass includes transparent, square, and rounded exports at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px. Desktop/mobile captures in both themes and the light/dark alpha composites remain in the archive.
