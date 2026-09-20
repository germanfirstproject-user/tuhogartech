'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './BlogFilters.module.css';

/**
 * Filtros del listado del blog: categoría y tipo de artículo, combinables.
 *
 * El estado vive en la URL (`?categoria=…&tipo=…`) y el filtrado lo hace el
 * servidor, no este componente: así una vista filtrada se puede compartir, el
 * botón de atrás funciona y el listado sigue llegando renderizado.
 *
 * @param {Array} categorias - `{ slug, label, count }`, ya ordenadas.
 * @param {Array} tipos - `{ slug, label, description, count }`.
 * @param {string} categoriaActiva - slug de categoría seleccionada, o ''.
 * @param {string} tipoActivo - slug de tipo seleccionado, o ''.
 */
export default function BlogFilters({
  categorias = [],
  tipos = [],
  categoriaActiva = '',
  tipoActivo = '',
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hayFiltros = Boolean(categoriaActiva || tipoActivo);

  // Al cambiar un filtro se vuelve a la página 1: la paginación anterior
  // apunta a un conjunto de resultados que ya no existe.
  const navegar = (cambios) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor) params.set(clave, valor);
      else params.delete(clave);
    }
    params.delete('page');

    const query = params.toString();
    router.push(query ? `/blog?${query}` : '/blog', { scroll: false });
  };

  return (
    <section className={styles.filtros} aria-label="Filtrar artículos">
      <div className={styles.grupo}>
        <label className={styles.etiqueta} htmlFor="filtro-categoria">
          Categoría
        </label>
        <select
          id="filtro-categoria"
          className={styles.select}
          value={categoriaActiva}
          onChange={(e) => navegar({ categoria: e.target.value })}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option
              key={categoria.slug}
              value={categoria.slug}
              disabled={categoria.count === 0}
            >
              {categoria.label} ({categoria.count})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grupo}>
        <span className={styles.etiqueta} id="filtro-tipo-label">
          Tipo de artículo
        </span>
        <div
          className={styles.chips}
          role="group"
          aria-labelledby="filtro-tipo-label"
        >
          {tipos.map((tipo) => {
            const activo = tipo.slug === tipoActivo;
            // Un tipo sin artículos se deja a la vista pero sin pulsar: el
            // filtro existe, y así se ve que la sección está vacía en vez de
            // llevar a un listado sin resultados.
            const vacio = tipo.count === 0 && !activo;

            return (
              <button
                key={tipo.slug}
                type="button"
                // Al pulsar el tipo ya activo se quita el filtro.
                onClick={() => navegar({ tipo: activo ? '' : tipo.slug })}
                className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
                disabled={vacio}
                aria-pressed={activo}
                title={tipo.description}
              >
                {tipo.label}
                <span className={styles.chipCuenta}>{tipo.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hayFiltros && (
        <button
          type="button"
          className={styles.limpiar}
          onClick={() => navegar({ categoria: '', tipo: '' })}
        >
          Quitar filtros
        </button>
      )}
    </section>
  );
}
