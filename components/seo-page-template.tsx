import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, ExternalLink, ShieldCheck } from "lucide-react";
import {
  getPagePath,
  getPagePricing,
  seoPages,
  type PageLocale,
  type SeoPage
} from "@/content/seo-pages";
import { CostCalculator } from "@/components/cost-calculator";
import { getEndpointPath, pricingUpdatedAt } from "@/lib/pricing";

type SeoPageTemplateProps = {
  page: SeoPage;
  locale?: PageLocale;
  pages?: SeoPage[];
};

const templateCopy = {
  en: {
    docsSource: "Docs source",
    updated: "Updated",
    searchIntent: "Use case",
    primaryKeyword: "Main topic",
    secondaryKeywords: "Related topics",
    pricingModels: "Pricing page models",
    pricingSource: "Source: GET https://cn.crazyrouter.com/api/pricing, snapshot",
    billing: "Billing",
    publicEndpoints: "Public endpoints",
    supportedEndpoints: "Supported endpoints",
    none: "none",
    rule: "Rule",
    defaultRule: "default",
    testEvidence: "cn.crazyrouter.com test evidence",
    testEvidenceNote:
      "Public checks were run without a key, and the model-list check used the local CRAZYROUTER_API_KEY without exposing it in the page. Billable generation tests are separate.",
    check: "Check",
    request: "Request",
    status: "Status",
    result: "Result",
    implementationExamples: "Implementation examples",
    faq: "FAQ",
    docsAlignment: "Source docs",
    relatedPages: "Related guide pages",
    namespaceTitle: "Unified route namespace",
    namespaceBody:
      "This SEO project generates only /guide/* paths so it does not conflict with existing /tools/* entries on the CrazyRouter tools project."
  },
  zh: {
    docsSource: "查看文档索引",
    updated: "更新于",
    searchIntent: "适用场景",
    primaryKeyword: "页面主题",
    secondaryKeywords: "相关主题",
    pricingModels: "价格页模型",
    pricingSource: "来源：GET https://cn.crazyrouter.com/api/pricing，快照日期",
    billing: "计费方式",
    publicEndpoints: "公开端点类型",
    supportedEndpoints: "支持端点类型",
    none: "无",
    rule: "价格规则",
    defaultRule: "默认",
    testEvidence: "cn.crazyrouter.com 实测证据",
    testEvidenceNote:
      "公开接口检查不使用密钥；模型列表检查使用本地 CRAZYROUTER_API_KEY，但页面不会暴露密钥。付费生成测试需要单独执行。",
    check: "检查项",
    request: "请求",
    status: "状态",
    result: "结果",
    implementationExamples: "接入示例",
    faq: "常见问题",
    docsAlignment: "相关文档",
    relatedPages: "相关中文指南",
    namespaceTitle: "统一路由命名空间",
    namespaceBody:
      "本 SEO 项目公开页面使用 /guide/* 和 /zh/guide/* 路径，不占用 CrazyRouter Tools 已有的 /tools/* 入口。"
  }
};

function docUrlFromRef(ref: string) {
  const path = ref
    .replace(/^crazyrouter-docs\//, "")
    .replace(/\.mdx$/, "")
    .replace(/\\/g, "/");

  return `https://docs.crazyrouter.com/${path}`;
}

function docLabelFromRef(ref: string, locale: PageLocale) {
  const labels: Record<string, { en: string; zh: string }> = {
    "crazyrouter-docs/images/gpt-image.mdx": {
      en: "GPT Image docs",
      zh: "GPT Image 文档"
    },
    "crazyrouter-docs/api-endpoint.mdx": {
      en: "API endpoint docs",
      zh: "API 接入地址"
    },
    "crazyrouter-docs/llms-guide.mdx": {
      en: "llms.txt guide",
      zh: "llms.txt 文档索引"
    }
  };

  const mapped = labels[ref]?.[locale];
  if (mapped) {
    return mapped;
  }

  return ref
    .replace(/^crazyrouter-docs\//, "")
    .replace(/\.mdx$/, "")
    .replace(/[-/]/g, " ");
}

function endpointText(endpointType: string | undefined) {
  if (!endpointType) {
    return undefined;
  }

  const endpoint = getEndpointPath(endpointType);
  return endpoint ? `${endpoint.method} ${endpoint.path}` : endpointType;
}

export function SeoPageTemplate({ page, locale = "en", pages = seoPages }: SeoPageTemplateProps) {
  const copy = templateCopy[locale];
  const relatedPages = page.related
    .map((slug) => pages.find((item) => item.slug === slug))
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
              {copy.docsSource}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <span className="text-sm text-muted">
              {copy.updated} {page.updatedAt}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_330px]">
        <article className="space-y-8">
          <section className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ink">{copy.searchIntent}</h2>
            <p className="mt-4 leading-8 text-muted">{page.intent}</p>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted">{copy.primaryKeyword}</dt>
                <dd className="mt-1 text-lg font-semibold text-ink">{page.primaryKeyword}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted">{copy.secondaryKeywords}</dt>
                <dd className="mt-1 text-sm leading-6 text-ink">{page.secondaryKeywords.join(", ")}</dd>
              </div>
            </dl>
          </section>

          {pricing.length ? (
            <section className="rounded-lg border border-line bg-white p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">{copy.pricingModels}</h2>
                  <p className="mt-2 leading-7 text-muted">
                    {copy.pricingSource} {pricingUpdatedAt}.
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
                      <div>
                        {copy.billing}: {item.billingMode}
                      </div>
                      <div>
                        {copy.publicEndpoints}: {item.publicEndpointTypes.join(", ") || copy.none}
                      </div>
                      <div>
                        {copy.supportedEndpoints}: {item.supportedEndpointTypes.join(", ") || copy.none}
                      </div>
                      {item.rule ? (
                        <div>
                          {copy.rule}: {item.rule.capability || copy.defaultRule}
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

          {page.calculatorPresets ? <CostCalculator presets={page.calculatorPresets} locale={locale} /> : null}

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
                {copy.testEvidence}
              </h2>
              <p className="mt-3 leading-7 text-muted">
                {copy.testEvidenceNote}
              </p>
              <div className="mt-5 overflow-hidden rounded-lg border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-panel text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">{copy.check}</th>
                      <th className="px-4 py-3 font-medium">{copy.request}</th>
                      <th className="px-4 py-3 font-medium">{copy.status}</th>
                      <th className="px-4 py-3 font-medium">{copy.result}</th>
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
                {copy.implementationExamples}
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
            <h2 className="text-2xl font-semibold text-ink">{copy.faq}</h2>
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
            <h2 className="text-base font-semibold text-ink">{copy.docsAlignment}</h2>
            <div className="mt-4 space-y-3">
              {page.docsRefs.map((ref) => (
                <a
                  key={ref}
                  href={docUrlFromRef(ref)}
                  className="block rounded-md border border-line bg-panel p-3 text-xs leading-5 text-muted hover:border-brand hover:text-ink"
                >
                  <span className="flex items-center gap-2 font-semibold text-ink">
                    {docLabelFromRef(ref, locale)}
                    <ExternalLink size={12} aria-hidden="true" />
                  </span>
                  <span className="mt-1 block break-words">{docUrlFromRef(ref)}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-base font-semibold text-ink">{copy.relatedPages}</h2>
            <div className="mt-4 space-y-3">
              {relatedPages.map((related) => (
                <Link
                  key={related.slug}
                  href={getPagePath(related, locale)}
                  className="block rounded-md border border-line p-3 text-sm font-medium text-ink hover:border-brand"
                >
                  {related.h1}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-ink p-5 text-white">
            <h2 className="font-semibold">{copy.namespaceTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {copy.namespaceBody}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
