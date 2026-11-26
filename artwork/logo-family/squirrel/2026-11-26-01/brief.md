# Squirrel: fragmented squirrel head portrait

## Direction and authorization

On 2026-11-26, the owner asked to onboard `../squirrel` (`nocoo/squirrel`) with a new icon and an animal-series Logo. Raw-image acceptance has NOT been delegated; this study archives the brief/prompt and generates the initial native candidate only, stopping at the exact-byte raw-image checkpoint (`raw-review.json` `status: "pending"`).

## Product

`Squirrel` (`nocoo/squirrel`, rev `bf9d57fbd3953a0342ff9a776cfe9eaab34301ad`) is a personal API key and token vault MCP server on Cloudflare Workers (`ts-worker-web`: Hono + D1 + KV + OAuth 2.1 + headless Bot Bearer Tokens + Basalt React 19 admin console; configured custom domain `https://squirrel.hexly.ai`, placeholder `public/logo.svg` and `public/favicon.svg`).

## Series and subject

`hexly-animal` (`Contract: hexly-logo-pipeline v1`), `SQUIRREL` head close-up entering the square from the bottom-left, occupying roughly 40–55% of the square, clear of the opposite edge, with at least a quarter of the square kept as uninterrupted negative space. Connected irregular flat polygon facets with crisp shared edges; no outlines, no smooth 3D rendering, no fur strands, no surface texture. Palette mode: **Lively** (three to five clear hues carried by the animal's own facets, rather than a separate accessory).

## Left to the model

Exact head angle, expression, gesture, color distribution within the lively palette, and ear-tuft / cheek geometry. No mandated external props or accessories.

## Reference roles

1. `public/logos/display/noheir-1024.webp` — asymmetric off-center mammal portrait framing and breathing room only.
2. `public/logos/display/falcon-1024.webp` — head-led close-up framing entering from the bottom-left and uninterrupted open negative space only.
3. `public/logos/display/octo-family-2026-10-18-1024.webp` — connected flat polygon fragmentation only (not its species, palette, or features).

## Execution and checkpoint

Local `~/.config/system0/image-generation.json` had no `gpt` credentials, and testing local Magpie (`http://127.0.0.1:3425`) `jp4`/`jp6` GPT endpoints returned HTTP 403 (`error code: 1010`). On 2026-11-26, the owner explicitly instructed proceeding via Nano Banana (`system0-image-generation-nano-banana`, `gemini-nano-banana-2.1`, `--aspect 1:1`). Native `1024×1024` JPEG bytes are preserved untouched at `raw/generated.jpg`; stop immediately at `raw-review.json` (`status: "pending"`).
