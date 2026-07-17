-- ============================================================
-- MIGRACIÓN: Escritura solo-admin + limpieza de tabla temporal
-- Aplicada en Supabase el 2026-07-17 (migración: admin_only_write_policies)
--
-- Qué hace:
-- 1. Elimina la tabla temp_product_updates (estaba sin RLS,
--    expuesta a lectura/escritura con la clave anon).
-- 2. Crea la función public.is_admin(): es admin quien inicia
--    sesión con el email del administrador o tiene is_admin=true
--    en user_metadata (los mismos criterios que usa la web).
-- 3. En products, blogs, categories, featured_products,
--    product_seo y site_settings elimina TODAS las políticas
--    anteriores (incluidas las que permitían escribir a cualquier
--    usuario autenticado) y deja:
--      - Lectura pública (necesaria para que la web funcione con
--        la clave anon): productos, SEO y settings completos;
--        blogs solo publicados; categorías y destacados solo activos.
--      - Lectura total y escritura (insert/update/delete) solo admin.
-- ============================================================

-- 1. Eliminar tabla temporal expuesta sin RLS
DROP TABLE IF EXISTS public.temp_product_updates;

-- 2. Función helper de admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT coalesce(auth.email() = 'germanskgarcia@gmail.com', false)
      OR coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false);
$$;

-- ==========================================
-- PRODUCTS
-- ==========================================
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
DROP POLICY IF EXISTS "Allow admin insert" ON public.products;
DROP POLICY IF EXISTS "Allow admin update" ON public.products;
DROP POLICY IF EXISTS "Allow admin delete" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update products" ON public.products
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete products" ON public.products
  FOR DELETE USING (public.is_admin());

-- ==========================================
-- BLOGS
-- ==========================================
DROP POLICY IF EXISTS "Anyone can read published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can view all blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can delete blogs" ON public.blogs;

CREATE POLICY "Public read published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admin read all blogs" ON public.blogs
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin insert blogs" ON public.blogs
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update blogs" ON public.blogs
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete blogs" ON public.blogs
  FOR DELETE USING (public.is_admin());

-- ==========================================
-- CATEGORIES
-- ==========================================
DROP POLICY IF EXISTS "Anyone can read active categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can read all categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

CREATE POLICY "Public read active categories" ON public.categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin read all categories" ON public.categories
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update categories" ON public.categories
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete categories" ON public.categories
  FOR DELETE USING (public.is_admin());

-- ==========================================
-- FEATURED PRODUCTS
-- ==========================================
DROP POLICY IF EXISTS "Anyone can read active featured products" ON public.featured_products;
DROP POLICY IF EXISTS "Authenticated users can read all featured products" ON public.featured_products;
DROP POLICY IF EXISTS "Authenticated users can insert featured products" ON public.featured_products;
DROP POLICY IF EXISTS "Authenticated users can update featured products" ON public.featured_products;
DROP POLICY IF EXISTS "Authenticated users can delete featured products" ON public.featured_products;

CREATE POLICY "Public read active featured products" ON public.featured_products
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin read all featured products" ON public.featured_products
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin insert featured products" ON public.featured_products
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update featured products" ON public.featured_products
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete featured products" ON public.featured_products
  FOR DELETE USING (public.is_admin());

-- ==========================================
-- PRODUCT SEO
-- ==========================================
DROP POLICY IF EXISTS "Anyone can read product SEO" ON public.product_seo;
DROP POLICY IF EXISTS "Authenticated users can insert product SEO" ON public.product_seo;
DROP POLICY IF EXISTS "Authenticated users can update product SEO" ON public.product_seo;
DROP POLICY IF EXISTS "Authenticated users can delete product SEO" ON public.product_seo;

CREATE POLICY "Public read product SEO" ON public.product_seo
  FOR SELECT USING (true);
CREATE POLICY "Admin insert product SEO" ON public.product_seo
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update product SEO" ON public.product_seo
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete product SEO" ON public.product_seo
  FOR DELETE USING (public.is_admin());

-- ==========================================
-- SITE SETTINGS
-- ==========================================
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;

CREATE POLICY "Public read site settings" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admin insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update site settings" ON public.site_settings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete site settings" ON public.site_settings
  FOR DELETE USING (public.is_admin());
