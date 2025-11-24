-- ============================================
-- ALTERNATIVA: get_auth_users SIN SECURITY DEFINER
-- ============================================
-- Si la versión con SECURITY DEFINER no funciona,
-- prueba esta versión que usa SECURITY INVOKER
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
SECURITY INVOKER  -- ⬅️ CAMBIO IMPORTANTE: Usa el contexto del usuario que llama
SET search_path = public, auth
AS $$
DECLARE
  user_email TEXT;
  admin_email TEXT;
  is_user_admin BOOLEAN := false;
  current_user_id UUID;
BEGIN
  -- Obtener el UID actual
  current_user_id := auth.uid();
  
  -- Verificar que el usuario está autenticado
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado. auth.uid() es NULL';
  END IF;

  -- Obtener el email del usuario actual
  SELECT u.email INTO user_email
  FROM auth.users u
  WHERE u.id = current_user_id;
  
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'No se pudo obtener el email del usuario con ID: %', current_user_id;
  END IF;

  -- Método 1: Verificar si tiene is_admin en user_metadata
  SELECT COALESCE(
    (raw_user_meta_data->>'is_admin')::boolean,
    false
  ) INTO is_user_admin
  FROM auth.users
  WHERE id = current_user_id;

  -- Método 2: Si existe admin_config, verificar contra esa tabla
  IF NOT is_user_admin THEN
    BEGIN
      SELECT ac.admin_email INTO admin_email
      FROM public.admin_config ac
      WHERE ac.id = 1;
      
      -- Si el email coincide con admin_config, es admin
      IF admin_email IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(admin_email)) THEN
        is_user_admin := true;
      END IF;
    EXCEPTION
      WHEN undefined_table THEN
        -- admin_config no existe, ignorar
        RAISE NOTICE 'Tabla admin_config no existe';
      WHEN OTHERS THEN
        RAISE NOTICE 'Error al verificar admin_config: %', SQLERRM;
    END;
  END IF;

  -- Si no es admin por ningún método, denegar acceso
  IF NOT is_user_admin THEN
    RAISE EXCEPTION 'Acceso denegado. Email actual: "%" (trimmed: "%"), Admin en config: "%" (trimmed: "%")', 
      user_email, TRIM(user_email), admin_email, TRIM(admin_email);
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

-- Otorgar permisos
GRANT EXECUTE ON FUNCTION get_auth_users() TO authenticated;

-- ============================================
-- DIFERENCIAS CON LA VERSIÓN ANTERIOR:
-- ============================================
-- 1. SECURITY INVOKER en vez de SECURITY DEFINER
--    Esto hace que la función se ejecute con los permisos
--    del usuario que la llama, no con permisos elevados
--
-- 2. Comparación case-insensitive y trim de emails
--    Para evitar problemas con espacios o mayúsculas
--
-- 3. Mejor manejo de errores con mensajes detallados
--
-- 4. Solo authenticated puede ejecutarla (no anon)
-- ============================================

-- VERIFICACIÓN:
-- SELECT * FROM admin_config;
-- SELECT email FROM auth.users WHERE id = auth.uid();
-- SELECT * FROM get_auth_users();
