# Frogie study 01 review

Status: **Local contrast review**, finishing **03**. The source project and production catalogue retain the exact finishing **02** adopted on 2026-09-06. One Azure image request was made; all three archived finishing passes use the same native output. The adoption record is below.

Open [the local review page](https://index.dev.hexly.ai/artwork/logo-family/frogie/2026-09-06-01/review.html) with the hexly.ai Vite server running. It contains the original/candidate comparison, icon/transparent/white modes, theme switching, native-size downloads, palette swatches, references, and the full prompt.

The same complete comparison is available at [the Frogie site path](https://index.dev.hexly.ai/logos/frogie), with presentation references kept in the static HTML and Git archive.

## Result

- Azure Foundry / OpenAI v1 returned one `gpt-image-2` high-quality PNG at native **2048 × 2048**. The decoded dimensions match the request. The raw file was not resized or re-encoded.
- The original seated pose, three-quarter camera, prominent eyes, open singing mouth, coral tongue, folded hind legs, planted forelegs, and upper-right musical shapes remain recognizable.
- The color-plane hierarchy is clearer across the forehead and belly. Flat facets carry the volume; the sage tile, subtle curved motifs, fine grain, and shallow shadows provide the presentation's tactile quality.
- The generated background is near-white, with sampled empty areas around RGB 249–253. The raw output is preserved. The exported white derivative uses exact `#FFFFFF` after extraction.
- The adopted pass 02 base background is `#DCE6CA`. The local pass 03 base is `#BBCB9E`; actual foreground samples, coordinates, and the distinction from the existing site primary `#21C45D` are in [palette.json](palette.json).

## Finishing review

Pass 01 preserved enclosed white eye highlights and all musical shapes, but a magnified dark-background inspection exposed small pale remnants around some notes. Pass 02 widened the connected near-white range, included diagonal connections, and refined the two-pixel edge matte. Both masks, settings, layers, exports, and tool versions are retained.

Pass 02's occupied bounds are x=192–1886 and y=157–1928 within the original 2048-square canvas. All toes and musical shapes remain inside the image. No cropping, rescaling, or repositioning was applied to the foreground master. The rounded tile masks only empty corners.

At app and sidebar sizes the frog silhouette, eyes, open mouth, and colorful musical accent remain distinct. At 16 px, facets and individual notes merge; the green silhouette and dark mouth do most of the recognition work. The favicon sample is the full composition reduced directly. A dedicated small-size treatment remains a later design decision.

The main comparison places the unchanged original artwork on the same proposed sage background for a fair presentation comparison. Transparent and white modes expose both illustrations without that tile treatment.

## Background contrast — finishing 03

The local pass deepens the sage field to `#BBCB9E`, with light `#DCE6C6`, shade `#9DAF7D`, and motif `#617B47`. Motif, highlight, and ribbon opacities increase to 0.14, 0.32, and 0.24. The drawing, matte, framing, and shadow settings remain unchanged.

Both the transparent 2048 master and the pure-white derivative are byte-identical to pass 02. The square icon SHA-256 is `d1df7b7901af384a3eed8ccdf326d474159ee766e6384990b4e938f33696b2cc`. [Contrast asset checks](previews/contrast-03/asset-check.json) record the comparison. The new pass is a local preview and does not replace source-project assets.

[Browser verification](previews/contrast-03/browser-check.json) covers 18 static and 18 site view combinations across 1440, 390, and 320 px, both themes, and all presentation modes. Eight additional accessibility scans passed. All 12 downloads across the two surfaces match the archived bytes. Site refresh, copied paths, bilingual status, image decoding, and absence of reference boards on the React page were verified, with no page errors or failed requests. Eight new screenshots retain both surfaces in light/dark desktop/mobile views.

## Files

| Artifact | Location |
|---|---|
| Brief and exact submitted prompt | [brief.md](brief.md), [prompt.txt](prompt.txt) |
| Sanitized API request and response | [request.json](request.json), [response.json](response.json) |
| Untouched native PNG | [raw/generated-white.png](raw/generated-white.png) |
| Current transparent master | [frogie-transparent-2048.png](finishing/03/exports/frogie-transparent-2048.png) |
| Exact white background version | [frogie-white-2048.png](finishing/03/exports/frogie-white-2048.png) |
| Square icon and rounded presentation | [frogie-icon-2048.png](finishing/03/exports/frogie-icon-2048.png), [frogie-rounded-2048.png](finishing/03/exports/frogie-rounded-2048.png) |
| Alpha and composition layers | [finishing/03/](finishing/03/) |
| Settings, tool hash, output hashes | [finishing/03/manifest.json](finishing/03/manifest.json) |
| Browser and asset verification | [browser-check.json](previews/browser-check.json), [asset-check.json](previews/asset-check.json) |
| Local contrast review evidence | [contrast-03/](previews/contrast-03/) |
| Previous finishing passes | [finishing/01/](finishing/01/), [adopted finishing/02/](finishing/02/) |
| Original Frogie backup | [frogie.png](../../../../public/logos/originals/frogie.png) |

Exports include transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 pixels. Light/dark composites and browser captures preserve the review evidence. The full study remains archived after adoption.

## Adoption — 2026-09-06

The owner approved finishing 02. Its exact transparent, square, and rounded masters were promoted to Frogie and the hexly.ai catalogue without regeneration. The original remains at `public/logos/originals/frogie.png`; the new foreground uses `frogie-2026-09-06.png`. The production gallery now follows this full review layout. Context labels use Frogie’s actual AI-agent workspace purpose. Source revision and public checksums are recorded in the generated project profile.
