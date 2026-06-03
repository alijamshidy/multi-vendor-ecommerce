import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
    unoptimized: true,
  },
};

export default nextConfig;
