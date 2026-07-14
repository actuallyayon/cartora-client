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
};

export default nextConfig;
