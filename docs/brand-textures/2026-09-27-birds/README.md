# Bird botanical texture refresh

The owner requested consistent bird-project textures using the accepted animal
series, delegated image acceptance, and asked for local integration and browser
verification. This batch covers 13 active bird identities and 26 independent
light/dark canvases. R2 upload, Git push and website release are outside its scope.

The selected Flare outputs use matte paper, broad habitat-related foliage,
visible veins, shallow relief, asymmetric right-hand compositions and quiet left
fields. The Fundly penguin uses a plausible vegetated subantarctic coast; no
species is invented. Logos, existing identity kits, archived projects and
published asset bytes remain unchanged.

## Selected packages

| Project | Independent version | Motif |
| --- | --- | --- |
| Raven | 1.0.1 | Rowan leaves |
| Dove | 1.0.1 | Orchard cherry leaves |
| Lyre | 1.0.1 | Forest fern fronds |
| Rooster | 1.0.1 | Morning-glory leaves |
| Codo | 1.0.1 | Garden sage leaves |
| Owl | 1.0.1 | Beech and oak leaves |
| Shrike | 1.0.1 | Hawthorn leaves |
| Clip | 1.0.1 | Folded grass blades |
| Fundly | 1.0.1 | Coastal megaherb leaves |
| Eagle | 1.0.0 | Mountain birch leaves |
| Rio | 1.0.0 | Tropical broadleaf foliage |
| Falcon | 1.0.0 | Coastal cliff-margin leaves |
| Kite | 1.0.0 | Oak woodland margins |

Each package lives at `public/textures/<id>/v<version>/`. It includes unchanged
native 1024-square PNGs, full and 320px WebPs, exact prompts, sanitized generation
and delegated-review records, provenance, rights, guide, manifest and standalone
review HTML. Full specimens preserve the complete canvas without cropping or
repetition. Text-bearing surfaces use measured separate-layer opacity.

## Evidence and resumption

- [Inventory and authorization](inventory.json) records the original identities,
  source evidence, prompts, version roots and local-only scope.
- [Generation events](generation-events.json) preserves explicit resumptions and
  transport failures. There were 31 successful outputs: 26 accepted and five
  rejected. Another 38 recorded outcomes are unknown; no billing conclusion is
  inferred. Every request and returned original remains in its study directory.
- [Completion record](completion.json) identifies the exact selected original
  hashes and records verification. Never rerun successful requests after a
  conversation interruption.
- The normal asset build regenerated social JPEGs with different hashes. All 76
  affected old files were restored from verified local cache. Existing inventory
  entries are unchanged; the 291 new entries belong only to this batch.

## Local review

Use `VITE_LOCAL_MATERIALS=1` in ignored `.env.development.local`, then `bun run dev`.
Open <https://index.dev.hexly.ai/projects/raven#texture>, or replace `raven` with
any project ID above. The homepage cards, project introductions, Hero captions,
texture specimens and standalone review pages use the selected pack.

Local browser evidence and compact contact sheets are under
`.video-work/bird-textures/`. Same-size JPEG inspection copies limit conversation
payloads; they never replace the original PNGs or production WebPs. The selected
PNG hashes remain the acceptance authority.

Validation passed: all 78 project/theme/viewport combinations; byte-identical
original PNG and raw HTML downloads; 444 unit tests, 36 HTTP tests and 91 browser
tests. `bun run verify` completed in 159.3 seconds, including asset checks, strict
types, lint, dependency/secret scans, coverage, build and deployment dry run.
The lowest measured text contrast is 4.714:1; the deployment output is 5.58 MiB.
The HTTP discovery test now compares the complete current texture project list,
instead of assuming the September 14 package count remains fixed forever.

Future publication must upload and verify the inventoried immutable materials
before pushing or releasing catalogue references. No upload receipt is claimed
by this local batch.
