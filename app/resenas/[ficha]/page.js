import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { getProducts, getProductById, getProductSeo, getRelatedProducts, getBlogsReferencingProduct, getFeaturedProducts, getCategoryByName, getSubcategoryByName, getGrupoDeProducto } from '@/lib/supabase';
import { categoryToSlug } from '@/lib/utils';
import { rutaFicha, idDeFicha } from '@/lib/fichas';
import ProductVisitTracker from '@/components/ProductVisitTracker';
import ProductVisual from '@/components/ProductVisual';
import AvisoAfiliado from '@/components/AvisoAfiliado';
import Carousel from '@/components/Carousel';
import AmazonDisclaimer from '@/components/AmazonDisclaimer';
import BotonAmazon from './BotonAmazon';
import Comparativa from './Comparativa';
import PreguntasFrecuentes from './PreguntasFrecuentes';
import BarraMovil from './BarraMovil';
import ProductCTA from './ProductCTA';
import styles from './page.module.css';

/** «Synology DS224+: NAS de 2 bahías…» → «Synology DS224+». */
const modeloDe = (product) => String(product?.title || '').split(':')[0].trim();

/**
 * La ficha es «opinión» salvo cuando su dirección dice otra cosa: la 203
 * (Liene) conserva su URL posicionada y se presenta como ficha técnica, para
 * no competir con el artículo «Liene Amber M100 opinión».
 */
const esOpinion = (product) => !product?.url_slug || product.url_slug.endsWith('opinion');

const ETIQUETAS_SPECS = {
  ram: 'RAM', cpu: 'Procesador', wifi: 'WiFi', usb: 'USB', hdmi: 'HDMI', ip: 'Protección IP',
};

/** Clave de `specs` legible: «capacidad_bateria» → «Capacidad batería». */
function etiquetaSpec(clave) {
  if (ETIQUETAS_SPECS[clave]) return ETIQUETAS_SPECS[clave];
  const texto = String(clave).replace(/[_-]+/g, ' ').trim();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function valorSpec(valor) {
  if (Array.isArray(valor)) return valor.join(', ');
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  if (valor && typeof valor === 'object') return Object.values(valor).join(', ');
  return String(valor);
}

/** Primera letra en minúscula, para encajar un texto dentro de una frase. */
const enFrase = (texto) => {
  const t = String(texto || '').trim().replace(/\.$/, '');
  return t ? t.charAt(0).toLowerCase() + t.slice(1) : '';
};

/**
 * Preguntas frecuentes. Las de `products.faq` mandan; si no hay, se montan dos
 * con lo que ya sabemos del producto (para quién es y frente a qué vecino),
 * para que ninguna ficha se quede sin el bloque.
 */
function preguntasDe(product, modelo, vecinos, modelos) {
  const propias = Array.isArray(product.faq)
    ? product.faq.filter((f) => f?.pregunta && f?.respuesta)
    : [];
  if (propias.length) return propias;

  const lista = [];
  if (product.verdict || product.ideal_for) {
    const respuesta = product.verdict
      || `Sí, si ${enFrase(product.ideal_for)}.${product.not_for ? ` No es la mejor opción si ${enFrase(product.not_for)}.` : ''}`;
    lista.push({ pregunta: `¿Merece la pena el ${modelo}?`, respuesta });
  }
  const vecino = vecinos.find((v) => v.best_for);
  if (vecino && product.best_for) {
    lista.push({
      pregunta: `¿${modelo} o ${modelos[vecino.id]}?`,
      respuesta: `El ${modelo} destaca en ${enFrase(product.best_for)}; el ${modelos[vecino.id]}, en ${enFrase(vecino.best_for)}. En la tabla comparativa tienes el resto de diferencias.`,
    });
  }
  return lista;
}


// Caché de 24 horas: el panel de administración la renueva al guardar (/api/revalidar)
export const revalidate = 86400;

export async function generateStaticParams() {
  const result = await getProducts();
  const products = result.success ? result.data : [];
  return products.map((product) => ({
    ficha: rutaFicha(product).split('/').pop(),
  }));
}

export async function generateMetadata({ params }) {
  const id = idDeFicha(params.ficha);
  const result = id ? await getProductById(id) : { success: false };
  const product = result.success ? result.data : null;

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  // Obtener SEO personalizado si existe
  const seoResult = await getProductSeo(id);
  const seo = seoResult.success ? seoResult.data : null;

  return {
    // La plantilla del layout ya añade « | Tu Hogar Tech»
    title: seo?.seo_title || product.title,
    // La metadescripción tampoco lleva precio: es lo primero que envejece
    description: seo?.seo_description || product.description || `${product.title} por ${product.brand || 'N/A'}${product.rating ? `. Valoración: ${product.rating}/5` : ''}.`,
    keywords: seo?.seo_keywords || `${product.title}, ${product.brand}, ${product.category}`,
    robots: seo?.meta_robots || 'index, follow',
    openGraph: {
      title: seo?.og_title || `${product.title} | Tu Hogar Tech`,
      description: seo?.og_description || product.description || `${product.title} - ${product.brand || 'N/A'}`,
      // Imagen propia: las de Amazon no se pueden republicar en metadatos.
      images: [{ url: 'https://tuhogartech.com/og-image-morado.png', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: seo?.twitter_card || 'summary_large_image',
      title: seo?.twitter_title || seo?.og_title || product.title,
      description: seo?.twitter_description || seo?.og_description || product.description,
      images: ['https://tuhogartech.com/og-image-morado.png'],
    },
    alternates: {
      // Una canónica guardada con la dirección vieja (/producto/{id}) mandaría
      // a Google a una redirección; esas se ignoran.
      canonical: (seo?.canonical_url && !seo.canonical_url.includes('/producto/'))
        ? seo.canonical_url
        : `https://tuhogartech.com${rutaFicha(product)}`,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const id = idDeFicha(params.ficha);
  const result = id ? await getProductById(id) : { success: false };
  const product = result.success ? result.data : null;

  // `notFound()` devuelve un 404 real: una ficha inventada no debe ser una
  // página indexable.
  if (!product) {
    notFound();
  }

  // La ficha se busca por el número; el nombre de detrás puede venir viejo
  // (cambió el título o la dirección pasó a «-opinion»), mal copiado o faltar.
  // Todas esas variantes van a la dirección buena con una redirección
  // permanente, para que solo haya una.
  const ruta = rutaFicha(product);
  if (`/resenas/${params.ficha}` !== ruta) {
    permanentRedirect(ruta);
  }

  const [relatedResult, blogsResult, featuredResult, categoryResult, grupoResult] = await Promise.all([
    getRelatedProducts(id, product.category, 8),
    getBlogsReferencingProduct(id, modeloDe(product), 4),
    getFeaturedProducts(),
    getCategoryByName(product.category),
    getGrupoDeProducto(product, 3),
  ]);

  const relatedProducts = relatedResult.success ? relatedResult.data : [];
  const referencingBlogs = blogsResult.success ? blogsResult.data : [];
  const featuredProducts = (featuredResult.success ? featuredResult.data : []).filter((p) => p && p.id !== product.id);
  const categoryData = categoryResult.success ? categoryResult.data : null;
  const grupo = grupoResult.success ? grupoResult.data : null;
  const vecinos = grupo?.vecinos || [];

  const categorySlug = categoryData?.slug || categoryToSlug(product.category);

  // La subcategoría solo entra en las migas si tiene página propia; si no,
  // sería un enlace a un 404.
  const subResult = await getSubcategoryByName(categoryData?.id, product.subcategory);
  const subcategoria = subResult.success && subResult.data?.has_page ? subResult.data : null;
  const subcategoriaHref = subcategoria ? `/categoria/${categorySlug}/${subcategoria.slug}` : null;

  const modelo = modeloDe(product);
  const opinion = esOpinion(product);
  const modelos = Object.fromEntries([product, ...vecinos].map((p) => [p.id, modeloDe(p)]));
  const preguntas = preguntasDe(product, modelo, vecinos, modelos);
  const specs = product.specs && typeof product.specs === 'object' && !Array.isArray(product.specs)
    ? Object.entries(product.specs).filter(([, v]) => v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
    : [];
  const pros = Array.isArray(product.pros) ? product.pros : [];
  const cons = Array.isArray(product.cons) ? product.cons : [];
  const features = Array.isArray(product.features) ? product.features : [];
  const nota = product.rating ? Number(product.rating).toLocaleString('es-ES', { maximumFractionDigits: 1 }) : null;
  const revisado = product.reviewed_at
    ? new Date(product.reviewed_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  // Índice de la página: solo las secciones que existen en esta ficha
  const indice = [
    { id: 'opinion', texto: opinion ? 'Nuestra opinión' : 'Qué es', hay: Boolean(product.description) },
    { id: 'pros-contras', texto: 'Pros y contras', hay: pros.length > 0 || cons.length > 0 },
    { id: 'comparativa', texto: 'Comparativa', hay: true },
    { id: 'caracteristicas', texto: 'Ficha técnica', hay: specs.length > 0 || features.length > 0 },
    { id: 'preguntas', texto: 'Preguntas frecuentes', hay: preguntas.length > 0 },
  ].filter((s) => s.hay);

  // Sin bloque Product a propósito: Google exige offers, review o
  // aggregateRating y ninguno nos corresponde (no vendemos, y la puntuación
  // es nuestra valoración editorial, no reseñas recogidas en la web). Se
  // emiten la ruta de navegación y, si hay, las preguntas frecuentes.
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://tuhogartech.com' },
      { '@type': 'ListItem', position: 2, name: 'Reseñas', item: 'https://tuhogartech.com/resenas' },
      { '@type': 'ListItem', position: 3, name: product.category, item: `https://tuhogartech.com/categoria/${categorySlug}` },
      ...(subcategoria
        ? [{ '@type': 'ListItem', position: 4, name: subcategoria.name, item: `https://tuhogartech.com${subcategoriaHref}` }]
        : []),
      { '@type': 'ListItem', position: subcategoria ? 5 : 4, name: product.title, item: `https://tuhogartech.com${ruta}` },
    ],
  };

  const faqSchema = preguntas.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: preguntas.map((p) => ({
          '@type': 'Question',
          name: p.pregunta,
          acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema ? [breadcrumbSchema, faqSchema] : breadcrumbSchema) }}
      />

      <main className={styles.main}>
        <ProductVisitTracker productId={id} product={product} />

        <div className={styles.contenedor}>
          <nav className={styles.migas} aria-label="Migas de pan">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">›</span>
            <Link href="/resenas">Reseñas</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/categoria/${categorySlug}`}>{product.category}</Link>
            {subcategoria && (
              <>
                <span aria-hidden="true">›</span>
                <Link href={subcategoriaHref}>{subcategoria.name}</Link>
              </>
            )}
            <span aria-hidden="true">›</span>
            <span aria-current="page">{modelo}</span>
          </nav>

          {/* ---------- Cabecera: foto, respuesta corta y botón ---------- */}
          <div className={styles.hero}>
            <div className={styles.visual}>
              <ProductVisual product={product} prioritaria />
            </div>

            <div className={styles.principal}>
              {(grupo || revisado || !opinion) && (
                <p className={styles.antetitulo}>
                  {grupo && <span className={styles.grupo}>{grupo.name}</span>}
                  {!opinion && <span className={styles.grupo}>Ficha técnica</span>}
                  {revisado && <span>Revisado el {revisado}</span>}
                </p>
              )}

              <h1 className={styles.titulo}>{product.title}</h1>

              {product.verdict && <p className={styles.respuesta}>{product.verdict}</p>}

              <div className={styles.meta}>
                {nota && (
                  <span className={styles.nota} aria-label={`Nuestra puntuación: ${nota} de 5`}>
                    <span className={styles.estrella} aria-hidden="true">★</span>
                    <b>{nota}</b>
                    <span>Nuestra puntuación</span>
                  </span>
                )}
                {product.brand && <span>Marca: {product.brand}</span>}
                {product.best_for && <span>Mejor para: {product.best_for}</span>}
              </div>

              {/* Ni precio ni disponibilidad: Amazon exige que salgan de su API
                  y se refresquen cada 24 h. El usuario los ve al llegar. */}
              {product.affiliate_link && (
                <div className={styles.comprar} id="comprar">
                  <div className={styles.comprarFila}>
                    <BotonAmazon product={product} position="ficha_hero" className={styles.botonGrande} />
                    <a className={styles.enlace} href="#comparativa">
                      {vecinos.length
                        ? `Compararlo con ${vecinos.length} ${vecinos.length === 1 ? 'alternativa' : 'alternativas'}`
                        : 'Ver sus datos clave'}
                    </a>
                  </div>
                  <AvisoAfiliado />
                </div>
              )}

              {(product.ideal_for || product.not_for) && (
                <div className={styles.encaje}>
                  {product.ideal_for && (
                    <div>
                      <h2>Para ti si…</h2>
                      <p>{product.ideal_for}</p>
                    </div>
                  )}
                  {product.not_for && (
                    <div>
                      <h2>Mejor otro si…</h2>
                      <p>{product.not_for}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {indice.length > 1 && (
            <nav className={styles.indice} aria-label="En esta página">
              {indice.map((s) => (
                <a key={s.id} href={`#${s.id}`}>{s.texto}</a>
              ))}
            </nav>
          )}

          {/* ---------- Cuerpo y lateral ---------- */}
          <div className={styles.cuerpo}>
            <div className={styles.columna}>
              {product.description && (
                <section className={styles.seccion} id="opinion">
                  <h2>{opinion ? `Nuestra opinión del ${modelo}` : `Qué es el ${modelo}`}</h2>
                  <p className={styles.lectura}>{product.description}</p>
                </section>
              )}

              {(pros.length > 0 || cons.length > 0) && (
                <section className={styles.seccion} id="pros-contras">
                  <h2>Lo bueno y lo malo del {modelo}</h2>
                  <div className={styles.prosContras}>
                    {pros.length > 0 && (
                      <div className={styles.pros}>
                        <h3>Lo bueno</h3>
                        <ul>{pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      </div>
                    )}
                    {cons.length > 0 && (
                      <div className={styles.contras}>
                        <h3>Lo malo</h3>
                        <ul>{cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section className={styles.seccion} id="comparativa">
                <h2>
                  {vecinos.length
                    ? `${modelo} frente a ${vecinos.length} ${vecinos.length === 1 ? 'alternativa' : 'alternativas'}`
                    : `${modelo}: datos clave`}
                </h2>
                {grupo?.criterio && vecinos.length > 0 && <p className={styles.criterio}>{grupo.criterio}</p>}
                <Comparativa product={product} grupo={grupo} modelos={modelos} />
              </section>

              {(specs.length > 0 || features.length > 0) && (
                <section className={styles.seccion} id="caracteristicas">
                  <h2>Características del {modelo}</h2>
                  {specs.length > 0 && (
                    <dl className={styles.specs}>
                      {specs.map(([clave, valor]) => (
                        <div key={clave} className={styles.specsFila}>
                          <dt>{etiquetaSpec(clave)}</dt>
                          <dd>{valorSpec(valor)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {features.length > 0 && (
                    <ul className={styles.features}>
                      {features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  )}
                </section>
              )}

              {preguntas.length > 0 && (
                <section className={styles.seccion} id="preguntas">
                  <h2>Preguntas frecuentes</h2>
                  <PreguntasFrecuentes preguntas={preguntas} productId={product.id} />
                </section>
              )}

              {referencingBlogs.length > 0 && (
                <section className={styles.seccion}>
                  <h2>Para leer más a fondo</h2>
                  <div className={styles.lecturas}>
                    {referencingBlogs.map((blog) => (
                      <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`}>
                        <span>{blog.title}</span>
                        {blog.excerpt && <small>{blog.excerpt}</small>}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {product.affiliate_link && (
              <aside className={styles.lateral} aria-label="Resumen y enlace a Amazon">
                <p className={styles.lateralTitulo}>{modelo}</p>
                <div className={styles.lateralMini}>
                  {product.best_for && <span>Mejor para: {product.best_for}</span>}
                  {nota && (
                    <span className={styles.nota}>
                      <span className={styles.estrella} aria-hidden="true">★</span>
                      <b>{nota}</b> Nuestra puntuación
                    </span>
                  )}
                </div>
                <BotonAmazon product={product} position="ficha_lateral" className={styles.botonAncho} />
                <AvisoAfiliado>El precio no cambia para ti.</AvisoAfiliado>
                {vecinos.length > 0 && <a className={styles.enlace} href="#comparativa">Ver alternativas</a>}
              </aside>
            )}
          </div>

          <ProductCTA product={product} />

          {relatedProducts.length > 0 && (
            <section className={styles.carrusel}>
              <h2>Más en {product.category}</h2>
              <p>Otros productos de la misma categoría</p>
              <Carousel items={relatedProducts} type="product" moduleName="ficha_mas_categoria" />
            </section>
          )}

          {featuredProducts.length > 0 && (
            <section className={styles.carrusel}>
              <h2>Productos destacados</h2>
              <p>Nuestra selección del catálogo, la que recomendamos ahora mismo</p>
              <Carousel items={featuredProducts} type="product" moduleName="ficha_destacados" />
            </section>
          )}

          <AmazonDisclaimer />
        </div>

        <BarraMovil product={product} modelo={modelo} />
      </main>
    </>
  );
}
