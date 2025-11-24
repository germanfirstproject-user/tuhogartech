-- ============================================
-- DIAGNÓSTICO: Verificar estado de admin
-- ============================================
-- Ejecuta estas consultas en Supabase SQL Editor para diagnosticar problemas

-- 1. Verificar si existe la tabla admin_config
SELECT COUNT(*) as existe_tabla_admin_config
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'admin_config';

-- Resultado esperado: 1 (existe) o 0 (no existe)


-- 2. Ver el admin configurado en admin_config
SELECT * FROM admin_config;

-- Deberías ver tu email aquí
-- Si está vacío o con email incorrecto, ese es el problema


-- 3. Verificar cuántos admins hay
SELECT 
  COUNT(*) as total_admins,
  string_agg(email, ', ') as admin_emails
FROM auth.users
WHERE (raw_user_meta_data->>'is_admin')::boolean = true;

-- Resultado esperado: Al menos 1 admin con tu email


-- 4. Ver el raw_user_meta_data completo de tu usuario
-- REEMPLAZA 'TU_EMAIL@gmail.com' con tu email real
SELECT 
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'is_admin' as is_admin,
  (raw_user_meta_data->>'is_admin')::boolean as is_admin_bool
FROM auth.users
WHERE email = 'TU_EMAIL@gmail.com';

-- Verifica que:
-- - raw_user_meta_data contiene {"is_admin": true}
-- - is_admin muestra 'true' (string)
-- - is_admin_bool muestra true (boolean)


-- 5. Probar la función get_auth_users (solo si eres admin y estás autenticado)
-- NOTA: Esto solo funcionará si ejecutas desde una sesión autenticada en Supabase Dashboard
SELECT * FROM get_auth_users();

-- Si da error, mira el mensaje de error para diagnosticar:
-- - "Usuario no autenticado" → Debes estar logged in
-- - "Acceso denegado" → Tu usuario no tiene is_admin = true
-- - "function does not exist" → Ejecuta PARTE 1 del script


-- ============================================
-- SOLUCIONES RÁPIDAS
-- ============================================

-- Si la función no existe, ejecuta:
/*
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
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  SELECT COALESCE(
    (raw_user_meta_data->>'is_admin')::boolean,
    false
  ) INTO is_user_admin
  FROM auth.users
  WHERE id = auth.uid();

  IF NOT is_user_admin THEN
    RAISE EXCEPTION 'Acceso denegado. Solo los administradores pueden ver usuarios.';
  END IF;

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

GRANT EXECUTE ON FUNCTION get_auth_users() TO authenticated;
GRANT EXECUTE ON FUNCTION get_auth_users() TO anon;
*/

-- Si necesitas hacer admin a un usuario (REEMPLAZA EL EMAIL):
/*
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'TU_EMAIL@gmail.com';
*/

-- Para verificar que funcionó:
/*
SELECT email, raw_user_meta_data->>'is_admin' as is_admin 
FROM auth.users 
WHERE email = 'TU_EMAIL@gmail.com';
*/
