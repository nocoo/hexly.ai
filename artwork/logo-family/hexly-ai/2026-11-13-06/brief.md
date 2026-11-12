# Retained two-tone header: reference-like light and shadow

The owner rejected the three new directions and returned to the original rounded-hexagon design. They asked to compare the Downloads reference's glow and shadow, simulate that separation, and continue optimizing the original direction on the light site background.

## Retained artwork

Keep the approved cream-frame, sand-beige left insert and brick-red right insert from study `2026-11-13-02`, finishing `02`. Its native 2048-square transparent master and the existing 128 px header derivative remain byte-identical. No image generation, extraction, recoloring, geometric change, rescaling of the native master or new presentation tile is involved.

The Downloads reference is `../2026-11-13-01/references/owner-reference.jpg`, SHA-256 `9f5b61e9db102cf58433eff5cf7f1766fac7ffa7d2f63edbadc54e53e9856d2f`. Its separation is primarily soft warm shadow toward the lower right, close edge shading and restrained warm light, rather than a strong luminous outline.

## Presentation

The explicit owner request is a scoped exception to the usual shadow/glow-free small-header rule. Apply independent alpha-shaped CSS drop shadows to the existing local candidate only:

- Light surface: a restrained close warm-brown edge shadow, a soft lower-right cast shadow, and faint warm ambient glow.
- Dark surface: reduce the treatment to a short dark shadow and faint warm halo; the retained cream silhouette already contrasts with the background.

`src/styles/base.css` owns the rendering values. `BrandMark` adds `brand-mark-preview` only in development with `VITE_LOCAL_MATERIALS=1`. Keep 36 × 36 CSS px, Space Grotesk wordmark, 11 px spacing and original site palette. Production markup, root identity, favicon, catalogue and Video Kit remain unchanged.

## Verification

The four environment-selection unit cases pass. The production build passes. Actual Chromium checks cover desktop English and mobile Chinese in both themes, plus a pure-white specimen. `inspection/header-review.json` records computed filters, unchanged image SHA-256, 36 px geometry, no horizontal overflow and no page errors. Before/after screenshots were visually inspected, and Chrome was opened at `https://index.dev.hexly.ai/`.

This is a local header presentation review, not a finished all-surface brand kit. Full HTTP/browser suites and historical asset hydration were not run. No R2 upload, push, release or third-party source adoption was performed.

## Owner decision

The owner rejected this shadow treatment and asked to remove it. Its CSS rules and preview-only class were deleted rather than retained behind a toggle. Continue visual-identity development with the unchanged shadow-free artwork in the new top section of `/templates`, using a square mark above the standard Hexly wordmark. This study remains historical evidence only.
