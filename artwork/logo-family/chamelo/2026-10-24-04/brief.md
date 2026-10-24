# Chamelo chameleon head — mural close-up

Study `2026-10-24-03` established the accepted direction: a chameleon painted as
an ancient-imagined auspicious beast in Dunhuang mural language. The owner kept
the style and asked for the head alone:

> 仅保留头部特写，偏心布局处理，注意细节

## Direction

- Subject: the same beast's head, close up — long crested skull, turret eye,
  scaled cheek, jaw and neck entry, ornaments at the crest. No full body, no
  clawed feet, no spiral tail.
- Drawing: unchanged Dunhuang mural language — mineral pigments (石青 azurite,
  石绿 malachite, 朱砂 cinnabar, ochre, gold leaf), fine dark ink outlines, pigment
  granulation and weathered flecks, scrolling cloud and ribbon accents.
- Detail level: high. The head must carry the ink-outline drawing, scale pattern,
  gold-leaf accents and pigment texture at native 2048, and keep a clear
  silhouette at 64 px.
- Composition: strongly off-center, head entering the frame with generous empty
  space opposite it. One or two silk ribbons may leave the crest into that space;
  no surrounding cloud field.

## References

| # | File | Role |
|---|---|---|
| 1 | `input/study-03-raw.png` (sha256 `0e919fed…`) | The accepted beast design, mural palette and ink-outline detail; framing changes to head only |
| 2 | `input/dunhuang-original.png` (sha256 `089ca4f5…`) | Project's first-edition artwork for pigment material only |

## Request

- Model: `gpt-image-2.5-sunburst` via the Azure edits route.
- Source mode: `isolated-white`; one native 2048 × 2048 painting on uniform white.
  The sand plaster field and grain are added in finishing.
- Exact-byte owner acceptance remains required at the raw checkpoint.
