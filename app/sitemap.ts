import type { MetadataRoute } from "next";
import { directoryLanguageAlternates, directoryLocales, directoryPages } from "@/content/for-directories";
import { getPagePath, seoPages } from "@/content/seo-pages";
import { zhSeoPages } from "@/content/seo-pages.zh";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/zh/guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...directoryLocales.map((locale) => ({
      url: `${siteConfig.url}${directoryPages[locale].path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(directoryLanguageAlternates).map(([lang, path]) => [lang, `${siteConfig.url}${path}`])
        )
      }
    })),
    ...seoPages.map((page) => ({
      url: `${siteConfig.url}${getPagePath(page)}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: "weekly" as const,
      priority: page.kind === "comparison" || page.kind === "alternative" ? 0.9 : 0.8
    })),
    ...zhSeoPages.map((page) => ({
      url: `${siteConfig.url}${getPagePath(page, "zh")}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: "weekly" as const,
      priority: page.kind === "comparison" || page.kind === "alternative" ? 0.9 : 0.8
    }))
  ];
}
