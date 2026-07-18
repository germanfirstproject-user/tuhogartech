-- ============================================================
-- MIGRACIÓN: Endurecimiento de funciones y storage
-- Aplicada en Supabase el 2026-07-18 (migración: security_hardening_functions_storage)
--
-- Qué hace:
-- 1. Fija search_path en todas las funciones (aviso del linter de
--    Supabase "Function Search Path Mutable").
-- 2. Reescribe las RPCs de user_data (add_favorite_product,
--    remove_favorite_product, add_visited_product, add_read_blog)
--    manteniendo la misma firma, pero validando que solo pueden
--    actuar sobre los datos del usuario autenticado (auth.uid()).
--    Antes cualquiera podía pasar el user_id de otro usuario.
-- 3. Revoca la ejecución de las RPCs al rol anon (solo usuarios
--    logueados) y del trigger handle_new_user_data a toda la API.
-- 4. Storage: elimina el listado público de los buckets
--    (blog-images, category-images, hero-images) y deja la
--    escritura solo para el admin. Las imágenes se siguen
--    sirviendo por URL pública porque los buckets son públicos
--    (eso no requiere política SELECT).
--
-- NOTA: la protección contra contraseñas filtradas (HaveIBeenPwned)
-- es un ajuste de Auth que no se puede activar por SQL. Activar en:
-- Dashboard → Authentication → Sign In / Providers → Passwords
-- → "Prevent use of leaked passwords".
-- ============================================================

-- ============================================================
-- A. Fijar search_path en funciones de triggers (comportamiento intacto)
-- ============================================================
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.update_blogs_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_categories_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_featured_products_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_product_seo_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_site_settings_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_user_data_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_profiles_updated_at() SET search_path = 'public';
ALTER FUNCTION public.generate_blog_slug() SET search_path = 'public';
ALTER FUNCTION public.generate_category_slug() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user_data() SET search_path = 'public';

-- ============================================================
-- B. RPCs de user_data: misma firma, pero solo pueden actuar
--    sobre los datos del usuario autenticado (auth.uid())
-- ============================================================
CREATE OR REPLACE FUNCTION public.add_favorite_product(p_user_id uuid, p_product_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  UPDATE public.user_data
  SET favorite_products = array_append(favorite_products, p_product_id)
  WHERE user_id = p_user_id
    AND NOT (p_product_id = ANY(favorite_products));
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_favorite_product(p_user_id uuid, p_product_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  UPDATE public.user_data
  SET favorite_products = array_remove(favorite_products, p_product_id)
  WHERE user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_visited_product(p_user_id uuid, p_product_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_array TEXT[];
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  SELECT ARRAY(
    SELECT DISTINCT unnest(
      array_prepend(p_product_id, array_remove(visited_products, p_product_id))
    ) LIMIT 50
  ) INTO updated_array
  FROM public.user_data
  WHERE user_id = p_user_id;

  UPDATE public.user_data
  SET
    visited_products = updated_array,
    total_product_views = total_product_views + 1
  WHERE user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_read_blog(p_user_id uuid, p_blog_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_array UUID[];
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  SELECT ARRAY(
    SELECT DISTINCT unnest(
      array_prepend(p_blog_id, array_remove(read_blogs, p_blog_id))
    ) LIMIT 100
  ) INTO updated_array
  FROM public.user_data
  WHERE user_id = p_user_id;

  UPDATE public.user_data
  SET
    read_blogs = updated_array,
    total_blog_reads = total_blog_reads + 1
  WHERE user_id = p_user_id;
END;
$$;

-- get_auth_users: mismo cuerpo (ya valida admin internamente), con search_path fijado
ALTER FUNCTION public.get_auth_users() SET search_path = '';

-- ============================================================
-- C. Permisos de ejecución: solo usuarios logueados pueden llamar
--    a las RPCs; el trigger interno no es invocable por la API
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.add_favorite_product(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.remove_favorite_product(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.add_visited_product(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.add_read_blog(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_auth_users() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.add_favorite_product(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.remove_favorite_product(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.add_visited_product(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.add_read_blog(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_auth_users() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_data() FROM PUBLIC, anon, authenticated;

-- ============================================================
-- D. Storage: sin listado público y escritura solo admin.
-- ============================================================
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public read hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hero images" ON storage.objects;

CREATE POLICY "Admin read site image buckets" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id IN ('blog-images','category-images','hero-images') AND public.is_admin());
CREATE POLICY "Admin upload site image buckets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('blog-images','category-images','hero-images') AND public.is_admin());
CREATE POLICY "Admin update site image buckets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('blog-images','category-images','hero-images') AND public.is_admin())
  WITH CHECK (bucket_id IN ('blog-images','category-images','hero-images') AND public.is_admin());
CREATE POLICY "Admin delete site image buckets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('blog-images','category-images','hero-images') AND public.is_admin());
