# Hexly identity

The locally adopted identity is the six-wedge terracotta ceramic hexagon,
study `2026-10-18-02`, finishing `01`. The previous four-triangle PNG and
historical SVG remain archived; neither is the current site mark.

| Role | Local file | Use |
| --- | --- | --- |
| Native transparent master | `logo.png` | Source identity; no added mask, tile or shadow |
| Native square presentation | `assets/brand/icon.png` | Platform-controlled masking |
| Native rounded presentation | `assets/brand/icon-rounded.png` | 128px README artwork and large cards |

All three files are 1024px and exactly match the selected family archive.
`source.json` records their hashes and the immutable committed source receipt.
Root copies are deliberately ignored under this repository's no-material-binaries
policy; the receipt revision does not claim to contain those PNGs in Git. Recover
the selected archive through the R2 inventory, then copy the three recorded files
to these local paths. Do not substitute a generated preview for a native master.

The native generation is JPEG from the built-in image tool with **unrecorded
model**. 2048px study exports are declared upscales, not native images. Finishing
retains opaque source RGB and uses an independent workshop-pattern background.

The site header and favicon use transparent family PNGs. The effective touch
icon uses `/icons/hexly-ai/v1.0.0/apple-touch-icon.png`, the new opaque square;
historical root favicon/touch URLs remain available but are not current consumers.
Current Video Kit
compositions use a separate exact transparent master at
`/video-kit/1.1.0/hexly/mark.png`; the font assets remain at version 1.0.0 and
published standard outro movies remain unchanged. The package is not released.

Both README languages select the rounded archive. New CDN references and source
metadata are prepared locally only: no upload, push, release, deployment or
remote-render verification is claimed. Preview with `VITE_LOCAL_MATERIALS=1`
at `https://index.dev.hexly.ai` before publication.
