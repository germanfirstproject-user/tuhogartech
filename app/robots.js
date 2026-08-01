export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          // Zona privada: no hay nada que indexar y consume rastreo.
          '/login',
          '/profile',
          '/generar-excel',
          // Resultados de búsqueda: contenido duplicado y combinaciones
          // infinitas de parámetros.
          '/buscar',
        ],
      },
    ],
    sitemap: 'https://tuhogartech.com/sitemap.xml',
  };
}
