---

name: hexly-birds
description: Draw Hexly bird logo identities for native macOS applications and menu-bar utilities, sharing the animal family's off-center head portrait and flat polygon facets while making the species unmistakable through beak, eye ring, facial marking, crest and paired features. Use when creating or reworking a bird mascot for a Hexly project. Read hexly-logo-pipeline first for generation, approval, finishing, review and adoption.
---

# Hexly birds

Contract: `hexly-logo-pipeline v1`. Read
[the pipeline](../hexly-logo-pipeline/SKILL.md) before starting; it owns
generation, the exact-byte checkpoint, finishing, both review surfaces and
adoption. This file owns only the subject and drawing language.

Native macOS applications, including menu-bar utilities, default to a bird. The
series exists because bird recognition is concentrated in a few small features
that a generic animal brief does not protect.

Birds share the animal family's drawing language and composition. Do not invent a
separate bird style: the difference from [hexly-animal](../hexly-animal/SKILL.md)
is the identification checklist and the prompt's feature line, nothing else.

## Constraints

| Constraint     | Value                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject        | One bird head close-up. No full body in flight, no branch, no nest, no scene                                                                         |
| Mass           | The head occupies roughly 40–55% of the square                                                                                                       |
| Placement      | Enters from one named edge, overlapping it. The centroid sits at least 10% of the edge length off center                                             |
| Negative space | One uninterrupted region of at least a quarter of the square, containing no second subject and no decoration                                         |
| Opposite edge  | The head must not touch the edge opposite its entry; a portrait centred in the canvas is a failed brief                                              |
| Identification | Name the one species-defining feature that must survive, plus the eye treatment that carries expression                                              |
| Drawing        | Connected irregular flat polygon facets with crisp shared edges. No outlines, no smooth 3D bird rendering, no individual feather strands, no texture |
| Matte          | Uniform opaque white, every empty region and canvas edge included                                                                                    |
| Canvas         | One native 2048 × 2048 source                                                                                                                        |

Birds use the same two palette modes as animals: **lively** (default, three to
five clear hues in the bird's own facets) and **restrained** (one muted family
plus exactly one small localized accent). Falcon and Kite are lively; choose
restrained only on an owner request or after a scattered-rainbow rejection.

## Species identity

Pick the features that actually separate species and require them explicitly:

| Feature                  | What to require                                                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Beak                     | Shape and proportion — hook, pouch, spear, spatulate, crossed. It is the strongest species cue; keep it blunt-tipped, never needle-thin |
| Eye ring or facial mask  | The one marking that survives flat facets. Falcon's dark malar stripe, Owl's disc, Raven's dark eye field                               |
| Crest, tuft or ear tufts | One crest maximum; both tufts of a pair must be visible, never one                                                                      |
| Eyebrow or brow ridge    | Only when the species is unreadable without it                                                                                          |
| Plumage accent           | One contrasting region — a collar, nape, cheek or throat patch — not scattered speckles                                                 |

Never specify a beak, marking, crest, accent, lens, eye count or palette that the
species does not have. Never specify a pose, gesture or exact crop angle: the
model chooses those.

## Prompt

Submit this as the complete `prompt.txt`; replace only the bracketed slots.

```text
Create a distinctive [SPECIES] HEAD CLOSE-UP for [PROJECT], in the same logo family as these references: a large expressive head entering the square from [SIDE], balanced by one uninterrupted negative space.

Composition: the head occupies roughly 40-55% of the square and may cross the [SIDE] edge, but it must stay clear of the opposite edge. Keep at least a quarter of the square open, with no second subject and no decoration inside that open area.

Identification: the species must be unmistakable from the head alone through [DEFINING FEATURE]. Keep the beak complete with a blunt rounded tip and give the eye [EYE TREATMENT]. Show both members of any paired feature.

Drawing: connected irregular flat polygon facets with crisp shared edges. No outlines, no smooth three-dimensional bird rendering, no individual feather strands, no surface texture.

Color: [PALETTE].

References: references 1 and 2 guide only the asymmetric composition and breathing room. Reference 3 guides only connected flat fragmentation, not its species, palette or accessories. One native 2048 by 2048 illustration on uniform opaque white, without text, scenery, a background tile or cast shadows. Describe this image as a character illustration, never as a logo, brand mark or app icon.
```

`[PALETTE]` is the same wording as [hexly-animal](../hexly-animal/SKILL.md). A
reference bird may guide composition or facets, never its species or palette.

## Accepted examples

- `artwork/logo-family/falcon/2026-09-25-03/finishing/02/` — left entry, malar
  stripe and hooked beak carry the species
- `artwork/logo-family/kite/2026-09-25-02/finishing/03/` — right entry, the
  mirror of the same direction
- `artwork/logo-family/owl/2026-09-07-01/finishing/01/`
- `artwork/logo-family/raven/2026-09-07-04/finishing/02/`
- `artwork/logo-family/rio/2026-09-20-01/finishing/01/` — macaw, the widest
  palette in the series

Read the actual prompt from the study you use as a model.

## Checks

Beyond the pipeline checks:
- A person familiar with the species identifies it without the project name
- The beak is complete, blunt and unclipped at any canvas edge
- The eye treatment reads at `32 × 32`; a bird whose only expression is a
  highlight fails
- No feather strands, scalloped edges or speckle rows survive into the final art
- Paired tufts, wings or ear tufts are both visible, or the species has none
- Menu-bar marks: the transparent 24 px and 16 px renders are checked on both
  themes, and the source app's menu-bar template variant is updated when present
