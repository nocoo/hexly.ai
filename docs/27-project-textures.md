# Independent project textures

The 2026-09-14 rollout extends the accepted Pi Agent Policy surface treatment
across the active catalogue, retaining archived work already accepted when the
owner narrowed the scope. Identity kits keep their original bytes and
versions; an optional `Project.brandTexture` selects a separate decorative pack.
This avoids re-uploading unchanged Logo, font, icon and Hero packages.

The accepted project-detail/screenshot/carousel work was released first as
[v0.13.0](https://github.com/nocoo/hexly.ai/releases/tag/v0.13.0), source
`7795f914a83145f257731e6ba3cf9d4101657d9f`. The second authorized minor release is
v0.14.0 after all new textures and R2 publication are complete. The owner waived
manual checkpoints for this batch; this does not mean the owner inspected each
new image personally.

## Inventory and scope

The [frozen inventory](brand-textures/2026-09-14/inventory.json) enumerates the
actual `src/data/projects/index.json`, not a remembered project list. It records
purpose, existing identity type, each distinct motif, preserved metadata/file/RGBA
hashes, prior kit manifests, real tokens and the exact authorization.

| Scope | Projects | Treatment |
| --- | ---: | --- |
| Active catalogue | 55 | Preserve Pi's approved 1.0.3; generate 54 new pairs |
| Archived catalogue, already accepted | 9 | Retain completed pairs; no further generation or redesign |
| Archived catalogue, other entries | 11 | Basic support only; preserve existing pages/assets and any unfinished source evidence |
| Total | 75 | 63 independent packs / 126 accepted light/dark canvases; Pi retained |
| Separate site identity / retired Snail | Outside catalogue | Preserve existing assets and historical URLs |

The [scope amendment](brand-textures/2026-09-14/scope-update.json) supersedes the
old inventory's request totals without changing its hashed historical bytes.
The stopped unfiltered scheduler is not resumed. The nine accepted archive pairs
are CCBackup, Uptime Kuma skill, Microsoft Teams Send-as Workflow, Image Stitch,
Faster Whisper skill, Task Notifier skill, MCP Work History, MCP Make Sound and
JSInst. Other completed but unreviewed raw images remain historical evidence and
are not adopted. Prepared archived replacement prompts remain unexecuted.

This is also the standing maintenance rule in `CLAUDE.md`: all batch enrichment,
redesign and new brand/media creation excludes archived projects by default.
They retain basic page, link, download, license/provenance and shared compatibility
support. Do not fill their gaps or expand their presentation unless the owner
explicitly requests work on a named archived project.

Original shapes, proportions, colors, fonts, Hero bytes and product-site palettes
remain authoritative. Generated surfaces are **Hexly campaign decoration**, never
replacement project identities or product releases. Original file and every
decoded RGBA pixel are regression protected. Historical Snail assets are unchanged.

Animals and birds use foliage appropriate to the actual identity's environment:
lily pads for Frogie, grassland seed heads for Pew, mopane-like paired leaves for
Ellie, river willow for Otter, orchard leaves for Dove. Flowers remain sparse and
muted. Existing animal exceptions among tools, including Hooky and R2Shot, keep
botanical environments. Material identities and legacy tools use purpose-specific
working surfaces, with shallow construction geometry and believable grain. Exact
original directions, including subsequently excluded entries, are in the inventory and
[the curated direction table](../artwork/brand-textures/2026-09-14/directions.tsv).

## Genuine generation and review

Use the unchanged Workflow GPT Image helper, Azure OpenAI
`/openai/v1/images/generations`, explicit `gpt-image-2.5-flare`, high, native
1024 × 1024, one image per independent theme. No reference image or font is sent.
Prompts, sanitized requests/responses, actual request IDs/usage when returned,
helper/recorder hashes and raw PNG hashes are retained under
`artwork/brands/<id>/texture-studies/2026-09-14-flare-rollout-01/`.

An initial overly fast batch received 141 HTTP 429 responses and seven native
outputs. The next paced attempt produced two more outputs before another 429;
its diagnostic returned Retry-After 25. Later successful responses explicitly
reported a limit of two requests per minute. The subsequent batch uses 35 seconds
between starts and stops on rate-limit/authentication failures. All attempts remain
recorded; no provider billing result is inferred for failed requests.
[Decision records](../artwork/brand-textures/2026-09-14/request-pacing-03.json)
preserve the actual observations and separate retry decisions.

Agent inspection uses complete contact sheets and native representatives.
`raw-review.json` records observations and exact-byte delegated acceptance before
exports; `selection.json` identifies the chosen run. Early Feedmaid and Discuz
Recovery outputs were rejected because tool surfaces contained ornamental foliage.
Their images remain preserved. A [recorded prompt revision](../artwork/brand-textures/2026-09-14/material-prompt-revision.json)
keeps the old prompts and focuses future material requests on orthographic,
continuous working surfaces instead of props or plant decoration.

Pew Game's first walnut pair was also retained but rejected for adoption because
its light/dark values were too similar and too brown. Its separate
[tone revision](../artwork/brands/pew-game/texture-studies/2026-09-14-flare-rollout-01/tone-revision.json)
requests ivory-washed and charcoal-stained material directly from the model;
the earlier PNGs are not recolored.

InfoViz's first pair retained the tracing-paper idea but was rejected because
its principal arcs stayed too narrow at the actual small specimen size,
particularly in the dark theme. Its [visibility revision](../artwork/brands/infoviz/texture-studies/2026-09-14-flare-rollout-01/visibility-revision.json)
prepared broader pressed geometry and clearer tonal shoulders. InfoViz and
InfoViz Builder are archived, so those replacement requests were canceled by the
scope amendment. The old raw images and exact prompts remain unchanged.

## Asset and page boundary

| Item | Location |
| --- | --- |
| Source brief, exact attempts and approval | `artwork/brands/<id>/texture-studies/<batch>/` |
| Independent package | `public/textures/<id>/v1.0.0/` |
| R2 namespace | `projects/<id>/textures/v1.0.0/` in `hexlyai` |
| CDN | `https://h.no.mt/projects/<id>/textures/v1.0.0/` |
| Canonical detail | `/projects/<id>#texture` |
| Standalone full-canvas review | `/textures/<id>/v1.0.0/review.html`, Worker HTML, `noindex` |
| Schema | `public/textures/schema-v1.json` |
| Active metadata | Existing project JSON: `brandTexture`, with legacy `brandKit.texture` fallback |
| Storage inventory / receipts | `docs/assets/inventory.json` / `docs/assets/publication.jsonl` |

Each pack includes unchanged native PNGs, full 1024px WebPs, 320px card WebPs,
exact theme prompts and generation/acceptance records, brief, license, usage,
provenance and checksummed manifest. Generated output rights follow applicable
provider terms; authored code/prompts/docs retain MIT. Existing identity/font
rights are separate and unchanged. No generated raster is described as SVG.

Full specimens preserve the complete square and stack on mobile. Text-bearing
areas use a single right-side background pseudo-element with separate opacity and
a soft edge mask; content remains opaque. Export selects an opacity no higher
than 0.45 with a conservative 4.7:1 pixel contrast target across actual normal and
hover surfaces. Real styles also clear the former repeated background image, so
it cannot bypass that measured layer. Standalone light specimens keep explicit
ink text even when the OS is dark.

Agent guides expose the current PNGs, exact prompts, manifest and usage links for
adopted packs, including preserved completed archives. Other archived pages keep
their existing basic support. Profiles and crawler snapshots derive these
from the same catalogue. Project routes and canonical sitemap entries do not
change; new standalone texture documents are not added to the sitemap. Binaries
remain ignored and on R2; Worker deployment continues to enforce its 20 MiB limit.

## Maintenance and acceptance

Read [the project texture skill](../.agents/skills/hexly-brand-textures/SKILL.md)
and its [independent-pack runbook](../.agents/skills/hexly-brand-textures/references/independent-packs.md).
Use a fresh version for changed public bytes, verify hashes, and retain historical
packages. Stop image writers before inventorying material files. Publish and verify
R2 objects before the site release. Neither a texture update nor R2 publication
changes a source application's version or authorizes work in another repository.

Relevant acceptance checks are `project-textures` unit/HTTP/browser suites,
existing original-brand regressions, typecheck/build and normal CI/release gates.
The original identity tests cover file bytes and decoded colors; texture tests
cover approved sources, manifest/schema, contrast records, whole-canvas delivery,
active/archived discovery, narrow screens and download handling. The publication
receipt and the exact-SHA site release establish completion beyond local exports.

The [generation result](brand-textures/2026-09-14/generation-complete.json) records
63 selected packs, 126 accepted native canvases, nine rejected originals and ten
unreviewed archived originals retained as evidence. The
[local acceptance](brand-textures/2026-09-14/local-acceptance.json) records the
425 unit and 144 desktop/mobile browser checks, build boundary and inspected
snapshots. The [scoped R2 plan](brand-textures/2026-09-14/publication-plan.json)
lists 1,320 immutable objects (277,540,513 bytes), including the source evidence;
actual successful uploads and byte/MIME checks are recorded separately in the
append-only publication receipts.
The [completed publication](brand-textures/2026-09-14/publication-complete.json)
confirms all 1,320 objects against that plan before the website release.
