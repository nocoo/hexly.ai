# Firefly 07 — Second eye required

One Azure Foundry `gpt-image-2` request returned a native 2048 × 2048 PNG in 127.74 seconds. The exact source remains in `raw/generated.png`. No retry or extra generation was made for this study.

## Output and owner feedback

The output closely retains the flight, broad wings, trailing abdomen, tall flame, and two detached flame accents from study 06. The night field and visible external glow are removed. The wing and body planes remain opaque with connected facets and bright internal gold regions. Some facets have been redrawn, and the upper-right wing stays close to the edge.

The owner identified a missing second eye. The source shows only one dark eye, inherited from the earlier single-visible-eye prompt. Study 08 corrects this requirement explicitly while preserving the remainder of the design. The owner feedback is recorded as a rejection for this correction, not an approval to proceed with finishing.

The returned matte is near-white with small pixel variations. Corner and background samples are recorded in [inspection.json](inspection.json); the source is not exact uniform `#FFFFFF`. No extraction or edge cleanup has been attempted.

## Raw evidence

The untouched result was shown immediately and opened in Chrome at [the local raw URL](https://index.dev.hexly.ai/artwork/logo-family/firefly/2026-09-06-07/raw/generated.png). The served bytes match the source exactly.

- Request ID: `8cd30580-977b-44bb-8296-f96ffe261b49`.
- Raw SHA-256: `e80c96c5e5a6e0dfdd416799fed1def6632acebdbdaada6f62d00dea93212a41`.
- Prompt SHA-256: `362312bcf82597355729e22e2dcd31ee52f79c3c1d871c6d7b0dce6416c11d78`.
- Native dimensions: 2048 × 2048; PNG: 2,050,035 bytes.
- Exact request/response: [request.json](request.json), [response.json](response.json).
- Source and decision evidence: [sources.json](sources.json), [raw-review.json](raw-review.json).

No extraction, glow layer, background composition, size export, full review page, or catalogue integration was created. The separate night/light plan remains a proposal. Pew finishing 04 and source-project assets remain unchanged. This round is local only.
