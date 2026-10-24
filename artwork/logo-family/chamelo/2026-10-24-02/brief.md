# Chamelo chameleon head study — mineral palette pass

Study `2026-10-24-01` was rejected by the owner: saturated rainbow facets and
glossy cartoon rendering are not the site's language. The rejection is recorded
in that study's `raw-review.json`; its image stays as history and is not supplied
as an identity reference.

## What the site actually looks like

`https://chamelo.hexly.ai/` (captured 2026-10-24, archived in `input/`) is an
editorial, mineral, low-contrast surface:
- Warm sand paper, cream cards, hairline rules, generous quiet space.
- Dunhuang mineral pigments only: sand `#F3EBDD`, warm sandstone `#E7C8A0`,
  desert gold `#BD985D`, mineral sage `#5D705E`, grotto teal `#2E4640`, quiet
  cinnabar `#9C513B`.
- Large serif Chinese headlines with small letterspaced Latin caps.
- Mural artwork: aged plaster, pigment granulation, soft diffused light.

## Direction for this pass

Owner direction is unchanged: animal series, off-center composition, chameleon,
cute and never scary, connected fragmented flat facets. The only added constraint
is the owner's style correction: use the project's own mineral palette, matte
pigment finish and calm editorial expression instead of rainbow saturation and
glossy 3D cartoon shading.

## References

| #   | File                                                               | Role                                                                   |
| --- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | `public/logos/family/references/ref01.jpeg`                        | Asymmetric composition and breathing room                              |
| 2   | `public/logos/family/references/ref02.jpeg`                        | Asymmetric composition and breathing room                              |
| 3   | `public/logos/family/frogie/2026-09-06-01/icon.png` (finishing 02) | Flat fragmented drawing language only                                  |
| 4   | `input/dunhuang-original.png` (sha256 `089ca4f5…`)                 | Palette and pigment material only; the project's first-edition artwork |

The site screenshot `input/chamelo-home-2026-10-24.png` documents the surrounding
design language in this brief but is not submitted to the model, so the output
cannot inherit UI chrome or typography.

## Request

- Model: `gpt-image-2.5-sunburst` via the Azure edits route.
- Source mode: `isolated-white`; one native 2048 × 2048 image on uniform white,
  no text, background tile, cast shadow or external glow.
- Exact-byte owner acceptance remains required at the raw checkpoint.
