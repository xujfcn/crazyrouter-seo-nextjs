import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-muted md:grid-cols-4">
        <div>
          <div className="font-semibold text-ink">CrazyRouter</div>
          <p className="mt-2">SEO page system for AI model API, pricing, comparison, and tools.</p>
        </div>
        <div>
          <div className="font-semibold text-ink">Models</div>
          <Link href="/models/sora-api" className="mt-2 block hover:text-ink">
            Sora API
          </Link>
          <Link href="/models/gpt-image-1-api" className="mt-2 block hover:text-ink">
            GPT Image 1 API
          </Link>
        </div>
        <div>
          <div className="font-semibold text-ink">Compare</div>
          <Link href="/compare/crazyrouter-vs-apimart" className="mt-2 block hover:text-ink">
            CrazyRouter vs Apimart
          </Link>
          <Link href="/alternatives/apimart-ai-alternative" className="mt-2 block hover:text-ink">
            Apimart Alternative
          </Link>
        </div>
        <div>
          <div className="font-semibold text-ink">Tools</div>
          <Link href="/tools/ai-api-cost-calculator" className="mt-2 block hover:text-ink">
            AI API Cost Calculator
          </Link>
        </div>
      </div>
    </footer>
  );
}
