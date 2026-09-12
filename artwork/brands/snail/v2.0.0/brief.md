# Snail 2.0.0 — fragmented animal identity

The owner rejected Snail 1.0.0 on 2026-09-13 and commissioned a new GPT Image animal identity. This is a **brand release**, independent of Snail's 0.1.0 production candidate and authentication gate. Only hexly.ai may be written.

## Direction

A recognizable complete land snail: a terracotta faceted shell, mineral ink body, one nearby red point. Connected broad polygons follow the approved Frogie / Pew / Ocelot drawing family. The old outline mark and Eagle are not drawing references. UI and type retain the actual Hexly paper, ink, terracotta, Space Grotesk and Geist Mono tokens.

Three independently generated square concepts (Returning, Turning, Sheltering) will each receive a separately composed wide hero. No source is cropped into another aspect ratio. The chosen square is extracted at native resolution with only necessary white-matte removal and format/size exports. Hero output keeps the complete native frame. Repeatable spiral/trail textures are separately authored vector support graphics, explicitly distinguished from GPT-generated raster animal artwork.

## API and audit

Use the existing `artwork/logo-family/tools/generate_azure.py` through the configured Azure OpenAI v1 images/edits API, model `gpt-image-2`, high quality. Save exact prompts, ordered reference hashes, sanitized request/response, actual request IDs, raw PNG/C2PA bytes and decisions for every request. No automatic paid retry.

## Selection authorization

The owner's current instruction explicitly asks Codex to generate multiple candidates, select the best, validate, commit and publish. This delegates selection for **this Snail redesign only**. Record every exact raw hash with agent findings and `ownerReviewedExactBytes: false`; show untouched outputs. It does not claim the owner reviewed a particular image. Preserve rejected and superseded candidates too.

## File boundaries

- Requests/raws: `artwork/logo-family/snail/2026-09-13-*/`.
- New masters, export recipe, design/selection record: this new `artwork/brands/snail/v2.0.0/` directory.
- New immutable delivery: `public/brands/snail/v2.0.0/`; existing family comparison pipeline can publish the selected study separately.
- Catalogue, generated profile, necessary UI/schema/checker/tests and release docs: hexly.ai only.
- Preserve v1.0.0, its original backup, existing hashes and downstream adoption `fe5f72e8a0d960a81acadc5704a04e1c4ed4f607` as history. New source adoption remains pending until Snail consumes the published v2 assets.
- Grok w1:p7 and Pi w1:p8 are read-only reviewers. Codex is the only writer. No Snail or GitHub-profile writes.
