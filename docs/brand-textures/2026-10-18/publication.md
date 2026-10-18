# Publication authorization

The owner authorized publication with "发布上线， $sys0-release Y+1" on
2026-10-18. This extends the earlier local-only authorization without rewriting
the historical approval, export or package bytes.

The requested release is v1.5.0, from package version 1.4.2. The existing latest
annotated release is v1.4.0; origin/main already serves package version 1.4.2
at `fe8eb233b73746b909ab2310644c5bcc73676956`. Release notes use the existing
versioning helper's tag-to-HEAD comparison and include intervening maintenance.

## Asset scope

Publish the outstanding inventoried materials for Hexly, Base CI, Base CLI,
Base MCP, Next AI, Octo and Sleepy. This includes the six approved identities,
their preserved study archives, six new light/dark texture pairs and seven
updated presentation backgrounds. Zoo already has its approved presentation;
it receives no new assets. Earlier immutable export versions remain archived.

The initial plan contains 1,108 objects totaling 299.48 MiB without prior
publication receipts. Use the existing project-scoped publisher, with one
writer, immutable keys and complete-byte/MIME verification before recording
success. Existing receipts and objects are preserved. Credentials come from the
project-local Wrangler authentication for Zheng Li Workspace; no credentials
are archived. The destination remains `hexlyai` at `https://h.no.mt`.

Completion is established by the matching entries in
`docs/assets/publication.jsonl`, followed by the v1.5.0 GitHub Release and its
exact-revision CI/deployment links. Historical package text describing local
export is not retroactively edited to claim it was published at export time.

## Material publication result

All 1,108 pending objects (314,031,659 bytes) completed publication on
2026-10-18. The publisher verified complete CDN response bytes and MIME before
appending each receipt. A final comparison of the initial pending inventory
against the receipts matched every object key, SHA-256, size and MIME. No
existing receipts or immutable objects were replaced.

## Website release checkpoint

The site version remains 1.4.2; the v1.5.0 release has not started. A preflight
check found four source Logo revisions absent from GitHub:

| Repository | Catalogue source revision | Local state |
|---|---|---|
| base-ci | `21addbd41b72b82e8d9e2dbe1352be75305126e2` | Clean; identity commit not pushed |
| base-cli | `4fd686d49ed15473ef9d0c3436c90e601c2723d4` | Clean; identity commit not pushed |
| base-mcp | `240060f549a147a65d7358e22a96d58a6cd11fbe` | Clean; identity commit not pushed |
| next-ai | `61d2fd325dff69215b29be87a95843a15b471c84` | Diverged from remote main; uncommitted dependency edits |

GitHub commit API checks did not resolve these revisions. Octo's source
revision resolved successfully. Hexly's own source revisions are included in
the intended site push. Cross-repository synchronization requires owner
confirmation; no source repositories were modified or pushed during this
release preflight. Preserve Next AI's working changes and existing history.
