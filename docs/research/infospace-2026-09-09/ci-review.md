# InfoSpace catalogue CI review

The first site run for `9c8c96941b72538cb008d28dd007291499bb9fc6` is [Quality & Deploy 34300143663](https://github.com/nocoo/hexly.ai/actions/runs/34300143663). Unit, static, security, asset and HTTP checks passed. The browser suite passed 160 of 162 checks, with the same alphabetical-order assertion failing on desktop and mobile. Deployment was skipped.

## Evidence

The failing test was `tests/browser/site.spec.ts`, “combines search and categories, resets empty results, and sorts by name”. The page had selected **Name, A–Z**, displayed all 50 active projects and placed **Info Space** between **Hooky** and **IPSafe**. The test expected Info Space after **Zhe**.

The expected list was built by sorting two separate groups: projects with a `family` record, followed by projects without one. All previously active entries had a family record, so that outdated grouping had not affected the comparison. InfoSpace currently preserves its source SVG while the new logo is pending, making the difference visible.

The project contract already defines A–Z as sorting all matching names alphabetically. `src/model/catalogue.ts` implements that behavior, and `tests/unit/catalogue.test.ts` already checks a single sorted active list. The browser's actual result was correct; the default curated order and the tools insertion were unaffected.

## Correction

Remove the obsolete family groups from the existing browser test. Derive the expected names from the complete active catalogue and sort them with English collation. Use Playwright's locator `toHaveText` assertion to wait for the rendered list and compare every name in order. Keep the rest of the search, category, reset and URL assertions, both devices, three workers and zero retries.

The original run's `browser-failure-evidence` artifact contains desktop and mobile screenshots, error contexts and traces. It was downloaded to `/tmp/infospace-ci-browser-34300143663` for inspection. The failure diff and page snapshots agree on the two InfoSpace positions above. No production credentials or raw runtime diagnostics are copied into this report.

After the correction, `bun run check:isolation` and `bunx playwright test tests/browser/site.spec.ts --grep 'combines search and categories'` passed locally: both desktop and mobile cases completed successfully. The full CI suite and the Deploy job are still required before publication is reported.
