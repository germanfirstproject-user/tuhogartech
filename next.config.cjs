/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración de imágenes optimizada
  images: {
    domains: [
      'placeholder.com', 
      'm.media-amazon.com', 
      'images-na.ssl-images-amazon.com',
      'images-eu.ssl-images-amazon.com',
      'images-amazon.com'
    ],
    // Usar optimización remota cuando sea posible
    unoptimized: false,
    // Formatos modernos para mejor rendimiento
    formats: ['image/avif', 'image/webp'],
    // Tamaños comunes para responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Comprimir respuestas
  compress: true,
  
  // Mejor manejo de errores en producción
  productionBrowserSourceMaps: false,
  
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
