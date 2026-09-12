# Social share metadata for product sites

Product sites such as [pew.md](https://pew.md) can reuse hexly.ai's Open Graph title, description, and 1200 × 630 share image without copying the JPEG into each repository. The records are static JSON emitted at build time. There is no application server.

## Endpoints

| URL | Body |
| --- | --- |
| `https://hexly.ai/api/share.json` | Catalogue of every share record |
| `https://hexly.ai/api/share/<id>.json` | One project, for example `pew` |
| `https://hexly.ai/api/share/hexly-ai.json` | The hexly.ai site card |
| `https://hexly.ai/og/<id>.jpg` | The JPEG itself (`https://hexly.ai/og.jpg` for the site) |

`GET` and `HEAD` are public. Responses include `Access-Control-Allow-Origin: *`. Unknown ids return JSON `404`.

```sh
curl -s https://hexly.ai/api/share/pew.json
```

```json
{
  "id": "pew",
  "name": "Pew",
  "emoji": "🦓",
  "title": "Pew — hexly.ai",
  "description": {
    "en": "A contribution graph for the AI-native era. See your coding tokens tell a story.",
    "zh": "AI 时代的贡献图，把不同编程工具的 Token 使用记录变成可见的轨迹。"
  },
  "canonical": "https://hexly.ai/projects/pew",
  "image": {
    "url": "https://hexly.ai/og/pew.jpg",
    "type": "image/jpeg",
    "width": 1200,
    "height": 630,
    "alt": "Pew identity"
  },
  "twitterCard": "summary_large_image",
  "siteName": "hexly.ai",
  "website": "https://pew.md",
  "repository": "https://github.com/nocoo/pew",
  "archived": false
}
```

Local preview: `https://index.dev.hexly.ai/api/share/pew.json`.

## What to reuse

| Field | On the product site |
| --- | --- |
| `image.url`, `image.type`, `image.width`, `image.height`, `image.alt` | Always. This is the typeset share card. |
| `description.en` / `description.zh` | Use when the product has no stronger page-specific summary. |
| `name` | Product title. Prefer this over `title` on the product origin. |
| `title` | hexly.ai project title (`Name — hexly.ai`). Use on hexly pages, not as the product homepage title. |
| `canonical` | hexly.ai project-detail URL. Do **not** copy this onto the product origin. |

Keep the product's own `og:url`, canonical link, and `og:title` for that origin. Sharing `https://pew.md/` should unfurl Pew's URL with hexly's image, not rewrite the link to `/projects/pew`.

The local route update changes project canonicals from `/logos/<id>` to
`/projects/<id>`. Old pages redirect to the detail's brand anchor. Existing
`/api/share` and `/og` URLs and image bytes remain unchanged. The build updates
sitemap, crawler snapshots and JSON-LD from the same source; `/logos` remains a
secondary collection page and `/templates` describes reusable designs. These
route changes are not yet published.

Do not use `/logos/display/*-1024.webp` or family `icon-1024.webp` as `og:image`. Those are square identity marks, not 1200 × 630 cards.

## HTML

Read the JSON at **build time** (or pin a copy in the product repo). Then emit tags. `og:url` stays on the product origin.

```html
<meta property="og:site_name" content="Pew" />
<meta property="og:title" content="Pew" />
<meta property="og:description" content="A contribution graph for the AI-native era. See your coding tokens tell a story." />
<meta property="og:url" content="https://pew.md/" />
<meta property="og:image" content="https://hexly.ai/og/pew.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Pew identity" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Pew" />
<meta name="twitter:description" content="A contribution graph for the AI-native era. See your coding tokens tell a story." />
<meta name="twitter:image" content="https://hexly.ai/og/pew.jpg" />
<meta name="twitter:image:alt" content="Pew identity" />
```

Hotlinking the JPEG from hexly.ai is intended. After hexly regenerates cards, product sites pick up the new bytes at the same URL. If a platform has cached an old card, change is visible after that cache expires; a new image URL is only needed when hexly itself changes the path.

## Fetch during a product build

```ts
const share = await fetch("https://hexly.ai/api/share/pew.json").then((response) => {
	if (!response.ok) throw new Error(`hexly share ${response.status}`);
	return response.json();
});
```

Pinning a snapshot in the product repository is also valid when that build must not depend on the network. Refresh it when the hexly identity or copy changes.

A browser-side fetch on every page view is unnecessary. Prefer build-time metadata.

## Next.js App Router

```tsx
type ShareCard = {
	name: string;
	description: { en: string; zh: string };
	image: {
		url: string;
		type: string;
		width: number;
		height: number;
		alt: string;
	};
};

const share: ShareCard = await fetch("https://hexly.ai/api/share/pew.json").then(
	(response) => response.json(),
);

export const metadata = {
	title: share.name,
	description: share.description.en,
	openGraph: {
		url: "https://pew.md/",
		siteName: share.name,
		title: share.name,
		description: share.description.en,
		images: [
			{
				url: share.image.url,
				type: share.image.type,
				width: share.image.width,
				height: share.image.height,
				alt: share.image.alt,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: share.name,
		description: share.description.en,
		images: [share.image.url],
	},
};
```

## Checks

1. `curl -sI https://hexly.ai/og/pew.jpg` returns `image/jpeg`.
2. The product HTML `og:image` absolute URL is that JPEG.
3. Facebook / Slack / X debugger shows the typeset card (wordmark, title, identity), not a raw square logo.
4. Sharing the product URL still points at the product origin.

Identity adoption for README, sidebar, and favicon remains in [the logo usage SOP](07-logo-usage-sop.md). This document only covers share cards.
