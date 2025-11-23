-- Función RPC para obtener usuarios de auth.users (solo admin)
-- NO requiere tabla profiles, usa directamente el email del admin

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
AS $$
DECLARE
  user_email TEXT;
  admin_email TEXT;
BEGIN
  -- Obtener el email del usuario actual
  SELECT u.email INTO user_email
  FROM auth.users u
  WHERE u.id = auth.uid();

  -- Obtener el email admin configurado
  admin_email := current_setting('app.admin_email', true);

  -- Verificar si el usuario es el admin
  IF user_email IS NULL OR admin_email IS NULL OR user_email != admin_email THEN
    RAISE EXCEPTION 'No tienes permisos para acceder a esta función. Solo el admin puede ver usuarios.';
  END IF;

  -- Retornar todos los usuarios de auth.users
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;

-- Otorgar permisos
GRANT EXECUTE ON FUNCTION get_auth_users() TO authenticated;

-- IMPORTANTE: Después de ejecutar esta función, configura tu email admin:
-- SELECT set_config('app.admin_email', 'tu_email@example.com', false);
