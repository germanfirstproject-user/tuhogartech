'use client';

import Link from 'next/link';
import { setNavSource } from '@/lib/navSource';
import { trackModuleClick } from '@/lib/analytics';

/** Destinos que tienen un medidor capaz de consumir el origen guardado. */
const DESTINOS_CON_MEDIDOR = [
  { prefijo: '/producto/', tipo: 'producto' },
  { prefijo: '/blog/', tipo: 'blog' },
];

/**
 * Enlace interno que registra desde qué módulo se ha pulsado.
 *
 * Existe para que las páginas de servidor (el hero, por ejemplo) puedan medir
 * sus enlaces sin convertirse enteras en componentes de cliente.
 *
 * El origen solo se guarda si el destino sabe consumirlo. Si no, quedaría en
 * sessionStorage y lo recogería por error la siguiente ficha que se visitase,
 * atribuyéndole un módulo que no fue.
 */
export default function TrackedLink({
  href,
  modulo,
  itemId,
  itemName,
  posicion,
  pagina = 'inicio',
  children,
  ...resto
}) {
  const destino = DESTINOS_CON_MEDIDOR.find((d) => String(href).startsWith(d.prefijo));

  const registrar = () => {
    if (!modulo) return;
    if (destino) setNavSource(modulo, { pagina });
    trackModuleClick({
      modulo,
      destino: destino?.tipo || 'otra_pagina',
      itemId,
      itemName,
      posicion,
    });
  };

  return (
    <Link href={href} onClick={registrar} {...resto}>
      {children}
    </Link>
  );
}
