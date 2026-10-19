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

  // Anciennes pages de la FAQ, regroupées sur /faq (liens partagés, référencement, textes d'impact en base)
  async redirects() {
    return [
      { source: '/faq/pourquoi', destination: '/faq#a-quoi-ca-sert', permanent: true },
      { source: '/faq/alternatives', destination: '/faq#alternatives', permanent: true },
      { source: '/faq/argent', destination: '/faq#argent', permanent: true },
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
