'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings, supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    home_title: '',
    home_description: '',
    home_keywords: '',
    home_og_title: '',
    home_og_description: '',
    home_og_image: '',
    home_twitter_title: '',
    home_twitter_description: '',
    home_twitter_image: '',
    site_name: '',
    site_url: '',
    hero_image_1: '',
    hero_image_1_mobile: '',
    hero_image_2: '',
    hero_image_2_mobile: '',
    hero_image_2_link: '',
    hero_image_2_alt: '',
    hero_image_3: '',
    hero_image_3_mobile: '',
    hero_image_3_link: '',
    hero_image_3_alt: '',
    hero_image_4: '',
    hero_image_4_mobile: '',
    hero_image_4_link: '',
    hero_image_4_alt: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await getSiteSettings();
    if (result.success && result.data) {
      setSettings(prev => ({
        ...prev,
        ...result.data
      }));
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e, imageKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ La imagen debe ser menor a 5MB');
      return;
    }

    setUploading(prev => ({ ...prev, [imageKey]: true }));
    setMessage('');

    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageKey}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      // Actualizar estado
      setSettings(prev => ({
        ...prev,
        [imageKey]: publicUrl
      }));

      setMessage(`✅ Imagen ${imageKey} subida correctamente`);
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('❌ Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  const handleDeleteImage = async (imageKey) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    setSettings(prev => ({
      ...prev,
      [imageKey]: ''
    }));
    setMessage('✅ Imagen eliminada (guarda para confirmar)');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const result = await updateSiteSettings(settings);
    
    if (result.success) {
      setMessage('✅ Configuración guardada correctamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('❌ Error al guardar: ' + result.error);
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configuración SEO</h1>
        <p className={styles.subtitle}>Gestiona el SEO de la página principal</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('❌') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Información General */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📋 Información General</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="site_name" className={styles.label}>
              Nombre del Sitio
            </label>
            <input
              type="text"
              id="site_name"
              name="site_name"
              value={settings.site_name || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej: AffiliPro"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="site_url" className={styles.label}>
              URL del Sitio
            </label>
            <input
              type="url"
              id="site_url"
              name="site_url"
              value={settings.site_url || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://ejemplo.com"
            />
          </div>
        </div>

        {/* SEO Básico */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🔍 SEO Básico (Home)</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="home_title" className={styles.label}>
              Meta Title
              <span className={styles.hint}>Recomendado: 50-60 caracteres</span>
            </label>
            <input
              type="text"
              id="home_title"
              name="home_title"
              value={settings.home_title || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="Encuentra los mejores productos al mejor precio"
              maxLength="60"
            />
            <span className={styles.charCount}>{settings.home_title?.length || 0}/60</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="home_description" className={styles.label}>
              Meta Description
              <span className={styles.hint}>Recomendado: 150-160 caracteres</span>
            </label>
            <textarea
              id="home_description"
              name="home_description"
              value={settings.home_description || ''}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Reseñas honestas, comparativas detalladas y ofertas exclusivas..."
              rows="3"
              maxLength="160"
            />
            <span className={styles.charCount}>{settings.home_description?.length || 0}/160</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="home_keywords" className={styles.label}>
              Keywords
              <span className={styles.hint}>Separadas por comas</span>
            </label>
            <input
              type="text"
              id="home_keywords"
              name="home_keywords"
              value={settings.home_keywords || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="productos, ofertas, comparativas, reseñas"
            />
          </div>
        </div>

        {/* Hero Carousel Images */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🎨 Hero Carousel - Imágenes</h2>
          <p className={styles.sectionDescription}>
            Configura las imágenes del carrusel de la página principal. La primera imagen muestra texto y botones, las otras 2-4 son solo imágenes con links opcionales.
          </p>

          {/* Imagen 1 - Hero con texto */}
          <div className={styles.imageUploadGroup}>
            <h3 className={styles.imageTitle}>Imagen 1 - Fondo del Hero (con texto y botones)</h3>
            <div className={styles.imagePreviewContainer}>
              {settings.hero_image_1 && (
                <div className={styles.imagePreview}>
                  <img src={settings.hero_image_1} alt="Hero background" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage('hero_image_1')}
                    className={styles.deleteImageButton}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
              <div className={styles.uploadControl}>
                <label className={styles.uploadButton}>
                  {uploading.hero_image_1 ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero_image_1')}
                    disabled={uploading.hero_image_1}
                    style={{ display: 'none' }}
                  />
                </label>
                <span className={styles.hint}>Recomendado: 1920x600px</span>
              </div>
            </div>

            <div className={styles.variantBlock}>
              <h4 className={styles.imageTitle}>Versión móvil (Imagen 1)</h4>
              <div className={styles.imagePreviewContainer}>
                {settings.hero_image_1_mobile && (
                  <div className={styles.imagePreview}>
                    <img src={settings.hero_image_1_mobile} alt="Hero background móvil" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage('hero_image_1_mobile')}
                      className={styles.deleteImageButton}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                )}
                <div className={styles.uploadControl}>
                  <label className={styles.uploadButton}>
                    {uploading.hero_image_1_mobile ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero_image_1_mobile')}
                      disabled={uploading.hero_image_1_mobile}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className={styles.hint}>Recomendado: 1080x1350px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen 2 */}
          <div className={styles.imageUploadGroup}>
            <h3 className={styles.imageTitle}>Imagen 2 - Slide Completo</h3>
            <div className={styles.imagePreviewContainer}>
              {settings.hero_image_2 && (
                <div className={styles.imagePreview}>
                  <img src={settings.hero_image_2} alt="Slide 2" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage('hero_image_2')}
                    className={styles.deleteImageButton}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
              <div className={styles.uploadControl}>
                <label className={styles.uploadButton}>
                  {uploading.hero_image_2 ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero_image_2')}
                    disabled={uploading.hero_image_2}
                    style={{ display: 'none' }}
                  />
                </label>
                <span className={styles.hint}>Recomendado: 1920x600px</span>
              </div>
            </div>

            <div className={styles.variantBlock}>
              <h4 className={styles.imageTitle}>Versión móvil (Imagen 2)</h4>
              <div className={styles.imagePreviewContainer}>
                {settings.hero_image_2_mobile && (
                  <div className={styles.imagePreview}>
                    <img src={settings.hero_image_2_mobile} alt="Slide 2 móvil" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage('hero_image_2_mobile')}
                      className={styles.deleteImageButton}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                )}
                <div className={styles.uploadControl}>
                  <label className={styles.uploadButton}>
                    {uploading.hero_image_2_mobile ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero_image_2_mobile')}
                      disabled={uploading.hero_image_2_mobile}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className={styles.hint}>Recomendado: 1080x1350px</span>
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hero_image_2_link" className={styles.label}>
                Link de destino (opcional)
              </label>
              <input
                type="url"
                id="hero_image_2_link"
                name="hero_image_2_link"
                value={settings.hero_image_2_link || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://ejemplo.com/producto"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hero_image_2_alt" className={styles.label}>
                Texto alternativo (ALT)
              </label>
              <input
                type="text"
                id="hero_image_2_alt"
                name="hero_image_2_alt"
                value={settings.hero_image_2_alt || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="Descripción de la imagen"
              />
            </div>
          </div>

          {/* Imagen 3 */}
          <div className={styles.imageUploadGroup}>
            <h3 className={styles.imageTitle}>Imagen 3 - Slide Completo</h3>
            <div className={styles.imagePreviewContainer}>
              {settings.hero_image_3 && (
                <div className={styles.imagePreview}>
                  <img src={settings.hero_image_3} alt="Slide 3" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage('hero_image_3')}
                    className={styles.deleteImageButton}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
              <div className={styles.uploadControl}>
                <label className={styles.uploadButton}>
                  {uploading.hero_image_3 ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero_image_3')}
                    disabled={uploading.hero_image_3}
                    style={{ display: 'none' }}
                  />
                </label>
                <span className={styles.hint}>Recomendado: 1920x600px</span>
              </div>
            </div>

            <div className={styles.variantBlock}>
              <h4 className={styles.imageTitle}>Versión móvil (Imagen 3)</h4>
              <div className={styles.imagePreviewContainer}>
                {settings.hero_image_3_mobile && (
                  <div className={styles.imagePreview}>
                    <img src={settings.hero_image_3_mobile} alt="Slide 3 móvil" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage('hero_image_3_mobile')}
                      className={styles.deleteImageButton}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                )}
                <div className={styles.uploadControl}>
                  <label className={styles.uploadButton}>
                    {uploading.hero_image_3_mobile ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero_image_3_mobile')}
                      disabled={uploading.hero_image_3_mobile}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className={styles.hint}>Recomendado: 1080x1350px</span>
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hero_image_3_link" className={styles.label}>
                Link de destino (opcional)
              </label>
              <input
                type="url"
                id="hero_image_3_link"
                name="hero_image_3_link"
                value={settings.hero_image_3_link || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://ejemplo.com/producto"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hero_image_3_alt" className={styles.label}>
                Texto alternativo (ALT)
              </label>
              <input
                type="text"
                id="hero_image_3_alt"
                name="hero_image_3_alt"
                value={settings.hero_image_3_alt || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="Descripción de la imagen"
              />
            </div>
          </div>

          {/* Imagen 4 */}
          <div className={styles.imageUploadGroup}>
            <h3 className={styles.imageTitle}>Imagen 4 - Slide Completo</h3>
            <div className={styles.imagePreviewContainer}>
              {settings.hero_image_4 && (
                <div className={styles.imagePreview}>
                  <img src={settings.hero_image_4} alt="Slide 4" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage('hero_image_4')}
                    className={styles.deleteImageButton}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
              <div className={styles.uploadControl}>
                <label className={styles.uploadButton}>
                  {uploading.hero_image_4 ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero_image_4')}
                    disabled={uploading.hero_image_4}
                    style={{ display: 'none' }}
                  />
                </label>
                <span className={styles.hint}>Recomendado: 1920x600px</span>
              </div>
            </div>

            <div className={styles.variantBlock}>
              <h4 className={styles.imageTitle}>Versión móvil (Imagen 4)</h4>
              <div className={styles.imagePreviewContainer}>
                {settings.hero_image_4_mobile && (
                  <div className={styles.imagePreview}>
                    <img src={settings.hero_image_4_mobile} alt="Slide 4 móvil" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage('hero_image_4_mobile')}
                      className={styles.deleteImageButton}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                )}
                <div className={styles.uploadControl}>
                  <label className={styles.uploadButton}>
                    {uploading.hero_image_4_mobile ? 'Subiendo...' : '📤 Seleccionar Imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero_image_4_mobile')}
                      disabled={uploading.hero_image_4_mobile}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className={styles.hint}>Recomendado: 1080x1350px</span>
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hero_image_4_link" className={styles.label}>
                Link de destino (opcional)
              </label>
              <input
                type="url"
                id="hero_image_4_link"
                name="hero_image_4_link"
                value={settings.hero_image_4_link || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://ejemplo.com/producto"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hero_image_4_alt" className={styles.label}>
                Texto alternativo (ALT)
              </label>
              <input
                type="text"
                id="hero_image_4_alt"
                name="hero_image_4_alt"
                value={settings.hero_image_4_alt || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="Descripción de la imagen"
              />
            </div>
          </div>
        </div>

        {/* Open Graph */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📱 Open Graph (Facebook, LinkedIn)</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="home_og_title" className={styles.label}>
              OG Title
            </label>
            <input
              type="text"
              id="home_og_title"
              name="home_og_title"
              value={settings.home_og_title || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="Deja vacío para usar el Meta Title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="home_og_description" className={styles.label}>
              OG Description
            </label>
            <textarea
              id="home_og_description"
              name="home_og_description"
              value={settings.home_og_description || ''}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Deja vacío para usar la Meta Description"
              rows="2"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="home_og_image" className={styles.label}>
              OG Image URL
              <span className={styles.hint}>Recomendado: 1200x630px</span>
            </label>
            <input
              type="url"
              id="home_og_image"
              name="home_og_image"
              value={settings.home_og_image || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://ejemplo.com/og-image.jpg"
            />
          </div>
        </div>

        {/* Twitter Card */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🐦 Twitter Card</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="home_twitter_title" className={styles.label}>
              Twitter Title
            </label>
            <input
              type="text"
              id="home_twitter_title"
              name="home_twitter_title"
              value={settings.home_twitter_title || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="Deja vacío para usar el Meta Title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="home_twitter_description" className={styles.label}>
              Twitter Description
            </label>
            <textarea
              id="home_twitter_description"
              name="home_twitter_description"
              value={settings.home_twitter_description || ''}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Deja vacío para usar la Meta Description"
              rows="2"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="home_twitter_image" className={styles.label}>
              Twitter Image URL
              <span className={styles.hint}>Recomendado: 1200x675px</span>
            </label>
            <input
              type="url"
              id="home_twitter_image"
              name="home_twitter_image"
              value={settings.home_twitter_image || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://ejemplo.com/twitter-image.jpg"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={saving}
          >
            {saving ? 'Guardando...' : '💾 Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}
