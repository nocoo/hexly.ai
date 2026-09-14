---
name: hexly-brand-textures
description: Design, generate, review and integrate product-specific light/dark background textures for Hexly project archives and cards. Use for 底纹、背景材质、植物纹理 and approved texture rollouts; preserve existing project Logos and distinguish habitat-based animal/bird surfaces from physical-tool materials.
---

# Hexly brand textures

Create a recognizable supporting surface for the selected project, with visible
detail at actual page size and quiet, readable text areas. Work in hexly.ai;
texture work does not change a product's Logo, palette or independent website.
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

Create a new campaign version under `artwork/brands/<id>/v<X.Y.Z>/` and
`public/brands/<id>/v<X.Y.Z>/`. Preserve old packages, original Logo hashes and
decoded colors, fonts, icons and Hero bytes unless their change is authorized.
Keep identity/source adoption independent of the campaign version. Record
parent manifest hash, changed files, generation/derivative relationship, licenses
and file hashes. Format mutable source first; frozen/inventoried exports must not
be rerun or reformatted. Export-time local status remains a historical fact;
later upload receipts and site release establish publication.

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
