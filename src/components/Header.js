'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSiteSettings } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [siteName, setSiteName] = useState('Tu Hogar Tech');
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    loadSiteSettings();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const mobileButton = document.querySelector(`.${styles.mobileMenuButton}`);
        if (mobileButton && !mobileButton.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadSiteSettings = async () => {
    const result = await getSiteSettings();
    if (result.success && result.data) {
      setSiteName(result.data.site_name || 'Tu Hogar Tech');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and Navigation Group */}
        <div className={styles.logoNavGroup}>
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
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        {/* Auth Section */}
        <div className={styles.authSection}>
          {isLoggedIn ? (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                className={styles.userButton}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title={user?.email}
                aria-label="Menú de usuario"
              >
                👤
              </button>
              {userDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>{user?.email}</div>
                  <Link 
                    href="/profile" 
                    className={styles.dropdownItem}
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className={styles.dropdownItem}
                      onClick={() => setUserDropdownOpen(false)}
                    >
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú de navegación"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className={styles.mobileMenu} ref={mobileMenuRef}>
          <Link 
            href="/productos" 
            className={styles.mobileLink}
            onClick={closeMobileMenu}
          >
            Productos
          </Link>
          <Link 
            href="/blog" 
            className={styles.mobileLink}
            onClick={closeMobileMenu}
          >
            Blog
          </Link>
          {isLoggedIn ? (
            <>
              <Link 
                href="/profile" 
                className={styles.mobileLink}
                onClick={closeMobileMenu}
              >
                Mi Perfil
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={styles.mobileLink}
                  onClick={closeMobileMenu}
                >
                  📊 Panel Admin
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
            <Link 
              href="/login" 
              className={styles.mobileLink}
              onClick={closeMobileMenu}
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
