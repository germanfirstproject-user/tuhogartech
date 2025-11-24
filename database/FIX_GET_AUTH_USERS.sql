-- ============================================
-- FIX: Función get_auth_users compatible con admin_config
-- ============================================
-- Esta versión funciona con la tabla admin_config existente
-- ============================================

-- Eliminar función anterior si existe
DROP FUNCTION IF EXISTS get_auth_users();

-- Crear función que verifica admin_config Y user_metadata
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
  user_email TEXT;
  admin_email TEXT;
  is_user_admin BOOLEAN := false;
BEGIN
  -- Verificar que el usuario está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  -- Obtener el email del usuario actual
  SELECT u.email INTO user_email
  FROM auth.users u
  WHERE u.id = auth.uid();

  -- Método 1: Verificar si tiene is_admin en user_metadata
  SELECT COALESCE(
    (raw_user_meta_data->>'is_admin')::boolean,
    false
  ) INTO is_user_admin
  FROM auth.users
  WHERE id = auth.uid();

  -- Método 2: Si existe admin_config, verificar contra esa tabla
  IF NOT is_user_admin THEN
    BEGIN
      SELECT ac.admin_email INTO admin_email
      FROM public.admin_config ac
      WHERE ac.id = 1;
      
      -- Si el email coincide con admin_config, es admin
      IF admin_email IS NOT NULL AND user_email = admin_email THEN
        is_user_admin := true;
      END IF;
    EXCEPTION
      WHEN undefined_table THEN
        -- admin_config no existe, ignorar
        NULL;
    END;
  END IF;

  -- Si no es admin por ningún método, denegar acceso
  IF NOT is_user_admin THEN
    RAISE EXCEPTION 'Acceso denegado. Solo los administradores pueden ver usuarios. Email actual: %, Admin esperado: %', user_email, admin_email;
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
GRANT EXECUTE ON FUNCTION get_auth_users() TO anon;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta esto para ver el admin configurado:
-- SELECT * FROM admin_config;

-- Ejecuta esto para ver tu usuario actual:
-- SELECT email, raw_user_meta_data->>'is_admin' as is_admin 
-- FROM auth.users WHERE id = auth.uid();

-- Si todo está bien, prueba:
-- SELECT * FROM get_auth_users();
