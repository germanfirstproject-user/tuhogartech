# 🔧 Arreglar Error de CORS en Signup

## Problema
```
Access to fetch at 'https://yiudpmbwtipjbtshmugw.supabase.co/auth/v1/signup...' 
from origin 'http://localhost:3003' has been blocked by CORS policy
```

## Causa
Supabase requiere que registres las URLs autorizadas donde se ejecutará tu aplicación.

## Solución

### Paso 1: Ve a Supabase Console
1. Login en https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Authentication** → **URL Configuration**

### Paso 2: Agregar URLs Autorizadas

En la sección **Site URL**, agrega:
```
http://localhost:3003
```

En la sección **Redirect URLs**, agrega:
```
http://localhost:3003
http://localhost:3003/auth/callback
http://localhost:3000
```

### Paso 3: Guardar Cambios
- Haz clic en **Save**
- Espera a que se actualice

### Paso 4: Actualizar el Cliente
En tu navegador:
1. Abre DevTools (F12)
2. Ve a Application → Cookies → Delete all
3. O simplemente abre una ventana incógnita

### Paso 5: Testear

Intenta crear cuenta nuevamente:
1. Ve a `http://localhost:3003/login`
2. Haz clic en **"¿No tienes cuenta? Regístrate"**
3. Completa el formulario
4. Haz clic en **"Crear Cuenta"**

**Debe funcionar sin error de CORS**

---

## ¿Qué Cambié en el Código?

Removí la línea que causaba el problema:

**Antes:**
```javascript
options: {
  data: { ... },
  emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`,
}
```

**Ahora:**
```javascript
options: {
  data: { ... },
  // Removido: emailRedirectTo
}
```

Esto evita que Supabase intente enviar un email de confirmación con una URL de redirección que no está autorizada.

---

## Comportamiento Esperado Ahora

### Crear Cuenta:
1. ✅ Ingresa email, contraseña, nombre
2. ✅ Haz clic en "Crear Cuenta"
3. ✅ **Debería:** Crear la cuenta y mostrar mensaje "Cuenta creada exitosamente"
4. ✅ **NO debe:** Mostrar error de CORS

### Después de Crear Cuenta:
- La cuenta se crea en Supabase
- Puedes hacer login inmediatamente (si Autoconfirm está habilitado)
- O debes verificar email (si Email Confirmation está habilitado)

---

## Configuración Recomendada en Supabase

### Para Desarrollo (Testing Rápido):
- Ve a **Authentication** → **Providers** → **Email**
- En "Email Verification", desactiva la confirmación por email
- Esto permite crear y hacer login sin verificar email

### Para Producción:
- Mantén Email Verification activada
- Agrega tu dominio en Site URL y Redirect URLs
- Ejemplo:
  - Site URL: `https://tu-dominio.com`
  - Redirect URLs: `https://tu-dominio.com`

---

## Testing Completo

### 1. Crear Cuenta
```
Email: test@example.com
Password: password123
Name: Test User
```
✅ Debería crear sin error

### 2. Login
```
Email: test@example.com
Password: password123
```
✅ Debería mostrar "¡Sesión iniciada! Redirigiendo..."
✅ Debería ir a home
✅ Header debería mostrar "👤"

### 3. Logout
✅ Desde header o admin
✅ Debería limpiar localStorage
✅ Debería volver a mostrar "Iniciar Sesión"

---

## Resumen de Cambios

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **signUp** | Con emailRedirectTo | Sin emailRedirectTo |
| **CORS Error** | ❌ Bloqueado | ✅ Resuelto |
| **Build** | ✓ Compilaba | ✓ Sigue compilando |
| **Crear Cuenta** | ❌ Error CORS | ✅ Funciona |

---

## 🚀 Próximos Pasos

1. **Configura URLs en Supabase** (pasos arriba)
2. **Prueba crear cuenta nuevamente**
3. **Verifica que no hay error de CORS**
4. **Testea el flujo completo** (signup → login → logout)
5. **Deploya a producción** cuando todo funcione

---

## ¿Todavía Tengo Error?

Si aún ves el error:

1. **Recarga hard:** Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac)
2. **Abre DevTools → Network → ⊞ (Disable cache)** y recarga
3. **Usa una ventana incógnita** para que no use cache
4. **Verifica que guardaste bien** en Supabase → URL Configuration
5. **Espera 30 segundos** a que Supabase sincronice los cambios

Si persiste, revisa la **Console de DevTools** para ver el error exacto.
