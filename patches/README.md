# Dependency patches

## Wrangler 4.129.0: keep individual request failures local

The versioned patch addresses [Cloudflare issue 15451](https://github.com/cloudflare/workers-sdk/issues/15451): a client canceling one request can terminate `wrangler dev` with an empty error. It follows the structural fix in [upstream PR 15448](https://github.com/cloudflare/workers-sdk/pull/15448), inspected at commit `339dd54128df027560835de73d579a91affa8449`. That PR was still open when this patch was adopted. Wrangler is licensed under MIT OR Apache-2.0.

Only a rejection from the forwarded `fetch()` receives a marker and becomes an HTTP 502 for that request. Response-processing defects remain fatal, and reload handling is unchanged. Both the source template and the shipped executable proxy bundle are patched. Bun applies the checked-in patch during frozen installs; all package versions, registry sources, and upstream integrity values remain unchanged.

`tests/http/runtime.spec.ts` reproduces abandoned upload connections and verifies that subsequent HTTP requests still succeed. Keep this regression when upgrading Wrangler. Remove the dependency patch only after the selected upstream release contains the fix and the HTTP/browser suites pass.
