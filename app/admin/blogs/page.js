'use client';

import { useEffect, useState } from 'react';
import { supabase, getBlogs, insertBlog, updateBlog, deleteBlog, uploadBlogImage, deleteBlogImage } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';
import { slugify } from '@/lib/slug';
import styles from './page.module.css';

const BLOGS_PER_PAGE = 20;

// Firma por defecto de los artículos. No se usa el correo de la cuenta porque
// author_name es un dato público: aparece en la ficha y en los metadatos.
const AUTOR_POR_DEFECTO = 'Germán García';

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    featured_image_alt: '',
    category: '',
    tags: '',
    status: 'draft',
    author_name: AUTOR_POR_DEFECTO,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    const result = await getBlogs({}, 0);
    if (result.success) {
      setBlogs(result.data);
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Si hay una nueva imagen, subirla primero
      let featuredImageUrl = formData.featured_image;
      
      if (imageFile) {
        const uploadResult = await uploadBlogImage(imageFile);
        if (uploadResult.success) {
          featuredImageUrl = uploadResult.data.url;
          
          // Si estamos editando y había una imagen anterior, eliminarla
          if (editingBlog && editingBlog.featured_image) {
            await deleteBlogImage(editingBlog.featured_image);
          }
        } else {
          alert('Error al subir la imagen: ' + uploadResult.error);
          setUploading(false);
          return;
        }
      }

      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Preparar datos del blog limpiando campos vacíos
      const blogData = {
        title: formData.title,
        slug: formData.slug.trim() || slugify(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || '',
        featured_image: featuredImageUrl || '',
        featured_image_alt: formData.featured_image_alt || '',
        category: formData.category || '',
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        status: formData.status || 'draft',
        seo_title: formData.seo_title || '',
        seo_description: formData.seo_description || '',
        seo_keywords: formData.seo_keywords || '',
        og_title: formData.og_title || '',
        og_description: formData.og_description || '',
        og_image: formData.og_image || '',
        published_at: formData.status === 'published' ? (editingBlog?.published_at || new Date().toISOString()) : null,
        author_id: user?.id || null,
        // La firma sale del formulario. Antes se guardaba el correo de la
        // cuenta, que acababa publicado en la ficha, en el JSON-LD y en las
        // Twitter Cards de todos los artículos.
        author_name: formData.author_name.trim() || AUTOR_POR_DEFECTO,
      };

      let result;
      if (editingBlog) {
        console.log('Actualizando blog con ID:', editingBlog.id);
        console.log('Datos a enviar:', blogData);
        result = await updateBlog(editingBlog.id, blogData);
      } else {
        result = await insertBlog(blogData);
      }

      if (result.success) {
        alert(editingBlog ? 'Blog actualizado' : 'Blog creado');
        setShowForm(false);
        setEditingBlog(null);
        resetForm();
        loadBlogs();
      } else {
        console.error('Error completo:', result.error);
        alert('Error: ' + (result.error?.message || JSON.stringify(result.error)));
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      featured_image: blog.featured_image || '',
      featured_image_alt: blog.featured_image_alt || '',
      category: blog.category || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      status: blog.status || 'draft',
      author_name: blog.author_name || AUTOR_POR_DEFECTO,
      seo_title: blog.seo_title || '',
      seo_description: blog.seo_description || '',
      seo_keywords: blog.seo_keywords || '',
      og_title: blog.og_title || '',
      og_description: blog.og_description || '',
      og_image: blog.og_image || '',
    });
    setImagePreview(blog.featured_image || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id, blog) => {
    if (!confirm('¿Estás seguro de eliminar este blog?')) return;
    
    // Eliminar imagen destacada si existe
    if (blog.featured_image) {
      await deleteBlogImage(blog.featured_image);
    }
    
    const result = await deleteBlog(id);
    if (result.success) {
      alert('Blog eliminado');
      loadBlogs();
    } else {
      alert('Error al eliminar: ' + result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      featured_image_alt: '',
      category: '',
      tags: '',
      status: 'draft',
      author_name: AUTOR_POR_DEFECTO,
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingBlog(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
    resetForm();
  };

  if (loading) {
    return <div className={styles.container}><p>Cargando blogs...</p></div>;
  }

  // Paginación
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIdx = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIdx = startIdx + BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(startIdx, endIdx);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Blogs</h1>
        <div className={styles.headerInfo}>
          <span className={styles.totalCount}>{blogs.length} blogs totales</span>
          <button
            onClick={() => setShowForm(true)}
            className={styles.addButton}
          >
            ➕ Nuevo Blog
          </button>
        </div>
      </div>

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{editingBlog ? 'Editar Blog' : 'Nuevo Blog'}</h2>
              <button onClick={handleCancel} className={styles.closeButton}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <h3>Información Básica</h3>
                
                <div className={styles.formGroup}>
                  <label>Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Slug (URL-friendly, se genera automáticamente si se deja vacío)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="mi-primer-blog"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Extracto/Resumen</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Contenido *</label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value})}
                    placeholder="Escribe el contenido del blog aquí. Puedes añadir imágenes, código, formateo y más..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Categoría</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Autor (firma pública)</label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                    placeholder={AUTOR_POR_DEFECTO}
                  />
                  <small>
                    Se publica en el artículo, en el listado y en los datos
                    estructurados. No pongas aquí un correo electrónico.
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Tags (separados por comas)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="tecnología, reseñas, productos"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Imagen Destacada</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  {imagePreview && (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Vista previa" className={styles.previewImg} />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData({...formData, featured_image: ''});
                        }}
                        className={styles.removeImageBtn}
                      >
                        ✕ Quitar imagen
                      </button>
                    </div>
                  )}
                  <small className={styles.hint}>O pega una URL externa abajo</small>
                </div>

                <div className={styles.formGroup}>
                  <label>URL Imagen Externa (opcional)</label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => {
                      setFormData({...formData, featured_image: e.target.value});
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                        setImageFile(null);
                      }
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Alt Text Imagen</label>
                  <input
                    type="text"
                    value={formData.featured_image_alt}
                    onChange={(e) => setFormData({...formData, featured_image_alt: e.target.value})}
                    placeholder="Descripción de la imagen para SEO"
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>SEO Básico</h3>
                
                <div className={styles.formGroup}>
                  <label>Título SEO</label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                    maxLength={60}
                  />
                  <small>{formData.seo_title.length}/60 caracteres</small>
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción SEO</label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                    rows={3}
                    maxLength={160}
                  />
                  <small>{formData.seo_description.length}/160 caracteres</small>
                </div>

                <div className={styles.formGroup}>
                  <label>Palabras Clave (separadas por comas)</label>
                  <input
                    type="text"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData({...formData, seo_keywords: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Open Graph (Redes Sociales)</h3>
                
                <div className={styles.formGroup}>
                  <label>OG Título</label>
                  <input
                    type="text"
                    value={formData.og_title}
                    onChange={(e) => setFormData({...formData, og_title: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>OG Descripción</label>
                  <textarea
                    value={formData.og_description}
                    onChange={(e) => setFormData({...formData, og_description: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>OG Imagen</label>
                  <input
                    type="url"
                    value={formData.og_image}
                    onChange={(e) => setFormData({...formData, og_image: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingBlog ? 'Actualizar' : 'Crear'} Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.blogsGrid}>
        {currentBlogs.map((blog) => (
          <div key={blog.id} className={styles.blogCard}>
            {blog.featured_image && (
              <img src={blog.featured_image} alt={blog.featured_image_alt || blog.title} className={styles.blogImage} />
            )}
            <div className={styles.blogInfo}>
              <div className={styles.blogMeta}>
                <span className={`${styles.status} ${styles[blog.status]}`}>
                  {blog.status === 'published' ? '✓ Publicado' : blog.status === 'draft' ? '📝 Borrador' : '📦 Archivado'}
                </span>
                {blog.category && <span className={styles.category}>{blog.category}</span>}
              </div>
              <h3 className={styles.blogTitle}>{blog.title}</h3>
              <p className={styles.blogExcerpt}>{blog.excerpt || blog.content?.substring(0, 100) + '...'}</p>
              <div className={styles.blogFooter}>
                <small>{blog.views_count || 0} vistas</small>
                <div className={styles.blogActions}>
                  <button onClick={() => handleEdit(blog)} className={styles.editButton}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(blog.id, blog)} className={styles.deleteButton}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className={styles.empty}>
          <p>No hay blogs. ¡Crea el primero!</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            ← Anterior
          </button>
          
          <div className={styles.paginationNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`${styles.paginationNumber} ${currentPage === page ? styles.active : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
