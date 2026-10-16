'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { esTraficoPropio, marcarSesionDeAdmin } from '@/lib/traficoPropio';

/**
 * Cuenta una vista por cada página abierta, con de dónde se llegó.
 *
 * Es lo único que queda de la medición propia: un número por pareja (página,
 * origen) en la tabla page_views. No guarda nada en el navegador ni crea
 * identificadores, así que no depende del aviso de cookies.
 *
 * El origen es la página anterior de la web si se navega por dentro, el
 * dominio externo si se llega de fuera y «Directo» si no hay ninguno.
 */
export default function ContadorVistas() {
  const pathname = usePathname();
  const { isAdmin, loading } = useAuth();
  const anterior = useRef(null);
  const ultimaContada = useRef(null);

  useEffect(() => {
    if (!loading) marcarSesionDeAdmin(isAdmin);
  }, [isAdmin, loading]);

  useEffect(() => {
    // Hasta saber si quien navega es el administrador no se cuenta nada: sus
    // visitas no deben entrar en la tabla.
    if (loading || !pathname) return;

    // El modo estricto de React ejecuta el efecto dos veces en desarrollo.
    if (ultimaContada.current === pathname) return;
    ultimaContada.current = pathname;

    const origen = anterior.current ?? origenExterno();
    anterior.current = pathname;

    if (esTraficoPropio(pathname)) return;

    supabase
      .rpc('contar_vista', { p_path: pathname, p_origen: origen })
      .then(() => {}, () => {});
  }, [pathname, loading]);

  return null;
}

/** De dónde viene la primera página de la visita. */
function origenExterno() {
  try {
    const ref = document.referrer;
    if (!ref) return 'Directo';
    const url = new URL(ref);
    // Una recarga o un enlace abierto en otra pestaña desde la propia web.
    if (url.host === window.location.host) return url.pathname;
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'Directo';
  }
}
