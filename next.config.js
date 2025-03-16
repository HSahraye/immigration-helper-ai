/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  publicRuntimeConfig: {
    // Add any public runtime configs here if needed
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Ensure images from OpenAI are properly handled
  images: {
    domains: ['openai.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable the standalone output mode as it might be causing issues
  // output: 'standalone',
  
  // More comprehensive experimental settings
  experimental: {
    // Disable client-side instrumentation
    instrumentationHook: false,
    // Disable app directory grouping features that might cause issues
    appDir: true,
    serverComponentsExternalPackages: ['next-auth'],
    // Disable the new Next.js compiler for better compatibility
    swcMinify: false,
  },
  
  // Webpack configuration to handle potential issues
  webpack: (config, { isServer }) => {
    // Fix for the (tabs) directory issue
    if (isServer) {
      config.optimization.moduleIds = 'named';
    }
    return config;
  },
  
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 