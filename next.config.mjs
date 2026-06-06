/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
