'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings } from '@/lib/supabase';
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
    site_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await getSiteSettings();
    if (result.success && result.data) {
      setSettings(result.data);
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
