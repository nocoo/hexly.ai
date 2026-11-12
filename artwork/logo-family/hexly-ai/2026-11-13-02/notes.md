# Local header review

The owner approved the exact raw image by requesting extraction and placement in the local site's upper-left Logo area. This authorizes a local header review, not a whole-site identity adoption or publication.

## Extraction

- Raw SHA-256: `0199655bb6a6fe470be6df7c0291066b65ceca12090f052f27df02aaa11b4db8`.
- Native canvas: 2048 × 2048. Preserve its placement and proportions.
- Finishing `01` is diagnostic: seeded near-white extraction retained pale cast-shadow remnants inside both cutouts, visible on dark backgrounds. Do not use its foreground.
- Selected finishing `02` uses `foreground-mask.svg`: an exterior contour sampled every two native rows from the warm boundary, with separately inspected Bezier paths for both actual openings. The mask removes the openings' baked backdrop shadows without removing the cream frame or beige insert.
- The shared finisher preserves every fully opaque source RGB pixel. No recoloring, cropping, material redraw or generation occurred in this step.
- White square/rounded outputs are neutral finisher diagnostics, not selected campaign presentations. Only transparent exports are used for this review.
- `inspection/extraction-verification.json` verifies the raw/master hashes, all frozen finishing files, opaque RGB, sample alpha values, placement and the two local serving copies.

## Header integration

`src/components/Icon.tsx` selects the new transparent 128 px image only when Vite development mode and the existing `VITE_LOCAL_MATERIALS=1` preview flag are both active. The image still displays at 36 × 36 CSS pixels, with the original wordmark, typography and 11 px gap. Production builds and test mode retain the currently published mark; the catalogue, favicon, root `logo.png`, Video Kit, profile and social assets remain unchanged.

Local serving paths:

- `public/logos/family/hexly-ai/2026-11-13-02/02/transparent.png`: byte-identical copy of `finishing/02/exports/hexly-ai-transparent-2048.png`.
- `public/logos/family/hexly-ai/2026-11-13-02/02/transparent-128.png`: byte-identical copy of `finishing/02/exports/hexly-ai-transparent-128.png`.

These binaries remain local and ignored by Git. No inventory update, R2 upload, push or release was performed. Fresh checkouts do not yet have a published candidate asset to hydrate.

## Verification

- Four focused unit cases verify the development-only selection and unchanged header dimensions.
- Production build passed; emitted JavaScript contains no candidate-study path.
- `inspection/header-review.json` records actual Chromium checks through `https://index.dev.hexly.ai/`: desktop English and mobile Chinese, both themes, decoded image size, exact downloaded hash, no horizontal overflow and no page errors.
- Screenshots preserve the actual header in all four cases. Full-page light preview and dark/light extraction specimens were visually inspected.
- Chrome was opened at the local Caddy homepage for owner review.

The full HTTP/browser suites and full-history asset hydration were not run for this scoped development-only preview. Complete brand adoption, final presentation selection, both full identity review surfaces and publication remain pending owner direction.

## Owner header feedback

After viewing the actual local header, the owner found the silhouette insufficiently visible against the page background and requested three freer hexagonal directions. This extraction remains a valid archive of the approved raw, but the pale-frame design is not selected for adoption. Studies `2026-11-13-03` through `2026-11-13-05` explore clearer silhouettes; their raw outputs require independent review. The current local header remains unchanged while those directions are generated.
