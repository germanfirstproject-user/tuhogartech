'use client';

import { trackAffiliateClick } from '@/lib/analytics';

/**
 * Enlace de afiliado con medición.
 *
 * Todos los botones que llevan a Amazon pasan por aquí, así que este es el
 * único sitio donde se dispara `affiliate_click`. `position` identifica desde
 * cuál de ellos se ha pulsado; sin ese dato los cuatro son indistinguibles en
 * los informes.
 */
export default function AffiliateLink({
  href,
  productId,
  productName,
  category,
  brand,
  position,
  blogId,
  blogSlug,
  cardIndex,
  children,
  className,
  style,
}) {
  const registrar = () => {
    // Hay enlaces que no son de un producto concreto, como el que lleva a la
    // sección equivalente en Amazon desde una categoría. Se miden igual, con
    // `link_position` para distinguirlos.
    if (!productId && !position) return;

    trackAffiliateClick({
      productId,
      productName,
      category: category || 'sin_categoria',
      brand,
      linkPosition: position || 'sin_definir',
      blogId,
      blogSlug,
      cardIndex,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      /* La medición propia lee estos atributos desde su escuchador global de
         clics. Se dejan escritos en el DOM en lugar de llamarla aquí para que
         haya un único punto donde se decide qué es un clic de afiliado, y para
         que un enlace nuevo nunca se quede sin medir por olvido. */
      data-med-modulo={position || undefined}
      data-med-id={productId || undefined}
      data-med-titulo={productName || undefined}
      data-med-posicion={cardIndex ?? undefined}
      onClick={registrar}
      /* El clic con la rueda del ratón dispara `auxclick`, no `click`: sin
         esto, abrir el enlace en una pestaña nueva no se contaría. */
      onAuxClick={(e) => {
        if (e.button === 1) registrar();
      }}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
