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
export const CONSENT_VERSION = 2;

// Evento propio: quien dependa del consentimiento se suscribe y reacciona
// sin necesidad de recargar la página.
export const CONSENT_EVENT = 'cookieconsentchange';

export const DEFAULT_CONSENT = {
  necessary: true,   // Siempre activas: sesión y seguridad. No se pueden desactivar.
  analytics: false,  // Google Analytics. Requiere consentimiento expreso.
};

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
