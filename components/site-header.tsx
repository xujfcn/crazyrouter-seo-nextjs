"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh/");

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href={isZh ? "/zh/guide" : "/"} className="text-lg font-semibold text-ink">
          {isZh ? "CrazyRouter 中文指南" : "CrazyRouter Guides"}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href={isZh ? "/zh/guide/gpt-image-2-api" : "/guide/gpt-image-2-api"} className="hover:text-ink">
            {isZh ? "模型" : "Models"}
          </Link>
          <Link href={isZh ? "/zh/guide/ai-api-cost-calculator" : "/guide/ai-api-cost-calculator"} className="hover:text-ink">
            {isZh ? "计算器" : "Calculator"}
          </Link>
          <Link href={isZh ? "/zh/guide/ai-api-platform-comparison" : "/guide/ai-api-platform-comparison"} className="hover:text-ink">
            {isZh ? "替代方案" : "Alternatives"}
          </Link>
          <Link href={isZh ? "/guide" : "/zh/guide"} className="hover:text-ink">
            {isZh ? "English" : "中文"}
          </Link>
        </nav>
        <a
          href="https://crazyrouter.com"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          {isZh ? "主站" : "Main Site"}
        </a>
      </div>
    </header>
  );
}
