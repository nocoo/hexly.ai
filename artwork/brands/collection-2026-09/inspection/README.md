# Collection inspection · site v0.10.0

This is the local acceptance record for 54 new Hexly campaign archives, made
against the v0.9.0 catalogue at `d600805f7c2833d601bc32d6e3db0b02360eb0c6`.
It is not a production deployment receipt. The v0.10.0 GitHub Release and its
linked CI/deployment runs identify the published revision.

## Visual evidence

The 18 contact sheets cover every target in catalogue order: six batches each
of wide Heroes, independently composed mobile Heroes, and outlined wordmark
lockups. Each row or pair shows light and dark. All sheets were inspected by
the coordinating agent, including the final paper-stage treatment for material
identities on mobile. The original Logo colors and proportions remain intact;
these are scaled review composites, not replacement source images.

[contact-sheets.json](contact-sheets.json) maps all 54 manifest hashes and each
sheet's projects and hash. [browser-captures.json](browser-captures.json) records
32 actual local Worker/Chromium captures: Frogie, Matrix, hermes on herdr and
the unchanged Snail archive, in both themes, at 1440 × 1100 desktop and
390 × 844 mobile. These show introduction and asset sections within the actual
site. The automated collection journeys additionally exercise 320px mobile.

The accepted design keeps Hexly's paper/ink, actual fonts, restrained point,
fine borders and quiet textures around each unchanged project identity.
Animal portraits retain intentional source-frame entries. Material identities
use a paper stage on dark surfaces so their original dark pixels remain
readable. Mobile compositions use the full source canvas and are not crops of
desktop exports. Wordmark bounds include descenders and accented glyphs.

Read-only reviews by w1:p7 Grok and w1:p8 Pi covered identity/licensing and
visual/metadata consistency. Their findings about baseline matrix wording,
untranslated introductions and generic texture descriptions were resolved.
They did not write repository files. These records describe agent inspection;
they do not claim separate user approval of each new composition.

## Local acceptance

| Check | Actual result |
| --- | --- |
| TypeScript | Application, Worker and Video Kit passed |
| Biome | Full lint passed; no warnings |
| Unit/coverage | 301 passed in 20 files; statements 99.58%, branches 98.85%, functions/lines 100% |
| HTTP through local Workers | 127 passed; every exported file of all 54 kits verified against its manifest |
| Chromium desktop/mobile | 346 passed; includes 124 collection cases plus existing Snail/gallery/navigation/media/template coverage |
| Accessibility | axe checks passed on eight representative archives and their standalone specimens in both themes and viewport configurations |
| Source identity | All 75 catalogue baselines protected; original bytes and decoded RGBA hashes checked; original Logo/family paths and Snail source/assets have no diff |
| Exports | Full-image Hero placements, opaque source colors, transparent favicon entries, glyph bounds and distinct seamless textures passed |
| Assets/build | Asset/profile generation, complete asset checks, Vite build and Wrangler deployment dry run passed |
| Security | OSV checked 484 locked packages; Gitleaks passed |

The browser run initially found an ambiguous legacy “Download original” test
selector after the new original-Logo download was added. Making that selector
exact resolved the ambiguity; the complete suite was rerun successfully.
The renamed-ID media unit fixture now explicitly omits the real project's
immutable brand root. No production behavior was weakened for either fix.

The checks are Chromium-based, not a Safari/Firefox claim. Fine artwork facets
naturally soften at 16px. Original-artwork rights remain limited by recorded
evidence: the ten retained originals and supplied Poké Pocket illustration are
not granted a blanket MIT license. No new image-generation call was made.

`acceptance.json` preserves the command-log hashes, browser-capture hashes,
baseline and scope. Raw local test logs and Playwright traces are temporary
diagnostics outside deployment assets; CI produces fresh results for the exact
published commit.

To regenerate contact sheets without rewriting any kit:

```sh
bun artwork/brands/collection-2026-09/inspect.ts /tmp/hexly-brand-contact-sheets
```

The immutable kit authoring commands and subsequent-version rules are in the
[maintenance guide](../../../../docs/19-family-brand-archives.md).
