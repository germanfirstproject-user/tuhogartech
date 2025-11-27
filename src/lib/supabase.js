
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
export async function getProductsByCategory(category, page = 1, pageSize = 12) {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Obtener el total de productos
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);

    // Obtener productos paginados
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching products by category:', error);
      return { success: false, error: error.message, data: [], totalPages: 0, currentPage: page };
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return { 
      success: true, 
      data: data || [], 
      totalPages,
      currentPage: page,
      totalCount: count || 0
    };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message, data: [], totalPages: 0, currentPage: page };
  }
}

// Obtener productos mejor valorados
export async function getTopRatedProducts(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('rating', 'is', null)
      .order('rating', { ascending: false })
      .order('reviews_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top rated products:', error);
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

// Búsqueda unificada de productos y blogs relacionados
export async function searchUnified(query, orderBy = 'rating') {
  try {
    const searchTerm = query.trim();
    
    if (!searchTerm) {
      return {
        success: true,
        data: { products: [], blogs: [], stats: { productsCount: 0, blogsCount: 0, hasResults: false } }
      };
    }
    
    // 1. Buscar productos con ordenamiento
    let productsQuery = supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
    
    // Aplicar ordenamiento según el parámetro
    switch (orderBy) {
      case 'rating':
        productsQuery = productsQuery.order('rating', { ascending: false, nullsLast: true });
        break;
      case 'price_asc':
        productsQuery = productsQuery.order('price', { ascending: true });
        break;
      case 'price_desc':
        productsQuery = productsQuery.order('price', { ascending: false });
        break;
      default:
        productsQuery = productsQuery.order('rating', { ascending: false, nullsLast: true });
    }
    
    const { data: products, error: productsError } = await productsQuery;
    
    if (productsError) {
      console.error('Error searching products:', productsError);
      return { success: false, error: productsError.message, data: { products: [], blogs: [], stats: {} } };
    }
    
    // 2. Buscar blogs que mencionen el término directamente
    const { data: directBlogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false });
    
    if (blogsError) {
      console.error('Error searching blogs:', blogsError);
    }
    
    // 3. Buscar blogs que mencionen los productos encontrados
    let relatedBlogs = [];
    if (products && products.length > 0) {
      const productTitles = products.slice(0, 5).map(p => p.title);
      const productBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
      
      const relatedConditions = [];
      
      // Buscar por títulos de productos (primeros 3 para no hacer query muy larga)
      productTitles.slice(0, 3).forEach(title => {
        if (title) relatedConditions.push(`content.ilike.%${title}%`);
      });
      
      // Buscar por marcas
      productBrands.slice(0, 3).forEach(brand => {
        if (brand) relatedConditions.push(`content.ilike.%${brand}%`);
      });
      
      if (relatedConditions.length > 0) {
        const { data: related } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .or(relatedConditions.join(','))
          .order('published_at', { ascending: false })
          .limit(10);
        
        if (related) {
          relatedBlogs = related;
        }
      }
    }
    
    // Combinar y deduplicar blogs
    const allBlogsMap = new Map();
    [...(directBlogs || []), ...(relatedBlogs || [])].forEach(blog => {
      allBlogsMap.set(blog.id, blog);
    });
    const blogs = Array.from(allBlogsMap.values());
    
    return {
      success: true,
      data: {
        products: products || [],
        blogs: blogs,
        stats: {
          productsCount: products?.length || 0,
          blogsCount: blogs.length,
          hasResults: (products?.length || 0) > 0 || blogs.length > 0
        }
      }
    };
    
  } catch (err) {
    console.error('Error in unified search:', err);
    return {
      success: false,
      error: err.message,
      data: { products: [], blogs: [], stats: { productsCount: 0, blogsCount: 0, hasResults: false } }
    };
  }
}

// Obtener productos relacionados (misma categoría, excluyendo el producto actual)
export async function getRelatedProducts(productId, category, limit = 4) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', productId)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching related products:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Error in getRelatedProducts:', err);
    return { success: false, error: err.message, data: [] };
  }
}

// Obtener blogs que mencionan un producto específico
export async function getBlogsReferencingProduct(productId, productTitle, limit = 4) {
  try {
    // Buscar blogs que mencionen el ID o título del producto en su contenido
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .or(`content.ilike.%${productId}%,content.ilike.%${productTitle}%,title.ilike.%${productTitle}%`)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching blogs referencing product:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Error in getBlogsReferencingProduct:', err);
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

// Sign in with Google OAuth
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Google sign in error:', err);
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

// Get current user - Obtener usuario actual con sus datos completos
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
        // Campos importantes de auth
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_sign_in_at: user.last_sign_in_at,
        phone: user.phone,
        // Metadata adicional
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
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
export async function getBlogs(filters = {}, page = 1, pageSize = 12) {
  try {
    let query = supabase.from('blogs').select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Si no se solicita paginación (page = 0), retornar todo
    if (page === 0) {
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blogs:', error);
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data };
    }

    // Con paginación
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching blogs:', error);
      return { success: false, error: error.message, data: [], totalPages: 0, currentPage: page };
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return { 
      success: true, 
      data,
      totalPages,
      currentPage: page,
      totalCount: count || 0
    };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: [], totalPages: 0, currentPage: page };
  }
}

// Obtener blogs recientes (publicados)
export async function getRecentBlogs(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent blogs:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
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
    // Primero intentar buscar por slug
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching category:', error);
      return { success: false, error: error.message, data: null };
    }

    // Si se encontró la categoría, retornarla
    if (data) {
      return { success: true, data };
    }

    // Si no se encontró, intentar buscar todas las categorías y encontrar una que coincida
    const { data: allCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      return { success: false, error: categoriesError.message, data: null };
    }

    // Buscar categoría cuyo nombre convertido a slug coincida
    const categoryToSlug = (name) => {
      if (!name) return '';
      return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    const matchedCategory = allCategories?.find(cat => 
      categoryToSlug(cat.name) === slug || cat.slug === slug
    );

    if (matchedCategory) {
      return { success: true, data: matchedCategory };
    }

    return { success: false, error: 'Categoría no encontrada', data: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Obtener categoría por nombre (para obtener el slug real)
export async function getCategoryByName(name) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) {
      console.error('Error fetching category by name:', error);
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

// ==========================================
// Blog Images - Storage Functions
// ==========================================

// Subir imagen de blog a Storage
export async function uploadBlogImage(file) {
  try {
    if (!file) {
      return { success: false, error: 'No file provided', data: null };
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `blog_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading blog image:', error);
      return { success: false, error: error.message, data: null };
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return { success: true, data: { path: data.path, url: publicUrl } };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Eliminar imagen de blog de Storage
export async function deleteBlogImage(imagePath) {
  try {
    // Extraer solo el nombre del archivo de la URL completa
    const fileName = imagePath.split('/').pop();

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting blog image:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// Users - Admin Functions
// ==========================================

// Obtener todos los usuarios (solo admins via RPC function)
export async function getAuthUsers() {
  try {
    // Verificar que tenemos sesión antes de llamar RPC
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('❌ No hay sesión activa al intentar llamar get_auth_users');
      return { success: false, error: 'No hay sesión activa. Por favor, inicia sesión nuevamente.', data: [] };
    }

    const { data, error } = await supabase.rpc('get_auth_users');

    if (error) {
      console.error('❌ ERROR EN GET_AUTH_USERS:');
      console.error('   Código:', error.code);
      console.error('   Mensaje:', error.message);
      console.error('   Detalles:', error.details);
      console.error('   Hint:', error.hint);
      console.error('   Objeto completo:', error);
      
      // Mostrar el error completo para diagnóstico
      const fullError = `${error.message}${error.details ? ` | Detalles: ${error.details}` : ''}${error.hint ? ` | Sugerencia: ${error.hint}` : ''}`;
      
      // Error de permisos o función no autorizada
      if (error.code === '42501' || error.message?.includes('Acceso denegado')) {
        return { success: false, error: fullError, data: [] };
      }
      
      // Función no existe en Supabase
      if (error.code === '42883' || error.message?.includes('function') || error.message?.includes('does not exist')) {
        return { 
          success: false, 
          error: 'La función get_auth_users no existe. Ejecuta FIX_GET_AUTH_USERS.sql', 
          data: [] 
        };
      }

      // Usuario no autenticado
      if (error.message?.includes('no autenticado')) {
        return { success: false, error: 'Sesión no reconocida por Supabase. Cierra sesión y vuelve a iniciar.', data: [] };
      }
      
      // Retornar el error completo para que el usuario vea exactamente qué pasa
      return { success: false, error: fullError, data: [] };
    }

    return { success: true, data: data || [], error: null };
  } catch (err) {
    console.error('❌ Excepción en get_auth_users:', err);
    return { success: false, error: `Error de conexión: ${err.message}`, data: [] };
  }
}

// Obtener estadísticas de usuarios
export async function getUserStats() {
  try {
    const { data, error } = await supabase.rpc('get_auth_users');

    if (error) {
      // Silenciar errores de permisos
      if (error.code === '42501' || error.message?.includes('permission')) {
        return { success: false, error: 'No autorizado', data: null };
      }
      return { success: false, error: error.message, data: null };
    }

    const stats = {
      total: data.length,
      confirmed: data.filter(u => u.email_confirmed_at).length,
      unconfirmed: data.filter(u => !u.email_confirmed_at).length,
      activeThisMonth: data.filter(u => {
        if (!u.last_sign_in_at) return false;
        const lastSignIn = new Date(u.last_sign_in_at);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return lastSignIn > monthAgo;
      }).length,
    };

    return { success: true, data: stats, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// ==========================================
// User Data - Unified User Information
// ==========================================

// Obtener datos del usuario actual
export async function getUserData(userId) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // Silenciar errores de autenticación/permisos
      if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('auth')) {
        return { success: false, error: 'No autenticado', data: null };
      }
      return { success: false, error: error.message, data: null };
    }

    // Si no existe, intentar crear (aunque debería crearse automáticamente por trigger)
    if (!data) {
      const { data: newData, error: insertError } = await supabase
        .from('user_data')
        .insert({ user_id: userId })
        .select()
        .maybeSingle();

      if (insertError) {
        // Silenciar errores de autenticación
        if (insertError.code === 'PGRST301' || insertError.message?.includes('JWT')) {
          return { success: false, error: 'No autenticado', data: null };
        }
        // Si ya existe (código 23505 = unique violation), intentar obtenerlo de nuevo
        if (insertError.code === '23505') {
          const { data: existingData, error: retryError } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (retryError) {
            return { success: false, error: retryError.message, data: null };
          }

          return { success: true, data: existingData, error: null };
        }

        console.error('Error creating user data:', insertError);
        return { success: false, error: insertError.message, data: null };
      }

      return { success: true, data: newData, error: null };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Actualizar datos del usuario
export async function updateUserData(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user data:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Agregar producto a favoritos
export async function addFavoriteProduct(userId, productId) {
  try {
    const { error } = await supabase.rpc('add_favorite_product', {
      p_user_id: userId,
      p_product_id: productId
    });

    if (error) {
      console.error('Error adding favorite:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Obtener productos favoritos del usuario con detalles completos
export async function getUserFavoriteProducts(userId) {
  try {
    // Primero obtener los IDs de productos favoritos
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .select('favorite_products')
      .eq('user_id', userId)
      .maybeSingle();

    if (userError) {
      console.error('Error fetching user favorites:', userError);
      return { success: false, error: userError.message, data: [] };
    }

    if (!userData || !userData.favorite_products || userData.favorite_products.length === 0) {
      return { success: true, data: [], error: null };
    }

    // Obtener detalles de los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', userData.favorite_products);

    if (productsError) {
      console.error('Error fetching favorite products details:', productsError);
      return { success: false, error: productsError.message, data: [] };
    }

    return { success: true, data: products || [], error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: [] };
  }
}

// Eliminar producto de favoritos
export async function removeFavoriteProduct(userId, productId) {
  try {
    const { error } = await supabase.rpc('remove_favorite_product', {
      p_user_id: userId,
      p_product_id: productId
    });

    if (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Registrar visita a producto
export async function addVisitedProduct(userId, productId) {
  try {
    const { error } = await supabase.rpc('add_visited_product', {
      p_user_id: userId,
      p_product_id: productId
    });

    if (error) {
      console.error('Error adding visited product:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Registrar lectura de blog
export async function addReadBlog(userId, blogId) {
  try {
    const { error } = await supabase.rpc('add_read_blog', {
      p_user_id: userId,
      p_blog_id: blogId
    });

    if (error) {
      console.error('Error adding read blog:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Actualizar preferencias del usuario
export async function updateUserPreferences(userId, preferences) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .update({ preferences })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// ==========================================
// Site Settings - Configuration
// ==========================================

// Obtener la configuración del sitio
export async function getSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching site settings:', error);
      return { success: false, error: error.message, data: null };
    }

    // Si no hay configuración, retornar valores por defecto
    if (!data) {
      return {
        success: true,
        data: {
          home_title: 'AffiliPro - Los mejores productos',
          home_description: 'Reseñas honestas, comparativas detalladas y ofertas exclusivas',
          site_name: 'AffiliPro',
          site_url: ''
        },
        error: null
      };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Error:', err);
    return {
      success: false,
      error: err.message,
      data: {
        home_title: 'AffiliPro - Los mejores productos',
        home_description: 'Reseñas honestas, comparativas detalladas y ofertas exclusivas',
        site_name: 'AffiliPro',
        site_url: ''
      }
    };
  }
}

// Actualizar la configuración del sitio
export async function updateSiteSettings(settings) {
  try {
    // Primero verificamos si existe un registro
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('is_default', true)
      .single();

    if (existing) {
      // Actualizar el registro existente
      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating site settings:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };
    } else {
      // Crear nuevo registro
      const { data, error } = await supabase
        .from('site_settings')
        .insert({ ...settings, is_default: true })
        .select()
        .single();

      if (error) {
        console.error('Error creating site settings:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };
    }
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// ==========================================
// Featured Products - Admin Selection
// ==========================================

// Obtener productos destacados
export async function getFeaturedProducts() {
  try {
    const { data: featuredData, error: featuredError } = await supabase
      .from('featured_products')
      .select('product_id, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (featuredError) {
      console.error('Error fetching featured products:', featuredError);
      return { success: false, error: featuredError.message, data: [] };
    }

    if (!featuredData || featuredData.length === 0) {
      return { success: true, data: [], error: null };
    }

    // Obtener detalles completos de los productos
    const productIds = featuredData.map(f => f.product_id);
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching featured product details:', productsError);
      return { success: false, error: productsError.message, data: [] };
    }

    // Ordenar productos según el orden de featured_products
    const orderedProducts = featuredData
      .map(f => productsData.find(p => p.id === f.product_id))
      .filter(Boolean);

    return { success: true, data: orderedProducts, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: [] };
  }
}

// Añadir producto destacado
export async function addFeaturedProduct(productId, displayOrder = 0) {
  try {
    const { data, error } = await supabase
      .from('featured_products')
      .insert({
        product_id: productId,
        display_order: displayOrder,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding featured product:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message, data: null };
  }
}

// Eliminar producto destacado
export async function removeFeaturedProduct(productId) {
  try {
    const { error } = await supabase
      .from('featured_products')
      .delete()
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing featured product:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// Actualizar orden de productos destacados
export async function updateFeaturedProductsOrder(productOrders) {
  try {
    // productOrders es un array de { product_id, display_order }
    const updates = productOrders.map(item => 
      supabase
        .from('featured_products')
        .update({ display_order: item.display_order })
        .eq('product_id', item.product_id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);

    if (errors.length > 0) {
      console.error('Errors updating featured products order:', errors);
      return { success: false, error: 'Some updates failed' };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// Statistics - Real Data
// ==========================================

// Obtener estadísticas del sitio (productos, categorías)
export async function getSiteStats() {
  try {
    // Obtener conteos en paralelo
    const [productsResult, categoriesResult] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true })
    ]);

    const stats = {
      productsCount: productsResult.count || 0,
      categoriesCount: categoriesResult.count || 0
    };

    return { success: true, data: stats, error: null };
  } catch (err) {
    console.error('Error getting site stats:', err);
    return { 
      success: false, 
      error: err.message, 
      data: { productsCount: 0, categoriesCount: 0 } 
    };
  }
}
