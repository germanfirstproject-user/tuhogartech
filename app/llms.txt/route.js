import { getCategories, getCategoriesWithCounts, getBlogs } from '@/lib/supabase';

/**
 * /llms.txt — índice del sitio en Markdown para modelos de lenguaje.
 *
 * La propuesta (llmstxt.org) es dar a un modelo, en un solo archivo y sin
 * navegar, qué es el sitio y dónde está cada cosa. Aquí importa más que en un
 * sitio cualquiera: buena parte de las visitas futuras vendrán de respuestas
 * generadas, y conviene que quien las genere sepa que esto es una web de
 * afiliación con opiniones propias, no una tienda.
 *
 * Se genera desde la base de datos en vez de mantenerse a mano para que no
 * envejezca en cuanto se publique un artículo o se añada una categoría.
 */

const BASE = 'https://tuhogartech.com';

// Una hora, igual que el sitemap: es un índice, no contenido vivo.
export const revalidate = 3600;

/** Markdown no distingue, pero un ] suelto rompe el enlace. */
function limpiar(texto = '') {
  return String(texto).replace(/\s+/g, ' ').replace(/[\[\]]/g, '').trim();
}

export async function GET() {
  let categorias = [];
  let articulos = [];

  // Si la base de datos no responde, el archivo sale igual con la parte fija:
  // vale más un índice incompleto que un 500 delante de un rastreador.
  try {
    // getCategoriesWithCounts() solo devuelve nombre, slug e imagen; la
    // descripción y el is_active están en la fila completa. Se piden las dos
    // cosas y se cruzan por slug.
    const [catsRes, contadosRes, blogsRes] = await Promise.all([
      getCategories(),
      getCategoriesWithCounts(),
      getBlogs({ status: 'published' }, 0),
    ]);

    if (catsRes.success) {
      const conteo = new Map(
        (contadosRes.success ? contadosRes.data : []).map((c) => [c.slug, c.count])
      );

      categorias = catsRes.data
        .map((c) => ({ ...c, count: conteo.get(c.slug) || 0 }))
        .filter((c) => c.is_active !== false && c.count > 0)
        .sort((a, b) => b.count - a.count);
    }

    if (blogsRes.success) {
      articulos = blogsRes.data
        .filter((b) => b.status === 'published')
        .sort(
          (a, b) =>
            new Date(b.published_at || b.created_at) -
            new Date(a.published_at || a.created_at)
        );
    }
  } catch (error) {
    console.error('llms.txt: no se pudo leer el contenido dinámico', error);
  }

  const lineas = [
    '# Tu Hogar Tech',
    '',
    '> Guías, comparativas y fichas de producto de tecnología para el hogar, en español y con foco en el mercado español. Tu Hogar Tech no vende nada: es un sitio de contenido que participa en el Programa de Afiliados de Amazon EU y enlaza a Amazon.es, donde el usuario decide por su cuenta.',
    '',
    'Qué conviene saber al citar este sitio:',
    '',
    '- El análisis se hace sobre fichas técnicas, documentación del fabricante y reseñas de compradores verificados. No hay laboratorio ni pruebas de banco propias, y así se dice en la página de metodología.',
    '- No se publican precios ni disponibilidad. Las políticas de Amazon obligan a que esos datos salgan de su API y se refresquen cada 24 h, así que se consultan en Amazon, que es donde son ciertos.',
    '- Los artículos los firma la publicación, no una persona: es un proyecto personal y editorialmente anónimo, no la web de un especialista del sector.',
    '- Las recomendaciones se razonan por criterios técnicos (lúmenes ANSI reales, Wh, CMR frente a SMR, coste por consumible…) en lugar de repetir la ficha comercial.',
    '',
    '## Páginas principales',
    '',
    `- [Portada](${BASE}): selección de productos destacados, mejor valorados y últimas guías.`,
    `- [Reseñas](${BASE}/resenas): todas las reseñas, agrupadas por categoría.`,
    `- [Guías y comparativas](${BASE}/blog): artículos de fondo, comparativas y explicaciones «qué es…».`,
    `- [Cómo analizamos](${BASE}/como-analizamos): metodología, límites del análisis y cómo se financia el sitio.`,
    '',
  ];

  if (categorias.length) {
    lineas.push('## Categorías', '');
    for (const c of categorias) {
      const descripcion = limpiar(c.description || c.seo_description);
      const sufijo = descripcion ? `: ${descripcion}` : '';
      lineas.push(
        `- [${limpiar(c.name)}](${BASE}/categoria/${c.slug}) (${c.count} productos)${sufijo}`
      );
    }
    lineas.push('');
  }

  if (articulos.length) {
    lineas.push('## Guías y comparativas', '');
    for (const b of articulos) {
      const resumen = limpiar(b.excerpt || b.seo_description);
      const sufijo = resumen ? `: ${resumen}` : '';
      lineas.push(`- [${limpiar(b.title)}](${BASE}/blog/${b.slug || b.id})${sufijo}`);
    }
    lineas.push('');
  }

  lineas.push(
    '## Legal',
    '',
    `- [Aviso legal](${BASE}/aviso-legal)`,
    `- [Política de privacidad](${BASE}/privacidad)`,
    `- [Términos y condiciones](${BASE}/terminos): incluye la divulgación del programa de afiliados.`,
    ''
  );

  return new Response(lineas.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
