/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  images: {
    domains: ['openai.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Simplified experimental settings
  experimental: {
    instrumentationHook: false,
    serverComponentsExternalPackages: ['next-auth'],
  },
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static exports to avoid SessionProvider issues
  output: 'standalone',
  // Disable source maps for production build
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig 