# Git history recovery and material hydration

The owner authorized this one-time history reduction on 2026-09-13, after the
R2 migration's release and production acceptance. Git keeps source code, SVG
geometry, manifests, prompts, licenses and asset receipts. Material binaries are
restored from immutable `hexlyai` objects at `https://h.no.mt`.

## A normal new checkout

```sh
git clone https://github.com/nocoo/hexly.ai.git
cd hexly.ai
bun install --frozen-lockfile
bun run build
bun run dev
```

An ordinary build and development server do not need the whole material archive.
For authoring or the complete verification suite, recover the materials first:

```sh
bun run assets:r2 -- hydrate --project frogie
bun run assets:hydrate
bun run assets:check
bun run assets:r2 -- url /brands/frogie/v1.0.0/favicon.ico
```

The renderer hydrates its selected project and fonts automatically. Hydration
checks hashes and does not overwrite existing local edits. The ignored local
asset cache and working copies are not deployment artifacts.

`assets:check-tracked` inspects the Git index, including files added with `git add
-f`. Pre-commit and CI reject image, font, movie, audio, ZIP, PDF and PPTX material
binaries. SVG source and the required vendored PptxGenJS code archive remain in
Git. Publish new materials and commit their small source/provenance records using
[the project skill](../.agents/skills/hexly-r2-media/SKILL.md).

## Original revisions and branches

The [commit map](assets/history-20260913/commit-map.tsv) translates old Git commit
IDs to their filtered counterparts. The [ref map](assets/history-20260913/ref-map.json)
records original and replacement branch/tag objects and peeled commits. These
maps describe the source rewrite; subsequent documentation/release commits are
new commits. The [audit](assets/history-20260913/summary.json) records what was
preserved and the recovery bundle checksums.

Code snapshots, authors, committers, commit messages and parent order are checked
for every mapped commit. Material-only commits are retained, even when their
filtered change is empty. Annotated tag names, tagger metadata and messages stay
intact. Asset version paths, bytes and published manifest hashes do not change.
Frozen provenance keeps the original recorded Git IDs; use the map to navigate
new source history. The original signed initial commit remains in the backup;
rewritten commits are not claimed to retain its GitHub signature.

Keep an old working directory if it contains unpublished work or linked
worktrees. Make a fresh clone elsewhere and move only reviewed patches onto the
new history. Do not merge the old main lineage back, force an old local branch
onto the new remote, or reset/stash another session's changes. In particular,
the Snail-retirement worktree remains untouched. Its published change, merged
into main at `fcfd6c9c328b608abf14159cf378fa42d4a82d3c`, is included in the
retained source history; do not re-apply that already integrated patch.

The original local `.git` may remain large because its worktrees, unpublished
branches and reflogs are preserved. The final measurement concerns a fresh,
ordinary remote clone, without shallow, filtered or shared-object options.
GitHub's hidden PR refs and server retention may keep old objects internally;
removing public references does not establish immediate server disk reclamation.

## Complete original-history recovery

Recovery files live outside the repository:

`/Users/nocoo/backups/hexly.ai/r2-migration-20260913T080642/`

- `baseline-full.bundle` preserves the v0.10.0 starting point.
- `pre-history-full.bundle` preserves the accepted R2 release and all local refs
  observed before removing tracked materials, including the independently
  published Snail retirement.
- `cleanup.bundle` adds the subsequent tracking guard and source-only tree.
- The ref inventories, material inventory/receipts, filter map and validation
  evidence are stored alongside those bundles.

Verify the recorded SHA-256 and run `git bundle verify` before recovery. Clone the
full bundle into a new independent mirror; importing the incremental cleanup
bundle requires the full bundle's prerequisite history. Inspect or extract old
files from that separate repository. Do not overwrite the active checkout or
force-push original refs as an incidental restore operation.

Filtered tags from before R2 hydration preserve their code history but no longer
contain the old binary inputs. Use the complete original-history backup when an
exact legacy build is required. For current materials, prefer the checked R2
inventory and hydration commands.

The final remote main/tag/Release/production SHA and ordinary-clone measurements
are recorded in the verification artifact attached to the maintenance release.
See [the execution plan](20-r2-assets-execution.md) and
[the storage contract](21-asset-storage.md) for publication and rollback rules.
