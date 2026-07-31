'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/supabase";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteName, setSiteName] = useState('Tu Hogar Tech');

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    const result = await getSiteSettings();
    if (result.success && result.data) {
      setSiteName(result.data.site_name || 'Tu Hogar Tech');
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Footer Sections */}
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{siteName}</h3>
            <p className={styles.sectionDescription}>
              Plataforma de reseñas y comparativas de productos de calidad.
            </p>
          </div>

          {/* Navigation */}
          <div className={styles.section}>
            <h4 className={styles.sectionSubtitle}>Navegación</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/productos" className={styles.link}>
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/blog" className={styles.link}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.section}>
            <h4 className={styles.sectionSubtitle}>Legal</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/privacidad" className={styles.link}>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className={styles.link}>
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} {siteName}. Todos los derechos reservados.
          </p>
          <p className={styles.affiliate}>
            {siteName} es un participante en el Programa de Asociados de Amazon Services LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
