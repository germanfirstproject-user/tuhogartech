-- ============================================
-- VERIFICACIÓN RÁPIDA: ¿Por qué no funciona get_auth_users?
-- ============================================
-- Ejecuta este script completo en Supabase SQL Editor
-- Te dirá exactamente qué está mal
-- ============================================

-- 1. ¿Existe la tabla admin_config?
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_config') THEN
    RAISE NOTICE '✅ La tabla admin_config existe';
  ELSE
    RAISE NOTICE '❌ La tabla admin_config NO existe';
  END IF;
END $$;

-- 2. ¿Qué email está configurado como admin?
SELECT 
  '🔍 Admin configurado:' as info,
  admin_email,
  created_at,
  updated_at
FROM admin_config 
WHERE id = 1;

-- Si no devuelve nada, ejecuta:
-- INSERT INTO admin_config (id, admin_email) VALUES (1, 'TU_EMAIL@gmail.com');


-- 3. ¿Cuál es tu email actual en esta sesión?
SELECT 
  '🔍 Tu email actual:' as info,
  email,
  id,
  raw_user_meta_data->>'is_admin' as tiene_is_admin
FROM auth.users 
WHERE id = auth.uid();

-- Si auth.uid() es NULL, significa que no estás autenticado en esta sesión SQL


-- 4. Comparación directa (esto debería mostrar TRUE para funcionar)
SELECT 
  '🔍 Comparación:' as info,
  u.email as tu_email,
  ac.admin_email as admin_configurado,
  (u.email = ac.admin_email) as "¿Coinciden?"
FROM auth.users u
CROSS JOIN admin_config ac
WHERE u.id = auth.uid() AND ac.id = 1;

-- Si "¿Coinciden?" = false, ahí está el problema


-- 5. Ver TODOS los emails en auth.users (para encontrar el correcto)
SELECT 
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;


-- 6. ¿Existe la función get_auth_users?
SELECT 
  routine_name,
  routine_schema,
  created
FROM information_schema.routines 
WHERE routine_name = 'get_auth_users';

-- Si no devuelve nada, ejecuta FIX_GET_AUTH_USERS.sql


-- ============================================
-- SOLUCIÓN RÁPIDA SEGÚN EL PROBLEMA
-- ============================================

-- Si el email no coincide, actualiza admin_config con tu email EXACTO:
/*
UPDATE admin_config 
SET admin_email = (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE id = 1;
*/

-- O manualmente:
/*
UPDATE admin_config 
SET admin_email = 'tu_email_exacto@gmail.com'
WHERE id = 1;
*/

-- Si admin_config está vacío:
/*
INSERT INTO admin_config (id, admin_email) 
VALUES (1, 'tu_email@gmail.com')
ON CONFLICT (id) DO UPDATE SET admin_email = EXCLUDED.admin_email;
*/

-- Si la función no existe, ejecuta todo el contenido de FIX_GET_AUTH_USERS.sql
