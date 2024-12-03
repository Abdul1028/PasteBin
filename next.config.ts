import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Only run ESLint on local development
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
