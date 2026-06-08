/** @type {import('next').NextConfig} */
const assetPrefix =
  process.env.NEXT_PUBLIC_ASSET_PREFIX ||
  (process.env.NODE_ENV === "production" ? "/guide-assets" : "");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  assetPrefix,
  async rewrites() {
    return [
      {
        source: "/guide-assets/_next/:path*",
        destination: "/_next/:path*"
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/guide/crazyrouter-vs-apimart",
        destination: "/guide/ai-api-platform-comparison",
        permanent: true
      },
      {
        source: "/guide/apimart-ai-alternative",
        destination: "/guide/ai-api-platform-comparison",
        permanent: true
      },
      {
        source: "/zh/guide/crazyrouter-vs-apimart",
        destination: "/zh/guide/ai-api-platform-comparison",
        permanent: true
      },
      {
        source: "/zh/guide/apimart-ai-alternative",
        destination: "/zh/guide/ai-api-platform-comparison",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
