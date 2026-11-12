# HN Today — Archive timeline paper

Curved page-edge impressions and sparse timeline notches evoke browsing past dates.

弧形纸页压痕与稀疏时间刻度呼应对往年日期的浏览。

## Scope

This v1.0.2 texture pack is independent of the existing Logo/brand kit. It decorates Hexly project pages and Hexly-created campaigns; it does not change the product's identity, palette, UI, release or archived status. The referenced identity is an unadopted Hexly review candidate, not an official product Logo: bdb990a07d92a2953d06bb22dd27c5712a6ce12e6bf352bc4d09518e6a6fba5e.

Layered page edges and timeline notches suggest the date-based archive without representing actual scores or historical rankings.

## Use

Use texture-light.webp or texture-dark.webp for full specimens. The PNGs are untouched native 1024 × 1024 responses; the WebP files are whole-canvas delivery encodings. Use the -320.webp files for cards. Light and dark were generated independently with the actual Workflow GPT Image Flare helper.

Keep aspect ratio 1:1, background-size: contain and background-repeat: no-repeat. Do not crop, stretch, mirror, patch edges or claim seamless repetition. Full specimens show the image at full opacity. Text-bearing regions use a separate background layer at opacity 0.45, softly masked at the left edge; text and Logo remain fully opaque. Use Hexly's real paper/ink tokens and minimum 4.5:1 normal text contrast. Measured worst-case contrasts at export are 5.561:1 light and 5.603:1 dark, including normal/hover surface colors before the mask.

## Exact generation and reuse

Read texture-light-prompt.txt and texture-dark-prompt.txt, plus the source request/response and raw-review records. light: the owner reviewed and approved these exact native bytes. dark: the owner reviewed and approved these exact native bytes. Reuse the accepted files directly instead of regenerating them for each campaign. Check manifest.json hashes before adopting.

Source batch: docs/brand-textures/2026-11-12-onboarding/candidates-export-v3.json
Original source study: artwork/brands/hackernews-on-this-day/texture-studies/2026-11-12-flare-onboarding-01
Existing identity kit: None; source-project identity adoption is pending.

Old kit texture URLs remain historical and byte-identical. New texture revisions use a new independent pack version and an updated Project.brandTexture reference. Publication receipts remain in docs/assets/publication.jsonl; recover exact URLs with bun run assets:r2 -- url /textures/hackernews-on-this-day/v1.0.2/manifest.json.
