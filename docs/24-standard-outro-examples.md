# 24 · Standard outro examples

Five existing Hexly-only brand endings from `../workflow` are presented at
[Templates → Finished examples](https://hexly.ai/templates#examples). A template
detail shows its corresponding example. These are fixed light, silent recordings;
the project and canvas-theme controls continue to operate the separate client
composition previews.

## Files and source

| Example | Upstream layout / ending | Original movie | HTML still |
| --- | --- | --- | --- |
| Product launch | `launch` / `signature` | [MP4](https://h.no.mt/projects/hexly-ai/videos/standard-outro-product-launch/v2.0.0/hexly-product-launch-outro-d15a944c1e26.mp4) | [4K PNG](https://h.no.mt/projects/hexly-ai/videos/standard-outro-product-launch/v2.0.0/hexly-product-launch-outro-frame-100-4k-7dd99bac7ea3.png) |
| Dimensional technical story | `showcase` / `split` | [MP4](https://h.no.mt/projects/hexly-ai/videos/standard-outro-dimensional-technical-story/v2.0.0/hexly-dimensional-technical-story-outro-25c08974bb9a.mp4) | [4K PNG](https://h.no.mt/projects/hexly-ai/videos/standard-outro-dimensional-technical-story/v2.0.0/hexly-dimensional-technical-story-outro-frame-100-4k-9347e62926cc.png) |
| Editorial long-form | `columns` / `colophon` | [MP4](https://h.no.mt/projects/hexly-ai/videos/standard-outro-editorial-long-form/v2.0.0/hexly-editorial-long-form-outro-e9d5dfc30697.mp4) | [4K PNG](https://h.no.mt/projects/hexly-ai/videos/standard-outro-editorial-long-form/v2.0.0/hexly-editorial-long-form-outro-frame-100-4k-8378150c8608.png) |
| Data/status update | `bento` / `frame` | [MP4](https://h.no.mt/projects/hexly-ai/videos/standard-outro-data-status-update/v2.0.0/hexly-data-status-update-outro-cf74ded8e9f7.mp4) | [4K PNG](https://h.no.mt/projects/hexly-ai/videos/standard-outro-data-status-update/v2.0.0/hexly-data-status-update-outro-frame-100-4k-893efbb1e7f3.png) |
| Minimal brand announcement | `essential` / `line` | [MP4](https://h.no.mt/projects/hexly-ai/videos/standard-outro-minimal-brand-announcement/v2.0.0/hexly-minimal-brand-announcement-outro-1bddfbede10b.mp4) | [4K PNG](https://h.no.mt/projects/hexly-ai/videos/standard-outro-minimal-brand-announcement/v2.0.0/hexly-minimal-brand-announcement-outro-frame-100-4k-3f1a0a6aa362.png) |

All five original MP4s are 1920 × 1080, 30 fps, six seconds / 180 frames,
H.264/yuv420p, limited-range Rec.709, without audio, subtitles or transparency.
Their `moov` atom precedes `mdat`. They total 722,542 bytes and retain the source
run's exact SHA-256 values. No movie was re-encoded or retagged during adoption.

The source package is `video-templates/hexly-bumpers/2.0.0` in Workflow, local
commit `6b89bb9765f9845d57d6d38f2572f1c9152ecae2`. At import that commit had not
been pushed; this task neither changes nor pushes Workflow. It consumes Hexly
Video Kit 2.0.0 at `f4d36c99ca95d5959e93a7e04687a56d210abcb0` / site v0.11.1.
The use-case names are Workflow's selections among existing components. They do
not restore the retired Studio/Editorial/Pulse layouts or claim a new 3D scene.

Source/code/brand permission is the recorded Hexly MIT notice. Space Grotesk,
Geist Mono and Journey CJK keep their SIL OFL notices. Remotion keeps its separate
license. [The common provenance record](media/hexly-ai/standard-outros/v2.0.0.json)
retains exact source, HTML bundle and notice hashes; each film has its own receipt
under `docs/media/hexly-ai/standard-outro-<preset>/v2.0.0.json`. The owner's
2026-09-13 upload instruction supersedes the source run's earlier local-only
storage note for these five selected films.

## High-resolution stills come from HTML

The owner specifically requested HTML-origin stills. Each 3840 × 2160 PNG is a
native screenshot of frame 100 (3⅓ seconds) of the same batch's `HexlyOutro`
HTML composition at scale 2. The official mark and complete wordmark are settled
there. The 1280 × 720 WebP poster resizes that entire PNG. There is no MP4 frame
extraction, cropping, invented scenery or reconstruction of the Logo.

The source bundle is
`video-templates/hexly-bumpers/2.0.0/.cache/bundle/2026-09-13T09-06-05-997Z` in
Workflow. Its HTML/JS hashes, the input configuration and selected frame are
recorded in the receipts. Reuse the matching source bundle or rebuild it from
that fixed source after checking its source/font hashes; do not substitute an
older project-caption bundle. A new output directory preserves existing files.

The capture uses the installed `@remotion/renderer@4.0.520` API. With dependencies
installed in `packages/video-kit`, the equivalent operation is:

```ts
import { renderStill, selectComposition } from "@remotion/renderer";

const inputProps = { config }; // The recorded Workflow example JSON.
const options = { serveUrl: bundleDirectory, inputProps, browserExecutable };
const composition = await selectComposition({ ...options, id: "HexlyOutro" });
await renderStill({
  ...options,
  composition,
  frame: 100,
  scale: 2,
  imageFormat: "png",
  output: freshPngPath,
  overwrite: false,
});
```

The five small page posters total 39,278 bytes. The five full-resolution PNGs
total 825,663 bytes. Both variants are on R2; neither is deployed or tracked as a
binary. The local capture and publication evidence remains in the ignored
`.video-work/standard-outros-20260913-fgi2y0yc/` directory. That directory is a
local working copy; durable download URLs and source hashes are in the receipts.

## R2 and page maintenance

Read [hexly-r2-media](../.agents/skills/hexly-r2-media/SKILL.md). The storage
configuration remains `hexlyai` / `https://h.no.mt`; no new bucket, CORS rule,
lifecycle rule, proxy or Worker binding was introduced.

```sh
# Plan first; --upload publishes the approved immutable file.
bun run media:r2 -- --project hexly-ai \
  --video standard-outro-product-launch --version 2.0.0 \
  --file /absolute/path/hexly-product-launch-outro.mp4
```

Use the same video ID/version for its MP4, WebP poster and 4K PNG. The helper
returns the exact `projects/hexly-ai/videos/<id>/v<version>/<name>-<hash12>.<ext>`
key and public URL. Changed bytes require new immutable addresses. Preserve the
original source records and completed objects.

`src/data/template-examples.json` is the active example list, emitted unchanged
at [/templates/examples.json](https://hexly.ai/templates/examples.json). Add a
verified receipt before adding a reference. The existing `src/data/videos.json`
continues to describe the configurable component collection; product recordings
continue to live in their own catalogue entries. No synthetic project is added.

The shared native player loads only its poster before a user clicks. Only one
example plays at a time. Downloads use `AssetLink` so the browser saves the
original CDN bytes; a separate direct link remains available. MP4 and 4K PNG
links also appear in the crawler HTML and `llms.txt` links the example manifest.
The sitemap retains the canonical `/templates` and five template routes: a hash
section, JSON index and media files are not additional page canonicals.

## Verification

All 15 bare CDN URLs were checked with complete-byte SHA-256, MIME/size and
immutable cache metadata. HEAD requests allow `https://hexly.ai` and
`https://index.dev.hexly.ai`. Each MP4's `bytes=0-1023` request returned 206 and
matched the original bytes. Successful upload receipts were preserved across
two transient network/TLS failures; no TLS verification was disabled and no
existing object was overwritten.

The unit/HTTP tests cover receipt consistency, fixed source and HTML capture
provenance, public manifests, canonical discovery and anchor navigation. Browser
checks cover the five examples, per-template selection, poster-first loading,
mobile/desktop, light/dark, Chinese, accessible controls, downloads and failure
fallbacks. Native playback uses the existing tested project-media component.
Release follows [the normal exact-SHA workflow](05-release.md); verify the live
`/api/live`, `/templates#examples`, example manifest and CDN playback afterward.
