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
  // Fix for Vercel deployment
  output: 'standalone',
  experimental: {
    // Disable client-side instrumentation
    instrumentationHook: false,
  },
}

module.exports = nextConfig 