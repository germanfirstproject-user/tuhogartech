# 🎨 AffiliPro Design System

## Visión General
Plataforma de afiliados moderna, profesional y de alto impacto. Inspirada en las mejores prácticas de plataformas como Impact, CJ Affiliate, ShareASale y Refersion.

## 🎯 Pilares del Diseño
- **Premium & Confianza**: Interfaz limpia y profesional
- **Contraste Inteligente**: Jerarquía visual clara
- **Micro-interacciones**: Feedback visual inmediato
- **Responsive First**: Perfecto en cualquier dispositivo
- **Accesibilidad**: WCAG AA compliant

---

## 🎨 Paleta de Colores

### Colores Primarios
- **Azul Principal (#2563eb)**: Para acciones primarias, botones CTA, links
- **Azul Oscuro (#1e40af)**: Estados hover/active
- **Azul Claro (#dbeafe)**: Backgrounds de información

### Colores Secundarios
- **Verde Éxito (#10b981)**: Confirmaciones, estados positivos
- **Naranja/Ámbar (#f59e0b)**: Alertas, llamadas importantes
- **Rojo Peligro (#ef4444)**: Errores, eliminación

### Neutrals (Gris Profesional)
```
Dark:        #0f172a (Casi negro)
Dark 2:      #1e293b (Gris muy oscuro - backgrounds)
Dark 3:      #334155 (Gris oscuro)
Text:        #1e293b (Texto principal)
Text Muted:  #64748b (Texto secundario)
Light:       #f8fafc (Blanco roto)
Border:      #e2e8f0 (Bordes)
```

### Gradientes Premium
- **Hero Gradient**: De azul (#2563eb) a púrpura (#9333ea)
- **Success Gradient**: De verde (#10b981) a esmeralda (#059669)
- **Card Gradient**: Overlay sutil para profundidad

---

## 📝 Tipografía

### Familias
- **Sans (UI)**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Mono (Code)**: SF Mono, Monaco, Roboto Mono

### Escala Tipográfica
```
H1: 36px (2.25rem) | Weight: 700 | Line: 1.2
H2: 30px (1.875rem) | Weight: 700 | Line: 1.2
H3: 24px (1.5rem) | Weight: 600 | Line: 1.3
H4: 20px (1.25rem) | Weight: 600 | Line: 1.4
Body: 16px (1rem) | Weight: 400 | Line: 1.5
Small: 14px (0.875rem) | Weight: 400 | Line: 1.5
Label: 12px (0.75rem) | Weight: 600 | Line: 1.4
```

---

## 🧩 Componentes Principales

### Buttons
**Primary (CTA Principal)**
- Background: Azul #2563eb
- Hover: Azul oscuro #1e40af
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600
- Transición: 150ms

**Secondary (Acciones Secundarias)**
- Background: Gris claro #f1f5f9
- Border: 1px gris #e2e8f0
- Hover: Gris más oscuro #e2e8f0
- Color: Texto oscuro

**Outlined (Links importantes)**
- Background: Transparente
- Border: 2px azul #2563eb
- Color: Azul #2563eb
- Hover: Background azul claro

### Cards
- Background: Blanco #ffffff
- Border: 1px #e2e8f0
- Border Radius: 12px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Hover Shadow: 0 10px 15px rgba(0,0,0,0.15)
- Transición hover: Scale 1.02 + Shadow increase

### Forms
- Input Height: 40px
- Input Padding: 10px 14px
- Border: 1px #e2e8f0
- Focus: Border azul + Shadow azul claro
- Error: Border rojo, background rojo claro
- Font: 14px, sin bold

### Badges
- Background: Azul claro #dbeafe
- Color: Azul oscuro #1e40af
- Padding: 6px 12px
- Border Radius: 20px
- Font: 12px semibold

---

## 📐 Espaciado

```
XS:    4px (0.25rem)
SM:    8px (0.5rem)
MD:   16px (1rem)
LG:   24px (1.5rem)
XL:   32px (2rem)
2XL:  48px (3rem)
3XL:  64px (4rem)
```

---

## 🎬 Animaciones

**Transiciones Estándar**
- Fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Normal: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Slow: 500ms cubic-bezier(0.4, 0, 0.2, 1)

**Micro-interacciones**
- Hover buttons: Scale 1.02 + Shadow
- Active states: Scale 0.98
- Loading: Spinner con azul
- Success feedback: Check verde con pulse

---

## 📱 Breakpoints

```
Mobile:   320px (base)
Tablet:   768px (md)
Desktop:  1024px (lg)
Wide:     1280px (xl)
```

---

## 🏗️ Layouts

### Header
- Height: 64px
- Background: Blanco #ffffff
- Border-bottom: 2px #e2e8f0
- Position: Sticky
- Z-index: 1000

### Hero Section (Home)
- Min Height: 500px
- Background: Gradiente azul a púrpura
- Color Text: Blanco
- Centered content
- CTA Button abajo

### Product Grid
- Desktop: 4 columnas
- Tablet: 3 columnas
- Mobile: 2 columnas
- Gap: 24px
- Card Hover: Lift effect + Shadow

### Footer
- Background: Gris oscuro #1e293b
- Color: Texto claro
- Multiple columns
- Sticky footer en desktop

---

## 🎯 Patrones de Interacción

### Hover Effects
- **Buttons**: Scale 1.02 + Shadow increase
- **Links**: Color azul + Underline
- **Cards**: Scale 1.02 + Shadow increase + Profundidad
- **Icons**: Rotate slight + Color change

### Focus States
- **Outline**: 2px azul con offset 2px
- **Box Shadow**: Color azul con opacity

### Loading States
- Spinner azul
- Opacity 0.6
- Disabled cursor

### Empty States
- Icon gris grande
- Headline clara
- Secondary text explicativo
- CTA button si aplica

---

## 🔍 Accesibilidad

- Contrast ratio mínimo 4.5:1
- Focus visible en todos los elementos interactivos
- Aria labels en imágenes
- Color no es el único indicador
- Motion respeta prefers-reduced-motion

---

## 📊 Sombras

```
SM:  0 1px 2px rgba(0,0,0,0.05)
MD:  0 4px 6px rgba(0,0,0,0.1)
LG:  0 10px 15px rgba(0,0,0,0.1)
XL:  0 20px 25px rgba(0,0,0,0.15)
2XL: 0 25px 50px rgba(0,0,0,0.25)
```

---

## 🚀 Next Steps

1. Aplicar esta paleta en todas las páginas
2. Crear componentes reutilizables en CSS modules
3. Asegurar consistencia en toda la plataforma
4. Test de accesibilidad WCAG AA
5. Performance optimization (LCP < 2.5s)
