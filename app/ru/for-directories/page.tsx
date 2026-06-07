import type { Metadata } from "next";
import { ForDirectoriesTemplate } from "@/components/for-directories-template";
import { directoryLanguageAlternates, directoryPages } from "@/content/for-directories";
import { siteConfig } from "@/lib/site";

const page = directoryPages.ru;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: {
    canonical: page.path,
    languages: directoryLanguageAlternates
  },
  openGraph: {
    title: page.title,
    description: page.ogDescription,
    url: `${siteConfig.url}${page.path}`,
    type: "website",
    locale: "ru_RU"
  }
};

export default function RuForDirectoriesPage() {
  return <ForDirectoriesTemplate page={page} />;
}
