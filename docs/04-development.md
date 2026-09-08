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

Review the directory at `https://index.dev.hexly.ai/`, with identities at `/logos/frogie` and `/logos/pew`. `/logos` opens the default identity. Vite serves these client paths directly; Workers uses its configured SPA fallback for the same paths. Share links contain the project in the pathname. Archived identities also load directly, for example `/logos/uptime-kuma-skill`.

Each candidate's complete static review remains available at `/artwork/logo-family/<project>/<study>/review.html` in the dev server. Static study HTML includes the presentation references; the React site omits that disclosure. A local review round finishes with local commits only when push and deployment are out of scope.

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

The application uses Workers Static Assets, with no database or server-side handler. `wrangler.jsonc` points at Vite's `dist` output and declares `hexly.ai` as the production custom domain. `/api/live` is build-generated static JSON containing the package version and Git revision. `/api/share.json` and `/api/share/<id>.json` are the same kind of artifact: Open Graph titles, bilingual descriptions, and 1200 × 630 image URLs for product sites. See [social share metadata](10-social-share.md).

```sh
bun run build
bun run deploy:check
bun run preview:worker
bun run deploy
```

The local preview uses port `37048`, inspector port `38048`, and `.wrangler/preview` for runtime state. Deployment commands explicitly select the top-level production configuration with `--env ""`; tests use `--env test`. Deployment requires the account's normal Cloudflare credentials.

GitHub Actions automatically deploys `main` after all quality checks pass, then verifies the public version, revision, document, compiled assets, and original logo. See [versioning and releases](05-release.md) for credentials and the release command.

## Apex migration from Vercel

Before the Workers migration, `hexly.ai` had a proxied A record pointing to `76.76.21.21`, with automatic TTL. Its rollback values are saved in [previous-apex-dns.json](deployment/previous-apex-dns.json).

The initial CI deployment uploaded the Worker successfully, but custom-domain attachment returned Cloudflare error `100117`: the externally managed A record had to be deleted explicitly. After verifying the version, revision, document, assets, and logo at `https://hexly-ai.nocoo.workers.dev`, the backed-up apex A record was removed and `hexly.ai` was attached to Worker `hexly-ai`. Cloudflare created its managed proxied AAAA record (`100::`). Public verification then passed at `https://hexly.ai`; the original MX and TXT records were unchanged.

Later CI deployments maintain this existing custom-domain binding. The Workers preview URL is marked `noindex`; the canonical public URL is `https://hexly.ai/`.

Only the apex web route moves to the Worker. Existing mail records, development wildcard records, and other subdomains are independent. The Vercel deployment is retained. To roll back the routing, detach the Worker custom domain and restore the recorded apex A record; do not remove the zone's MX or TXT records.

## Documentation references

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/get-started/)
- [Static asset routing](https://developers.cloudflare.com/workers/static-assets/routing/)
- [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
