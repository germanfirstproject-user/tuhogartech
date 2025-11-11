
// Permite usar variables de entorno en Node.js y Next.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Servicio para obtener productos desde Supabase
 * 
 * La tabla 'products' debe tener la siguiente estructura (compatible con Amazon PA-API):
 * 
 * CREATE TABLE products (
 *   id TEXT PRIMARY KEY,
 *   asin TEXT UNIQUE NOT NULL,
 *   title TEXT NOT NULL,
 *   brand TEXT,
 *   price DECIMAL(10,2),
 *   currency TEXT DEFAULT 'EUR',
 *   rating DECIMAL(2,1),
 *   reviews_count INTEGER DEFAULT 0,
 *   images TEXT[], -- Array de URLs de imágenes
 *   features TEXT[], -- Array de características
 *   specs JSONB, -- Objeto JSON con especificaciones técnicas
 *   affiliate_link TEXT,
 *   category TEXT,
 *   subcategory TEXT,
 *   stock TEXT DEFAULT 'in_stock',
 *   description TEXT,
 *   pros TEXT[], -- Array de ventajas
 *   cons TEXT[], -- Array de desventajas
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW()
 * );
 */

// Obtener todos los productos
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase connection error:', err);
    return [];
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase connection error:', err);
    return [];
  }
}

// Obtener producto por ID
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return null;
  }
}

// Obtener producto por ASIN
export async function getProductByAsin(asin) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('asin', asin)
      .single();

    if (error) {
      console.error('Error fetching product by ASIN:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return null;
  }
}

// Buscar productos por texto
export async function searchProducts(query) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase connection error:', err);
    return [];
  }
}

// Insertar producto (para cuando uses la API de Amazon)
export async function insertProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting product:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err };
  }
}

// Actualizar producto
export async function updateProduct(id, updates) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err };
  }
}

// Eliminar producto
export async function deleteProduct(id) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err };
  }
}

/**
 * AUTENTICACIÓN CON SUPABASE AUTH
 * 
 * Usa solo Supabase Auth sin tabla de perfiles.
 * El rol de admin se almacena en user.user_metadata.is_admin
 * 
 * Para hacer admin a un usuario desde SQL (en Supabase console):
 * UPDATE auth.users 
 * SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'
 * WHERE email = 'admin@example.com';
 */

// Sign up - Crear nueva cuenta (usando API route para evitar CORS)
export async function signUp(email, password, fullName = '') {
  try {
    // Validar entrada
    if (!email || !password) {
      return { success: false, error: 'Email y contraseña son requeridos' };
    }

    if (password.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Llamar a la API route de Next.js en lugar de Supabase directamente
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        fullName: fullName || email.split('@')[0],
      }),
    });

    // Verificar si la respuesta es JSON válida
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('La respuesta no es JSON:', await response.text());
      return { 
        success: false, 
        error: 'Error en el servidor. Intenta de nuevo.' 
      };
    }

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('Error signing up:', result.error);
      return { 
        success: false, 
        error: result.error || 'Error al crear la cuenta' 
      };
    }

    // Si se creó exitosamente
    return { 
      success: true,
      user: result.user || {
        email: email,
        isAdmin: false,
      },
      message: result.message || 'Cuenta creada exitosamente.' 
    };
  } catch (err) {
    console.error('Signup error:', err);
    return { 
      success: false, 
      error: 'Error de conexión. Verifica tu internet e intenta de nuevo.' 
    };
  }
}

// Sign in - Iniciar sesión
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }

    // Obtener datos del usuario incluyendo metadata
    const user = data.user;
    const isAdmin = user?.user_metadata?.is_admin || false;

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: isAdmin,
      },
    };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Sign out - Cerrar sesión
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      // Aun así limpia la sesión aunque haya error
      return { success: true, message: 'Sesión cerrada' };
    }

    return { success: true, message: 'Sesión cerrada exitosamente' };
  } catch (err) {
    console.error('Signout error:', err);
    // Incluso si hay error, retorna success para que el frontend limpie
    return { success: true, message: 'Sesión cerrada' };
  }
}

// Get current user - Obtener usuario actual con sus datos
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, user: null };
    }

    const isAdmin = user?.user_metadata?.is_admin || false;

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: isAdmin,
      },
    };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, user: null };
  }
}

// Actualizar metadata del usuario (para hacer admin o cambiar datos)
// NOTA: Esta función debe ejecutarse desde el servidor o con permisos especiales
export async function updateUserMetadata(userId, metadata) {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: metadata,
    });

    if (error) {
      console.error('Error updating user metadata:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}
