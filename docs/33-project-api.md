# Single-project identity API

`GET https://hexly.ai/api/projects/{owner}/{repo}` retrieves one catalogue project by its
GitHub owner and repository name. Both names are case-insensitive; repositories retain
dots, underscores and hyphens: `life.ai` is the repository; `life-ai` is the Hexly
page slug. There is no list, batch, search or query-parameter interface.
The owner is required, currently nocoo, and is derived from the recorded GitHub URL. Other owners can be added without repository-name collisions.
The existing website catalogue at `/data/projects.json` remains public and serves
the directory; it is separate from this integration API.

```sh
curl --fail 'https://hexly.ai/api/projects/nocoo/life.ai'
```

The response is one JSON object:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | `1` |
| `id`, `owner`, `repo` | Hexly slug, GitHub user/organization, repository name |
| `title`, `description` | Display name and `{en, zh}` descriptions |
| `emoji`, `category`, `archived` | Catalogue identity and state |
| `github`, `website`, `url` | Repository, nullable destination, canonical Hexly detail page |
| `icons.small`, `icons.large` | Absolute CDN URLs for 64px and 512px project-identity images |
| `logos[]` | Available logo variants, described below |
| `brand.manifest` | Versioned brand manifest URL, or `null` |
| `brand.source`, `brand.originalSha256` | Original identity source and original-file checksum |

Every logo variant includes `id`, `url`, `width`, `height`, `format`, `background`,
`role`, `usage`, and `theme`. Links resolve to immutable materials at `h.no.mt`.
The API does not generate images or upload materials.

| Attribute | Values and selection |
| --- | --- |
| `background` | `transparent`: foreground with alpha; `opaque`: complete background; `original`: source appearance, transparency not guaranteed |
| `role` | `project-identity`: original identity or matching foreground derivatives; `hexly-campaign`: separately identified presentation artwork |
| `usage` | `original`, `navigation`, `presentation`, `apple-touch-icon` |
| `theme` | `any`, `light`, `dark`; describes artwork suitability, not an instruction to recolor it |

Use transparent project-identity assets for navigation, sidebars and favicons.
Existing brand packages provide 16/24/32/48/64/128/256/512px PNG marks, with 1024px
transparent WebP and native foregrounds from family archives. Background family
artwork provides 32/64/160/256/512/1024px WebP and native PNG; packaged presentations
also provide light/dark 512px tiles and opaque 180px Apple touch icons.
Projects without these archives return their existing original and display assets.
Missing variants must not be inferred or fabricated.

Small/large defaults never silently adopt a different family drawing. A foreground
is labelled project identity only when its recorded original hash matches the
project's original hash. Other family artwork remains campaign material even if
the catalogue records an adoption status. Check the manifest's exact rights,
provenance and scope before using campaign material in an independent product.
Preserve aspect ratio, geometry, color and original bytes; use `object-fit: contain`.
The original checksum does not apply to resized derivatives.

## HTTP and caching

- No authentication or cookies. `Access-Control-Allow-Origin: *`.
- `GET` returns JSON; `HEAD` returns the same headers without a body;
  `OPTIONS` returns 204 and advertises these methods.
- 400: missing/invalid repository, missing owner, batch or query parameters.
- 404: unknown repository. A catalogue slug is not an alias for a different repo.
- 405: unsupported method, with `Allow: GET, HEAD, OPTIONS`.
- 503: temporary asset/storage failure. Error bodies are `{ "error": "..." }`
  and use `Cache-Control: no-store`.
- Successful responses use `Cache-Control: public, max-age=3600`. Production
  stores them in the Worker Cache API with a canonical lowercase URL. HEAD reads
  the same GET entry. Cache writes use `waitUntil`; client cookies and conditional
  headers are not forwarded to the static asset binding.
- Cache contents are local to each Cloudflare data center. Deployment does not
  purge these entries; an existing entry may remain for up to one hour. Consumers
  should also cache for no more than one hour and never treat failures as data.
- Local development/test bypasses the edge cache. No D1 or live GitHub request
  is required by this endpoint.

## Maintenance and preview

`src/data/projects/<id>.json` remains the source. The pure projection in
`src/model/project-api.ts` is emitted as one JSON asset per owner/repository pair by
`scripts/project-api-assets.ts`; the build checks owner/repository uniqueness and every
returned logo against the R2 inventory. `worker/project-api.ts` owns HTTP policy
and caching. `bun run dev` proxies `/api/projects` to the daily local Worker;
restart it after catalogue changes to rebuild its assets.

Each project detail has an `#api` section with a real same-origin request, compact
card preview, expandable logo/JSON views, request copying, and a copyable English
agent prompt selecting the page's description language. Existing project Markdown
agent guides include the same instructions. Loading, error/retry, project changes,
clipboard feedback, keyboard access and narrow layouts are covered by browser
tests. HTTP tests exercise all catalogue records and actual image bytes.
