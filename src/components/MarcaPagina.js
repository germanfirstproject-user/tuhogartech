'use client';

import { useEffect } from 'react';
import { describirPagina } from '@/lib/medicion';

/**
 * Le dice a la medición propia qué se está viendo en esta página.
 *
 * Las fichas de producto y los artículos ya tienen su propio medidor, así que
 * esto es para el resto: categorías, listados y cualquier plantilla de
 * servidor que quiera aparecer en el informe de contenido con nombre propio en
 * lugar de como una ruta suelta.
 *
 * No pinta nada y no cuesta nada si no hay consentimiento: describirPagina
 * vuelve sin hacer nada cuando la medición está parada.
 */
export default function MarcaPagina({ tipo, id, slug, titulo }) {
  useEffect(() => {
    describirPagina({
      page_type: tipo,
      entity_id: id,
      entity_slug: slug,
      entity_title: titulo,
    });
  }, [tipo, id, slug, titulo]);

  return null;
}
