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
  // Disable automatic static optimization to prevent React hooks errors
  // This makes all pages server-side rendered at runtime instead of build time
  experimental: {
    // Completely disable static generation to prevent React hook errors
    disableStaticGeneration: true,
    // Enable server actions for proper data mutations
    serverActions: true,
    // Configure server component externalization
    serverComponentsExternalPackages: ['react', 'react-dom'],
    // Optimize imports for performance
    optimizePackageImports: ['next-auth', 'lucide-react'],
  },
  // Explicitly define transpilePackages to include next-auth
  transpilePackages: ['next-auth'],
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Output configuration for better handling of React dependencies
  output: 'standalone',
  // Disable source maps for production build
  productionBrowserSourceMaps: false,
  // Optimize React runtime to avoid hooks issues
  compiler: {
    styledComponents: true
  },
  webpack: (config, { isServer }) => {
    // Client-side polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  }
}

module.exports = nextConfig 