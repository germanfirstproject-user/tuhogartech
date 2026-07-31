'use client';

import { useEffect, useState } from 'react';
import { getProducts, insertProduct, updateProduct, deleteProduct, getProductSeo, upsertProductSeo, getCategories, getSiteSettings } from '@/lib/supabase';
import styles from './page.module.css';

const PRODUCTS_PER_PAGE = 30;

// Google corta el título alrededor de los 60 caracteres.
const LIMITE_TITULO_SERP = 60;

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSeoProduct, setEditingSeoProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [siteName, setSiteName] = useState('Tu Hogar Tech');
  const [seoFormData, setSeoFormData] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'product',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    meta_robots: 'index, follow',
  });
  const [formData, setFormData] = useState({
    id: '',
    asin: '',
    title: '',
    brand: '',
    price: '',
    currency: 'EUR',
    rating: '',
    reviews_count: '',
    images: '',
    features: '',
    specs: '',
    description: '',
    pros: '',
    cons: '',
    category: '',
    subcategory: '',
    stock: 'in_stock',
    affiliate_link: '',
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
    // El nombre del sitio se necesita para calcular el título real que verá
    // Google: la plantilla del layout le añade " | <nombre del sitio>".
    getSiteSettings().then((result) => {
      if (result.success && result.data?.site_name) setSiteName(result.data.site_name);
    });
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    const result = await getCategories();
    if (result.success) {
      // Filtrar solo categorías activas para el dropdown
      setCategories(result.data.filter(cat => cat.is_active));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parsear campos especiales
    let parsedSpecs = {};
    if (formData.specs) {
      try {
        parsedSpecs = JSON.parse(formData.specs);
      } catch (err) {
        alert('Error en el formato JSON de especificaciones');
        return;
      }
    }

    const productData = {
      asin: formData.asin,
      title: formData.title,
      brand: formData.brand || null,
      // Vacío significa "sin precio", no "cero": con 0 la ficha mostraría "0 €".
      price: formData.price === '' || formData.price === null ? null : parseFloat(formData.price),
      currency: formData.currency || 'EUR',
      rating: formData.rating ? parseFloat(formData.rating) : null,
      reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : 0,
      images: formData.images ? formData.images.split(',').map(url => url.trim()).filter(url => url) : [],
      features: formData.features ? formData.features.split('\n').map(f => f.trim()).filter(f => f) : [],
      specs: parsedSpecs,
      description: formData.description || null,
      pros: formData.pros ? formData.pros.split('\n').map(p => p.trim()).filter(p => p) : [],
      cons: formData.cons ? formData.cons.split('\n').map(c => c.trim()).filter(c => c) : [],
      category: formData.category,
      subcategory: formData.subcategory || null,
      stock: formData.stock || 'in_stock',
      affiliate_link: formData.affiliate_link || null,
    };

    // Solo incluir ID al crear, no al actualizar
    if (!editingProduct && formData.id) {
      productData.id = formData.id;
    }

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
    } else {
      result = await insertProduct(productData);
    }

    if (result.success) {
      alert(editingProduct ? 'Producto actualizado' : 'Producto creado');
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } else {
      console.error('Error completo:', result.error);
      alert('Error: ' + (result.error?.message || JSON.stringify(result.error)));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id || '',
      asin: product.asin || '',
      title: product.title || '',
      brand: product.brand || '',
      price: product.price == null ? '' : String(product.price),
      currency: product.currency || 'EUR',
      rating: product.rating || '',
      reviews_count: product.reviews_count || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      features: Array.isArray(product.features) ? product.features.join('\n') : '',
      specs: product.specs ? JSON.stringify(product.specs, null, 2) : '',
      description: product.description || '',
      pros: Array.isArray(product.pros) ? product.pros.join('\n') : '',
      cons: Array.isArray(product.cons) ? product.cons.join('\n') : '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      stock: product.stock || 'in_stock',
      affiliate_link: product.affiliate_link || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    const result = await deleteProduct(id);
    if (result.success) {
      alert('Producto eliminado');
      loadProducts();
    } else {
      alert('Error al eliminar: ' + result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      asin: '',
      title: '',
      brand: '',
      price: '',
      currency: 'EUR',
      rating: '',
      reviews_count: '',
      images: '',
      features: '',
      specs: '',
      description: '',
      pros: '',
      cons: '',
      category: '',
      subcategory: '',
      stock: 'in_stock',
      affiliate_link: '',
    });
  };

  // SEO Modal Functions
  const handleEditSeo = async (product) => {
    setEditingSeoProduct(product);
    
    // Cargar SEO existente
    const result = await getProductSeo(product.id);
    if (result.success && result.data) {
      setSeoFormData({
        seo_title: result.data.seo_title || '',
        seo_description: result.data.seo_description || '',
        seo_keywords: result.data.seo_keywords || '',
        og_title: result.data.og_title || '',
        og_description: result.data.og_description || '',
        og_image: result.data.og_image || '',
        og_type: result.data.og_type || 'product',
        twitter_card: result.data.twitter_card || 'summary_large_image',
        twitter_title: result.data.twitter_title || '',
        twitter_description: result.data.twitter_description || '',
        twitter_image: result.data.twitter_image || '',
        canonical_url: result.data.canonical_url || '',
        meta_robots: result.data.meta_robots || 'index, follow',
      });
    } else {
      // Valores por defecto si no hay SEO
      setSeoFormData({
        seo_title: product.title || '',
        seo_description: product.description || '',
        seo_keywords: '',
        og_title: product.title || '',
        og_description: product.description || '',
        og_image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
        og_type: 'product',
        twitter_card: 'summary_large_image',
        twitter_title: product.title || '',
        twitter_description: product.description || '',
        twitter_image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
        canonical_url: '',
        meta_robots: 'index, follow',
      });
    }
    
    setShowSeoModal(true);
  };

  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    
    const result = await upsertProductSeo(editingSeoProduct.id, seoFormData);
    
    if (result.success) {
      alert('SEO actualizado correctamente');
      setShowSeoModal(false);
      setEditingSeoProduct(null);
    } else {
      alert('Error al actualizar SEO: ' + result.error);
    }
  };

  const handleCloseSeoModal = () => {
    setShowSeoModal(false);
    setEditingSeoProduct(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  if (loading) {
    return <div className={styles.container}><p>Cargando productos...</p></div>;
  }

  // El layout envuelve el título en la plantilla "%s | <nombre del sitio>", así
  // que el presupuesto real es menor que los 60 que cuenta Google.
  const sufijoTitulo = ` | ${siteName}`;
  const maxTituloSeo = Math.max(20, LIMITE_TITULO_SERP - sufijoTitulo.length);
  const tituloCompleto = seoFormData.seo_title
    ? `${seoFormData.seo_title}${sufijoTitulo}`
    : '';

  // Búsqueda: sin ella hay que pasar 10 páginas para llegar a un producto
  const query = searchTerm.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter((product) =>
        [product.title, product.brand, product.category, product.asin, product.id]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query))
      )
    : products;

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIdx, endIdx);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Productos</h1>
        <div className={styles.headerInfo}>
          <span className={styles.totalCount}>
            {query
              ? `${filteredProducts.length} de ${products.length} productos`
              : `${products.length} productos totales`}
          </span>
          <button
            onClick={() => setShowForm(true)}
            className={styles.addButton}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por título, marca, categoría, ASIN o ID…"
          className={styles.searchInput}
          aria-label="Buscar productos"
        />
      </div>

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={handleCancel} className={styles.closeButton}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <h3>Identificadores</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>ID (auto-generado si está vacío)</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({...formData, id: e.target.value})}
                      placeholder="Ej: prod-123"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>ASIN *</label>
                    <input
                      type="text"
                      value={formData.asin}
                      onChange={(e) => setFormData({...formData, asin: e.target.value})}
                      required
                      placeholder="Código ASIN de Amazon"
                    />
                  </div>
                </div>
              </div>

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

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Marca</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Categoría *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Subcategoría</label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Stock</label>
                    <select
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    >
                      <option value="in_stock">En stock</option>
                      <option value="out_of_stock">Sin stock</option>
                      <option value="limited">Stock limitado</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Precio y Valoraciones</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Vacío = no mostrar precio"
                    />
                    <small>
                      Déjalo vacío y la ficha no muestra precio. Es lo recomendable:
                      los precios de Amazon cambian y no se pueden reproducir.
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Moneda</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Valoración (0-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Número de reseñas</label>
                    <input
                      type="number"
                      value={formData.reviews_count}
                      onChange={(e) => setFormData({...formData, reviews_count: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Multimedia y Enlaces</h3>
                
                <div className={styles.formGroup}>
                  <label>URLs de Imágenes (separadas por comas)</label>
                  <textarea
                    value={formData.images}
                    onChange={(e) => setFormData({...formData, images: e.target.value})}
                    rows={2}
                    placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Link de Afiliado *</label>
                  <input
                    type="url"
                    value={formData.affiliate_link}
                    onChange={(e) => setFormData({...formData, affiliate_link: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Características y Especificaciones</h3>
                
                <div className={styles.formGroup}>
                  <label>Características (una por línea)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    rows={5}
                    placeholder="Pantalla de 6.5 pulgadas&#10;Batería de larga duración&#10;Cámara de alta resolución"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Especificaciones Técnicas (JSON)</label>
                  <textarea
                    value={formData.specs}
                    onChange={(e) => setFormData({...formData, specs: e.target.value})}
                    rows={5}
                    placeholder='{"peso": "250g", "dimensiones": "15x8x0.8cm", "color": "Negro"}'
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Pros y Contras</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ventajas (una por línea)</label>
                    <textarea
                      value={formData.pros}
                      onChange={(e) => setFormData({...formData, pros: e.target.value})}
                      rows={4}
                      placeholder="Excelente relación calidad-precio&#10;Fácil de usar&#10;Diseño elegante"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Desventajas (una por línea)</label>
                    <textarea
                      value={formData.cons}
                      onChange={(e) => setFormData({...formData, cons: e.target.value})}
                      rows={4}
                      placeholder="Batería podría durar más&#10;No incluye accesorios"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSeoModal && editingSeoProduct && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>SEO: {editingSeoProduct.title}</h2>
              <button onClick={handleCloseSeoModal} className={styles.closeButton}>✕</button>
            </div>
            
            <form onSubmit={handleSeoSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <h3>SEO Básico</h3>
                
                <div className={styles.formGroup}>
                  <label>Título SEO</label>
                  <input
                    type="text"
                    value={seoFormData.seo_title}
                    onChange={(e) => setSeoFormData({...seoFormData, seo_title: e.target.value})}
                    maxLength={maxTituloSeo}
                  />
                  <small className={tituloCompleto.length > LIMITE_TITULO_SERP ? styles.warn : undefined}>
                    {seoFormData.seo_title.length}/{maxTituloSeo} caracteres.
                    {' '}En Google se verá: «{tituloCompleto}» ({tituloCompleto.length}/{LIMITE_TITULO_SERP})
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción SEO</label>
                  <textarea
                    value={seoFormData.seo_description}
                    onChange={(e) => setSeoFormData({...seoFormData, seo_description: e.target.value})}
                    rows={3}
                    maxLength={160}
                  />
                  <small>{seoFormData.seo_description.length}/160 caracteres</small>
                </div>

                <div className={styles.formGroup}>
                  <label>Palabras Clave (separadas por comas)</label>
                  <input
                    type="text"
                    value={seoFormData.seo_keywords}
                    onChange={(e) => setSeoFormData({...seoFormData, seo_keywords: e.target.value})}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>URL Canónica</label>
                    <input
                      type="url"
                      value={seoFormData.canonical_url}
                      onChange={(e) => setSeoFormData({...seoFormData, canonical_url: e.target.value})}
                      placeholder="https://example.com/producto/..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Meta Robots</label>
                    <select
                      value={seoFormData.meta_robots}
                      onChange={(e) => setSeoFormData({...seoFormData, meta_robots: e.target.value})}
                    >
                      <option value="index, follow">Index, Follow</option>
                      <option value="noindex, follow">No Index, Follow</option>
                      <option value="index, nofollow">Index, No Follow</option>
                      <option value="noindex, nofollow">No Index, No Follow</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Open Graph (Facebook, LinkedIn)</h3>
                
                <div className={styles.formGroup}>
                  <label>OG Título</label>
                  <input
                    type="text"
                    value={seoFormData.og_title}
                    onChange={(e) => setSeoFormData({...seoFormData, og_title: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>OG Descripción</label>
                  <textarea
                    value={seoFormData.og_description}
                    onChange={(e) => setSeoFormData({...seoFormData, og_description: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>OG Imagen URL</label>
                  <input
                    type="url"
                    value={seoFormData.og_image}
                    onChange={(e) => setSeoFormData({...seoFormData, og_image: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>OG Tipo</label>
                  <select
                    value={seoFormData.og_type}
                    onChange={(e) => setSeoFormData({...seoFormData, og_type: e.target.value})}
                  >
                    <option value="product">Product</option>
                    <option value="article">Article</option>
                    <option value="website">Website</option>
                  </select>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Twitter Card</h3>
                
                <div className={styles.formGroup}>
                  <label>Twitter Card Tipo</label>
                  <select
                    value={seoFormData.twitter_card}
                    onChange={(e) => setSeoFormData({...seoFormData, twitter_card: e.target.value})}
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="product">Product</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Twitter Título</label>
                  <input
                    type="text"
                    value={seoFormData.twitter_title}
                    onChange={(e) => setSeoFormData({...seoFormData, twitter_title: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Twitter Descripción</label>
                  <textarea
                    value={seoFormData.twitter_description}
                    onChange={(e) => setSeoFormData({...seoFormData, twitter_description: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Twitter Imagen URL</label>
                  <input
                    type="url"
                    value={seoFormData.twitter_image}
                    onChange={(e) => setSeoFormData({...seoFormData, twitter_image: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={handleCloseSeoModal} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Guardar SEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.productsGrid}>
        {currentProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            {product.images && product.images.length > 0 && (
              <img src={product.images[0]} alt={product.title} className={styles.productImage} />
            )}
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.productBrand}>{product.brand}</p>
              <p className={styles.productCategory}>{product.category}</p>
              {product.price != null && (
                <p className={styles.productPrice}>
                  {product.price} {product.currency || 'EUR'}
                </p>
              )}
              {product.rating && (
                <p className={styles.productRating}>★ {product.rating}/5 {product.reviews_count != null && product.reviews_count > 0 && `(${product.reviews_count} reseñas)`}
                </p>
              )}
              <div className={styles.productActions}>
                <button onClick={() => handleEdit(product)} className={styles.editButton}>
                  ✏️ Editar
                </button>
                <button onClick={() => handleEditSeo(product)} className={styles.seoButton}>
                  🔍 SEO
                </button>
                <button onClick={() => handleDelete(product.id)} className={styles.deleteButton}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className={styles.empty}>
          <p>No hay productos. ¡Crea el primero!</p>
        </div>
      )}

      {products.length > 0 && filteredProducts.length === 0 && (
        <div className={styles.empty}>
          <p>Ningún producto coincide con «{searchTerm}».</p>
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
