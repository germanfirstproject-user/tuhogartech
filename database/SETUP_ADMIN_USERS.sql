-- ============================================
-- CONFIGURACIÓN DE ADMIN Y GESTIÓN DE USUARIOS
-- ============================================
-- INSTRUCCIONES:
-- 1. Abre Supabase Dashboard > SQL Editor
-- 2. Ejecuta la PARTE 1 para crear la función
-- 3. Ejecuta la PARTE 2 con TU EMAIL para hacerte admin
-- ============================================

-- ============================================
-- PARTE 1: Crear función get_auth_users
-- ============================================
-- Esta función verifica que el usuario tenga is_admin = true en user_metadata

CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  email_confirmed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  is_user_admin BOOLEAN;
BEGIN
  -- Verificar que el usuario está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  -- Verificar si el usuario actual tiene is_admin = true en user_metadata
  SELECT COALESCE(
    (raw_user_meta_data->>'is_admin')::boolean,
    false
  ) INTO is_user_admin
  FROM auth.users
  WHERE id = auth.uid();

  -- Si no es admin, denegar acceso
  IF NOT is_user_admin THEN
    RAISE EXCEPTION 'Acceso denegado. Solo los administradores pueden ver usuarios.';
  END IF;

  -- Retornar todos los usuarios de auth.users
  RETURN QUERY
  SELECT 
    u.id,
    u.email::TEXT,
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;

-- Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION get_auth_users() TO authenticated;
GRANT EXECUTE ON FUNCTION get_auth_users() TO anon;

-- ============================================
-- PARTE 2: Hacer admin a un usuario
-- ============================================
-- ⚠️ IMPORTANTE: Reemplaza 'TU_EMAIL_AQUI@gmail.com' con tu email real

-- EJECUTA ESTA LÍNEA CON TU EMAIL:
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'TU_EMAIL_AQUI@gmail.com';

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verifica que tu usuario tiene is_admin = true:
-- SELECT email, raw_user_meta_data->>'is_admin' as is_admin 
-- FROM auth.users 
-- WHERE email = 'TU_EMAIL@gmail.com';
-- 
-- Si eres admin y estás autenticado, prueba:
-- SELECT * FROM get_auth_users();
-- ============================================

