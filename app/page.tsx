import Link from "next/link";
import { seoPages, getPagePath } from "@/content/seo-pages";

export default function HomePage() {
  const featured = seoPages.filter((page) =>
    ["model", "tool", "comparison", "alternative"].includes(page.kind)
  );

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
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
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
