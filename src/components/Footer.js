'use client';

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Footer Sections */}
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>AffiliPro</h3>
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
              <li>
                <Link href="/generar-excel" className={styles.link}>
                  Generar Excel
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
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className={styles.link}>
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={styles.link}>
                  Cookies
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
            &copy; {currentYear} AffiliPro. Todos los derechos reservados.
          </p>
          <p className={styles.affiliate}>
            AffiliPro es un participante en el Programa de Asociados de Amazon Services LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
