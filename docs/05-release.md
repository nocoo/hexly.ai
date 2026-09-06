# Versioning and releases

`package.json` is the only version source. Store `X.Y.Z`, display `vX.Y.Z` beside the site name, and expose the version plus full Git revision at `/api/live`. Vite emits this JSON as a static asset; it has `Cache-Control: no-store` and requires no server handler or storage.

The release policy comes from nmem `f1ee6f38-dc59-4f41-83c8-2a2663f32c31`.

| Command | Behavior |
| --- | --- |
| `bun run release` | Publish an untagged package version; otherwise choose patch, or minor when the last release is more than three days old or more than 500 lines changed |
| `bun run release -- patch` | Explicit patch bump |
| `bun run release -- minor` | Explicit minor bump, resetting patch |
| `bun run release -- major` | Explicit major bump, resetting minor and patch |
| `bun run release -- 0.1.0` | Explicit version, overriding automatic selection |
| `bun run release -- --dry-run` | Read-only preview; no install, file changes, fetch, push, tags, or remote release |

Run from a clean `main` checkout. The script rejects malformed versions, package downgrades, and existing tags. The initial release is explicitly `0.1.0`.

## Publish sequence

1. Verify GitHub authentication and the expected origin, fetch remote refs, and require local `main` to contain `origin/main`.
2. Select the version and generate grouped notes from commits since the preceding version tag.
3. Update the package version, synchronize `bun.lock` with Bun, and insert or replace that version's `CHANGELOG.md` section.
4. Commit only the manifest, lockfile, and changelog. Local Git hooks remain enabled.
5. Push `main` and watch the matching `ci.yml` run for that exact commit. All six quality dimensions must pass before the Deploy job.
6. Verify `https://hexly.ai/api/live`, the root document, compiled JavaScript/CSS, and the archived hexly.ai logo checksum.
7. Create and push an annotated `vX.Y.Z` tag on the verified commit, then create its GitHub Release with the generated notes and workflow link.

If CI or deployment fails, no tag is created. Fix the problem, commit it, and rerun the same explicit version; the changelog section is replaced rather than duplicated. If GitHub Release creation alone fails after the tag was pushed, create the missing release from that existing tag with `gh release create --verify-tag` and a notes file. Never move a published tag.

## CI/CD credentials and isolation

Repository Actions secrets:

| Name | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Deploy Worker assets and the `hexly.ai` custom domain |
| `CLOUDFLARE_ACCOUNT_ID` | Select the Cloudflare account |

The token needs Workers deployment permissions on the account, Workers Routes permissions for the zone, and the read permissions Wrangler requires for account/zone discovery. Keep token values in GitHub Secrets; local interactive Wrangler authentication is independent.

The workflow runs on pull requests, `main` pushes, and manual dispatch. Tests receive no deployment credentials. The Deploy job runs only for `main`, after the reusable quality workflow succeeds. It checks out the same Git SHA, uses locked dependencies, serializes production deployments, and rejects a revision superseded on `main` before deploying. Credentials are scoped to the Wrangler step.

After publication, inspect the actual remote workflow and public metadata. A successful local build or accepted upload alone is not release completion.
