InfoSpace headless browser review: REQUIRES REVIEW.

Local Vite site http://127.0.0.1:7048; 2026-09-09T02:37:04.162Z to 2026-09-09T02:37:46.326Z.

Desktop 1440 × 1000 and mobile 320 × 740; site en/zh and light/dark; all three artwork presentations. Static study uses English and was checked at both widths/themes in all modes.

59/64 checks passed; 20 significant browser/network diagnostics. 12 actual downloads saved and compared with the exact archived source bytes. 57 screenshots saved.

Checks cover original/current image decoding, 32/16 px specimens and 24/16 px context marks retaining transparent pixels and source URLs as large modes switch, transparent static favicon, all seven palette clipboard values, exact prompt text, four ordered static reference images, absence of reference boards on the site, translated goals/seven badges/README links, horizontal layout, directory order, refresh and browser history.

Family status at start was review; this is the expected pending-source-commit state, not a failure. Watched source-file checksums were stable during review.

No repository files, frozen finishing files, commits or pushes were changed. Chromium ran headless; no browser was brought to the desktop foreground. Native toolbar behavior is outside this review.

Failures:
- catalogue: InfoSpace begins tools group: AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

'bat' !== 'infospace'

    at <anonymous> (/private/tmp/infospace-logo-browser/review.ts:182:12)
    at check (/private/tmp/infospace-logo-browser/review.ts:41:28)
    at /private/tmp/infospace-logo-browser/review.ts:180:9
    at processTicksAndRejections (native:7:39)
- site-desktop-light: refresh, preferences, history and first tools placement: Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('.project-card').first()
Expected: "infospace"
Received: "bat"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('.project-card').first() with timeout 5000ms
  - waiting for locator('.project-card').first()
    14 × locator resolved to <article data-project="bat" class="project-card">…</article>
       - unexpected value "bat"

    at captureRawStack (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright-core/lib/coreBundle.js:8588:21)
    at callMatcherAsStep (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright/lib/matchers/expect.js:13310:57)
    at <anonymous> (/private/tmp/infospace-logo-browser/review.ts:281:63)
    at async check (/private/tmp/infospace-logo-browser/review.ts:41:28)
    at processTicksAndRejections (native:7:39)
- site-desktop-dark: refresh, preferences, history and first tools placement: Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('.project-card').first()
Expected: "infospace"
Received: "bat"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('.project-card').first() with timeout 5000ms
  - waiting for locator('.project-card').first()
    14 × locator resolved to <article data-project="bat" class="project-card">…</article>
       - unexpected value "bat"

    at captureRawStack (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright-core/lib/coreBundle.js:8588:21)
    at callMatcherAsStep (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright/lib/matchers/expect.js:13310:57)
    at <anonymous> (/private/tmp/infospace-logo-browser/review.ts:281:63)
    at async check (/private/tmp/infospace-logo-browser/review.ts:41:28)
    at processTicksAndRejections (native:7:39)
- site-mobile-light: refresh, preferences, history and first tools placement: Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('.project-card').first()
Expected: "infospace"
Received: "bat"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('.project-card').first() with timeout 5000ms
  - waiting for locator('.project-card').first()
    14 × locator resolved to <article data-project="bat" class="project-card">…</article>
       - unexpected value "bat"

    at captureRawStack (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright-core/lib/coreBundle.js:8588:21)
    at callMatcherAsStep (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright/lib/matchers/expect.js:13310:57)
    at <anonymous> (/private/tmp/infospace-logo-browser/review.ts:281:63)
    at async check (/private/tmp/infospace-logo-browser/review.ts:41:28)
    at processTicksAndRejections (native:7:39)
- site-mobile-dark: refresh, preferences, history and first tools placement: Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('.project-card').first()
Expected: "infospace"
Received: "bat"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('.project-card').first() with timeout 5000ms
  - waiting for locator('.project-card').first()
    14 × locator resolved to <article data-project="bat" class="project-card">…</article>
       - unexpected value "bat"

    at captureRawStack (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright-core/lib/coreBundle.js:8588:21)
    at callMatcherAsStep (/Users/nocoo/workspace/personal/hexly.ai/node_modules/playwright/lib/matchers/expect.js:13310:57)
    at <anonymous> (/private/tmp/infospace-logo-browser/review.ts:281:63)
    at async check (/private/tmp/infospace-logo-browser/review.ts:41:28)
    at processTicksAndRejections (native:7:39)

Diagnostics:
[
  {
    "scope": "site-desktop-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-desktop-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-desktop-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-desktop-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-desktop-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-desktop-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-desktop-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-desktop-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-desktop-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-desktop-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-mobile-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-mobile-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-mobile-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-mobile-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-mobile-light",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-mobile-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-mobile-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#bd9f6d"
  },
  {
    "scope": "site-mobile-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-mobile-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  },
  {
    "scope": "site-mobile-dark",
    "kind": "console-error",
    "message": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. accent-#fdc904"
  }
]

Machine-readable measurements, checksums, evidence names and per-scenario results: report.json. Visual inspection notes will be added after screenshot review.
