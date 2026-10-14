import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // رفع صور المنتجات من لوحة التحكم (حتى 4 ميغابايت للصورة)
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
