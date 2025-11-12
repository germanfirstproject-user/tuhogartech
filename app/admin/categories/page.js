'use client';

import { useEffect, useState } from 'react';
import { supabase, getCategories, insertCategory, updateCategory, deleteCategory, uploadCategoryImage, deleteCategoryImage } from '@/lib/supabase';
import styles from './page.module.css';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    image_alt: '',
    icon: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    display_order: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const result = await getCategories();
    if (result.success) {
      setCategories(result.data);
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

    let imageUrl = formData.image_url;

    // Si hay una nueva imagen, subirla
    if (imageFile) {
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
      const uploadResult = await uploadCategoryImage(imageFile, slug);
      
      if (uploadResult.success) {
        imageUrl = uploadResult.data.url;
        
        // Si estamos editando y había una imagen anterior, eliminarla
        if (editingCategory && editingCategory.image_url && editingCategory.image_url !== imageUrl) {
          await deleteCategoryImage(editingCategory.image_url);
        }
      } else {
        alert('Error al subir la imagen: ' + uploadResult.error);
        setUploading(false);
        return;
      }
    }

    const categoryData = {
      name: formData.name,
      slug: formData.slug || undefined, // Se genera automáticamente si está vacío
      description: formData.description || null,
      image_url: imageUrl || null,
      image_alt: formData.image_alt || null,
      icon: formData.icon || null,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      seo_keywords: formData.seo_keywords || null,
      og_title: formData.og_title || null,
      og_description: formData.og_description || null,
      og_image: formData.og_image || imageUrl || null,
      display_order: parseInt(formData.display_order) || 0,
      is_active: formData.is_active,
    };

    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, categoryData);
    } else {
      result = await insertCategory(categoryData);
    }

    if (result.success) {
      alert(editingCategory ? 'Categoría actualizada' : 'Categoría creada');
      setShowForm(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } else {
      console.error('Error completo:', result.error);
      alert('Error: ' + (result.error?.message || JSON.stringify(result.error)));
    }

    setUploading(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image_url: category.image_url || '',
      image_alt: category.image_alt || '',
      icon: category.icon || '',
      seo_title: category.seo_title || '',
      seo_description: category.seo_description || '',
      seo_keywords: category.seo_keywords || '',
      og_title: category.og_title || '',
      og_description: category.og_description || '',
      og_image: category.og_image || '',
      display_order: category.display_order || 0,
      is_active: category.is_active !== false,
    });
    setImagePreview(category.image_url || '');
    setShowForm(true);
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    // Eliminar imagen si existe
    if (imageUrl) {
      await deleteCategoryImage(imageUrl);
    }

    const result = await deleteCategory(id);
    if (result.success) {
      alert('Categoría eliminada');
      loadCategories();
    } else {
      alert('Error al eliminar: ' + result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      image_alt: '',
      icon: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      display_order: 0,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    resetForm();
  };

  if (loading) {
    return <div className={styles.container}><p>Cargando categorías...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Categorías</h1>
        <button
          onClick={() => setShowForm(true)}
          className={styles.addButton}
        >
          ➕ Nueva Categoría
        </button>
      </div>

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button onClick={handleCancel} className={styles.closeButton}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <h3>Información Básica</h3>
                
                <div className={styles.formGroup}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Slug (opcional, se genera automáticamente)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="categoria-ejemplo"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Icono / Emoji</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      placeholder="🛍️"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Orden</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    Categoría activa
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Imagen</h3>
                
                <div className={styles.formGroup}>
                  <label>Subir Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Texto alternativo de la imagen</label>
                  <input
                    type="text"
                    value={formData.image_alt}
                    onChange={(e) => setFormData({...formData, image_alt: e.target.value})}
                    placeholder="Descripción de la imagen"
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>SEO</h3>
                
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
                <h3>Open Graph / Redes Sociales</h3>
                
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
                  <label>OG Imagen URL (o se usará la imagen principal)</label>
                  <input
                    type="url"
                    value={formData.og_image}
                    onChange={(e) => setFormData({...formData, og_image: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={handleCancel} className={styles.cancelButton} disabled={uploading}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={uploading}>
                  {uploading ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Crear')} Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryCard}>
            {category.image_url && (
              <div className={styles.categoryImageContainer}>
                <img src={category.image_url} alt={category.image_alt || category.name} className={styles.categoryImage} />
              </div>
            )}
            <div className={styles.categoryInfo}>
              <div className={styles.categoryHeader}>
                {category.icon && <span className={styles.categoryIcon}>{category.icon}</span>}
                <h3 className={styles.categoryName}>{category.name}</h3>
              </div>
              {category.description && (
                <p className={styles.categoryDescription}>{category.description}</p>
              )}
              <div className={styles.categoryMeta}>
                <span className={styles.categorySlug}>/{category.slug}</span>
                <span className={category.is_active ? styles.statusActive : styles.statusInactive}>
                  {category.is_active ? '✓ Activa' : '✕ Inactiva'}
                </span>
              </div>
              <div className={styles.categoryActions}>
                <button onClick={() => handleEdit(category)} className={styles.editButton}>
                  ✏️ Editar
                </button>
                <button onClick={() => handleDelete(category.id, category.image_url)} className={styles.deleteButton}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className={styles.empty}>
          <p>No hay categorías. ¡Crea la primera!</p>
        </div>
      )}
    </div>
  );
}
