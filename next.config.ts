import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // يقبل الرابط المكتوب /manger ويحوّله إلى لوحة التحكم
  async redirects() {
    return [
      { source: "/manger", destination: "/manager", permanent: false },
      { source: "/manger/:path*", destination: "/manager/:path*", permanent: false },
    ];
  },
  experimental: {
    // رفع صور المنتجات من لوحة التحكم (حتى 4 ميغابايت للصورة)
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
