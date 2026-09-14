---
name: hexly-brand-textures
description: Design, generate, review and integrate product-specific light/dark background textures for Hexly project archives and cards. Use for 底纹、背景材质、植物纹理 and approved texture rollouts; preserve existing project Logos and distinguish habitat-based animal/bird surfaces from physical-tool materials.
---

# Hexly brand textures

Create a recognizable supporting surface for the selected project, with visible
detail at actual page size and quiet, readable text areas. Work in hexly.ai;
texture work does not change a product's Logo, palette or independent website.
Default every rollout to non-archived projects. Archived entries receive basic
support only: preserve completed textures, existing pages/downloads and provenance,
but do not generate, replace or complete missing surfaces without an explicit
owner exception for that archived project. Preserve unfinished source evidence
without treating it as approved production art.
Read [CLAUDE.md](../../../CLAUDE.md),
[identity rules](../../../docs/02-identity-rules.md), the selected project's
`src/data/projects/<id>.json` and actual `src/styles/base.css` tokens first.

## Choose the right visual language

The owner confirmed these distinct directions on 2026-09-14:

| Existing identity family | Background direction |
| --- | --- |
| Animals, including the Web SaaS animal family | Botanical surfaces related to the animal's real habitat, led by relevant leaves or foliage. Flowers are optional, restrained and ecologically appropriate. |
| Birds, including the native macOS bird family | Leaves, stems and occasional flowers from the bird's environment; choose vegetation related to its habitat, perch or nesting context. |
| Skeuomorphic 3D objects, including material-series tools | A credible material or working surface associated with the tool's purpose: grain, pressed markings, a service mat, an engineering grid, etc. |

Inspect the approved identity and product evidence; do not classify from the
repository name alone. Respect approved exceptions. When the animal's exact
species is not established, record a plausible broad habitat without inventing
biological specificity. Wetland foliage and woodland foliage are different
design decisions; do not give every animal tropical leaves or decorative roses.

For animals/birds, use habitat-related botanical geometry, not the tool family's
instrument grids or contact traces. Start with leaves; add flowers only when
they serve the habitat and composition. Keep petals small, sparse and low in
chroma. Neither a bright bouquet nor dense vegetation should compete with the
Logo. For 3D tools, research the core interaction and relate it to a physical
context before selecting marks or grain. Do not spread Pi's reset motif across
other tools. These are direction rules, not a request to redesign other projects.

Use Hexly's real page palette, type and restrained red-point language around
the unchanged project Logo. Logo colors remain authoritative. Natural colors
can appear as limited, quiet accents; they must not turn the archive into a
different brand. The texture conveys an analogy, not a product feature, health
state, security guarantee or literal technical diagram.

## Generate and retain the evidence

- Read the current Workflow `agi-image-generation` skill from the repository
  root at `../workflow/agents/skills/agi-image-generation/SKILL.md`.
  The owner selected **`gpt-image-2.5-flare` for decorative textures**;
  this agreement persists. Logos/primary identities use Sunburst in a separate
  task. Do not add an unnecessary Sunburst pass to an approved Flare surface.
- Write a brief linking product/animal evidence → environment/material → motif.
  Create separate light/dark prompts with actual tokens, shallow believable
  relief or natural surface detail, spacious composition and lines that remain
  visible around 250–320 CSS px. Avoid a UI screenshot, central emblem, text,
  frame, noisy grunge or a second focal object. Keep dark detail legible.
  Keep material prompts separate from botanical prose: even a shared phrase
  such as "leaf veins" can pull tool outputs toward unwanted foliage. For a
  working surface, ask for an orthographic continuous material with marks pressed
  into it, rather than props arranged on a sheet. Reject plant ornaments or
  literal objects when they contradict that project's brief.
- Request the intended complete native canvas. For the current square specimen
  UI, native 1024×1024 is the proven starting size. If repetition is wanted,
  request edge continuity and interior clearance in the prompt. That request
  is not proof of a seamless result.
- Use the actual helper/API and record the selected model, exact prompt,
  sanitized request/response, returned request ID/usage when available,
  helper revision, raw dimensions/bytes/SHA-256, source rights and result count.
  Keep raw PNGs unchanged, including their metadata. Never archive credentials,
  fabricate generation receipts or describe GPT raster output as hand-drawn SVG.
- Archive each run under `artwork/brands/<id>/texture-studies/<date>-<model>-<batch>/`.
  The pilot's wrapper is an example, not a batch runner to replay under Pi's ID.
  Preserve failed/unknown outcomes; do not silently retry paid calls or change
  model after an error.
  Use [the recorded batch runner](scripts/generate.py) when useful. It defaults
  to a dry run and one worker with 35 seconds between starts; the 2026-09-14
  provider returned a limit of two requests per minute. Read current returned
  limits/Retry-After rather than assuming this quota is permanent. The runner
  stops scheduling on 429/401/403. Inspect failures before explicitly choosing
  a later attempt, keep successful outputs, and preserve the old prompt when
  writing a revised prompt in a new attempt directory.
- Show untouched outputs and record exact-byte owner approval (or an explicit
  delegated acceptance) in `raw-review.json` before production derivatives or
  integration. Reuse approval already given for those bytes; publication
  authorization is separate and may already be present in the conversation.

## Preserve composition; adapt the page

Inspect the entire image and actual-size light/dark specimens. For a repeating
surface, also inspect a 2×2 or 3×3 repeat at the intended scale. If edges do not
join, use a single complete canvas or request a new generation when authorized.
Do not crop, stretch, mirror, trace or patch it to pretend the original is seamless.

Keep the raw PNG download byte-identical. A same-size WebP delivery encoding is
sufficient; the pilot used quality 90, effort 6. No SVG wrapper or vectorization
is needed for a raster texture. Separate whole-canvas specimens from quieter
card/intro/caption backgrounds. Use a background pseudo-element with its own
opacity/mask; text and Logos stay fully opaque. Tune contrast on rendered pixels,
not prompt hex codes. Keep ordinary text at least 4.5:1 in both themes and retain
visible pattern detail in the specimen. Pi's opacity is a measured precedent,
not a universal setting for different art.

Reuse `brandTextureAsset`, `brandTexture`, `BrandKit`, `assetUrl` and `AssetLink`.
The current catalogue texture fields are bilingual `name`/`description`,
`format: "webp"`, `display: "single"` (or proven `"repeat"`) and the actual
`model`. Omitted format/display retain historical SVG/repeat behavior. Inspect
the existing CSS when onboarding a new project: preserve the full square on
mobile, stack specimens when needed, and keep the `#texture` smooth-scroll offset.
Use exact light/dark prompt links and the shared Agent guide, without labeling
new integration prose as an original generation prompt.

## Version, review, publish

For a texture-only change, use an **independent texture pack**, not a copied
identity kit: `public/textures/<id>/v<X.Y.Z>/` maps to
`projects/<id>/textures/v<X.Y.Z>/` in R2. Select it with optional
`Project.brandTexture`; `brandKit.texture` remains the historical fallback.
Read [the pack runbook](references/independent-packs.md) for schema, export,
discovery and publication. Existing animal Logos still get habitat foliage even
when the product is a tool; archive status never changes as a side effect.
The batch runner excludes archived entries even when an old inventory lists them
for generation. Reuse reviewed completed outputs without new generation.

Full identity/campaign revisions still use `artwork/brands/<id>/v<X.Y.Z>/` and
`public/brands/<id>/v<X.Y.Z>/`. Preserve old packages, original Logo/RGBA hashes,
fonts, icons and Hero bytes. Format mutable source before export; never rewrite
inventoried or published bytes. Export-time state is historical; upload receipts
and the site release establish later publication.

For a local review, use `VITE_LOCAL_MATERIALS=1` in ignored
`.env.development.local` and the existing `https://index.dev.hexly.ai` server.
Do not put this flag in `.env.local`; production and tests must retain CDN URLs.
Check homepage card, project intro, texture specimen and standalone archive on
desktop and narrow mobile, both themes; inspect screenshots, overflow, full
composition, text contrast and original downloads. Run affected asset/model
tests, typecheck/build and required repository gates; reuse valid evidence when
only documentation changes. Keep screenshots under ignored `.video-work/` and
small durable inspection records with the source recipe.

Only within an authorized publication, use the
[R2 skill](../hexly-r2-media/SKILL.md): inventory → project-scoped plan → publish →
verify. Keep binaries out of Git/deploy, preserve old URLs and receipts, then use
[the normal exact-SHA release](../../../docs/05-release.md). Verify production
page/card, both themes, PNG/WebP/prompt/manifest URLs and actual hashes. This skill
does not authorize a catalogue-wide rollout, other-repository edits or npm work.

For exact accepted prompts, placement measurements and the no-repeat decision,
read [the Pi Agent Policy precedent](references/pi-agent-policy.md).
