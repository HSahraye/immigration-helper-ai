/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for server-side rendering
  reactStrictMode: true,
  
  // Set the output directory
  distDir: '.next',
  
  // Configure routes for App Router project
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Basic configuration
  images: {
    domains: ['openai.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Disable source maps
  productionBrowserSourceMaps: false,
  
  compiler: {
    // Support styled-components
    styledComponents: true,
    // Remove test properties
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