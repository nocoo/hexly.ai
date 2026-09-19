<p align="center"><img src="https://h.no.mt/shared/site/v1.0.0/hexly-ai-c69b5e7a341e.png" width="128" alt="hexly.ai logo" /></p>
<h1 align="center">hexly.ai</h1>
<p align="center">A personal project catalogue and visual archive for logos, palettes and presentation templates.</p>
<p align="center"><a href="https://hexly.ai">Website</a> · <a href="../README.md">简体中文</a></p>

![Project catalogue preview](https://h.no.mt/archives/sources/v1.0.0/35084de2cf9bff5ad2ebcdac662fef7bfdac088a48fbdc7aaa358753a0607d8c.png)

## What it does

hexly.ai is a personal project directory and visual identity archive. It organizes names, descriptions and emoji from the [GitHub profile](https://github.com/nocoo), preserving actual logos, palettes and source evidence for tools, games and experiments.

Projects with independent artwork retain original shapes, colors and bytes; others keep their existing emoji with explicit attribution. Brand packages provide light/dark heroes, mobile compositions, textures, wordmarks, icons, favicons and verifiable downloads. Site promotional palettes do not replace product themes. Snail has left the catalogue and its bookmarking functionality joined [Zhe](https://hexly.ai/projects/zhe); the [historical brand archive](https://hexly.ai/brands/snail/v2.0.0/review.html) remains available.

R2 serves images, fonts and finished videos through `https://h.no.mt`; Git and the site Worker retain code, metadata, licenses and verification records.

## Features

- **Individual textures** — Active projects use identity-specific habitat plants or working materials, with light/dark full images, lightweight cards, original prompts and verifiable generation records. Versioned `brandTexture` packages preserve original logos, brand packages and product palettes. Archived projects retain completed work with basic support and are excluded from future batch artwork by default. See [texture maintenance](27-project-textures.md).
- **Projects** — Browse categories and search Chinese/English names and descriptions at `/`. Each `/projects/<id>` page combines project selection, category/search controls, introduction, optional video/screenshots, technical overview and brand archive. Hooky/R2Shot link to official Chrome store listings. Videos load only after clicking their cover. Screenshots retain their full proportions and open a lightbox with thumbnails, arrow keys and Esc. Pages without media lead directly into project content. See [screenshot maintenance](../.agents/skills/hexly-r2-media/references/project-screenshots.md).
- **Templates** — At `/templates`, combine five covers, five body layouts (Launch / Essential / Showcase / Columns / Bento) and five outros for catalogue projects. Use official light/dark themes, Video/Deck previews, screenshot/configuration downloads and offline MP4/PPTX/PDF exports. [Five standard outros](https://hexly.ai/templates#outros) can be appended across projects without regeneration, with original MP4s, HTML-rendered 4K stills and Agent handoff instructions.
- **Agent access** — Published pages expose copyable instructions, plain Markdown and HTML discovery links. Original prompts and design notes in project archives are copyable. See [Agent guides](25-agent-guides.md).
- **Service status** — [status.hexly.ai](https://status.hexly.ai) checks active websites' `/api/live` endpoints every five minutes, retains seven days, and offers hourly history, response times and incident filtering.
- **Logo gallery** — `/logos` is an image wall linking to each project's `#brand` section, with old/new comparisons, icon/transparent/white-background views, actual sizes, usage contexts, palettes, prompts and original downloads.
- **Actual palettes** — Inspect and copy foreground, background and accent colors from each project.
- **Original backups** — Download byte-preserved originals and trace source paths, repository revisions and SHA-256 hashes.
- **Languages and themes** — Chinese/English and light/dark modes follow system preferences initially, then remember explicit choices.
- **Shareable state** — Search, category, sorting, video filters, project and chapter live in the URL for reload and browser navigation. Anchor scrolling respects reduced-motion preferences.

Periods without monitoring samples remain unknown; historical observations are never fabricated.

## Usage

Open **[hexly.ai](https://hexly.ai)** without installation or login. Browse categories or search projects, then open a detail page for the introduction, media and brand. Compare icons and palettes at `/logos`, compose presentations at `/templates`, and check website availability on the [status page](https://status.hexly.ai).

## Development

Requires Bun 1.4.0 and Node.js 24 or later; CI uses Node.js 26.7.0.

```sh
git clone https://github.com/nocoo/hexly.ai.git
cd hexly.ai
bun install --frozen-lockfile
bun run dev
```

```sh
bun run typecheck
bun run lint
bun run build
```

Vite runs at `127.0.0.1:7048` and the local Worker at 37048; the Caddy URL is https://index.dev.hexly.ai. Daily development reads CDN assets without downloading historical galleries. Before brand changes, full integration/browser tests or offline previews, run `bun run assets:hydrate` to restore missing assets by hash without overwriting local changes.

Local `/status` uses the real Worker API and SQLite with clearly labeled simulated data; it does not probe production websites. Project sources live in `src/data/projects/`; the browser-facing `/data/projects.json` is generated. `src/model/` holds pure logic, `worker/` owns routes/status/scheduled checks, and `packages/video-kit/` owns shared templates and rendering.

Video Kit uses actual logos, fonts and themes with independently selectable covers, bodies and outros. Offline PPTX/PDF exports retain rendered page images; PPTX includes editable speaker notes. Video exports require Chromium and FFmpeg. See [Video Kit](../packages/video-kit/README.md) for commands and [maintenance](29-project-maintenance.md) for catalogue/profile synchronization, asset uploads and publication.

## Tests

```sh
bun run assets:hydrate
bun run test:coverage
bun run test:http
bunx playwright install chromium
bun run test:browser
bun run video:check
```

Vitest covers models and logic; HTTP tests start a local Worker, while Playwright covers desktop/mobile flows, languages, themes and galleries. Install full Chromium; asset hydration supplies local files for complete tests. HTTP/browser suites use ports 17048 / 27048 and separate state directories without production credentials or live website probes. `video:check` validates template manifests, asset hashes and size limits.

## Stack

| Technology | Role |
| --- | --- |
| React · TypeScript | Interface and types |
| Vite · Bun | Development, builds and scripts |
| Cloudflare Workers | Static hosting and custom domains |
| Cloudflare R2 | CDN storage for images, fonts, brand packages and videos |
| Cloudflare D1 · Cron Triggers | Status history, five-minute probes and seven-day retention |
| Sharp | Image resizing and original verification |
| Vitest · Playwright | Unit, HTTP and browser tests |
| Biome · OSV · Gitleaks | Formatting, static analysis and security checks |

## Documentation

- [Documentation index](README.md)
- [Overview and architecture](01-overview.md)
- [Identity and content rules](02-identity-rules.md)
- [Test guide](03-quality.md)
- [Local development](04-development.md)
- [Versions and releases](05-release.md)
- [Service status](11-status-monitoring.md)
- [Video Kit API and exports](../packages/video-kit/README.md)
- [Project media](17-project-media.md)
- [Brand archives and scope](19-family-brand-archives.md)
- [R2 storage and maintenance](21-asset-storage.md)
- [History and asset recovery](23-git-history-recovery.md)
- [Standard outros](24-standard-outro-examples.md)
- [Agent instructions](25-agent-guides.md)
- [Project textures](27-project-textures.md)
- [Maintenance](29-project-maintenance.md)
- [Project profiles and palettes](profiles/README.md)
- [Source snapshots](sources/README.md)
- [Changelog](../CHANGELOG.md)

## License

[MIT](../LICENSE) © 2026 Zheng Li
