# InfoSpace identity

The logo turns the SDK's adjustable information panels into a compact physical tray: four unequal paper compartments, an indigo metal frame and a brushed-metal sliding divider.

## Source and acceptance

Azure Foundry `gpt-image-2` returned one native 2048 × 2048 image. The exact request, four ordered references, response and untouched PNG are archived here. There was one request and no retry. The original was shown and opened in Chrome before any extraction or replacement. The owner approved it with “效果不错，继续替换，按流程完整替换，hexly上线。” [raw-review.json](raw-review.json) records that decision against SHA-256 `f35f20b193b21bbe25cb6d2ab77412cb7051ed35de8e154249407a8735ece727`.

Selected finishing `01` preserves continuous metal and paper shading, with no animal or fragmented treatment. Its settings, tool snapshot, alpha, independent background, separate shadows and exports are frozen. Transparent, square and rounded representations are available at 2048, 1024, 512, 256, 128, 64, 48, 32, 24 and 16 px.

## Extraction and framing

The pale exterior floor shadow and the real neutral reflection on the tray's right wall required separate treatment. The first color-threshold probe damaged the wall and was rejected. A local macOS Vision mask supplied an interior hint; its unrefined contour produced jagged edges and was also rejected. The selected third probe refines the contour against native luminance transitions within ±10 px and stabilizes it with a five-row median before protecting the foreground during exterior-connected extraction. These diagnostics are retained under [verification/matting/](verification/matting/).

The shared finisher was not changed. It uses a minimum channel threshold of 50, maximum chroma of 16, matte RGB `[251, 251, 252]`, the measured protection polygon and no component cleanup. Placement remains scale 1 with zero offset. All 1,899,220 fully opaque pixels retain their exact source RGB. The canvas border is transparent, real wall samples remain opaque, and sampled exterior shadow pixels are removed. The foreground clears the actual 23% rounded outline by 195.5 px, with zero clipped pixels. [artwork.json](verification/artwork.json) records these checks and all 30 decoded size/role exports.

## Color and presentation

[palette.json](palette.json) separates actual native sRGB samples and coordinates from the designed **Adjustable spaces / 可调分区** field. The field uses base `#c6cddd`, light `#e8ecf5`, shade `#a8b6cb` and motif `#657895`. Offset panel outlines and short alignment ticks form this project's motif. Paper grain and projected shadows remain separate from the transparent foreground.

InfoSpace's actual demo uses `#13161c` with white controls. The new artwork does not change those application tokens. At 128/64 px the compartments and divider remain distinct. At 32/24/16 px recognition comes from the divided silhouette and four colors; paper grain, metal texture and the adjustment slot merge.

## Source consumers and verification

The exact transparent master is installed as `logo.png`; the separate square and rounded masters live in `assets/brand/`. Both README headers use the rounded presentation. The previous `logo.svg` remains untouched. The native toolbar uses a transparent 22 pt image with 22/44 px representations. The macOS Dock icon uses the complete rounded tile reduced to 824 px and centered inside a transparent 1024 px canvas, with ten standard ICNS representations. These resources belong only to the demo executable; SDK library clients do not inherit its brand.

[source-assets.json](verification/source-assets.json) verifies the three exact master hashes, README image targets, toolbar alpha, retained original SVG and every decoded ICNS entry. The owner's blank-toolbar report exposed a rendering failure in the named SwiftUI image path. AppKit bundle lookup now preserves both 1x/2x representations and renders the mark in both actual native windows. Each build passed 36/36 native checks; [native verification](verification/native/README.md) retains before/after evidence and the offscreen pixel comparison. Source adoption is pushed at [`82f629ed42`](https://github.com/nocoo/infospace/commit/82f629ed42b6ec89dac0e0c79e2a63dec88ecacf). [adoption.json](adoption.json) records every consumer and separates source publication from Hexly deployment.

Hexly adoption is published at `1ecfb136894a3af509050aeaa1d14e5c04e8a9e5`. All quality jobs and Deploy passed in [run 34304827154](https://github.com/nocoo/hexly.ai/actions/runs/34304827154). The [production report](../../../../docs/research/infospace-2026-09-09/logo-production/report.json) confirms the live adopted catalogue, default placement, 17 exact public assets and the immutable source image. The accepted local [browser review](../../../../docs/research/infospace-2026-09-09/logo-browser/README.md) retains 72 passing checks and selected screenshots. Finishing `01` stays frozen.

Both [the static review](review.html) and [the site comparison](https://hexly.ai/logos/infospace) provide the old/new artwork, Icon/Transparent/White views, light/dark edges, small-size specimens, seven copyable colors, full prompt and six downloads. The static page alone contains the four reference images. Sidebar and browser examples are identity scale studies; InfoSpace itself is a native macOS application with no project website.
