'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Pagination.module.css';

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  baseUrl = '' 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Mostrar 5 páginas a la vez
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      {/* Botón Primera Página */}
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(1)}
          className={styles.pageButton}
          aria-label="Primera página"
        >
          ««
        </button>
      )}

      {/* Botón Anterior */}
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={styles.pageButton}
          aria-label="Página anterior"
        >
          ‹
        </button>
      )}

      {/* Números de página */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.active : ''
          }`}
          aria-label={`Página ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Botón Siguiente */}
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={styles.pageButton}
          aria-label="Página siguiente"
        >
          ›
        </button>
      )}

      {/* Botón Última Página */}
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(totalPages)}
          className={styles.pageButton}
          aria-label="Última página"
        >
          »»
        </button>
      )}

      {/* Información de página */}
      <div className={styles.pageInfo}>
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
}
