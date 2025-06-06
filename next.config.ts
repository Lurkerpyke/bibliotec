import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: '/**',
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
