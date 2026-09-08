# Overview and architecture

## Phase one

Build a fast, bilingual project directory at `hexly.ai`, with a second mode dedicated to exploring each project's visual identity. Visitors can search and filter projects, visit their websites or repositories, switch language and theme, and inspect logos at realistic sizes.

The source catalogue is the public `nocoo/nocoo` GitHub profile. Preserve its project names, emojis, and meaning when editing descriptions or translating them. Deduplicate projects that occur in more than one section. All shows the 49 active repositories by default; Archived exposes the 20 archived repositories recorded in the repository-status snapshot. The owner requested that hexly.ai itself be omitted from the site directory; its separate brand record is in `src/data/site-identity.json`. Existing product categories retain their membership, including archived entries where applicable. Category counts therefore overlap with Archived.

The directory uses compact horizontal cards with a prominent logo, title, description, and a labeled GitHub repository link: three columns on large screens, two on tablets, and one on phones. The whole card opens its logo detail; the independent GitHub link opens the repository. Card links support ordinary browser navigation and opening in another tab. Logos are centered beside a stable text block; the category and miniature palette share a full-width footer. Default order is animal identities, templates (Dotty, Matrix, Basalt), remaining games, then tools. Animals use descending GitHub stars; when both projects have zero stars, total default-branch commits break the tie. Other ties retain catalogue order. The dated GitHub snapshot and explicit series membership live in `src/data/project-order.json`; refreshing that snapshot updates popularity without runtime API requests. Series describes the selected artwork, so Gaga's rabbit belongs to the animals while its Games category remains available. A–Z sorts all matching names alphabetically. The homepage Universe selects its six floating marks from active Refined projects and uses their selected presentations.

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

The site chrome follows the connected Play / Journal / Résumé / Portfolio frame. The sticky header keeps the hexly.ai mark, highlights Portfolio among those four destinations, and uses the shared language and theme icon controls. Projects and Logo gallery sit under that bar as local views, separated by a content-width rule rather than a full-bleed divider. The footer is the two-band family footer: the shared `zheng li.` wordmark, English copyright, version, the four destinations, `llms.txt`, the Beijing signature, `WEB · MOBILE · AI`, and back to top.

Vite builds the client and prerenders HTML snapshots, sitemap, and `llms.txt` from the catalogue. Cloudflare Workers Static Assets serve those files; a small Worker redirects `www.hexly.ai` to the apex and otherwise has no application server, database, authentication, or runtime GitHub dependency. All project logos are hosted locally. Language and theme preferences stay in the browser. Filtering and gallery selection are client-side state. The directory uses `/`; logo reviews use `/logos/<project>`. Category, search, and sort remain optional query parameters. Vite and Workers SPA fallback support direct loads and refresh; browser history restores the selected project and filters. Archived identities remain accessible through their own paths.

Initial navigation keeps the theme background visible while the crawler snapshot and the application's intermediate loading state stay hidden. The head preloads `/data/projects.json` alongside the client and the render-blocking stylesheet. React marks the page ready in a layout effect only after committing the catalogue and resolved route, or the catalogue error view; the main stylesheet then reveals the root. There is no separate loading screen, animation delay, or wait for images and fonts. The external preference bootstrap also initializes language and exposes an inline-styled retry message when startup scripts or styles fail, or startup stalls for 15 seconds; a later successful startup clears that message. React render failures use the same fallback, catalogue failures have a reload button, and visitors with JavaScript disabled retain the readable HTML snapshot.

The identity header exposes the project's GitHub repository and its recorded website before the artwork; projects without a website show only GitHub. Descriptions reserve two lines on larger screens and three on phones, with overflow clamped; long titles stay on one line. Full text remains in the document and hover titles. Previous/next buttons and unmodified left/right arrow keys follow the filtered project order and wrap at the ends without resetting page scroll. Keyboard navigation leaves input, textarea, select, and editable content alone; a single match disables pagination, and browser history retains every selection.

## Atomic implementation sequence

1. Record scope, source rules, architecture, and validation obligations.
2. Establish Vite, strict static analysis, L1/L2/L3 runners, security gates, hooks, and CI before product implementation.
3. Import the real project catalogue, back up original logos, derive previews, and document palettes.
4. Build the bilingual directory, themes, search, and category navigation.
5. Add the identity gallery, large artwork, size specimens, palettes, and source downloads.
6. Validate all six dimensions, configure Caddy, document results, and start the review server.

Every completed logical change is committed on `main` with a Conventional Commit message.

## Animal family

The logo family supports `gpt-image-2` redraws and retained-original presentation passes with no generation. The catalogue records each selected study and its source-adoption status; previous originals and finishing passes stay archived. Every refined gallery page uses the study's full-width comparison, presentation modes, art-direction notes, actual-size specimens, context previews, palettes, light/dark foregrounds, downloads, and the exact generation prompt or retained-original presentation brief. Presentation reference boards remain in static study HTML and Git. A horizontal project selector preserves search, categories, and shareable navigation while giving the artwork room. Each source repository retains its actual identity until source adoption is authorized. See [the family guide](06-logo-family.md) and the current adoption records in [the usage SOP](07-logo-usage-sop.md).
