# Firefly 10 — A small light, safely framed

The owner selected this native 2048 × 2048 source and authorized finishing, source-logo replacement, and publication. The subsequent correction asks for more room inside the rounded icon. The accepted drawing is unchanged: a broad-winged faceted firefly with two visible eyes, a honey-gold abdomen, and a much smaller tactile fire on two crossed logs at lower left.

## Generation and approval

One Azure Foundry `gpt-image-2` call returned this study in 133.38 seconds. No retry or additional model call was used for finishing. The owner JPEG leads four ordered references. The exact output was shown immediately, before any processing; [raw-review.json](raw-review.json) records the selection.

- Request ID: `bbbf161b-5c82-44f5-8b7b-3697e1776308`.
- Raw SHA-256: `384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25`.
- Native size: 2048 × 2048; untouched PNG: 2,337,353 bytes.
- [Exact prompt](prompt.txt), [request](request.json), [response](response.json), [source and reference provenance](sources.json).

The raw image has a near-white matte and narrow wing-tip margins. A small gap separates the flame from the lower wing; the selected drawing does not have the slight overlap originally requested. Preserve this accepted relationship.

## Finishing history

| Pass | Result |
|---|---|
| 01 | Extracted the near-white matte and placed the complete group at 84%. First rounded-safety verification passed. Two light masks selected valid pixels, but an incorrect assumption about Sharp raw channel count produced empty emission layers. This immutable diagnostic pass is superseded. |
| 02 | Corrected the light-layer channel extraction and added nonempty-render validation. Foreground, white master, positioning, shadows, and night geometry are otherwise unchanged. This is the selected delivery. |

The [recipe](presentation.json) records the sampled matte, two light masks, their native positions and radii, light colors/opacity/blend, two contact shadows, the unique night pattern, and the 84% centered placement. Every finishing pass preserves its exact tool snapshot, settings, masks, layers, exports, previews, and checksum manifest.

The untouched source and unscaled `extracted-foreground.png` remain available. The same padded placement is used in transparent, white, square, rounded, and all size exports. The firefly/fire proportions do not change. The visible foreground bounds are `(209, 259)` through `(1828, 1751)` on a 2048-square canvas. With a corner radius of 23% and visible-alpha threshold of 16, nearest rounded-edge clearance is **157.28 px**, exceeding the required 128 px. **No visible foreground pixels are clipped.**

The dark field uses base `#10282E`, light `#203F49`, shade `#08161D`, and motif `#5C7B88` at 0.22 opacity. An offset crescent, sparse four-point stars, and quiet cloud contours distinguish Firefly from Frogie's curves and Pew's retained stripes. Warm emission is composited behind the insect and flame; the transparent master contains no external glow.

## Verification and delivery

[Machine-readable finishing checks](checks/finishing-02.json) verify 1,454,331 fully opaque native pixels with **zero RGB changes**, all 30 transparent/square/rounded size exports, nonempty final light layers, and identical transparent/white bytes between passes 01 and 02. Pale wings and antialiased boundaries were inspected on both light and dark backgrounds.

[palette.json](palette.json) records native coordinates and the source hash for every foreground sample. The designed night colors and existing blog UI primary `#3C83F6` are separate evidence. Full-size artwork retains facets, eyes, and wood detail. At 24–32 px the broad wings, amber abdomen, and small fire carry the identity; at 16 px individual eyes, legs, and wood grain are no longer reliably legible.

Delivery includes all transparent/square/rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px, the pure-white master, complete layers, [static review](review.html), and [catalogue review](https://index.dev.hexly.ai/logos/firefly). Source adoption is recorded at Firefly commit `10793b5`, including its root logo, square/rounded masters, 24/80 px application marks, app metadata images, and verified 16/32/48 px ICO. The configured blue LZ site monogram and the Journal theme four-square mark are separate personal identities. Production verification is recorded after deployment. Historical images and Pew finishing 04 are preserved.
