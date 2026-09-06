# Logo usage and adoption SOP

This is the shared logo-usage wiki for the personal-project family. The owner established these surface rules on 2026-09-07. Apply them when adopting a selected identity or auditing an existing project; art generation still follows [the family guide](06-logo-family.md) and the workflow `zhengli-project-logo` skill.

## Choose the asset by its use

| Surface | Asset | Background and masking |
| --- | --- | --- |
| Large README header, identity gallery, promotional artwork | Selected square or rounded presentation | Designed background, project-specific motif, contact shadow, and separate emission are allowed |
| Sidebar, collapsed rail, small header, navigation mark | Transparent foreground | No baked-in tile, motif, external glow, CSS background, or additional circular/rounded crop |
| Browser favicon, PNG or ICO | Transparent foreground | Preserve alpha in every size; small transparent corners on a background tile do not make it a foreground mark |
| Apple touch, PWA, native app icon | Platform-specific derivative of the selected presentation | Follow the platform's masking contract; a browser favicon rule does not automatically apply to an OS app icon |
| Social/Open Graph image | Selected presentation on the existing social canvas | Preserve the intended brand setting and the required output dimensions |

Root `logo.png` remains the canonical transparent master. Keep presentation masters separate, normally `assets/brand/icon.png` and `assets/brand/icon-rounded.png`. Conventional `logo-24.png` and `logo-80.png` app assets come from the foreground; a large background presentation has its own explicit path. An 80 px asset used in a 44 px header is still a small UI mark. Choose by the actual displayed role, not the source filename or resolution.

All variants retain the approved subject placement, proportions, colors, and safe margins. Do not stretch a neck, enlarge a face, trim an accessory, invert colors, or add a new crop to fit a consumer. Intentional neck/shoulder entry remains part of the approved drawing. Light and dark surfaces use the same foreground.

## Adoption procedure

1. **Identify the exact selected pass and scope.** Read the raw-image decision, presentation selection, and current owner instructions. Record the study, finishing pass, hashes, and whether source adoption and publication are authorized. Finishing an accepted image needs no new generation or approval round. A new model output follows the raw checkpoint.
2. **Trace actual consumers before changing files.** Inspect README headers, localized/package READMEs, expanded/collapsed sidebar, navigation/header marks, login/loading screens, badges, browser metadata, touch icons, manifests, and social images. Search code and markup for image references; replacing only root `logo.png` is incomplete. Distinguish application branding from user-uploaded site logos and unrelated theme identities.
3. **Install the exact selected masters.** Copy the transparent master to root `logo.png` and preserve the square/rounded masters separately. Record their source archive and SHA-256. Keep every previous original and frozen finishing artifact in hexly.ai.
4. **Regenerate the assets that consumers actually use.** Use the source project's existing resize script. Resize the whole canvas uniformly, preserving alpha. For Pillow ICO output, save all resolutions from the full master, then decode the resulting container to verify every requested size. Starting with a 16 px image can silently omit larger entries. Remove obsolete CSS masks from small transparent marks.
5. **Verify the output and its references.** Check the root and presentation masters against the selected archive bytes. Confirm dimensions and foreground pixels in every small PNG, and alpha in every ICO entry. Check that README's actual image target is the selected presentation. Inspect small marks on light/dark surfaces at their real CSS size, including both sidebar states. Verify the browser's effective icon links, including dynamic or custom-logo overrides where present. Preserve platform-specific exceptions explicitly.
6. **Synchronize hexly.ai.** Commit the source adoption, record that exact repository revision, and preserve a normalized versioned original backup. Update the catalogue, sampled palette, and generated project profile. Mark `family.status: "adopted"` only after the selected identity is installed in the source checkout. Run `bun run assets:build`, `bun run docs:profiles`, and `bun run assets:check`; reject unrelated asset churn.
7. **Show the actual usage on both individual review pages.** Keep `artwork/logo-family/<project>/<study>/review.html` and `/logos/<project>`, including before/after, Icon/Transparent/White modes, notes, palette, edge checks, downloads, and prompt. Use presentation tiles for 128/64 px app-icon examples and transparent artwork for 32/16 px examples, the 24 px sidebar, the 16 px browser tab, and the static page's own favicon. Mode changes for the large comparison must not put backgrounds back on small marks. Presentation-reference disclosures stay in static HTML and Git.
8. **Finish with evidence and atomic commits.** Save source revision, consumer paths, decoded size/alpha checks, and browser captures. Run required source and site gates and commit each repository separately. Update the workflow skill when the shared procedure changes. Report local source adoption, push, and deployment separately; only perform the latter two when authorized.

## Required completion record

Each adopted project records its selected study/pass, exact master checksums, source commit, README target, sidebar/header consumers, PNG/ICO resolutions, platform/custom-logo exceptions, both review paths, and verification evidence. A Refined badge or a finished gallery page alone does not establish source adoption. A local source commit does not establish publication.

## Four-project audit — 2026-09-07

The audit found Pew still using its old source identity, Frogie still presenting the lighter finishing 02 tile, and background tiles in small app marks. All four source checkouts now use their selected masters and transparent UI/favicon derivatives. Their large README images use the selected rounded presentations. This follow-up is local only.

| Project | Selected study / pass | README image | Small app marks | Browser icons | Review |
| --- | --- | --- | --- | --- | --- |
| Frogie | `2026-09-06-01 / 03` | `assets/brand/icon-rounded.png`, 128 px | `packages/web/public/logo-{24,80}.png`; both sidebar states and login | `packages/web/public/favicon.png` at 32 px; ICO 16/32 | [Frogie](https://index.dev.hexly.ai/logos/frogie) |
| Pew | `2026-09-06-01 / 04` | `assets/brand/icon-rounded.png`, 128 px | `packages/web/public/logo-{24,80}.png`; sidebar, login, landing coupon, leaderboard header, badge previews | `packages/web/src/app/icon.png` at 32 px; ICO 16/32 | [Pew](https://index.dev.hexly.ai/logos/pew) |
| Firefly | `2026-09-06-10 / 02` | `assets/brand/icon-rounded.png`, 128 px | `public/logo-{24,80}.png`; admin sidebar, login chrome and default login mark | `src/app/icon.png` at 32 px; ICO 16/32/48 | [Firefly](https://index.dev.hexly.ai/logos/firefly) |
| Bogo | `2026-09-07-05 / 04` | `assets/brand/icon-rounded.png`, 128 px | `packages/ui/public/logo-{24,80}.png`; sidebar uses the 24 px asset at 20 CSS px, with no corner mask | `packages/ui/public/favicon.png` at 32 px; no ICO consumer | [Bogo](https://index.dev.hexly.ai/logos/bogo) |

Frogie, Pew, and Firefly retain square 180 px Apple touch icons. Firefly's custom LZ site-logo setting and Journal theme mark are independent identities; `/api/favicon` may select the configured site logo before the transparent application fallback. Those custom assets were not replaced by the firefly mascot.

The [audit archive](../artwork/logo-family/audits/2026-09-07-usage/) contains the before state, exact-master/alpha verification, a light/dark usage sheet, source revisions, and browser evidence. Each source repository documents its local usage in `assets/brand/README.md` or, for Frogie, `docs/logo.md`. The four generated [project profiles](profiles/README.md) retain the source revisions and current palette evidence.
