# Six-dimensional quality system

This structure is established before product implementation. Source: nmem `af0daa0f-0a10-4b0b-b328-f2dc32137bdc`, the six-dimensional development quality procedure.

| Dimension | Contract | Command | When |
| --- | --- | --- | --- |
| L1 | Unit behavior for catalogue, filtering, preferences, and test isolation; at least 90% statements, branches, functions, and lines | `bun run test:coverage` | Pre-commit |
| L2 | Real HTTP requests to the built site in the Workers runtime; HTML, assets, and response behavior | `bun run test:http` | Pre-push |
| L3 | Browser journeys for navigation, search, categories, bilingual preferences, themes, gallery, responsive layout, and accessibility | `bun run test:browser` | CI and manual |
| G1 | TypeScript strict mode and Biome recommended rules with zero errors or warnings | `bun run check:static` | Pre-commit |
| G2 | OSV dependency audit and Gitleaks secret scanning | `bun run check:security` | Pre-push and CI |
| D1 | Independent loopback test servers, no production resource bindings, and no remote services | `bun run check:isolation` | Before integration/browser tests |

The D1 dimension denotes test isolation, not a Cloudflare D1 database. External storage isolation is **not applicable** because this application is static and has no storage bindings. The configuration check rejects newly added remote/storage bindings until an explicit isolated design is implemented.

L1 coverage includes executable model logic and isolation rules. Thin React presentation components, static catalogue data, and build-tool entry points are not included in the model coverage denominator. L3 validates those views through actual user journeys.

## Port boundaries

| Purpose | Port |
| --- | --- |
| Vite development | 7048 |
| L2 Workers HTTP tests | 17048 |
| L3 browser tests | 27048 |
| Manual Workers preview | 37048 |

Test runners start and terminate their own servers and do not reuse an existing server. The local review server remains independent.

## Completion evidence

Record the completed checks, measured coverage, catalogue/asset counts, and any substantive limitation in this document after the phase-one verification.
