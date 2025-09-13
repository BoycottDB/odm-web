import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

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

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: true
  },
  disableLogger: true,
  automaticVercelMonitors: false
});
