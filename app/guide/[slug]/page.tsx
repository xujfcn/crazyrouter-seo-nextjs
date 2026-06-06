import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findPageBySlug, getPagePath, seoPages } from "@/content/seo-pages";
import { JsonLd } from "@/components/json-ld";
import { SeoPageTemplate } from "@/components/seo-page-template";
import { siteConfig } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, softwareJsonLd } from "@/lib/structured-data";

type PageParams = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return seoPages.map((page) => ({
    slug: page.slug
  }));
}

export function generateMetadata({ params }: PageParams): Metadata {
  const page = findPageBySlug(params.slug);

  if (!page) {
    return {};
  }

  const path = getPagePath(page);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path
    },
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteConfig.url}${path}`,
      type: "article"
    }
  };
}

export default function GuidePage({ params }: PageParams) {
  const page = findPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(page)} />
      <JsonLd data={faqJsonLd(page)} />
      <JsonLd data={softwareJsonLd(page)} />
      <SeoPageTemplate page={page} />
    </>
  );
}
