# 17 · Projects, templates and recorded media

This change is local and unpublished. Existing tracked logos, large screenshots,
historical artwork and source exports keep their bytes and paths in Git and
Workers Static Assets. No R2 bucket, domain or project movie was created.

## Navigation and canonical routes

| Entry | Route | Content |
| --- | --- | --- |
| Projects / 项目 | `/` | Existing catalogue, search, categories, optional With video filter |
| Logo wall / 图鉴 | `/logos` | Secondary image view of the same catalogue |
| Project detail | `/projects/<id>` | Introduction, optional media, overview, brand archive |
| Templates / 模板 | `/templates` and `/templates/<id>` | Configurable Video Kit compositions and Video/Deck previews |
| Status / 状态 | `/status` | Existing live endpoint monitoring; local SQLite demo data in development |

Play / Journal / Résumé / Portfolio remain the related-site links. Templates
describe reusable designs; finished recordings appear in the relevant project
detail. Projects with no media have no empty player or placeholder section.
Screenshot-only entries are supported. The first catalogue screenshot also
feeds the template adapter; an uploaded browser screenshot can override it.

`#media`, `#video-<video-id>`, `#overview` and `#brand` select page sections.
Native CSS smooth scrolling handles links and history; reduced motion uses
immediate positioning. Selecting another video resets playback to its poster.
Moving to a different section retains the selected recording. A full page reload
uses the recording named in the hash or the first one in the manifest.

`src/model/routes.ts` is shared by Vite, the Worker, client navigation and
discovery. `/logos/<known-id>` redirects to `/projects/<id>#brand`; `/<known-id>`
redirects to its detail. `/videos` and `/videos/*` move to `/templates`, retaining
query parameters. `/projects` redirects to `/`. Former Hermes page names remain
aliases. `/logos/family/`, `/logos/originals/`, `/logos/display/` and `/logos/emoji/`
are asset paths and must never be rewritten.

The build emits only canonical entries in `sitemap.xml`, `llms.txt`, HTML
snapshots, JSON-LD and share metadata. The SPA updates its canonical/OG tags when
switching views. `/api/share/<id>.json` and existing `/og/<id>.jpg` image paths
remain compatible. Template metadata moves to `/templates/manifest.json` and
`/templates/*schema.json`; licensed `/video-kit/1.0.0/` asset URLs stay unchanged.
`robots.txt` keeps pointing to the same sitemap. Generated files belong in
`dist/`, not duplicate checked-in lists.

## One optional media manifest per project

Add `media` to the existing `src/data/projects/<id>.json`. Its types live in
`src/model/project.ts`; `catalogueProblems` validates it at the catalogue
boundary. The following is a shape example, not a published recording. Replace
the example hash, metadata and paths with verified values before adoption.

```json
{
  "media": {
    "videos": [{
      "id": "introduction",
      "title": { "en": "Project introduction", "zh": "项目介绍" },
      "src": "https://media.hexly.ai/projects/example/v1/introduction.mp4",
      "poster": "https://media.hexly.ai/projects/example/v1/poster.webp",
      "durationSeconds": 92,
      "language": "en",
      "version": "1.0.0",
      "sha256": "0000000000000000000000000000000000000000000000000000000000000000",
      "source": "Consumer repository, production revision and licensed asset record",
      "captions": [{
        "src": "https://media.hexly.ai/projects/example/v1/en.vtt",
        "language": "en",
        "label": "English"
      }]
    }],
    "screenshots": [{
      "id": "workspace",
      "src": "https://media.hexly.ai/projects/example/v1/workspace.webp",
      "alt": { "en": "The project workspace", "zh": "项目工作区" },
      "width": 1920,
      "height": 1080
    }]
  }
}
```

Videos require a unique stable ID, bilingual title, file and poster URLs,
duration, language, version, SHA-256 and a provenance reference. Caption tracks
are optional but should accompany narrated or spoken content. Screenshots
require a unique ID, bilingual alt text and intrinsic dimensions. Either list
may be absent. Do not invent content to fill the UI.

The browser requests only the poster before a click. Playback mounts a native
`video` with controls, inline mobile playback, `preload="metadata"`, and caption
tracks. It prefers captions in the selected site language. Failed playback has
a direct-file fallback. There is no automatic playback on page entry and no
server rendering or media proxy on the Hexly Worker.

## Future R2 publication boundary

The code accepts safe same-origin paths and explicit HTTPS URLs on
`media.hexly.ai`; CSP permits that same origin for images, video and subtitle
requests. Credentials, fragments, protocol-relative URLs and other origins are
rejected. This is support for a future public R2 custom domain, **not a claim
that the domain or bucket is configured**.

When media publication is separately authorized:

1. Prepare an H.264/AAC MP4 with `yuv420p` and `-movflags +faststart`, a small
   WebP poster and real WebVTT captions. Keep source recordings/production logs
   in the consumer's archive, outside this repository's deployable assets.
2. Use immutable versioned or content-hashed object paths. Upload only approved
   final media, retain the source/version/checksum, and do not overwrite an
   existing object's bytes.
3. Attach the public R2 custom domain. Set correct `Content-Type`,
   `Cache-Control: public, max-age=31536000, immutable`, and CORS permitting
   `GET`/`HEAD` from `https://hexly.ai` and the intended local review origin.
   Allow `Range`; expose `Accept-Ranges`, `Content-Range` and `Content-Length`.
   Native cross-origin playback and caption tracks require CORS. Check a real
   range request returns `206` before attaching a recording to the catalogue.
4. Verify the file and poster, then add one catalogue record. Do not duplicate
   recordings in the template manifest or move existing Git-tracked imagery.

R2 stores and serves files; it does not produce adaptive renditions. Progressive
MP4 with faststart is the initial path for short recordings. If long films or
variable connections justify adaptive playback, review Cloudflare Stream or a
separate HLS workflow then, without changing where recordings belong in the UI.

References: [R2 custom domains](https://developers.cloudflare.com/r2/buckets/public-buckets/),
[R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/).

## Local verification

```sh
bun run dev
# https://index.dev.hexly.ai/projects/pew
# https://index.dev.hexly.ai/logos
# https://index.dev.hexly.ai/templates?project=pew
# https://index.dev.hexly.ai/sitemap.xml
```

Unit checks cover manifest validation, aliases, filtering, discovery and shared
template input. Browser tests exercise no-media and screenshot-only details,
poster-first playback with actual native decoding, captions, failures, history,
mobile layout and smooth/reduced-motion navigation. Playback fixtures are
created in browser memory and HTTP routes are intercepted; no test recording
is published or committed. Existing identity hash/download checks remain.
