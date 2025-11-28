/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración de imágenes optimizada
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-eu.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'yiudpmbwtipjbtshmugw.supabase.co',
      },
    ],
    // Usar optimización remota cuando sea posible
    unoptimized: false,
    // Formatos modernos para mejor rendimiento
    formats: ['image/avif', 'image/webp'],
    // Tamaños comunes para responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache de imágenes optimizado
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },
  
  // Comprimir respuestas
  compress: true,
  
  // Mejor manejo de errores en producción
  productionBrowserSourceMaps: false,
  
  // Optimización de builds
  swcMinify: true,
  
  // Experimental: Optimizaciones de rendimiento
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/generate-excel',
        destination: 'http://localhost:8000/generate-excel',
      },
    ];
  },
  
  // Headers para mejor caché
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
