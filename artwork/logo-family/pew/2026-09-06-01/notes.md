# Pew study 01 review

Status: **Candidate for review**, finishing **02**. One Azure generation produced the native 2048 × 2048 image. Both finishing passes use those same untouched bytes. Pew's source repository and production catalogue retain the existing logo pending selection.

Open [the complete local review](https://index.dev.hexly.ai/artwork/logo-family/pew/2026-09-06-01/review.html). It includes the original/candidate comparison, three presentation modes, theme switching, actual app/sidebar/favicon specimens, palettes, light/dark edge views, downloads, references, and the exact prompt.

## Identity and framing

The zebra keeps the liked three-quarter view toward the viewer's left, upright ears, viewer-right wink, open far eye, ivory/charcoal stripes, dark muzzle, and small rainbow tongue. Connected flat planes follow the approved Frogie drawing language. The presentation uses a proposed pearl-lilac field, `#E3DEEA`, quiet curved motifs, and shallow matte shadows. Pew's existing UI primary, `#851DED`, remains a separate recorded color.

The neck now continues through the bottom and lower-right canvas boundaries. It does not terminate in an internal circular cut. The larger portrait leans into the square while leaving space toward the upper left. The ears, eyes, muzzle, and tongue remain intact inside the final rounded tile.

The native image itself provides this framing; finishing applies no crop, scale, repositioning, or circular bust mask. On the transparent 2048 master, the top and left borders are empty. The bottom intersects the neck at x=1131–2047; the right edge intersects it at y=1449–2047. The rounded icon masks the continuous neck at the tile corner, with no floating gap. These are intentional anatomical continuations, not lost facial features.

## Generation and extraction

Four ordered references were submitted: the original Pew, the approved Frogie square icon, `ref01.jpeg`, and `ref02.jpeg`. Azure Foundry returned one high-quality `gpt-image-2` image in 139.15 seconds, request ID `fb7cb69d-803e-4c72-9b86-ceb5aa1ba5ed`. The [response archive](response.json) records actual dimensions and usage. The raw SHA-256 is `efa6aff9f478cb56ac3bcb390dc935aa6a6f7b9f56b5e98c7df4a1ea11a2746b`.

Pass 01 used a constrained exterior-white threshold suitable for this ivory animal. A dark-background inspection revealed two disconnected threshold remnants. Pass 02 removed those two components, totaling five native pixels. Both passes preserve settings, tool snapshots, masks, layers, exports, and checksums.

The final master contains 2,068,108 transparent, 9,116 partially transparent, and 2,117,080 opaque pixels. Every fully opaque RGB pixel is identical to the generation. Sampled ivory neck, pale ear, white eye highlight, and rainbow tongue remain fully opaque. The separate white derivative has exact `#FFFFFF` wherever the foreground is fully transparent. [Asset checks](previews/asset-check.json) record the evidence; [palette.json](palette.json) records actual color coordinates and provenance.

## Size and browser review

At 128 and 64 px the face, ears, dark muzzle, and rainbow tongue remain recognizable. At 32 and 24 px the zebra's light/dark pattern carries the identity. At 16 px individual facets and the wink merge into the striped head; the tongue is only a small colored point. No alternate favicon drawing was introduced.

Chromium checked all three modes in both themes at 1440 × 1100, 390 × 844, and 320 × 740: 18 view combinations, no horizontal overflow, no failed image decoding, no console errors, and no failed HTTP responses. Six accessibility scans reported no WCAG A/AA violations. Clipboard copying, prompt loading, all three reference images, and all six downloads passed; downloaded bytes match their archived sources.

## Files

| Artifact | Location |
|---|---|
| Intent and submitted prompt | [brief.md](brief.md), [prompt.txt](prompt.txt) |
| Source identity and API provenance | [sources.json](sources.json), [request.json](request.json), [response.json](response.json) |
| Untouched generation | [raw/generated-white.png](raw/generated-white.png) |
| Transparent master | [pew-transparent-2048.png](finishing/02/exports/pew-transparent-2048.png) |
| Square and rounded masters | [pew-icon-2048.png](finishing/02/exports/pew-icon-2048.png), [pew-rounded-2048.png](finishing/02/exports/pew-rounded-2048.png) |
| Pure-white derivative | [pew-white-2048.png](finishing/02/exports/pew-white-2048.png) |
| Current settings and checksums | [presentation.json](presentation.json), [finishing/02/manifest.json](finishing/02/manifest.json) |
| Earlier extraction | [finishing/01/](finishing/01/) |
| Browser evidence | [browser-check.json](previews/browser-check.json), [comparison.png](previews/comparison.png), [size-contexts.png](previews/size-contexts.png) |
| Original Pew backup | [pew.png](../../../../public/logos/originals/pew.png) |

Each finishing pass includes transparent, square, and rounded exports at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px. Desktop/mobile captures in both themes and the light/dark alpha composites remain in the archive.
