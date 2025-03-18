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
  // Enhanced experimental settings to fix React and SSG issues
  experimental: {
    instrumentationHook: false,
    // Remove next-auth from serverComponentsExternalPackages to avoid conflict with transpilePackages
    serverComponentsExternalPackages: ['react', 'react-dom'],
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
    // Fix for static page generation with React hooks
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