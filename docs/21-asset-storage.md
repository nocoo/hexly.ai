# Site materials: Lean R2 CDN, Google Drive Cold Archive, and Recovery

`hexly.ai` separates **hot Web CDN delivery** from **cold master/source archiving**:

- **Hot Web CDN (Cloudflare R2 `hexlyai` → `https://h.no.mt`)**: Configured in `src/data/media-storage.json`. Serves ONLY lean web-delivery assets required by browsers and `/api/projects/<owner>/<repo>`: WebP (display logos, q90 presentation icons, full/320px textures, heroes, brand lockups/marks), SVG, ICO, WOFF2, OG JPEG, MP4/VTT, screenshots, metadata JSON/TXT/MD, and small platform PNGs (`apple-touch-icon.png` 180px, `chrome-web-store.png`, and `hexly-ai` `transparent-{32,64,128,512}.png`).
- **Cold Archive (Google Drive `architie@gmail.com` → `My Drive/hexly.ai/`)**: Configured in `src/data/cold-storage.json`. Holds all 2048×2048 original/master PNGs, `artwork/` working studies/intermediates, historical review artwork, lossless WebP backups, and retired/superseded R2 versions as checksummed `.tar.zst` bundles.

Read [the R2 & cold-backup skill](../.agents/skills/hexly-r2-media/SKILL.md) before publishing, retiring, or backing up materials.

## Storage Destinations (Single Source of Truth)

| Layer | Service & Account | Destination / Root | Contract File |
| --- | --- | --- | --- |
| **Hot CDN** | Cloudflare R2 (`hexlyai`, APAC Standard) | `https://h.no.mt` | `src/data/media-storage.json` |
| **Cold Archive** | Google Drive (`architie@gmail.com`) | `My Drive/hexly.ai/` (`1hUXSAaoZ8bV-p7e93sRFoEHW2qEIXsvx`) | `src/data/cold-storage.json` |
| **External R2 Consumers** | Cloudflare R2 (`hexlyai`) | `projects/hexly-ai/{documents,screenshots,textures,fonts}/zep*` (`nocoo/zeppelin`, 43 objects) | `docs/assets/external-consumers.json` |

### Google Drive Cold Archive Layout

URL: `https://drive.google.com/drive/folders/1hUXSAaoZ8bV-p7e93sRFoEHW2qEIXsvx`

| Folder | Folder ID | Contents |
| --- | --- | --- |
| `hexly.ai/` | `1hUXSAaoZ8bV-p7e93sRFoEHW2qEIXsvx` | Root directory + `README.md` |
| `hexly.ai/manifests/` | `1PvEUG6eOeVYBgnOAhtfkxQ-tcinmELOI` | Pre-migration R2 snapshot, full `cold-archive-manifest-*.json` (key/path → bundle + SHA-256), `sha256sums-*.txt`, upload receipts |
| `hexly.ai/01-archives-sources/` | `1FPC6nJZtI0MvTk9YQY6kDfP6f-WcD4zY` | Migrated `archives/sources/*` (`artwork/` raw candidates, finishing intermediates, texture attempts) |
| `hexly.ai/02-superseded-and-retired/` | `1N8vwJpikf5SPQeKB2xmKwmiZ7HWZ7_ra` | Superseded `brands/`, `icons/`, `textures/`, `logos/family/`, stale `/og/*`, retired `snail`, orphan objects |
| `hexly.ai/03-review-artwork/` | `1YJD4t6E6VLX7NZGfVVeQGtWlqjGPUAKW` | Closed historical static review-page `/artwork/*` PNGs |
| `hexly.ai/04-masters-png/` | `1ZDjH6-hT9m_fvPry0vxNXfeArh5KVSFx` | Deduplicated 2048px original/master PNGs (`brands/`, `logos/family/`, `icons/`, `textures/`, `/logos/originals/`) |
| `hexly.ai/05-lossless-webp-icons/` | `1Kjv7veoCNgjZlT7HjUuBBjLr1RJqp7PR` | Pre-optimization lossless `presentationIcon` WebP backups |
| `hexly.ai/06-future-cold-backups/` | `1JTKowhtSVL4CrbJK_qxhnTEOvSh74oxD` | **Default target** for all new project raw 2048px PNGs, `artwork/` working trees, and future retirements |

## The Worker / R2 / Git Boundary

- **Worker (`hexly-ai` + Static Assets)**: Serves HTML (including standalone `brands/*/v*/review.html` and `textures/*/v*/review.html`), application JS/CSS, APIs (`/api/live`, `/api/status`, `/api/share`, `/api/projects/<owner>/<repo>`), sitemap, robots, and llms. Redirects legacy material paths to `https://h.no.mt`. Worker deploy stays strictly `< 20 MiB`.
- **R2 (`hexlyai`)**: Serves ONLY lean CDN binaries and package metadata indexed in `docs/assets/inventory.json`, plus video receipts (`docs/media/`) and registered external consumers (`docs/assets/external-consumers.json`).
  - **Content-addressed deduplication**: `scripts/asset-storage.ts` automatically deduplicates identical binary bytes across namespaces to one canonical R2 object key and emits alias routes into `src/data/asset-routes.json`.
  - **Immutable hashed icon WebPs**: `/icons/<id>/v<ver>/*.webp` maps to `projects/<id>/icons/v<ver>/<stem>-<hash12>.webp` via `src/data/asset-routes.json` so re-encoded q90 WebPs never collide with stale edge caches.
  - **Forbidden on R2**: `archives/sources/*`, `artwork/` working intermediates, 2048px master/raw PNGs, lossless 1024px/512px icon WebPs, superseded brand/icon/texture/family versions, and HTML/CSS/JS documents.
- **Git**: Retains source code, SVG source geometry, project/brand/texture/icon manifests (preserving exact upstream original SHA-256 provenance!), prompts, licenses, `inventory.json`, `cold-storage.json`, `external-consumers.json`, and retirement/publication receipts. Pre-commit and CI reject tracked material binaries even under `git add -f`.

## Common Commands

```sh
# 1. Hydrate lean public CDN assets locally (~176 MB)
bun run assets:hydrate
bun run assets:check-tracked
bun run assets:check

# 2. Inventory & publish new lean CDN assets to R2
bun run assets:r2 -- inventory
bun run assets:r2 -- plan
bun run assets:r2 -- publish --upload

# 3. Cold-backup raw 2048px PNGs / artwork/ studies to Google Drive (hexly.ai/06-future-cold-backups/)
bun run assets:cold-backup -- --project <id> artwork/logo-family/<id>/<run>              # dry-run
bun run assets:cold-backup -- --project <id> artwork/logo-family/<id>/<run> --upload     # upload & size-verify

# 4. Safely retire superseded/removed R2 keys (protects inventory, external-consumers, docs/media)
bun run assets:r2 -- retire --plan <retire-plan.json>            # dry-run
bun run assets:r2 -- retire --plan <retire-plan.json> --execute  # delete & log to docs/assets/r2-retirements.jsonl
```

## Recovering a Cold-Archived File from Google Drive

1. Look up the R2 key, local source path, or `sha256` in `My Drive/hexly.ai/manifests/cold-archive-manifest-2026-11-24.json` (or the per-batch `<project>-<YYYY-MM-DD>.manifest.json` in `06-future-cold-backups/`).
2. Download the matching `.tar.zst` bundle from its Google Drive subfolder and verify its SHA-256 against `sha256sums-*.txt`.
3. Extract the exact file:

```sh
tar --zstd -xf <bundle>.tar.zst "./<memberPath>"
```
