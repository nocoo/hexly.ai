# Basalt marble and candy color study

The owner likes Basalt's corner-tower shape but finds the obsidian palette too dark. The September 8 correction preserves the tiered roofs, swept eaves, finial, low square foundation and shallow three-quarter camera. White Hanbaiyu marble replaces the foundation and balustrade; blue and green roofs, pink columns, pearl structure and yellow-gold detail brighten the architecture.

## Existing project palette

The reference comes from Basalt's actual `ACCENT_SWATCHES` and CSS tokens at local revision `53df43d64d9514bd42a6f1999c4ff369afaa99cb`. The library describes these as iMac / iPhone 5C-inspired candy finishes.

| Light control swatch | CSS HSL | Converted sRGB | Architectural role |
| --- | --- | --- | --- |
| Blue | `204 88% 62%` | `#49aff3` | Main roof color |
| Pink | `345 88% 72%` | `#f67998` | Columns and small panels |
| Green | `113 58% 62%` | `#73d666` | Coherent roof sections |
| Yellow | `49 100% 69%` | `#ffe261` | Finial and fine trim |
| Pearl | `210 20% 87%` | `#d7dee4` | Light structural separators |

Blue, Pink, Green and Yellow also match the fixed light-theme chart colors. Pearl is the pale control color; chart gray remains a separate darker token. Basalt's semantic UI primary `#0a6099` is unchanged. [Source snapshots and conversion evidence](../artwork/logo-family/basalt/2026-09-08-01/palette-reference.json) distinguish these reference paints from the [actual native artwork samples](../artwork/logo-family/basalt/2026-09-08-01/palette.json), which include physical shading.

## Production and presentation

One Azure gpt-image-2 call returned a native 2048 × 2048 image. The continuing Basalt batch waiver delegates intermediate acceptance; [the decision](../artwork/logo-family/basalt/2026-09-08-01/raw-review.json) names the exact raw hash and records `ownerReviewedExactBytes: false`.

Finishing `01` preserves opaque white marble through exterior-connected extraction and a measured protection polygon over its bright left bevel. Only exposed rear-rail background patches are seeded. The entire tower is uniformly placed at 80%, giving 219.5 px minimum clearance against the actual 23% rounded boundary at alpha ≥16, with zero clipped foreground pixels. The existing champagne construction grid, fine grain and projected hover shadows remain independent layers.

The archive includes transparent, square and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24 and 16 px, plus a pure-white master. At favicon size the blue-and-green roof silhouette carries recognition; window lattice, marble veining and gold beads simplify. The pale base softens on a light interface.

## Local delivery

- [Vite before/after page](https://index.dev.hexly.ai/logos/basalt)
- [Complete static review](../artwork/logo-family/basalt/2026-09-08-01/review.html)
- [Project profile](profiles/36-basalt.md)
- [Selected study and source status](../artwork/logo-family/basalt/2026-09-08-01/selection.json)
- [Frozen finishing archive](../artwork/logo-family/basalt/2026-09-08-01/finishing/01/manifest.json)

Both pages compare the previously adopted dark tower with the new color study, preserving Icon/Transparent/White modes, both themes, real small-size specimens, palette copying and master downloads. Reference boards and source attribution remain in Git and static HTML.

The active local family record is `review` and retains its Refined badge. Basalt's source repository still uses the previously adopted obsidian tower; source provenance, old public archives and earlier adoption records remain intact. This correction includes no source replacement, push or deployment. The owner will verify the pages manually. Standalone build, test, browser and asset checks are omitted; normal commit hooks remain enabled.
