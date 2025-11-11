# 🚀 Quick Start - Testing Auth System

## Flujo de Prueba Rápida

### 1. **Crear Usuario Regular**
- Ir a `http://localhost:3000/login`
- Click en "¿No tienes cuenta? Regístrate"
- Llenar: email, password, nombre completo
- Click "Crear Cuenta"
- ✅ Redirige a /login con mensaje de email verification

### 2. **Hacer Admin al Usuario**
- Ir a **Supabase Dashboard** → **SQL Editor**
- Ejecutar:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'
WHERE email = 'tu_email@example.com';
```
- Click ▶️ Execute

### 3. **Hacer Login como Admin**
- Ir a `http://localhost:3000/login`
- Llenar: email, password del usuario
- Click "Iniciar Sesión"
- ✅ **Redirige automáticamente a `/admin`** (porque isAdmin === true)

### 4. **Verificar Admin Link en Home**
- Ir a `http://localhost:3000/`
- ✅ Verás sección "Panel de Administración" en la página
- ✅ Header muestra dropdown con "📊 Panel Admin"

### 5. **Logout**
- Click en avatar (Header)
- Click "Cerrar Sesión"
- ✅ localStorage limpio
- ✅ Redirige a home

### 6. **Crear Usuario Normal (No Admin)**
- Repetir paso 1 con otro email
- NO ejecutar SQL para hacerlo admin
- Login
- ✅ Redirige a `/` (no `/admin`)
- ✅ No ve "Panel Admin" en home
- ✅ No ve admin link en Header

---

## 📋 Verificación Rápida

### localStorage
```javascript
// En Console del navegador:
JSON.parse(localStorage.getItem('user'))
// Resultado:
// {id: "...", email: "user@example.com", isAdmin: true}
```

### Supabase Auth User Metadata
```sql
SELECT id, email, raw_user_meta_data FROM auth.users LIMIT 5;
```

---

## 🐛 Si Algo Falla

### "Redirige a login en vez de admin"
- ✅ Verifica que ejecutaste el SQL para hacer admin
- ✅ Verifica que el email es exacto (case-sensitive en algunos casos)

### "No ve dropdown en Header"
- ✅ Verificar que localStorage tiene el usuario (F12 → Application → localStorage)
- ✅ Refrescar página (Ctrl+R)

### "No aparece admin section en home"
- ✅ Mismo check que arriba

---

## 📱 Responsiveness

- ✅ Desktop: Navbar horizontal, dropdown elegante
- ✅ Mobile (<768px): Menu colapsable, diseño vertical
- ✅ Login page: Responsive, centrada

---

## ✅ Build Info

```
✓ 43 páginas compiladas
✓ 87.4 kB First Load JS
✓ Login page: 1.89 kB
✓ Admin page: Protegida (redirect automático)
```
