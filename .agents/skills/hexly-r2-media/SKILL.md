---
name: hexly-r2-media
description: Manage this repository's hexlyai R2 media bucket at h.no.mt. Upload approved project videos, posters and captions under immutable project/video/version paths, obtain verified public URLs, and maintain the project catalogue and publication records.
---

# Hexly project media

Use this skill for Hexly's recorded project media, including replacing a film
with a new version, retrieving its URLs, or checking an existing upload. The
Video Kit's reusable templates stay separate from finished recordings.

## Actual resources

- Cloudflare account: **Zheng Li Workspace**.
- Bucket: **`hexlyai`**, APAC, Standard storage.
- Public origin: **`https://h.no.mt`**, active custom domain, minimum TLS 1.2.
- Machine-readable bucket/origin: [`src/data/media-storage.json`](../../../src/data/media-storage.json).
  Read this before using a remembered hostname. `media.hexly.ai` and
  `hexly-media` were proposals and are not this service.
- The site links to R2 directly. Do not add an R2 binding or a media proxy to
  the Hexly Worker. Existing tracked logos/screenshots remain in Git and
  Workers Static Assets with their original paths and bytes.
- The owner's CORS configuration, checked 2026-09-12, allows
  `https://*.dev.hexly.ai`, `https://*.hexly.ai`, `https://hexly.ai`,
  `https://lizheng.dev`, `https://lizheng.me`, and `https://lizheng.blog`;
  methods GET/HEAD/PUT/POST/DELETE, all request headers, exposed
  ETag/Content-Length/Content-Type, max age 1800 seconds. Preserve it unless
  the task includes changing it. CORS does not grant anonymous upload access.
- The only observed lifecycle rule aborts incomplete multipart uploads after
  seven days. Completed media have no expiry. The status D1 seven-day retention
  rule does not apply to these files.

## Keys, versions and records

```text
projects/<catalogue-id>/videos/<video-id>/v<X.Y.Z>/<filename>-<sha256-first-12>.<ext>
```

The project ID comes from `src/data/projects/<id>.json`. A video ID identifies
one film, for example `context-en`; its version is independent of the app,
website and Video Kit versions. Start a film at `1.0.0`, and increment its
version for a revised publication. Keep previous URLs working. Hashes make
individual object URLs immutable; never replace different bytes at an old key.

Keep a small publication receipt at
`docs/media/<project>/<video-id>/v<version>.json`: source repository/revision and
production directory, duration, upload date, each file's key, public URL,
SHA-256, byte size and Content-Type. Do not put narration, production logs,
MP4/audio binaries or renderer caches in this repository. The active film is
referenced once in the existing project's `media.videos`; old receipts remain
available for maintenance and rollback.

## Inspect or upload

Run from the repository root using its installed Bun and Wrangler. Read the
repository's CLAUDE.md and [media contract](../../../docs/17-project-media.md).
Honor the current request: inspection and the default command below are
read-only; an upload request authorizes the named files, and a release request
authorizes the site's normal release workflow. Do not request the same approval
again, or infer permission to change other buckets, CORS or unrelated files.

```sh
wrangler whoami
wrangler r2 bucket info hexlyai --json
wrangler r2 bucket domain list hexlyai
wrangler r2 bucket cors list hexlyai
wrangler r2 bucket lifecycle list hexlyai

# Local plan only: validate, hash and print the exact future URL.
bun run media:r2 -- --project hermes-on-herdr --video context-en \
  --version 1.0.0 --file /absolute/path/hermes-on-herdr-context-en.mp4

# Add --upload only within the user's upload authorization.
bun run media:r2 -- --project hermes-on-herdr --video context-en \
  --version 1.0.0 --file /absolute/path/hermes-on-herdr-context-en.mp4 --upload
```

Repeat for the approved poster and real WebVTT file under the same video/version.
The helper freezes the input in a temporary directory, sets its MIME type and
`Cache-Control: public, max-age=31536000, immutable`, and verifies the full file
through the public CDN. A matching existing object is reused; unexpected HTTP
responses or different public bytes stop the operation. It does not overwrite
an existing object, rewrite the source or automatically publish the website.
Use its printed URL, not an S3 API endpoint or r2.dev URL. It never needs token
values in source, arguments or output. If Wrangler rejects a large file, use
authenticated S3 multipart upload for that exact key and verify the same hash;
do not add a new proxy service.

Before upload, inspect the original with ffprobe: H.264/AAC MP4, 16:9 dimensions
and moov before mdat give predictable progressive playback. Use the supplied
approved export; do not silently regenerate or transcode it. Preserve supplied
posters and caption timing. If the picture already has burned-in captions, set
`captionsBurnedIn: true` so the optional native caption track starts off.

## Verify, integrate and retrieve

1. Check public HEAD/GET, SHA-256, correct MIME and cache headers. For MP4, a
   request with `Range: bytes=0-1023` must return 206 with the expected bytes.
   Check CORS with the actual production and local review origins; curl without
   an Origin header does not test browser CORS.
2. Add the active film to `src/data/projects/<id>.json` using the existing
   `ProjectVideo` type: bilingual title, src, poster, actual duration, language,
   video version, MP4 checksum, receipt path as source, and real captions.
   Keep the CDN allowlist and `public/_headers` CSP aligned with the storage
   origin. There is no per-template copy of the film.
3. Use the actual local HTTPS page to verify poster-first loading, play, seek,
   captions, and mobile layout. CI browser tests intercept media and must not
   depend on Cloudflare or download real films.
4. Publish only when requested, using `bun run release -- minor` for Y+1 (or
   the requested version), after committing the intended work and running the
   relevant checks. Follow `docs/05-release.md`; verify the exact production
   revision and `/projects/<id>#video-<video-id>` after deployment.

To recover URLs, read `media.videos` for the active version and the matching
`docs/media/` receipt for every published asset. The URL is always the storage
origin plus `/` plus its key. Wrangler currently has no object-list command;
do not invent `wrangler r2 object list`. Use receipts/Git history, or an already
authorized S3 client for a bucket inventory. Metadata is not proof an object is
healthy: verify its public response when diagnosing a failure.

For a 403 with Cloudflare error 1010, compare curl and a real browser before
changing permissions: this zone rejected Python urllib's default client during
the first publication while curl and the CDN uploader worked. Preserve TLS
verification and existing security policies.

Changing the active catalogue entry is the normal rollback. Removal from the
site is not permission to delete the public object. For an explicitly requested
delete, first identify the exact receipt/key and all references; use
`wrangler r2 object delete hexlyai/<key> --remote` only for those named objects.
Never apply a blanket lifecycle expiration to published videos.
