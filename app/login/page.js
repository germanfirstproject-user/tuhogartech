'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn as supabaseSignIn, signUp as supabaseSignUp, signInWithGoogle } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { signIn: authSignIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        // Sign in
        result = await supabaseSignIn(email, password);
        
        if (result.success) {
          // Actualizar contexto de autenticación
          authSignIn(result.user);
          setMessage('¡Sesión iniciada! Redirigiendo...');
          
          // Redirigir a admin si es admin, sino a home
          setTimeout(() => {
            if (result.user.isAdmin) {
              router.push('/admin');
            } else {
              router.push('/');
            }
            router.refresh();
          }, 500);
        } else {
          // Verificar si el error es por cuenta de Google
          if (result.error && result.error.includes('Invalid login credentials')) {
            setError('Credenciales incorrectas. Si te registraste con Google, usa el botón "Continuar con Google".');
          } else {
            setError(result.error || 'Error al iniciar sesión');
          }
        }
      } else {
        // Sign up - Crear cuenta
        result = await supabaseSignUp(email, password, fullName);
        
        if (result.success) {
          setMessage(result.message || 'Cuenta creada exitosamente.');
          
          // Actualizar contexto de autenticación
          authSignIn(result.user);
          
          // Redirigir a admin si es admin, sino a home
          setTimeout(() => {
            if (result.user.isAdmin) {
              router.push('/admin');
            } else {
              router.push('/');
            }
            router.refresh();
          }, 1000);
        } else {
          setError(result.error || 'Error al crear cuenta');
        }
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        setError(result.error || 'Error al iniciar sesión con Google');
        setLoading(false);
      }
      // Si success, Supabase redirigirá automáticamente
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.');
      console.error('Google sign in error:', err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Nombre Completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className={styles.input}
              />
            </div>
          )}

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
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        <div className={styles.divider}>
          <span>O continúa con</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={styles.googleButton}
          type="button"
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Cargando...' : 'Continuar con Google'}
        </button>

        <div className={styles.divider}>
          <span></span>
        </div>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setMessage('');
          }}
          className={styles.toggleButton}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>

        <Link href="/" className={styles.backLink}>
          ← Volver a inicio
        </Link>
      </div>
    </div>
  );
}
