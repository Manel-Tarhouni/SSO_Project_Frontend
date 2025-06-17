import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: ["localhost"],
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
