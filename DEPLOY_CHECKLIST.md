# ✅ Pre-Deploy Checklist

## 🔴 CRÍTICO - Hacer ANTES del Deploy

### 1. Cambiar URLs Placeholder
Buscar y reemplazar `https://tupagina.com` por tu dominio real:

- [ ] `app/producto/[id]/page.js`
  - Línea ~95 (canonical URL en schema)
  - Línea ~50 (canonical en metadata)
  
- [ ] `app/blog/[id]/page.js`
  - Línea ~142 (canonical URL en schema)
  - Línea ~68 (canonical en metadata)
  
- [ ] `app/categoria/[slug]/page.js`
  - Línea ~42 (canonical URL)
  
- [ ] `app/robots.js`
  - Línea ~10 (sitemap URL)
  
- [ ] `app/sitemap.js`
  - Línea ~2 (baseUrl)

### 2. Variables de Entorno
- [ ] Crear `.env.local` basado en `.env.example`
- [ ] Verificar `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Verificar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Actualizar `NEXT_PUBLIC_ADMIN_EMAIL`
- [ ] Cambiar `NEXT_PUBLIC_SITE_URL` a tu dominio

### 3. Supabase - Base de Datos
- [ ] Todas las tablas creadas (ver `database/` folder)
- [ ] `admin_config` configurado con tu email
- [ ] Usuario admin tiene metadata `is_admin: true`
- [ ] RLS policies habilitadas
- [ ] Función `get_auth_users()` creada correctamente

### 4. Supabase - Storage
- [ ] Bucket `blog-images` creado y público
- [ ] Bucket `product-images` creado y público
- [ ] Policies de Storage permiten lectura pública

---

## 🟡 IMPORTANTE - Configurar en Netlify

### Build Settings
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: 18 o superior

### Environment Variables (en Netlify)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_ADMIN_EMAIL`
- [ ] `NEXT_PUBLIC_SITE_URL` (con https://)

### Dominio
- [ ] Dominio personalizado configurado
- [ ] DNS apuntando a Netlify
- [ ] HTTPS habilitado (automático)

---

## 🟢 OPCIONAL - Post-Deploy

### SEO
- [ ] Validar Schema.org: https://search.google.com/test/rich-results
- [ ] Configurar Google Search Console
- [ ] Enviar sitemap: `https://tudominio.com/sitemap.xml`
- [ ] Verificar metadata con Facebook Debugger
- [ ] Verificar Twitter Cards

### Testing
- [ ] Login/Registro funciona
- [ ] Admin panel accesible
- [ ] Crear producto de prueba
- [ ] Crear blog de prueba
- [ ] Upload de imágenes funciona
- [ ] Links de afiliados funcionan
- [ ] Favoritos funcionan

### Analytics (Opcional)
- [ ] Configurar Google Analytics 4
- [ ] Configurar Hotjar o similar
- [ ] Configurar email notifications

---

## 🚨 Errores Comunes y Soluciones

### "No se pueden cargar los productos"
**Causa:** RLS policies no configuradas correctamente
**Solución:** Ejecuta `database/products_policies.sql`

### "No aparecen usuarios en admin"
**Causa:** Función `get_auth_users()` no existe o no tiene permisos
**Solución:** Ejecuta `database/FIX_FINAL_GET_AUTH_USERS.sql`

### "Error al subir imágenes"
**Causa:** Buckets no existen o no son públicos
**Solución:** Crea buckets y configura policies con `database/storage_setup.sql`

### "No puedo acceder a /admin"
**Causa:** Tu email no está configurado como admin
**Solución:** Ejecuta:
```sql
UPDATE admin_config SET admin_email = 'tu_email@gmail.com' WHERE id = 1;
```

### "404 en productos/blogs"
**Causa:** Páginas estáticas no generadas
**Solución:** Ejecuta `npm run build` localmente primero

---

## 📝 Después del Deploy

1. **Probar todo en producción**
   - Crea un producto de prueba
   - Crea un blog de prueba
   - Sube imágenes
   - Prueba login/logout

2. **Monitorear errores**
   - Revisa logs en Netlify
   - Configura Sentry (opcional)

3. **SEO**
   - Espera 24-48h para indexación
   - Revisa Google Search Console semanalmente

4. **Performance**
   - Ejecuta Lighthouse
   - Objetivo: Score 90+

---

## ✅ Lista Completa

Marca cuando completes cada paso:

**Pre-Deploy:**
- [ ] URLs cambiadas
- [ ] Variables de entorno configuradas
- [ ] Supabase configurado
- [ ] Storage configurado
- [ ] Admin configurado

**Deploy:**
- [ ] Build settings en Netlify
- [ ] Variables de entorno en Netlify
- [ ] Dominio configurado
- [ ] HTTPS habilitado

**Post-Deploy:**
- [ ] Todo funciona correctamente
- [ ] SEO validado
- [ ] Google Search Console
- [ ] Analytics configurado

---

**Estado del proyecto:** ✅ Listo para deploy
**Última actualización:** Noviembre 2025
