/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'm.media-amazon.com', 'images-na.ssl-images-amazon.com'],
    unoptimized: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/generate-excel',
        destination: 'http://localhost:8000/generate-excel',
      },
    ];
  },
};

module.exports = nextConfig;
