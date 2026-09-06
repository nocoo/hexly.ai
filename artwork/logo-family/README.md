# Logo family workshop

Versioned studies for the personal project logo family. Art direction and decisions live in [the study guide](../../docs/06-logo-family.md).

```text
references/                  User-provided style boards and provenance
tools/                       Reproducible generation and image processing
frogie/2026-09-06-01/         First Frogie study
  raw/                       Untouched native model output
  finishing/01/              First extraction and presentation
  finishing/02/              Approved Frogie exports
  finishing/03/              Local background contrast refinement
  previews/                  Browser captures and review evidence
pew/2026-09-06-01/            Natural edge-entry zebra candidate
firefly/2026-09-06-01/        Superseded smooth lantern study
firefly/2026-09-06-02/        Rejected sparse firefly-and-flame composition
firefly/2026-09-06-03/        Rejected enlarged insect character
firefly/2026-09-06-04/        Rejected cute firefly character
firefly/2026-09-06-05/        Unselected dark campfire scene
firefly/2026-09-06-06/        Reference-guided flight and flame in a clean night field
firefly/2026-09-06-07/        White foreground for separate night and glow layers
firefly/2026-09-06-08/        Second-eye correction on the clean foreground
firefly/2026-09-06-09/        Rejected fire/insect hierarchy
firefly/2026-09-06-10/        Dominant firefly with a small foreground flame
```

Each study keeps its brief, exact prompt, sanitized request/response metadata, untouched model output, extraction mask, transparent artwork, icon exports, and review page. Use a new numbered study directory for each generation; do not overwrite previous results.

Previous originals retain their filenames and checksums. Every new raw image stops for owner confirmation before extraction, backgrounds, derivatives, or catalogue integration. Its `raw-review.json` starts pending and records the decision for those exact bytes. After raw approval, finished candidates receive a curated local preview in `public/logos/family/<project>/<study>/<pass>/`, with a truthful review status and a separate candidate foreground record. The full workshop and intermediate artwork stay outside Vite's production asset directory. Source adoption and publication follow the current session's authorization.

Generation uses the Azure Foundry endpoint and `api-key` authentication documented in `workflow/agents/skills/azure-gpt-image-cover/SKILL.md`. Credentials are supplied by workflow's direnv environment. No credentials or raw authenticated HTTP headers belong in this directory.

The workflow skill `zhengli-project-logo` captures the family rules, prompt template, review requirements, and source/site promotion flow.

For an approved existing identity, preserve its animal, camera, pose, expression, composition, and signature decoration unless the owner requests a specific change. For an explicitly disliked identity, preserve the animal and redesign camera, pose, framing, and decoration. Large animals use head portraits; small animals may use compact full-body poses.

## Studies

| Project | Study | Status | Review |
|---|---|---|---|
| Frogie | [2026-09-06-01](frogie/2026-09-06-01/notes.md) | Local contrast pass 03; source retains adopted 02 | [Site path](https://index.dev.hexly.ai/logos/frogie) · [Static HTML](https://index.dev.hexly.ai/artwork/logo-family/frogie/2026-09-06-01/review.html) |
| Pew | [2026-09-06-01](pew/2026-09-06-01/notes.md) | Owner-selected local motif pass 04; source logo unchanged | [Site path](https://index.dev.hexly.ai/logos/pew) · [Static HTML](https://index.dev.hexly.ai/artwork/logo-family/pew/2026-09-06-01/review.html) |
| Firefly | [2026-09-06-01](firefly/2026-09-06-01/notes.md) | Superseded; both finishing passes preserved | [Archived static HTML](https://index.dev.hexly.ai/artwork/logo-family/firefly/2026-09-06-01/review.html) |
| Firefly | [2026-09-06-02](firefly/2026-09-06-02/notes.md) | Rejected: sparse visual mass; raw preserved without finishing | [Untouched raw](firefly/2026-09-06-02/raw/generated-white.png) |
| Firefly | [2026-09-06-03](firefly/2026-09-06-03/notes.md) | Rejected: intimidating insect anatomy; raw preserved without finishing | [Untouched raw](firefly/2026-09-06-03/raw/generated-white.png) |
| Firefly | [2026-09-06-04](firefly/2026-09-06-04/notes.md) | Rejected: generic cute character; raw preserved without finishing | [Untouched raw](firefly/2026-09-06-04/raw/generated-white.png) |
| Firefly | [2026-09-06-05](firefly/2026-09-06-05/notes.md) | Superseded and unselected; untouched scene preserved without finishing | [Untouched raw](firefly/2026-09-06-05/raw/generated.png) |
| Firefly | [2026-09-06-06](firefly/2026-09-06-06/notes.md) | Improved direction retained; clean foreground requested in study 07 | [Untouched raw](firefly/2026-09-06-06/raw/generated.png) |
| Firefly | [2026-09-06-07](firefly/2026-09-06-07/notes.md) | White source returned; rejected for missing second eye | [Untouched raw](firefly/2026-09-06-07/raw/generated.png) |
| Firefly | [2026-09-06-08](firefly/2026-09-06-08/notes.md) | Rejected: backward-facing eye perspective | [Untouched raw](firefly/2026-09-06-08/raw/generated.png) |
| Firefly | [2026-09-06-09](firefly/2026-09-06-09/notes.md) | Rejected: fire and insect compete; firefly must be primary | [Untouched raw](firefly/2026-09-06-09/raw/generated.png) |
| Firefly | [2026-09-06-10](firefly/2026-09-06-10/notes.md) | Finishing 02 adopted; 84% placement, safe rounded borders, independent night and glow layers | [Site comparison](https://index.dev.hexly.ai/logos/firefly) · [Static review](https://index.dev.hexly.ai/artwork/logo-family/firefly/2026-09-06-10/review.html) |

## Running a study

Create a fresh project/date directory and write its `brief.md` and `prompt.txt` first. Supply reference images in the exact priority order described by the prompt. The generator refuses to overwrite any existing request; a retry needs a new study directory.

```bash
direnv exec ../workflow python3 artwork/logo-family/tools/generate_azure.py \
  --run-dir "$study_dir" \
  --image public/logos/originals/frogie.png \
  --image artwork/logo-family/references/ref01.jpeg \
  --image artwork/logo-family/references/ref02.jpeg \
  --size 2048x2048
```

`study_dir` is the new directory containing the reviewed prompt. The response archive includes actual PNG dimensions and source checksums, with no credential values. The requested endpoint is Azure's OpenAI v1 `/images/edits`; it uses `api-key` authentication and multipart references.

New requests use the neutral filename `raw/generated.png`; the response records the actual source path. Earlier raw filenames remain unchanged. The owner-directed Firefly 05 scene includes its dark background and emitted light directly; its brief records this override to the usual isolated-white source. The raw checkpoint applies equally to complete scenes, which must not be treated as pre-separated foreground layers.

Immediately show the untouched returned image and ask for confirmation. Save actual owner feedback in `raw-review.json`; a new generation requires a new decision. Do not make the raw handoff wait for finishing or review pages.

After the owner approves those exact bytes, create `presentation.json` with its project slug, evidence-backed/proposed colors, project-specific `background.pattern` geometry, matte settings, shadow settings, and export sizes. Each pattern has a name and SVG path layers in 1024-unit coordinates; a layer uses a `motif`, `highlight`, or `ribbon` tone and may have a `strokeWidth`. Omit `strokeWidth` for a filled shape. Each project supplies its own geometry, not a recolored shared stencil. Run a new numbered finishing pass:

```bash
bun artwork/logo-family/tools/finish_study.mjs "$study_dir" 01
```

Finishing reads only local files. It requires approval matching the raw image hash and refuses to replace an existing finishing directory. Each pass preserves its approval record, settings, tool snapshot, alpha mask, background, shadows, transparent master, square/rounded icons, previews, and manifest. Review thresholds for each animal's actual colors; pale or white silhouettes need their own matte assessment.

The Vite dev server serves each study's `review.html` through `index.dev.hexly.ai`. Shared `review.css` and `review.mjs` provide comparison modes, themes, size checks, palette copying, references, downloads, and the exact prompt. Study pages are outside the production build.

Every finished study also supplies the same complete comparison at `/logos/<project>`, with working refresh/history/share links. Reference boards and their disclosure remain exclusive to static HTML and Git. The finishing archive delivers all transparent/square/rounded sizes from 2048 to 16 px, a pure-white master, and exact intermediate layers. Background-only passes preserve the transparent and white bytes and record comparisons under `previews/contrast-<pass>/`; frozen earlier passes and browser evidence remain intact.

Full-body studies also record `framing.scale` and `framing.minimumClearanceAt2048`. The finisher checks visible pixels against the actual rounded outline, preserves the native unscaled extraction separately, and uses one consistent placement in every master. Optional `emission` entries save their native source masks and placed glow layers; rendered alpha must be nonzero. Firefly 10 finishing 02 is the first adopted example.
