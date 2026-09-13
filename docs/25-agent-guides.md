# 25 · Agent guides and direct asset reuse

Every canonical catalogue, gallery, project, template and status page includes a
small **For agents / 交给 Agent** section. Its instructions can be read inline or
copied with one click. Copying is user-initiated, reports success locally, and
keeps selectable text plus a Markdown link available if clipboard access fails.

## One source for browsers and agents

`src/model/agent-guide.ts` derives instructions from the existing catalogue,
Video Kit manifest and immutable standard-outro records. The React section,
crawler HTML and generated Markdown use that same function. No second project
catalogue or per-project hand-written prompt is maintained.

| Page | Machine-readable guide |
| --- | --- |
| `/` | `/agents/index.md` |
| `/logos` | `/agents/logos.md` |
| `/projects/<id>` | `/agents/projects/<id>.md` |
| `/templates` | `/agents/templates.md` |
| `/templates/<template>` | `/agents/templates/<template>.md` |
| `/status` | `/agents/status.md` |

Every page advertises its guide with an HTML `link rel="alternate"` of type
`text/markdown`, also updated during client navigation. `llms.txt` links the
guides and source manifests. The Markdown files are ordinary small Worker
assets, generated alongside the canonical sitemap and HTML, and require no
JavaScript, credentials or live server rendering. The sitemap still indexes
canonical HTML pages; Markdown and hash anchors are alternate representations.

The inline/copy version includes current template choices and interface language;
the static Markdown represents the canonical page with default English choices. Uploaded local
screenshots remain in the downloaded composition setup, not in a public guide.
Consumers pin the published revision from `/api/live` before using kit source.
Local-only changes are not a published kit release.

## Standard outros

The five approved brand-only clips at `/templates#outros` are **standard outros**,
not project examples. Any clip can close any Hexly project. Download, verify its
hash and append the original file; do not regenerate it for a product. All five
appear on every template page. They remain light, silent, six-second clips; no
dark or intro MP4 is implied. Source template/ending IDs describe how a clip was
made and do not restrict where it can be used.

Each clip has a **Copy for agent** action and readable reuse instructions with
its exact MP4/still URLs, versions, SHA-256 values and production provenance.
The full-canvas HTML still can be reused as a deck closing slide. Original
geometry, colors, timing, license notices and existing R2 objects are preserved.

The new canonical machine index is `/templates/outros.json`, with
`usage: "reuse-as-is"`, `projectIndependent: true` and the `outros` array. It is
derived from the historical `src/data/template-examples.json` source rather
than copying its records. `/templates/examples.json` retains its original
payload and `#examples` remains a working anchor for existing consumers.

## Prompt provenance and identity boundaries

Project guides link original identity files and checksums, optional family
artwork, kit manifests and optional project recordings. They preserve the
distinction between official project identity and Hexly campaign artwork.

The existing **Read the exact generation prompt** archive now has a copy action
for its original fetched text. Retained/supplied artwork continues to expose a
**presentation brief**, not a fabricated generation prompt. Reuse and integration
instructions are clearly separate from those historical records. Copying a
prompt neither executes it nor grants an instruction to regenerate an identity.

Status guides explain the real API, UTC calculations, five-minute sampling and
seven-day retention; they do not embed or invent current health observations.

## Verification and maintenance

The agent-guide unit and HTTP tests compare every generated guide with its
canonical page and catalogue. Browser checks cover clipboard success/failure,
exact prompt copying, route updates, both languages/themes, desktop/mobile,
keyboard behavior and accessible disclosures. Standard-outro checks retain
asset hashes, old URLs and poster-only loading before playback.

When adding a catalogue project or template, use the normal existing manifest.
Its Markdown and discovery links are generated automatically. Do not add a
second per-project instruction file or upload these small documents to R2.

Local review on 2026-09-13 passed root TypeScript, Biome, build, 333 unit tests
with coverage, 164 browser checks including the complete gallery, and four HTTP
checks covering every generated guide. After adding the current language to
copied rendering commands, the 10 Agent browser checks, four HTTP checks and
17 related unit checks passed again. EN/ZH and light/dark screenshots at 1440 px
and 390 px are in the ignored `.video-work/agent-guides-review-vHeLa0/` folder.
This review is local only; it does not record a deployment or a published SHA.
