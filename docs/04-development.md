# Local development and deployment

## Local domain

`https://index.dev.hexly.ai` is the directory's dedicated development domain. Vite listens on `127.0.0.1:7048`; Caddy terminates TLS using the machine's existing wildcard certificate and proxies to that port.

The authoritative machine procedure is nmem `25b22d6b-1df5-4491-ae4d-269a556f6442` and the workflow repository's `zhengli-caddy` skill. Wildcard DNS already resolves `*.dev.hexly.ai` to loopback, so no hosts-file change is needed.

```caddyfile
http://index.dev.hexly.ai {
    redir https://index.dev.hexly.ai{uri} permanent
}

index.dev.hexly.ai {
    tls /Users/nocoo/workspace/personal/workflow/certs/cert.pem /Users/nocoo/workspace/personal/workflow/certs/key.pem
    reverse_proxy 127.0.0.1:7048
}
```

```sh
bun install
bun run dev
```

Vite explicitly allows `index.dev.hexly.ai`. HTTPS websocket upgrades pass through Caddy for hot-module replacement.

`bun run dev` first builds the catalogue manifest, then starts Vite on `7048` and
a local Wrangler Worker on `37048`. `/api/status` is proxied to that Worker.
The script applies D1 migrations and seeds seven days of deterministic demo
checks into Wrangler's SQLite database in `.wrangler/dev`. The page at `/status`
labels those observations as demo data. The fixture refreshes every five minutes
while the development server runs. Both processes stop together on Ctrl-C.

Development and test bindings use local-only database IDs, `--local`, and no
Cron triggers. Their scheduled handler only exercises cleanup; it never probes
public websites. Restart `bun run dev` after changing the catalogue so the
Worker's built target manifest and mock history are regenerated.

Review the directory at `https://index.dev.hexly.ai/`, with identities at `/logos/frogie` and `/logos/pew`. `/logos` opens the default identity. Vite serves these client paths directly; Workers uses its configured SPA fallback for the same paths. Share links contain the project in the pathname. Archived identities also load directly, for example `/logos/uptime-kuma-skill`.

Each candidate's complete static review remains available at `/artwork/logo-family/<project>/<study>/review.html` in the dev server. Static study HTML includes the presentation references; the React site omits that disclosure. A local review round finishes with local commits only when push and deployment are out of scope.

## Video templates

`https://index.dev.hexly.ai/videos` uses the same project catalogue, site controls
and responsive shell. It has five templates, a project chooser, optional local
screenshots and Video/Deck views. `bun run video:dev` serves the standalone demo
on loopback 7440; `bun run video:studio` opens the five Remotion compositions on
7441. `bun run video:build` builds the independent Vite preview.

Final video/deck rendering stays offline, with Chrome/Chromium and FFmpeg:

```sh
bun run video:render -- --project pew --template studio --locale zh --mode all
```

Use a fresh `--out` directory for each production. The default half-scale sample
is 960 × 540; `--scale 1` produces 1920 × 1080. The same scenes export actual
PPTX/PDF image pages with native PPTX notes. See the [kit README](../packages/video-kit/README.md)
for configurations, screenshots, independent consumers and reviewed-asset
publication. Never copy `.video-work`, `.cache` or full render folders into the
site build.

## Quality commands

```sh
bun run gate:commit
bun run check:static
bun run test:coverage
bun run build
bun run test:http
bun run test:browser
bun run check:security
```

Pre-commit runs only staged-file lint and affected unit tests in parallel, without coverage. Dependency/configuration changes trigger all unit tests; documentation and artwork changes with no related tests skip the suite. Full checks remain available above and run in CI. See [commit feedback](03-quality.md#commit-feedback) for selection rules and partially staged files.

The package registry on this machine is filtered. Use a temporary allowed mirror for local installation; do not commit mirror URLs or credentials into the lockfile.

## Cloudflare Workers

The application uses Workers Static Assets behind `worker/gateway.ts`. The same
Worker runs five-minute status checks and reads D1 database `hexly-status` through
the `STATUS_DB` binding. `wrangler.jsonc` declares `hexly.ai`, `www.hexly.ai`, and
`status.hexly.ai`; the status subdomain serves `/status` at its root. See
[status storage and scheduling](11-status-monitoring.md) for retention and
monitoring semantics. `/api/live` remains build-generated static JSON containing
the package version and Git revision. `/api/share.json` and `/api/share/<id>.json`
remain generated sharing metadata; see [social share metadata](10-social-share.md).

```sh
bun run build
bun run deploy:check
bun run preview:worker
bun run deploy
```

The local preview uses port `37048`, inspector port `38048`, and `.wrangler/preview` for runtime state. Deployment commands explicitly select the top-level production configuration with `--env ""`; tests use `--env test`. Deployment requires the account's normal Cloudflare credentials.

GitHub Actions applies pending D1 migrations and deploys `main` after all quality
checks pass, then verifies the public version, revision, document, compiled
assets, and original logo. `bun run deploy` follows the same migration-before-
deployment order. The existing CD token has D1 access. See
[versioning and releases](05-release.md) for credentials and the release command.

## Apex migration from Vercel

Before the Workers migration, `hexly.ai` had a proxied A record pointing to `76.76.21.21`, with automatic TTL. Its rollback values are saved in [previous-apex-dns.json](deployment/previous-apex-dns.json).

The initial CI deployment uploaded the Worker successfully, but custom-domain attachment returned Cloudflare error `100117`: the externally managed A record had to be deleted explicitly. After verifying the version, revision, document, assets, and logo at `https://hexly-ai.nocoo.workers.dev`, the backed-up apex A record was removed and `hexly.ai` was attached to Worker `hexly-ai`. Cloudflare created its managed proxied AAAA record (`100::`). Public verification then passed at `https://hexly.ai`; the original MX and TXT records were unchanged.

Later CI deployments maintain this existing custom-domain binding. The Workers preview URL is marked `noindex`; the canonical public URL is `https://hexly.ai/`.

Only the apex web route moves to the Worker. Existing mail records, development wildcard records, and other subdomains are independent. The Vercel deployment is retained. To roll back the routing, detach the Worker custom domain and restore the recorded apex A record; do not remove the zone's MX or TXT records.

## Documentation references

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/get-started/)
- [Static asset routing](https://developers.cloudflare.com/workers/static-assets/routing/)
- [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
