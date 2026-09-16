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

// v3: se separa la medición propia de Google Analytics. Son dos finalidades
// con dos destinatarios distintos y no pueden ir bajo la misma casilla: subir
// la versión obliga a volver a preguntar a quien ya había decidido, que es
// exactamente lo que exige un cambio de finalidades.
export const CONSENT_VERSION = 3;

// Evento propio: quien dependa del consentimiento se suscribe y reacciona
// sin necesidad de recargar la página.
export const CONSENT_EVENT = 'cookieconsentchange';

export const DEFAULT_CONSENT = {
  necessary: true,     // Siempre activas: sesión y seguridad. No se pueden desactivar.
  analytics: false,    // Google Analytics. Requiere consentimiento expreso.
  estadisticas: false, // Medición propia guardada en nuestra base de datos.
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
    id: 'estadisticas',
    nombre: 'Estadísticas propias',
    resumen:
      'Medición guardada en nuestro propio servidor. Nos dice qué se lee y qué no, que es lo que decide sobre qué escribimos después.',
    obligatoria: false,
    destino: 'Nuestra base de datos (Supabase, servidores en la Unión Europea). No se comparte con nadie.',
    conserva: 'Catorce meses, y después se borra automáticamente.',
    datos: [
      'Qué páginas abres y en qué orden, con la fecha y la hora.',
      'Cuántos segundos pasas en cada una y hasta dónde bajas con el scroll.',
      'Qué enlaces pulsas, incluidos los que llevan a Amazon.',
      'Qué escribes en el buscador de la web y cuántos resultados salen.',
      'Desde qué página de la web llegas a otra.',
      'Desde qué sitio has llegado (Google, una red social, un enlace) y la campaña, si venía etiquetada.',
      'Si usas móvil, tableta u ordenador, el navegador, el sistema y el ancho de la pantalla.',
    ],
    noDatos: [
      'No guardamos tu dirección IP.',
      'No creamos una huella de tu navegador ni un identificador que te siga entre visitas: el de la sesión es aleatorio y desaparece al cerrar la pestaña.',
      'No cruzamos nada de esto con tu cuenta si tienes una.',
      'No hay publicidad ni venta de datos a terceros.',
    ],
  },
  {
    id: 'analytics',
    nombre: 'Analítica de Google',
    resumen: 'Google Analytics 4, para contrastar lo anterior y ver de qué búsquedas llega la gente.',
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
      estadisticas: parsed.estadisticas === true,
      date: parsed.date,
      version: parsed.version,
    };
  } catch {
    return null;
  }
}

/** Guarda la decisión y avisa a quien esté escuchando. */
export function setConsent({ analytics, estadisticas }) {
  if (typeof window === 'undefined') return;

  const value = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: analytics === true,
    estadisticas: estadisticas === true,
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

/** Consentimiento para la medición propia, la que alimenta el panel. */
export function hasStatsConsent() {
  return getConsent()?.estadisticas === true;
}

/** Abre el panel de preferencias desde cualquier punto de la web. */
export const OPEN_PREFERENCES_EVENT = 'cookiepreferencesopen';

export function openCookiePreferences() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
