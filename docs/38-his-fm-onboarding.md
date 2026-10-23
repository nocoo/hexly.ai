# his.fm onboarding: retained identity, no generation

his.fm is an AI-collaboration Mandarin podcast. The owner authorized catalogue
onboarding with one explicit exception: **do not generate or redraw a Logo; use
the project's own mark**. The catalogue therefore has no `family` record for this
project, the gallery shows the source artwork unchanged, and the identity remains
owned by the repository.

## Evidence

| Fact | Value |
| --- | --- |
| Repository revision | `927170dfebc602ca6697dd514188c6f0c1136050` |
| Identity file | `apps/web/public/apple-touch-icon.png`, 180 × 180, 5 413 bytes |
| Byte hash | `e1fa78d21e83e59d77890c6e6bce41b5b70cbb12e9eee27548c8a8507f218b2d` |
| Retained original | `/logos/originals/his-fm.png`, copied without modification |
| Live service | `https://his.fm`, `/api/live` returned `status: ok` at the same revision |
| Profile | `nocoo/nocoo` `c5c26ac` adds the entry at the top of Recent Projects |
| Category / emoji | `everyday` / 🎧 |
| Sources snapshot | `docs/sources/his-fm-2026-10-23.json` |
| R2 publication | Eight verified objects under `projects/his-fm/identity/v1.0.0/` |

The 180 px native icon is the only square master in the repository; the 1024 and
512 display derivatives are explicit resampling of those exact bytes and are
recorded as such. Palette evidence comes from the grove theme tokens in
`apps/web/src/brand/themes.ts` (Paper `#f3f3ec`, Forest `#213e2d`, Lime
`#d0f66d`, Grass `#759c45`, Lilac `#dfd8f0`), not from the icon.

## Catalogue consequences

- Active projects may deliver an original identity without a textured
  presentation. `presentation-icons` asserts that these entries expose no
  `presentationIcon` and still resolve their 64/512 icons from the inventoried
  display derivatives.
- Status coverage grows to 42 targets; his.fm is monitored at
  `https://his.fm/api/live` like every other active independent site.
- The profile and this catalogue keep the same emoji and English description, per
  the profile contract.

No artwork was generated, sampled into a new master, or recolored. The earlier
design favicon (`h.` glyph) is not part of this identity decision.
