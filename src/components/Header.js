'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSiteSettings } from "@/lib/supabase";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [siteName, setSiteName] = useState('AffiliPro');

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    const result = await getSiteSettings();
    if (result.success && result.data) {
      setSiteName(result.data.site_name || 'AffiliPro');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          {siteName}
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/productos" className={styles.navLink}>
            Productos
          </Link>
          <Link href="/blog" className={styles.navLink}>
            Blog
          </Link>
        </nav>

        {/* Auth Section */}
        <div className={styles.authSection}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => setMenuOpen(!menuOpen)}
                title={user?.email}
              >
                👤
              </button>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>{user?.email}</div>
                  <Link href="/profile" className={styles.dropdownItem}>
                    Mi Perfil
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className={styles.dropdownItem}>
                      📊 Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItemLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className={styles.mobileMenu}>
          <Link href="/productos" className={styles.mobileLink}>
            Productos
          </Link>
          <Link href="/blog" className={styles.mobileLink}>
            Blog
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile" className={styles.mobileLink}>
                Mi Perfil
              </Link>
              {isAdmin && (
                <Link href="/admin" className={styles.mobileLink}>
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={styles.mobileLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.mobileLink}>
              Iniciar Sesión
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
