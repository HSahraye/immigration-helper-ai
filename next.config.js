/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for static generation
  output: 'standalone',
  
  // Set the output directory
  distDir: '.next',
  
  // Configure routes for App Router project
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Basic configuration
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
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['react', 'react-dom', 'next-auth'],
  },
  // Only transpile packages that are not in serverComponentsExternalPackages
  transpilePackages: [],
  // Extreme measures to ignore TypeScript errors
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  // Disable ESLint completely
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true, // Enable SWC minification
  
  // Disable source maps
  productionBrowserSourceMaps: false,
  compiler: {
    // Support styled-components
    styledComponents: true,
    // Ignore all TypeScript errors
    reactRemoveProperties: { properties: ['^data-test'] },
  },
  webpack: (config, { isServer }) => {
    // Skip optimization passes
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
      };
    }
    
    // More aggressive optimizations
    config.optimization.minimize = true;
    
    // Make sure TypeScript doesn't cause issues
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
    
    // Fix @ path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    
    return config;
  }
}

module.exports = nextConfig 