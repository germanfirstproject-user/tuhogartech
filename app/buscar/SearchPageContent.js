'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductsGrid from '@/components/ProductsGrid';
import BlogCard from '@/components/BlogCard';
import { searchUnified } from '@/lib/supabase';
import styles from './page.module.css';

const PRODUCTS_PER_PAGE = 6;

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [orderBy, setOrderBy] = useState('rating');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentProductPage, setCurrentProductPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await searchUnified(query, orderBy);
      
      if (response.success) {
        setResults(response.data);
        setCurrentProductPage(1); // Reset a primera página al cambiar búsqueda
      } else {
        console.error('Error en búsqueda:', response.error);
        setResults(null);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query, orderBy]);

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
    setCurrentProductPage(1); // Reset a primera página al cambiar orden
  };

  const handleNextPage = () => {
    if (results?.products && currentProductPage < Math.ceil(results.products.length / PRODUCTS_PER_PAGE)) {
      setCurrentProductPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentProductPage > 1) {
      setCurrentProductPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!query) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h1>Buscar Productos y Artículos</h1>
          <p>Ingresa un término de búsqueda para comenzar</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Buscando "{query}"...</p>
        </div>
      </div>
    );
  }

  const hasResults = results && (results.products?.length > 0 || results.blogs?.length > 0);

  // Paginación de productos
  const totalProductPages = results?.products ? Math.ceil(results.products.length / PRODUCTS_PER_PAGE) : 0;
  const startIdx = (currentProductPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const currentProducts = results?.products?.slice(startIdx, endIdx) || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Resultados para: "{query}"</h1>
        {hasResults && (
          <div className={styles.stats}>
            {results.stats.productsCount > 0 && (
              <span>{results.stats.productsCount} {results.stats.productsCount === 1 ? 'producto' : 'productos'}</span>
            )}
            {results.stats.blogsCount > 0 && (
              <span>{results.stats.blogsCount} {results.stats.blogsCount === 1 ? 'artículo' : 'artículos'}</span>
            )}
          </div>
        )}
      </div>

      {hasResults && results.products?.length > 0 && (
        <div className={styles.filterSection}>
          <label htmlFor="orderBy">Ordenar por:</label>
          <select 
            id="orderBy" 
            value={orderBy} 
            onChange={handleOrderChange}
            className={styles.select}
          >
            <option value="rating">Calificación (Mayor a Menor)</option>
            <option value="price_asc">Precio (Menor a Mayor)</option>
            <option value="price_desc">Precio (Mayor a Menor)</option>
          </select>
        </div>
      )}

      {!hasResults ? (
        <div className={styles.noResults}>
          <h2>No se encontraron resultados</h2>
          <p>Intenta con otros términos de búsqueda</p>
        </div>
      ) : (
        <>
          {results.products?.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Productos ({results.stats.productsCount})
                </h2>
                {totalProductPages > 1 && (
                  <div className={styles.pageInfo}>
                    Página {currentProductPage} de {totalProductPages}
                  </div>
                )}
              </div>
              
              <ProductsGrid products={currentProducts} />
              
              {totalProductPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentProductPage === 1}
                    className={styles.paginationButton}
                    aria-label="Página anterior"
                  >
                    ← Anterior
                  </button>
                  <span className={styles.paginationInfo}>
                    {currentProductPage} / {totalProductPages}
                  </span>
                  <button 
                    onClick={handleNextPage}
                    disabled={currentProductPage === totalProductPages}
                    className={styles.paginationButton}
                    aria-label="Página siguiente"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </section>
          )}

          {results.blogs?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Artículos relacionados ({results.stats.blogsCount})
              </h2>
              <div className={styles.blogsList}>
                {results.blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
