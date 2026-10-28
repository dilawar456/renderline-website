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
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Content-Security-Policy', value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'" },
      ] },
      ...['/api/:path*', '/portal/:path*', '/admin.html', '/admin'].map(source => ({ source, headers: [
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'Cache-Control', value: 'private, no-store' },
      ] })),
    ];
  },
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
