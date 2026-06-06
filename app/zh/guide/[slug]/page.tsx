import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPagePath } from "@/content/seo-pages";
import { findZhPageBySlug, zhSeoPages } from "@/content/seo-pages.zh";
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
  return zhSeoPages.map((page) => ({
    slug: page.slug
  }));
}

export function generateMetadata({ params }: PageParams): Metadata {
  const page = findZhPageBySlug(params.slug);

  if (!page) {
    return {};
  }

  const path = getPagePath(page, "zh");
  const enPath = getPagePath(page, "en");

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path,
      languages: {
        en: enPath,
        "zh-CN": path
      }
    },
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteConfig.url}${path}`,
      type: "article",
      locale: "zh_CN"
    }
  };
}

export default function ZhGuidePage({ params }: PageParams) {
  const page = findZhPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(page, "zh")} />
      <JsonLd data={faqJsonLd(page)} />
      <JsonLd data={softwareJsonLd(page)} />
      <SeoPageTemplate page={page} locale="zh" pages={zhSeoPages} />
    </>
  );
}
