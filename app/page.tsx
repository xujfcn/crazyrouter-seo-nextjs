import Link from "next/link";
import { seoPages, getPagePath } from "@/content/seo-pages";
import { zhSeoPages } from "@/content/seo-pages.zh";

export default function HomePage() {
  const featured = seoPages.filter((page) =>
    ["model", "tool", "comparison", "alternative"].includes(page.kind)
  );
  const zhPrioritySlugs = [
    "ai-api-platform-comparison",
    "gpt-image-2-api",
    "veo-3-1-api",
    "ai-api-cost-calculator"
  ];
  const zhPriorityPages = zhPrioritySlugs
    .map((slug) => zhSeoPages.find((page) => page.slug === slug))
    .filter((page): page is (typeof zhSeoPages)[number] => Boolean(page));

  return (
    <main>
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand">API guides</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            Crazyrouter AI API guides
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Model guides, competitor comparisons, and a cost calculator for planning real Crazyrouter API
            integrations with current pricing data and docs-backed examples.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/zh/guide"
              className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              中文 API 指南
            </Link>
            <Link
              href="/guide"
              className="rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              English Guides
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-brand">中文入口</div>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Crazyrouter API 中文指南</h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted">
              从主入口进入完整的中文 guide 系列，再按模型、平台替代方案和成本计算器继续查看。
            </p>
          </div>
          <Link href="/zh/guide" className="text-sm font-semibold text-brand hover:text-ink">
            查看全部中文指南
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {zhPriorityPages.map((page) => (
            <Link
              key={`zh-${page.slug}`}
              href={getPagePath(page, "zh")}
              className="rounded-lg border border-line bg-white p-6 hover:border-brand"
            >
              <div className="text-sm font-semibold uppercase tracking-wide text-brand">{page.eyebrow}</div>
              <h3 className="mt-3 text-xl font-semibold text-ink">{page.h1}</h3>
              <p className="mt-2 leading-7 text-muted">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-brand">English</div>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Guide pages</h2>
          </div>
          <Link href="/guide" className="text-sm font-semibold text-brand hover:text-ink">
            View all English guides
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((page) => (
            <Link
              key={`${page.kind}-${page.slug}`}
              href={getPagePath(page)}
              className="rounded-lg border border-line bg-white p-6 hover:border-brand"
            >
              <div className="text-sm font-semibold uppercase tracking-wide text-brand">{page.kind}</div>
              <h2 className="mt-3 text-xl font-semibold text-ink">{page.h1}</h2>
              <p className="mt-2 leading-7 text-muted">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
