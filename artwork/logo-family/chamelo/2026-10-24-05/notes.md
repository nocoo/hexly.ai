# Chamelo study notes

## Sequence

1. `2026-10-24-01` — faceted animal-family head. Rejected: palette and gloss did not
   match the site.
2. `2026-10-24-02` — same drawing, mineral palette. Rejected: the owner withdrew the
   family drawing language entirely.
3. `2026-10-24-03` — Dunhuang mural chameleon beast, full body. Rejected for framing:
   head close-up only.
4. `2026-10-24-04` — head close-up with jewelry and cloud scrolls. Rejected: too
   dense for a Logo, insufficient negative space.
5. `2026-10-24-05` — head close-up, roughly half the square empty, ornaments removed.
   Approved by the owner ("可以继续") and finished in pass 01.

Only study 05 was finished or integrated. Every earlier raw image stays in its own
study as history and none of them is used as a reference again.

## Extraction

Border-connected near-white removal against `#fcfcfc` with `minimumChannel: 240` and
`maximumChroma: 10`. The pale ochre jaw and neck (minimum channel around 168) stay
opaque. One detached component of a single pixel was removed; 3 532 soft-edge pixels
retain their photographed colour, so subpixel matte contamination is possible.

Foreground coverage is 1 506 639 pixels (36% of the canvas); the remaining 64% stays
empty, which is the approved composition rather than cropped margin.

## Intentional boundary intersections

The mark is an edge-entry portrait. Its native bounds are left 0, top 65, right 1320,
bottom 2047, so the head is cut by the left and bottom canvas edges on purpose. On the
rounded tile this measures −194.4 px of rounded-outline clearance with 50 124 clipped
pixels, concentrated on that entry edge. No contour continuation layer is used: adding
plaster or anatomy beyond the approved drawing would change the composition the owner
accepted.

## Small-size limits

64 px keeps the azurite crest, the cinnabar ribbon and the eye. At 32 px the mark
becomes a two-tone crest-and-ribbon silhouette; gold flecks and scale texture merge.
At 24 and 16 px only the crest mass and the ribbon direction survive. Small marks
therefore use the transparent foreground with no tile, shadow or extra corner mask.

## Presentation

Weathered Dunhuang plaster: a radial sand field (`#faf4e7` → `#efe3cb` → `#dcc7a5`),
hairline drying cracks, one lifting plaster edge, three mineral-pigment flecks, paper
grain (amplitude 0.5, seed 20261024) and a single soft contact shadow. The motif paths
are authored for this project and are not reused by the material series.
