# Shrike — A hawthorn lookout

Small deeply lobed hawthorn leaves on sparse thorn-bearing twigs, a few narrow grass seeds and no more than two tiny muted berries.

有棱角的山楂叶与疏朗带刺枝条构成篱边停栖处，呼应伯劳清醒的视线。

## Scope

This v1.0.0 texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. Preserve official Logo bytes and colors: 97692ebf5b7811eb48005f814a5688bc05d582533adab440636295370a60befa.

The existing animal/bird identity determines a plausible broad botanical setting; no species claim is added. Product category does not override an approved animal identity.

## Use

Use texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.

Keep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity 0.38, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are 4.718:1 light and 4.856:1 dark, including normal/hover surface colors before the mask.

## Exact generation and reuse

Read texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. The user delegated acceptance for this batch; Codex inspected the raw canvases. No claim is made that the user personally reviewed these bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.

Source batch: docs/brand-textures/2026-09-14/inventory.json
Original source study: artwork/brands/shrike/texture-studies/2026-09-14-flare-rollout-01
Existing identity kit: /brands/shrike/v1.0.0

Old kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url /textures/shrike/v1.0.0/manifest.json.
