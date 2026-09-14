# Codo — A flower within reach

Slender salvia leaves and curved honeysuckle stems, with only two tiny tubular flowers in very muted terracotta.

鼠尾草长叶与金银花弯枝向上伸展，仅用两枚低饱和筒状小花回应蜂鸟取食的瞬间。

## Scope

This v1.0.0 texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. Preserve official Logo bytes and colors: 67456a5040ec217dd179bdc54f81f9c71ea44908ea7b25a2e9064e386b2607cf.

The existing animal/bird identity determines a plausible broad botanical setting; no species claim is added. Product category does not override an approved animal identity.

## Use

Use texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.

Keep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity 0.37, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are 4.791:1 light and 5.530:1 dark, including normal/hover surface colors before the mask.

## Exact generation and reuse

Read texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. The user delegated acceptance for this batch; Codex inspected the raw canvases. No claim is made that the user personally reviewed these bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.

Source batch: docs/brand-textures/2026-09-14/inventory.json
Original source study: artwork/brands/codo/texture-studies/2026-09-14-flare-rollout-01
Existing identity kit: /brands/codo/v1.0.0

Old kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url /textures/codo/v1.0.0/manifest.json.
