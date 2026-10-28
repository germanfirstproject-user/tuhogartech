'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import AffiliateLink from './AffiliateLink';
import AvisoAfiliado from './AvisoAfiliado';
import ProductVisual from './ProductVisual';
import { setNavSource } from '@/lib/navSource';
import { trackLeerOpinion, trackModuleClick, trackBlogCardView } from '@/lib/analytics';
import { rutaFicha } from '@/lib/fichas';
import styles from './ProductCard.module.css';

/**
 * La tarjeta de producto de toda la web: listados, carruseles, buscador y
 * artículos. La única excepción son las dos tarjetas grandes del hero.
 *
 * La acción principal es «Ver en Amazon», con su aviso de afiliado pegado,
 * porque es donde se convierte. El resto de la tarjeta (imagen y título) lleva
 * a la ficha propia, y «Leer opinión» lo dice en voz alta para quien todavía
 * está decidiendo.
 *
 * Ni precio ni disponibilidad: las políticas de afiliados de Amazon exigen que
 * esos datos vengan de su API y se refresquen cada 24 h.
 *
 * @param {string}  origen     - De dónde sale la tarjeta (home_destacados,
 *   listado_categoria, blog_articulo…). Viaja en `affiliate_click` como
 *   `link_position` y en `leer_opinion_click`.
 * @param {number}  posicion   - Orden de la tarjeta en su lista.
 * @param {boolean} destacado  - Lleva el distintivo «Destacado».
 * @param {boolean} fila       - Versión horizontal para dentro de un artículo.
 * @param {Object}  blog       - Artículo en el que aparece, si es el caso.
 * @param {string}  pagina     - Página para `setNavSource` (inicio, categoria…).
 */
export default function ProductCard({
  product,
  origen = 'tarjeta',
  posicion,
  destacado = false,
  fila = false,
  blog,
  pagina,
  prioritaria = false,
}) {
  const referencia = useRef(null);
  const ruta = rutaFicha(product);
  const esOpinion = !product?.url_slug || product.url_slug.endsWith('opinion');

  // En los artículos se mide además la impresión, para calcular el porcentaje
  // de clics de cada tarjeta. Solo se da por registrada si el evento salió.
  useEffect(() => {
    const nodo = referencia.current;
    if (!blog || !nodo || !product?.id || typeof IntersectionObserver === 'undefined') return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const enviado = trackBlogCardView({
            productId: product.id,
            productName: product.title,
            category: product.category,
            brand: product.brand,
            linkPosition: origen,
            blogId: blog.id,
            blogSlug: blog.slug,
            cardIndex: posicion,
          });
          if (enviado) observador.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observador.observe(nodo);
    return () => observador.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, blog?.id, origen, posicion]);

  if (!product) return null;

  const registrarFicha = (comoBoton) => {
    if (pagina) setNavSource(origen, { pagina });
    trackModuleClick({
      modulo: origen,
      destino: 'producto',
      itemId: product.id,
      itemName: product.title,
      posicion,
    });
    if (comoBoton) {
      trackLeerOpinion({ productId: product.id, productName: product.title, origen, posicion });
    }
  };

  const nota = product.rating ? Number(product.rating).toLocaleString('es-ES', { maximumFractionDigits: 1 }) : null;

  return (
    <article ref={referencia} className={`${styles.card} ${fila ? styles.fila : ''}`}>
      <div className={styles.imagen}>
        <ProductVisual product={product} mostrarMarca={!fila} prioritaria={prioritaria} />
        {destacado && <span className={styles.badge}>Destacado</span>}
      </div>

      <div className={styles.cuerpo}>
        {product.brand && <p className={styles.marca}>{product.brand}</p>}

        <h3 className={styles.titulo}>
          {/* El enlace del título cubre la tarjeta entera (::after), así la
              imagen y el texto llevan a la ficha sin anidar enlaces. */}
          <Link href={ruta} prefetch={false} className={styles.tituloEnlace} onClick={() => registrarFicha(false)}>
            {product.title}
          </Link>
        </h3>

        {product.best_for && (
          <p className={styles.mejorPara}>
            <span className={styles.mejorParaEtiqueta}>Mejor para</span> {product.best_for}
          </p>
        )}

        {nota && (
          <p className={styles.nota} aria-label={`Nuestra puntuación: ${nota} de 5`}>
            <span className={styles.estrella} aria-hidden="true">★</span>
            <span className={styles.notaValor}>{nota}</span>
            <span className={styles.notaTexto}>Nuestra puntuación</span>
          </p>
        )}
      </div>

      <div className={styles.acciones}>
        {product.affiliate_link ? (
          <>
            <AffiliateLink
              href={product.affiliate_link}
              productId={product.id}
              productName={product.title}
              category={product.category}
              brand={product.brand}
              position={origen}
              blogId={blog?.id}
              blogSlug={blog?.slug}
              cardIndex={posicion}
              className={styles.boton}
            >
              Ver en Amazon
              <svg className={styles.ext} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                   strokeLinecap="square" aria-hidden="true">
                <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
              </svg>
            </AffiliateLink>
            <div className={styles.pie}>
              <AvisoAfiliado breve className={styles.aviso} />
              <Link href={ruta} prefetch={false} className={styles.leer} onClick={() => registrarFicha(true)}>
                {esOpinion ? 'Leer opinión' : 'Ver ficha técnica'}
              </Link>
            </div>
          </>
        ) : (
          <Link href={ruta} prefetch={false} className={styles.botonSecundario} onClick={() => registrarFicha(true)}>
            {esOpinion ? 'Leer opinión' : 'Ver ficha técnica'}
          </Link>
        )}
      </div>
    </article>
  );
}
