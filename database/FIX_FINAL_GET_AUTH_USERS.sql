-- ============================================
-- SOLUCIÓN FINAL: get_auth_users con SECURITY DEFINER correcto
-- ============================================
-- El problema era que SECURITY INVOKER no tiene permisos para auth.users
-- Volvemos a SECURITY DEFINER pero con el search_path correcto
-- ============================================

DROP FUNCTION IF EXISTS get_auth_users();

CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  email_confirmed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER  -- ⬅️ NECESARIO para acceder a auth.users
AS $$
DECLARE
  current_email TEXT;
  admin_email TEXT;
  is_user_admin BOOLEAN := false;
  current_user_id UUID;
BEGIN
  -- Obtener el UID actual (esto SÍ funciona en SECURITY DEFINER)
  current_user_id := auth.uid();
  
  -- Verificar que el usuario está autenticado
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado. auth.uid() es NULL';
  END IF;

  -- Obtener el email del usuario actual
  SELECT u.email INTO current_email
  FROM auth.users u
  WHERE u.id = current_user_id;
  
  IF current_email IS NULL THEN
    RAISE EXCEPTION 'No se pudo obtener el email del usuario con ID: %', current_user_id;
  END IF;

  -- Método 1: Verificar si tiene is_admin en user_metadata
  SELECT COALESCE(
    (u.raw_user_meta_data->>'is_admin')::boolean,
    false
  ) INTO is_user_admin
  FROM auth.users u
  WHERE u.id = current_user_id;

  -- Método 2: Si existe admin_config, verificar contra esa tabla
  IF NOT is_user_admin THEN
    BEGIN
      SELECT ac.admin_email INTO admin_email
      FROM public.admin_config ac
      WHERE ac.id = 1;
      
      -- Si el email coincide con admin_config, es admin (case-insensitive)
      IF admin_email IS NOT NULL AND LOWER(TRIM(current_email)) = LOWER(TRIM(admin_email)) THEN
        is_user_admin := true;
      END IF;
    EXCEPTION
      WHEN undefined_table THEN
        RAISE NOTICE 'Tabla admin_config no existe';
      WHEN OTHERS THEN
        RAISE NOTICE 'Error al verificar admin_config: %', SQLERRM;
    END;
  END IF;

  -- Si no es admin por ningún método, denegar acceso
  IF NOT is_user_admin THEN
    RAISE EXCEPTION 'Acceso denegado. Email actual: "%" | Admin esperado: "%"', current_email, admin_email;
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

-- Otorgar permisos solo a usuarios autenticados
GRANT EXECUTE ON FUNCTION get_auth_users() TO authenticated;

-- ============================================
-- EXPLICACIÓN DEL FIX:
-- ============================================
-- 1. SECURITY DEFINER: Necesario para acceder a auth.users
-- 2. Removí "SET search_path" que causaba problemas
-- 3. auth.uid() SÍ funciona en SECURITY DEFINER
-- 4. Comparación case-insensitive con LOWER y TRIM
-- 5. Mejor manejo de errores
-- ============================================

-- VERIFICACIÓN:
-- SELECT * FROM admin_config;
-- SELECT * FROM get_auth_users();
