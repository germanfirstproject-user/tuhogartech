'use client';

import { useEffect, useState } from 'react';
import { supabase, getBlogs, insertBlog, updateBlog, deleteBlog } from '@/lib/supabase';
import styles from './page.module.css';

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
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
    const result = await getBlogs();
    if (result.success) {
      setBlogs(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    
    const blogData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
      author_id: user?.id || null,
      author_name: user?.email || null,
    };

    let result;
    if (editingBlog) {
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
      seo_title: blog.seo_title || '',
      seo_description: blog.seo_description || '',
      seo_keywords: blog.seo_keywords || '',
      og_title: blog.og_title || '',
      og_description: blog.og_description || '',
      og_image: blog.og_image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este blog?')) return;
    
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
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
    resetForm();
  };

  if (loading) {
    return <div className={styles.container}><p>Cargando blogs...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Blogs</h1>
        <button
          onClick={() => setShowForm(true)}
          className={styles.addButton}
        >
          ➕ Nuevo Blog
        </button>
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
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={10}
                    required
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
                  <label>Tags (separados por comas)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="tecnología, reseñas, productos"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>URL Imagen Destacada</label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Alt Text Imagen</label>
                  <input
                    type="text"
                    value={formData.featured_image_alt}
                    onChange={(e) => setFormData({...formData, featured_image_alt: e.target.value})}
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
        {blogs.map((blog) => (
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
                  <button onClick={() => handleDelete(blog.id)} className={styles.deleteButton}>
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
    </div>
  );
}
