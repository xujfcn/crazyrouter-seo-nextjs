import type { Metadata } from "next";
import Link from "next/link";
import { getPagePath } from "@/content/seo-pages";
import { zhSeoPages } from "@/content/seo-pages.zh";

export const metadata: Metadata = {
  title: "CrazyRouter API 中文指南",
  description: "CrazyRouter 模型 API、竞品对比和成本计算器中文指南，包含当前价格数据和文档示例。",
  alternates: {
    canonical: "/zh/guide",
    languages: {
      en: "/guide",
      "zh-CN": "/zh/guide"
    }
  }
};

export default function ZhGuideIndexPage() {
  return (
    <main>
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="text-sm font-semibold uppercase tracking-wide text-brand">中文指南中心</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            CrazyRouter API 中文指南
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            查看模型接入方式、复制标准模型名、核对 API 端点，并在创建 API Key 前估算图片和视频模型成本。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {zhSeoPages.map((page) => (
            <Link
              key={page.slug}
              href={getPagePath(page, "zh")}
              className="rounded-lg border border-line bg-white p-6 hover:border-brand"
            >
              <div className="text-sm font-semibold uppercase tracking-wide text-brand">{page.kind}</div>
              <h2 className="mt-3 text-xl font-semibold text-ink">{page.h1}</h2>
              <p className="mt-2 leading-7 text-muted">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
