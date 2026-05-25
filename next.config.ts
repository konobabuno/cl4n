import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [90],
    minimumCacheTTL: 2678400,
    deviceSizes: [375, 640, 768, 1080, 1280, 1536, 1920, 2880],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;