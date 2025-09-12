import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration Netlify
  trailingSlash: false,
  
  // Headers personnalisés (si nécessaire)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },

  // Configuration PWA (si applicable)
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  }
};

export default nextConfig;
