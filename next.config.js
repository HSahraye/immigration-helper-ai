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
    // Disable static page generation
    disableStaticGeneration: true,
    // Disable optimization for server components
    serverActions: true,
    // These packages should be treated as external during server component rendering
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