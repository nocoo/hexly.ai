# Dogfight — Banked alloy

Diagonal overlapping alloy skin seams, a short sparse row of flush rivet impressions and gently changing brushed grain.

斜向金属拼缝、少量齐平铆点与细腻拉丝呼应桌面战机模型的转弯，是材质联想而非真实飞机图纸。

## Scope

This v1.0.0 texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. Preserve official Logo bytes and colors: 274611f248e476334769d4c4c670a1dbd0d20263fc1d210b665b2fb7b9867fc4.

The existing object, character or historical mark remains unchanged. Only a supporting working surface is interpreted from the product's purpose; no replacement Logo is generated.

## Use

Use texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.

Keep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity 0.32, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are 4.772:1 light and 5.048:1 dark, including normal/hover surface colors before the mask.

## Exact generation and reuse

Read texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. The user delegated acceptance for this batch; Codex inspected the raw canvases. No claim is made that the user personally reviewed these bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.

Source batch: docs/brand-textures/2026-09-14/inventory.json
Original source study: artwork/brands/dogfight/texture-studies/2026-09-14-flare-rollout-01
Existing identity kit: /brands/dogfight/v1.0.0

Old kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url /textures/dogfight/v1.0.0/manifest.json.
