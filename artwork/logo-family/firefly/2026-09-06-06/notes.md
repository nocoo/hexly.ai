# Firefly 06 — Raw flight-and-flame review

One Azure Foundry `gpt-image-2` request returned a native 2048 × 2048 image in 167.37 seconds. The untouched response is preserved in `raw/generated.png`. No retry or second generation was made in this study.

## Actual image

The owner reference's hovering action is recognizable: one firefly faces toward the upper right, its wings fan across the canvas, its luminous abdomen trails downward and right, and a separate flame rises behind its left shoulder. Broad overlapping wings, flame, and abdomen make a substantially larger combined mark than the supplied reference. The head has a small dark eye and no smile; prominent hooked legs are absent.

Connected polygons cover the head, thorax, abdomen, and wings, with broad warm bronze and gold groups. Champagne wings carry restrained teal and violet planes at their edges. The background is a dark blue-green field with a shallow crescent, small stars, and several cloud contours. Square pixel drawing, thick pixel outlines, and the reference's dense field of sparks are absent.

The tall flame is still quite angular and somewhat crystalline. Its tip and the upper-right wing leave less margin than requested, and the background contains more star marks and cloud contours than the proposed minimum. These are inspection observations, not an owner selection. Favicon and sidebar readability have not been tested at this raw stage.

## Checkpoint and evidence

The exact output was displayed immediately and opened in Chrome at [the local raw URL](https://index.dev.hexly.ai/artwork/logo-family/firefly/2026-09-06-06/raw/generated.png). The owner was asked to confirm this exact image before post-processing. The local URL serves byte-identical PNG content. The owner subsequently described this direction as an improvement and requested a clean white-background source, with the night setting and emitted glow handled separately. Study 07 uses these exact bytes as its edit reference. The integrated image has not been approved for finishing or adoption; its review record preserves the directional feedback in [raw-review.json](raw-review.json).

- Request ID: `17126984-6b28-4874-afff-6f4120949d6d`.
- Raw SHA-256: `0c3ac8c03e04ec6625f7a9c0c950e2da158457279fd9c719936dd3bec641c406`.
- Prompt SHA-256: `e317640f9675cf7a2e3c446b0d8d7ffb4c6225d9c2b5706935ad1dc14f53535d`.
- Native dimensions: 2048 × 2048; untouched PNG: 4,978,452 bytes.
- Exact prompt: [prompt.txt](prompt.txt).
- Source/reference evidence: [sources.json](sources.json).
- Sanitized transport records: [request.json](request.json), [response.json](response.json).
- Raw-stage inspection: [inspection.json](inspection.json).

There has been no extraction, cleanup, resize, new composite, full review HTML, or catalogue integration. The generated night field and emitted light are integrated into one image; they are not independently extracted layers. Existing Firefly website colors and source logos remain unchanged. Pew finishing 04 remains intact. This round is local only.
