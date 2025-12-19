import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Allow any image source
  },
};

export default nextConfig;
