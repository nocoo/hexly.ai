# Independent campaign texture packs

Use this path when only decorative surfaces change. Full identity kits, Hero,
icons, fonts and original Logo/RGBA bytes stay immutable. `Project.brandTexture`
selects the new surface; `brandKit.texture` is the fallback, including the Pi
Agent Policy 1.0.3 pilot. See [the rollout record](../../../../docs/27-project-textures.md).

## Intake and generation

Enumerate `src/data/projects/index.json`, then inspect each selected project's
actual identity and purpose. Exclude archived entries from new work by default;
they receive basic page/link/asset compatibility support only. The owner narrowed
the 2026-09-14 rollout while it was running: preserve completed accepted archive
pairs, retain unfinished evidence, and make no further archived image requests.
See the scope amendment beside the frozen inventory for the exact retained list.
Neither an old inventory nor a future “all projects” task overrides this rule.
The separate site identity and retired Snail remain outside this rollout.

Prepare a new batch inventory; the existing
`docs/brand-textures/2026-09-14/inventory.json` is a frozen example, never an input
to recreate the whole catalogue by accident. Each generation row provides `id`,
`action: "generate"`, `study`, independent `root`/`version`, bilingual design and
purpose, original file/decoded RGBA hashes, and the existing kit manifest hash.
Keep acceptance/publication authorization and real token sources with the batch.
Do not rerun its one-off `prepare.ts` in an existing study.

Write `<study>/light/prompt.txt` and `<study>/dark/prompt.txt`. The working-surface
example in `artwork/brand-textures/2026-09-14/revise-material-prompts.ts` deliberately
avoids the botanical prompt's leaf-vein wording. It describes continuous material
seen straight down, with geometry pressed into it rather than decorative props.
Use a project's own material analogy, never Pi's grooves for every tool.

From the Hexly root, using the actual read-only Workflow helper:

```sh
# Lists requests only. Use a new inventory path for a new production.
python3 .agents/skills/hexly-brand-textures/scripts/generate.py \
  --inventory /path/to/new-batch.json --project project-id

# Within existing generation authorization; no silent model changes or retries.
direnv exec ../workflow python3 .agents/skills/hexly-brand-textures/scripts/generate.py \
  --inventory /path/to/new-batch.json --project project-id \
  --jobs 1 --interval 35 --generate
```

Rate-limit and authorization failures stop scheduling. Read the exact diagnostic
and preserve its attempt. A separately chosen `--attempt 2 --failed-only` skips
successful earlier themes; a rejected image may be regenerated only after the
recorded visual decision. Put an amended prompt in the new attempt directory
before starting it. The runner never edits prior requests/prompts or fabricates
provider billing outcomes. The two-requests-per-minute response on 2026-09-14 is
an observation, not a permanent account setting.

Inspect each complete raw canvas, meaningful native-size representatives and
paired light/dark contact sheets. Record exact `imageSha256`, `status`, real
observations/evidence, and either owner or explicitly delegated acceptance.
For this delegated batch, `acceptance: "delegated-agent"` and
`ownerReviewedExactBytes: false` are mandatory. A theme's `selection.json` points
`run` to its accepted attempt. Reject a tool's inappropriate foliage or a
competing object even when its rendering quality is otherwise good. No review
command should approve unseen images merely because the API returned 200.

## Export and use

The schema is `public/textures/schema-v1.json`; cross-field validation is
`textureManifestProblems`. The catalogue validates the versioned project root,
scope, two-language copy, model, full-canvas display and surface opacity.

```sh
bun .agents/skills/hexly-brand-textures/scripts/export.ts \
  --inventory /path/to/reviewed-batch.json --project project-id \
  --output .video-work/texture-adoptions.json
```

The current exporter accepts the documented delegated acceptance. An owner-reviewed
new batch must adapt the exact acceptance check truthfully, not relabel it as agent
review. It refuses unknown partial outputs or inventoried namespace changes and
verifies original Logo/pixel and existing kit hashes. Reviewed packs contain:

- `texture-{light,dark}.png`: unchanged 1024² native responses, including metadata.
- `.webp`: same full canvas at quality 90; `-320.webp`: small card delivery at 84.
- Exact theme prompt, sanitized request/response and raw-review records.
- Brief, guide, license, provenance, checksummed manifest and responsive review HTML.

No crop, stretch, recolor, tracing or seamless-repeat claim. Full specimens use
contain/no-repeat, stacking on mobile. Cards, intro and caption use one square
pseudo-element, a gentle left-edge mask and independently measured opacity; text
and Logo remain opaque. The exporter measures native pixels over both normal and
hover surfaces, using a 4.7:1 target to leave a margin above 4.5:1. Confirm rendered
styles too: a legacy full-opacity `background-image` must not remain underneath.
In standalone reviews, light specimen text must stay dark even under a dark OS.

Add the returned `brandTexture` metadata to the existing project JSON for local
review. Use `projectTexture`, `brandTextureAsset`, `brandTexture` and `BrandTexture`
for both active and kitless archived entries. Reuse assets through `assetUrl` and
`AssetLink`. Agent guides, profiles, HTML snapshots and llms derive the active
pack automatically. Canonical project routes and sitemap stay unchanged;
standalone review documents are `noindex` and link back to `#texture`.

## R2 and publication

Local `public/textures/<id>/v<X.Y.Z>/` becomes
`https://h.no.mt/projects/<id>/textures/v<X.Y.Z>/`. Package-relative filenames are
already immutable; no extra hash suffix is needed. HTML remains a Worker document,
with streamed download enhancement; the source HTML also has an archive object.

After all file writers finish, follow the [R2 skill](../../hexly-r2-media/SKILL.md):
`inventory` → scoped `plan` → `publish --upload` → full-byte/MIME verification.
Keep rejected originals and inspection evidence in the source inventory too.
Do not put raw PNG/WebP or contact-sheet binaries into Git/deploy. Keep old
objects and receipts; new revisions use new texture versions. Update generated
profiles and publication records, then use the normal exact-SHA site release.
Verify canonical pages, active theme URLs, original downloads, and remote hashes.
