"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh/");

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-muted md:grid-cols-4">
        <div>
          <div className="font-semibold text-ink">Crazyrouter</div>
          <p className="mt-2">
            {isZh
              ? "Crazyrouter AI API 中文指南，覆盖模型接入、平台替代方案和成本估算。"
              : "Crazyrouter AI API guides for model access, platform comparisons, and cost planning."}
          </p>
        </div>
        <div>
          <div className="font-semibold text-ink">{isZh ? "指南入口" : "Guide Hub"}</div>
          <Link href={isZh ? "/zh/guide" : "/guide"} className="mt-2 block hover:text-ink">
            {isZh ? "全部中文指南" : "All Guides"}
          </Link>
          <Link href={isZh ? "/zh/guide/gpt-image-2-api" : "/guide/gpt-image-2-api"} className="mt-2 block hover:text-ink">
            {isZh ? "GPT Image 2 API 中文指南" : "GPT Image 2 API"}
          </Link>
          <Link href={isZh ? "/zh/guide/veo-3-1-api" : "/guide/veo-3-1-api"} className="mt-2 block hover:text-ink">
            {isZh ? "Veo 3.1 API 中文指南" : "Veo 3.1 API"}
          </Link>
        </div>
        <div>
          <div className="font-semibold text-ink">{isZh ? "替代方案" : "Alternatives"}</div>
          <Link href={isZh ? "/zh/guide/ai-api-platform-comparison" : "/guide/ai-api-platform-comparison"} className="mt-2 block hover:text-ink">
            {isZh ? "AI API 平台替代方案" : "AI API Platform Alternatives"}
          </Link>
          <Link href={isZh ? "/zh/guide/fal-ai-alternative" : "/guide/fal-ai-alternative"} className="mt-2 block hover:text-ink">
            {isZh ? "fal.ai 替代方案" : "fal.ai Alternative"}
          </Link>
          <Link href={isZh ? "/zh/guide/replicate-alternative" : "/guide/replicate-alternative"} className="mt-2 block hover:text-ink">
            {isZh ? "Replicate 替代方案" : "Replicate Alternative"}
          </Link>
        </div>
        <div>
          <div className="font-semibold text-ink">{isZh ? "计算器" : "Calculator"}</div>
          <Link href={isZh ? "/zh/guide/ai-api-cost-calculator" : "/guide/ai-api-cost-calculator"} className="mt-2 block hover:text-ink">
            {isZh ? "AI API 成本计算器" : "AI API Cost Calculator"}
          </Link>
          <Link href={isZh ? "/guide" : "/zh/guide"} className="mt-2 block hover:text-ink">
            {isZh ? "English Guides" : "中文指南"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
