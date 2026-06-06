import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-muted md:grid-cols-4">
        <div>
          <div className="font-semibold text-ink">CrazyRouter</div>
          <p className="mt-2">Docs-aligned AI API guide pages under one /guide namespace.</p>
        </div>
        <div>
          <div className="font-semibold text-ink">Models</div>
          <Link href="/guide/gpt-image-2-api" className="mt-2 block hover:text-ink">
            GPT Image 2 API
          </Link>
          <Link href="/guide/veo-3-1-api" className="mt-2 block hover:text-ink">
            Veo 3.1 API
          </Link>
        </div>
        <div>
          <div className="font-semibold text-ink">Compare</div>
          <Link href="/guide/crazyrouter-vs-apimart" className="mt-2 block hover:text-ink">
            CrazyRouter vs Apimart
          </Link>
          <Link href="/guide/apimart-ai-alternative" className="mt-2 block hover:text-ink">
            Apimart Alternative
          </Link>
        </div>
        <div>
          <div className="font-semibold text-ink">Calculator</div>
          <Link href="/guide/ai-api-cost-calculator" className="mt-2 block hover:text-ink">
            AI API Cost Calculator
          </Link>
        </div>
      </div>
    </footer>
  );
}
