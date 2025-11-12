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
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
      
      // Luego verificar con Supabase
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
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
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
