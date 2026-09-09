# InfoSpace logo publication verification

Run from the repository root after the matching **Quality & Deploy** run has completed successfully:

```sh
bun run verify:production <full-site-revision>
bun docs/research/infospace-2026-09-09/logo-production/verify.ts <full-site-revision>
```

The first command checks the public version and exact Git revision, document, compiled assets and site identity. The second writes [report.json](report.json): it compares the public catalogue with the reviewed checkout, confirms adopted InfoSpace provenance and default placement, checks the project page's canonical and social-image metadata, and hashes 17 published assets plus the immutable InfoSpace source image.

The local [72-check browser review](../logo-browser/README.md) already covers appearance and interactions. This report records production HTTP responses and exact bytes. [publication.json](../publication.json) identifies the successful source and site workflow runs. A later commit that only archives this evidence follows the same automatic deployment workflow without changing the approved artwork or version.

The first remote browser attempt passed 163/164 checks. One mobile middle-click test timed out while waiting for the new tab's URL, although its trace records the correct `/logos/pew` request and HTTP 200 response. The same desktop/mobile cases passed locally without changes, and the complete remote browser job passed on attempt 2 of the same commit. [The original trace and follow-up record](ci-attempt-1/report.json) preserve the evidence and its limits. No code, assertions, timeout, retry configuration or quality gate was changed for the rerun.

The documentation commit `6afc64de1425c46fe739d72dded2c02758f6bef0` encountered the same mobile test again: 163/164 passed, but the expected new-page event did not arrive after the repository popup closed. The correct detail request still returned HTTP 200. The application and assets were identical to the successfully deployed revision. The repeated failure is recorded in [the second trace review](ci-tab-activation/report.json); the traces do not establish a specific browser defect.

The existing test now removes its completed GitHub request mock and explicitly activates the parent and detail tabs before the next action. It retains the real middle click on desktop and mobile, every URL/content assertion, the original timeouts, zero retries and all quality gates. The focused cases passed eight repetitions each: [16/16 checks](ci-tab-activation/focused-verification.txt). The complete automatic workflow remains required for publication of this test correction.
