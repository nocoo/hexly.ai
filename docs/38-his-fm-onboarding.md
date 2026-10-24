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
| Identity file | `artwork/show-stillwood-20261022/podcast-cover-3000.jpg`, 3000 × 3000, 495 570 bytes |
| Byte hash | `0a64cac84ab3bbb8a1c5bcb03976b516698cb41cfec0ea2cdd9c5b5e1372cd85` |
| Retained original | `/logos/originals/his-fm-channel.jpg`, copied without modification |
| Evidence | Live `https://his.fm/feed.xml` `itunes:image` → `f.no.mt/…podcast-cover-3000.jpg`, identical bytes |
| Live service | `https://his.fm`, `/api/live` returned `status: ok` at the same revision |
| Profile | `nocoo/nocoo` `c5c26ac` adds the entry at the top of Recent Projects |
| Category / emoji | `everyday` / 🎧 |
| Sources snapshot | `docs/sources/his-fm-2026-10-23.json` |
| R2 publication | Eight verified objects under `projects/his-fm/identity/v1.0.0/` |

The catalogue identity is the **RSS channel artwork**, not the application icon.
An initial pass used `apps/web/public/apple-touch-icon.png`; the owner rejected
that choice and pointed at the channel image in the feed. That icon stays as an
archived asset (`/logos/originals/his-fm.png`) and no longer represents the
project. Website theme tokens still come from `apps/web/src/brand/themes.ts`
(Paper `#f3f3ec`, Forest `#213e2d`, Lime `#d0f66d`, Grass `#759c45`, Lilac
`#dfd8f0`) and stay separate from the sampled artwork palette (canopy `#333935`,
wordmark cream `#ebebe1`, sunlit mist `#9b9772`, warm bokeh `#8b7253`).

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
