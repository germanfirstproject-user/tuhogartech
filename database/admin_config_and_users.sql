-- Tabla simple para guardar configuración del admin
CREATE TABLE IF NOT EXISTS admin_config (
  id INT PRIMARY KEY DEFAULT 1,
  admin_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insertar el email admin (REEMPLAZA CON TU EMAIL)
INSERT INTO admin_config (id, admin_email) 
VALUES (1, 'TU_EMAIL_AQUI@gmail.com')
ON CONFLICT (id) 
DO UPDATE SET admin_email = EXCLUDED.admin_email, updated_at = NOW();

-- RLS: Solo lectura pública (sin escritura por seguridad)
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin config" ON admin_config
  FOR SELECT USING (true);

-- Función actualizada que lee de la tabla
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

  -- Obtener el email admin de la tabla de configuración
  SELECT ac.admin_email INTO admin_email
  FROM admin_config ac
  WHERE ac.id = 1;

  -- Verificar si el usuario es el admin
  IF user_email IS NULL OR admin_email IS NULL OR user_email != admin_email THEN
    RAISE EXCEPTION 'No tienes permisos para acceder a esta función. Solo el admin puede ver usuarios.';
  END IF;

  -- Retornar todos los usuarios de auth.users con conversión explícita a TEXT
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
