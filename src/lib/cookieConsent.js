/**
 * Gestión del consentimiento de cookies.
 *
 * Requisitos que cubre (LSSI art. 22.2 y RGPD, guía de cookies de la AEPD):
 *  - Nada que no sea técnicamente necesario se carga sin consentimiento previo.
 *  - Rechazar es tan fácil como aceptar.
 *  - El consentimiento es granular por categoría.
 *  - Se puede retirar en cualquier momento con la misma facilidad.
 *  - Se guarda la fecha y la versión para poder acreditarlo y volver a pedirlo
 *    si cambian las finalidades.
 */

export const CONSENT_KEY = 'cookieConsent';

// v3 separó la medición propia de Google Analytics. El 16-10-2026 la medición
// propia se quitó (queda solo un contador de vistas que no guarda nada en el
// navegador y no necesita consentimiento). Quitar una finalidad no obliga a
// volver a preguntar, así que la versión sigue en 3 y la casilla vieja se
// ignora.
export const CONSENT_VERSION = 3;

// Evento propio: quien dependa del consentimiento se suscribe y reacciona
// sin necesidad de recargar la página.
export const CONSENT_EVENT = 'cookieconsentchange';

export const DEFAULT_CONSENT = {
  necessary: true,     // Siempre activas: sesión y seguridad. No se pueden desactivar.
  analytics: false,    // Google Analytics. Requiere consentimiento expreso.
};

/**
 * Qué se guarda en cada categoría, con el mismo detalle que se enseña en el
 * panel. Vive aquí y no dentro del componente para que la política de
 * privacidad pueda pintar exactamente la misma lista sin que las dos versiones
 * se separen con el tiempo.
 */
export const CATEGORIAS = [
  {
    id: 'necessary',
    nombre: 'Necesarias',
    resumen: 'Sesión, seguridad y tu propia elección sobre cookies. Sin ellas la web no funciona.',
    obligatoria: true,
    destino: 'Se quedan en tu navegador. No salen de aquí.',
    conserva: 'Hasta que cierres sesión o borres los datos del navegador.',
    datos: [
      'Tu decisión sobre estas cookies, con la fecha y la versión del aviso.',
      'La sesión, solo si inicias una cuenta.',
      'Los productos que marcas como favoritos, si tienes cuenta.',
    ],
  },
  {
    id: 'analytics',
    nombre: 'Analítica de Google',
    resumen: 'Google Analytics 4, para saber qué se lee y de qué búsquedas llega la gente.',
    obligatoria: false,
    destino: 'Google Ireland Ltd., con transferencia a Estados Unidos bajo el Marco de Privacidad de Datos UE-EE. UU.',
    conserva: 'Según la configuración de Google Analytics, catorce meses.',
    datos: [
      'Páginas vistas y eventos de navegación, con la IP truncada por el propio Google.',
      'Origen del tráfico y término de búsqueda cuando Google lo facilita.',
      'Clics en enlaces de afiliado, para saber qué contenidos funcionan.',
    ],
    noDatos: ['No activamos ni la publicidad ni la personalización de anuncios de Google.'],
  },
];

/** Lee el consentimiento guardado. Devuelve null si aún no ha decidido. */
export function getConsent() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Si la versión no coincide, las finalidades han cambiado y hay que
    // volver a preguntar en lugar de dar por válido el consentimiento viejo.
    if (parsed?.version !== CONSENT_VERSION) return null;

    return {
      necessary: true,
      analytics: parsed.analytics === true,
      date: parsed.date,
      version: parsed.version,
    };
  } catch {
    return null;
  }
}

/** Guarda la decisión y avisa a quien esté escuchando. */
export function setConsent({ analytics }) {
  if (typeof window === 'undefined') return;

  const value = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: analytics === true,
    date: new Date().toISOString(),
  };

  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Borra la decisión: el banner vuelve a salir en la siguiente visita. */
export function clearConsent() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CONSENT_KEY);
  // Compatibilidad con la versión anterior, que guardaba estas dos claves.
  window.localStorage.removeItem('cookieConsentDate');
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export function hasAnalyticsConsent() {
  return getConsent()?.analytics === true;
}


/** Abre el panel de preferencias desde cualquier punto de la web. */
export const OPEN_PREFERENCES_EVENT = 'cookiepreferencesopen';

export function openCookiePreferences() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
