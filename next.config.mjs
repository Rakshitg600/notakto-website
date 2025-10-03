/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Commented out for Windows build compatibility
  images: {
    unoptimized: false,
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  compress: true,
  webpack: (config, { isServer, dev }) => {
    return config;
  },
};

export default nextConfig;
