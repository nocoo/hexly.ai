# Hexly Video Kit

Private, reusable React/Remotion compositions for the Hexly family. **2.0.0 is currently local and unpublished.** Consumers of the published 1.0.0 kit must keep their pinned checkout; this schema intentionally breaks with that version.

One project supplies every design. Choose a cover, a content layout, an ending and a canvas theme independently. The website, Vite preview, Remotion composition and slide exporter all render the same source. There are **250 base combinations**, before individual scene overrides.

## The designs

| Content layout | Composition | Use |
|---|---|---|
| Launch | Generous type beside a large project image; the original clear launch language. | Releases and introductions |
| Essential | Centered words, one quiet focal point and open space. | Announcements and invitations |
| Showcase | A panoramic product window under a concise title/caption row. | Screenshots, interfaces and demos |
| Columns | A strong thesis on one side, supporting detail and sourced facts on the other. | Explanations and research |
| Bento | A large story module, project art and three subordinate fact modules. | Overviews and updates |

| Opening | Composition and motion |
|---|---|
| Signal | Red point, centered title, short note; sequential type entrances. |
| Frame | A wide product window above a bold title/caption band; shallow perspective settles into a readable frame. |
| Index | Oversized folio, project name and opening note; aligned typographic entrances. |
| Horizon | Wide headline above a full-width paper field, with a small project object at the edge. |
| Stack | Layered paper settles behind one clean title card. |

| Ending | Composition and motion |
|---|---|
| Signature | The official mark alone, its full wordmark, then the caption. |
| Line | A large project headline, a red line that finishes at the edge, and a Hexly signature that settles at the lower left. |
| Frame | A layered paper end card, pairing the Hexly signature with the project identity and destination. |
| Split | Two paper fields; the mark expands into a left-hand signature, then the project and destination appear on the right. |
| Colophon | An oversized signature between fine rules and a small colophon. |

Every design supports `light` and `dark`, using the real site palettes. These are two themes of every component, not separate component counts. The five content layouts support title, chapter, content and CTA scenes; openings and endings do not depend on the chosen content layout. `LogoReveal` also remains available as a standalone component.

## Local preview

From the repository root:

```sh
bun install --frozen-lockfile
bun run dev                  # https://index.dev.hexly.ai/templates, local SQLite D1
bun run video:dev            # http://127.0.0.1:7440, independent Vite preview
bun run video:studio         # http://localhost:7441, Remotion compositions
```

`/templates` has three component families. Each card shows the selected catalogue project through the actual composition. In a project preview, choose the opening/content/ending and theme. Changing a component seeks to that part. A theme change pauses playback and preserves the current frame; switching Video/Deck preserves the current scene. Previews start paused and respect the system reduced-motion preference. No MP4 is loaded, generated or uploaded by the website.

The project, three base choices, theme and selected view are shareable URL parameters. PNG/JPEG/WebP screenshots (up to 8 MB) stay in the browser and are embedded in a downloaded setup. They are deliberately not placed in URLs or persisted across projects. The site adapter in `src/model/videos.ts` reads the catalogue once; there are no per-project/per-template configuration copies. Catalogue facts are snapshots, never a live health claim.

## Project configuration and API

The strict schema is `src/schema.ts`. The site emits `/templates/film-v2.schema.json` and `/templates/manifest-v2.schema.json`.

```tsx
import { createProjectFilm, Film, parseFilm } from '@hexly/video-kit';
import { FilmStill, VideoPreview } from '@hexly/video-kit/player';

const config = createProjectFilm(project, 'showcase', 'en', {
  theme: 'dark',
  opening: 'stack',
  ending: 'split',
});

// Optional: independently change any title/chapter/content/CTA scene.
const mixed = parseFilm({
  ...config,
  scenes: config.scenes.map(scene => scene.id === 'title'
    ? { ...scene, template: 'columns' }
    : scene),
});

<Film {...mixed} />;
<VideoPreview config={mixed} view="video" focusScene="content" />;
<FilmStill config={mixed} scene="content" />;
// For repeated scene kinds, address the exact timeline frame:
<FilmStill config={mixed} frame={391} />;
```

`VideoPreview` accepts `locale`, controlled `view`/`onView`, `focusScene` and `onConfigChange`. The latter emits the effective setup, including frame format and reduced motion. Import the player lazily in a host website. Rendering dependencies never enter the browser bundle.

| Field | Contract |
|---|---|
| `schemaVersion` | `2` |
| `template` | `launch`, `essential`, `showcase`, `columns`, `bento` |
| `opening` | `signal`, `frame`, `index`, `horizon`, `stack` |
| `ending` | `signature`, `line`, `frame`, `split`, `colophon` |
| `theme` | `light` or `dark`, independent of the host website |
| `format`, `fps`, `motion` | `landscape` (1920×1080) / `portrait` (1080×1920), 30 fps, `full` / `reduced` |
| `project` | Stable ID, name, summary, repository, optional website/logo/screenshot, evidenced colors, technologies, facts and source note |
| `scenes` | 1–24 unique IDs; kind, 4–30 second duration, title/eyebrow/body, optional HTTPS CTA link and optional content `template` override |

`parseFilm()` validates copy lengths, URLs, image sources, unique scene IDs and CTA links. A v1 setup is rejected rather than silently reinterpreted. To migrate an authorized consumer, set schemaVersion 2, select a current content layout, add the three independent composition fields and review the result. Do not edit an ongoing consumer's frozen production.

The shared canvas uses **32 px edge chrome and 80 px content insets** at 1920×1080. Both themes, every layout and all transitions derive from shared tokens and frame numbers. `FitText` measures the actual licensed fonts and scales long text groups to their assigned cells without clipping or ellipsis. Preserve official geometry and wordmark ratios. No random palettes, distorted marks, spring bounce or particle filler. Brand sources and font permissions: [CREDITS.md](CREDITS.md) and [brand-source.json](brand-source.json).

The wordmark reveal clips horizontally and allows 25% vertical bleed above and below its line box. Preserve this space for the Space Grotesk `y` descender; a tight `overflow: hidden` wrapper cuts off the actual glyph even when DOM text bounds fit.

## Export without generating a video

```sh
# From one real catalogue project. Chrome/Chromium is required.
bun run video:render -- --project pew --template columns \
  --theme dark --opening index --ending colophon \
  --mode deck --scale 1 --out /tmp/pew-deck-v2

# Consume the exact setup downloaded from the website.
bun run video:render -- --props /path/to/project-setup.json \
  --mode deck --scale 1 --out /tmp/my-deck-v2

# Package-only example (works in an independent checkout of this package).
bun run --cwd packages/video-kit render --example bento \
  --theme light --opening frame --ending signature --mode deck
```

`--mode deck` produces **real PPTX and PDF files**, seven image-backed pages in the standard example, plus native editable PPTX speaker notes. It never invokes the video encoder. `--mode stills` creates only the still frames, poster, contact sheet and audit report. `--mode video` or `all` explicitly opts into H.264 video generation and FFmpeg verification; those modes were not run for this local redesign. Default render scale is 0.5; use `--scale 1` for 1920×1080/1080×1920 exports. Slide content is rasterized; speaker notes are editable, slide elements are not separate editable shapes.

Each render uses a fresh output directory, retains `render.json` with the exact theme/components and input hash, and writes under the chosen content layout ID. Files include `deck.pptx`, `deck.pdf`, `frames/`, `poster.webp`, `contact-sheet.webp`; a video opt-in adds `film.mp4`. Existing output folders are refused. Do not put render outputs under any site's `public/` or deploy them automatically.

External consumers must copy this package's unchanged `public/video-kit/1.0.0/hexly/` font/license assets into their public root. `brandAssetVersion` remains 1.0.0 because those bytes have not changed; `kitVersion` and schema can evolve independently. Renderer `--public-dir` accepts a prepared local asset directory. The root wrapper handles catalogue artwork and downloaded embedded screenshots.

## Review and asset boundaries

```sh
bun run typecheck
bun run video:build
bun run video:check
bun run video:review -- --out /tmp/hexly-v2-review
```

The last command requires the local site server. It captures all 30 settled component/theme frames, creates three contact sheets, checks text bounds and a 320 px Chinese view, and records that no movie was requested. It is a still review, not a video render. Human inspection of the sheets remains necessary; [the local review record](../../docs/video-kit/2.0.0/review.md) records actual observations.

The public manifest contains only component metadata, supported themes and client-preview mode. There are no current sample movies, old posters, exported deck download links or orphan files in `public/video-assets`. Screenshots, contact sheets and representative deck proofs stay outside deployed assets. The five current layouts have no legacy aliases or hidden old implementations. Git tag `v0.6.0` preserves the original published kit and its old sample artifacts.

The dependency set is unchanged. [The vendor record](vendor/pptxgenjs-source.json) documents the reproducible removal of PptxGenJS's unused vulnerable `image-size` dependency; its upstream JS/types/LICENSE remain original. Do not replace this archive with the unpruned package or suppress the advisory.
