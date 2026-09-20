'use client';

import { useState } from 'react';
import styles from './ProductVisual.module.css';

/**
 * Foto propia del producto, con el visual de la categoría como respaldo.
 *
 * El respaldo llega como `children` ya montado, así que entra en juego tanto
 * si la ficha no tiene foto como si el navegador no consigue cargarla: una
 * URL rota deja la tarjeta igual que las de los productos aún sin fotografiar,
 * nunca con el icono de imagen partida.
 *
 * Cargar la foto es cosa del navegador, de modo que este es el único trozo de
 * la identidad visual que necesita cliente; el SVG se sigue dibujando en el
 * servidor.
 */
export default function ProductPhoto({ src, alt, prioritaria = false, className = '', children }) {
  const [falla, setFalla] = useState(false);

  if (!src || falla) return children;

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.foto} ${className}`}
      /* La foto de la ficha entra en el primer pantallazo y es el elemento
         grande que mide el LCP, así que esa se pide ya. En listados y
         carruseles la mayoría nace fuera de pantalla y sigue siendo diferida. */
      loading={prioritaria ? 'eager' : 'lazy'}
      fetchPriority={prioritaria ? 'high' : undefined}
      decoding="async"
      onError={() => setFalla(true)}
    />
  );
}
