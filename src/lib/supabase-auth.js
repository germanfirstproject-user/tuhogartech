'use client';

// Este archivo SOLO se ejecuta en cliente
import { supabase } from './supabase';

/**
 * FUNCIONES DE AUTENTICACIÓN - SUPABASE AUTH (SOLO CLIENTE)
 */

// Registrar nuevo usuario
export async function signUpWithEmail(email, password) {
  try {
    // Only access window in browser context
    const emailRedirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.error('Signup error:', err);
    return { success: false, error: err.message };
  }
}

// Iniciar sesión con email y contraseña
export async function signInWithEmail(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    console.error('Signin error:', err);
    return { success: false, error: err.message };
  }
}

// Cerrar sesión
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Signout error:', err);
    return { success: false, error: err.message };
  }
}

// Obtener usuario actual
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }

    return data?.user || null;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Obtener sesión actual
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return data?.session || null;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Escuchar cambios de autenticación
export function onAuthStateChange(callback) {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  } catch (error) {
    console.error('Error setting up auth state change listener:', error);
    return () => {};
  }
}
