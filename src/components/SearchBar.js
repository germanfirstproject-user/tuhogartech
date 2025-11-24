'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/buscar?q=${encodeURIComponent(trimmedQuery)}`);
      setQuery(''); // Limpiar después de buscar
      setIsExpanded(false); // Cerrar en móvil
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.searchContainer}>
      {/* Botón de lupa para móvil */}
      <button 
        type="button"
        className={styles.mobileSearchButton}
        onClick={toggleSearch}
        aria-label={isExpanded ? "Cerrar búsqueda" : "Abrir búsqueda"}
      >
        🔍
      </button>

      {/* Formulario de búsqueda */}
      <form 
        onSubmit={handleSearch} 
        className={`${styles.searchForm} ${isExpanded ? styles.expanded : ''}`}
      >
        <input
          type="search"
          placeholder="Buscar productos y artículos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Buscar productos y artículos"
        />
        <button 
          type="submit" 
          className={styles.searchButton}
          aria-label="Buscar"
          disabled={!query.trim()}
        >
          🔍
        </button>
      </form>
    </div>
  );
}
