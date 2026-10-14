import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCategoryBySlug,
  getCategories,
  getProductsByCategory,
  getFeaturedProductIds,
  getSubcategoriesByCategory,
  getPublishedBlogsWithContent,
} from '@/lib/supabase';
import {
  tituloSinMarca,
  parrafos,
  articulosQueMencionan,
  esquemaListado,
} from '@/lib/categorias';
import ProductsGrid from '@/components/ProductsGrid';
import styles from '../page.module.css';
import piezas from '@/components/Categoria.module.css';
import AmazonDisclaimer from '@/components/AmazonDisclaimer';
import CategoryAmazonCTA from '@/components/CategoryAmazonCTA';
import MarcaPagina from '@/components/MarcaPagina';
import MigasDePan from '@/components/MigasDePan';
import SubcategoriasNav from '@/components/SubcategoriasNav';
import GuiasRelacionadas from '@/components/GuiasRelacionadas';

// Revalidar cada 5 minutos (300 segundos)
export const revalidate = 300;

export async function generateStaticParams() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

/**
 * La categoría, o un 404 de verdad si no existe.
 *
 * Antes se pintaba «Categoría no encontrada» con un HTTP 200, y Search Console
 * lo marcaba como soft 404 (/categoria/electronica). Además, si la base de
 * datos fallaba en una regeneración, la página guardada en caché pasaba a ser
 * ese aviso, igual en todas las categorías y sin canónica, que es lo que
 * Google acaba agrupando como «Duplicada sin versión canónica».
 *
 * Si el fallo es de la base de datos se lanza un error en vez del 404: con
 * ISR, Next sigue sirviendo la última versión buena.
 */
async function categoriaOError(slug) {
  const result = await getCategoryBySlug(slug);
  if (result.success && result.data) return result.data;
  if (result.notFound) notFound();
  throw new Error(`No se pudo leer la categoría ${slug}: ${result.error}`);
}

export async function generateMetadata({ params }) {
  const category = await categoriaOError(params.slug);

  // Sin la marca: la añade la plantilla de app/layout.js.
  const title = tituloSinMarca(category.seo_title) || category.h1 || category.name;

  return {
    title,
    description: category.seo_description || category.description || `Explora productos de ${category.name}`,
    keywords: category.seo_keywords || category.name,
    openGraph: {
      // El panel tiene campos OG propios para la categoría; antes se ignoraban
      // y siempre se usaba el título SEO.
      title: tituloSinMarca(category.og_title) || title,
      description:
        category.og_description || category.seo_description || category.description,
      type: 'website',
      ...(category.og_image ? { images: [category.og_image] } : {}),
    },
    // Sin esto, X y otras redes heredaban el título genérico de la portada.
    twitter: {
      title,
      description: category.seo_description || category.description,
    },
    alternates: {
      // El slug guardado, no el de la URL: getCategoryBySlug también acepta el
      // nombre convertido a slug, y esa segunda dirección no debe ser canónica.
      canonical: `https://tuhogartech.com/categoria/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const category = await categoriaOError(params.slug);

  // Obtener productos de esta categoría
  const [productsResult, destacadosResult, subsResult, blogsResult] = await Promise.all([
    getProductsByCategory(category.name, 1, 100),
    getFeaturedProductIds(),
    getSubcategoriesByCategory(category),
    getPublishedBlogsWithContent(),
  ]);
  const products = productsResult.success ? productsResult.data : [];
  const idsDestacados = destacadosResult.success ? destacadosResult.data : [];
  const subcategorias = subsResult.success ? subsResult.data : [];
  const blogs = blogsResult.success ? blogsResult.data : [];

  // Las guías de la categoría primero; si no hay, los artículos que enlazan
  // a alguno de sus productos aunque estén archivados en otra categoría.
  const deLaCategoria = blogs.filter((b) => b.category === category.name);
  const guias = deLaCategoria.length
    ? deLaCategoria.slice(0, 6)
    : articulosQueMencionan(blogs, products.map((p) => p.id));

  const intro = parrafos(category.intro);

  return (
    <main className={styles.categoryPage}>
      {/* Para que la categoría salga con su nombre en el informe de contenido
          del panel y no solo como una ruta. */}
      <MarcaPagina
        tipo="categoria"
        id={category.slug}
        slug={category.slug}
        titulo={category.name}
      />

      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(esquemaListado(category.h1 || category.name, products)),
          }}
        />
      )}

      <MigasDePan
        migas={[
          { name: 'Inicio', href: '/' },
          { name: 'Reseñas', href: '/resenas' },
          { name: category.name, href: `/categoria/${category.slug}` },
        ]}
      />

      <div className={styles.header}>
        {/* El nombre corto se queda como antetítulo, para que siga siendo
            reconocible desde el menú; el H1 es la frase que se busca. */}
        {category.h1 && <p className={piezas.antetitulo}>{category.name}</p>}
        <h1 className={styles.categoryTitle}>{category.h1 || category.name}</h1>
        {intro.length > 0 ? (
          <div className={piezas.intro}>
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          category.description && (
            <p className={styles.categoryDescription}>{category.description}</p>
          )
        )}

        <SubcategoriasNav
          categoria={category}
          subcategorias={subcategorias}
          total={products.length}
        />
      </div>

      {/* Antes del listado: quien busca una categoría entera suele querer ver
          el surtido, no una ficha concreta. */}
      <CategoryAmazonCTA category={category} />

      {products.length > 0 ? (
        <div className={styles.productsSection}>
          {/* El listado necesita su propio encabezado: sin él la página pasaba
              del h1 de la categoría a los h3 de cada tarjeta, saltándose un
              nivel, y no tenía ningún h2. */}
          <div className={styles.listadoHeader}>
            <h2 className={styles.listadoTitulo}>
              Todos los productos de {category.name}
            </h2>
            <p className={styles.listadoNota}>
              {products.length === 1
                ? '1 producto analizado, con sus características y su valoración en Amazon'
                : `${products.length} productos analizados, con sus características y su valoración en Amazon`}
            </p>
          </div>

          <ProductsGrid products={products} idsDestacados={idsDestacados} />
        </div>
      ) : (
        <div className={styles.emptyProducts}>
          <p>Todavía no hay reseñas en esta categoría.</p>
          <Link href="/resenas" className={styles.button}>Ver todas las reseñas</Link>
        </div>
      )}

      <GuiasRelacionadas
        titulo={`Guías de ${category.name}`}
        nota="Comparativas y explicaciones para elegir antes de mirar fichas."
        articulos={guias}
      />

      {products.length > 0 && <AmazonDisclaimer />}
    </main>
  );
}
