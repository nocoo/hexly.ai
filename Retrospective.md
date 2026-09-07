# Retrospective

## 2026-09-06: Registry rewrite during release

The first release command used `bun install --lockfile-only` with the machine's temporary npm mirror. Bun rewrote 238 dependency source URLs even though no dependencies changed. The release driver was stopped before tagging, and the original lockfile was restored in a follow-up commit.

The release command now includes `--frozen-lockfile`. A temporary checkout with the package version advanced to `0.2.0` verified that this command succeeds and leaves the lockfile byte-for-byte unchanged under the same mirror configuration. Root package versions are not stored in `bun.lock`; dependency source changes do not belong in a version-only release.

## 2026-09-06: Existing apex DNS blocked custom-domain attachment

Wrangler uploaded the ready Worker but failed to attach `hexly.ai` with error `100117`. Its automatic DNS override did not replace the externally managed Vercel A record. The release stopped before tagging.

The Workers preview was verified first. The exact, backed-up apex A record was then removed and the custom domain attached, preserving the existing MX and TXT records. Public release metadata and asset checks passed after attachment. A CI job entering cleanup does not establish deployment success; check the Deploy job's conclusion and public verification before reporting completion.

## 2026-09-06: Metadata readiness preceded valid CSS

The Frogie gallery deployment returned the expected release metadata, but the immediate production check rejected the compiled CSS response's content type. A later request to the same asset returned `text/css` and the full release verification passed. The failed job did not record the actual type, so the original response and the underlying delivery cause cannot be established.

The verifier now retries the complete release check within its existing bounded retry window, including the document, compiled asset types, and original-logo checksum. Success requires all checks in one attempt. Errors include the actual asset content type, and regression tests cover temporary HTML responses, persistent invalid CSS, stale metadata, and wrong logo bytes. Retries do not relax validation.

## 2026-09-07: A release fixture inherited the parent worktree

Running the full pre-commit suite in a linked worktree exposed a missing Git-environment boundary in the release dry-run test. The fixture changed its working directory but inherited repository-local Git variables from the hook. Its `git init`, local author settings, index, and fixture commit therefore targeted the publication worktree instead of the temporary repository. The test failed before any remote operation.

The fixture commit was preserved on a local recovery branch, the publication branch/index were reset to their preceding revision without discarding working files, and the shared repository's non-bare setting and original author identity were restored. Neither the source artwork nor remote refs changed. The fixture now removes every variable reported by `git rev-parse --local-env-vars` from both Git and release-script subprocesses and asserts its actual Git directory. Running from a hook in a linked worktree verifies this isolation. Logo checkpoint fixtures now supply their presentation configuration and cover both generated and retained-original approval records. Changes to the finisher trigger the unit suite even though it is called through a subprocess.

## 2026-09-07: Browser CI lacked runtime parity and evidence

Two browser runs lost their Wrangler server after startup, but the workflow discarded its diagnostic file. Their underlying exit cause remains unproven. A subsequent instrumented run kept the server alive and passed 97 of 98 tests; its remaining failure checked a new tab's URL before navigation finished. The new-tab test now waits for the expected URL and `DOMContentLoaded` before checking content.

The diagnostics also established that the shared workflow used Node.js 22.23.2, while local development and deployment used 26.7.0. Browser CI now has a separate job that pins the matching runtime and retains failure logs, traces, and screenshots. Deploy depends on both this job and the shared quality workflow. The full browser suite, three workers, zero retries, and all other quality gates remain required.
