---

name: hexly-r2-media
description: Publish and maintain lean Web-First CDN assets in the hexlyai R2 bucket (h.no.mt) and cold-archive original 2048px masters, artwork sources, and retired versions to Google Drive (architie@gmail.com -> My Drive/hexly.ai/). Use for logos, brand packages, textures, screenshots, fonts, recorded media, asset URLs, local hydration, cold backup, and R2 retirement.
---

# Hexly R2 CDN & Google Drive Cold Backup

Read `AGENTS.md` and [the storage architecture](../../../docs/21-asset-storage.md).
As of **2026-11-24**, `hexlyai` R2 is strictly a **lean Web-First CDN delivery store**, and **Google Drive** is the canonical cold archive for all raw 2048px PNG masters, `artwork/` working studies, and retired/superseded versions.

## 1. Storage Destinations (Authoritative)

- **Hot Web CDN (Cloudflare R2)**:
  - Source of truth: [`src/data/media-storage.json`](../../../src/data/media-storage.json)
  - Bucket: **`hexlyai`** (APAC Standard) · Custom domain: **`https://h.no.mt`**
  - **Allowed on R2**: WebP (display logos, q90 presentation icons, full/320px textures, heroes, brand lockups/marks), SVG, ICO, WOFF2, OG JPEG, MP4/VTT, screenshots, package JSON/TXT/MD metadata, and small platform PNGs (`apple-touch-icon.png` 180px, `chrome-web-store.png`, `hexly-ai` `transparent-{32,64,128,512}.png`).
  - **Forbidden on R2**: `archives/sources/*`, `artwork/` working files/intermediates, 2048px raw/master PNGs, lossless 1024px/512px icon WebPs, superseded brand/icon/texture/family versions, duplicate binary keys, and Worker HTML/CSS/JS documents.
  - **Protected external consumers**: [`docs/assets/external-consumers.json`](../../../docs/assets/external-consumers.json) registers 43 live R2 objects served for `nocoo/zeppelin` under `projects/hexly-ai/{documents,screenshots,textures,fonts}/zep*`. Never retire or overwrite them from `hexly.ai`.

- **Cold Archive (Google Drive)**:
  - Source of truth: [`src/data/cold-storage.json`](../../../src/data/cold-storage.json)
  - Account: **`architie@gmail.com`**
  - Root path: **`My Drive/hexly.ai/`**
  - Root Folder ID: **`1hUXSAaoZ8bV-p7e93sRFoEHW2qEIXsvx`**
  - URL: `https://drive.google.com/drive/folders/1hUXSAaoZ8bV-p7e93sRFoEHW2qEIXsvx`
  - Subfolder map:
    - `manifests/` (`1PvEUG6eOeVYBgnOAhtfkxQ-tcinmELOI`): Pre-migration R2 snapshot, `cold-archive-manifest-*.json`, `sha256sums-*.txt`, upload receipts
    - `01-archives-sources/` (`1FPC6nJZtI0MvTk9YQY6kDfP6f-WcD4zY`): Historical `archives/sources/*` (`artwork/` raw/intermediate/attempts)
    - `02-superseded-and-retired/` (`1N8vwJpikf5SPQeKB2xmKwmiZ7HWZ7_ra`): Superseded versions, stale OG cards, retired `snail`, orphan objects
    - `03-review-artwork/` (`1YJD4t6E6VLX7NZGfVVeQGtWlqjGPUAKW`): Closed historical review-page `/artwork/*` PNGs
    - `04-masters-png/` (`1ZDjH6-hT9m_fvPry0vxNXfeArh5KVSFx`): Deduplicated active 2048px original/master PNGs
    - `05-lossless-webp-icons/` (`1Kjv7veoCNgjZlT7HjUuBBjLr1RJqp7PR`): Pre-optimization lossless `presentationIcon` WebPs
    - `06-future-cold-backups/` (`1JTKowhtSVL4CrbJK_qxhnTEOvSh74oxD`): **Destination for all future project raw masters, `artwork/` working trees, and retired versions**

## 2. Paths, Deduplication, and Immutability

- `docs/assets/inventory.json` inventories ONLY public CDN delivery assets (never `artwork/` intermediates or HTML/CSS/JS).
- `scripts/asset-storage.ts` deduplicates identical binary bytes across namespaces to one canonical R2 key and emits alias routes into `src/data/asset-routes.json`.
- `/icons/<project>/v<X.Y.Z>/*.webp` uses content-hashed R2 keys (`projects/<project>/icons/v<X.Y.Z>/<stem>-<hash12>.webp`) mapped in `src/data/asset-routes.json`.
- Original upstream identity SHA-256 hashes remain recorded truthfully in `src/data/projects/<id>.json` and package `manifest.json` / `provenance.json`, even when the 2048px PNG bytes live in Google Drive cold storage rather than R2.
- Archived catalogue projects (`archived: true`) receive basic support only; do not enrich or bulk-redesign them unless explicitly named.

## 3. Core Workflows

### Inspect & Hydrate

```sh
bunx wrangler r2 bucket info hexlyai --json
bun run assets:hydrate
bun run assets:check-tracked
bun run assets:check
```

### Publish New Lean CDN Assets to R2

```sh
# Prepare lean WebP/SVG/ICO/metadata under public/, then:
bun run assets:r2 -- inventory
bun run assets:r2 -- plan --project <id>
bun run assets:r2 -- publish --project <id> --upload
bun run assets:r2 -- verify --project <id>

# Single-file screenshot or video (dry-run by default; add --upload to publish):
bun run media:r2 -- --project <id> --kind screenshots --asset <name> --version 1.0.0 --file /abs/path.webp
bun run media:r2 -- --project <id> --video <film-id> --version 1.0.0 --file /abs/film.mp4
```

### Cold-Backup Masters & Working Sources to Google Drive

Always archive 2048px raw PNGs, AI generation attempts (`artwork/`), and any superseded assets to **`My Drive/hexly.ai/06-future-cold-backups/`** (`1JTKowhtSVL4CrbJK_qxhnTEOvSh74oxD`) before pruning local files or retiring old R2 objects:

```sh
# Dry-run: packs deduplicated .tar.zst + SHA-256 manifest into .wrangler/cold-backup/
bun run assets:cold-backup -- --project <id> artwork/logo-family/<id>/<run>

# Upload to Google Drive (architie@gmail.com -> My Drive/hexly.ai/06-future-cold-backups/) and verify remote byte size:
bun run assets:cold-backup -- --project <id> artwork/logo-family/<id>/<run> --upload
```

### Safely Retire Superseded R2 Objects

Never delete an R2 object before: (1) its bytes are verified in Google Drive cold storage, (2) the replacement website revision no longer references the old key, and (3) `docs/assets/inventory.json` has been pruned.

```sh
# Dry-run safety check (blocks any key still in inventory.json, external-consumers.json, or docs/media/):
bun run assets:r2 -- retire --plan docs/assets/retire-plan.json

# Execute deletion and append audit receipts to docs/assets/r2-retirements.jsonl:
bun run assets:r2 -- retire --plan docs/assets/retire-plan.json --execute
```

## 4. Guardrails

- Never commit material binaries (`.png`, `.webp`, `.jpg`, `.ico`, `.woff2`, `.mp4`, `.zip`, `.pdf`, `.pptx`, `.tar.zst`) into Git.
- Never sweep `artwork/` working files into R2 `archives/sources/`.
- Never overwrite existing published immutable R2 bytes; use a new version or content-hashed key.
- Keep `social-cards.json` current via [the social card runbook](references/social-cards.md), and retire replaced `/og/*.jpg` cards after release.
- Keep video exports H.264/AAC (`moov`-before-`mdat`) with Range `206` verification; keep screenshot workflows aligned with [the screenshot runbook](references/project-screenshots.md).
