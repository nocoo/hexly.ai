# Logo usage and adoption SOP

This is the shared logo-usage wiki for the personal-project family. The owner established these surface rules on 2026-09-07. Apply them when adopting a selected identity or auditing an existing project; art generation still follows [the family guide](06-logo-family.md) and the workflow `zhengli-project-logo` skill.

## Choose the asset by its use

| Surface | Asset | Background and masking |
| --- | --- | --- |
| Large README header, identity gallery, promotional artwork | Selected square or rounded presentation | Designed background, project-specific motif, contact shadow, and separate emission are allowed |
| Sidebar, collapsed rail, small header, navigation mark | Transparent foreground | No baked-in tile, motif, external glow, CSS background, or additional circular/rounded crop |
| Browser favicon, PNG or ICO | Transparent foreground | Preserve alpha in every size; small transparent corners on a background tile do not make it a foreground mark |
| Apple touch, PWA, native app icon | Platform-specific derivative of the selected presentation | Follow the platform's masking contract; a browser favicon rule does not automatically apply to an OS app icon |
| Social/Open Graph image | Selected presentation on the existing social canvas | Preserve the intended brand setting and the required output dimensions. Product sites should reuse `https://hexly.ai/og/<id>.jpg` through [the share API](10-social-share.md) rather than inventing a new 1200 × 630 crop |

Root `logo.png` remains the canonical transparent master. Keep presentation masters separate, normally `assets/brand/icon.png` and `assets/brand/icon-rounded.png`. Conventional `logo-24.png` and `logo-80.png` app assets come from the foreground; a large background presentation has its own explicit path. An 80 px asset used in a 44 px header is still a small UI mark. Choose by the actual displayed role, not the source filename or resolution.

All variants retain the approved subject placement, proportions, colors, and safe margins. Do not stretch a neck, enlarge a face, trim an accessory, invert colors, or add a new crop to fit a consumer. Intentional neck/shoulder entry remains part of the approved drawing. Light and dark surfaces use the same foreground.

Native vector kits follow the same surface roles. Use the supplied explicit
light/dark variants for an application theme and the adaptive transparent SVG
for browser tabs. Preserve wordmark outlines and clear space. A public Hexly
kit is an asset handoff, not proof of adoption in its source repository. See
[Snail's versioned SVG/PNG/ICO guide](18-snail-brand.md).

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

## Three template identities — 2026-09-07

The material batch installs transparent source masters and separate pale engineering presentations in Dotty, Matrix and Basalt. The owner delegated raw acceptance, requested source replacement, and continued authorized publication.

| Project | Study / pass | Source commit | Individual page |
| --- | --- | --- | --- |
| Dotty | `2026-09-07-01 / 01` | [`1becb8026f`](https://github.com/nocoo/dotty/commit/1becb8026f44a20d9827cd5b4f100b6fb09836fe) | [Review](https://hexly.ai/logos/dotty) |
| Matrix | `2026-09-07-01 / 01` | [`8e6f9add03`](https://github.com/nocoo/matrix/commit/8e6f9add035b35505576f161d95393c0b8b31e07) | [Review](https://hexly.ai/logos/matrix) |
| Basalt | `2026-09-07-02 / 01` | [`8e41ff0773`](https://github.com/nocoo/basalt/commit/8e41ff077391e76d07df786b15c655138ef58989) | [Review](https://hexly.ai/logos/basalt) |

README headers use rounded presentation masters. Application navigation, Dotty’s login/badge views, Matrix’s login/boot views, Basalt’s login/library/loading marks, and browser favicons use transparent foregrounds with no extra circular crop or colored container. All three ICO files decode to 16, 24, 32, 48 and 64 px entries matching transparent master resizes. Square 180 px touch icons and 1200 × 630 social images follow their platform roles.

Basalt’s root and package READMEs are updated. Its `BasaltMark` SVG interface embeds a checked 128 px transparent PNG, so the package’s default loading mark works without an application-specific asset URL. The generic mountain icon in the component catalogue’s navigation remains a semantic category symbol. Library build/runtime checks pass; this source update does not publish an npm package.

Basalt’s site branding is isolated from unrelated ongoing development in the owner’s local main checkout. Source consumer captures, exact-master/derivative checks, raw decisions, and per-project CI/Deploy results are recorded in [the material audit](../artwork/logo-family/audits/2026-09-07-materials/). The rejected plain Basalt slab remains an unadopted study; only the corrected corner tower supplies source and catalogue assets.

The owner’s concurrent v2.1.0 release subsequently integrated Basalt’s branding at [`9e226aa5c1`](https://github.com/nocoo/basalt/commit/9e226aa5c1376351ec76a659b1a33a8139892b4b), preserving all exact masters and consumer assets. The active profile follows its verified homepage `https://basaltui.com` and current theme tokens. [Integration evidence](../artwork/logo-family/audits/2026-09-07-materials/basalt-release-integration.json) distinguishes that release from the isolated logo adoption above.

The Hexly material rollout passed Quality & Deploy at [`c90bd95d7e`](https://github.com/nocoo/hexly.ai/commit/c90bd95d7eeaef4b468e23729b545ebd15c1f671). The [production audit](../artwork/logo-family/audits/2026-09-07-materials/hexly-publication.json) verifies all three individual pages, exact master and native-generation bytes, downloads, both presentation themes, transparent small marks and Refined ordering. All three source projects passed CI and deployment. Basalt’s separate v2.1.0 release completed at [`514d94892b`](https://github.com/nocoo/basalt/commit/514d94892b9f55984dcd3cda0d9408ebecfcba9b); all eleven served application and platform files match the selected corner-tower derivatives, and its recorded website theme tokens remain unchanged. [Source publication evidence](../artwork/logo-family/audits/2026-09-07-materials/source-publication.json) records those outcomes separately.

## Remaining project adoption — 2026-09-07

The twelve studies below replace their source repository's actual identity consumers and the Hexly catalogue together. Root `logo.png` is the exact selected transparent foreground; `assets/brand/icon.png` and `icon-rounded.png` are large presentation masters. README marks sit above existing screenshots or videos. Source `assets/brand/source.json`, role-specific derivative records and a numbered logo-usage guide document every replacement.

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

PokePocket, Dogfight and Flow use PNG favicon metadata; PokePocket's two in-app header marks use its transparent character. Pew Game replaces its previous generated cowboy icon route with a static transparent PNG. Signoff and Arena replace both sidebar states; Arena also replaces the login badge and its main mark. Runner updates dashboard marks, all favicon sizes and separate square PWA sources. GeekHub replaces its existing header/login/favicons while preserving user/content feed identities. Unseal, Echo, Deca and IPSafe have no browser application brand surface; their root/logo/README/brand documentation are the relevant consumers.

PokePocket is a `reference-adaptation`, not `retained-original`: the supplied JPEG is a new source, distinct from the former app favicon. Its 960 px native resolution and extraction history are preserved; 1024/2048 exports are labeled upscales. A byte-preserved original still requires exact agreement between previous source, root logo and transparent master. Do not weaken that check to accommodate an adapted illustration.

[Source assets](../artwork/logo-family/audits/2026-09-07-objects/selected-studies.json), [source browser evidence](../artwork/logo-family/audits/2026-09-07-objects/source-browser.json), and [publication results](../artwork/logo-family/audits/2026-09-07-objects/source-publication.json) record installation, commit and publication as separate facts. Signoff's profile and site description are corrected to developer/Git activity analytics.

All twelve source adoption commits and necessary follow-up fixes are pushed, and their CI runs pass. Hexly’s [verified production rollout](../artwork/logo-family/audits/2026-09-07-objects/hexly-publication.json) publishes every identity above. PokePocket’s independent Release passed all repeated quality gates and deployed on attempt 2. Dogfight’s own Worker deployment requires a valid repository `CLOUDFLARE_API_TOKEN`; its source adoption and Hexly identity are already published. Do not label a source Worker deployed merely because its logo is visible in this gallery.

## New local previews — 2026-09-07

Clip, Fundly, DreamRO and Meowth have complete [local family presentations](08-new-project-identities.md), with Refined badges and `family.status: "review"`. Their source repositories and README/application consumers still use the previous identities. All new transparent, square, rounded and pure-white masters and ten export sizes are archived for later adoption; the current task does not publish them or replace source consumers. Small local sidebar/browser specimens use transparent foregrounds, and large review panels use the separate project-specific paper backgrounds. Site verification is delegated to the owner.

## Basalt local color revision — 2026-09-08

Basalt's new [Hanbaiyu and candy-color presentation](09-basalt-color-study.md) is a local `review` selection. The source logo, README, embedded `BasaltMark`, navigation and platform assets still use the previously adopted obsidian tower. Its earlier source-adoption and publication records remain valid for that older artwork. A later adoption must replace all of those consumers from the newly selected exact masters, following the same surface-role table; this study alone does not claim that replacement.

The local comparison supplies the complete transparent tower for sidebar/browser marks and a separate champagne tile for large presentations. A pale material is still opaque artwork: protect Hanbaiyu stone and its highlights during white-matte extraction, and seed only actual openings to the exterior. Keep the repository's raw candy swatches, semantic UI tokens and physically shaded native artwork samples as separate color evidence.

## InfoSpace native adoption — 2026-09-09

InfoSpace adopts the owner-approved indigo metal information tray from `2026-09-09-01 / 01` at source commit [`82f629ed42`](https://github.com/nocoo/infospace/commit/82f629ed42b6ec89dac0e0c79e2a63dec88ecacf). Both README headers use the rounded presentation. The toolbar uses transparent 22/44 px artwork at 22 pt; its native ICNS uses a complete 824 px rounded tile centered on a transparent 1024 px canvas. All ten ICNS representations decode with alpha, and the original SVG remains preserved.

The actual toolbar initially rendered blank despite valid files and a visible Dock icon. AppKit bundle image lookup fixes both Xcode's combined TIFF and SwiftPM's loose PNG pair. Root reviewed both final windows, each with 36/36 passing native checks. The [adoption record](../artwork/logo-family/infospace/2026-09-09-01/adoption.json) links exact masters, consumer paths, source revision, decoded assets, native evidence and both review pages. File checks alone are insufficient for native image adoption; verify the built resource format and the actual view. SDK libraries remain independent of the demo's resources.

## Showtime handoff — 2026-09-10

The owner approved the lettered black-and-white clapperboard from `2026-09-10-02 / 03`. The [handoff record](../artwork/logo-family/showtime/2026-09-10-02/handoff.json) assigns the exact transparent master to root `logo.png`, the rounded green presentation to root `logo-readme.png`, and the square master to platform-specific App icon generation. Both root copies were independently hash-verified. Chinese and English README headers reference the rounded root presentation at 128 px; small website marks use the transparent foreground.

Showtime's existing Codex owns the actual Swift/macOS consumers. It reported independent icon commit [`9a8c7c89ec`](https://github.com/nocoo/showtime/commit/9a8c7c89ec078ba17539d76522952d3f4af3d0f7), verified the visible transparent toolbar mark and confirmed the green-background running-application icon. The [adoption record](../artwork/logo-family/showtime/2026-09-10-02/adoption.json) attributes those checks to that agent; the catalogue uses `family.status: "adopted"`. The owner has taken over App follow-up and website acceptance after publication. [Onboarding](13-showtime-onboarding.md) records the independent README/profile commits and publication scope.

## Coffee and Hermes Gateway local adoption — 2026-09-11

The owner approved both exact native images with “通过，继续”. Each source adopts study `2026-09-11-01 / 01`, with root `logo.png` byte-identical to the selected transparent master and separate `assets/brand/icon.png` / `icon-rounded.png` presentations. Both README languages reference the rounded master. Previous originals, raw bytes and frozen finishing files remain intact.

| Project | Local source commit | Actual small marks | Platform and social consumers | Evidence |
| --- | --- | --- | --- | --- |
| Coffee | `0f0b9acd71497ed65c27cc3623f65a7e9a655f09` | Shared `Logo` in responsive header, footer, loading and exhibition; transparent `public/logo-80.png`; PNG favicons at 16/32 px, including static 404 | Square 192/512 px icons, separate maskable 512 px tile, existing 1536 × 1024 social card | [Adoption](../artwork/logo-family/coffee/2026-09-11-01/adoption.json) · [Browser](../artwork/logo-family/coffee/2026-09-11-01/inspection/source-browser/checks.json) |
| Hermes Gateway | `f14ddf11bf4ac4912830f0a7259fdd8a769e5a41` | No application UI or browser consumer; CLI and development manifest | Root and brand masters plus both READMEs; no speculative manifest fields | [Adoption](../artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/adoption.json) |

Coffee's ordinary square presentation extends beyond a circular PWA safe area by a small amount. Its dedicated maskable icon therefore places the entire approved foreground at 94% on the full independent paper background; its farthest visible pixel is 805.43 px from the center on a 2048 px basis, inside the 819.2 px safe radius. Browser and in-app marks retain the standard transparent placement with no CSS mask. There is no ICO consumer in either project.

Both complete reviews retain before/after, all three modes, themes, small-size specimens, sampled palette, light/dark edges, downloads and exact prompts. Reference boards appear only in static study HTML. Source commits and `family.status: "adopted"` establish local adoption; GitHub profile publishing, repository descriptions and deployments remain separate. See [onboarding](14-new-tools-onboarding.md) for the unchanged source snapshots and validation.

The gallery's website-theme row requires recorded theme tokens. An adopted artwork primary or designed paper color cannot establish a website theme. Coffee keeps its evidenced green/cream tokens; Gateway shows its material/presentation palette without a website-theme row.

## Ocelot animal adoption — 2026-09-11

The owner-approved `2026-09-11-01 / 03` study is published in Ocelot at [`9d27eea583`](https://github.com/nocoo/ocelot/commit/9d27eea583794ccda07dd2454c2a40302f86e227). The GitHub profile and description use 🐆 and the matching read-only GitHub/Obsidian reader summary. Ocelot joins the animal display family while retaining the Tools product category and its actual cool blue-gray website tokens.

| Consumer | Selected asset and evidence |
| --- | --- |
| Root identity | Exact 2048 px transparent `logo.png`; original SVG preserved in Hexly |
| Chinese/English README | Exact `assets/brand/icon-rounded.png`, shown at 128 px; refreshed synthetic reader screenshots |
| Expanded sidebar, collapsed rail, article footer, empty reader, mobile drawer | Shared `src/views/Mark.tsx`, transparent `public/logo-{80,160}.png`, displayed at 36/23/57 px without an extra mask, background, filter or opacity reduction |
| Browser | Transparent PNGs at 16/32 px; obsolete SVG reference removed; no ICO consumer |
| Apple touch | Square 180 px presentation with platform masking |
| Social | Shared `https://hexly.ai/og/ocelot.jpg`; no invented Ocelot deployment URL |

The complete [static study](../artwork/logo-family/ocelot/2026-09-11-01/review.html) and [/logos/ocelot](https://hexly.ai/logos/ocelot) retain the old SVG, all three presentation modes, actual sizes, native palette evidence, edge views and exact downloads. Reference boards stay in static HTML. [Source browser checks](../artwork/logo-family/ocelot/2026-09-11-01/inspection/source-browser/checks.json) cover eight states and five served assets in both themes. The source passed its pre-commit and pre-push hooks, 147 unit tests and four affected browser journeys. Ocelot itself remains undeployed; Hexly release monitoring was explicitly waived.
