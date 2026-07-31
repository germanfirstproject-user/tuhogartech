'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/cookieConsent';

/**
 * Google Analytics condicionado al consentimiento.
 *
 * El script no se inyecta hasta que el usuario acepta la categoría de
 * analítica, así que no se instala ninguna cookie de GA antes de decidir ni
 * después de rechazar. Si retira el consentimiento se corta la recogida
 * mediante Consent Mode y se borran las cookies _ga que hubieran quedado.
 */
export default function GoogleAnalytics({ measurementId }) {
  const [allowed, setAllowed] = useState(false);
  const [everAllowed, setEverAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const consent = hasAnalyticsConsent();
      setAllowed(consent);
      if (consent) setEverAllowed(true);

      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: consent ? 'granted' : 'denied',
        });
      }

      if (!consent) removeGaCookies();
    };

    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  // No cargar en desarrollo para no contaminar los datos.
  if (process.env.NODE_ENV !== 'production' || !measurementId) return null;

  // Solo se monta el script si en algún momento hubo consentimiento. Al
  // retirarlo, Consent Mode corta la recogida sin necesidad de recargar.
  if (!everAllowed) return null;

  return (
    <>
      <Script
        id="google-analytics-consent"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: '${allowed ? 'granted' : 'denied'}',
              wait_for_update: 500
            });
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              anonymize_ip: true,
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}

/** Elimina las cookies que GA haya podido dejar antes de una retirada. */
function removeGaCookies() {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];

  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0].trim();
    if (!/^_ga/.test(name) && name !== '_gid') return;

    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    });
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}
