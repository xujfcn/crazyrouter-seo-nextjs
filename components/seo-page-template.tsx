import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { findPageBySlug, getPagePath, type SeoPage } from "@/content/seo-pages";

type SeoPageTemplateProps = {
  page: SeoPage;
};

export function SeoPageTemplate({ page }: SeoPageTemplateProps) {
  const relatedPages = page.related
    .map((slug) => findPageBySlug(slug))
    .filter((item): item is SeoPage => Boolean(item));

  return (
    <main>
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand">{page.eyebrow}</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            {page.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{page.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://crazyrouter.com"
              className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              {page.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <span className="text-sm text-muted">Updated {page.updatedAt}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="space-y-10">
          <section className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ink">SEO target</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted">Primary keyword</dt>
                <dd className="mt-1 text-lg font-semibold text-ink">{page.primaryKeyword}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted">Secondary keywords</dt>
                <dd className="mt-1 text-sm leading-6 text-ink">{page.secondaryKeywords.join(", ")}</dd>
              </div>
            </dl>
          </section>

          {page.sections.map((section) => (
            <section key={section.heading} className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-2xl font-semibold text-ink">{section.heading}</h2>
              <p className="mt-4 leading-8 text-muted">{section.body}</p>
              {section.bullets ? (
                <ul className="mt-5 grid gap-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-muted">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-brand" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ink">FAQ</h2>
            <div className="mt-5 divide-y divide-line">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="font-semibold text-ink">{faq.question}</h3>
                  <p className="mt-2 leading-7 text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-6">
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-base font-semibold text-ink">Related pages</h2>
            <div className="mt-4 space-y-3">
              {relatedPages.map((related) => (
                <Link
                  key={related.slug}
                  href={getPagePath(related)}
                  className="block rounded-md border border-line p-3 text-sm font-medium text-ink hover:border-brand"
                >
                  {related.h1}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-ink p-5 text-white">
            <h2 className="font-semibold">Production API routing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Use these SEO pages to capture demand, then route qualified users to the main CrazyRouter signup flow.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
