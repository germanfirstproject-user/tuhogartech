'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addFavoriteProduct, removeFavoriteProduct, getUserData } from '@/lib/supabase';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ productId, compact = false }) {
  const { user, isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      // Solo verificar si hay usuario autenticado
      if (!isLoggedIn || !user?.id) {
        setIsFavorite(false);
        return;
      }

      try {
        const result = await getUserData(user.id);
        if (result.success && result.data) {
          const favorites = result.data.favorite_products || [];
          setIsFavorite(favorites.includes(productId));
        }
      } catch (error) {
        // Silenciar errores de favoritos
        setIsFavorite(false);
      }
    };

    checkFavorite();
  }, [isLoggedIn, user, productId]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('Debes iniciar sesión para guardar productos favoritos');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        const result = await removeFavoriteProduct(user.id, productId);
        if (result.success) {
          setIsFavorite(false);
        }
      } else {
        const result = await addFavoriteProduct(user.id, productId);
        if (result.success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`${styles.favoriteButtonCompact} ${isFavorite ? styles.active : ''}`}
        title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
    >
      <span className={styles.icon}>{isFavorite ? '❤️' : '🤍'}</span>
      <span className={styles.text}>
        {isFavorite ? 'Guardado' : 'Guardar'}
      </span>
    </button>
  );
}
