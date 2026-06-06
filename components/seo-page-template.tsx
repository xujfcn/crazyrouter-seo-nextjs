import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, ExternalLink, ShieldCheck } from "lucide-react";
import {
  findPageBySlug,
  getPagePath,
  getPagePricing,
  type SeoPage
} from "@/content/seo-pages";
import { CostCalculator } from "@/components/cost-calculator";
import { getEndpointPath, pricingUpdatedAt } from "@/lib/pricing";

type SeoPageTemplateProps = {
  page: SeoPage;
};

function endpointText(endpointType: string | undefined) {
  if (!endpointType) {
    return undefined;
  }

  const endpoint = getEndpointPath(endpointType);
  return endpoint ? `${endpoint.method} ${endpoint.path}` : endpointType;
}

export function SeoPageTemplate({ page }: SeoPageTemplateProps) {
  const relatedPages = page.related
    .map((slug) => findPageBySlug(slug))
    .filter((item): item is SeoPage => Boolean(item));
  const pricing = getPagePricing(page);
  const endpoint = endpointText(page.endpointType);

  return (
    <main>
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-18">
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
            <a
              href="https://docs.crazyrouter.com/llms.txt"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              Docs source
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <span className="text-sm text-muted">Updated {page.updatedAt}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_330px]">
        <article className="space-y-8">
          <section className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ink">Search intent</h2>
            <p className="mt-4 leading-8 text-muted">{page.intent}</p>
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

          {pricing.length ? (
            <section className="rounded-lg border border-line bg-white p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">Pricing page models</h2>
                  <p className="mt-2 leading-7 text-muted">
                    Source: GET https://cn.crazyrouter.com/api/pricing, snapshot {pricingUpdatedAt}.
                  </p>
                </div>
                {endpoint ? (
                  <div className="rounded-md border border-line bg-panel px-3 py-2 text-sm font-medium text-ink">
                    {endpoint}
                  </div>
                ) : null}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {pricing.map((item) => (
                  <div key={item.modelName} className="rounded-lg border border-line bg-panel p-4">
                    <div className="text-lg font-semibold text-ink">{item.modelName}</div>
                    <div className="mt-2 text-sm text-muted">{item.displayPrice}</div>
                    <div className="mt-3 grid gap-2 text-xs text-muted">
                      <div>Billing: {item.billingMode}</div>
                      <div>Public endpoints: {item.publicEndpointTypes.join(", ") || "none"}</div>
                      <div>Supported endpoints: {item.supportedEndpointTypes.join(", ") || "none"}</div>
                      {item.rule ? (
                        <div>
                          Rule: {item.rule.capability || "default"}
                          {item.rule.resolution ? `, ${item.rule.resolution}` : ""}
                          {item.rule.verificationStatus ? `, ${item.rule.verificationStatus}` : ""}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {page.calculatorPresets ? <CostCalculator presets={page.calculatorPresets} /> : null}

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

          {page.testEvidence?.length ? (
            <section className="rounded-lg border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
                <ShieldCheck className="h-6 w-6 text-brand" aria-hidden="true" />
                cn.crazyrouter.com test evidence
              </h2>
              <p className="mt-3 leading-7 text-muted">
                Public checks were run without a key, and the model-list check used the local
                CRAZYROUTER_API_KEY without exposing it in the page. Billable generation tests are separate.
              </p>
              <div className="mt-5 overflow-hidden rounded-lg border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-panel text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Check</th>
                      <th className="px-4 py-3 font-medium">Request</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {page.testEvidence.map((item) => (
                      <tr key={`${item.method}-${item.url}-${item.label}`}>
                        <td className="px-4 py-3 font-medium text-ink">{item.label}</td>
                        <td className="px-4 py-3 text-muted">
                          {item.method} {item.url}
                        </td>
                        <td className="px-4 py-3 text-ink">{item.status}</td>
                        <td className="px-4 py-3 text-muted">{item.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {page.codeSamples?.length ? (
            <section className="rounded-lg border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
                <Code2 className="h-6 w-6 text-brand" aria-hidden="true" />
                Implementation examples
              </h2>
              <div className="mt-5 grid gap-5">
                {page.codeSamples.map((sample) => (
                  <div key={sample.label} className="overflow-hidden rounded-lg border border-line">
                    <div className="border-b border-line bg-panel px-4 py-2 text-sm font-semibold text-ink">
                      {sample.label}
                    </div>
                    <pre className="overflow-x-auto bg-ink p-4 text-sm leading-6 text-white">
                      <code>{sample.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

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
            <h2 className="text-base font-semibold text-ink">Docs alignment</h2>
            <div className="mt-4 space-y-2">
              {page.docsRefs.map((ref) => (
                <div key={ref} className="rounded-md border border-line bg-panel p-3 text-xs leading-5 text-muted">
                  {ref}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-base font-semibold text-ink">Related guide pages</h2>
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
            <h2 className="font-semibold">Unified route namespace</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              This SEO project generates only /guide/* paths so it does not conflict with existing
              /tools/* entries on the CrazyRouter tools project.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
