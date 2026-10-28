# Retain an existing identity

Use this route only when the owner chooses the existing artwork and requests a presentation pass. It needs no image-generation call or new-image checkpoint. The owner's retained identity takes precedence over generation-specific pose, framing, fragmentation, and interest-point changes. Keep its native canvas and exact original PNG bytes. Never silently substitute an earlier rejected drawing.

## Source record

Create a fresh `artwork/logo-family/<project>/<date>-<sequence>/` and copy the actual source to `source/original.png`. Record its SHA-256, dimensions, byte count, source repository, exact Git revision, path, and immutable URL in `source.json`:

```json
{
	"kind": "retained-original",
	"generationCalls": 0,
	"artwork": {
		"path": "source/original.png",
		"sha256": "<exact SHA-256>",
		"width": 2048,
		"height": 2048,
		"bytes": 123456,
		"repository": "https://github.com/nocoo/project",
		"repositoryRevision": "<full revision>",
		"sourcePath": "logo.png",
		"sourceUrl": "https://github.com/nocoo/project/blob/<revision>/logo.png"
	},
	"ownerInstruction": "<actual instruction retaining this artwork>"
}
```

Save `source-review.json` with `status: "approved"`, the exact `imageSha256`, the owner's actual retained-artwork instruction, and truthful decision evidence. Distinguish authorization to retain a known project identity from an owner review of newly supplied bytes. Do not manufacture `raw-review.json`, provider usage, or a model response for a call that never occurred.

Write `brief.md` and `brief.txt` describing the subject being retained and the background work. Sample foreground colors from actual source pixels; record coordinates, alpha, hash, and sRGB values in `palette.json`. Designed presentation colors and actual site UI colors remain separately identified.

## Finish and inspect

Use the active finisher with `presentation.json` containing `sourceMode: "retained-transparent"`. It preserves the native transparent master without extraction, recoloring, repositioning, or contour continuation. Save unique project-specific background paths, colors, opacity, grain seed, and shadow parameters. Format mutable recipes before freezing the numbered finishing pass.

Preserve the native resolution even when it is below 2048 px. A 900 or 920 px original must stay a 900 or 920 px native master. If a larger export is useful, list its size in `upscaledExportSizes` and disclose it as an upscale. The public archive, downloads, source profiles, and review links use the recorded native size rather than assuming 2048 px.

Measure rounded-boundary intersections and inspect the result visually. Record any original neck/shoulder entry that intentionally crosses the rounded base; do not confuse it with accidental ear, eye, muzzle, or accessory clipping. The normal safe-margin target for newly composed drawings is not authorization to reframe a retained source. Keep canonical foreground bytes unchanged even when a platform icon needs a separate inset.

## Complete delivery

- Untouched original and exact transparent master; square, rounded, and white presentations; native and standard export sizes; independent background/shadow layers; frozen recipe, tool snapshot, and checksum manifest.
- One complete static `review.html` per project and its `/logos/<project>` page, with the regular before/after layout. The two foregrounds deliberately match. Include Icon/Transparent/White modes, palette, framing notes, downloads, size examples, and the presentation brief. Reference boards remain restricted to static HTML and Git.
- `family.method: "retained-original"`, no invented `family.model`, and the owner's `Refined` badge. Public archives use `source.png` and `brief.txt` instead of fake raw generations or prompts. Preserve the old normalized original filename and hash when its bytes have not changed.
- Complete source-project adoption: canonical root `logo.png`, separate presentation masters, actual README image references, transparent small UI/favicon assets, correct touch/social/native platform icons, and a reproducible source generator. Keep menu bar templates, recording-state marks, and independent user/site identities explicit.
- Verification of source/master byte equality, foreground PNG pixels, every ICO resolution, effective metadata links, and native masks/insets. Do not label a full-bleed image maskable without checking the platform's safe region. Generated platform helpers may need already-inset custom foreground layers; inspect their actual output.
- Source commit, catalogue provenance, sampled colors, generated project profile, both review paths, source brand guide, and shared usage SOP kept in sync. Run required gates and authorized pushes. Record source adoption, push, and deployment as separate facts.

Use [hexly.ai's usage SOP](https://github.com/nocoo/hexly.ai/blob/main/docs/07-logo-usage-sop.md) for the surface audit. A logo-only pass need not change GitHub-profile prose. Any profile entry edit still requires the corresponding directory update.
