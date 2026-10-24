import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dzp70azv3/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  compress: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'dilawarali.com' }],
        destination: 'https://renderline.pk/:path*',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
