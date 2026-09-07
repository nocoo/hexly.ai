# Logo family workshop

Versioned studies for the personal project logo family. Art direction and decisions live in [the study guide](../../docs/06-logo-family.md).

```text
references/                  User-provided style boards and provenance
tools/                       Reproducible generation and image processing
frogie/2026-09-06-01/         First Frogie study
  raw/                       Untouched native model output
  finishing/01/              First extraction and presentation
  finishing/02/              Approved Frogie exports
  finishing/03/              Locally adopted background contrast refinement
  previews/                  Browser captures and review evidence
pew/2026-09-06-01/            Locally adopted edge-entry zebra, finishing 04
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
| Frogie | [2026-09-06-01](frogie/2026-09-06-01/notes.md) | Locally adopted pass 03; transparent app/browser marks | [Site path](https://index.dev.hexly.ai/logos/frogie) · [Static HTML](https://index.dev.hexly.ai/artwork/logo-family/frogie/2026-09-06-01/review.html) |
| Pew | [2026-09-06-01](pew/2026-09-06-01/notes.md) | Locally adopted motif pass 04; transparent app/browser marks | [Site path](https://index.dev.hexly.ai/logos/pew) · [Static HTML](https://index.dev.hexly.ai/artwork/logo-family/pew/2026-09-06-01/review.html) |
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

The active Bogo exploration is [study 05](bogo/2026-09-07-05/brief.md). Study 03's close portrait direction is retained; study 04 was rejected for showing the full animal. Natural anatomy must remain compatible with a tight head close-up: only a little real neck base or shoulder enters the crop, while the torso and limbs stay outside. The flower sprig is the sole multicolored interest point, with no rainbow nose freckles. A 135 mm animal-head portrait perspective guides the moment; the model chooses the exact angle and crop. The owner subsequently approved this exact result and authorized local finishing and adoption; see Current Bogo selection below.

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

An explicit owner waiver can delegate this checkpoint for a named batch. Archive that instruction before requesting images, inspect every returned result, and record the exact SHA with `decisionSource: "owner-delegated batch acceptance"` and `ownerReviewedExactBytes: false`. The 2026-09-07 Bogo, Neo, Dove, Raven, and Lyre batch initially had this authorization; the owner has since revoked it and paused adoption and publication. The source repositories are restored through local revert commits. Bogo returned to its liked original for a fresh, naturally proportioned shoulder composition and individual raw confirmation, then received local adoption authorization for study 05. Raven study 02 is the retained direction; study 03 is withdrawn because the owner rejected its left-side crop. The other studies are deferred. See [the feedback and restoration record](2026-09-07-owner-feedback.json). Keep all existing studies; five independent finished pages remain the eventual delivery after approval.

After the owner approves those exact bytes, create `presentation.json` with its project slug, evidence-backed/proposed colors, project-specific `background.pattern` geometry, matte settings, shadow settings, and export sizes. Each pattern has a name and SVG path layers in 1024-unit coordinates; a layer uses a `motif`, `highlight`, or `ribbon` tone and may have a `strokeWidth`. Omit `strokeWidth` for a filled shape. Each project supplies its own geometry, not a recolored shared stencil. Run a new numbered finishing pass:

```bash
bun artwork/logo-family/tools/finish_study.mjs "$study_dir" 01
```

Finishing reads only local files. It requires approval matching the raw image hash and refuses to replace an existing finishing directory. Each pass preserves its approval record, settings, tool snapshot, alpha mask, background, shadows, transparent master, square/rounded icons, previews, and manifest. Review thresholds for each animal's actual colors; pale or white silhouettes need their own matte assessment.

The Vite dev server serves each study's `review.html` through `index.dev.hexly.ai`. Shared `review.css` and `review.mjs` provide comparison modes, themes, size checks, palette copying, references, downloads, and the exact prompt. Study pages are outside the production build.

Every finished study also supplies the same complete comparison at `/logos/<project>`, with working refresh/history/share links. Reference boards and their disclosure remain exclusive to static HTML and Git. The finishing archive delivers all transparent/square/rounded sizes from 2048 to 16 px, a pure-white master, and exact intermediate layers. Background-only passes preserve the transparent and white bytes and record comparisons under `previews/contrast-<pass>/`; frozen earlier passes and browser evidence remain intact.

Full-body studies also record `framing.scale` and `framing.minimumClearanceAt2048`. The finisher checks visible pixels against the actual rounded outline, preserves the native unscaled extraction separately, and uses one consistent placement in every master. Optional `emission` entries save their native source masks and placed glow layers; rendered alpha must be nonzero. Firefly 10 finishing 02 is the first adopted example.

## Current Bogo selection

The owner approved `bogo/2026-09-07-05` and resumed complete finishing and source adoption for Bogo only. Finishing `04` uses the approved head close-up at 80%, a plain muzzle, one rainbow flower sprig, and the mineral horn-arch field. The original neck meets the bottom canvas; small separately archived facets complete the native clipped ear/horn tips and the lower-right shoulder. All opaque placed pixels are checked unchanged. No new image request was needed for finishing.

The nearest protected feature sits 133.98 px inside the 2048-pixel rounded outline. Earlier diagnostic passes, contour layers, masks, settings, source hashes, and sampled palette remain in the study. [Bogo's own review page](https://index.dev.hexly.ai/artwork/logo-family/bogo/2026-09-07-05/review.html) and [the catalogue path](https://index.dev.hexly.ai/logos/bogo) include the complete before/after and size delivery. Bogo's source checkout is updated locally; the other four projects and publication remain paused.

## Application usage

Frogie 03, Pew 04, Firefly study 10 pass 02, and Bogo study 05 pass 04 are adopted in the local source repositories. README headers use their selected rounded presentations. App marks and favicons use the transparent foreground without another tile or corner mask. The four individual static pages and Vite paths show these same roles. Publication remains paused.

Follow [the usage wiki and adoption SOP](../../docs/07-logo-usage-sop.md) for every later project. The [2026-09-07 audit](audits/2026-09-07-usage/) preserves the previous source state, exact-master comparisons, small-image alpha checks, and browser evidence.

## Retained-original batch

Nine owner-selected originals received presentation-only refinements with zero image-generation calls. Each study has source/provenance records, a presentation brief, a distinct texture recipe, frozen finishing 01, native and small exports, an adoption record, and an individual review.

| Project | Study | Review |
| --- | --- | --- |
| R2Shot | [2026-09-07-01](r2shot/2026-09-07-01/notes.md) | [Static HTML](r2shot/2026-09-07-01/review.html) · [Site](https://hexly.ai/logos/r2shot) |
| Hooky | [2026-09-07-01](hooky/2026-09-07-01/notes.md) | [Static HTML](hooky/2026-09-07-01/review.html) · [Site](https://hexly.ai/logos/hooky) |
| Zhe | [2026-09-07-01](zhe/2026-09-07-01/notes.md) | [Static HTML](zhe/2026-09-07-01/review.html) · [Site](https://hexly.ai/logos/zhe) |
| Lyre | [2026-09-07-03](lyre/2026-09-07-03/notes.md) | [Static HTML](lyre/2026-09-07-03/review.html) · [Site](https://hexly.ai/logos/lyre) |
| Shrike | [2026-09-07-01](shrike/2026-09-07-01/notes.md) | [Static HTML](shrike/2026-09-07-01/review.html) · [Site](https://hexly.ai/logos/shrike) |
| Wooly | [2026-09-07-01](wooly/2026-09-07-01/notes.md) | [Static HTML](wooly/2026-09-07-01/review.html) · [Site](https://hexly.ai/logos/wooly) |
| Noheir | [2026-09-07-01](noheir/2026-09-07-01/notes.md) | [Static HTML](noheir/2026-09-07-01/review.html) · [Site](https://hexly.ai/logos/noheir) |
| Dove | [2026-09-07-03](dove/2026-09-07-03/notes.md) | [Static HTML](dove/2026-09-07-03/review.html) · [Site](https://hexly.ai/logos/dove) |
| Neo | [2026-09-07-03](neo/2026-09-07-03/notes.md) | [Static HTML](neo/2026-09-07-03/review.html) · [Site](https://hexly.ai/logos/neo) |

The retained route uses `source.json`, `source-review.json`, and `brief.txt`, with `sourceMode: "retained-transparent"`. Native foregrounds remain byte-identical. Public archives use `source.png` and `brief.txt`; R2Shot and Hooky keep their native 920/900 px masters. See [the family guide](../../docs/06-logo-family.md), [usage SOP](../../docs/07-logo-usage-sop.md), and [batch audit](audits/2026-09-07-retained/).

## Viewfinder framing repairs — 2026-09-07

These four studies preserve liked identities while repairing hard crop boundaries. Each uses one native 2048 × 2048 Image 2 result, explicit batch acceptance, full extraction/finishing archives, sampled palettes, and complete individual before/after pages. The earlier Wooly and Noheir retained-original studies remain historical records; the studies below are their current source identities.

Checksummed SVG inputs in `input/` are frozen drawing layers, like the rendered copies and tool snapshots in `finishing/`. They are excluded from code formatting and accessibility lint; the live review HTML remains linted. Preserve their exact source bytes and recorded hashes.

| Project | Selected study / pass | Review |
| --- | --- | --- |
| Wooly | [2026-09-07-02 / 01](wooly/2026-09-07-02/notes.md) | [Static HTML](wooly/2026-09-07-02/review.html) · [Site](https://hexly.ai/logos/wooly) |
| Noheir | [2026-09-07-02 / 02](noheir/2026-09-07-02/notes.md) | [Static HTML](noheir/2026-09-07-02/review.html) · [Site](https://hexly.ai/logos/noheir) |
| Raven | [2026-09-07-04 / 02](raven/2026-09-07-04/notes.md) | [Static HTML](raven/2026-09-07-04/review.html) · [Site](https://hexly.ai/logos/raven) |
| Life.ai | [2026-09-07-01 / 02](life-ai/2026-09-07-01/notes.md) | [Static HTML](life-ai/2026-09-07-01/review.html) · [Site](https://hexly.ai/logos/life-ai) |

## Fifteen-project continuation — 2026-09-07

The owner waived intermediate human confirmation for these named batches and authorized source replacement and publication. Twelve projects use newly generated artwork; Xray, Pika and Gecko keep the original transparent bytes and receive independent presentation layers. Every project keeps its own review page.

| Project | Study / selected pass | Route | Static review | Catalogue |
| --- | --- | --- | --- | --- |
| surety | `2026-09-07-01 / 01` | Generated | [HTML](surety/2026-09-07-01/review.html) | [/surety](https://hexly.ai/logos/surety) |
| owl | `2026-09-07-01 / 01` | Generated | [HTML](owl/2026-09-07-01/review.html) | [/owl](https://hexly.ai/logos/owl) |
| ellie | `2026-09-07-01 / 01` | Generated | [HTML](ellie/2026-09-07-01/review.html) | [/ellie](https://hexly.ai/logos/ellie) |
| giraffe | `2026-09-07-01 / 02` | Generated | [HTML](giraffe/2026-09-07-01/review.html) | [/giraffe](https://hexly.ai/logos/giraffe) |
| steed | `2026-09-07-02 / 01` | Generated | [HTML](steed/2026-09-07-02/review.html) | [/steed](https://hexly.ai/logos/steed) |
| xray | `2026-09-07-01 / 01` | Retained original | [HTML](xray/2026-09-07-01/review.html) | [/xray](https://hexly.ai/logos/xray) |
| bat | `2026-09-07-01 / 02` | Generated | [HTML](bat/2026-09-07-01/review.html) | [/bat](https://hexly.ai/logos/bat) |
| rooster | `2026-09-07-01 / 02` | Generated | [HTML](rooster/2026-09-07-01/review.html) | [/rooster](https://hexly.ai/logos/rooster) |
| snaky | `2026-09-07-01 / 01` | Generated | [HTML](snaky/2026-09-07-01/review.html) | [/snaky](https://hexly.ai/logos/snaky) |
| codo | `2026-09-07-01 / 01` | Generated | [HTML](codo/2026-09-07-01/review.html) | [/codo](https://hexly.ai/logos/codo) |
| gaga | `2026-09-07-01 / 01` | Generated | [HTML](gaga/2026-09-07-01/review.html) | [/gaga](https://hexly.ai/logos/gaga) |
| pika | `2026-09-07-01 / 01` | Retained original | [HTML](pika/2026-09-07-01/review.html) | [/pika](https://hexly.ai/logos/pika) |
| backy | `2026-09-07-01 / 01` | Generated | [HTML](backy/2026-09-07-01/review.html) | [/backy](https://hexly.ai/logos/backy) |
| gecko | `2026-09-07-01 / 01` | Retained original | [HTML](gecko/2026-09-07-01/review.html) | [/gecko](https://hexly.ai/logos/gecko) |
| otter | `2026-09-07-01 / 02` | Generated | [HTML](otter/2026-09-07-01/review.html) | [/otter](https://hexly.ai/logos/otter) |

The [redesign audit](audits/2026-09-07-redesign/) and [ten-project audit](audits/2026-09-07-next-ten/) record source consumers, actual browser/native captures and publication. Native source artwork, raw checkpoints, prompt/brief, reference provenance, all finishing layers and checksums remain archived. Source revisions and platform rules are listed in [the shared usage SOP](../../docs/07-logo-usage-sop.md#fifteen-identities--2026-09-07).

## Three template materials — 2026-09-07

The owner-directed material series uses physical surfaces, complete object framing, pale project-specific engineering grids and separately projected hover shadows. Dotty is opaque checker ceramic; Matrix is layered black/green circuitry; Basalt is an obsidian-and-gemstone Forbidden City corner tower viewed from a shallower approximately 25-degree angle.

| Project | Selected study / pass | Static review | Catalogue |
| --- | --- | --- | --- |
| Dotty | [2026-09-07-01 / 01](dotty/2026-09-07-01/notes.md) | [Static HTML](dotty/2026-09-07-01/review.html) | [Site](https://hexly.ai/logos/dotty) |
| Matrix | [2026-09-07-01 / 01](matrix/2026-09-07-01/notes.md) | [Static HTML](matrix/2026-09-07-01/review.html) | [Site](https://hexly.ai/logos/matrix) |
| Basalt | [2026-09-07-02 / 01](basalt/2026-09-07-02/notes.md) | [Static HTML](basalt/2026-09-07-02/review.html) | [Site](https://hexly.ai/logos/basalt) |

[Basalt study 01](basalt/2026-09-07-01/notes.md) preserves the ordinary stone slab rejected by the owner. Its raw output and finishing pass remain archived and were never adopted. Study 02 follows the explicit architectural correction. Four native generation calls cover the complete batch, with exact-hash delegated acceptance recorded separately for each result.

See [the material audit](audits/2026-09-07-materials/) for native palette samples, rounded-outline measurements, matting decisions, source-app screenshots and publication evidence. Foreground, square, rounded and white masters share one placement; small application/browser marks use the transparent foreground. The workflow logo skill and [family guide](../../docs/06-logo-family.md#material-and-architectural-series--2026-09-07) preserve this explicit exception to the animal series.

## Remaining physical objects and PokePocket — 2026-09-07

| Project | Subject | Source commit | Native | Comparison |
| --- | --- | --- | --- | --- |
| pokepocket | Red-capped trainer turning with a Poké Ball | `019798f1c8` | 960 px | [/logos/pokepocket](https://hexly.ai/logos/pokepocket) |
| dogfight | Titanium F-22 desk model caught in a banking turn | `b5ab075a96` | 2048 px | [/logos/dogfight](https://hexly.ai/logos/dogfight) |
| pew-game | Walnut and brass prairie arcade joystick | `ee68b2dead` | 2048 px | [/logos/pew-game](https://hexly.ai/logos/pew-game) |
| signoff-now | Petrol enamel mechanical tally counter | `51b679fba8` | 2048 px | [/logos/signoff-now](https://hexly.ai/logos/signoff-now) |
| unseal | An opened green enamel and brass padlock | `61a55cdb43` | 2048 px | [/logos/unseal](https://hexly.ai/logos/unseal) |
| flow | Celadon mechanical keycap with a Chinese character | `f4a9e9464d` | 2048 px | [/logos/flow](https://hexly.ai/logos/flow) |
| arena | Walnut dual-dial chess clock | `4a9efd6690` | 2048 px | [/logos/arena](https://hexly.ai/logos/arena) |
| echo | A brass and navy pocket compass | `59730aa033` | 2048 px | [/logos/echo](https://hexly.ai/logos/echo) |
| deca | A midnight teal rotary desk telephone | `1f41b41255` | 2048 px | [/logos/deca](https://hexly.ai/logos/deca) |
| runner | Emerald enamel mechanical stopwatch | `a5d7861753` | 2048 px | [/logos/runner](https://hexly.ai/logos/runner) |
| geekhub | A folded newspaper in a forest-green reading folio | `d45713b5d3` | 2048 px | [/logos/geekhub](https://hexly.ai/logos/geekhub) |
| ipsafe | A green network cable tester with a short patch lead | `d8a28afb9e` | 2048 px | [/logos/ipsafe](https://hexly.ai/logos/ipsafe) |

The batch archive is [audits/2026-09-07-objects/](audits/2026-09-07-objects/). Each selected study has a complete independent `review.html`, exported masters/sizes, palette, exact-byte source decision, transparent edge inspection, rounded-framing report and source adoption provenance. The public `/logos/<project>` path keeps the full comparison without showing presentation-reference boards.

Eleven native 2048 px generations succeeded, one per physical-object project. PokePocket's two attempts failed at output moderation and returned no image; its selected study is an honest 960 px supplied-illustration extraction with documented resampling. Source app/header/favicon uses remain transparent, while README and platform presentations use the appropriate separate tile.

[Publication evidence](audits/2026-09-07-objects/hexly-publication.json) records the successful Hexly rollout and all twelve production-byte checks. [Source CI and deployment outcomes](audits/2026-09-07-objects/source-publication.json) preserve retries, subsequent fixes, and Dogfight’s outstanding credential dependency.

## Four new local studies — 2026-09-07

| Project | Selected study / pass | Static review | Local catalogue |
| --- | --- | --- | --- |
| Clip | [2026-09-07-02 / 01](clip/2026-09-07-02/notes.md) | [HTML](clip/2026-09-07-02/review.html) | [/logos/clip](https://index.dev.hexly.ai/logos/clip) |
| Fundly | [2026-09-07-01 / 02](fundly/2026-09-07-01/notes.md) | [HTML](fundly/2026-09-07-01/review.html) | [/logos/fundly](https://index.dev.hexly.ai/logos/fundly) |
| DreamRO | [2026-09-07-01 / 02](dreamro/2026-09-07-01/notes.md) | [HTML](dreamro/2026-09-07-01/review.html) | [/logos/dreamro](https://index.dev.hexly.ai/logos/dreamro) |
| Meowth | [2026-09-07-01 / 02](meowth/2026-09-07-01/notes.md) | [HTML](meowth/2026-09-07-01/review.html) | [/logos/meowth](https://index.dev.hexly.ai/logos/meowth) |

Clip restores the familiar ostrich, hat and feather spray in an offset portrait with a natural lower neck entry. [The earlier mantis](clip/2026-09-07-01/notes.md) remains rejected history. Fundly's lowered binoculars and Meowth's yarn each supply one multicolored animal interest group; DreamRO follows the physical-object series with classical equipment in front of a shield.

The four selected native 2048-square drawings came from five Image 2 calls. Every selected study has complete comparison modes, distinct paper relief, palette samples, all export sizes, transparent app/browser specimens and archived production layers. Source identities remain unchanged and `family.status` is `review`. Publication and site verification remain deferred to the owner. See [the batch record](audits/2026-09-07-new-four/README.md) for exact selections and the Clip correction.

## Basalt marble and candy colors — 2026-09-08

[Basalt study `2026-09-08-01 / 01`](basalt/2026-09-08-01/notes.md) preserves the selected corner tower and redraws its colors using the actual source project's candy palette. The low plinth and balustrade are white Hanbaiyu marble; blue, green, pink, pearl and yellow-gold brighten the roof and structural surfaces. The existing champagne construction grid and separate projected shadows preserve its architectural presentation.

One Image 2 request returned one native 2048-square drawing, accepted under the continuing named-batch waiver without claiming owner review of the new bytes. The full tower has 219.5 px rounded-outline clearance. All master roles, ten export sizes, source-palette evidence, native samples and frozen finishing layers are preserved. [Static HTML](basalt/2026-09-08-01/review.html) and [the local Vite page](https://index.dev.hexly.ai/logos/basalt) compare it with the previously adopted dark tower. The new selection is `review`; source adoption and publication remain unchanged.

The Meowth character redraw was paused by the owner after [two Azure attempts returned no image](meowth/2026-09-08-02/notes.md). The earlier silver-blue cat remains active; no alternate-provider request or replacement was made.
