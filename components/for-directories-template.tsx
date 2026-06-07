import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { JsonLd } from "@/components/json-ld";
import type { DirectoryPageContent } from "@/content/for-directories";
import { directoryLanguageAlternates } from "@/content/for-directories";
import { siteConfig } from "@/lib/site";

function CopyBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold uppercase tracking-wide text-brand">{title}</div>
        <CopyButton text={text} />
      </div>
      <p className="mt-3 leading-7 text-muted">{text}</p>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-sm font-semibold uppercase tracking-wide text-brand">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-semibold text-ink">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function localizedAlternates() {
  return Object.entries(directoryLanguageAlternates).map(([label, href]) => ({
    label,
    href
  }));
}

export function ForDirectoriesTemplate({ page }: { page: DirectoryPageContent }) {
  const pageUrl = `${siteConfig.url}${page.path}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: page.title,
        url: pageUrl,
        description: page.description,
        inLanguage: page.htmlLang
      },
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        sameAs: [siteConfig.url]
      },
      {
        "@type": "SoftwareApplication",
        name: "Crazyrouter",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description: page.descriptions.short,
        url: siteConfig.url,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <section className="border-b border-line bg-panel">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
            <div className="text-sm font-semibold uppercase tracking-wide text-brand">{page.eyebrow}</div>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{page.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://crazyrouter.com/register" className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white">
                {page.registerLabel}
              </a>
              <a href="https://crazyrouter.com/docs" className="rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink">
                {page.docsLabel}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {localizedAlternates().map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-md border px-3 py-2 ${
                    item.href === page.path
                      ? "border-brand bg-white font-semibold text-brand"
                      : "border-line bg-white text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Section eyebrow={page.copyDescriptionsEyebrow} title={page.copyDescriptionsTitle}>
          <div className="grid gap-4 md:grid-cols-3">
            <CopyBlock title={page.descriptionLabels.short} text={page.descriptions.short} />
            <CopyBlock title={page.descriptionLabels.medium} text={page.descriptions.medium} />
            <CopyBlock title={page.descriptionLabels.long} text={page.descriptions.long} />
          </div>
        </Section>

        <Section eyebrow={page.metadataEyebrow} title={page.metadataTitle}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-xl font-semibold text-ink">{page.categoriesTitle}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.categories.map((category) => (
                  <span key={category} className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm text-ink">
                    {category}
                    <CopyButton text={category} label="Copy" />
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-xl font-semibold text-ink">{page.anchorsTitle}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.anchors.map((anchor) => (
                  <span key={anchor} className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm text-ink">
                    {anchor}
                    <CopyButton text={anchor} label="Copy" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={page.linksEyebrow} title={page.linksTitle}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-xl font-semibold text-ink">{page.coreLinksTitle}</h3>
              <div className="mt-4 space-y-3">
                {page.officialLinks.map(([label, href]) => (
                  <div key={label} className="flex flex-col gap-1 border-b border-line pb-3 last:border-b-0 last:pb-0">
                    <span className="text-sm font-semibold text-ink">{label}</span>
                    {href.startsWith("/") ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={href} className="break-all text-sm text-brand hover:text-ink">
                          {`${siteConfig.url}${href}`}
                        </Link>
                        <CopyButton text={`${siteConfig.url}${href}`} />
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <a href={href} className="break-all text-sm text-brand hover:text-ink">
                          {href}
                        </a>
                        <CopyButton text={href} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-xl font-semibold text-ink">{page.targetPagesTitle}</h3>
              <div className="mt-4 space-y-3">
                {page.targetPages.map(([label, href]) => (
                  <div key={label} className="flex flex-col gap-1 border-b border-line pb-3 last:border-b-0 last:pb-0">
                    <span className="text-sm font-semibold text-ink">{label}</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <a href={href} className="break-all text-sm text-brand hover:text-ink">
                        {href}
                      </a>
                      <CopyButton text={href} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={page.technicalEyebrow} title={page.technicalTitle}>
          <div className="grid gap-4 md:grid-cols-3">
            {page.technicalCards.map((card) => (
              <div key={card.title} className="rounded-lg border border-line bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-ink">{card.title}</h3>
                  <CopyButton text={card.text} />
                </div>
                <p className="mt-3 leading-7 text-muted">{card.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow={page.faqEyebrow} title={page.faqTitle}>
          <div className="grid gap-4 md:grid-cols-2">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-line bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">{faq.question}</h3>
                  <CopyButton text={`${faq.question}\n\n${faq.answer}`} />
                </div>
                <p className="mt-3 leading-7 text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}
