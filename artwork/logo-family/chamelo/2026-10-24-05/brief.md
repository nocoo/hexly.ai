# Chamelo chameleon head — 50% negative space

The owner rejected study `2026-10-24-04` on three counts: too dense for a Logo,
insufficient asymmetry, and too little empty space.

> 这个太复杂，不太适合做logo，偏心不够，精华是留白，50%留白，仿佛动物不小心爬上镜头范围内。重新生成

The direction is now a mark, not an illustration:

- **Half the square is empty.** The head sits in one corner region; roughly 50% of
  the canvas stays bare. Empty space is the subject, not leftover margin.
- **Candid framing.** The head enters diagonally and slightly tilted, as if the
  animal had just climbed into the viewfinder by accident — not a centred badge.
- **Simplified drawing.** Same Dunhuang mural language and beast head, but no
  jewelry, tassels, beads, earrings, cloud field or ornament scatter. Few flat
  mineral pigment shapes, a few fine ink lines, light pigment granulation. At most
  one thin silk ribbon leaves the crest.
- Head, jaw and a short neck entry only. No body, feet or tail.

## References

| # | File | Role |
|---|---|---|
| 1 | `input/study-04-raw.png` (sha256 `25f1ad65…`) | The beast head and mural palette; simplify it and remove every ornament |
| 2 | `input/dunhuang-original.png` (sha256 `089ca4f5…`) | Project's first-edition artwork for pigment material only |

## Request

- Model: `gpt-image-2.5-sunburst` via the Azure edits route.
- Source mode: `isolated-white`; one native 2048 × 2048 painting on uniform white.
- Exact-byte owner acceptance remains required at the raw checkpoint.
