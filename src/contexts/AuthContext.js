'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signOut as supabaseSignOut } from '@/lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Primero intentar desde localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (parseError) {
          // Si hay error parseando, limpiar localStorage
          localStorage.removeItem('user');
        }
      }
      
      // Luego verificar con Supabase (silenciosamente)
      const result = await getCurrentUser();
      if (result.success && result.user) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const isAdmin = adminEmail && result.user.email === adminEmail;
        
        const updatedUser = {
          ...result.user,
          isAdmin,
          role: isAdmin ? 'admin' : 'user',
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else if (!userData) {
        // Si no hay usuario en localStorage ni en Supabase, limpiar todo
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      // Silenciar errores de autenticación para no molestar al usuario
      // Solo limpiar el estado
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signOut = async () => {
    try {
      await supabaseSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
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
