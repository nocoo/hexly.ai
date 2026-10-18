# Base CI — Inspection plate

Lapped mineral grain and shallow paired alignment marks recall a quality-inspection work surface.

研磨矿物颗粒与浅浅的成对对位刻痕，呼应质量检验工作台。

## Scope

This v1.0.0 texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. Preserve official Logo bytes and colors: 412463fe088e4322929fa4e2c6d3ddb3a0c5513350e1ce3dbb405e56c8fe76c4.

Reusable checks and provenance verification are analogous to inspecting work against a gauge. Registration marks belong to its workbench, not to a claim that a repository has passed quality or security checks.

## Use

Use texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.

Keep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity 0.45, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are 4.847:1 light and 4.782:1 dark, including normal/hover surface colors before the mask.

## Exact generation and reuse

Read texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. light: the owner reviewed and approved these exact native bytes. dark: the owner reviewed and approved these exact native bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.

Source batch: docs/brand-textures/2026-10-18/inventory.json
Original source study: artwork/brands/base-ci/texture-studies/2026-10-18-flare-intake-01
Existing identity kit: None; the archived original/emoji identity is retained.

Old kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url /textures/base-ci/v1.0.0/manifest.json.
