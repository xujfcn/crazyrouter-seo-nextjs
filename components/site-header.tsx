import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-semibold text-ink">
          CrazyRouter SEO
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/models/sora-api" className="hover:text-ink">
            Models
          </Link>
          <Link href="/pricing/sora-api-price" className="hover:text-ink">
            Pricing
          </Link>
          <Link href="/compare/crazyrouter-vs-apimart" className="hover:text-ink">
            Compare
          </Link>
          <Link href="/tools/ai-api-cost-calculator" className="hover:text-ink">
            Tools
          </Link>
        </nav>
        <a
          href="https://crazyrouter.com"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          Main Site
        </a>
      </div>
    </header>
  );
}
