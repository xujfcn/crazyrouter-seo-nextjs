# CrazyRouter SEO Next.js

SEO landing page system for CrazyRouter model API, pricing, comparison, alternative, and tool pages.

The project is designed to be deployed under `https://crazyrouter.com` subpaths:

- `/models/*`
- `/pricing/*`
- `/compare/*`
- `/alternatives/*`
- `/tools/*`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Content

Page content lives in `content/seo-pages.ts`. Add entries there, and the dynamic routes will generate pages, metadata, structured data, sitemap entries, and internal links.
