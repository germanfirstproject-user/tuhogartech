'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn as supabaseSignIn } from '@/lib/supabase';
import { trackUserLogin } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

/**
 * Acceso al panel. Desde el 16-10-2026 la web no ofrece cuentas a los
 * visitantes: no hay enlace a esta página en ningún sitio, ni registro, ni
 * acceso con Google. Solo queda el formulario de entrada para el
 * administrador, que llega escribiendo la dirección.
 */
export default function LoginPage() {
  const router = useRouter();
  const { signIn: authSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await supabaseSignIn(email, password);

      if (result.success) {
        trackUserLogin('email');
        authSignIn(result.user);
        setMessage('¡Sesión iniciada! Redirigiendo...');

        setTimeout(() => {
          router.push(result.user.isAdmin ? '/admin' : '/');
          router.refresh();
        }, 500);
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar Sesión</h1>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={styles.input}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <Link href="/" className={styles.backLink}>
          ← Volver a inicio
        </Link>
      </div>
    </div>
  );
}
