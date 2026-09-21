'use client';

import { useEffect, useRef, useState } from 'react';
import { uploadBlogImage } from '@/lib/supabase';
import styles from './RichTextEditor.module.css';

/**
 * Editor del contenido de los artículos: HTML a mano y nada más.
 *
 * Antes esto montaba React Quill y el modo HTML era un botón opcional. Se quitó
 * el editor visual porque Quill normaliza el contenido contra su lista blanca de
 * formatos nada más cargarlo, y esa lista no incluye `table` ni `div`: bastaba
 * con abrir un artículo en el panel para que el siguiente guardado se llevara por
 * delante las tablas, los bloques `data-note`, `data-verdict` y `data-scroll`, la
 * entradilla `data-lede` y el `alt` de las imágenes del cuerpo. Y no se puede
 * arreglar declarando el formato: `react-quill@2` monta Quill 1.3.7, que no sabe
 * representar una tabla de ninguna manera.
 *
 * Los artículos se escriben en HTML, así que el editor visual no aportaba nada
 * que no se pudiera hacer aquí, y sí destruía trabajo ya publicado.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escribe el contenido del artículo en HTML...',
}) {
  const textareaRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  // Posición del cursor a restaurar tras insertar una imagen, o null.
  const [cursorPendiente, setCursorPendiente] = useState(null);

  // Tras insertar una etiqueta el textarea se repinta con el valor nuevo y el
  // cursor se iría al principio; lo devolvemos a donde estaba escribiendo.
  useEffect(() => {
    if (cursorPendiente === null) return;
    const area = textareaRef.current;
    if (area) {
      area.focus();
      area.setSelectionRange(cursorPendiente, cursorPendiente);
    }
    setCursorPendiente(null);
  }, [cursorPendiente]);

  const handleChange = (e) => onChange(e.target.value);

  /** Sube una imagen al bucket e inserta su etiqueta donde esté el cursor. */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo fichero
    if (!file) return;

    // El alt se pide aquí y no después porque una imagen sin alt no se nota al
    // revisar el artículo, pero es un fallo de accesibilidad y de SEO.
    const alt = window.prompt('Describe la imagen (texto alternativo):', '');
    if (alt === null) return;

    setSubiendo(true);
    try {
      const result = await uploadBlogImage(file);
      if (!result.success) {
        alert('Error al subir la imagen: ' + result.error);
        return;
      }

      const etiqueta = `\n<img src="${result.data.url}" alt="${alt.replace(/"/g, '&quot;')}" />\n`;
      const area = textareaRef.current;
      const actual = value || '';
      const desde = area ? area.selectionStart : actual.length;
      const hasta = area ? area.selectionEnd : actual.length;

      onChange(actual.slice(0, desde) + etiqueta + actual.slice(hasta));
      setCursorPendiente(desde + etiqueta.length);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al procesar la imagen: ' + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.helpText}>
        💡 <strong>Consejo:</strong> el contenido se escribe en HTML. Puedes usar
        tablas, <code>data-lede</code>, <code>data-note</code>,{' '}
        <code>data-verdict</code> y <code>data-scroll</code>, que el artículo
        pinta con estilo propio.
      </div>

      <div className={styles.editorControls}>
        <label className={styles.uploadButton}>
          {subiendo ? '⏳ Subiendo…' : '🖼️ Subir imagen'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={subiendo}
            className={styles.uploadInput}
          />
        </label>
      </div>

      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={handleChange}
        className={styles.htmlEditor}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
}
