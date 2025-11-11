# Setup de Admin en Supabase Auth

## 🎯 Sistema de Autenticación

Usamos **Supabase Auth** (sin tabla de perfiles). El rol de admin se almacena en `user.user_metadata.is_admin`.

---

## 1. Dar permiso de admin a un usuario

### Opción A: Desde Supabase Console (SQL)

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Ejecuta este SQL:

```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'
WHERE email = 'tu_email@example.com';
```

### Opción B: Desde la Terminal (con service_role key)

```bash
curl -X PUT 'https://your-project.supabase.co/auth/v1/admin/users/USER_ID' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_metadata": {
      "is_admin": true
    }
  }'
```

---

## 2. Flujo de Autenticación

```
1. Usuario se registra en /login
   ↓
2. Supabase Auth crea usuario con user_metadata.is_admin = false
   ↓
3. Admin ejecuta SQL para cambiar is_admin = true
   ↓
4. Usuario hace login
   ↓
5. signIn() lee user_metadata.is_admin
   ↓
6. Si is_admin === true → Redirige a /admin
   Si is_admin === false → Redirige a /
```

---

## 3. Cómo funciona en la app

### Login Page (`app/login/page.js`)
- Usuario entra credenciales
- `signIn()` valida con Supabase Auth
- Lee `user.user_metadata.is_admin`
- Guarda en localStorage: `{id, email, isAdmin}`
- Redirige según isAdmin

### Header (`src/components/Header.js`)
- Lee localStorage
- Muestra dropdown con "Panel Admin" si isAdmin === true
- signOut() limpia localStorage

### Admin Page (`app/admin/page.js`)
- Verifica localStorage al montar
- Si !isAdmin o !loggedin → Redirige a login
- Si isAdmin === true → Muestra panel

---

## 4. Verificar Admin Status

En cualquier página:

```javascript
'use client';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsAdmin(user.isAdmin || false);
    }
  }, []);

  return (
    <div>
      {isAdmin && <p>Eres administrador</p>}
    </div>
  );
}
```

---

## 5. Enviar a admin vía código (solo server)

Si necesitas hacer admin a un usuario programáticamente (desde un endpoint server):

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(URL, SERVICE_ROLE_KEY);

export async function makeUserAdmin(email) {
  const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
  
  const user = users.find(u => u.email === email);
  
  if (user) {
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        is_admin: true
      }
    });
  }
}
```

---

## 🔑 Variables de entorno necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Solo para server
```
