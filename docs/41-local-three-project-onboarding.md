# Local onboarding: Mao, HN Today and Pi Superagent

Scope: Hexly-only local review, requested on 2026-11-12. The owner subsequently
authorized a Hexly patch release and synchronization of the three GitHub Profile
entries. The three source repositories remain out of scope. Profile commit
`2275b837ffb57598ea93c424e3f8ee5e488ce406` was committed locally; the
[profile snapshot](sources/profile-onboarding-2026-11-12.json) records its entries.
The three named R2 packages and the new texture schema were published and verified
at 2026-11-12 10:01 UTC; their 390 immutable-object receipts are in
[`publication.jsonl`](assets/publication.jsonl). At that preparation checkpoint,
remote Git refs and production services had not yet been changed. The actual
release and scheduled status observation require their own verification.

## Source evidence and category

All three are stored as `tools`. The [release-time repository snapshot](sources/onboarding-repositories-release-2026-11-12.json) and [initial intake](sources/onboarding-repositories-2026-11-12.json) record their public,
non-fork and non-archived status on the inspection date. Pi Superagent explicitly
retains the domain-model lineage of DeepSeek's dsh-superagent prototype while
replacing the execution runtime with Pi.

| Project | Source revision | Website evidence | Source identity |
| --- | --- | --- | --- |
| Mao | `8ae89c7da213d3d493f20b44e6573737a2a8de74` | `https://mao.hexly.ai/api/live` returned HTTP 200, `status: ok`, version `1.1.0`, JSON and `no-store` at 2026-11-12 09:52 UTC; `build-info.json` reported the same revision | Existing `assets/favicon.svg`, exact bytes preserved from initial intake and rechecked at the new revision |
| HN Today | `9092937006c47e84dddf57249023b3d985d18944` | README names an intended origin, but it was not verified online | No independent source Logo found; Hexly candidate only |
| Pi Superagent | `c5d6b104f3ca7a4a0fc8105eaff132a0f0eb9c57` | Loopback development panel; no independent public website verified | No independent source Logo found; Hexly candidate only |

Mao previously returned HTTP 404 during intake, then returned healthy JSON on the
release-time direct check above. It is a status target at `https://mao.hexly.ai/api/live`;
a target or direct check is not a successful scheduled observation. HN Today and Pi Superagent do not gain invented public
health endpoints. The three additional personal targets remain last.

## Identity and texture decisions

| Project | Approved source / finishing | Presentation icon | Texture pack | Exported contrast, light / dark |
| --- | --- | --- | --- | --- |
| Mao | `mao/2026-11-12-02/01`, worn upright star | `/icons/mao/v1.0.0` | `/textures/mao/v1.0.1` | 6.885 / 6.752 |
| HN Today | `hackernews-on-this-day/2026-11-12-01/02`, desk calendar | `/icons/hackernews-on-this-day/v1.0.0` | `/textures/hackernews-on-this-day/v1.0.2` | 5.561 / 5.603 |
| Pi Superagent | `pi-superagent/2026-11-12-01/02`, robot head | `/icons/pi-superagent/v1.0.0` | `/textures/pi-superagent/v1.0.2` | 4.791 / 5.778 |

The owner approved each exact logo and all six exact 1024-square texture sources.
The star's earlier rejection and subsequent selection are retained together;
unused generations remain separate. Texture sources, prompts, decisions,
foreground extraction, contrast results and frozen exports are stored in the
individual studies and local manifests. No product UI or source-logo adoption
is claimed. Failed local export attempts remain under ignored `.video-work/`;
they were never uploaded and are not active versions.

## Verification and remaining handoff

- Isolated Vite/Chromium checks cover each project detail and static study at
  desktop and mobile sizes, both themes, artwork modes, image decoding, texture
  assets, README links, candidate disclosures, palette copying and downloads.
- `bun run verify` passed in 144.8 seconds on the draft worktree, including
  typecheck, lint, current/public archive and social checks, G1/G2, 323 unit tests,
  136 asset tests, build, deploy dry run, 28 HTTP tests and 84 Chromium journeys.
  These are local results, not CI or deployment evidence.
- The separate full-history `bun run assets:check` remains blocked by
  [six missing historical inputs](assets/history-recovery-2026-11-12.json),
  representing eight paths; no historical check was weakened.
- `git diff --check` reports a final blank line in the three generated texture
  licenses. These already-published files match their immutable manifests and
  receipts, and were not rewritten; configured quality gates remain unchanged.
- The owner authorized the Hexly release and renewed the expired Wrangler login.
  All 389 project objects plus the new schema were uploaded and independently
  reverified for full bytes and MIME. Preserve the append-only receipts and do not
  overwrite historical objects. Commit the catalogue references and rerun the
  required push and CI gates before deploying.
- At the preparation checkpoint, the authorized Profile entries were committed
  locally with the same emoji and English descriptions as this catalogue; their
  remote push and Hexly deployment were not yet verified. Source adoption,
  source-repository releases and the first public status observation remain
  separate. Coordinate with source-repository writers before touching their worktrees.
