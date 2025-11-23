'use client';

import { useState, useEffect } from 'react';
import { getProducts, getFeaturedProducts, addFeaturedProduct, removeFeaturedProduct } from '@/lib/supabase';
import styles from './page.module.css';

export default function FeaturedProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Cargar todos los productos
    const productsResult = await getProducts();
    if (productsResult.success) {
      setAllProducts(productsResult.data);
    }

    // Cargar productos destacados
    const featuredResult = await getFeaturedProducts();
    if (featuredResult.success) {
      setFeaturedProducts(featuredResult.data);
    }

    setLoading(false);
  };

  const handleAddFeatured = async (product) => {
    const displayOrder = featuredProducts.length;
    const result = await addFeaturedProduct(product.id, displayOrder);
    
    if (result.success) {
      setMessage(`✅ ${product.title} añadido a destacados`);
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
  };

  const handleRemoveFeatured = async (productId) => {
    const result = await removeFeaturedProduct(productId);
    
    if (result.success) {
      setMessage('✅ Producto eliminado de destacados');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
  };

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const notFeatured = !featuredProducts.some(fp => fp.id === product.id);
    return matchesSearch && notFeatured;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>⭐ Productos Destacados</h1>
        <p className={styles.subtitle}>
          Gestiona los productos que aparecerán en el carrusel de la página de inicio (máximo 10)
        </p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('❌') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      {/* Productos Destacados Actuales */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Productos Destacados Actuales ({featuredProducts.length}/10)
        </h2>
        
        {featuredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay productos destacados. Añade algunos desde la lista de abajo.</p>
          </div>
        ) : (
          <div className={styles.featuredGrid}>
            {featuredProducts.map((product, index) => (
              <div key={product.id} className={styles.featuredCard}>
                <div className={styles.featuredOrder}>#{index + 1}</div>
                <div className={styles.productImage}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} />
                  ) : (
                    <div className={styles.placeholderImage}>📦</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productBrand}>{product.brand}</p>
                  <p className={styles.productPrice}>{product.price}€</p>
                </div>
                <button
                  onClick={() => handleRemoveFeatured(product.id)}
                  className={styles.removeButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Productos Disponibles */}
      {featuredProducts.length < 10 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Añadir Productos</h2>
          
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.productsGrid}>
            {filteredProducts.slice(0, 20).map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} />
                  ) : (
                    <div className={styles.placeholderImage}>📦</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productBrand}>{product.brand}</p>
                  <div className={styles.productMeta}>
                    <span className={styles.productPrice}>{product.price}€</span>
                    {product.rating && (
                      <span className={styles.productRating}>⭐ {product.rating}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAddFeatured(product)}
                  className={styles.addButton}
                  disabled={featuredProducts.length >= 10}
                >
                  Añadir
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <p>No se encontraron productos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
