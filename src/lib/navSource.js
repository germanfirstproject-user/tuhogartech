'use client';

/**
 * Registro del origen interno de una navegación.
 *
 * Sirve para responder "¿desde qué módulo llegó esta persona a la ficha?".
 * GA4 ya da el `page_referrer`, pero eso solo dice la URL anterior: si en la
 * home hay cinco módulos que enlazan a la misma ficha, no distingue cuál fue.
 *
 * Se guarda en sessionStorage y no en la URL a propósito: un `?ref=` crearía
 * variantes de cada ficha que Google indexaría como duplicados.
 *
 * El valor es de un solo uso y caduca: si alguien vuelve atrás y navega media
 * hora después, ese origen ya no describe nada.
 */

const CLAVE = 'tht_origen_nav';
const CADUCIDAD_MS = 5 * 60 * 1000;

/** Guarda el módulo desde el que se ha pulsado un enlace interno. */
export function setNavSource(modulo, extra = {}) {
  if (typeof window === 'undefined' || !modulo) return;

  try {
    sessionStorage.setItem(
      CLAVE,
      JSON.stringify({ modulo, ...extra, ts: Date.now() })
    );
  } catch {
    // Modo privado o almacenamiento lleno: la medición no debe romper la web.
  }
}

/**
 * Devuelve el origen guardado y lo borra, para que no se atribuya dos veces
 * (por ejemplo si se recarga la ficha).
 */
export function consumeNavSource() {
  if (typeof window === 'undefined') return null;

  try {
    const bruto = sessionStorage.getItem(CLAVE);
    if (!bruto) return null;

    sessionStorage.removeItem(CLAVE);

    const dato = JSON.parse(bruto);
    if (!dato?.modulo || Date.now() - dato.ts > CADUCIDAD_MS) return null;

    const { ts: _ts, ...resto } = dato;
    return resto;
  } catch {
    return null;
  }
}
