# Octo: reference-guided seahorse head portrait

## Resumed direction

The owner resumed the interrupted identity work on 2026-10-18, described the
previous attempts as very poor, and explicitly requested a seahorse avatar in
the established animal-logo family using GPT Image 2.5. Retain the earlier blue
and cute direction. Generate one new candidate, not a revision of a rejected
image. No source adoption, finishing, R2 publication or site release is requested.

Study 06 is the previous breakpoint, at Hexly commit
`2cc012641408a1bf32157271645bcdb1b6f32e78`. Its untouched 1248 x 832 JPEG is a
softly rendered underwater scene with substantial torso rather than a faceted
head avatar. Studies 01-05 were explicitly rejected. Their requests used the
built-in image tool with `model: null`; they do not prove GPT Image 2.5 execution.
Preserve all earlier raw files and decision history.

## Visual study

Individually inspected the adopted Noheir, Pew, Frogie, Falcon and Kite images,
the two original composition boards, and Octo studies 05 and 06.

- Noheir and Pew use expressive close portraits with connected neck anatomy
  entering from an edge; negative space has direction rather than equal margins.
- Falcon and Kite keep a species-specific head dominant, with irregular flat
  facets continuing through facial features and larger supporting planes.
- Frogie establishes crisp, shared polygon edges and playful color. This is not
  smooth 3D shading, a contour-only cartoon, or disconnected decorative shards.
- The original boards explain asymmetry and breathing room, not the final
  drawing technique. The family presentation backgrounds are separate finishing
  layers and are not part of this new white-source request.
- Octo 05 resembles a simple cartoon sticker with broad curved areas and a
  generic face. Octo 06 loses the connected facets and square portrait entirely.

## Reference and prompt choices

Submit only Noheir's adopted white portrait and Falcon's accepted raw portrait,
in that order. Together they demonstrate gentle expression, head-led framing
and connected facets without introducing a textured tile or underwater scene.
Their species, anatomy, palette and expression are not identity constraints.
Do not submit Hooky, rejected Octo artwork or the smooth presentation boards.
Frogie is inspected as the drawing baseline but not submitted, avoiding the
amphibian contamination documented in Octo 01.

Keep the submitted prompt short. State seahorse, head portrait, blue, graceful
character, off-center framing and connected flat facets; leave the angle,
gesture and accent placement to the model. Do not prescribe anatomy ratios,
facial-feature counts, crop coordinates or accessories. Shortening the prompt
must not delete the family style or stop supplying actual visual references.

## Execution and checkpoint

Use the existing `tools/generate_azure.py` helper with the explicit Azure
deployment `gpt-image-2.5-sunburst`, ordered image inputs, high quality and one
2048 x 2048 opaque PNG. Credentials come from Workflow's direnv environment.
Record request, reference hashes, returned dimensions, image hash and response
metadata; keep the returned image bytes unchanged. Never silently substitute
another model or retry a paid request.

Show the raw result immediately. Its exact-byte review remains pending until
the owner decides. No extraction, cropping, recoloring, resizing, background
composition, catalogue integration or publication before that decision.

The Falcon quick-decision service was attempted once and returned a connection
failure, so it supplied no advice. The controller proceeds locally because the
work is one visual judgment and one existing-helper call, with no useful
independent implementation task to delegate.
