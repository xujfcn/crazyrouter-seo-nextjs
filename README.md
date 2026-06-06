# CrazyRouter SEO Next.js

Docs-aligned SEO guide pages for CrazyRouter model APIs, competitor comparisons, and calculator-led pages.

All generated SEO pages live under one namespace:

- `/guide/gpt-image-2-api`
- `/guide/veo-3-1-api`
- `/guide/nano-banana-2-api`
- `/guide/grok-4-image-api`
- `/guide/qwen-image-api`
- `/guide/crazyrouter-vs-apimart`
- `/guide/apimart-ai-alternative`
- `/guide/ai-api-cost-calculator`

This avoids conflicts with existing CrazyRouter Tools routes such as `/tools/pricing-calculator/`, `/tools/model-comparison/`, and `/tools/model-radar/`.

## Data Sources

- Pricing source: `GET https://cn.crazyrouter.com/api/pricing`
- Pricing snapshot: `content/pricing-snapshot.json`
- Live API evidence: `content/live-api-evidence.json`
- Docs source of truth: `D:\Downloads\new-api-main\newapi\crazyrouter-docs`

Model names, endpoint types, billing mode, and page copy must stay aligned with the Pricing page and docs. Do not add SEO pages for models that are not present in the Pricing API.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Update Pricing Snapshot

```bash
npm run sync:pricing
```

Review changed model rows before committing. If a model disappears from the Pricing API, remove or rewrite the matching guide page.
