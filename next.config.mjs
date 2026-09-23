/**
 * Hasta el 23-09-2026 este fichero se llamaba `next.config.cjs` y **Next no lo
 * leía**: la lista de nombres admitidos es solo `next.config.js` y
 * `next.config.mjs` (`CONFIG_FILES` en `next/dist/shared/lib/constants.js`).
 * Así que nada de lo de aquí estaba activo. Se pasa a `.mjs` porque el
 * `package.json` declara `"type": "module"` y un `.js` con `module.exports`
 * fallaría al cargarse.
 *
 * Al activarlo por primera vez hay que saber qué se enciende:
 * - `images.remotePatterns` no cambia nada hoy, porque el sitio no usa
 *   `next/image` en ninguna página; las fotos van con `<img>` normal.
 * - `experimental.optimizeCss` se ha quitado: necesita el paquete `critters`,
 *   que no está instalado, y con la opción puesta el build falla. Nunca llegó a
 *   funcionar, así que quitarlo no cambia el comportamiento actual.
 *
 * @type {import('next').NextConfig}
 */
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
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  /* La antigua /productos pasa a /resenas. Las dos rutas estaban indexadas, así
     que el salto tiene que ser permanente (308) para que el buscador traslade
     la autoridad en vez de repartirla entre las dos direcciones.

     /productos/{slug} nunca fue canónica: era una página que solo llamaba a
     redirect() hacia /categoria/{slug}, lo que devolvía un 307 temporal y
     además obligaba a consultar la base de datos en cada visita. Aquí se
     resuelve sin tocar el servidor y con el código correcto. */
  async redirects() {
    return [
      { source: '/productos', destination: '/resenas', permanent: true },
      { source: '/productos/:category', destination: '/categoria/:category', permanent: true },
    ];
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

export default nextConfig;
