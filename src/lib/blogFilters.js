import { categoryToSlug } from '@/lib/utils';
import { BLOG_TYPES, resolveBlogType } from '@/lib/blogTypes';

/**
 * Traduce los parámetros de la URL de /blog a los filtros reales.
 *
 * La categoría viaja por la URL como slug (`baterias-y-energia`) pero en
 * `blogs.category` está guardado el nombre ("Baterías y energía"), así que hay
 * que resolverla contra las categorías que de verdad existen en los artículos
 * publicados. Un slug que no case se ignora: así una URL manipulada devuelve
 * el listado completo en lugar de una página vacía.
 *
 * @param {object} searchParams - los `searchParams` de la página.
 * @param {Array} filas - `{ category, post_type }` de los artículos publicados.
 */
export function resolverFiltros(searchParams, filas) {
  const nombresCategoria = [
    ...new Set(filas.map((f) => f.category).filter(Boolean)),
  ];

  const slugCategoria = searchParams?.categoria || '';
  const categoria =
    nombresCategoria.find((n) => categoryToSlug(n) === slugCategoria) || '';

  const tipo = resolveBlogType(searchParams?.tipo)?.slug || '';

  return { categoria, tipo, nombresCategoria };
}

/**
 * Recuentos de cada opción del filtro, cruzados entre sí: los de categoría se
 * calculan con el tipo activo aplicado y viceversa. Si no se cruzaran, con una
 * comparativa marcada se vería "Proyectores (1)" y al pulsarlo saldría un
 * listado vacío, porque ese único artículo de Proyectores es un explicativo.
 */
export function calcularRecuentos(filas, { categoria, tipo, nombresCategoria }) {
  const categorias = nombresCategoria
    .map((nombre) => ({
      slug: categoryToSlug(nombre),
      label: nombre,
      count: filas.filter(
        (f) => f.category === nombre && (!tipo || f.post_type === tipo)
      ).length,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));

  const tipos = BLOG_TYPES.map((t) => ({
    ...t,
    count: filas.filter(
      (f) => f.post_type === t.slug && (!categoria || f.category === categoria)
    ).length,
  }));

  return { categorias, tipos };
}
