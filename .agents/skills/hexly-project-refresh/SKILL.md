---

name: hexly-project-refresh
description: Refresh an existing catalogued Hexly project's metadata, theme/colors, website/live revision, and optional identity/brand assets from its upstream repository and live endpoint, keeping src/data/projects/<id>.json, docs/profiles/, R2 inventory.json, and /api/projects/<owner>/<repo> in sync. Use for 资料刷新, 项目信息同步, or checking stale project API metadata.
---

# Hexly project refresh

Refresh an already-onboarded catalogue entry so that `src/data/projects/<id>.json`, generated profiles, social cards, and `GET /api/projects/<owner>/<repo>` reflect the upstream product's current verified state. Read [the project contract](../../../AGENTS.md) and [the maintenance contract](../../../docs/29-project-maintenance.md) first.

## Guardrails

- **Archived projects**: Entries with `"archived": true` are excluded from batch refreshes unless the owner explicitly names them.
- **No external source dumps**: Never copy external project source files, `package.json`, `wrangler.*`, `README.md`, or `.txt` code dumps into `docs/sources/` or `artwork/`. Record only lightweight provenance fields in `src/data/projects/<id>.json`.
- **Immutable R2 versions**: Never overwrite an existing published R2 version path under `https://h.no.mt`. New or updated identity/icon/texture/social assets require a new versioned path and an updated `docs/assets/inventory.json` receipt via [hexly-r2-media](../hexly-r2-media/SKILL.md).
- **Evidence-only facts**: Only record revisions, colors, descriptions, and endpoints directly observed in the upstream repository, live `/api/live`, or `nocoo/nocoo` profile.

## Workflow

### 1. Inspect upstream state

1. Read `src/data/projects/<id>.json` and note `source.repositoryRevision`, `source.profileRevision`, `overview.verified`, `logo.sourcePath`, and `website`.
2. Inspect the upstream repository (local checkout if present, otherwise GitHub):
   - Current default-branch `HEAD` SHA and recent commits since `source.repositoryRevision`.
   - `README.md`, `package.json`, web entry (`index.html`, `site.webmanifest`), and theme/brand files.
   - Check whether the primary product icon/logo changed (`logo.sourcePath` or `brand/icons/*`).
3. If `website` is present and not a store link, fetch `GET <website>/api/live` to verify live `status`, `version`, and `revision`.
4. Check whether `nocoo/nocoo` profile description or section membership changed; if profile synchronization is needed, follow `sys1-github-profile`.

### 2. Update `src/data/projects/<id>.json`

Update only fields that actually changed or were newly verified:

- `description` (`en` / `zh`) and `source.description` when product positioning or tagline changed.
- `websiteSource` with the newly verified `<website>/api/live` status, revision, and date.
- `source.repositoryRevision` (and `source.profileRevision` if updated).
- `overview.verified` (`date`, `revision`, `sources`).
- `theme` and `colors` only if upstream palette tokens or artwork colors changed (preserve source citations).
- `logo.*` only if adopting a new upstream logo/icon (see Step 3).

### 3. Update identity, R2 assets, and social cards (when applicable)

- **Logo / icon changed**:
  1. Follow [hexly-logo-pipeline](../hexly-logo-pipeline/SKILL.md) for acceptance and sizing if promoting a new identity.
  2. Hydrate/build local derivatives (`bun run assets:build`) and inspect the upload plan (`bun run assets:r2 -- plan`).
  3. Publish under a **new** versioned prefix via [hexly-r2-media](../hexly-r2-media/SKILL.md), and update `docs/assets/inventory.json` and receipts. Keep binary working files out of Git.
- **Metadata/logo changed affecting share card**:
  - Check whether `src/data/social-cards.json` fingerprint is invalidated (`bun run social:build` / `bun run verify`); if so, regenerate and publish the updated `/og/<id>-...jpg` card per [the social card runbook](../hexly-r2-media/references/social-cards.md).

### 4. Regenerate derived files and verify

Run from the repository root:

```bash
bun run docs:profiles
bun run assets:check
bun run typecheck
bun run lint
bun run build
```

Run `bun run test:coverage` (or `bun run verify` / `bun run gate:commit`) before committing.

### 5. Commit and release boundary

- Commit the skill/catalogue/profile/receipt updates atomically; do not push or release unless explicitly asked.
- Publishing to production (`https://hexly.ai/api/projects/<owner>/<repo>`) happens via `bun run release` or trusted `main` CI -> Release deployment; edge cache (`max-age=3600` in Worker) refreshes within one hour after deployment.
