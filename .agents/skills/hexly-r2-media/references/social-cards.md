# Social share cards

Every catalogue project, plus the home page, has one 1200 × 630 JPEG used by
`og:image`, `twitter:image` and `/api/share/<id>.json`. These are the thumbnails
other people see when a link is pasted into chat, mail or a social network. They
are presentation derivatives, not part of a project identity.

`src/data/social-cards.json` is the registry: it records the published path,
byte count, SHA-256, input fingerprint and render date for every card. Nothing
else may store a card path; `src/model/discovery.ts` reads only this registry.

## Naming

```text
/og/<id>-<YYYYMMDD>-<hash6>.jpg     /og/fundly-20261028-9626b8.jpg
/og/site-<YYYYMMDD>-<hash6>.jpg     /og/site-20261028-7bec14.jpg
```

`hash6` is the first six characters of the rendered JPEG's SHA-256. Identical
input therefore yields identical bytes and the same name, so reruns are
idempotent. Changed input yields a new name, which keeps every published object
immutable and satisfies the asset inventory, which refuses to rewrite a source
path in place.

The Worker serves `/og/<name>.jpg` as a 302 to the `h.no.mt` object recorded in
`src/data/assets-routes.json`. Old card files are deleted on purpose; do not keep
stale cards to preserve old URLs unless the owner explicitly asks.

## When to regenerate

Any change to a card's inputs makes it stale:
- project title, English description, category or archived flag
- the artwork the card shows: `family.root/icon-1024.webp` for family projects,
  otherwise `logo.display`

`socialCardFingerprint` in `src/model/social-card.ts` hashes exactly those inputs.
`tests/unit/social-cards.test.ts` recomputes it, so `bun run test` fails with the
command to run whenever a card is stale, missing, unpublished, or named outside
the convention. You do not need to render anything to discover staleness.

## Procedure

```sh
bun run social:build --project fundly   # one card
bun run social:build                    # home page plus every project
bun run social:build --site             # home page only
bun run social:check                    # verify fingerprints without rendering
```

Then publish the new files in this order:

```sh
bun run assets:r2 inventory
bun run assets:r2 plan --project <id>
bun run assets:r2 publish --project <id> --upload
```

`bun run assets:build` runs asset generation and `social:build` together, and
`bun run verify` runs `social:check`, so CI catches a stale card before deploy.

## Removing a card

Delete the JPEG from `public/og/`, drop its row from `src/data/social-cards.json`
(the generator rewrites the registry from what it rendered), and rerun the
inventory. Move the retired inventory row to `docs/assets/retired.json` so a
retired filename cannot be reintroduced. Removing a project from the catalogue
means removing its registry entry too; the test asserts the registry matches the
catalogue exactly.

## Rules

- Never hand-edit a card JPEG, never rename one outside the convention, and never
  point `og:image` at a project's raw logo file.
- The card shows the project's current identity. A logo replacement requires a
  new card in the same change.
- Rendering uses the real site fonts through Playwright; keep the fonts, the
  template in `scripts/create-social.ts` and `scripts/social.css` together as one
  contract.
- Cards stay under 400 000 bytes; the generator and `verify-assets` both enforce
  the ceiling.
