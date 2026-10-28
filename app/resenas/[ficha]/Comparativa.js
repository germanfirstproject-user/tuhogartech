'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import AvisoAfiliado from '@/components/AvisoAfiliado';
import { trackComparativaView } from '@/lib/analytics';
import { rutaFicha } from '@/lib/fichas';
import BotonAmazon from './BotonAmazon';
import styles from './page.module.css';

const nota = (rating) =>
  rating ? `★ ${Number(rating).toLocaleString('es-ES', { maximumFractionDigits: 1 })}` : '—';

/**
 * Tabla comparativa de la ficha: el producto y hasta tres del mismo grupo.
 *
 * Las filas salen de las columnas del grupo (`product_groups.columnas`) y los
 * valores de `products.compare_specs`. Sin grupo, la tabla sale solo con el
 * producto y sus datos clave, como pidió Germán: así la plantilla es la misma
 * en todas las fichas.
 *
 * Al entrar en pantalla manda `comparativa_view`, que es el denominador de los
 * clics con `link_position = ficha_tabla`.
 */
export default function Comparativa({ product, grupo, modelos }) {
  const referencia = useRef(null);
  const vecinos = grupo?.vecinos || [];
  const productos = [product, ...vecinos];
  const columnas = Array.isArray(grupo?.columnas) ? grupo.columnas : [];

  useEffect(() => {
    const nodo = referencia.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        const enviado = trackComparativaView({
          productId: product.id,
          grupo: grupo?.slug || 'sin_grupo',
          filas: productos.length,
          pagina: 'ficha',
        });
        if (enviado) observador.disconnect();
      },
      { threshold: 0.4 }
    );
    observador.observe(nodo);
    return () => observador.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const valor = (p, clave) => {
    const v = p?.compare_specs?.[clave];
    return v === undefined || v === null || v === '' ? '—' : String(v);
  };

  return (
    <div ref={referencia} className={styles.tablaMarco} tabIndex={0} role="region" aria-label="Tabla comparativa">
      <table className={styles.tabla}>
        <thead>
          <tr>
            <td />
            {productos.map((p, i) => (
              <th key={p.id} scope="col" className={i === 0 ? styles.yo : undefined}>
                <div className={styles.tablaNombre}>
                  <span className={i === 0 ? styles.tablaAqui : styles.tablaEtiqueta}>
                    {i === 0 ? 'Estás viendo' : p.best_for ? `Mejor para: ${p.best_for}` : 'Alternativa'}
                  </span>
                  {i === 0 ? (
                    <span className={styles.tablaModelo}>{modelos[p.id]}</span>
                  ) : (
                    <Link href={rutaFicha(p)} className={styles.tablaModelo}>{modelos[p.id]}</Link>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.some((p) => p.best_for) && (
            <tr>
              <th scope="row">Ideal para</th>
              {productos.map((p, i) => (
                <td key={p.id} className={i === 0 ? styles.yo : undefined}>{p.best_for || '—'}</td>
              ))}
            </tr>
          )}
          {columnas.map((col) => (
            <tr key={col.clave}>
              <th scope="row">{col.etiqueta}</th>
              {productos.map((p, i) => (
                <td key={p.id} className={i === 0 ? styles.yo : undefined}>{valor(p, col.clave)}</td>
              ))}
            </tr>
          ))}
          {columnas.length === 0 && (
            <tr>
              <th scope="row">Marca</th>
              {productos.map((p, i) => (
                <td key={p.id} className={i === 0 ? styles.yo : undefined}>{p.brand || '—'}</td>
              ))}
            </tr>
          )}
          <tr>
            <th scope="row">Nuestra puntuación</th>
            {productos.map((p, i) => (
              <td key={p.id} className={`${styles.tabular} ${i === 0 ? styles.yo : ''}`}>{nota(p.rating)}</td>
            ))}
          </tr>
          <tr className={styles.tablaUltima}>
            <th scope="row"><span className={styles.sr}>Dónde verlo</span></th>
            {productos.map((p, i) => (
              <td key={p.id} className={i === 0 ? styles.yo : undefined}>
                <div className={styles.tablaAcciones}>
                  <BotonAmazon product={p} position="ficha_tabla" secundario={i > 0} pequeno />
                  {p.affiliate_link && <AvisoAfiliado breve className={styles.avisoMini} />}
                  {i > 0 && (
                    <Link href={rutaFicha(p)} className={styles.enlace}>
                      {p.url_slug && !p.url_slug.endsWith('opinion') ? 'Ver ficha técnica' : 'Leer opinión'}
                    </Link>
                  )}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
