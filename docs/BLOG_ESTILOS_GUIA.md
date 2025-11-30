# Soporte para Estilos CSS en Blogs

## 📋 Resumen

El sistema de blogs ahora soporta etiquetas `<style>` dentro del contenido HTML. Los estilos se procesan automáticamente con **scope** para evitar conflictos con otros elementos de la página.

## ✅ Cómo Funciona

### Antes (Problema)
```html
<!-- Los estilos NO se aplicaban correctamente -->
<style>
  .mi-clase { color: red; }
</style>
<div class="mi-clase">Texto rojo</div>
```

### Ahora (Solución)
El componente `BlogContentRenderer`:
1. **Extrae** todas las etiquetas `<style>` del contenido
2. **Aplica scope** automático a los selectores CSS
3. **Inyecta** los estilos en el `<head>` del documento
4. **Limpia** las etiquetas `<style>` del HTML para evitar duplicación
5. **Elimina** los estilos cuando sales del blog (cleanup)

## 🎯 Ejemplos de Uso

### Ejemplo 1: Estilos Básicos
```html
<style>
  .caja-destacada {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
  }
  
  .texto-importante {
    font-size: 1.2em;
    font-weight: bold;
    color: #764ba2;
  }
</style>

<div class="caja-destacada">
  <h3>¡Oferta Especial!</h3>
  <p class="texto-importante">50% de descuento este fin de semana</p>
</div>
```

### Ejemplo 2: Tabla Personalizada
```html
<style>
  .tabla-productos {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  
  .tabla-productos th {
    background: #4a5568;
    color: white;
    padding: 12px;
    text-align: left;
  }
  
  .tabla-productos td {
    padding: 10px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .tabla-productos tr:hover {
    background: #f7fafc;
  }
</style>

<table class="tabla-productos">
  <thead>
    <tr>
      <th>Producto</th>
      <th>Precio</th>
      <th>Rating</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>iPhone 15 Pro</td>
      <td>1099€</td>
      <td>⭐⭐⭐⭐⭐</td>
    </tr>
  </tbody>
</table>
```

### Ejemplo 3: Tarjetas de Comparación
```html
<style>
  .grid-comparacion {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 30px 0;
  }
  
  .tarjeta {
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s;
  }
  
  .tarjeta:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    border-color: #667eea;
  }
  
  .tarjeta h4 {
    color: #667eea;
    margin-top: 0;
  }
  
  .precio-grande {
    font-size: 2em;
    font-weight: bold;
    color: #2d3748;
  }
</style>

<div class="grid-comparacion">
  <div class="tarjeta">
    <h4>Básico</h4>
    <p class="precio-grande">29€</p>
    <p>Perfecto para principiantes</p>
  </div>
  <div class="tarjeta">
    <h4>Pro</h4>
    <p class="precio-grande">59€</p>
    <p>Para usuarios avanzados</p>
  </div>
</div>
```

### Ejemplo 4: Con Media Queries
```html
<style>
  .contenedor-responsive {
    display: flex;
    gap: 20px;
    margin: 20px 0;
  }
  
  .columna {
    flex: 1;
    padding: 15px;
    background: #f7fafc;
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    .contenedor-responsive {
      flex-direction: column;
    }
  }
</style>

<div class="contenedor-responsive">
  <div class="columna">
    <h4>Ventaja 1</h4>
    <p>Descripción...</p>
  </div>
  <div class="columna">
    <h4>Ventaja 2</h4>
    <p>Descripción...</p>
  </div>
</div>
```

## ⚙️ Características Técnicas

### Scope Automático
Los estilos se aplican solo al contenido del blog actual:
```css
/* Tu escribes: */
.mi-clase { color: red; }

/* Se convierte en: */
[data-blog-content="blog-123"] .mi-clase { color: red; }
```

### Cleanup Automático
- Los estilos se eliminan automáticamente cuando sales del blog
- No hay conflictos entre blogs diferentes
- No afectan a otros elementos de la página

### Soporte Completo
✅ Selectores de clase (`.mi-clase`)
✅ Selectores de ID (`#mi-id`)
✅ Selectores de elemento (`p`, `div`, `h1`)
✅ Pseudo-clases (`:hover`, `:focus`)
✅ Media queries (`@media`)
✅ Keyframes (`@keyframes`)
✅ Selectores combinados (`.clase1 .clase2`)

## 📝 Recomendaciones

### ✅ Buenas Prácticas
1. **Usa nombres de clase descriptivos y únicos**
   ```css
   .tutorial-paso-1 { ... }
   .comparativa-precio { ... }
   ```

2. **Agrupa los estilos al inicio del contenido**
   ```html
   <style>
     /* Todos tus estilos aquí */
   </style>
   
   <!-- Luego tu contenido -->
   <div>...</div>
   ```

3. **Evita !important si es posible**
   ```css
   /* Preferible */
   .mi-clase { color: red; }
   
   /* Evitar */
   .mi-clase { color: red !important; }
   ```

### ⚠️ Limitaciones
1. Los estilos solo afectan al contenido del blog actual (por diseño)
2. No puedes estilizar elementos fuera del contenido del blog
3. Los estilos se eliminan al salir del blog

## 🔧 Implementación Técnica

El componente responsable es `BlogContentRenderer`:
- **Ubicación**: `/src/components/BlogContentRenderer.js`
- **Tipo**: Client Component (`'use client'`)
- **Uso**: Automático en todas las páginas de blog

No necesitas hacer nada especial, simplemente escribe tu HTML con `<style>` en el editor y funcionará automáticamente.
