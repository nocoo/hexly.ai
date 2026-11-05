# Mico — Pressed canvas surface

Shallow frame, note, brush and connector impressions form a distributed working surface.

圆角框、便签、笔触与连接点的浅压痕铺满整张工作面。

## Scope

This v1.0.0 texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. Preserve official Logo bytes and colors: 012db800045ef65d7715129343dd4344ca3c77ea7cbbee703f67e0615b3cc521.

The owner classified Mico as skeuomorphic and requested Dotty-level full-square coverage. Mico's own canvas tools supply the geometry instead of Dotty's ceramic contours.

## Use

Use texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.

Keep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity 0.45, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are 5.689:1 light and 5.628:1 dark, including normal/hover surface colors before the mask.

## Exact generation and reuse

Read texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. light: the owner reviewed and approved these exact native bytes. dark: the owner reviewed and approved these exact native bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.

Source batch: docs/brand-textures/2026-11-05-mico/revised-inventory.json
Original source study: artwork/brands/mico/texture-studies/2026-11-05-flare-onboarding-02
Existing identity kit: None; the archived original/emoji identity is retained.

Old kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url /textures/mico/v1.0.0/manifest.json.
