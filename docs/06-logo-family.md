# Animal logo family

Frogie study 01, finishing 02, was approved and adopted on 2026-09-06. Pew study 01 is ready for review. The drawing language is a recognizable animal built from connected, flat color facets, with one dominant color family and a restrained multicolored accent.

## Reading the references

The owner's `ref01.jpeg` and `ref02.jpeg` are archived in [the workshop](../artwork/logo-family/references/). They guide presentation; Frogie's original artwork guides its anatomy and drawing.

| Element | Observation | Family direction |
|---|---|---|
| Background | Animals sit in a related color field: gray on warm gray, white on ice blue, pink on blush, orange on peach. Lightness separates the subject from the tile. | Choose a quieter relative of the animal's dominant hue. Record proposed colors separately from existing project tokens. |
| Composition | Faces sit to one side, animals enter from an edge, and some heads rise from the bottom. Empty space balances their gaze and body weight. | Give every animal an intentional position. Retain approved compositions; use decoration as a counterweight. |
| Material | Broad soft illumination, matte surfaces, restrained highlights, shallow contact shadows, and barely visible background motifs. | Express animal volume through flat facets. Add quiet surface detail and soft separation from the background in the presentation layer. |
| Hierarchy | One expression dominates. Background ornament has very little contrast; limbs and accessories support the face. | Keep facial features readable and control facet density. Use fewer, larger planes where they improve recognition. |

Measured empty-background patches from `ref02.jpeg` are warm gray `#ACA59F`, ice blue `#EDF1F8`, blush `#FBCED3`, golden yellow `#FBC96A`, and peach `#FCAE8A`. These are JPEG sample averages, not recovered design tokens. Native coordinates and the sampling method are saved in [background-samples.json](../artwork/logo-family/references/background-samples.json).

## Drawing rules

- Build the animal from contiguous irregular polygons and triangles with clean shared edges. Flat colors within each plane describe volume through differences in hue and lightness.
- Preserve a clear dominant hue. Place multicolored fragments in a limited accent such as Frogie's musical notes or Pew's tongue.
- Keep the face primary: larger planes across broad surfaces, smaller planes only where expression and anatomy need them.
- Use a consistent light direction and restrained highlights. Quiet tactile detail must leave the color planes legible at small sizes.
- Large animals use head portraits. Small animals may use compact full-body poses.
- Large portraits may enter naturally from a square frame's bottom or side. Let the neck and shoulders continue beyond the canvas; keep the face and expression intact. Do not terminate the neck with a circular medallion or a floating round cut. Keep important features clear of the final rounded corners, and distinguish intentional canvas-edge entry from accidental clipping.
- For an approved logo, preserve the animal, pose, camera, expression, composition, and signature decoration. For a logo the owner explicitly dislikes, preserve the animal and redesign the camera, framing, pose, and decoration.

## Frogie study 01

The [first study](../artwork/logo-family/frogie/2026-09-06-01/brief.md) preserves the compact seated green frog, gentle three-quarter turn, open singing mouth, folded hind legs, planted forelegs, pale-yellow belly, and music notes rising toward the upper right. The body carries the lower-left visual weight; the notes balance it diagonally.

The adopted sage tile starts at `#DCE6CA`, a quieter relative of the artwork's yellow-green, distinct from the existing Frogie site primary `#21C45D`. The transparent foreground is the source repository's root `logo.png`; square and rounded masters live in its `assets/brand/`. The previous original retains its original path and hash in this repository. The promoted version, theme colors, sampled art colors, and source revision are recorded in [Frogie's project profile](profiles/01-frogie.md).

## Generation and finishing

1. Save the brief, exact prompt, and ordered reference roles before requesting an image. The original defines identity. For the first Frogie study, images 2 and 3 were presentation references. Subsequent studies use the approved Frogie as image 2 for drawing language, followed by the two presentation references.
2. Use Azure Foundry / OpenAI v1 with `gpt-image-2`, the existing workflow `azure-gpt-image-cover` skill's `api-key` authentication, and credentials loaded through direnv.
3. Request one high-quality 2048 × 2048 PNG on uniform pure white. The reference-guided request uses `/images/edits`. Verify the decoded dimensions; do not describe an upscale as native generation.
4. Preserve the returned PNG bytes, prompt, reference hashes, sanitized request, response metadata, request ID, and usage. Never save a key or authenticated headers.
5. Remove white locally. Preserve enclosed white eye highlights, disconnected music notes, fine edges, and all source colors. Save the alpha mask and the parameters used for edge finishing.
6. Compose the colored tile and soft shadows separately. Keep a transparent foreground master, a full square icon, and rounded presentation exports. Preserve intermediate layers.
7. Review the original and candidate together at artwork, app-icon, sidebar, and favicon sizes, on both light and dark backgrounds. Record actual limitations before promotion.

The [official image guide](https://developers.openai.com/api/docs/guides/image-generation), checked on 2026-09-06, allows 2048 × 2048 for `gpt-image-2`. It documents multiples of 16, a maximum edge of 3840, a maximum area of 8,294,400 pixels, and an aspect ratio up to 3:1. High input fidelity is automatic; native transparent output is not supported by this model. White-background extraction is therefore a separate finishing step.

## Pew study 01

The [Pew candidate](../artwork/logo-family/pew/2026-09-06-01/notes.md) preserves the liked zebra, wink, ivory/charcoal stripes, and rainbow tongue. Its continuous neck enters from the bottom and right canvas boundaries. The face and ears remain clear of the final rounded corners. This replaces the old circular neck termination with a natural portrait entering the frame.

One native 2048 × 2048 generation and two extraction passes are archived. The current pass preserves every fully opaque source color and all sampled pale anatomy; its only component cleanup removes five disconnected residue pixels. The proposed `#E3DEEA` pearl-lilac tile and sampled animal colors stay separate from Pew's current UI primary. The complete review page passed desktop/mobile checks, all presentation modes, light/dark themes, downloads, and accessibility scans. The production Pew logo remains unchanged until selection.

## Archive and promotion

Studies live under `artwork/logo-family/<project>/<date>-<sequence>/`; shared style references and tools live alongside them. Use a new study for every model request and a new numbered finishing directory for every rendering pass. A failed or superseded attempt is still part of the archive.

Numbered finishing directories and sanitized request/response records are frozen generated artifacts, excluded from Biome formatting. `assets:check` verifies every finishing manifest, its source image, and all recorded file hashes. Active tools, mutable recipes, and review pages remain linted. Format a mutable recipe before taking its next snapshot; never rewrite an archived mask, tool snapshot, or settings file to satisfy a formatter.

The workshop is outside `public/` and the production entry graph. Candidates do not automatically become live catalogue assets. After an identity is selected, update its source project, preserved version/provenance, catalogue, derivatives, palettes, and project profile together; follow the GitHub-profile synchronization skill for affected catalogue information.

Adopted identities have a `family` record in `src/data/projects.json`. Their public review resources live under `public/logos/family/<project>/<study>/`: exact approved square/rounded/white masters, untouched generation, prompt, background, and a checksum manifest. Shared references have one public backup. Original foregrounds remain under versioned names in `public/logos/originals/`; previous names are immutable. `assets:build` adds optimized icon, background, and previous-artwork previews; `assets:check` validates both current and historical originals and every public archive file.

The production gallery follows the complete study layout: large original/current comparison, icon/transparent/white views, composition/drawing/material notes, 128/64/32/16 px specimens, real 24 px sidebar and 16 px browser contexts, copyable art colors, separate site theme values, light/dark foreground checks, downloads, exact prompt, and references. Use actual project descriptions in context previews; a singing mascot does not make Frogie a music product.

The reusable workflow skill is `../workflow/agents/skills/zhengli-project-logo/SKILL.md`. Frogie is the first promoted identity; this does not mark the wider three-project replacement phase complete.
