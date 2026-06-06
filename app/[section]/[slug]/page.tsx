import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  findPage,
  getPagePath,
  pageKindPath,
  seoPages,
  type PageKind
} from "@/content/seo-pages";
import { JsonLd } from "@/components/json-ld";
import { SeoPageTemplate } from "@/components/seo-page-template";
import { siteConfig } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, softwareJsonLd } from "@/lib/structured-data";

const pathToKind = Object.fromEntries(
  Object.entries(pageKindPath).map(([kind, path]) => [path, kind])
) as Record<string, PageKind>;

type PageParams = {
  params: {
    section: string;
    slug: string;
  };
};

export function generateStaticParams() {
  return seoPages.map((page) => {
    const [, section] = getPagePath(page).split("/");
    return {
      section,
      slug: page.slug
    };
  });
}

export function generateMetadata({ params }: PageParams): Metadata {
  const kind = pathToKind[params.section];
  const page = kind ? findPage(kind, params.slug) : undefined;

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

export default function SeoDynamicPage({ params }: PageParams) {
  const kind = pathToKind[params.section];
  const page = kind ? findPage(kind, params.slug) : undefined;

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
