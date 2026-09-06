# Firefly 04 — Raw character awaiting confirmation

One Azure Foundry `gpt-image-2` request returned a native 2048 × 2048 PNG in 144.03 seconds. The exact returned bytes are preserved in `raw/generated-white.png`. There was no retry or extra generation in this study.

## Observed character

The new drawing replaces the large eye discs and hooked anatomy with crescent eyes, a small smile, rounded limb hints, and gently curved antennae. Its broad head, short body, and petal-like wings overlap into a substantial graphic character. A small rounded forelimb gestures beneath one separate flame beside its face.

Connected flat facets cover the main surfaces. Jade, mint, and yellow-green planes establish the brighter character, with a golden tail, a controlled multicolored wing seam, and blue/violet accents at the flame's base. Firefly recognition now relies on a few cues: antennae, wings, and tail light. The wings are deliberately abstract, not a detailed anatomical beetle study. No sidebar, favicon, or background-separation tests have been performed before the raw decision.

## Evidence and checkpoint

- Request ID: `8b5d8b54-5830-4428-aa41-9f66dc5bb96f`.
- Raw SHA-256: `ee53f18b46c419f13d8a3ba11f72bb92cf671791d8c8594e43afd875f4c6164b`.
- Prompt SHA-256: `b3a957982532fafc26e5ab134cf9da25ce6f73c78ca699ca8a73d7e0e2fb5e31`.
- Exact request and native response metadata: [request.json](request.json), [response.json](response.json).
- Ordered reference roles and hashes: [sources.json](sources.json).
- Owner decision: `pending` in [raw-review.json](raw-review.json), bound to these exact bytes.

The untouched output was displayed immediately and opened in Chrome at [the local raw path](https://index.dev.hexly.ai/artwork/logo-family/firefly/2026-09-06-04/raw/generated-white.png). The owner was asked to confirm the fourth character direction before extraction or any other finishing. No extraction, cleanup, resize, background composite, full review page, or catalogue preview was created.

All three rejected Firefly requests remain archived with their feedback. The proposed light-orbit background remains separate, Pew pass 04 is unchanged, and no source-project assets or deployment were modified. This round is local only.
