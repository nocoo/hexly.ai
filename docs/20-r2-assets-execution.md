# R2 asset migration and Git history reduction

Owner authorization: 2026-09-13. Implement the previously reviewed R2 design,
publish and verify the website first, then reduce Git history to improve a normal
clone. Only the hexly.ai repository is in scope. This instruction supersedes
the earlier requirement to keep binary materials in Git/Static Assets.

## Baseline and measurable outcome

- Starting main/production: `91fb69d32f835c301d3427550fd84eb03ef8cb50`, v0.10.0;
  clean working tree observed before implementation.
- Inventory covers all 75 catalogue projects, archived routes, all historical
  public brand/family versions, Hexly identity and Video Kit materials.
- Baseline dist: 4,690 files, 3,147,514,699 logical bytes (2.93 GiB).
  PNG: 3,086,790,030 bytes; WOFF2: 4,609,204 bytes. This measures files, not
  compressed first-page network traffic.
- Target: no independently served media in the Worker deployment; dist below
  20 MiB. Website code, APIs, catalogue, template configuration/schema,
  sitemap/robots/llms and canonical page addresses remain on hexly.ai.
- Asset bytes, original Logo colors, license notices, published manifests and
  source provenance must survive unchanged. R2 is transport, not a redesign.
- Record actual before/after deployment and clone sizes, publication revisions,
  verification results and recoverable backups; do not infer success from upload.

## Storage and paths

The only bucket/origin configuration remains `src/data/media-storage.json`:
`hexlyai`, `https://h.no.mt`. Reuse the existing uploader/skill. No new media
Worker, R2 Worker binding, D1 registry, bucket or CDN domain is necessary.

- R2 serves official/campaign images, original downloads, Hero/texture, icons,
  favicon, screenshots, social images, licensed fonts, films/audio/captions and
  document/package downloads. Preserve existing video keys and receipts.
- Preserve existing versioned published package paths, including their exact
  manifest bytes and internal relative references. Canonical brand identity may
  remain at hexly.ai while delivery resolves to h.no.mt.
- Unversioned legacy assets map to immutable version/hash keys. Legacy page
  routes are not asset redirects. Initially use short-cache redirects to allow
  rollback; all new rendered resource references use the CDN directly.
- New project materials: `projects/<id>/<kind>/<asset-id>/v<X.Y.Z>/<name>-<hash12>.<ext>`.
  Shared materials: `shared/<asset-id>/v<X.Y.Z>/<name>-<hash12>.<ext>`.
- Source archives and public exports have distinct inventory roles. Preserve
  official identity versus Hexly campaign interpretation and the project's own
  palette. Upload only public material; omit secrets and temporary render caches.
- Never replace different bytes at a published object key. No expiry or automatic
  deletion of completed objects. Existing incomplete-multipart cleanup remains.

## Execution checkpoints

### A. Inventory, tools and operating contract

- [x] Verify clean main and baseline; write this execution plan before code work.
- [x] Produce machine-readable asset inventory (source, public path/key/URL,
  project/kind/version, MIME, bytes, SHA-256, source/license/provenance).
- [x] Extend the existing R2 tool with dry-run, bounded resumable batch upload,
  exact-byte verification, receipt/URL lookup and local asset hydration.
- [x] Update `.agents/skills/hexly-r2-media/SKILL.md`, CLAUDE and onboarding docs.
  New sessions must publish/verify assets before catalogue integration; new
  large binaries must not silently re-enter Git or deploy output.

### B. Copy and verify before switching delivery

- [x] Check bucket/domain/authentication; inspect actual CORS/cache behavior.
- [x] Pilot Snail, animal and non-animal archives, fonts, downloads and existing
  video behavior. Preserve all historical URLs and checksummed manifests.
- [x] Upload full public inventory; verify size/MIME and complete SHA-256.
  Persist bounded retry results so interrupted operations can resume.
- [x] Set MIME/cache metadata and necessary font CSP/CORS. R2 does not inherit
  Worker `_headers`; test actual Origin, download behavior and MP4 Range 206.

### C. Application and build boundary

- [x] Use a shared CDN resolver for React/CSS, metadata, downloads and Video Kit.
- [x] Replace Vite's blanket public copy with an explicit application boundary;
  preserve generated app JSON and static discovery artifacts.
- [x] Keep old material addresses working through verified redirects.
- [x] Provide deterministic local/CI assets and offline renderer hydration;
  prohibit arbitrary live-CDN dependence in browser tests.
- [x] Add inventory/immutability/redirect/build-budget tests and run the existing
  lint, typecheck, asset, unit, HTTP, browser, security and deploy checks.

### D. Publish and production acceptance (must precede history work)

- [x] Commit functional change independently; release the next minor version
  through `docs/05-release.md`, preserving its exact-SHA CI/CD gates.
- [x] Verify main/tag/Release/live revision and all asset references/old URLs;
  inspect representative desktop/mobile/light/dark pages, fonts, downloads,
  templates, media, canonical metadata and sitemap.
- [x] Save production evidence and the pre-migration rollback baseline.

### E. Authorized history reduction, after checkpoint D

- [x] Recheck worktree, remote branches/tags and concurrent activity. Stop on
  unknown changes; never reset/stash/overwrite another session's work.
- [x] Preserve a complete external Git bundle/mirror and original ref inventory;
  verify the bundle and its SHA-256 before removing anything. Archive binary
  source materials and a path/hash recovery index independently of Git history.
- [ ] Remove hydrated binary materials from the current tracked tree while
  retaining manifests, source records, licenses, scripts and recovery commands.
  Verify a fresh checkout can build/test/render from verified asset hydration.
- [ ] In an isolated copy, filter only inventoried material paths/blobs across
  intended branches/tags; preserve code history, authors and commit messages.
  Save old/new commit and ref maps. Inspect exact changes before publishing.
- [ ] Push explicit refs with leases against the recorded remote SHAs. No
  blind mirror push, concurrent pushes or permanent transport configuration.
  A normal clone must not fetch old large blobs through retained tags.
- [ ] This owner-authorized migration is a one-time exception to immutable Git
  tag targets: document affected historical release SHAs and retain their
  original refs in the external backup. Asset version keys/bytes stay immutable.
- [ ] Re-run trusted CI/CD for rewritten main and verify production's new SHA;
  reconcile affected Release metadata and publish the migration map.
- [ ] Measure a fresh normal clone and check its worktree/build/asset recovery.
  Keep the external original history backup; GitHub internal retention may
  outlast ref removal, so do not claim immediate server-side storage reclamation.

## Rollback and completion record

Before history reduction, roll back the site to the preserved v0.10.0 deployment
or the preceding verified release. Uploaded immutable objects can remain.
After history reduction, the verified external bundle restores original refs;
use the captured remote leases and coordinate consumers rather than merging old
history back into the new main. Consumers should re-clone or rebase intentional
work onto the published replacement SHA.

Implementation and measured completion results will be appended here and linked
from the repository asset receipts. This plan is not evidence that an unchecked
step has already happened.

## Observed migration checkpoints

- Initial local HTTP suite: 127/127 passed after the delivery/build change.
- Complete pre-migration Git bundle: `/Users/nocoo/backups/hexly.ai/r2-migration-20260913T080642/baseline-full.bundle`, 3,622,551,692 bytes; `git bundle verify` passed. SHA-256: `8ed1b6bb1634f9d4ef525fa5e18ae5156039c6305f2d4e9b41b6c1d8561c4ab7`. This backup does not mean history has been rewritten.
- Actual CORS GET/HEAD passed for `https://hexly.ai`, `https://status.hexly.ai`, and `https://index.dev.hexly.ai`; the existing bucket policy is unchanged.
- OAuth has R2 object access. Zone cache-purge permission returned HTTP 401; no cache policy or zone permissions were changed. Existing published bytes remain immutable.
- Account API upload throttling returned 429; the uploader stopped after bounded retries with receipts intact. Added account headroom and shared Retry-After cooldown before resuming.

- Final local acceptance: 319 unit tests, 99.59% statements / 98.73% branches / 100% functions and lines; 127 HTTP tests; 352 desktop/mobile browser tests. Typecheck, lint, asset checks, OSV and Gitleaks passed. The standalone Snail/Frogie download checks cover actual downloaded bytes and unchanged raw HTML hashes.
- Complete Worker asset boundary (including discovery snapshots): 350 regular files, 3,430,448 bytes; Wrangler reports 468 scanned entries including directories. Deploy dry-run Worker upload 82.74 KiB (17.91 KiB gzip). No material binaries enter dist.
- Actual Snail Launch validation export: 960×540, 30 fps, 990 frames (33 seconds), seven deck pages, MP4/PPTX/PDF and decoded-frame/contact-sheet inspection passed. Validation outputs stay outside Git/deployment.
- One canonical Snail texture URL briefly retained an earlier cached 404 after its R2 write. A unique-query GET matched the expected SHA; the bare URL later returned 200 after cache expiry and matched too. No object was overwritten and no cache-policy/permission change was needed; resumed from receipts.

- Sparse fresh-checkout proof: frozen install/build passed without material working files; 11 missing sample payloads hydrated from CDN with hashes checked. Actual dev started and returned a demo status feed (HTTP 200, 32 services) without hydrating the full archive.

- Public publication completed: 4,510 immutable objects / 3,145,538,350 bytes, every complete CDN response checked against the inventory SHA-256 and MIME. `docs/assets/publication.jsonl` contains the per-object evidence; source-only archives and production deployment remain separate pending checkpoints.

- The first v0.11.0 deployment at `3dc05b9a947fe3eb917906d02fc50e4bf9b61cc9` passed CI `34729507069` (attempt 2) and Deploy `34730560989`. Actual browser acceptance then found a canonical review-page routing defect; `40006c9` fixes the shared resolver and adds production-mode regressions. This initial deployment was not tagged as an accepted release. See `Retrospective.md`.
- All 4,510 CDN objects passed production HEAD checks. Combined observations and bounded HTTP/1.1 rechecks verified 4,343 legacy material redirects, three original hashed font URLs, all 75 project pages/sitemap entries/original Logo hashes, and the existing movie's Range 206/CORS. The initial audit kept 39 local network failures (one TLS error, 38 large-response timeouts); every affected request passed a certificate-verified curl recheck with two readers and a 120-second response limit. Original evidence is retained under the external backup's `validation/production-first-deploy/` directory.
- Real-CDN desktop/mobile checks passed Snail/Frogie/Basalt image decoding, both themes, all five template layouts, Video/Deck controls and actual fonts. After Deploy `34731353263` succeeded at `d64fbe8f9609a5b969013493ebb44c3ee8d09524`, all 28 browser observations passed, including both canonical standalone review pages and exact-byte favicon downloads. `docs/assets/production-0.11.0.json` records this accepted implementation; final release bookkeeping remains separate.
- One source-archive run stopped on a response-body timeout after 7,129 successful receipts. The helper now retries the complete body, names an exhausted object's key, preserves permanent checksum/MIME failures, and avoids nested retry loops. A disconnected-body regression passed; publication resumed with four workers and the existing receipts, without overlapping uploaders or disabling TLS checks.

- Full public/source publication completed at `2026-09-13T02:12:23.758Z`: 8,193 objects, 9,342 source paths, 5181182625 stored bytes. Every key has a matching complete-byte SHA-256/MIME/size receipt; no uploader remains active. A Wrangler account lookup briefly failed during OAuth renewal; a subsequent authenticated same-account lookup succeeded, and the last 269 objects resumed from receipts. No permission, CORS, lifecycle or TLS-validation setting changed.


- Formal v0.11.0 published at `517fafdaf99674b2aeb07fc5908184ac928d26d8`: CI `34734198150`, Deploy `34734720132`, annotated tag and [GitHub Release](https://github.com/nocoo/hexly.ai/releases/tag/v0.11.0). Production reports the exact revision; Worker version `0da49cd9-bfb8-4e10-a11d-eacd8a8e5827`. All 352 browser CI checks passed using full Chromium. Final production checks verified 75 project pages, sitemap membership and original Logo hashes, three historical font aliases, movie Range/CORS and 28 real-CDN browser observations; six initial TLS handshakes passed bounded rechecks. The contact sheet was inspected. Evidence: `validation/release-0.11.0/` in the external backup.
- After that acceptance, another session published the Snail-retirement merge `fcfd6c9c328b608abf14159cf378fa42d4a82d3c`. History work paused to inspect the source and remote; main was fast-forwarded to preserve it. The current catalogue has 74 projects, with Snail's original records, complete assets and old-route redirects preserved. The concurrent worktree and all private branch refs remain untouched.
- Latest complete backup: `pre-history-full.bundle`, 3,623,654,386 bytes, SHA-256 `be206e810abbc302ea93faae407f48fa91478f8069d8870a0020dece8ea2c2dd`; bundle verification passed. `pre-history-state-final.json` records all 37 local refs and the 28 intended remote branch/tag refs. Earlier snapshots are retained too.
- Before untracking, all 8,314 current material binaries (6,927,584,962 bytes) matched both their Git blob and inventoried SHA-256/size/MIME publication receipt. They were removed only from the index; every local working file remains. The historical filter list contains 8,341 exact material paths. SVG/code/provenance and the required vendored `.tgz` remain tracked. The Git guard rejects even force-added material binaries.
