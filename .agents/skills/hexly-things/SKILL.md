---

name: hexly-things
description: Draw Hexly physical-object logo identities for CLI tools, libraries, scripts and agent extensions, choosing one purpose-related object rendered as a believable material product photograph on pure white. Use when creating or reworking a 3D object identity for a Hexly project, or when a project's real function must become a recognisable physical thing. Read hexly-logo-pipeline first for generation, approval, finishing, review and adoption.
---

# Hexly things

Contract: `hexly-logo-pipeline v1`. Read
[the pipeline](../hexly-logo-pipeline/SKILL.md) before starting; it owns
generation, the exact-byte checkpoint, finishing, both review surfaces and
adoption. This file owns only the subject and drawing language.

CLI utilities, scripts, libraries, agent extensions and other tools default to a
physical object rendered in believable 3D. A website or README does not turn a
tool into an animal.

This is a different drawing language, not a different level of finish. Do not
apply the animal series' flat facets, multicolour mascot palette, or its
edge-entry composition. Objects are complete, physically credible and fully
inside the canvas.

## Constraints

| Constraint   | Value                                                                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject      | One object or one close assembly. A second unrelated prop is a failure                                                                                                                                                    |
| Hierarchy    | One dominant mass plus at most one small crafted detail that supports it. The detail is part of the object, not a floating icon                                                                                           |
| Construction | Continuous natural volume, real thickness, complete corners, believable joints and edges                                                                                                                                  |
| Material     | Specific and tactile: woven bookcloth, ivory paper layers, stitched binding, enamel, brass, ceramic, layered paperboard, matte fibre. Never plastic toy, faceted mascot, flat vector badge, voxel or pre-rounded app tile |
| View         | Three-quarter product photography from gently above, roughly 35° elevation with a 75 mm camera analogy. A 25° shelf view is allowed for architecture, which needs its roof line                                           |
| Composition  | The whole silhouette sits inside the square with generous clear margins on every side. A slight offset is fine; cropping any part of the object is not                                                                    |
| Matte        | Absolutely uniform pure white `#FFFFFF` through every empty region and every canvas edge                                                                                                                                  |
| Canvas       | One native 2048 × 2048 source                                                                                                                                                                                             |

Derive the object from how the product is actually used, never from its name. A
tally counter can represent developer activity, a chess clock can represent agent
debate, a reading folio can represent RSS. Signoff is developer and Git activity
analytics, not document signing. Check the repository's real purpose before
choosing.

Permitted: object self-shading, internal contact shading between overlapping
parts, restrained specular highlights on metal and enamel.

Forbidden: ground plane, projected ground shadow, horizon, external glow, haze,
vignette, translucent fringes, gradient backdrop, frame, badge, watermark,
lettering, numbers, mock-up or collage. The background and presentation shadows
are composed separately after approval, so the source must not contain them.

## Prompt

Submit this as the complete `prompt.txt`; replace only the bracketed slots.

```text
Create one sophisticated skeuomorphic three-dimensional logo for [PROJECT], [ONE-LINE REAL PRODUCT PURPOSE]. The identity is ONE [OBJECT], [DISTINGUISHING CONSTRUCTION DETAIL]. [OBJECT] is the main mass; [SMALL DETAIL] is a crafted part of it, not a separate floating prop.

Materials: [MATERIAL LIST]. Physically credible continuous shading, real thickness and tactile surfaces. Elegant and restrained, not a plastic toy, faceted mascot, flat vector badge, voxel object or pre-rounded app tile.

View: a compact three-quarter product-photography view from gently above, approximately 35 degrees elevation with a 75 mm camera analogy, showing [THE SURFACE THAT MUST BE READ]. Let the model choose the most graceful angle and overlap.

Composition: the complete object stays inside the square with generous clean margins around every corner; never crop it, and do not centre it on an edge-entry composition. One coherent object, no scenery and no extra props.

Return one native 2048 by 2048 high-quality PNG on absolutely uniform pure white RGB 255,255,255 through every empty region and every canvas edge. All object surfaces are opaque, with clear physical contours separating pale surfaces from the white matte. Object self-shading and internal contact shading are allowed. No floor, cast shadow outside the object, vignette, gray halo, external glow, haze or translucent fringes. No text, letters, digits, wordmark, watermark, badge, background tile, collage or mockup. Describe this image as a product photograph, never as a logo, brand mark or app icon.
```

When the object is pale (ivory paper, white ceramic, cream card), keep the
contour sentence: a white object on a white matte is the main extraction risk in
this series.

## Accepted examples

- `artwork/logo-family/sleepy/2026-10-09-02/finishing/04/` — clothbound book with
  a brass crescent as a reading detail
- `artwork/logo-family/zoo/2026-10-10-01/finishing/01/` — layered paperboard
  picture cards, pale faces on white
- `artwork/logo-family/hexly-ai/2026-10-18-02/finishing/01/` — six-triangle
  terracotta ceramic hexagon
- `artwork/logo-family/dotty/2026-09-07-01/finishing/01/` — checker ceramic
  block
- `artwork/logo-family/basalt/2026-09-08-01/finishing/01/` — Forbidden City
  corner tower, the shallow 25° view

Read the actual prompt from the study you use as a model.

## Checks

Beyond the pipeline checks:
- The object is physically buildable: no impossible joints, floating parts or
  ambiguous thickness
- Material reads as the named material at 512 px and does not degrade to plastic
- The pale surfaces are still fully opaque after extraction; no hole was punched
  through ivory paper or white ceramic
- The complete silhouette clears the final rounded outline; record the measured
  clearance and any intentional exception
- No external cast shadow, halo or fringe was baked into the source
- Prototype recognition: someone can name the object without the project name
- A source logo update does not imply an npm release
