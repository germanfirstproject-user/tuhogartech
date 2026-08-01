'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, signOut as supabaseSignOut, supabase } from '@/lib/supabase';
import { trackUserLogin } from '@/lib/analytics';

const AuthContext = createContext({});

const CLAVE_CACHE = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Reconcilia el estado con la sesión real de Supabase.
   *
   * La copia de localStorage sirve solo para pintar rápido y no ver un
   * parpadeo de "no has iniciado sesión". Manda siempre Supabase: si su
   * sesión ha caducado, se limpia aunque la copia local siga ahí.
   *
   * Antes se hacía al revés y esa era la causa de un fallo desconcertante: el
   * panel te dejaba entrar con la copia local mientras las peticiones salían
   * sin token, así que las políticas RLS rechazaban cada guardado y el error
   * que veías era "no se encontró el registro".
   */
  const checkUser = useCallback(async ({ usarCache = false } = {}) => {
    if (usarCache) {
      try {
        const guardado = localStorage.getItem(CLAVE_CACHE);
        if (guardado) setUser(JSON.parse(guardado));
      } catch {
        localStorage.removeItem(CLAVE_CACHE);
      }
    }

    try {
      const result = await getCurrentUser();

      if (result.success && result.user) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const isAdmin = Boolean(adminEmail) && result.user.email === adminEmail;

        const actualizado = { ...result.user, isAdmin, role: isAdmin ? 'admin' : 'user' };
        setUser(actualizado);
        localStorage.setItem(CLAVE_CACHE, JSON.stringify(actualizado));
      } else {
        // Sin sesión válida no se conserva nada, haya o no copia local.
        setUser(null);
        localStorage.removeItem(CLAVE_CACHE);
      }
    } catch {
      setUser(null);
      localStorage.removeItem(CLAVE_CACHE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser({ usarCache: true });

    // Sin esto, una sesión que caduca o un cierre de sesión en otra pestaña
    // no se enteraban: la interfaz seguía creyendo que había usuario.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(CLAVE_CACHE);
        return;
      }
      if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(evento)) {
        checkUser();
      }
    });

    return () => subscription?.unsubscribe();
  }, [checkUser]);

  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem(CLAVE_CACHE, JSON.stringify(userData));

    if (
      userData?.app_metadata?.provider === 'google' ||
      userData?.identities?.some((identity) => identity.provider === 'google')
    ) {
      trackUserLogin('google');
    }
  };

  const signOut = async () => {
    try {
      await supabaseSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      localStorage.removeItem(CLAVE_CACHE);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isLoggedIn: !!user,
    isAdmin: user?.isAdmin || false,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
