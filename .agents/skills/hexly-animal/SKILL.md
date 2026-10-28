---

name: hexly-animal
description: Draw Hexly animal logo identities for Web SaaS and browser-first services, with an off-center head portrait, connected flat polygon facets, one dominant mass and deliberate negative space. Use when creating or reworking an animal mascot for a Hexly project, or when deciding whether an animal belongs in the family at all. Read hexly-logo-pipeline first for generation, approval, finishing, review and adoption.
---

# Hexly animal

Contract: `hexly-logo-pipeline v1`. Read
[the pipeline](../hexly-logo-pipeline/SKILL.md) before starting; it owns
generation, the exact-byte checkpoint, finishing, both review surfaces and
adoption. This file owns only the subject and drawing language.

Web SaaS services used primarily in a browser default to an animal. A CLI tool
with a marketing site stays a thing, and a native macOS app is a bird.

## Constraints

State each of these so the model can act on it, and check each one after
generation. Vague praise words are what makes two animal logos look like they
came from different families.

| Constraint     | Value                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject        | One animal head close-up. The head carries the identity; no full body, no scene                                                                    |
| Mass           | The head occupies roughly 40–55% of the square                                                                                                     |
| Placement      | Enters from one named edge, overlapping it. The centroid sits at least 10% of the edge length off center                                           |
| Negative space | One uninterrupted region of at least a quarter of the square, containing no second subject and no decoration                                       |
| Opposite edge  | The head must not touch the edge opposite its entry; a portrait centred in the canvas is a failed brief                                            |
| Drawing        | Connected irregular flat polygon facets with crisp shared edges. No outlines, no smooth 3D animal rendering, no fur or feather strands, no texture |
| Matte          | Uniform opaque white, every empty region and canvas edge included                                                                                  |
| Canvas         | One native 2048 × 2048 source                                                                                                                      |

Palette has exactly two legal modes. Choose one and name it in the brief:
- **Lively (default).** Three to five clear hues belonging to the animal's own
  facets, not to a separate accessory. Frogie, Octo, Falcon and Kite.
- **Restrained.** One dominant muted color family with tonal variation defining
  the facets, plus exactly one small localized accent in a richer contrast. No
  scattered bright patches, no rainbow distribution. Rhino.

Use restrained when the owner asks for discipline or when a previous attempt read
as scattered rainbow patches. Do not invent a third mode.

## Prompt

Submit this as the complete `prompt.txt`; replace only the bracketed slots.

```text
Create a distinctive [SPECIES] HEAD CLOSE-UP for [PROJECT], in the same logo family as these references: a large expressive head entering the square from [SIDE], balanced by one uninterrupted negative space.

Composition: the head occupies roughly 40-55% of the square and may cross the [SIDE] edge, but it must stay clear of the opposite edge. Keep at least a quarter of the square open, with no second subject and no decoration inside that open area.

Drawing: connected irregular flat polygon facets with crisp shared edges. Keep the species unmistakable through the head alone. No outlines, no smooth three-dimensional animal rendering, no fur or feather strands, no surface texture.

Color: [PALETTE].

References: references 1 and 2 guide only the asymmetric composition and breathing room. Reference 3 guides only connected flat fragmentation, not its species, palette or accessories. One native 2048 by 2048 illustration on uniform opaque white, without text, scenery, a background tile or cast shadows. Describe this image as a character illustration, never as a logo, brand mark or app icon.
```

`[PALETTE]` for lively: `a lively multicolor palette of three to five clear hues,
carried by the animal's own facets rather than a separate accessory`.
For restrained: `one dominant muted color family with tonal variation defining the
facets, plus exactly one small localized accent in a richer contrast; no
scattered bright patches, no rainbow distribution`.

References: a liked original first when an identity exists, then
`artwork/logo-family/references/ref01.jpeg` and `ref02.jpeg`. Never submit a reference
whose species, palette or accessory must not be copied without naming that
restriction in the prompt.

## Accepted examples

- `artwork/logo-family/frogie/2026-09-06-01/finishing/03/` — the family drawing
  language; review `prompt.txt` and the finishing recipe together
- `artwork/logo-family/ocelot/2026-09-11-01/finishing/03/`
- `artwork/logo-family/rhino/2026-10-09-03/finishing/02/` — restrained palette
- `artwork/logo-family/octo/2026-10-18-07/finishing/02/` — newest lively run

Paths are relative to the hexly.ai repository root. Read the actual prompt from
the study you are using as a model; do not reconstruct it from this skill.

## Checks

Beyond the pipeline checks:
- Species reads at `32 × 32` from silhouette alone; if a feature dissolves at
  that size, enlarge or delete it
- Fragmentation is visible in the head, not only in an accessory
- The open region is genuinely empty, and the head does not drift to the centre
- Both members of every paired feature are visible and unclipped
- A retained identity keeps its pose, expression, camera and accents unless the
  owner asked for a change; presentation-only work uses the pipeline's
  retained-original route and generates nothing
