# Noheir framing repair

A gentle turn, with the cow continuing naturally beyond the viewfinder.

## Selection and native artwork

- One Azure gpt-image-2 request; native 2048 × 2048. Untouched [generation](raw/generated.png), [exact prompt](prompt.txt), ordered [references](references.json), and sanitized request/response remain immutable.
- The owner explicitly delegated continuation for this four-project batch. [authorization.json](authorization.json) and [raw-review.json](raw-review.json) record the exact decision scope and reviewed image hash; delegated acceptance does not claim that the owner inspected unseen bytes.
- Selected finishing pass: `02`. Earlier diagnostic passes remain preserved.
- Foreground SHA-256: `26d9720f81d6233909a9cffd5a791c62d7d3b46cb37da4875009d7ca875eaeff`.

## Finishing and framing

The transparent, square, rounded, and white masters share one uniform placement. Ten transparent/square/rounded export sizes cover 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px. The exact extraction settings, alpha masks, grain, background geometry, shadows, and tool snapshot are in `finishing/02/`.

Protected feature regions have at least **148.5 px** of clearance from the actual 23% rounded outline at alpha ≥16; none are clipped. Intentional lower shoulder/wing entries are measured separately. A source-sampled continuation layer behind the placed foreground adds 112,615 visible pixels at the shoulder/wing entry and preserves 1,937,041 opaque placed source pixels.

[Framing evidence](verification/framing.json) names every measured region. [Matte evidence](verification/matte.json) records cleanup and checks that all fully opaque extracted pixels retain native RGB. [Palette evidence](palette.json) records native coordinates and source hashes separately from the designed background and product UI theme.

The presentation uses **Quiet terraces**: base `#638783`, light `#a5c2b8`, shade `#3d625f`, motif `#254946`. The approved foreground, background, and contact shadows remain separate.

## Adoption and delivery

The source project contains the selected masters in commit [`5e32426a60`](https://github.com/nocoo/noheir/commit/5e32426a6044436eee5c6b2894910666896a8b49). README uses the rounded presentation; small app and browser marks use the transparent foreground. Touch icons use the square presentation. See [adoption.json](adoption.json), [consumer verification](verification/source-assets.json), and the [batch publication report](../../audits/2026-09-07-framing/source-publication.json).

- [Individual site page](https://hexly.ai/logos/noheir) · [Local site path](https://index.dev.hexly.ai/logos/noheir)
- [Complete static before/after review](review.html)
- [Source usage guide](https://github.com/nocoo/noheir/blob/5e32426a6044436eee5c6b2894910666896a8b49/assets/brand/README.md)

The cream blaze, paired horns, and coral muzzle stay legible at 32 px. Smaller color planes merge at 16 px; transparent marks serve the sidebar and browser, while installed icons use the square presentation.
