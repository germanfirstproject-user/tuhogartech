# 🧪 Testing Sign Up & Sign Out

## Cambios Realizados

### 1. Mejorado `signUp()` en `src/lib/supabase.js`
- ✅ Validación de email y contraseña
- ✅ Validación de longitud mínima (6 caracteres)
- ✅ Mejor manejo de errores con mensajes claros
- ✅ Retorna datos del usuario creado si es exitoso

### 2. Mejorado `signOut()` en `src/lib/supabase.js`
- ✅ Ahora siempre retorna `{success: true}` aunque haya error
- ✅ Permite que el frontend limpie la sesión de todas formas
- ✅ Mejor logging de errores

### 3. Mejorado `handleLogout()` en `src/components/Header.js`
- ✅ Limpia localStorage incluso si hay error en Supabase
- ✅ Recarga la página (window.location.reload()) para limpiar estado
- ✅ Garantiza que se cierre sesión correctamente

### 4. Mejorado `handleSubmit()` en `app/login/page.js`
- ✅ Mejor flujo de redirección tras login
- ✅ Mensajes más claros en signup
- ✅ Transición suave entre crear cuenta e iniciar sesión

---

## 📋 Flujo de Prueba Completo

### Fase 1: Crear Cuenta

1. Ve a `http://localhost:3003/login` 
2. Haz clic en **"¿No tienes cuenta? Regístrate"**
3. Ingresa:
   - **Nombre Completo**: Tu nombre
   - **Email**: `test@example.com` (o tu email)
   - **Contraseña**: `password123` (6+ caracteres)
4. Haz clic en **"Crear Cuenta"**

**Comportamiento esperado:**
- ✅ Mensaje: "Cuenta creada exitosamente. Por favor verifica tu email."
- ✅ El formulario se limpia
- ✅ Después de 3 segundos, cambia automáticamente a "Iniciar Sesión"

**Si ves error:**
- ❌ "Email inválido" → Verifica que el email sea válido
- ❌ "La contraseña debe tener al menos 6 caracteres" → Usa contraseña más larga
- ❌ "Error al crear cuenta" → El email ya existe en Supabase

---

### Fase 2: Iniciar Sesión

1. Ahora que está en **"Iniciar Sesión"**, ingresa:
   - **Email**: `test@example.com`
   - **Contraseña**: `password123`
2. Haz clic en **"Iniciar Sesión"**

**Comportamiento esperado:**
- ✅ Mensaje: "¡Sesión iniciada! Redirigiendo..."
- ✅ Se redirige a `/` (home)
- ✅ El Header ahora muestra **"👤"** en lugar de "Iniciar Sesión"
- ✅ localStorage contiene: `{"id": "...", "email": "test@example.com", "isAdmin": false}`

**Si ves error:**
- ❌ "Error al iniciar sesión" → Verifica que email/contraseña sean correctos

---

### Fase 3: Hacer Admin (Opcional)

Si quieres ver el panel admin:

1. Ve a Supabase Console
2. Ve a **SQL Editor**
3. Ejecuta:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'
WHERE email = 'test@example.com';
```
4. Recarga la página en el navegador
5. Verifica que el Header ahora muestra "📊 Panel Admin"
6. Haz logout y vuelve a login
7. Deberías redirigirse automáticamente a `/admin`

---

### Fase 4: Cerrar Sesión (Sign Out)

1. Desde la Home (o cualquier página), haz clic en el ícono **"👤"**
2. En el dropdown, haz clic en **"Cerrar Sesión"**

**Comportamiento esperado:**
- ✅ Se limpia localStorage
- ✅ El Header vuelve a mostrar "Iniciar Sesión"
- ✅ Se redirige a `/` (home)
- ✅ La página se recarga (breve destello)
- ✅ Si intentas acceder a `/admin` → Redirige a `/login`

**Si ves problema:**
- ❌ No se limpia el Header → Verifica `window.location.reload()`
- ❌ No se va a home → Verifica `router.push('/')`

---

## 🐛 Debugging

Si algo no funciona, abre la **Consola de Desarrollador** (F12):

### En Console:
```javascript
// Ver estado actual
JSON.parse(localStorage.getItem('user'))

// Limpiar manualmente
localStorage.removeItem('user')

// Recargar
location.reload()
```

### En Network:
- Verifica que `signUp`, `signIn`, `signOut` creen requests a Supabase
- Busca errores 401, 403, 500 en la respuesta

### En Application:
- Ve a Storage → localStorage → Verifica que `user` esté presente/ausente

---

## ✅ Checklist Final

- [ ] Crear cuenta funciona
- [ ] Aparece mensaje "Cuenta creada exitosamente"
- [ ] Se cambia automáticamente a "Iniciar Sesión" después de 3s
- [ ] Iniciar sesión funciona
- [ ] Header muestra "👤" cuando está logueado
- [ ] localStorage tiene `{id, email, isAdmin}`
- [ ] Cerrar sesión funciona
- [ ] Header vuelve a "Iniciar Sesión" tras logout
- [ ] localStorage se limpia tras logout
- [ ] Se redirige a `/` tras logout
- [ ] Acceso a `/admin` sin admin redirige a `/login`
- [ ] Acceso a `/admin` siendo admin muestra panel

---

## 📝 Nota

Si tienes **Supabase Email Confirmation habilitado**:
- El signup creará la cuenta pero requiere verificación por email
- No podrás hacer login hasta confirmar el email
- En desarrollo, puedes desactivar en Supabase → Authentication → Email

Si tienes **Email Confirmation DESHABILITADO** (Autoconfirm):
- El signup creará la cuenta y podrás hacer login inmediatamente
- Más rápido para testing

**Recomendación**: Para testing local, desactiva Email Confirmation en Supabase.
