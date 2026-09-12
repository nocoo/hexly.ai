# Overview and architecture

## Purpose

Build a fast, bilingual project directory at `hexly.ai`, with reusable templates and public service status as the other main sections. Project details combine the introduction, optional recorded media/screenshots, technical overview and preserved identity archive. The logo wall is a secondary catalogue view. Finished recordings use the separate R2 media origin; see [project media and routes](17-project-media.md).

The source catalogue is the public `nocoo/nocoo` GitHub profile. Preserve its project names, emojis, and meaning when editing descriptions or translating them. Deduplicate projects that occur in more than one section. All shows active repositories by default; Archived exposes archived repositories recorded in the repository-status snapshot. The owner requested that hexly.ai itself be omitted from the site directory; its separate brand record is in `src/data/site-identity.json`. Existing product categories retain their membership, including archived entries where applicable. Category counts therefore overlap with Archived.

The directory uses compact horizontal cards with a prominent logo, title, description, and a labeled GitHub repository link: three columns on large screens, two on tablets, and one on phones. The whole card opens its project detail; the independent GitHub link opens the repository. Card links support ordinary browser navigation and opening in another tab. Logos are centered beside a stable text block; the category and miniature palette share a full-width footer. Default order is animal identities, templates (Dotty, Matrix, Basalt), remaining games, then tools. Animals use descending GitHub stars; when both projects have zero stars, total default-branch commits break the tie. Other ties retain catalogue order. The dated GitHub snapshot and explicit series membership live in `src/data/project-order.json`; refreshing that snapshot updates popularity without runtime API requests. Series describes the selected artwork, so Gaga's rabbit belongs to the animals while its Games category remains available. A–Z sorts all matching names alphabetically. The homepage Universe selects its six floating marks from active Refined projects and uses their selected presentations.

Use the nearby `lizheng.me` personal site as the available design reference: warm sage paper, forest-colored text, terracotta accents, Space Grotesk and Journey CJK typography at the same sizes, fine rules, and tangible objects with layered shadows. Apply that language to a collection of iOS-like rounded square icons.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/data/projects/` | Reviewed catalogue, one JSON file per project, loaded by the page at `/data/projects.json` |
| `src/model/discovery.ts` | Sitemap, `llms.txt`, JSON-LD, crawler HTML snapshots, and `/api/share` records |
| `src/data/project-order.json` | Directory series and dated GitHub stars/default-branch commit counts |
| `src/model/` | Pure filtering, preferences, and navigation logic |
| `src/components/` | Thin, accessible React views |
| `src/styles/` | Shared design tokens, directory, and gallery styles |
| `public/logos/` | Original backups and optimized display assets |
| `scripts/` | Reproducible asset generation, validation, and quality gates |
| `tests/unit/` | L1 model and infrastructure behavior |
| `tests/http/` | L2 real HTTP against the local Workers runtime |
| `tests/browser/` | L3 real browser journeys |
| `docs/profiles/` | One auditable identity profile per project |

The site chrome follows the connected Play / Journal / Résumé / Portfolio frame. The sticky header keeps the real hexly.ai mark and wordmark, shared language/theme controls, and a compact Projects / Templates / Status switch. The responsive header follows the existing shell gutters. The footer preserves the shared personal-site links and its compact mobile form.

Vite builds the client and prerenders HTML snapshots, sitemap, `llms.txt`, JSON-LD and share records from the catalogue. Cloudflare Workers Static Assets serve those files. The same Worker handles canonical redirects, a five-minute status Cron, and seven-day D1 observations; there is no authentication or runtime GitHub dependency. Existing high-resolution logo/screenshot bytes stay in Git and Static Assets. New finished videos may later use the separate R2 media origin described in [the media guide](17-project-media.md); this local change does not provision it.

The directory uses `/`, its logo wall `/logos`, project details `/projects/<id>`, and reusable compositions `/templates`. Category, search, sort and optional `media=video` filtering remain query parameters. Template composition choices also remain shareable. Brand anchors and video selections use hashes with native smooth scrolling and a reduced-motion fallback. The shared alias helper preserves former page URLs without redirecting asset paths. Direct loads and browser history resolve the same project and filters. Archived projects remain accessible through their own paths.

Initial navigation keeps the theme background visible while the crawler snapshot and the application's intermediate loading state stay hidden. The head preloads `/data/projects.json` alongside the client and the render-blocking stylesheet. React marks the page ready in a layout effect only after committing the catalogue and resolved route, or the catalogue error view; the main stylesheet then reveals the root. There is no separate loading screen, animation delay, or wait for images and fonts. The external preference bootstrap also initializes language and exposes an inline-styled retry message when startup scripts or styles fail, or startup stalls for 15 seconds; a later successful startup clears that message. React render failures use the same fallback, catalogue failures have a reload button, and visitors with JavaScript disabled retain the readable HTML snapshot.

The project header exposes GitHub and the recorded website, followed by section links and a project-aware template entry. Optional recordings appear as poster-first native players before the overview and brand archive; screenshot-only and no-media details are complete on their own. Full descriptions can wrap. Titles remain within the viewport, with room for descenders. Brand previous/next buttons and unmodified arrow keys follow the filtered order, wrap at the ends and align the brand section after a selection. They leave inputs, editable content and media controls alone. The existing horizontal selector retains filtering, highlights the current identity and allows manual scrolling; an empty filter remains editable.

## Atomic implementation sequence

1. Record scope, source rules, architecture, and validation obligations.
2. Establish Vite, strict static analysis, L1/L2/L3 runners, security gates, hooks, and CI before product implementation.
3. Import the real project catalogue, back up original logos, derive previews, and document palettes.
4. Build the bilingual directory, themes, search, and category navigation.
5. Add the identity gallery, large artwork, size specimens, palettes, and source downloads.
6. Validate all six dimensions, configure Caddy, document results, and start the review server.

Use atomic Conventional Commits on `main`. Publish authorized releases through `bun run release`, following [the release procedure](05-release.md).

## Animal family

The logo family supports `gpt-image-2` redraws and retained-original presentation passes with no generation. The catalogue records each selected study and its source-adoption status; previous originals and finishing passes stay archived. Every refined gallery page uses the study's full-width comparison, presentation modes, art-direction notes, actual-size specimens, context previews, palettes, light/dark foregrounds, downloads, and the exact generation prompt or retained-original presentation brief. Presentation reference boards remain in static study HTML and Git. A horizontal project selector preserves search, categories, and shareable navigation while giving the artwork room. Each source repository retains its actual identity until source adoption is authorized. See [the family guide](06-logo-family.md) and the current adoption records in [the usage SOP](07-logo-usage-sop.md).
