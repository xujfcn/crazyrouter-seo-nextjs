import type { Metadata } from "next";
import { ForDirectoriesTemplate } from "@/components/for-directories-template";
import { directoryLanguageAlternates, directoryPages } from "@/content/for-directories";
import { siteConfig } from "@/lib/site";

const page = directoryPages.vi;

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
    locale: "vi_VN"
  }
};

export default function ViForDirectoriesPage() {
  return <ForDirectoriesTemplate page={page} />;
}
