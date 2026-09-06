# Logo family workshop

Versioned studies for the personal project logo family. Art direction and decisions live in [the study guide](../../docs/06-logo-family.md).

```text
references/                  User-provided style boards and provenance
tools/                       Reproducible generation and image processing
frogie/2026-09-06-01/         First Frogie study
  raw/                       Untouched native model output
  finishing/01/              First extraction and presentation
  finishing/02/              Approved Frogie exports
  previews/                  Browser captures and review evidence
pew/2026-09-06-01/            Natural edge-entry zebra candidate
```

Each study keeps its brief, exact prompt, sanitized request/response metadata, untouched model output, extraction mask, transparent artwork, icon exports, and review page. Use a new numbered study directory for each generation; do not overwrite previous results.

Previous originals retain their filenames and checksums. A study stays a candidate until selected. Adopted identities publish a curated copy in `public/logos/family/`; the full workshop and intermediate artwork stay outside Vite's production asset directory.

Generation uses the Azure Foundry endpoint and `api-key` authentication documented in `workflow/agents/skills/azure-gpt-image-cover/SKILL.md`. Credentials are supplied by workflow's direnv environment. No credentials or raw authenticated HTTP headers belong in this directory.

The workflow skill `zhengli-project-logo` captures the family rules, prompt template, review requirements, and source/site promotion flow.

For an approved existing identity, preserve its animal, camera, pose, expression, composition, and signature decoration unless the owner requests a specific change. For an explicitly disliked identity, preserve the animal and redesign camera, pose, framing, and decoration. Large animals use head portraits; small animals may use compact full-body poses.

## Studies

| Project | Study | Status | Review |
|---|---|---|---|
| Frogie | [2026-09-06-01](frogie/2026-09-06-01/notes.md) | Adopted on 2026-09-06 · finishing 02 | [Local review page](https://index.dev.hexly.ai/artwork/logo-family/frogie/2026-09-06-01/review.html) |
| Pew | [2026-09-06-01](pew/2026-09-06-01/notes.md) | Candidate · finishing 02 · source logo unchanged | [Local review page](https://index.dev.hexly.ai/artwork/logo-family/pew/2026-09-06-01/review.html) |

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

After inspecting the raw image, create `presentation.json` with its project slug, evidence-backed/proposed colors, matte settings, shadow settings, and export sizes. Run a new numbered finishing pass:

```bash
bun artwork/logo-family/tools/finish_study.mjs "$study_dir" 01
```

Finishing reads only local files. It checks the raw image hash and refuses to replace an existing finishing directory. Each pass preserves its settings, tool snapshot, alpha mask, background, shadows, transparent master, square/rounded icons, previews, and manifest. Review thresholds for each animal's actual colors; pale or white silhouettes need their own matte assessment.

The Vite dev server serves each study's `review.html` through `index.dev.hexly.ai`. Shared `review.css` and `review.mjs` provide comparison modes, themes, size checks, palette copying, references, downloads, and the exact prompt. Study pages are outside the production build.
