import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  // Explicitly opt-in to the App Router
  experimental: {
    serverComponentsExternalPackages: [], // Add any packages that need to be external here
    optimizeCss: true,
  },
  poweredByHeader: false,
  // Improve output tracing for better deployments
  output: 'standalone',
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
