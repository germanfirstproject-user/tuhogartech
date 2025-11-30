'use client';

import { useEffect } from 'react';

/**
 * Componente que renderiza contenido HTML de blogs con soporte para etiquetas <style>
 * Extrae los estilos, los aplica con scope y limpia el HTML
 */
export default function BlogContentRenderer({ content, blogId, className }) {
  useEffect(() => {
    if (!content) return;

    // Extraer etiquetas <style> del contenido
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const matches = content.match(styleRegex);
    
    if (matches && matches.length > 0) {
      matches.forEach((styleTag, index) => {
        // Extraer el contenido CSS (sin las etiquetas <style>)
        const cssContent = styleTag.replace(/<\/?style[^>]*>/gi, '');
        
        // Crear elemento <style> con atributos únicos para este blog
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-blog-id', blogId);
        styleElement.setAttribute('data-style-index', index);
        
        // Aplicar scope CSS: envolver selectores con el atributo data del contenedor
        // Esto evita que los estilos afecten a otros blogs o partes de la página
        const scopedCss = cssContent.replace(
          /([^{}]+)({[^}]*})/g,
          (match, selector, rules) => {
            const trimmedSelector = selector.trim();
            
            // No aplicar scope a reglas especiales (@media, @keyframes, etc.)
            if (trimmedSelector.startsWith('@')) {
              return match;
            }
            
            // No aplicar scope si ya tiene el atributo data
            if (trimmedSelector.includes(`[data-blog-content="${blogId}"]`)) {
              return match;
            }
            
            // Aplicar scope anteponiendo el selector del contenedor
            return `[data-blog-content="${blogId}"] ${trimmedSelector}${rules}`;
          }
        );
        
        styleElement.textContent = scopedCss;
        document.head.appendChild(styleElement);
      });
    }
    
    // Cleanup: remover estilos cuando el componente se desmonte
    return () => {
      const blogStyles = document.querySelectorAll(`style[data-blog-id="${blogId}"]`);
      blogStyles.forEach(style => style.remove());
    };
  }, [content, blogId]);
  
  // Limpiar etiquetas <style> del contenido HTML para evitar duplicación
  const cleanContent = content ? content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') : '';
  
  return (
    <div 
      className={className}
      data-blog-content={blogId}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}
