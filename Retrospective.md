# Retrospective

## 2026-09-06: Registry rewrite during release

The first release command used `bun install --lockfile-only` with the machine's temporary npm mirror. Bun rewrote 238 dependency source URLs even though no dependencies changed. The release driver was stopped before tagging, and the original lockfile was restored in a follow-up commit.

The release command now includes `--frozen-lockfile`. A temporary checkout with the package version advanced to `0.2.0` verified that this command succeeds and leaves the lockfile byte-for-byte unchanged under the same mirror configuration. Root package versions are not stored in `bun.lock`; dependency source changes do not belong in a version-only release.
