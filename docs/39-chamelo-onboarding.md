# Chamelo onboarding and Dunhuang chameleon identity

Chamelo is a bilingual Chinese-cultural colour atlas: original artwork becomes a
curated palette, a semantic website theme and an agent brief. The owner asked for
catalogue onboarding together with a new identity that left the family drawing
language:

> 放弃我们的风格，保留偏心，取中国文化意象，敦煌风格画一个古人意象里的变色龙

## What the owner rejected, in order

| Study | Direction | Decision |
|---|---|---|
| `2026-10-24-01` | Faceted animal-family head, saturated rainbow | Rejected: does not match the site |
| `2026-10-24-02` | Same drawing, mineral palette | Rejected: family drawing language withdrawn |
| `2026-10-24-03` | Dunhuang mural beast, full body with jewelry and clouds | Rejected for framing |
| `2026-10-24-04` | Head close-up, ornaments and cloud field | Rejected: too dense for a Logo, insufficient negative space |
| `2026-10-24-05` | Head close-up, ornaments removed, roughly half the square empty | Approved and finished |

All four earlier raws stay in their own studies. None is reused as a reference.

## Approved identity

- Series `character`; the beast is painted in Dunhuang mural language — azurite
  crest, malachite cheek band, cinnabar ribbon, gold-leaf flecks, fine ink outlines,
  pigment granulation.
- The head enters diagonally from the left edge as if it had just climbed into the
  viewfinder. The mark covers 36% of the canvas; the other 64% stays empty.
- 2048 × 2048 native PNG, `gpt-image-2.5-sunburst` through Azure OpenAI / Foundry,
  one reference-guided request, exact-byte owner approval recorded.
- Raw SHA-256 `d65019b0…`; foreground SHA-256 `338f4041…`.

## Presentation

A weathered Dunhuang plaster field (`#faf4e7` → `#efe3cb` → `#dcc7a5`) with
project-specific hairline cracks, one lifting plaster edge, three pigment flecks,
paper grain and one soft contact shadow. This is the project's 底纹 and lives in
`presentation.json`; the site's own tokens stay separate.

## Known limits, recorded rather than hidden

- The mark is an intentional edge-entry portrait: bounds touch the left and bottom
  canvas edges, and the rounded tile clips 50 124 pixels on that entry edge
  (−194.4 px rounded-outline clearance). No continuation layer is added.
- 64 px keeps the crest, the ribbon and the eye; at 32 px the mark collapses to a
  two-tone silhouette; at 24/16 px only the crest mass and ribbon direction remain.
  Small marks therefore use the transparent foreground without a tile.

## Catalogue and delivery state

- Category `design`, emoji 🖌️, site `https://chamelo.hexly.ai`, profile entry commit
  `nocoo/nocoo@78a9bce`.
- Previous identity preserved: the designer C arc at `public/favicon.svg`.
- Delivered locally: ten transparent/icon/rounded export sizes, white master,
  static study page, `/logos/chamelo` gallery page, presentation icons pack
  (`/icons/chamelo/v1.0.0`), and the unchanged raw generation.
- Not yet done at the time of writing: source-project adoption, `/api/live`
  coverage, R2 publication, push, release and deployment. Local review comes first.
