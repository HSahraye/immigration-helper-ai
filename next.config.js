/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for server-side rendering
  reactStrictMode: true,
  
  // Set the output directory
  output: 'standalone',
  
  // Configure routes for App Router project
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Basic configuration
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Disable source maps
  productionBrowserSourceMaps: false,
  
  // Compiler options
  compiler: {
    styledComponents: true,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    return config
  }
}

module.exports = nextConfig