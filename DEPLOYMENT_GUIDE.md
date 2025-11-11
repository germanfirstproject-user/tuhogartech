# 🌐 DEPLOYMENT GUIDE

## Plataformas Soportadas

- ✅ **Vercel** (Recomendado - creadores de Next.js)
- ✅ **Netlify** (Con configuración extra)
- ✅ **Self-hosted** (VPS, Docker, etc.)

---

## 📍 OPCIÓN 1: VERCEL (RECOMENDADO)

### Paso 1: Conectar GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Haz login con GitHub
3. Click "New Project"
4. Selecciona tu repositorio `charm-link-finder-main`
5. Click "Import"

### Paso 2: Configurar Variables de Entorno

1. En Vercel, ve a **Settings** → **Environment Variables**
2. Agrega:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
```
3. Click "Add"

### Paso 3: Deploy

1. Click "Deploy"
2. Espera 2-3 minutos
3. ✅ Tu app está en vivo en `https://your-app.vercel.app`

### Ventajas Vercel
- ✅ Deploy automático en cada push a main
- ✅ Previews de PRs
- ✅ Analytics gratis
- ✅ Serverless (sin configuración)
- ✅ Edge Functions
- ✅ CDN global

---

## 📍 OPCIÓN 2: NETLIFY

### Paso 1: Conectar GitHub

1. Ve a [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Autoriza GitHub y selecciona repositorio

### Paso 2: Configurar Build

```
Build command: npm run build
Publish directory: .next
```

### Paso 3: Environment Variables

1. **Settings** → **Build & deploy** → **Environment**
2. Agrega variables Supabase (igual que Vercel)

### Paso 4: Deploy

1. Netlify automáticamente hace deploy
2. ✅ Tu app en `https://your-app.netlify.app`

---

## 📍 OPCIÓN 3: SELF-HOSTED (VPS)

### Requisitos

- VPS con Ubuntu 20.04+
- Node.js 18+
- npm
- PM2 o supervisor (opcional)
- Nginx (reverse proxy)

### Paso 1: Clonar repositorio

```bash
git clone https://github.com/tuusuario/charm-link-finder-main.git
cd charm-link-finder-main
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Paso 4: Build para producción

```bash
npm run build
```

### Paso 5: Ejecutar con PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Crear app.js
cat > app.js << 'EOF'
const { spawn } = require('child_process');
const app = spawn('npm', ['start']);
EOF

# Iniciar con PM2
pm2 start npm --name "affilipro" -- start

# Auto-start en reboot
pm2 startup
pm2 save
```

### Paso 6: Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Verificar configuración
sudo nginx -t

# Reiniciar nginx
sudo systemctl restart nginx

# SSL con Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 CHECKLIST PRE-DEPLOYMENT

- [ ] `.env.local` NO está versionado (en `.gitignore`)
- [ ] Variables de entorno están en `.gitignore`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` es correcta
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` es correcta
- [ ] Build local pasa sin errores: `npm run build`
- [ ] Proyecto está en GitHub
- [ ] Credenciales Supabase son seguras
- [ ] DNS apunta a tu servidor/Vercel

---

## 📊 MONITORING POST-DEPLOYMENT

### Logs en Vercel
```
Vercel Dashboard → Deployments → Click en deploy → Logs
```

### Logs en Self-Hosted
```bash
pm2 logs affilipro
```

### Monitoreo de Performance
```
Vercel: Analytics incluidas
Netlify: Analytics incluidas
Self-hosted: Agregar Sentry o New Relic (opcional)
```

---

## 🔄 ACTUALIZACIONES

### Desde Vercel
1. Push a GitHub
2. Vercel automáticamente re-deploya

### Desde Netlify
1. Push a GitHub
2. Netlify automáticamente re-deploya

### Self-Hosted
```bash
git pull origin main
npm run build
pm2 restart affilipro
```

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot find module '@/lib/supabase'"

**Solución:** Verifica que `jsconfig.json` tiene alias `@`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Error: "Supabase credentials not found"

**Solución:** Verifica que env vars están en deployment (no local)

### Error: "CORS issues"

**Solución:** En Supabase Settings → Allowed origins:
```
https://your-domain.com
https://your-domain.vercel.app
https://your-domain.netlify.app
```

---

## 📈 MÉTRICAS ESPERADAS POST-DEPLOYMENT

```
First Contentful Paint:    < 1.5s
Largest Contentful Paint:  < 2.5s
Cumulative Layout Shift:   < 0.1
Lighthouse Score:          > 90
Bundle Size:               87.4 kB
```

---

## 🎉 ¡DEPLOYMENT EXITOSO!

Tu AffiliPro está vivo en producción. Ahora:

1. ✅ Verifica que login funciona: `/login`
2. ✅ Verifica que puedes hacer admin via SQL
3. ✅ Verifica redirección automática a `/admin`
4. ✅ Verifica que home muestra admin section
5. ✅ Prueba logout

¡Listo para producción! 🚀
