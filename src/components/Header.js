'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar sesión desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
        setIsAdmin(user.isAdmin || false);
      } catch (e) {
        // Error parsing
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out desde Supabase
      const result = await signOut();
      
      if (result.success) {
        // Limpiar localStorage
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserEmail('');
        setMenuOpen(false);
        
        // Redirigir a home
        router.push('/');
        
        // Recargar para limpiar estado del cliente
        setTimeout(() => window.location.reload(), 500);
      } else {
        // Incluso si hay error, limpiar el frontend
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserEmail('');
        setMenuOpen(false);
        router.push('/');
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      // Forzar limpieza incluso si hay error
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserEmail('');
      setMenuOpen(false);
      router.push('/');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          AffiliPro
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
                title={userEmail}
              >
                👤
              </button>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>{userEmail}</div>
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
