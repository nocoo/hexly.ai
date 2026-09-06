# Overview and architecture

## Phase one

Build a fast, bilingual project directory at `hexly.ai`, with a second mode dedicated to exploring each project's visual identity. Visitors can search and filter projects, visit their websites or repositories, switch language and theme, and inspect logos at realistic sizes.

The source catalogue is the public `nocoo/nocoo` GitHub profile. Preserve its project names, emojis, and meaning when editing descriptions or translating them. Deduplicate projects that occur in more than one section. Keep historical projects discoverable in an archive category.

Use the nearby `lizheng.dev` personal site as the available design reference: warm sage paper, forest-colored text, terracotta accents, Space Grotesk typography, fine rules, and tangible objects with layered shadows. Apply that language to a collection of iOS-like rounded square icons.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/data/projects.json` | Reviewed catalogue, bilingual descriptions, links, colors, and provenance |
| `src/model/` | Pure filtering, preferences, and navigation logic |
| `src/components/` | Thin, accessible React views |
| `src/styles/` | Shared design tokens, directory, and gallery styles |
| `public/logos/` | Original backups and optimized display assets |
| `scripts/` | Reproducible asset generation, validation, and quality gates |
| `tests/unit/` | L1 model and infrastructure behavior |
| `tests/http/` | L2 real HTTP against the local Workers runtime |
| `tests/browser/` | L3 real browser journeys |
| `docs/profiles/` | One auditable identity profile per project |

Vite builds the client. Cloudflare Workers Static Assets serves the build without an application server, database, authentication, or runtime GitHub dependency. All project logos are hosted locally. Language and theme preferences stay in the browser. Filtering and gallery selection are client-side state.

## Atomic implementation sequence

1. Record scope, source rules, architecture, and validation obligations.
2. Establish Vite, strict static analysis, L1/L2/L3 runners, security gates, hooks, and CI before product implementation.
3. Import the real project catalogue, back up original logos, derive previews, and document palettes.
4. Build the bilingual directory, themes, search, and category navigation.
5. Add the identity gallery, large artwork, size specimens, palettes, and source downloads.
6. Validate all six dimensions, configure Caddy, document results, and start the review server.

Every completed logical change is committed on `main` with a Conventional Commit message.

## Deferred phase

The later logo cleanup uses `gpt-image-2` to create a coherent animal family. Phase one supplies its evidence and review surface; it does not replace existing project identities.
