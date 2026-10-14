import { notFound } from 'next/navigation';
import {
  getSubcategoryBySlugs,
  getSubcategoryPages,
  getSubcategoriesByCategory,
  getProductsBySubcategory,
  getProductIdsBySubcategory,
  getFeaturedProductIds,
  getPublishedBlogsWithContent,
} from '@/lib/supabase';
import {
  tituloSinMarca,
  parrafos,
  articulosQueMencionan,
  esquemaListado,
} from '@/lib/categorias';
import ProductsGrid from '@/components/ProductsGrid';
import AmazonDisclaimer from '@/components/AmazonDisclaimer';
import MarcaPagina from '@/components/MarcaPagina';
import MigasDePan from '@/components/MigasDePan';
import SubcategoriasNav from '@/components/SubcategoriasNav';
import GuiasRelacionadas from '@/components/GuiasRelacionadas';
import PaginacionEnlaces from '@/components/PaginacionEnlaces';
import styles from '../../page.module.css';
import piezas from '@/components/Categoria.module.css';

export const revalidate = 300;

const POR_PAGINA = 12;

export async function generateStaticParams() {
  const result = await getSubcategoryPages();
  return (result.success ? result.data : []).map((s) => ({
    slug: s.category_slug,
    sub: s.slug,
  }));
}

/** ?page=N válido, o 1. */
function numeroDePagina(searchParams) {
  const n = parseInt(searchParams?.page, 10);
  return Number.isFinite(n) && n > 1 ? n : 1;
}

async function cargar(params) {
  const result = await getSubcategoryBySlugs(params.slug, params.sub);
  if (!result.success) return null;
  const { subcategory, category } = result.data;
  // Las subcategorías sin página son solo una etiqueta dentro de la categoría.
  if (!subcategory.has_page || !category.is_active) return null;
  return { subcategory, category };
}

export async function generateMetadata({ params, searchParams }) {
  const datos = await cargar(params);
  if (!datos) return { title: 'Página no encontrada' };

  const { subcategory, category } = datos;
  const pagina = numeroDePagina(searchParams);
  const base = `https://tuhogartech.com/categoria/${category.slug}/${subcategory.slug}`;
  const titulo = tituloSinMarca(subcategory.seo_title) || subcategory.h1 || subcategory.name;

  return {
    // Las páginas 2 en adelante llevan su número para que no compitan entre
    // sí con el mismo título; cada una es canónica de sí misma.
    title: pagina > 1 ? `${titulo} (página ${pagina})` : titulo,
    description: subcategory.seo_description || category.seo_description,
    openGraph: {
      title: titulo,
      description: subcategory.seo_description || category.seo_description,
      type: 'website',
      ...(category.og_image ? { images: [category.og_image] } : {}),
    },
    twitter: {
      title: titulo,
      description: subcategory.seo_description || category.seo_description,
    },
    alternates: {
      canonical: pagina > 1 ? `${base}?page=${pagina}` : base,
    },
  };
}

export default async function SubcategoryPage({ params, searchParams }) {
  const datos = await cargar(params);
  if (!datos) notFound();

  const { subcategory, category } = datos;
  const pagina = numeroDePagina(searchParams);

  const [productsResult, idsResult, subsResult, destacadosResult, blogsResult] = await Promise.all([
    getProductsBySubcategory(category.name, subcategory.name, pagina, POR_PAGINA),
    getProductIdsBySubcategory(category.name, subcategory.name),
    getSubcategoriesByCategory(category),
    getFeaturedProductIds(),
    getPublishedBlogsWithContent(),
  ]);

  const products = productsResult.success ? productsResult.data : [];
  const totalPaginas = productsResult.totalPages || 0;
  const total = productsResult.totalCount || 0;

  // Una página fuera de rango no debe existir como página indexable vacía.
  if (pagina > 1 && products.length === 0) notFound();

  const subcategorias = subsResult.success ? subsResult.data : [];
  const totalCategoria = subcategorias.reduce((n, s) => n + s.count, 0);
  const idsDestacados = destacadosResult.success ? destacadosResult.data : [];
  const blogs = blogsResult.success ? blogsResult.data : [];

  // Primero los artículos que enlazan productos de esta subcategoría; si
  // ninguno lo hace, las guías de la categoría, que tratan el tema desde
  // más arriba.
  const mencionan = articulosQueMencionan(blogs, idsResult.success ? idsResult.data : []);
  const guias = mencionan.length
    ? mencionan
    : blogs.filter((b) => b.category === category.name).slice(0, 4);

  const intro = parrafos(subcategory.intro);
  const h1 = subcategory.h1 || subcategory.name;
  const base = `/categoria/${category.slug}/${subcategory.slug}`;

  return (
    <main className={styles.categoryPage}>
      <MarcaPagina
        tipo="categoria"
        id={`${category.slug}/${subcategory.slug}`}
        slug={`${category.slug}/${subcategory.slug}`}
        titulo={`${category.name} › ${subcategory.name}`}
      />

      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(esquemaListado(h1, products, (pagina - 1) * POR_PAGINA)),
          }}
        />
      )}

      <MigasDePan
        migas={[
          { name: 'Inicio', href: '/' },
          { name: 'Reseñas', href: '/resenas' },
          { name: category.name, href: `/categoria/${category.slug}` },
          { name: subcategory.name, href: base },
        ]}
      />

      <div className={styles.header}>
        <p className={piezas.antetitulo}>{category.name}</p>
        <h1 className={styles.categoryTitle}>{h1}</h1>
        {/* La introducción solo en la primera página: en las siguientes se
            repetiría el mismo texto en varias URL. */}
        {pagina === 1 && intro.length > 0 && (
          <div className={piezas.intro}>
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        <SubcategoriasNav
          categoria={category}
          subcategorias={subcategorias}
          actual={subcategory.slug}
          total={totalCategoria}
        />
      </div>

      <div className={styles.productsSection}>
        <div className={styles.listadoHeader}>
          <h2 className={styles.listadoTitulo}>
            {subcategory.name}: {total === 1 ? '1 producto analizado' : `${total} productos analizados`}
          </h2>
          <p className={styles.listadoNota}>
            Cada uno con sus características, sus pros y sus contras, y su valoración en Amazon.
          </p>
        </div>

        <ProductsGrid products={products} idsDestacados={idsDestacados} />

        <PaginacionEnlaces base={base} actual={pagina} total={totalPaginas} />
      </div>

      <GuiasRelacionadas
        titulo={mencionan.length ? `Artículos sobre ${subcategory.name}` : `Guías de ${category.name}`}
        nota={
          mencionan.length
            ? 'Guías y comparativas en las que salen productos de esta lista.'
            : 'Comparativas y explicaciones para elegir antes de mirar fichas.'
        }
        articulos={guias}
      />

      {products.length > 0 && <AmazonDisclaimer />}
    </main>
  );
}
