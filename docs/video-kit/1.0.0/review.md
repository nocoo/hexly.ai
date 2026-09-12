# Video Kit 1.0.0 acceptance reference

Reviewed on 2026-09-12 against the real Hexly site, its official mark/wordmark,
Space Grotesk, Geist Mono, Noto Sans SC and paper/ink/terracotta palette. These
small contact sheets are visual references; full rendering caches remain outside
the deployment tree. No Hermes-specific script, voice or film is included.

## Rendered artifacts

All five standard examples were actually rendered through Remotion: 33 seconds,
990 frames, 960 × 540, H.264/yuv420p/BT.709 at 30 fps. FFprobe checked dimensions,
frame count and codec; FFmpeg decoded a frame from each MP4. Each deck contains
seven real PPTX slides and seven native speaker-notes parts; each PDF has seven
pages. See [render reports](renders.json) and [artifact verification](artifact-check.json).

The Chinese Pew project was also exported through Studio using the final Zod
4.4.3 dependency and the pruned PptxGenJS package. The latter preserves all
upstream rendering code; its real seven-slide export and notes were verified.

| Template | Visual conclusion |
| --- | --- |
| Launch | Clear type hierarchy, layered paper, generous margins. |
| Studio | Restrained dimensional motion; logo on its own undistorted front-facing plane. |
| Editorial | Denser folio/figure structure, shared type and radius vocabulary. |
| Pulse | Readable, dated catalogue facts; no fabricated live health metrics. |
| Essential | Centered announcement with reduced framing and no redundant statistics. |

Primary and read-only peer reviews found no release-blocking clipping, unrelated
palette or logo distortion in these frames. Chinese titles and supporting copy
are legible. The common reveal was checked from actual decoded MP4 frames: mark
alone → leftward expansion with full wordmark → caption. Deck frames use the
explicit settled layout.

![Launch: seven components](launch.webp)

![Studio: seven components](studio.webp)

![Editorial: seven components](editorial.webp)

![Pulse: seven components](pulse.webp)

![Essential: seven components](essential.webp)

![Chinese Pew project using Studio](studio-pew-zh.webp)

![Decoded MP4 reveal at 24.8, 25.8, 26.4 and 27.3 seconds](reveal.webp)

## Functional evidence

- Strict root/Worker/package typechecks, Biome and both Vite builds passed.
- 169 unit tests passed; model coverage was 99.73% statements, 99.04% branches,
  100% functions and lines. Every real project plus Hexly was validated in both
  languages across all five templates.
- 69 HTTP tests passed against local Workers and isolated SQLite D1, including
  public manifests, fonts, five template documents and exact download hashes.
- 194 Chromium browser tests passed across desktop and mobile. The video tests
  covered five templates, project selection, Video/Deck, paging, actual playback,
  screenshot upload, config export, reduced motion, 320px Chinese/dark mode and
  axe WCAG 2.1 A/AA checks. No horizontal overflow or browser console errors were
  observed in those tested journeys. Safari/Firefox were not part of this run.
- OSV checked 484 locked dependencies with no findings after removing the unused
  vulnerable image-size dependency; Gitleaks found no leaks. No security
  advisory or browser CSP error was suppressed. Silent Players explicitly use
  zero shared audio tags, avoiding unused inline audio under the site's CSP.
- Asset checks verified 20 declared video downloads totaling 11.52 MB. The
  Workers dry run accepted the full site and existing D1 binding. Render caches,
  full frames, vendor code and these review sheets are outside public assets.

The public media manifest contains the exact published sample hashes. Normal
release automation checks the deployed version/SHA, catalogue status targets,
five video documents and poster hashes. Deployment/production evidence is linked
from the [site release](https://github.com/nocoo/hexly.ai/releases).

## Reproduce

```sh
bun run video:examples -- --mode all --out /tmp/hexly-kit-review
bun run video:render -- --project pew --template studio --locale zh \
  --mode deck --out /tmp/hexly-kit-zh-review
bun run video:check
```

Use a fresh output directory, as the renderer refuses to overwrite a previous
production. PPTX/PDF slides are image-backed; only native PPTX notes are editable.
These standard examples are silent component samplers.
