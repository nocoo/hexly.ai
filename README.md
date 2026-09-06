# hexly.ai

A personal project directory and living logo collection by Zheng Li.

Phase one preserves the real logos, colors, and identities of the projects. It includes English and Chinese, light and dark themes, project discovery, and an identity gallery with app, sidebar, and favicon previews.

- Production domain: `https://hexly.ai`
- Local domain: `https://index.dev.hexly.ai`
- Stack: Vite, React, TypeScript, Cloudflare Workers Static Assets
- License: [MIT](LICENSE)

## Documentation

Start with the [documentation index](docs/README.md), [architecture](docs/01-overview.md), and [quality system](docs/03-quality.md).

## Development

```sh
bun install
bun run dev
```

The development server uses port `7048`. Caddy provides HTTPS at the local domain. See [development and deployment](docs/04-development.md) for setup and validation.

## Project identities

Project metadata is maintained in `src/data/projects.json`. Original assets, provenance, optimized previews, and individual profiles are kept in this repository. See [identity rules](docs/02-identity-rules.md) before changing an identity.
