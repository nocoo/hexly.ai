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

## Viewfinder framing repairs — 2026-09-07

The current Wooly and Noheir identities supersede their earlier retained-original presentations. Raven and Life.ai now also carry Refined identities adopted in their source projects. The owner authorized generation, source replacement, README synchronization, and push for all four.

| Project | Source commit | Selected study / pass | Consumer roles | Individual page |
| --- | --- | --- | --- | --- |
| Wooly | [`e516e1fbcb`](https://github.com/nocoo/wooly/commit/e516e1fbcbd146fcda6b80cf071bd5367e611afd) | `2026-09-07-02 / 01` | Transparent Logo component and browser marks; square touch; rounded README/social | [Review](https://hexly.ai/logos/wooly) |
| Noheir | [`5e32426a60`](https://github.com/nocoo/noheir/commit/5e32426a6044436eee5c6b2894910666896a8b49) | `2026-09-07-02 / 02` | Transparent sidebar/login/browser; square touch/install; rounded README/social | [Review](https://hexly.ai/logos/noheir) |
| Raven | [`c59fe3ad5a`](https://github.com/nocoo/raven/commit/c59fe3ad5a0aea2e849b2b9ee00be189091c9faf) | `2026-09-07-04 / 02` | Transparent dashboard/sidebar/login/browser; square touch; rounded README/social | [Review](https://hexly.ai/logos/raven) |
| Life.ai | [`b6f3e7f426`](https://github.com/nocoo/life.ai/commit/b6f3e7f426315062e0492e00c4d9448bfa3b8031) | `2026-09-07-01 / 02` | Transparent sidebar/login/browser, including the 192 px login asset; square touch; rounded README/social | [Review](https://hexly.ai/logos/life-ai) |

Each source stores exact transparent/square/rounded masters and a brand usage guide. PNGs and both 16/32 ICO entries are verified against the selected transparent master. Large README/social presentations use their backgrounds. Life.ai’s former login circle and white filter are removed; its 192 px login image remains transparent because it is a UI mark rather than a PWA asset.

See [the batch audit](../artwork/logo-family/audits/2026-09-07-framing/) and each study’s `adoption.json` for immutable source revisions, master hashes, round-corner measurements, browser captures, and publication evidence. Earlier originals, public archive roots, raw generations, and diagnostic passes remain preserved.

## Fifteen identities — 2026-09-07

The owner authorized two consecutive batches, including generation without an intermediate handoff, source replacement, README updates, push, and Hexly deployment. Surety, Owl, Ellie, Giraffe, Steed, Bat, Rooster, Snaky, Codo, Gaga, Backy, and Otter are redesigned. Xray, Pika, and Gecko retain their exact transparent artwork and native placement, with new project-specific backgrounds. All fifteen now have complete individual before/after pages and Refined entries.

| Project | Route | Selected study / pass | Source commit | Individual page |
| --- | --- | --- | --- | --- |
| Surety | Redesigned | `2026-09-07-01 / 01` | [`f257e0977e`](https://github.com/nocoo/surety/commit/f257e0977e85358f9d02ed3f79a9fad8862e5117) | [Review](https://hexly.ai/logos/surety) |
| Owl | Redesigned | `2026-09-07-01 / 01` | [`e1c69addb6`](https://github.com/nocoo/owl/commit/e1c69addb656e8907a8828001e1f5c103f3b9fbf) | [Review](https://hexly.ai/logos/owl) |
| Ellie | Redesigned | `2026-09-07-01 / 01` | [`300b8540ea`](https://github.com/nocoo/ellie/commit/300b8540eac51ae21803a8d58ebffbe3d90efa24) | [Review](https://hexly.ai/logos/ellie) |
| Giraffe | Redesigned | `2026-09-07-01 / 02` | [`c715434784`](https://github.com/nocoo/giraffe/commit/c71543478405f580e6dd36ebac18174f7ae6e474) | [Review](https://hexly.ai/logos/giraffe) |
| Steed | Redesigned | `2026-09-07-02 / 01` | [`bcab1f113b`](https://github.com/nocoo/steed/commit/bcab1f113b9b7cde65898bbd23705c7dac339634) | [Review](https://hexly.ai/logos/steed) |
| Xray | Retained original | `2026-09-07-01 / 01` | [`16175dc87e`](https://github.com/nocoo/xray/commit/16175dc87ef406e8cf3343ab8808b60e8f53cc8a) | [Review](https://hexly.ai/logos/xray) |
| Bat | Redesigned | `2026-09-07-01 / 02` | [`46f5c95a6c`](https://github.com/nocoo/bat/commit/46f5c95a6c134487130e2a6d9336ec5e8895a0f7) | [Review](https://hexly.ai/logos/bat) |
| Rooster | Redesigned | `2026-09-07-01 / 02` | [`8907933c08`](https://github.com/nocoo/rooster/commit/8907933c080ed86c6cbe15d9af5cdb0be86919d3) | [Review](https://hexly.ai/logos/rooster) |
| Snaky | Redesigned | `2026-09-07-01 / 01` | [`5cd0790336`](https://github.com/nocoo/snaky/commit/5cd0790336d006f65555816fe29869d6e60ed376) | [Review](https://hexly.ai/logos/snaky) |
| Codo | Redesigned | `2026-09-07-01 / 01` | [`c4d8982d8c`](https://github.com/nocoo/codo/commit/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a) | [Review](https://hexly.ai/logos/codo) |
| Gaga | Redesigned | `2026-09-07-01 / 01` | [`76260f0832`](https://github.com/nocoo/gaga/commit/76260f08329784eead9b30912c7692b8ea0d3d56) | [Review](https://hexly.ai/logos/gaga) |
| Pika | Retained original | `2026-09-07-01 / 01` | [`bb9b497372`](https://github.com/nocoo/pika/commit/bb9b497372809e5ca00eaef4b04e1aa51e4256a3) | [Review](https://hexly.ai/logos/pika) |
| Backy | Redesigned | `2026-09-07-01 / 01` | [`5b23349c94`](https://github.com/nocoo/backy/commit/5b23349c94ac6778f2242a857386e8b01dac4f1c) | [Review](https://hexly.ai/logos/backy) |
| Gecko | Retained original | `2026-09-07-01 / 01` | [`f259be7fe7`](https://github.com/nocoo/gecko/commit/f259be7fe740ce260c9257e2870b57dec8d9e7b3) | [Review](https://hexly.ai/logos/gecko) |
| Otter | Redesigned | `2026-09-07-01 / 02` | [`0c87197fc9`](https://github.com/nocoo/otter/commit/0c87197fc9b67d74f9ed6ee70c7ea8c9c4567fe3) | [Review](https://hexly.ai/logos/otter) |

Source `logo.png` and the separate square/rounded masters match their selected archive hashes. README headers use rounded presentations; small application marks and PNG/ICO favicons use transparent foregrounds. The app-icon canvas for Owl, Snaky, Codo, and Gecko contains an 824 px rounded tile centered inside a transparent 1024 px native canvas. Codo/Snaky animal templates are regenerated; Owl's semantic menu symbols and Gecko's retained templates preserve their existing status behavior.

Codo's small notification mark uses the transparent hummingbird. Rooster receives its first dedicated project logo and README. The former small-image corner crops in Bat, Snaky, Codo and Gecko's About presentation are removed. Independent forum, per-project, and configured site identities remain separate.

The [five-project audit](../artwork/logo-family/audits/2026-09-07-redesign/) and [ten-project audit](../artwork/logo-family/audits/2026-09-07-next-ten/) contain exact-master checks, real source component captures, size/alpha verification, and publication records. Each study retains its prompt or presentation brief, raw/source decision, sampled palette, all finishing passes, static review, and adoption record. The public catalogue paths use `/logos/<project>`.

New full-body drawings maintain at least 128 px clearance against the actual rounded outline. Retained artwork keeps its existing native margins, including Pika's close outer sparks. Bat, Rooster and Otter pass 02 remove an inspected enclosed white matte pocket; previous passes remain immutable. Giraffe pass 02 adjusts placement by one pixel. Steed preserves one rejected generation and adopts its second native result. Across both batches, twelve projects were redrawn in thirteen native requests and three projects required no generation.
