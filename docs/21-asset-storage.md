# Site materials: R2, local source files and recovery

All independently served website materials use the existing `hexlyai` R2 bucket
and `https://h.no.mt`. Read the [project skill](../.agents/skills/hexly-r2-media/SKILL.md)
before publishing or recovering material. The reviewed migration and its
completion evidence are recorded in [the execution plan](20-r2-assets-execution.md).

## The boundary

The Worker serves HTML, application JavaScript/CSS, APIs, catalogue and template
configuration, sitemap, robots and llms. It redirects old material URLs to R2.
Main-site image, font and material-download references use the CDN directly.
Historical comparison HTML and its JS/CSS remain on hexly.ai, preserving their
exact bytes, relative references and canonical project navigation.

Browser navigation to a standalone brand review receives a streamed module tag
for the shared CDN download handler. This view uses `no-store` and varies by
`Accept`/`Sec-Fetch-Dest`; ordinary raw fetches keep the original HTML bytes and
hashes. The source files and their R2 archive copies are never edited. This
keeps native download buttons usable after cross-origin redirects without a
Worker media proxy or modifications to a frozen brand package.

R2 serves images, textures, fonts, videos/audio/captions and downloadable brand
packages. Package source copies may include HTML/code, but these are not new page
canonicals. Public manifests retain their original root and original checksums;
canonical identity and delivery origin are distinct. Never rewrite a frozen
manifest or recolor an official project Logo during an infrastructure migration.

Git retains source code, SVG source geometry, project/brand manifests, provenance,
prompts, licenses, inventory and publication receipts. Existing binary originals
are retained during the migration; after production acceptance they are removed
from tracked files/history into verified object storage and the full external Git
backup. The local material tree can be hydrated for authoring and tests. No
movie, render cache or newly generated large binary belongs in a commit.

## One inventory and one transport configuration

- `src/data/media-storage.json`: bucket and CDN origin.
- `docs/assets/inventory.json`: source path, public identity path (where present),
  immutable key, bytes, complete SHA-256, MIME, project, role and provenance.
- `src/data/asset-routes.json`: generated mappings for loose files. Versioned
  brand, family and template-font paths preserve their package-relative keys.
- `docs/assets/publication.jsonl`: append-only successful CDN verification
  receipts. Each includes exact URL, checksum, byte count, MIME and observation
  time. A past receipt proves the checked upload, not current availability.
- `docs/media/`: existing finished-film receipts with production/version details;
  active recordings stay in the catalogue's optional `media.videos`.

The inventory's source-archive entries preserve public historical original bytes.
Repeated local source copies may reference one existing public object with the
same hash. Frozen public package paths remain distinct when their manifests need
them, including duplicated licensed fonts; namespace compatibility takes priority
over a few MiB of deduplication. Source rights are inherited from recorded
evidence, never inferred from the destination bucket or its public visibility.

## Common commands

```sh
bun install --frozen-lockfile
bun run assets:r2 -- plan
bun run assets:r2 -- url /brands/snail/v2.0.0/mark-light.png
bun run assets:r2 -- hydrate --project snail
bun run assets:hydrate
bun run assets:check
bun run build
```

Hydration restores missing inventoried files and verifies downloaded bytes. It
preserves any existing local edits; `assets:check` then catches unwanted changed
identity/archive bytes. `.wrangler/asset-cache` caches content by SHA-256 and is
never deployed. Authoring commands can hydrate just the project they need.

The browser fixtures intercept the real CDN paths and serve local verified
assets. The local Worker serves an isolated hard-linked material tree outside
dist; this tree is never part of production. The production gateway redirect
logic has separate unit/production checks. Local D1 isolation is unchanged.

`video:render` hydrates and copies the selected project images and licensed fonts
into an isolated renderer public directory. It rewrites only the temporary render
configuration to local paths; exported website configurations retain their real
CDN URLs. Existing local/consumer-supplied images continue to work.

## New projects and changed materials

1. Read the catalogue, original identity rules and source rights. Use the stable
   project ID; prepare source/provenance in versioned directories.
2. Export public brand material to `public/brands/<id>/v<X.Y.Z>/`. Existing
   package versions are frozen. Preserve official/campaign roles and licenses.
3. Run `assets:r2 inventory`, inspect the project plan, upload its named files,
   and verify. Store only the resulting small records and source code in Git.
4. Use the shared resolver for images/CSS/metadata and `AssetLink` for downloads.
   Do not change Vite's global base or copy materials into dist.
5. Validate the canonical project page, downloads, fonts, themes, mobile layout
   and old URLs. Complete the authorized catalogue/profile/status onboarding.
6. Publish the website with its normal exact-SHA release workflow.

Uploads are a bounded single-writer operation. The local lock and immutable
version/hash keys prevent accidental local overlap; HEAD/PUT does not claim
distributed atomicity. Stop on conflicting bytes. Published objects have no
lifecycle expiry. Rollback selects an earlier object/reference; deletion and a
second history rewrite are separate, explicitly scoped operations.
