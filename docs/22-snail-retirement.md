# Snail catalogue retirement

The owner chose to merge Snail's local X Connector into Zhe. Zhe saves links through its existing website, Webhook and CLI, then its installed CLI periodically enriches pending X bookmarks using the local browser session. Zhe keeps its own authentication, Basalt interface and R2 storage.

This catalogue change is published only after Zhe's production migration and media verification pass. Snail is removed from the project index, discovery documents and the generated monitor list. The existing Zhe website remains `https://zhe.to`; the GitHub profile already has no Snail entry.

- `/projects/snail` redirects permanently to `/projects/zhe`.
- `/logos/snail` redirects to the preserved `/brands/snail/v2.0.0/review.html`.
- The original catalogue JSON is preserved byte for byte at `docs/sources/snail-retired-2026-09-13.json`. Existing numbered profiles and the popularity snapshot remain historical records.
- All Snail v1/v2 artwork, manifests, exports, licenses, source records and R2 objects remain available at their existing paths with their existing hashes. The shared `hexlyai` bucket and `hexly-status` database remain in use.

The current catalogue contains 74 projects: 54 active, 20 archived, 60 original identities and 14 emoji identities. Baseline tests continue to verify the original metadata and asset hashes, including retired Snail's two brand versions.

## Validation

- RED: catalogue retirement assertions failed in three cases; the new HTTP journey received 200 instead of the expected permanent redirect.
- GREEN: 323 unit tests, 127 HTTP tests and 350 desktop/mobile browser tests pass. Coverage is 99.59% statements, 98.74% branches and 100% functions/lines. TypeScript, Biome, isolation, asset verification and Worker dry-run pass.
- The generators preserve existing artwork bytes, historical manifests and numbered profiles. Publication remains gated on Zhe production verification and this branch's remote CI.

Raw test output and migration evidence live in Zhe's ignored `.artifacts/` directory. No private bookmarks, credentials or media are included in this record.
