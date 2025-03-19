/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side rendering
  reactStrictMode: false,
  swcMinify: false,
  experimental: {
    serverComponents: true,
    serverActions: true,
  },
  // Configure images
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // TypeScript and ESLint settings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Skip optimization passes
    config.optimization.minimize = false;
    config.optimization.minimizer = [];
    
    // Handle TypeScript
    config.module.rules.push({
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    });

    return config;
  },
  // API route configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Skip API routes during static export
  output: 'standalone',
}

export default nextConfig 