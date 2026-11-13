# Approved extraction and local header integration

## Current selection: superseded

The subsequent Three.js study was also rejected and removed. The next direction starts with one flat editorial homepage candidate in `artwork/site-heroes/2026-11-13-03/`; it remains outside the site pending raw-image approval.

The owner rejected the raster placements and requested newly built Three.js objects. The runtime image component, conditional image/diagram branches and placement CSS were removed. The eight remaining local serving copies under `public/brands/hexly-ai/v1.0.1/headers/` were compared against finishing `02` and removed; all raw images, extracted masters and receipts remain here. No R2 object was uploaded or deleted. The historical approval below remains truthful to the earlier extraction request, not the current site selection.

The owner approved all four exact raw images and requested extraction and local placement, retaining the homepage's original colorful project Logos and allowing a supporting overlay. The four `raw-review.json` records preserve that instruction and their exact hashes. No new image-generation call was made in this step.

## Extraction

The existing square-logo finisher is not used for these native 1536 × 1024 canvases. `finish.mjs` applies the same exterior-connected white-matte approach in a scoped rectangular pipeline using the existing Sharp dependency. It preserves enclosed pale material, including the Brand tray's almost-white center.

- Sampled matte: RGB 252,252,252; candidate minimum channel 247, maximum chroma 7.
- Exterior flood fill only; no global white deletion.
- A two-pixel boundary band uses nearby interior color for alpha matting. Fully opaque output RGB is copied unchanged from the decoded source.
- Disconnected foreground components below 16 pixels are removed as background noise. Every canvas-edge alpha is verified zero, and each object's central solid material remains fully opaque.
- Native canvas, composition and dimensions are retained. The 960 × 640 lossless WebP is a whole-canvas delivery resize, not a crop or native-resolution claim.

Finishing `01` is diagnostic: the Status source left six isolated background pixels. Its source, master, mask and previews remain in the private finishing archive. Its eight unreferenced local serving copies were byte-checked against that archive, then removed before any inventory/upload. Nothing published or original was removed.

Selected finishing `02` writes the native transparent PNG, alpha mask, light/dark inspection plates and delivery WebP for all four pages. `extraction-verification.json` verifies every native opaque pixel against its raw source and confirms the existing Logo is byte-identical. `finishing/02/manifest.json` records source/output hashes and counts; the tool snapshot preserves the executed version. Run the source script only in a fresh pass/workspace: numbered outputs must not be overwritten.

## Placement

Local delivery copies live under `public/brands/hexly-ai/v1.0.1/headers/`. They are an unpublished header-art collection, not a completed identity kit or upload receipt.

- Projects: the archive case is a small non-interactive layer behind the six unchanged colorful project tiles. Original tile geometry, links, hover behavior and keyboard targets stay intact.
- Templates: the three storyboard cards replace the local diagram; a restrained caption uses the actual opening/content/ending counts from the manifest.
- Brand: the tray is a separate image layer. The approved transparent Logo and standard HTML wordmark are overlaid without redrawing or baking them into the picture. Their text uses the established light palette against the permanently light tray, including on the dark site theme.
- Status: the instrument is decorative. The separate caption retains the real demo/live mode, cadence and retention; the illustration never represents current observations.

`HeroArtwork` uses the existing `localMaterials()` boundary. Unpublished images are shown only with Vite development mode and `VITE_LOCAL_MATERIALS=1`. Production/test builds keep the existing visual treatments until publication is authorized, so no missing CDN object is requested. Publishing these named files and then enabling the approved assets for production remains a separate handoff.

## Checks

- Synthetic unit checks cover exterior removal, enclosed pale material, opaque RGB, edge alpha, invalid input and isolated noise.
- Four mode cases verify local artwork selection and production/test isolation.
- Local Chromium checks cover all four pages at 1440/390 px in both themes: complete decoding, exact delivery hashes, transparent corners, opaque central material, no page errors or horizontal overflow, and all six homepage hit targets plus actual navigation.
- `integration-review.json` is the recorded local browser evidence. Screenshots remain in ignored `.test-results/hero-integration-20261113/`.
- No R2 upload, push, release, independent product change or production monitoring operation was performed.
