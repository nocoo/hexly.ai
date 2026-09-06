# Animal logo family

Frogie study 01, finishing 02, was approved and adopted on 2026-09-06. Frogie has a local finishing 03 contrast preview; Pew's finishing 04 replaces the shared background curves with its own stripe motif. Their source projects retain the previously adopted Frogie and original Pew. Firefly studies remain unadopted. Study 10 restores animal dominance from the owner JPEG: a broad-winged faceted firefly with a small tactile fire in the foreground, on a white source for separate night and glow layers. Every new generation stops for raw-image confirmation before finishing.

## Reading the references

The owner's `ref01.jpeg` and `ref02.jpeg` are archived in [the workshop](../artwork/logo-family/references/). They guide presentation; Frogie's original artwork guides its anatomy and drawing.

| Element | Observation | Family direction |
|---|---|---|
| Background | Animals sit in a related color field: gray on warm gray, white on ice blue, pink on blush, orange on peach. Lightness separates the subject from the tile. | Choose a quieter relative of the animal's dominant hue. Record proposed colors separately from existing project tokens. |
| Composition | Faces sit to one side, animals enter from an edge, and some heads rise from the bottom. Empty space balances their gaze and body weight. | Give every animal an intentional position. Retain approved compositions; use decoration as a counterweight. |
| Material | Broad soft illumination, matte surfaces, restrained highlights, shallow contact shadows, and barely visible background motifs. | Express animal volume through flat facets. Add quiet surface detail and soft separation from the background in the presentation layer. |
| Hierarchy | One expression dominates. Background ornament has very little contrast; limbs and accessories support the face. | Keep facial features readable and control facet density. Use fewer, larger planes where they improve recognition. |

Measured empty-background patches from `ref02.jpeg` are warm gray `#ACA59F`, ice blue `#EDF1F8`, blush `#FBCED3`, golden yellow `#FBC96A`, and peach `#FCAE8A`. These are JPEG sample averages, not recovered design tokens. Native coordinates and the sampling method are saved in [background-samples.json](../artwork/logo-family/references/background-samples.json).

## Drawing rules

- Build the animal from contiguous irregular polygons and triangles with clean shared edges. Flat colors within each plane describe volume through differences in hue and lightness.
- Show these facets across the animal's main surfaces. Smooth sculptural anatomy with a small patch of colorful inlays is insufficient, even when the presentation has tactile depth.
- Preserve a clear dominant hue. Place multicolored fragments in a limited accent such as Frogie's musical notes or Pew's tongue.
- Give every animal one secondary interest point extending into the surrounding negative space. An attached tongue, detached notes, or a separate flame qualifies; eyes, belly glow, and internal wing inlays alone do not. The pose or gaze connects this accent to the animal.
- Keep the face primary: larger planes across broad surfaces, smaller planes only where expression and anatomy need them.
- Use a consistent light direction and restrained highlights. Quiet tactile detail must leave the color planes legible at small sizes.
- Large animals use head portraits. Small animals may use compact full-body poses.
- Give the logo a substantial main mass. Broad head/body/wing areas supply visual fullness; distant accents and extended limbs do not. Keep the interest point close to the animal, avoid large internal gaps, and preserve safe borders without shrinking the animal into an illustration.
- For insects, use scale and restrained species cues without automatically adding cute faces. Avoid both intimidating macro anatomy and generic baby characters. Several small, naturally proportioned insects may support a richer owner-directed scene.
- Large portraits may enter naturally from a square frame's bottom or side. Let the neck and shoulders continue beyond the canvas; keep the face and expression intact. Do not terminate the neck with a circular medallion or a floating round cut. Keep important features clear of the final rounded corners, and distinguish intentional canvas-edge entry from accidental clipping.
- For an approved logo, preserve the animal, pose, camera, expression, composition, and signature decoration. For a logo the owner explicitly dislikes, preserve the animal and redesign the camera, framing, pose, and decoration.
- Design a distinct background motif for each project. Frogie's flowing curves, Pew's tapered stripe rhythm, and Firefly's light orbits share material and contrast, not identical paths. Save named pattern geometry in the recipe; merely recoloring another project's stencil is insufficient.

## Frogie study 01

The [first study](../artwork/logo-family/frogie/2026-09-06-01/brief.md) preserves the compact seated green frog, gentle three-quarter turn, open singing mouth, folded hind legs, planted forelegs, pale-yellow belly, and music notes rising toward the upper right. The body carries the lower-left visual weight; the notes balance it diagonally.

The adopted sage tile starts at `#DCE6CA`, a quieter relative of the artwork's yellow-green, distinct from the existing Frogie site primary `#21C45D`. The transparent foreground is the source repository's root `logo.png`; square and rounded masters live in its `assets/brand/`. The previous original retains its original path and hash in this repository. The promoted version, theme colors, sampled art colors, and source revision are recorded in [Frogie's project profile](profiles/01-frogie.md).

Local finishing 03 deepens the base to `#BBCB9E`, with light `#DCE6C6`, shade `#9DAF7D`, and motif `#617B47`. Motif opacity is 0.14, highlight opacity 0.32, and ribbon opacity 0.24. Its transparent master and pure-white derivative are byte-identical to finishing 02. The current comparison is available at [the local Frogie path](https://index.dev.hexly.ai/logos/frogie).

## Generation and finishing

1. Save the brief, exact prompt, and ordered reference roles before requesting an image. The original defines identity. For the first Frogie study, images 2 and 3 were presentation references. Subsequent studies use the approved Frogie as image 2 for drawing language, followed by the two presentation references.
2. Use Azure Foundry / OpenAI v1 with `gpt-image-2`, the existing workflow `azure-gpt-image-cover` skill's `api-key` authentication, and credentials loaded through direnv.
3. Request one high-quality 2048 × 2048 PNG on uniform pure white. The reference-guided request uses `/images/edits`. Verify the decoded dimensions; do not describe an upscale as native generation.
4. Preserve the returned PNG bytes, prompt, reference hashes, sanitized request, response metadata, request ID, and usage. Never save a key or authenticated headers.
5. **Immediately show the untouched returned image for owner confirmation.** The generator writes `raw-review.json` with a pending status and the exact image hash. Do not extract, clean, composite, resize, build a full review page, or integrate that image before confirmation. Record the owner's actual decision; rejected images and feedback stay in their original studies. A replacement is a new pending study.
6. After raw approval, remove white locally. The finishing tool requires `raw-review.json` to approve the exact source hash. Preserve enclosed white eye highlights, disconnected decorations, fine edges, and all source colors. Save the alpha mask and edge settings.
7. Compose the project-specific colored tile and soft shadows separately. Keep a transparent foreground master, a full square icon, and rounded presentation exports. Preserve intermediate layers.
8. Review the original and candidate together at artwork, app-icon, sidebar, and favicon sizes, on both light and dark backgrounds. Record actual limitations before promotion.

The raw checkpoint and complete finished review are separate handoffs. Do not delay the first handoff to produce the second. An already retained foreground may receive an explicitly requested background-only pass without another raw approval; record the existing selection or instruction rather than inventing a new confirmation.

The [official image guide](https://developers.openai.com/api/docs/guides/image-generation), checked on 2026-09-06, allows 2048 × 2048 for `gpt-image-2`. It documents multiples of 16, a maximum edge of 3840, a maximum area of 8,294,400 pixels, and an aspect ratio up to 3:1. High input fidelity is automatic; native transparent output is not supported by this model. White-background extraction is therefore a separate finishing step.

## Pew study 01

The [Pew candidate](../artwork/logo-family/pew/2026-09-06-01/notes.md) preserves the liked zebra, wink, ivory/charcoal stripes, and rainbow tongue. Its continuous neck enters from the bottom and right canvas boundaries. The face and ears remain clear of the final rounded corners. This replaces the old circular neck termination with a natural portrait entering the frame.

One native 2048 × 2048 generation and four finishing passes are archived. Pass 02 preserves every fully opaque source color and all sampled pale anatomy; its only component cleanup removes five disconnected residue pixels. Pass 03 deepens the original proposed `#E3DEEA` pearl-lilac field to `#BFB2CF`. Its light is `#E0D8E9`, shade `#9F8DB5`, and motif `#6D557F`, with the same contrast opacities as Frogie 03. Pass 04 retains these colors and the exact foreground/white bytes, replacing the reused curves with three tapered stripes fanning through the upper-left negative space and narrow relief highlights. Sampled animal colors and this presentation palette stay separate from Pew's current UI primary. The complete comparison is at [the local Pew path](https://index.dev.hexly.ai/logos/pew). The source and production Pew logo remain unchanged in this local review round.

## Firefly studies

[Study 01](../artwork/logo-family/firefly/2026-09-06-01/notes.md) produced a smooth teal firefly with a golden abdomen and faceted wing inlays. The owner requested broader fragmentation, an interest point outside the animal, and a unique motif. The exact raw image, both finishing passes, and static review remain archived as superseded. It is no longer the active catalogue candidate.

[Study 02](../artwork/logo-family/firefly/2026-09-06-02/notes.md) produced a strongly faceted full-body firefly with a separate flame. The owner rejected its sparse composition: an elongated body, spread wings, and a distant large flame did not form a visually full logo. Its native image and proposed sea-glass light-orbit background remain archived; no finishing or catalogue preview was created.

[Study 03](../artwork/logo-family/firefly/2026-09-06-03/notes.md) increased the occupied area with an enlarged head, gathered shell, and rounded abdomen. The owner rejected its frightening insect treatment and clarified that fullness must not come from simple magnification. Its large eye discs, hard shell, and hooked articulated legs require a different graphic abstraction. The exact native output and rejection remain archived without finishing.

[Study 04](../artwork/logo-family/firefly/2026-09-06-04/notes.md) produced a graphic character with crescent eyes, a rounded body, and a separate flame. The owner rejected it entirely and explicitly moved to a tactile three-dimensional campfire scene. Small surrounding insects should be neither frightening nor generically cute; physically plausible colors, scene relationships, and light should provide the fullness. The fourth raw image remains archived without finishing.

[Study 05](../artwork/logo-family/firefly/2026-09-06-05/notes.md) returned one native 2048 × 2048 dark campfire scene with split logs, coals, and four small fireflies. Its tall angular flame has a crystalline appearance, with materially detailed wood and ground. The untouched scene was displayed and opened in Chrome. The owner then supplied a new graphic reference before selecting this output; the scene remains unapproved and superseded, without an explicit aesthetic rejection. No finishing or catalogue integration occurred. Previous sea-glass background plans remain unselected in their original studies.

[Study 06](../artwork/logo-family/firefly/2026-09-06-06/notes.md) uses the newly supplied flight-and-flame image as the primary graphic reference. A byte-identical backup lives at `artwork/logo-family/references/firefly-flight-flame.jpeg`, with its original path and hash in the study's sources. One native 2048 × 2048 output preserves the hovering gesture, fanned wings, trailing luminous abdomen, and separate flame while increasing the combined mark's scale and replacing square pixels with connected facets. The integrated dark blue-green field has crescent, star, and cloud relief. The flame remains angular and somewhat crystalline. The owner called this an improvement and requested a clean source for separate background and glow composition. Its exact bytes remain the next study's reference, without finishing or adoption.

[Study 07](../artwork/logo-family/firefly/2026-09-06-07/notes.md) returned a native 2048 × 2048 foreground on a near-white matte, with the night field and external glow removed. The flame and abdomen retain solid bright facets. The owner identified a missing second eye; the earlier single-visible-eye instruction must be corrected. These exact bytes and the feedback remain archived without extraction or finishing. The night motif and warm glow are still planned as independent layers after a corrected raw source is approved.

[Study 08](../artwork/logo-family/firefly/2026-09-06-08/notes.md) returned one native 2048 × 2048 source with two visible dark faceted eyes. The owner rejected its perspective because the eye placement made the head appear to face backward. The requested correction changes the camera and depth relationship, beyond simply adding another eye. The exact output remains archived without finishing.

[Study 09](../artwork/logo-family/firefly/2026-09-06-09/notes.md) returned one native 2048 × 2048 source with a curved three-dimensional campfire and split logs in the lower-left foreground, and a fragmented firefly facing it from the upper-right. The near eye is clear; the far eye is a narrow sliver. The insect remains prominent, its abdomen slopes down-right, and the two masses have very little overlap. The source has a near-white matte with a soft log contact shadow and no obvious external flame bloom. The untouched image was displayed and opened in Chrome immediately. The owner rejected its proportions because the insect and fire competed equally; the firefly must be the main subject. The exact raw bytes remain archived without finishing.

[Study 10](../artwork/logo-family/firefly/2026-09-06-10/notes.md) returned one native 2048 × 2048 source using the owner JPEG as its first reference. The broad-winged animal dominates the image, with a much smaller curved fire and two crossed logs at lower left. Both eyes are visible. The wing tips have narrow margins, and a gap remains between the flame and lower wing instead of the intended slight overlap. The untouched near-white source was displayed and opened in Chrome immediately; the owner approved these exact bytes and authorized finishing, source replacement, and publication. Finishing and catalogue integration are now in progress. Depth and visual priority are now specified independently in the workflow skill.

## Archive and promotion

Studies live under `artwork/logo-family/<project>/<date>-<sequence>/`; shared style references and tools live alongside them. Use a new study for every model request and a new numbered finishing directory for every rendering pass. A failed or superseded attempt is still part of the archive.

Numbered finishing directories and sanitized request/response records are frozen generated artifacts, excluded from Biome formatting. `assets:check` verifies every finishing manifest, its source image, and all recorded file hashes. Active tools, mutable recipes, and review pages remain linted. Format a mutable recipe before taking its next snapshot; never rewrite an archived mask, tool snapshot, or settings file to satisfy a formatter.

The workshop is outside `public/` and the production entry graph. A pending raw image stays only in the workshop. After raw approval and finishing, a candidate receives a curated local catalogue preview. `family.status: "review"` records an unadopted pass, and `family.foreground` supplies its paths, dimensions, and hash. `project.logo` continues to record the actual source-project bytes and revision. Source-project adoption and publication require the session's authorization; a local-only round ends with atomic local commits and the appropriate raw or finished review link.

Refined identities have a `family` record in `src/data/projects.json`. New curated review resources live under `public/logos/family/<project>/<study>/<pass>/`: exact transparent/square/rounded/white masters, untouched generation, prompt, background, and a checksum manifest. The original adopted Frogie root remains preserved. Source originals remain under versioned names in `public/logos/originals/`; previous names are immutable. `assets:build` adds optimized icon, transparent, background, and previous-artwork previews; `assets:check` validates active foregrounds, every historical public manifest, and every finishing pass.

Both the static study HTML and `/logos/<project>` follow the complete review layout: large original/refined comparison, icon/transparent/white views, composition/drawing/material notes, 128/64/32/16 px specimens, real 24 px sidebar and 16 px browser contexts, copyable art colors, separate site theme values, light/dark foreground checks, downloads, and exact prompt. Presentation references and their disclosure appear only in static HTML and Git. Use actual project descriptions in context previews; a singing mascot does not make Frogie a music product.

The delivery also includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px, a native white master, immutable history, palette evidence, a generated profile, and browser evidence for both review surfaces. Validate path refresh, navigation history, share links, and archived-project access. Redrawn cards show Refined / 已重绘 within the existing product categories; All hides archived repositories by default.

The reusable workflow skill is `../workflow/agents/skills/zhengli-project-logo/SKILL.md`. Frogie is the first promoted identity; this does not mark the wider three-project replacement phase complete.
