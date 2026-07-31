'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getConsent,
  setConsent,
  OPEN_PREFERENCES_EVENT,
} from '@/lib/cookieConsent';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  // Primera visita: preguntar. Si ya decidió, no molestar.
  useEffect(() => {
    if (getConsent() === null) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  // El enlace del pie abre el panel para revisar o retirar el consentimiento.
  useEffect(() => {
    const open = () => {
      setAnalytics(getConsent()?.analytics === true);
      setShowPanel(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  const save = useCallback((value) => {
    setConsent({ analytics: value });
    setShowPanel(false);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="false"
         aria-labelledby="cookie-title" aria-describedby="cookie-desc">
      <div className={styles.banner}>
        <h2 id="cookie-title" className={styles.title}>Cookies</h2>

        <p id="cookie-desc" className={styles.description}>
          Usamos cookies necesarias para que la web funcione y, solo si lo
          autorizas, cookies de analítica de Google Analytics para saber qué
          contenidos se leen. Puedes rechazarlas sin perder ninguna función y
          cambiar de opinión cuando quieras.
        </p>

        {showPanel && (
          <div className={styles.options}>
            <div className={styles.option}>
              <div className={styles.optionText}>
                <span className={styles.optionName}>Necesarias</span>
                <span className={styles.optionDesc}>
                  Sesión, seguridad y tu propia elección sobre cookies. Sin
                  ellas la web no funciona.
                </span>
              </div>
              <span className={styles.always}>Siempre activas</span>
            </div>

            <label className={styles.option}>
              <div className={styles.optionText}>
                <span className={styles.optionName}>Analítica</span>
                <span className={styles.optionDesc}>
                  Google Analytics (Google Ireland Ltd., con transferencia a
                  EE.&nbsp;UU.). Mide páginas vistas y origen del tráfico.
                </span>
              </div>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </label>
          </div>
        )}

        <p className={styles.links}>
          <Link href="/privacidad" className={styles.link}>Política de privacidad</Link>
          {' · '}
          <Link href="/aviso-legal" className={styles.link}>Aviso legal</Link>
        </p>

        <div className={styles.actions}>
          {showPanel ? (
            <>
              <button type="button" className={styles.rejectButton} onClick={() => save(false)}>
                Rechazar todas
              </button>
              <button type="button" className={styles.acceptButton} onClick={() => save(analytics)}>
                Guardar preferencias
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.settingsButton}
                onClick={() => setShowPanel(true)}
              >
                Configurar
              </button>
              <button type="button" className={styles.rejectButton} onClick={() => save(false)}>
                Rechazar
              </button>
              <button type="button" className={styles.acceptButton} onClick={() => save(true)}>
                Aceptar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
