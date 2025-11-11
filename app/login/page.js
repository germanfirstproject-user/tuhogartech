'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/supabase';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
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
        result = await signIn(email, password);
        
        if (result.success) {
          // Guardar usuario en localStorage
          localStorage.setItem('user', JSON.stringify(result.user));
          setMessage('¡Sesión iniciada! Redirigiendo...');
          
          // Redirigir a admin si es admin, sino a home
          setTimeout(() => {
            if (result.user.isAdmin) {
              router.push('/admin');
            } else {
              router.push('/');
            }
          }, 500);
        } else {
          setError(result.error || 'Error al iniciar sesión');
        }
      } else {
        // Sign up - Crear cuenta
        result = await signUp(email, password, fullName);
        
        if (result.success) {
          setMessage(result.message || 'Cuenta creada exitosamente. Por favor verifica tu email.');
          // Limpiar formulario
          setEmail('');
          setPassword('');
          setFullName('');
          
          // Si el usuario fue creado con datos, permitir login inmediato
          if (result.user) {
            // Cambiar a login después de 3 segundos
            setTimeout(() => {
              setIsLogin(true);
              setMessage('');
            }, 3000);
          } else {
            // Si solo se creó pero requiere confirmación email
            setTimeout(() => {
              setIsLogin(true);
              setMessage('');
            }, 3000);
          }
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

        <div className={styles.divider}>O</div>

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
