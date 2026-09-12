# Snail product and scope handoff — 2026-09-12

Source: the owner's Snail commissioning instruction and the Snail Codex
`w36:p1` Herdr handoff, relayed and confirmed in this Hexly session on 2026-09-12.
This is a public-safe summary, not a copy of private research or implementation.

- Official name: **Snail**; identity emoji: **🐌**, selected for the named snail identity.
- Product purpose: a private library for collecting, organizing and playing videos.
- Repository: `https://github.com/nocoo/snail`, newly created and public.
- Product state at handoff: transitioning from research documents to TDD implementation;
  intended first release `v0.1.0`, not yet a verified published release.
- Intended application: `https://snail.hexly.ai`; production deployment is owned by Snail.
- Planned implementation confirmed by the source agent: Vite, React 19,
  TypeScript 7.0.2, Biome and `@nocoo/basalt` 2.1.7; one Cloudflare Worker for
  assets/API, D1 metadata, private R2 video objects and Cloudflare Access;
  a local OpenCLI Connector for authorized imports.
- Brand direction accepted by the Snail agent: Hexly paper/ink/terracotta,
  one red-dot motif, real Space Grotesk, light/dark compatibility, legible favicon,
  exact wordmark **Snail**, no Eagle identity copying. No additional hard constraints.
- Public `GET /api/live` and its exact Access exception belong to Snail's work.
  It will check actual D1/R2 availability and report real JSON status. A login
  redirect must not be called healthy.
- Hexly is the only writer of the new identity and catalogue files in `hexly.ai`.
  Snail remains the only writer of `snail`; it uses a provisional asset slot
  until Hexly delivers published URLs, version, Git SHA, per-file SHA-256 and licenses.
- The owner forbids writes to other repositories in this task. The GitHub
  profile is therefore unchanged; no profile revision or source adoption is claimed.

Independent read-only GitHub verification in Hexly:

```sh
gh api repos/nocoo/snail --jq '{html_url,visibility,description,homepage,archived,default_branch,created_at,stargazers_count}'
gh repo view nocoo/snail --json name,isEmpty,isPrivate,url,description,defaultBranchRef
```

Observed on 2026-09-12: public, not archived, zero stars; created
2026-09-12T13:20:16Z. The follow-up inspection reported `isEmpty: true` and an
empty default-branch reference. A source implementation commit was not yet
available, so this snapshot deliberately uses a null inspected revision.
