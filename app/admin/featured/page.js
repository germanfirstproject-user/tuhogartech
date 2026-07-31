'use client';

import { useState, useEffect } from 'react';
import {
  getProducts,
  getFeaturedProducts,
  addFeaturedProduct,
  removeFeaturedProduct,
  updateFeaturedProductsOrder,
} from '@/lib/supabase';
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
      // Renumerar los que quedan: si no, el hueco que deja el eliminado hace
      // que el siguiente que se añada choque de posición con otro.
      const restantes = featuredProducts.filter((p) => p.id !== productId);
      if (restantes.length > 0) {
        await updateFeaturedProductsOrder(
          restantes.map((product, i) => ({ product_id: product.id, display_order: i }))
        );
      }

      setMessage('✅ Producto eliminado de destacados');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
  };

  // El orden importa: los dos primeros son los que salen en la portada.
  const handleMove = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= featuredProducts.length) return;

    const reordered = [...featuredProducts];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    // Pintado optimista para que el movimiento se vea al instante
    setFeaturedProducts(reordered);

    const result = await updateFeaturedProductsOrder(
      reordered.map((product, i) => ({ product_id: product.id, display_order: i }))
    );

    if (result.success) {
      setMessage('✅ Orden actualizado');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ Error al reordenar: ${result.error}`);
      loadData();
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
          Gestiona los productos que aparecerán en la página de inicio (máximo 10).
          Los <strong>dos primeros</strong> son los que salen en la portada, encima
          del todo; el resto van al carrusel de destacados. Usa las flechas para
          cambiar el orden.
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
                {index < 2 && <span className={styles.heroTag}>Portada</span>}

                <div className={styles.moveButtons}>
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className={styles.moveButton}
                    aria-label={`Subir ${product.title}`}
                    title="Subir"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === featuredProducts.length - 1}
                    className={styles.moveButton}
                    aria-label={`Bajar ${product.title}`}
                    title="Bajar"
                  >
                    ↓
                  </button>
                </div>
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
                  {product.price != null && (
                    <p className={styles.productPrice}>{product.price}€</p>
                  )}
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
                    {product.price != null && (
                      <span className={styles.productPrice}>{product.price}€</span>
                    )}
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
