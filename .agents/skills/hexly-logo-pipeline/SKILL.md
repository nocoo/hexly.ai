---

name: hexly-logo-pipeline
description: Shared contract for Hexly logo generation, exact-byte approval, finishing, review pages, delivery and source adoption. Load it together with hexly-animal, hexly-birds or hexly-things: the series skill owns the subject and drawing language, this contract owns everything after the brief. Use for any logo generation, presentation-only pass, review page, catalogue preview or source adoption in a Hexly checkout.
---

# Hexly logo pipeline

Three series skills define what the artwork looks like. This contract defines how
it is made, approved, measured, delivered and adopted. They are never optional
alternatives: load the series skill first, then this file, then start.
- [hexly-animal](../hexly-animal/SKILL.md) — Web SaaS and browser-first services
- [hexly-birds](../hexly-birds/SKILL.md) — native macOS applications and menu-bar utilities
- [hexly-things](../hexly-things/SKILL.md) — CLI tools, libraries, scripts, agent extensions

Series skills declare `Contract: hexly-logo-pipeline v1`. When this contract
changes the pipeline in a way that invalidates a series instruction, bump the
version in all three skills in the same commit. A series skill may add subject
constraints; it may never weaken approval, extraction, delivery or adoption.

Product type decides the series, never the repository name, domain or landing
page. A CLI tool with a website stays a thing. Explicit owner art direction
overrides the default, and every existing approved identity overrides everything.
The catalogue keeps `family.series` at its current `material`/`character` values:
this contract adds no data field.

## Family constants

These are what make three different drawing languages read as one family. They
belong here, not in a series skill, because divergence between series is the
failure this structure exists to prevent.
- One native 2048 × 2048 source on a uniform opaque matte. Decode the returned
  dimensions and record them; never describe an upscale as native.
- The background is composed after approval, independently of the foreground:
  a project-specific tonal motif, fine grain, broad soft light and a shallow
  contact shadow. Each project gets its own motif geometry, colors and opacity;
  never reuse another project's pattern paths with new colors.
- The transparent foreground is the identity. Small sidebar, header, favicon and
  menu-bar marks use it without a tile, motif, glow or CSS corner mask. The
  square and rounded presentations serve large README, gallery and social uses.
- Every accepted source keeps its exact bytes, prompt, reference provenance,
  decision record and checksums. Nothing is overwritten; superseded work stays in
  its own numbered directory.
- One expression, one dominant mass, readable at `32 × 32`. Detail that vanishes
  at that size is noise, not identity.

## Stages

### 1. Brief

Read the project's actual repository README, purpose and primary interaction
before choosing a subject. Product descriptions come from the product, never
from the mascot's accessories. Resolve the project id in `src/data/projects/`
and read `docs/06-logo-family.md` plus `artwork/logo-family/README.md`.

Write `brief.md` in the new study directory. It records the product type, the
series, the chosen subject, what the owner asked for, and what is deliberately
left to the model. Keep the brief short: the series skill already supplies the
drawing constraints, so the brief adds identity, not specification.

### 2. Archive before generation

Create `artwork/logo-family/<project>/<YYYY-MM-DD>-<sequence>/` before calling
any model. Never reuse or overwrite an existing study. Save `brief.md`, the exact
submitted `prompt.txt`, ordered reference roles, and source paths, revisions and
hashes. Reference numbering in the prompt must match the submitted order.

### 3. Generate

Credentials and the endpoint contract live in the Workflow
`agi-image-generation` skill at `../workflow/agents/skills/agi-image-generation/SKILL.md`,
read from the hexly.ai repository root.
The helper is `artwork/logo-family/tools/generate_azure.py`; the current model
policy is `gpt-image-2.5-sunburst`, passed explicitly.

```bash
direnv exec /absolute/path/to/workflow \
  python3 /absolute/path/to/hexly.ai/artwork/logo-family/tools/generate_azure.py \
  --run-dir /absolute/path/to/hexly.ai/artwork/logo-family/<project>/<run> \
  --image /absolute/path/to/<liked-original>.png \
  --image /absolute/path/to/hexly.ai/artwork/logo-family/references/ref01.jpeg \
  --image /absolute/path/to/hexly.ai/artwork/logo-family/references/ref02.jpeg \
  --size 2048x2048 \
  --model gpt-image-2.5-sunburst
```

Adapt the reference list to the series: each series skill states which references
guide composition, which guide drawing language, and what must not be borrowed.
Historical `gpt-image-2` records and frozen tool snapshots stay unchanged.

Never retry a slow request automatically; a second call is a second paid
generation. Record a failed attempt before any deliberate retry.

### 4. Raw checkpoint

Immediately after a successful response, show the untouched image and its native
file link to the owner and ask for confirmation. Saving the response, recording
its hash and dimensions, and opening the original for inspection are the only
permitted actions before confirmation. Do not extract, clean edges, compose a
background, build derivative sizes, generate review pages or touch the catalogue.

Keep `raw-review.json` beside the request with `status: "pending"` and the exact
`imageSha256`. Record `approved` or `rejected` with the actual decision evidence.
Approval belongs to those exact bytes; a new generation always returns to
pending. A rejection keeps its image and feedback in its own study and the next
request gets a fresh directory. Elapsed time, agent satisfaction and approval of
another project never substitute for confirmation.

Inspect the returned image against the series checks before asking. Report real
deviations; do not reject a candidate merely because the model chose a different
angle, gesture, palette or optional accent than the agent imagined.

An explicit owner instruction may waive this handoff for named projects or a
defined batch. Record the exact instruction and scope in each study before
generation, then use `status: "approved"` with
`decisionSource: "owner-delegated batch acceptance"`, the exact hash, the
inspection findings and `ownerReviewedExactBytes: false`. This authorizes
processing, not a claim that the owner saw the image. The default checkpoint
stands for every other request.

### 5. Presentation-only passes

When the owner keeps an existing drawing and asks only for color, texture or
presentation work, follow [the retained-original route](references/retained-original.md).
Make no generation call and invent no model metadata.

A supplied illustration that is newly extracted or reframed is a
**reference adaptation**: preserve the exact source bytes, native dimensions,
lossless decode, extraction mask and every pass, and record `method:
"reference-adaptation"` with an exact-hash approved `source-review.json`. It is
not a byte-preserved original and not a generation success.

An explicit owner request may also integrate a subject, material and light into
one native scene. Record `sourceMode: "scene"`, prefer an easily extracted
foreground with independently composed light, and never claim that a flattened
scene already contains separate foreground and background layers.

### 6. Finish

Run the finisher from `hexly.ai` with a project-specific `presentation.json` and a
fresh numbered pass:

```bash
bun artwork/logo-family/tools/finish_study.mjs artwork/logo-family/<project>/<run> <pass>
```

Inspect the tool's actual behavior first; its settings are an editable recipe,
not a universal matte. Save the pass settings, the exact tool snapshot, the mask,
background and shadow layers, exports, previews and checksums. Format mutable
recipes before freezing the numbered directory; never reformat frozen artifacts.
- Extract only white connected to the exterior. Protect enclosed highlights and
  disconnected accents, and inspect antialiased edges on both light and dark.
  A near-white source needs its own sampled matte color.
- Pale subjects (ivory, white, cream) must not be unfilled by a naive color
  threshold: use a verified silhouette or region mask before edge unmatting, and
  never compensate by recoloring the subject.
- Keep fully opaque foreground RGB identical to the source; record any
  unavoidable edge unmatting. Keep a pure `#FFFFFF` derivative when the native
  matte is only near-white.
- Keep foreground, square tile, rounded tile, background motif and contact
  shadows as separate layers.
- Measure the visible foreground against the final rounded outline, not the
  rectangular bounds, and record radius, alpha threshold and nearest clearance.
  Intentional edge entries are recorded exceptions, not failures.

### 7. Deliver

Both review surfaces are mandatory and must contain the same information.

| Deliverable       | Contents                                                                                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Master files      | Transparent, square, rounded and pure-white masters; PNG at 2048, 1024, 512, 256, 128, 64, 48, 32, 24 and 16 px                                                                                                      |
| Static study page | `artwork/logo-family/<project>/<run>/review.html` on the shared `review.css` / `review.mjs` layout                                                                                                                   |
| Catalogue page    | A working Vite path `/logos/<project>` with the same before/after review                                                                                                                                             |
| Evidence          | Untouched generation, exact prompt, reference provenance, sanitized request/response, every pass with masks and checksums, sampled palette with coordinates, separate designed presentation colors, browser captures |

Each page shows: original and candidate side by side on the same field; Icon /
Transparent / White modes; light and dark; composition, drawing and material
notes; 128/64 px tiles, 32/16 px transparent specimens, the 24 px sidebar mark
and the 16 px browser tab; copyable palette with evidence; light/dark edge views;
downloads for every master plus the untouched generation and exact prompt.

Reference boards and the presentation-reference disclosure belong only in the
static study page and Git. Omit them from the React site. Use pathname
navigation for the gallery and each identity, never `?view=logos&project=...`.

For a local candidate, copy the curated files to
`public/logos/family/<project>/<run>/<pass>/` and add a `family` record with
`status: "review"`, the finishing number, update date, separate foreground
path/dimensions/hash, previous original, palette and direction notes. The
project's `logo` field describes the actual source repository and must not be
rewritten by a local preview.

Inspect desktop and mobile in a real browser through `index.dev.hexly.ai`: both
the static page and the site path, all modes and themes, clipboard, disclosures,
downloads, decoding and overflow. Archive the captures outside frozen passes.

### 8. Adopt

Read the shared surface audit in `docs/07-logo-usage-sop.md` before adopting.
Session authorization to replace and push is enough; do not regenerate approved
artwork or add another approval loop, and never promote a different project's
unselected candidate.
1. Copy the selected transparent master to the source project's root `logo.png`;
   keep square and rounded masters under explicit roles such as
   `assets/brand/icon.png`. Record study, pass, dimensions and hashes.
2. Inspect every real consumer: README header and localized variants, both
   sidebar states, small headers, loading and login views, badge previews,
   favicon metadata, touch icon, social image and platform manifests. Replace
   the referenced files, not just root `logo.png`, and use each platform's actual
   masking contract. Regenerate with the project's own toolchain, verify PNG
   alpha and every ICO resolution.
3. Run the source project's gates, review the diff, commit atomically and push
   when authorized. If the remote advanced, integrate without force and rerun.
4. Preserve every previous `public/logos/originals/` filename and checksum; use
   a new normalized versioned filename for the replacement whose `sourceUrl` and
   `repositoryRevision` point at the commit containing those exact bytes.
5. Mark the selected `family` record `status: "adopted"` and keep its complete
   public archive under `public/logos/family/<project>/<run>/<pass>/`. Older
   public roots stay immutable. `/logos/<project>` keeps the full review with the
   previous source preserved.
6. Update colors, sampled palette evidence and the project profile. Run
   `bun run assets:build`, `bun run docs:profiles` and `bun run assets:check`;
   verify historical manifests as well as active previews.
7. Follow `system0-github-profile` for catalogue and profile synchronization. A
   logo-only change does not invent a profile prose edit; any profile content
   change still requires the matching site change.
8. Make atomic Conventional Commits with explicit staged paths, never bypass
   hooks, and verify CI, the Cloudflare Deploy job and the public site before
   claiming publication.

When `workflow` has unrelated unpublished commits, publish skill changes from an
isolated checkout based on `origin/main`, then merge back. Never push an ahead
branch wholesale to publish unrelated work.

## Scope

A local preview, its `Refined` badge and a source adoption commit are three
separate facts. Record each one only when it happened.
