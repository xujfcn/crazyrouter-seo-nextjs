import type { Metadata } from "next";
import { ForDirectoriesTemplate } from "@/components/for-directories-template";
import { directoryLanguageAlternates, directoryPages } from "@/content/for-directories";
import { siteConfig } from "@/lib/site";

const page = directoryPages.en;

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
    locale: "en_US"
  }
};

export default function ForDirectoriesPage() {
  return <ForDirectoriesTemplate page={page} />;
}
