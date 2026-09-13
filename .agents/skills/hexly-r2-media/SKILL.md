---
name: hexly-r2-media
description: Publish and maintain Hexly project materials in the hexlyai R2 bucket at h.no.mt. Use for logos, brand packages, screenshots, fonts, recorded media, downloads, asset URLs, local hydration and asset onboarding. Preserve immutable bytes, identity rights and versioned receipts; keep renderer caches private and outside deployment.
---

# Hexly R2 materials

Read `CLAUDE.md`, [the execution/recovery plan](../../../docs/20-r2-assets-execution.md)
and [the material contract](../../../docs/21-asset-storage.md). The owner authorized
R2 migration, publication, then Git history reduction on 2026-09-13. This replaces
the older instruction to retain all binary materials in Git/Workers Static Assets.
Ordinary asset tasks do not authorize another history rewrite or object deletion.
For a fresh checkout or an old pinned revision, use the
[Git recovery guide](../../../docs/23-git-history-recovery.md). Keep original
provenance SHAs; the published commit map connects them to the smaller history.

## Actual service and records

- Source of truth: [`src/data/media-storage.json`](../../../src/data/media-storage.json).
  Bucket **hexlyai**, origin **https://h.no.mt**, Zheng Li Workspace, APAC Standard.
  Use the custom domain, never a remembered proposed hostname or S3/r2.dev URL.
- Direct CDN delivery; the existing Worker serves pages/code/APIs and redirects
  legacy asset addresses. It has no media binding or streaming proxy.
- [`docs/assets/inventory.json`](../../../docs/assets/inventory.json) maps source
  paths to object keys, public paths, bytes, SHA-256, MIME, project and provenance.
  `src/data/asset-routes.json` is its generated loose-file URL map; versioned
  brand/family/video-font directories preserve their public relative paths.
- `docs/assets/publication.jsonl` records completed full-byte CDN checks. Existing
  project-film receipts remain in `docs/media/<project>/<video-id>/v<version>.json`.
`Project.media.videos` references an active film once, independent of templates.
- Existing source rights, official Logo bytes/colors and campaign distinction
  remain authoritative. R2 hosting grants no new license. Keep provenance,
  generation prompts/model/source hashes and OFL/MIT notices with their source.
- Completed objects have no expiry. The sole seven-day lifecycle rule aborts
  incomplete multipart uploads; it does not delete assets or films.

## Paths and versions

Project IDs come from `src/data/projects/index.json`; `hexly-ai` is the shared
site identity. Asset versions are independent of site/app/Video Kit versions.

```text
brands/<project>/v<X.Y.Z>/...                             # complete brand package
logos/family/<historical-project>/<batch>/<pass>/...    # frozen historical exports
video-kit/<asset-version>/hexly/...                     # licensed template fonts
projects/<project>/videos/<film>/v<X.Y.Z>/<name>-<hash12>.<ext>
projects/<project>/<kind>/<asset>/v<X.Y.Z>/<name>-<hash12>.<ext>
shared/site/v<X.Y.Z>/<name>-<hash12>.<ext>                 # site material / loose aliases
archives/sources/v1.0.0/<sha256>.<ext>                    # migrated historical source bytes
```

Frozen packages keep every byte and internal relative path, including their
original manifest root/canonical fields. The CDN origin is delivery metadata;
never rewrite published manifests simply to change hostname. New/changed assets
need new immutable keys; preserve earlier receipts and URLs. Original project
identity and Hexly campaign interpretations are separate roles.

HTML comparison pages and their JS/CSS remain application documents on hexly.ai.
The R2 copy is the unchanged source/download archive, not a new canonical page.
Never globally set Vite's base to the CDN or place renderer outputs in public/.
Standalone review navigation gets a shared download module at the presentation
boundary; raw HTTP fetches still return the original checksummed HTML. Keep
this distinction and its Vary/no-store headers when changing the gateway.

## Inspect, publish, recover

Run from the repository root with installed Bun/Wrangler:

```sh
# Inspect only; never print authentication tokens.
bunx wrangler whoami
bunx wrangler r2 bucket info hexlyai --json
bunx wrangler r2 bucket domain list hexlyai
bunx wrangler r2 bucket cors list hexlyai
bunx wrangler r2 bucket lifecycle list hexlyai

# Restore missing material files, preserving any existing local edits.
bun run assets:hydrate
bun run assets:r2 -- hydrate --project snail
bun run assets:check-tracked

# After preparing authorized new files and project metadata:
bun run assets:r2 -- inventory
bun run assets:r2 -- plan --project frogie
bun run assets:r2 -- publish --project frogie --upload
bun run assets:r2 -- verify --project frogie
bun run assets:r2 -- url /brands/frogie/v1.0.0/favicon.ico

# A single new screenshot (default is a dry-run; --upload publishes):
bun run media:r2 -- --project zhe --kind screenshots --asset library \
  --version 1.0.0 --file /absolute/path/library.webp

# Existing film workflow remains compatible; default is a local dry-run.
bun run media:r2 -- --project hermes-on-herdr --video context-en \
  --version 1.0.0 --file /absolute/path/film.mp4
# Add --upload only within an upload/publication task.
```

The single-file helper prints the verified result; it does not silently register
a new catalogue asset. Save its URL/key/bytes/SHA, independent version, source
revision, license and verification time in
`docs/media/<project>/<video-id>/v<version>.json` for films, or
`docs/assets/<project>/<kind>/<asset-id>/v<version>.json` for other single files.
Add the catalogue reference only after this receipt exists. Batch publication
records its receipts automatically in `docs/assets/publication.jsonl`.

Curated Hexly template examples use project `hexly-ai` and film IDs such as
`standard-outro-product-launch`. Their active references live in
`src/data/template-examples.json`, exposed as `/templates/examples.json` and
displayed at `/templates#examples`; they are not project recordings or fields
in the configurable component manifest. See [the example runbook](../../../docs/24-standard-outro-examples.md).
Keep the consumer's source revision and import-time publication status truthful.
For HTML-produced examples, capture the matching HTML composition directly for
a full-canvas 4K PNG and a small WebP poster; do not extract a compressed MP4
frame. Record the composition, frame, scale, source/config hashes and both image
hashes. Upload the unchanged MP4, poster and 4K still together, then verify their
receipts, Range/CORS and user-initiated site playback/downloads.

Snail retired from the catalogue on 2026-09-13. Its inventoried historical assets
remain available for hydration and verification; use an active project such as
Zhe for new single-file material publication.
Batch `plan`, `url`, `verify` and `hydrate` also accept project IDs retained in
the inventory. Publication still requires a current catalogue entry; retirement
does not reopen a product or authorize new files under its historical identity.

The batch helper uses Wrangler's active authentication in memory and the same R2
object HTTP endpoint as Wrangler. It freezes each file's checked bytes in memory,
limits concurrency and write rate, retries transient network failures at most
three times, stops on authorization/checksum failures, and records successful
GET byte/MIME verification. A repository lock prevents overlapping local upload
runs. Existing objects are verified and reused. This is a single-writer workflow:
HEAD-before-PUT is not an atomic distributed conditional write. Coordinate other
writers of the same published package; different bytes must never be overwritten.
Verification retries cover the complete response body, including a disconnect
after successful headers. Exhausted retries report the exact object key; cached
404 handling remains separate, and wrong bytes or MIME stop immediately.

Wrangler may return a token near the end of its lifetime. On HTTP 401 the helper
asks Wrangler for current credentials and retries once only when the token has
actually changed and the account is unchanged. An unchanged/denied credential,
changed account or second failure stops publication; it never loops on missing
permissions. Credential values stay in memory and outside receipts/logs.

For an interrupted run, confirm the lock's PID is no longer the uploader before
removing that stale lock. Keep its receipts and rerun the same bounded command.
Receipts allow resumption; use `verify` for a fresh current availability check.
Do not start a second writer or repeat an unresolved 401/403 indefinitely.
If an uploaded URL still returns a cached 404, inspect Cache-Status/Age and
compare a unique-query GET against the expected SHA. Wait for expiry or purge
only that URL with existing zone permissions, then verify the bare URL before
resuming. A successful cache-busted response alone does not prove the bare URL
is ready. Never overwrite correct bytes to fix an edge-cache response.

`--scope public` is the default; `--scope all` also handles inventoried source
archives. Do not upload arbitrary temporary directories. Source duplicates can
recover from the same hashed object. Hydrated files/cache are disposable local
working material; their verified R2 objects and small source records are durable.

Material images, fonts, films/audio, ZIP, PDF and PPTX files are ignored by Git.
Pre-commit and CI also inspect the index, so `git add -f` cannot bypass this
boundary. Keep SVG geometry, manifests, licenses and publication receipts in Git.
The inventory scans approved material directories even when files are ignored;
do not force-add a binary to make it discoverable. The vendored `.tgz` code
dependency is retained and is not a material export.

## Integrate and verify

1. Prepare authoritative identity and license/provenance records before export.
   Preserve full compositions, original colors and exact Logo hashes.
2. Publish and verify the approved inventory. Retrieve addresses with `url`;
   never hand-build or guess a URL. Catalogue paths identify original assets;
   `src/model/assets.ts` resolves their delivery URL. Use `AssetLink` for material
   downloads so cross-origin browser behavior still produces the original file.
3. Keep fonts/media MIME, cache metadata, CSP and actual browser CORS aligned.
   R2 does not inherit `_headers`. The owner's CORS policy is preserved: actual
   GET/HEAD checks passed for hexly.ai, status.hexly.ai and index.dev.hexly.ai.
   Check new origins explicitly. Dev review uses the existing HTTPS domain.
4. Existing recorded media stays H.264/AAC, moov-before-mdat, original approved
   export. Check HEAD/GET, full checksum, and Range bytes=0-1023 returning 206.
   Preserve posters, real captions and captionsBurnedIn; no silent transcode.
5. Run assets:check and relevant model/HTTP/browser checks. Browser fixtures use
   CDN URLs with verified local bytes, avoiding live Cloudflare dependencies.
   The production build rejects material binaries and enforces a 20 MiB budget.
6. Complete catalogue/profile/onboarding work only in authorized repositories.
   This migration itself changes hexly.ai only. Publish through docs/05-release.md
   and verify exact SHA/version, canonical pages, old asset URLs and direct CDN.

Rolling back an active catalogue reference does not delete its R2 object. Object
removal requires a specifically authorized list and a reference check. Never add
blanket lifecycle expiration or commit movie/large-image binaries. Preserve old
Git-revision maps and external history backups described in the execution plan.
