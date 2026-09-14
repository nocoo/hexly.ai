# Optional project screenshots

Use the existing `src/data/projects/<id>.json` as the only active gallery list.
`media.videos` and `media.screenshots` are independently optional. Do not create
empty players, synthetic screenshots or one copy per Video Kit template.
The first screenshot's preview also feeds the existing template adapter.

## Source intake and versions

Read the source project's actual store/materials manifest and inspect the images.
Prefer its versioned exports over an unversioned duplicate. Record the inspected
Git revision, source path, SHA-256, dimensions, rights and capture/composition
provenance. Read sibling repositories without writing to them unless separately
authorized. A supplied store composition can include demo configuration and
generated scenery; preserve that distinction and the upstream generation record.
Importing it is not new image generation or a claim that a product is released.

The current examples each contain three **unchanged 1280 × 800 PNGs**:

| Catalogue ID | Source repository revision | Source directory |
| --- | --- | --- |
| `hooky` | `7ab9c8a23895ae836b49545f962fcf169e097970` | `materials/2.0.0/store/screenshots/` |
| `r2shot` | `89cd7217a35af6cc5890bee02e9e97a7febfd1a8` | `materials/2.0.0/store/screenshots/` |

Use stable image IDs such as `workspace`, `settings`, or `store-01`. Array order
is display order; there is no fixed count or required ratio. These first imports
have media version **1.0.0**, independent of the product's **2.0.0** materials and
the website version. Revised bytes get a new media version; keep earlier objects
and receipts. Removing a catalogue entry does not delete its stored files.

## Files and records

```text
public/screenshots/<project>/<image-id>/v<X.Y.Z>/
  original.<ext>       # exact original bytes, same file type as supplied
  preview.webp         # full canvas, max 1600 × 1600, no enlargement
  thumbnail.webp       # full canvas, max 320 × 320, no enlargement
docs/assets/<project>/screenshots/<image-id>/v<X.Y.Z>.json
docs/assets/<project>/screenshots/LICENSE
```

`public/` here is the ignored local hydration tree, not a deployment destination.
The batch inventory assigns role `project-media`, references that versioned
receipt and generates these immutable object keys:

```text
projects/<project>/screenshots/<image-id>/v<X.Y.Z>/original-<hash12>.<ext>
projects/<project>/screenshots/<image-id>/v<X.Y.Z>/preview-<hash12>.webp
projects/<project>/screenshots/<image-id>/v<X.Y.Z>/thumbnail-<hash12>.webp
```

Copy originals with overwrite protection. Use the already installed Sharp for
the two derivatives; each contains the complete source canvas. The established
recipe is `resize({ width: bound, height: bound, fit: "inside", withoutEnlargement:
true }).webp({ quality, effort: 6 })`, with `(bound, quality)` of `(1600, 92)` for
previews and `(320, 82)` for thumbnails. Use the original for precise detail in
the Lightbox. Preserve transparency and product colors; do not crop wide/tall
captures to 16:9 or pad them into a new image. Inspect text legibility after
conversion. This recipe is a default, not permission to modify the original.

Model new receipts on `docs/assets/hooky/screenshots/store-01/v1.0.0.json`:
source revision/path/rights, original hash and bytes, actual intrinsic dimensions,
each derivative's transform and `derivedFrom` hash, object keys and verified URLs.
Keep publication `pending` until the exact CDN bytes pass verification, then link
the matching records in `docs/assets/publication.jsonl`. Do not invent timestamps.

## Publish only the approved files

Run `bun run assets:r2 -- inventory`, inspect the new entries and preserve any
unrelated pending assets. `assetKey` recognizes the screenshot directory pattern;
`assetUrl` uses its generated mapping in `src/data/asset-routes.json`. For a whole
approved project batch, the normal `plan`, `publish --upload` and `verify`
commands apply. For a screenshot-only task, select the precise directory with
the same existing uploader rather than publishing an unrelated brand candidate:

```sh
bun - <<'TS'
import { readInventory, publish } from './scripts/asset-storage';
const prefix = '/screenshots/hooky/store-01/v1.0.0/';
const files = readInventory().files.filter(file => file.path?.startsWith(prefix));
if (files.length !== 3) throw new Error('Inspect the selected screenshot files.');
console.log(files.map(file => file.key));
await publish(files, 3); // Only during an authorized R2 upload task.
TS
bun run assets:r2 -- url /screenshots/hooky/store-01/v1.0.0/original.png
bun run assets:r2 -- hydrate --project hooky
```

The uploader freezes/verifies local bytes, uses the repository lock, records full
GET hashes and MIME checks, and stops on conflicts or authorization failure.
Also check bare CDN URLs and CORS for the actual development/production origin.
Use `crossorigin="anonymous"` consistently for crawler HTML and React images,
including full-size and thumbnail views, so an earlier image request cannot
poison later CORS fetch/canvas reuse with a cached non-CORS response.
Keep the owner's bucket CORS and lifecycle unchanged. No Worker media proxy,
new bucket, binary Git commit, or product-repository change is needed.

## Catalogue and presentation

After verification, add one entry per image to `media.screenshots`:

```json
{
  "id": "store-01",
  "src": "/screenshots/hooky/store-01/v1.0.0/original.png",
  "preview": "/screenshots/hooky/store-01/v1.0.0/preview.webp",
  "thumbnail": "/screenshots/hooky/store-01/v1.0.0/thumbnail.webp",
  "source": "docs/assets/hooky/screenshots/store-01/v1.0.0.json",
  "alt": {
    "en": "Send page context to a webhook from the browser popup.",
    "zh": "从浏览器弹窗，把当前页面内容发送到 Webhook。"
  },
  "width": 1280,
  "height": 800
}
```

`src`, `alt`, `id`, `width` and `height` form the minimal compatible contract.
`preview`, `thumbnail` and `source` are optional, but new R2 intakes should provide
all three. Dimensions always describe the original. Both derivative paths fall
back to `src` when absent; do not invent inaccessible URLs to fill those fields.

Keep Project Detail ordered as introduction → optional media → overview → brand
archive, with a single project picker/category/search header above the introduction
and the brand Hero inside `#brand`. Only the carousel is sticky below the site
navigation; the controls above scroll away. Keep the selection centered, including
edge items, and reserve its measured height for section anchors. This shared structure applies to all projects;
later batches only add optional media data. Do not insert placeholders or duplicate
pagination for projects without media. The gallery preserves varied ratios;
desktop shows a small grid and mobile supports horizontal browsing. An ordinary
click opens the full-resolution modal; a modified click keeps the original-file
link. The native dialog traps focus, restores the opener, locks background
scrolling and closes with Escape. Multiple images have bottom thumbnails, previous/
next buttons, arrow keys and Home/End; a single image omits navigation.

For Chrome extensions, keep the verified Chrome Web Store listing in `website`.
The detail derives the official installation badge and bilingual Add to Chrome
label from that URL, rather than displaying Visit website or duplicating the link
in media metadata. Store compositions and the official Google badge have separate
provenance. The badge is shared under `public/badges/chrome-web-store/v1.0.0/`,
with role `third-party-badge`, unchanged bytes and rights recorded in
`docs/assets/hexly-ai/badges/chrome-web-store/v1.0.0.json`; its R2 key is resolved
through the normal inventory. Preserve the complete official badge, original
colors/proportions and Google branding restrictions; it is not an MIT Hexly Logo.

Run `bun run docs:profiles` after catalogue changes. The build derives crawler
HTML, catalogue JSON, `/agents/projects/<id>.md`, canonical routes and sitemap
from the same data. Screenshots do not create separate sitemap pages. Check
typecheck/build and the project-media/asset tests; visually verify actual gallery
and focus views on mobile/desktop and light/dark, plus empty/solo/mixed-ratio
fixtures. Keep render/test captures ignored. A local review uses
`https://index.dev.hexly.ai/projects/<id>`; do not push or deploy the website until
the user authorizes that step.
