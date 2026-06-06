import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
