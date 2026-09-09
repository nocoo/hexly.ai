# InfoSpace catalogue CI review

The first site run for `9c8c96941b72538cb008d28dd007291499bb9fc6` is [Quality & Deploy 34300143663](https://github.com/nocoo/hexly.ai/actions/runs/34300143663). Unit, static, security, asset and HTTP checks passed. The browser suite passed 160 of 162 checks, with the same alphabetical-order assertion failing on desktop and mobile. Deployment was skipped.

## Evidence

The failing test was `tests/browser/site.spec.ts`, “combines search and categories, resets empty results, and sorts by name”. The page had selected **Name, A–Z**, displayed all 50 active projects and placed **Info Space** between **Hooky** and **IPSafe**. The test expected Info Space after **Zhe**.

The expected list was built by sorting two separate groups: projects with a `family` record, followed by projects without one. All previously active entries had a family record, so that outdated grouping had not affected the comparison. InfoSpace currently preserves its source SVG while the new logo is pending, making the difference visible.

The project contract already defines A–Z as sorting all matching names alphabetically. `src/model/catalogue.ts` implements that behavior, and `tests/unit/catalogue.test.ts` already checks a single sorted active list. The browser's actual result was correct; the default curated order and the tools insertion were unaffected.

## Correction

Remove the obsolete family groups from the existing browser test. Derive the expected names from the complete active catalogue and sort them with English collation. Use Playwright's locator `toHaveText` assertion to wait for the rendered list and compare every name in order. Keep the rest of the search, category, reset and URL assertions, both devices, three workers and zero retries.

The original run's `browser-failure-evidence` artifact contains desktop and mobile screenshots, error contexts and traces. It was downloaded to `/tmp/infospace-ci-browser-34300143663` for inspection. The failure diff and page snapshots agree on the two InfoSpace positions above. No production credentials or raw runtime diagnostics are copied into this report.

After the correction, `bun run check:isolation` and `bunx playwright test tests/browser/site.spec.ts --grep 'combines search and categories'` passed locally: both desktop and mobile cases completed successfully.

## Publication verification

Revision `6813c9d1e30fd649f05d08ee294e1441544ec0a5` passed the full CI suite and Deploy in [Quality & Deploy 34300696343](https://github.com/nocoo/hexly.ai/actions/runs/34300696343). `gh run watch` exited successfully. The deployment's public verification and a separate `bun run verify:production` both confirmed `https://hexly.ai`, version `0.5.0`, the exact revision, compiled assets and original logo.

An independent [production browser review](production/report.json) passed 12 checks: eight desktop/mobile, light/dark and English/Chinese overview combinations plus four order/filter/navigation/refresh groups. It verified seven stack badges, both README links, no horizontal overflow, 70 total projects, 50 active projects and no page errors. The default sequence contains DreamRO, InfoSpace and signoff.now in that order. Root inspected the archived desktop English and mobile Chinese captures. These checks cover the preserved source SVG, before approval and adoption of the physical-object image. The later [logo browser review](logo-browser/README.md) and [publication record](publication.json) record the replacement separately.
