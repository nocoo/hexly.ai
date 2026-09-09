# InfoSpace logo publication verification

Run from the repository root after the matching **Quality & Deploy** run has completed successfully:

```sh
bun run verify:production <full-site-revision>
bun docs/research/infospace-2026-09-09/logo-production/verify.ts <full-site-revision>
```

The first command checks the public version and exact Git revision, document, compiled assets and site identity. The second writes [report.json](report.json): it compares the public catalogue with the reviewed checkout, confirms adopted InfoSpace provenance and default placement, checks the project page's canonical and social-image metadata, and hashes 17 published assets plus the immutable InfoSpace source image.

The local [72-check browser review](../logo-browser/README.md) already covers appearance and interactions. This report records production HTTP responses and exact bytes. [publication.json](../publication.json) identifies the successful source and site workflow runs. A later commit that only archives this evidence follows the same automatic deployment workflow without changing the approved artwork or version.

The first remote browser attempt passed 163/164 checks. One mobile middle-click test timed out while waiting for the new tab's URL, although its trace records the correct `/logos/pew` request and HTTP 200 response. The same desktop/mobile cases passed locally without changes, and the complete remote browser job passed on attempt 2 of the same commit. [The original trace and follow-up record](ci-attempt-1/report.json) preserve the evidence and its limits. No code, assertions, timeout, retry configuration or quality gate was changed for the rerun.
