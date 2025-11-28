# 🚀 Google Analytics - Guía Rápida de Inicio

## ⚡ Configuración en 3 Pasos

### 1️⃣ Agregar Variable de Entorno

**En Netlify:**
1. Ve a tu sitio en Netlify
2. Site settings → Environment variables
3. Clic en "Add a variable"
4. Agrega:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XYYJ6ELDVR`

### 2️⃣ Desplegar

```bash
git add .
git commit -m "feat: implementar Google Analytics 4"
git push origin main
```

Netlify desplegará automáticamente.

### 3️⃣ Verificar

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Selecciona tu propiedad
3. Ve a **Reports → Realtime**
4. Visita tu sitio web
5. ✅ Deberías verte en tiempo real

---

## 📊 Eventos que se Trackean Automáticamente

| Evento | Cuándo se dispara | Ubicación |
|--------|------------------|-----------|
| **view_item** | Al ver un producto | Página de producto |
| **affiliate_click** | Al hacer clic en "Comprar en Amazon" | Botones de compra |
| **blog_read** | Al leer un blog (3 seg) | Artículos del blog |
| **search** | Al buscar productos | Barra de búsqueda |
| **add_to_wishlist** | Al guardar favorito | Botón de favoritos |
| **sign_up** | Al registrarse | Página de login |
| **login** | Al iniciar sesión | Página de login |

---

## 🎯 Configurar Conversiones (Recomendado)

1. Ve a GA4 → **Configure** → **Events**
2. Busca `affiliate_click`
3. Activa el toggle **"Mark as conversion"**
4. Repite para `sign_up` si lo deseas

Esto te permitirá medir cuántos usuarios hacen clic en tus enlaces de afiliados.

---

## 📈 Ver Resultados

### Tiempo Real
**Reports → Realtime**
- Ve usuarios activos ahora
- Ve eventos ocurriendo en tiempo real

### Eventos
**Reports → Engagement → Events**
- Ve todos los eventos disparados
- Ordena por conteo para ver los más populares

### Conversiones
**Reports → Engagement → Conversions**
- Ve tus conversiones configuradas
- Analiza tasa de conversión

---

## ⚠️ Importante

- ✅ Google Analytics **solo funciona en producción**
- ✅ En desarrollo local (localhost) NO se carga
- ✅ Esto mantiene tus datos limpios

---

## 🐛 Solución de Problemas

### No veo eventos en GA4

**Verifica:**
1. ¿Estás en producción? (no localhost)
2. ¿La variable está en Netlify?
3. ¿Esperaste 24-48h? (primera vez puede tardar)

**Debug:**
1. Abre DevTools (F12)
2. Ve a Network
3. Filtra por "collect" o "analytics"
4. Deberías ver requests a Google

### Error: "gtag is not defined"

**Causa:** Estás en desarrollo local
**Solución:** Despliega a producción o espera

---

## 📚 Documentación Completa

- **Guía detallada:** `docs/GOOGLE_ANALYTICS.md`
- **Resumen de implementación:** `docs/IMPLEMENTACION_ANALYTICS.md`
- **Variables de entorno:** `.env.example`

---

## ✅ Checklist

- [ ] Variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` agregada en Netlify
- [ ] Código desplegado a producción
- [ ] Eventos visibles en Realtime de GA4
- [ ] `affiliate_click` marcado como conversión
- [ ] (Opcional) Informes personalizados creados

---

**¿Necesitas ayuda?** Consulta `docs/GOOGLE_ANALYTICS.md` para la documentación completa.
