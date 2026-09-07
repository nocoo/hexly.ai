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

1. **Identify the exact selected pass and scope.** Read the raw-image or retained-source decision, presentation selection, and current owner instructions. Record the study, finishing pass, hashes, and whether source adoption and publication are authorized. Finishing an accepted image needs no new generation or approval round. A new model output follows the raw checkpoint.
2. **Trace actual consumers before changing files.** Inspect README headers, localized/package READMEs, expanded/collapsed sidebar, navigation/header marks, login/loading screens, badges, browser metadata, touch icons, manifests, and social images. Search code and markup for image references; replacing only root `logo.png` is incomplete. Distinguish application branding from user-uploaded site logos and unrelated theme identities.
3. **Install the exact selected masters.** Copy the transparent master to root `logo.png` and preserve the square/rounded masters separately. Record their source archive and SHA-256. Keep every previous original and frozen finishing artifact in hexly.ai.
4. **Regenerate the assets that consumers actually use.** Use the source project's existing resize script. Resize the whole canvas uniformly, preserving alpha. For Pillow ICO output, save all resolutions from the full master, then decode the resulting container to verify every requested size. Starting with a 16 px image can silently omit larger entries. Remove obsolete CSS masks from small transparent marks.
5. **Verify the output and its references.** Check the root and presentation masters against the selected archive bytes. Confirm dimensions and foreground pixels in every small PNG, and alpha in every ICO entry. Check that README's actual image target is the selected presentation. Inspect small marks on light/dark surfaces at their real CSS size, including both sidebar states. Verify the browser's effective icon links, including dynamic or custom-logo overrides where present. Preserve platform-specific exceptions explicitly.
6. **Synchronize hexly.ai.** Commit the source adoption, record that exact repository revision, and preserve existing original filenames; add a versioned replacement only when the source bytes change. Update the catalogue, sampled palette, and generated project profile. Mark `family.status: "adopted"` only after the selected identity is installed in the source checkout. Run `bun run assets:build`, `bun run docs:profiles`, and `bun run assets:check`; reject unrelated asset churn.
7. **Show the actual usage on both individual review pages.** Keep `artwork/logo-family/<project>/<study>/review.html` and `/logos/<project>`, including before/after, Icon/Transparent/White modes, notes, palette, edge checks, downloads, and the generation prompt or retained-original presentation brief. Use presentation tiles for 128/64 px app-icon examples and transparent artwork for 32/16 px examples, the 24 px sidebar, the 16 px browser tab, and the static page's own favicon. Mode changes for the large comparison must not put backgrounds back on small marks. Presentation-reference disclosures stay in static HTML and Git.
8. **Finish with evidence and atomic commits.** Save source revision, consumer paths, decoded size/alpha checks, and browser captures. Run required source and site gates and commit each repository separately. Update the workflow skill when the shared procedure changes. Report local source adoption, push, and deployment separately; only perform the latter two when authorized.

## Required completion record

Each adopted project records its selected study/pass, exact master checksums, source commit, README target, sidebar/header consumers, PNG/ICO resolutions, platform/custom-logo exceptions, both review paths, and verification evidence. A Refined badge or a finished gallery page alone does not establish source adoption. A local source commit does not establish publication.

## Retained-original source adoption — 2026-09-07

These nine identities retain the existing animals and add independent backgrounds, texture, and shadows. The owner authorized their source updates and publication. All nine root originals remain exact; the source repositories now keep separate square/rounded masters and use the selected rounded image in the README header at 128 px.

| Project | Source commit | Selected study / pass | Main asset roles | Individual review |
| --- | --- | --- | --- | --- |
| R2Shot | [`d69714a233`](https://github.com/nocoo/r2shot/commit/d69714a2332066c9c7b1792f919607a4b776eade) | `2026-09-07-01 / 01` | Transparent Chrome toolbar/popup marks; independent red development variant retained | [Review](https://hexly.ai/logos/r2shot) |
| Hooky | [`8ebc6aa82c`](https://github.com/nocoo/hooky/commit/8ebc6aa82c51ad0bed4b6684c1c12d9e7b2a3f5a) | `2026-09-07-01 / 01` | Transparent Chrome toolbar/popup/options marks; canonical root original added | [Review](https://hexly.ai/logos/hooky) |
| Zhe | [`075c875936`](https://github.com/nocoo/zhe/commit/075c875936e9a244c147ff9d58452398bb1ef3cf) | `2026-09-07-01 / 01` | Transparent sidebar/favicon; square touch icon; rounded social image | [Review](https://hexly.ai/logos/zhe) |
| Lyre | [`78b3a126f2`](https://github.com/nocoo/lyre/commit/78b3a126f27a5adc53e4eaf4097b785ac7cb609e) | `2026-09-07-03 / 01` | Transparent web marks; inset macOS AppIcon; menu bar and recording templates retained | [Review](https://hexly.ai/logos/lyre) |
| Shrike | [`0fec187fc2`](https://github.com/nocoo/shrike/commit/0fec187fc22742664925897400d0c1a62b2478bb) | `2026-09-07-01 / 01` | Transparent toolbar; rounded About image; native platform icon sets; tray template retained | [Review](https://hexly.ai/logos/shrike) |
| Wooly | [`1eea8ada0a`](https://github.com/nocoo/wooly/commit/1eea8ada0a31fdd55b98062333ec4517f65609f4) | `2026-09-07-01 / 01` | Transparent Logo component/favicon; square touch icon; rounded social image | [Review](https://hexly.ai/logos/wooly) |
| Noheir | [`1041610cf0`](https://github.com/nocoo/noheir/commit/1041610cf06562bb04911e39f4356690f6256f57) | `2026-09-07-01 / 01` | Transparent sidebar/login/favicon; declared touch, install, and social presentations | [Review](https://hexly.ai/logos/noheir) |
| Dove | [`7454e3d93d`](https://github.com/nocoo/dove/commit/7454e3d93d8345e5aa09dc778240b65dbbed69d0) | `2026-09-07-03 / 01` | Canonical root original; transparent sidebar/favicon; declared touch/social presentations | [Review](https://hexly.ai/logos/dove) |
| Neo | [`0d75048479`](https://github.com/nocoo/neo/commit/0d750484792449914b07e9b3e3404a823493f8a5) | `2026-09-07-03 / 01` | Transparent sidebar/login/favicon; circle crop removed; touch/install/social presentations | [Review](https://hexly.ai/logos/neo) |

The [batch audit](../artwork/logo-family/audits/2026-09-07-retained/) verifies all nine native sources and presentation masters, 35 transparent PNG sizes, all favicon ICO resolutions, macOS inset PNGs/ICNS, opaque touch icons, and Android foreground safe regions. Each study's `adoption.json` links its exact source commit and usage guide. Push and CI results are recorded in the separate publication report.

For a retained original, preserve the old normalized backup filename. Record its source authorization with `source-review.json` and deliver a presentation brief in place of a generation prompt. Complete matching before/after pages and the Refined badge even when the foreground does not change. Keep native 900/920 px sources at those dimensions and disclose any larger upscales. Platform-specific insets belong to derivatives, never to the canonical source.
