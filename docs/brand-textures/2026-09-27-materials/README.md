# Material texture review batch

The owner asked for the remaining skeuomorphic identities to receive
icon-related material textures that match the botanical series in palette,
coverage, fineness, shallow depth and visual weight. This batch covers all 21
active material identities and excludes archived Hermes Gateway. Each project
gets separate native 1024-square light and dark Flare candidates.

Generation and local review are authorized. Owner acceptance, production pack
export, catalogue integration, R2 publication and icon replacement are pending.
Original identities, previous texture versions and catalogue data are unchanged.

## Review

Run `node artwork/brand-textures/2026-09-27-materials/review.mjs` to rebuild the
local review from saved candidates, then use the existing development server:

<https://index.dev.hexly.ai/.video-work/material-textures/review.html>

The review shows the unchanged project icon beside separate light/dark surfaces
and accepted botanical references. Images link to the original PNG bytes. JPEG
copies under ignored `.video-work/material-textures/` are for agent inspection
only. Generated review HTML and images remain outside the deployment tree.

[Inventory](inventory.json) records source identity and metadata hashes, motifs,
version reservations and authorization. [Candidates](candidates.json) records
exact original hashes, pending owner acceptance and agent quality observations.
Requests, responses, original PNGs and review decisions stay under each project's
`artwork/brands/<id>/texture-studies/2026-09-27-flare-materials-01/` directory.
Generation failures and explicit later attempts are retained. Do not rerun a
successful request after an interrupted conversation.

## Deferred icon composition

After texture review, the owner wants existing icon artwork composited over the
generated light background. Preserve the subject rather than generating new
icons. Layer the light base, botanical/material texture and existing icon within
an iOS continuous-corner contour; a simple rounded rectangle is insufficient.
The page and App icon adoption targets belong to that later implementation step.
No icon replacement is part of this review batch.
