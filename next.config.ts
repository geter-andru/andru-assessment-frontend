import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No explicit output mode - let Netlify's OpenNext adapter handle deployment type
  // Removed 'standalone' (added Sept 30) - caused 19 consecutive build failures
  // Netlify expects standard Next.js output structure, not standalone's nested structure
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  // Performance optimizations for enterprise-grade experience
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'recharts', 'react-circular-progressbar'],
  },
  // Enable static optimization
  generateEtags: false,
  // Optimize for production deployment
  compress: true,
  poweredByHeader: false,
  // Professional error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // API proxy configuration for backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
  // Environment variables for frontend
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

export default nextConfig;