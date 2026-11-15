# hexly.ai — Ceramic archive

Fine ceramic grain with sparse specimen-layout impressions, leaving a quiet field for the preserved identities.

细陶土颗粒与疏朗的标本排布压痕，为原始品牌留出安静底面。

## Scope

This v1.0.2 texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. Preserve official Logo bytes and colors: 5df6368fc0d54fa4fb9e3b1c665ef548d63fcb914ff9a2d5f6b945957e0afdc5.

Hexly preserves a collection of project identities. A ceramic specimen-working surface supports the adopted terracotta emblem without drawing a second emblem or copying its six triangles.

## Use

Use texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.

Keep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity 0.4, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are 5.829:1 light and 4.776:1 dark, including normal/hover surface colors before the mask.

## Exact generation and reuse

Read texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. light: the owner reviewed and approved these exact native bytes. dark: the owner reviewed and approved these exact native bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.

Source batch: docs/brand-textures/2026-10-18/adoption-inventory.json
Original source study: artwork/brands/hexly-ai/texture-studies/2026-10-18-flare-intake-01
Existing identity kit: None; the archived original/emoji identity is retained.

Old kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url /textures/hexly-ai/v1.0.2/manifest.json.

## Identity binding update

Version 1.0.2 reuses every texture image and original generation/approval record byte-for-byte from v1.0.1. Only the current Logo association and package metadata change. No image generation, crop, recolor or new surface design occurred. The previous package remains immutable.
