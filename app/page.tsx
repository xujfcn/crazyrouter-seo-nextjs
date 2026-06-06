import Link from "next/link";
import { seoPages, getPagePath } from "@/content/seo-pages";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand">SEO system</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            CrazyRouter AI API SEO pages
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            A Next.js page system for model API pages, pricing pages, competitor comparisons, alternatives,
            and tool-led SEO.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {seoPages.map((page) => (
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
