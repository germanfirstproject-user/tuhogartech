
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
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message, data: [] };
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
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message, data: [] };
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
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message, data: null };
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
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message, data: null };
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
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message, data: [] };
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

    // Obtener datos del usuario
    const user = data.user;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const isAdmin = adminEmail && user?.email === adminEmail;

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: isAdmin,
        role: isAdmin ? 'admin' : 'user',
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

/**
 * ========================================
 * FUNCIONES PARA GESTIÓN DE BLOGS
 * ========================================
 */

// Obtener todos los blogs
export async function getBlogs(filters = {}) {
  try {
    let query = supabase.from('blogs').select('*');

    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blogs:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: [] };
  }
}

// Obtener un blog por ID
export async function getBlogById(id) {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Obtener un blog por slug
export async function getBlogBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog:', error);
      return { success: false, error: error.message };
    }

    // Incrementar vistas
    await supabase
      .from('blogs')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', data.id);

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Insertar nuevo blog
export async function insertBlog(blogData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const newBlog = {
      ...blogData,
      author_id: user?.id,
      author_name: user?.email || 'Admin',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('blogs')
      .insert([newBlog])
      .select()
      .single();

    if (error) {
      console.error('Error inserting blog:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Actualizar blog
export async function updateBlog(id, blogData) {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .update(blogData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Eliminar blog
export async function deleteBlog(id) {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * PRODUCT SEO FUNCTIONS
 */

// Obtener SEO de un producto
export async function getProductSeo(productId) {
  try {
    const { data, error } = await supabase
      .from('product_seo')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching product SEO:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data: data || null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Insertar o actualizar SEO de producto (upsert)
export async function upsertProductSeo(productId, seoData) {
  try {
    const { data, error } = await supabase
      .from('product_seo')
      .upsert({
        product_id: productId,
        ...seoData,
      }, {
        onConflict: 'product_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting product SEO:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Eliminar SEO de producto
export async function deleteProductSeo(productId) {
  try {
    const { error } = await supabase
      .from('product_seo')
      .delete()
      .eq('product_id', productId);

    if (error) {
      console.error('Error deleting product SEO:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * CATEGORIES FUNCTIONS
 */

// Obtener todas las categorías
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: [] };
  }
}

// Obtener categoría por ID
export async function getCategoryById(id) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Obtener categoría por slug
export async function getCategoryBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Insertar categoría
export async function insertCategory(categoryData) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting category:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Actualizar categoría
export async function updateCategory(id, categoryData) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Eliminar categoría
export async function deleteCategory(id) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Subir imagen de categoría a Supabase Storage
export async function uploadCategoryImage(file, categorySlug) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${categorySlug}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('category-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message, data: null };
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('category-images')
      .getPublicUrl(filePath);

    return { success: true, data: { path: data.path, url: publicUrl } };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Eliminar imagen de categoría de Storage
export async function deleteCategoryImage(imagePath) {
  try {
    // Extraer solo el nombre del archivo de la URL completa
    const fileName = imagePath.split('/').pop();

    const { error } = await supabase.storage
      .from('category-images')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}
