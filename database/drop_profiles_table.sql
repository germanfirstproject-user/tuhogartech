-- Script para eliminar la tabla profiles de forma segura
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar el trigger que crea perfiles automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Eliminar la función que crea el perfil
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Eliminar todas las políticas RLS de la tabla
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Public read own" ON profiles;
DROP POLICY IF EXISTS "Admin can update roles" ON profiles;
DROP POLICY IF EXISTS "Admin can delete profiles" ON profiles;

-- 4. Deshabilitar RLS en la tabla (si es necesario)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 5. Eliminar los índices
DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_profiles_email;

-- 6. Eliminar la tabla profiles
DROP TABLE IF EXISTS profiles;

-- Verificar que se eliminó correctamente
SELECT 'Tabla profiles eliminada correctamente' AS resultado;
