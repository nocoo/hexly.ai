# 29 · 项目、品牌与素材维护约定

本文保存目录、品牌、素材、视频和项目接入的详细约定。仓库入口、测试命令与 6DQ 要求见 [CLAUDE.md](../CLAUDE.md)。以下代码路径均相对仓库根目录；链接按本文位置解析。维护目录、身份或媒体前须阅读对应章节与项目 Skill。

## 资料与工具索引

| Fact | Where |
|---|---|
| Catalogue | `src/data/projects/`; public `nocoo/nocoo` profile and recorded repository evidence |
| Project media / routes | Optional `Project.media` in the same catalogue; [routes and media boundary](../docs/17-project-media.md) |
| R2 material operations | Bucket/origin in `src/data/media-storage.json`; [project skill](../.agents/skills/hexly-r2-media/SKILL.md), [storage contract](../docs/21-asset-storage.md), `docs/assets/inventory.json` and publication receipts; existing film receipts in `docs/media/` |
| Git history / recovery | [Recovery guide](../docs/23-git-history-recovery.md); preserve original bundles and commit/ref maps; never merge the old binary history back |
| Identity rules | [docs/02-identity-rules.md](../docs/02-identity-rules.md), generated `docs/profiles/`; [logo family studies](../docs/06-logo-family.md) in `artwork/logo-family/` |
| Brand background textures | [Project texture skill](../.agents/skills/hexly-brand-textures/SKILL.md): habitat-related foliage for animals/birds, meaningful working materials for 3D tools, exact Flare evidence and readable light/dark presentation |
| Family website entry | [Project entry skill](../.agents/skills/hexly-site-entry/SKILL.md): GitHub → Hexly → Theme, canonical project-detail links, matching icons/tooltips and explicit page exclusions |
| Independent texture packs | Optional `Project.brandTexture`, `public/textures/<id>/v<version>/`, R2 `projects/<id>/textures/v<version>/`; [maintenance and rollout](../docs/27-project-textures.md). Keep identity kits and original Logo/RGBA bytes unchanged. |
| Complete brand archives | [inventory and scope](../docs/brand-archives/README.md), [maintenance guide](../docs/19-family-brand-archives.md), `public/brands/schema-v2.json` |
| Version | Root `package.json` as `X.Y.Z`; display `vX.Y.Z`; build emits version and Git revision at `/api/live` |
| Status | `src/model/status.ts`, `worker/status.ts`, [storage and scheduling](../docs/11-status-monitoring.md) |
| Video Kit | `packages/video-kit/`, `src/data/videos.json`; standard-outro records retained in `src/data/template-examples.json`; [family and publication rules](../docs/16-video-kit.md) |
| Agent handoffs | `src/model/agent-guide.ts`; page-specific `/agents/*.md`, HTML alternate links, copyable instructions; [agent guide contract](../docs/25-agent-guides.md) |

## 目录、品牌与交互边界

- Serve the Vite build through the existing Worker and Static Assets. `/api/live` and `/api/share` remain build artifacts. The gateway also runs status Cron and reads D1; there is no authentication or runtime GitHub dependency.
- The catalogue is the monitor list: only non-archived independent HTTPS websites, at their origin plus `/api/live`. Exclude store/distribution links. D1 `hexly-status` uses `STATUS_DB`; Cron runs every five minutes. Each write deletes checks older than seven days, reads apply the same cutoff, and `(project_id, slot)` prevents duplicates.
- Visitors only read observations. Missing/stale checks remain unknown; HTML fallbacks, redirects, and login pages are never healthy. Local mock data is labeled and must never seed production.
- Status timestamps, hourly buckets, retention, and availability calculations remain UTC. Display times in the browser's current time zone by default; the top selector remembers an explicit choice, and Local follows the browser. Use `Intl` for date-specific offsets and daylight-saving transitions.
- Preserve English/Chinese, light/dark, desktop/mobile, keyboard access, preference persistence, and shareable navigation. Main navigation is Projects / Templates / Status (项目 / 模板 / 状态); retain Play / Journal / Résumé / Portfolio as the related-site links.
- `/templates` adapts the existing catalogue once for five content layouts, five independent openings, five independent endings and Video/Deck views. Both film themes use the actual site light/dark palettes; canvas theme is independent of the surrounding site theme. Preserve composition choices in navigation and exported v2 configuration. Keep the official Hexly mark/wordmark, licensed fonts, paper/ink/terracotta tokens, red-dot restraint and shared motion primitives. Deck and reduced motion show settled states; previews start paused.
- Shared template code belongs in `packages/video-kit`; project-specific scripts, voices, scenes, production logs and finished films belong to their consumer. Consumers pin a published Git SHA. The package is private, not an npm release. Preserve concurrent handoffs and stop on unknown writes.
- The component manifest is metadata only. Cards and previews use the same client composition; do not return obsolete sample movies, posters or deck downloads to `public/video-assets`. `video:check` verifies the 5/5/5 manifest, both themes, licensed asset hashes and the absence of rendered media in public assets. The five ready-to-use standard Hexly outros at `/templates#outros` are project-independent; reuse the immutable R2 movies directly, without regenerating them per project. Show all five on every template page. `/templates/outros.json` derives its `outros` array and reuse semantics from the historical `src/data/template-examples.json`; keep `/templates/examples.json` and `#examples` compatible. Receipts remain in `docs/media/hexly-ai/`. Project/theme controls affect only the separate live composition. Start native playback only after a click. For HTML-produced clips, capture high-resolution posters from the matching HTML composition, never from compressed MP4 frames. Keep all movies, stills and renderer caches outside Git and deployed assets. Brand assets keep their separate immutable version when their bytes are unchanged.
- Every canonical page has a copyable Agent guide derived from existing data, readable in HTML and at its `/agents/...md` alternate. Keep HTML links, runtime navigation, generated Markdown and `llms.txt` aligned. Exact generation prompts remain original archive text; retained/supplied artwork uses presentation briefs. Never label newly authored integration instructions as original generation prompts. Copy feedback must not dump full instructions into the global toast. See `docs/25-agent-guides.md`.
- `/` is the project catalogue, `/logos` its secondary image wall, and `/projects/<project>` the detail. Details contain introduction, optional media, overview, then the complete `#brand` archive. Old `/logos/<project>` links redirect to that brand anchor; `/videos` and its paths redirect to `/templates`, retaining query parameters. Use the shared `src/model/routes.ts`; do not redirect logo asset directories. Keep generated sitemap, HTML snapshots, JSON-LD, canonical/share records, `llms.txt`, and runtime metadata on canonical routes.
- The brand Hero belongs inside `#brand`, after the product's optional media and overview. `media.screenshots` is an ordered optional gallery: preserve each image's full aspect ratio, use smaller `preview`/`thumbnail` derivatives when available, and load `src` in the focus Lightbox. Keep bottom thumbnails, arrow-key navigation, Escape close, focus restoration, mobile controls and reduced motion. One image needs no previous/next controls; no media means no placeholder. Source receipts and repeatable R2 paths are documented in the [screenshot runbook](../.agents/skills/hexly-r2-media/references/project-screenshots.md).
- Project selection, category filtering (All projects) and search share one header at the top of every detail page, before the project introduction. Only the carousel sticks below site navigation; its category/search row scrolls away. Keep the selected item centered, including edge items and resized views, and include the measured carousel height in document scroll padding. Do not duplicate previous/next controls or bury the picker inside the brand archive. Selecting/filtering here starts at the project introduction; keyboard brand browsing keeps an explicit `#brand` anchor aligned. Hash navigation uses native smooth scrolling and respects reduced motion; do not override it with instant scrolling. Keep logo/wordmark descenders visible and long headings within the viewport. Verify the full gallery browser suite after changing its layout.
- Chrome Web Store destinations use an installation CTA, not Visit website. Derive this from the existing verified `website` URL (currently Hooky and R2Shot), never a second hardcoded URL list. The detail uses the unchanged official Google store badge and bilingual Add to Chrome labels; catalogue cards use a compact Chrome install link. Keep the badge's original proportions/colors, Google rights receipt, R2 delivery and the source GitHub link on the detail. Store links remain excluded from health targets.
- Finished recordings belong to optional `media.videos` on their project's existing JSON, never one copy per template. Render a poster before user-initiated native playback; include actual captions when available, defaulting them off when `captionsBurnedIn` is true. Screenshot-only projects work without a video. Omit empty media sections. Catalogue browsing uses search, categories and sort; recordings appear on project details without a video filter or overlaid card badges. Approved new media use R2 `hexlyai` at `https://h.no.mt`, with immutable project/video/version/hash paths. Read the project R2 skill before media operations, keep versioned upload receipts in `docs/media/`, and never add movie binaries to Git or Static Assets. Preserve the owner's CORS policy and completed objects; the seven-day rule only aborts incomplete multipart uploads. No Worker R2 binding or media proxy is needed.
- All hides repositories marked `archived`; existing product categories and direct archived-project routes remain accessible. Directory cards no longer show a Refined badge; redraw status belongs in the brand archive.
- Archived projects receive basic support only. Exclude them by default from all batch enrichment, redesign, brand/texture/media creation and catalogue-cleanup initiatives. Preserve their archived state, existing pages, links, downloads, licenses and provenance; fix shared compatibility or access regressions when necessary. Keep work already completed, but do not fill gaps, regenerate assets or expand their presentation unless the owner explicitly names an archived project for that work. “All projects” in future maintenance tasks means non-archived projects unless explicitly overridden.
- Default catalogue order follows the animal/template/game snapshot in `src/data/project-order.json`, then the remaining catalogue entries. Animals sort by descending stars, using total default-branch commits when both have zero stars. The Tools filter also promotes the recorded `featuredTools`; preserve the separate Skills category and existing assignments. A–Z sorts matching names alphabetically. Omit hexly.ai itself from the directory; preserve its brand record separately in `src/data/site-identity.json`.
- Every project needs a stable slug, title, bilingual descriptions, emoji, verified links, logo provenance, and evidenced foreground/background colors. Follow the identity rules; do not infer websites or invent palettes.
- All independently served material uses R2 `hexlyai` / `https://h.no.mt`. Preserve immutable Logo/brand bytes, paths, hashes, licenses and provenance; source records/SVG geometry remain in Git, binary working files hydrate from the inventory. HTML/code, APIs and discovery documents stay on the Worker. Use `assetUrl` for transport and `AssetLink` for cross-origin downloads. Production builds exclude media and enforce 20 MiB. See [migration and authorized history reduction](../docs/20-r2-assets-execution.md); the 2026-09-13 owner instruction supersedes the earlier Git/Static Assets retention rule.
- Original project identity shapes, proportions, colors and file bytes are authoritative. Hexly paper/ink/terracotta, fonts, red points and composition apply only to Hexly project archives and Hexly-authored campaigns, videos, decks and social graphics. Independent products keep their own complete palettes, themes and UI. A campaign Hero or family study never silently replaces a product Logo.
- For an authorized project rename, update its catalogue ID and route while preserving the numbered profile. Locate historical artwork through `family.root`; preserve archive paths, export names, original bytes and checksums. Redirect former page URLs with Static Assets `_redirects`.
- Synchronize catalogue changes with the GitHub profile using the workflow skill `zhengli-update-github-readme` (`../workflow/agents/skills/zhengli-update-github-readme/SKILL.md`). Keep backups, palettes, source revisions, and generated profiles consistent.
- Preserve the current identity baseline. Logo-family studies with `gpt-image-2` live in `artwork/logo-family/`; retain raw outputs, prompts, references, and finishing versions. Choose new subjects by the product-type defaults below. Candidates require review at artwork, app-icon, sidebar, and favicon sizes before promotion.
- Immediately show each new Image 2 result for raw-image confirmation, unless the owner explicitly delegates acceptance for a named batch. Record the exact waiver and agent inspection without claiming owner review of unseen bytes. Require an approved `raw-review.json` for those exact bytes before extraction, compositing, derivatives, or catalogue integration. Every animal needs visible connected facets and one interest point outside its main mass; every project's background needs distinct motif geometry.
- Every finished study has static review HTML and a complete site comparison. Keep `family.status` and its separate foreground truthful to source adoption; `project.logo` remains source provenance. Presentation reference boards appear only in static HTML and Git. Background-only passes preserve exact transparent/white bytes.
- Follow [the logo usage SOP](../docs/07-logo-usage-sop.md): large README presentations may use backgrounds; sidebar and browser marks use transparent foregrounds without extra masking. Verify actual consumers and distinguish local adoption from publication.
- Versioned brand kits use optional `brandKit` metadata, `artwork/brands/<id>/v<version>/` source records and immutable `public/brands/<id>/v<version>/` exports. Native kits retain SVG; `method: "gpt-image-2"` combines the complete `family` comparison with raster marks/lockups, licensed outlined wordmarks, independently generated wide/square Hero sources and separate repeatable theme textures. Never call a generated raster a native SVG. Preserve real Hexly tokens, font notices, all previous versions and checksummed manifests; run mutable source formatting before export. Keep source adoption and the product release separate from brand publication; a Hexly-only handoff may have null source/profile revisions. See [Snail's versioned handoff](../docs/18-snail-brand.md). Exact-byte image-generation checkpoints apply to generated artwork.
- `method: "archived-artwork"` packages existing artwork without new generation. Use the schema-v2 roles `officialProjectIdentity` and `campaignInterpretation`, explicit `scope: "hexly-campaign"`, and exact file/decoded RGBA hashes. Wide and mobile Heroes are independently authored compositions of the full source canvas. Keep per-project motif geometry distinct. `brand-collection` tests protect the complete catalogue baseline, original colors, historical paths and Snail v1/v2; they also check both themes, narrow screens and downloads. Never format copied `official-logo.*` source bytes; Biome excludes those immutable files, while tests enforce them.

## 按产品类型选择品牌方向

Read the actual product purpose and primary interaction before choosing a new
identity. The owner's defaults are:

| Product type | Default identity direction |
|---|---|
| Tools: CLI utilities, scripts, libraries, agent extensions | Skeuomorphic 3D physical objects that relate to the tool's purpose; `family.series: "material"` |
| Web SaaS services used primarily in a browser | Recognizable animals in the established fragmented animal family |
| Native macOS applications, including native menu-bar utilities | Birds within the established animal family |

Classify by the product itself, not its repository name. A tool's documentation
or landing website does not make it a Web SaaS service. Animal/bird facet and
anatomy rules apply to those series; material objects use believable 3D volume,
construction and materials. All series share the archive, review and usage
standards in [the identity rules](../docs/02-identity-rules.md).

Explicit owner direction takes precedence. These are defaults for new identities,
not a request to redesign existing approved Logos or change their colors.

For new GPT Image requests, the owner's 2026-09-14 model policy is
`gpt-image-2.5-sunburst` for Logos and primary identity artwork, and
`gpt-image-2.5-flare` for secondary decoration such as support textures. Read the
current Workflow `agi-image-generation` skill and select the deployment explicitly;
the owner has already authorized Flare for this decorative scope. Preserve the
actual model in each receipt and all historical model records. Model choice does
not replace the exact-byte raw-image checkpoint or imply asset publication.

Backgrounds need the same product research as Logos. Connect the product's core
interaction to a plausible material or working environment, then choose its
grain, grid or markings: a folio may suggest leather grain; an engineering sheet
may suggest a measured lattice. Pi Agent Policy's service mat pairs a locating
grid with an open contact and one reset route, echoing rules, interception and a
shared repair allowance. Record that analogy in the recipe/guide. Make it visible
at actual display size, quieter beneath text, and do not reuse a generic stencil
or spread a single project's presentation update to the rest of the catalogue.

Animals and birds use botanical backgrounds suited to their real environment:
related leaves and foliage first, with flowers used sparingly and in quiet colors
that do not compete with the Logo. Keep these distinct from 3D tool surfaces;
do not assign every animal the same vegetation or an instrument grid. Follow the
[project texture skill](../.agents/skills/hexly-brand-textures/SKILL.md) for generation,
full-canvas/repeat decisions, composition, contrast, archiving and publication.

Texture-only changes have independent pack versions. Resolve `brandTexture`
before legacy `brandKit.texture`; do not duplicate an unchanged brand kit to
replace its decoration. Keep generated full-canvas PNG, full/320px WebP,
exact prompts, sanitized generation receipts, acceptance, license and manifest
together. Card backgrounds use only the measured-opacity pseudo-element; clear
the old repeated image. Update Agent guides/profiles from the same catalogue,
preserving completed archived entries without unarchiving or further enriching them.

## 素材与视频工具

这些入口用于已明确授权的素材工作；生成、上传和发布前先阅读对应项目 Skill。

```bash
bun run assets:hydrate
bun run assets:build && bun run docs:profiles && bun run assets:check
bun run assets:r2 -- plan
bun run video:dev
bun run video:studio
bun run video:render -- --project pew --template showcase --theme dark --opening stack --ending split --mode deck
bun run video:review
bun run video:check
bun run media:r2 -- --project hermes-on-herdr --video context-en --version 1.0.0 --file /path/to/film.mp4
```

Run the asset/profile generation sequence after intentional catalogue or artwork changes; ordinary builds use checked-in metadata and CDN materials. `bun run assets:check-tracked` rejects material binaries in the Git index, including forced additions; keep SVG source and the required vendored code archive. Read [docs/05-release.md](../docs/05-release.md) before publishing.

Video exports require Chrome/Chromium and FFmpeg. Real PPTX/PDF contain image-backed pages, with editable native PPTX speaker notes. See the [kit README](../packages/video-kit/README.md) for schema/API, export commands, dependency/brand licenses and the reproducible PptxGenJS dependency pruning. Never suppress its known dependency advisory instead of removing the unused vulnerable code.

## 发布与历史恢复

- Entry: `bun run release` or `bun run release -- patch|minor|major|X.Y.Z` from clean `main`, with GitHub write access. Dry run is read-only. Version policy and recovery: [docs/05-release.md](../docs/05-release.md).
- The release script updates version/changelog, pushes `main`, waits for that commit's successful quality and Deploy jobs, verifies production, then creates an annotated tag and GitHub Release. Published tags are immutable except for the explicitly owner-authorized 2026-09-13 history reduction, after production acceptance and a verified external backup; preserve its old/new ref maps and re-verify the rewritten deployment.
- `ci.yml` (`CI`) runs all gates. Its successful trusted `main` run triggers `release.yml` (`Release`), which applies D1 migrations and deploys that source SHA. The release helper matches `Deploy CI <source-run-id>` and requires `Deploy / Deploy Worker` success. Use this path for routine publication; manual `bun run deploy` follows the same migration order. Actions secrets: `CLOUDFLARE_API_TOKEN` (already has D1 access), `CLOUDFLARE_ACCOUNT_ID`.
- Production: `https://hexly.ai` and `https://status.hexly.ai`; preview: `https://hexly-ai.nocoo.workers.dev` (`noindex`). `bun run verify:production` checks version/revision, document, status page and live D1 feed, compiled assets, and original logo. Keep routing and rollback details in the runbook.

## 新项目接入的完整路径

Use the shared `zhengli-update-github-readme` skill. A new project is complete
when its source repository, GitHub profile, hexly catalogue, identity/provenance,
project documentation, public website, and status coverage agree.

1. Inspect the source README, actual logo/theme, Git status, and release path.
   Preserve unrelated work and never publish someone else's unpushed commits.
2. For a project with website headers, apply the
   [Hexly site entry skill](../.agents/skills/hexly-site-entry/SKILL.md) during source
   onboarding. Cover its applicable homepage/dashboard/admin headers and keep
   the skill's explicit page exclusions. Link to the canonical catalogue detail
   route, with matching icons and tooltips beside GitHub and theme controls.
3. For a public site, provide an unauthenticated, uncached `GET /api/live` with
   JSON `status: "ok"` and the current top-level `version`. Existing `name` or
   `component` conventions may remain. Dynamic services check core dependencies
   and return an appropriate failure status; static sites generate their health
   JSON during the production build. Verify production, not just Vite dev.
4. Update the source repository description and `nocoo/nocoo` profile entry,
   retaining established emoji and section/order conventions. Record the profile
   revision before citing it in catalogue provenance.
5. Add the project JSON and index entry, archive its actual artwork and palette
   evidence, and run `assets:build`, `docs:profiles`, and `assets:check`. Read the
   project R2 skill: inventory, publish and verify the new versioned materials
   before release. Keep binary working files out of Git/deploy and save receipts.
   Use the logo skill when identity creation or promotion is in scope.
6. Validate and publish the source and this site within the user's authorization.
   A health-only correction uses Z+1. After the next Cron run, verify the exact
   endpoint and current result at `status.hexly.ai`; disclose real failures.

Desktop apps and libraries without a website do not need a synthetic endpoint.
Do not create a separate D1 monitor entry, deploy a second status Worker, or
require a running browser to keep monitoring alive.
