import { siteConfig } from "@/lib/site";
import { getPagePath, type PageLocale, type SeoPage } from "@/content/seo-pages";

export function breadcrumbJsonLd(page: SeoPage, locale: PageLocale = "en") {
  const path = getPagePath(page, locale);
  const guidePath = locale === "zh" ? "/zh/guide" : "/guide";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "zh" ? "首页" : "Home",
        item: siteConfig.url
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "zh" ? "指南" : "Guide",
        item: `${siteConfig.url}${guidePath}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.h1,
        item: `${siteConfig.url}${path}`
      }
    ]
  };
}

export function faqJsonLd(page: SeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function softwareJsonLd(page: SeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page.h1,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly"
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    }
  };
}
