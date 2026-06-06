import type { Metadata } from "next";
import Link from "next/link";
import { getPagePath, seoPages } from "@/content/seo-pages";

export const metadata: Metadata = {
  title: "CrazyRouter API Guides",
  description:
    "CrazyRouter model API guides, comparison pages, and calculator pages with current pricing data and docs-backed examples.",
  alternates: {
    canonical: "/guide",
    languages: {
      en: "/guide",
      "zh-CN": "/zh/guide"
    }
  }
};

export default function GuideIndexPage() {
  return (
    <main>
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand">Guide hub</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            CrazyRouter API guide pages
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Compare model options, copy standard model names, review endpoint examples, and estimate costs
            before creating an API key on CrazyRouter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {seoPages.map((page) => (
            <Link
              key={page.slug}
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
