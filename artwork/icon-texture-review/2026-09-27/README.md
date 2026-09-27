# Existing artwork with approved textures

Owner request: three examples from each of the animal, bird and material series
in one HTML review. This is a local presentation study, not catalogue adoption,
source-repository adoption or publication. No image-generation calls are made.

Run `node artwork/icon-texture-review/2026-09-27/compose.mjs` from the repository
root after hydrating the referenced sources. Open
<https://index.dev.hexly.ai/artwork/icon-texture-review/2026-09-27/review.html>.
The existing Vite server serves the workbench directly, outside deployed assets.

The selected native 2048-square transparent foregrounds remain unchanged in
color, position and scale. Each approved 1024-square light texture is resampled
to the native foreground canvas, placed at 70% over Hexly paper, then covered
by the original foreground. No banner gradient, extra shadow, glow, recoloring,
extraction or generated detail is added. The square and masked native PNGs are
independent review derivatives. Display WebPs are lossless 512px resamplings.

The mask uses Figma's cubic/arc continuous-corner construction at radius ratio
0.2237 and smoothing 0.6, based on the published corner-smoothing geometry:
<https://www.figma.com/blog/desperately-seeking-squircles/> and the inspected
<https://github.com/phamfoo/figma-squircle/blob/main/src/draw.ts> implementation.
It is an iOS-style approximation, not an extracted or certified Apple asset.
Unlike a simple rounded rectangle, straight edges transition through cubic
curves before meeting the circular corner section. Actual iOS delivery uses
the unmasked square; the platform supplies its own final shape.

`manifest.json` records input/output hashes, exact original opaque RGB checks,
unchanged placement and outline-intersection counts. Existing busts may enter
the bottom or side of the outline; inspect heads, ears, horns and accents before
adoption. The HTML compares the existing rounded presentation with the new
composition and provides 32/64/96px previews, both page themes and native zoom.
All binary derivatives are ignored by Git and remain outside deployment/R2.

Validation: all nine sources passed native opaque-foreground RGB comparisons;
the complete compositions and outline intersections were visually inspected.
Browser checks passed at 1440/390/320px in both page themes (54 project cases),
including actual 32/64/96px display widths, 18 native zooms, keyboard dismissal,
zero overflow/page errors and a byte-identical native PNG download. Evidence is
in `browser-review.json`. Focused Biome checks and normal commit hooks passed.
The current application is unchanged; this study does not replace a project
asset or retire a local/R2 resource before owner review.
