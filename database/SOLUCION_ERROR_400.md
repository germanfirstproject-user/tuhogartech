# 🔧 Solución Error 400 en get_auth_users

## Problema
La página `/admin/users` muestra un error 400 porque la función RPC `get_auth_users` no está configurada o tu usuario no tiene permisos de admin.

## Cómo Funciona el Sistema de Admin

Este proyecto usa **`user_metadata.is_admin`** en `auth.users` para identificar administradores:
- ✅ Cada usuario tiene un campo `raw_user_meta_data` en `auth.users`
- ✅ Si `raw_user_meta_data->>'is_admin'` = `true`, el usuario es admin
- ✅ La función `get_auth_users()` verifica esto antes de retornar datos

## Solución Paso a Paso

### 1️⃣ Crear la Función RPC (si no existe)

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** (menú lateral izquierdo)
3. Clic en **New Query**
4. Copia y pega la **PARTE 1** de `database/SETUP_ADMIN_USERS.sql`
5. Haz clic en **Run**

### 2️⃣ Hacer Admin a tu Usuario

1. En el mismo SQL Editor, ejecuta (reemplaza con tu email):
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
   WHERE email = 'TU_EMAIL@gmail.com';
   ```

2. Verifica que funcionó:
   ```sql
   SELECT email, raw_user_meta_data->>'is_admin' as is_admin 
   FROM auth.users 
   WHERE email = 'TU_EMAIL@gmail.com';
   ```
   
   Deberías ver: `is_admin = true`

### 3️⃣ Cierra Sesión y Vuelve a Iniciar

⚠️ **IMPORTANTE**: Los cambios en `user_metadata` requieren que cierres sesión y vuelvas a iniciar sesión para que se actualicen en el token.

1. Ve a tu aplicación
2. Cierra sesión (Logout)
3. Inicia sesión nuevamente con el email configurado como admin
4. Ve a `http://localhost:3001/admin/users`

## Verificación Final

Si todo está correcto, puedes probar la función directamente en SQL Editor:

```sql
SELECT * FROM get_auth_users();
```

Deberías ver la lista de todos los usuarios registrados.

## Mensajes de Error Comunes

### "La función get_auth_users no existe"
- **Causa**: No has ejecutado la PARTE 1 del script
- **Solución**: Ejecuta `SETUP_ADMIN_USERS.sql` PARTE 1 en SQL Editor

### "No tienes permisos de administrador. Tu usuario debe tener is_admin = true"
- **Causa**: Tu `user_metadata.is_admin` no es `true`
- **Solución**: 
  1. Ejecuta el UPDATE de la PARTE 2 con tu email
  2. Cierra sesión y vuelve a iniciar sesión

### "Debes iniciar sesión como administrador"
- **Causa**: No estás autenticado
- **Solución**: Ve a `/login` e inicia sesión

## Múltiples Administradores

Si necesitas hacer admin a otro usuario:

```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'otro_admin@example.com';
```

## Remover Admin

Para quitar permisos de admin:

```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data - 'is_admin'
WHERE email = 'usuario@example.com';
```

## Seguridad

- ✅ Solo usuarios con `is_admin = true` pueden ejecutar `get_auth_users()`
- ✅ La función usa `SECURITY DEFINER` para acceso seguro a `auth.users`
- ✅ Verificación de autenticación antes de ejecutar
- ✅ No se puede auto-asignar admin desde la aplicación (solo desde SQL)
