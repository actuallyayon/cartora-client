import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Product images are hosted on ImgBB.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: '*.ibb.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (isDev ? 'http://localhost:5000' : 'https://cartora-server.vercel.app');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
