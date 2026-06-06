import { siteConfig } from "@/lib/site";
import { getPagePath, type SeoPage } from "@/content/seo-pages";

export function breadcrumbJsonLd(page: SeoPage) {
  const path = getPagePath(page);
  const section = path.split("/")[1];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url
      },
      {
        "@type": "ListItem",
        position: 2,
        name: section,
        item: `${siteConfig.url}/${section}`
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
