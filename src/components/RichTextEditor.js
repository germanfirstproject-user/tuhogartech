'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { uploadBlogImage } from '@/lib/supabase';
import 'react-quill/dist/quill.snow.css';
import styles from './RichTextEditor.module.css';

// Importar React Quill dinámicamente para evitar problemas con SSR
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Cargando editor...</p>
});

export default function RichTextEditor({ value, onChange, placeholder = 'Escribe el contenido aquí...' }) {
  const quillRef = useRef(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || '');

  // Sincronizar htmlContent con value cuando cambia externamente
  useEffect(() => {
    if (!showHtml) {
      setHtmlContent(value || '');
    }
  }, [value, showHtml]);

  const toggleHtmlMode = () => {
    if (showHtml) {
      // Cambiar de HTML a visual
      onChange(htmlContent);
      setShowHtml(false);
    } else {
      // Cambiar de visual a HTML
      setHtmlContent(value || '');
      setShowHtml(true);
    }
  };

  const handleHtmlChange = (e) => {
    setHtmlContent(e.target.value);
    onChange(e.target.value);
  };

  // Agregar tooltips personalizados a los botones
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      // Agregar tooltip al botón de code-block
      const codeBlockButton = document.querySelector('.ql-code-block');
      if (codeBlockButton) {
        codeBlockButton.setAttribute('title', 'Bloque de Código - Haz clic para insertar/editar código');
        codeBlockButton.setAttribute('aria-label', 'Insertar bloque de código');
      }

      // Agregar tooltip al botón de blockquote
      const blockquoteButton = document.querySelector('.ql-blockquote');
      if (blockquoteButton) {
        blockquoteButton.setAttribute('title', 'Cita - Para texto destacado');
      }

      // Agregar tooltip al botón de link
      const linkButton = document.querySelector('.ql-link');
      if (linkButton) {
        linkButton.setAttribute('title', 'Insertar enlace');
      }

      // Agregar tooltip al botón de image
      const imageButton = document.querySelector('.ql-image');
      if (imageButton) {
        imageButton.setAttribute('title', 'Insertar imagen - Sube desde tu dispositivo');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handler para subir imágenes
  const imageHandler = function() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // Usar 'this' que apunta al objeto Quill
        const quill = this.quill;
        if (!quill) {
          alert('Editor no está listo. Intenta de nuevo.');
          return;
        }

        const range = quill.getSelection(true);
        const cursorPosition = range ? range.index : 0;
        
        // Mostrar mensaje de carga
        quill.insertText(cursorPosition, 'Subiendo imagen...', 'user');
        quill.setSelection(cursorPosition + 'Subiendo imagen...'.length);
        
        // Subir imagen
        const result = await uploadBlogImage(file);
        
        // Eliminar mensaje de carga
        quill.deleteText(cursorPosition, 'Subiendo imagen...'.length);
        
        if (result.success) {
          // Insertar imagen en el editor
          quill.insertEmbed(cursorPosition, 'image', result.data.url, 'user');
          quill.setSelection(cursorPosition + 1);
        } else {
          alert('Error al subir imagen: ' + result.error);
        }
      } catch (error) {
        console.error('Error en imageHandler:', error);
        alert('Error al procesar la imagen: ' + error.message);
      }
    };
  };

  // Configuración de módulos del editor
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.helpText}>
        💡 <strong>Consejo:</strong> Para insertar HTML con estilos, usa el botón "Modo HTML" y pega tu código directamente.
      </div>
      
      <div className={styles.editorControls}>
        <button 
          type="button"
          onClick={toggleHtmlMode} 
          className={styles.htmlToggle}
          title={showHtml ? "Cambiar a modo visual" : "Cambiar a modo HTML"}
        >
          {showHtml ? '👁️ Modo Visual' : '📝 Modo HTML'}
        </button>
      </div>

      {showHtml ? (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          className={styles.htmlEditor}
          placeholder="Pega tu HTML aquí..."
          spellCheck={false}
        />
      ) : (
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className={styles.editor}
        />
      )}
    </div>
  );
}
