'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Comprobar si el usuario ya ha dado su consentimiento
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Mostrar el banner después de un pequeño delay para mejor UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <div className={styles.icon}>🍪</div>
          <div className={styles.text}>
            <h3 className={styles.title}>Uso de Cookies</h3>
            <p className={styles.description}>
              Utilizamos cookies propias y de terceros (Google Analytics, Amazon Associates) para mejorar 
              tu experiencia de navegación, analizar el tráfico del sitio y mostrar contenido personalizado. 
              Al hacer clic en "Aceptar", consientes el uso de todas las cookies.
            </p>
            <p className={styles.links}>
              <Link href="/privacidad" className={styles.link}>
                Política de Privacidad
              </Link>
              {' · '}
              <Link href="/terminos" className={styles.link}>
                Términos y Condiciones
              </Link>
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={rejectCookies} className={styles.rejectButton}>
            Rechazar
          </button>
          <button onClick={acceptCookies} className={styles.acceptButton}>
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
