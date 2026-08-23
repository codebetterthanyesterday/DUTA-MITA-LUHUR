import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const slug = process.env.ADMIN_ROUTE_SLUG;
    if (!slug) {
      throw new Error("ADMIN_ROUTE_SLUG must be set in the environment");
    }
    return [
      { source: `/${slug}`, destination: "/admin" },
      { source: `/${slug}/:path*`, destination: "/admin/:path*" },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
