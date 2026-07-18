'use client';

import { useEffect, useState } from 'react';
import { getAuthUsers, getUserStats, getCurrentUser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './users.module.css';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConfirmed, setFilterConfirmed] = useState('all');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    checkAuthAndLoadUsers();
  }, []);

  const checkAuthAndLoadUsers = async () => {
    setLoading(true);
    setError(null);

    // Verificar autenticación primero
    const userResult = await getCurrentUser();
    
    if (!userResult.success || !userResult.user) {
      setError('No estás autenticado. Debes iniciar sesión.');
      setLoading(false);
      return;
    }

    setCurrentUserEmail(userResult.user.email);

    // Cargar usuarios
    loadUsers();
    loadStats();
  };

  const loadUsers = async () => {
    const result = await getAuthUsers();
    if (result.success) {
      setUsers(result.data);
      setLoading(false);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const result = await getUserStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConfirmed = 
      filterConfirmed === 'all' ||
      (filterConfirmed === 'confirmed' && user.email_confirmed_at) ||
      (filterConfirmed === 'unconfirmed' && !user.email_confirmed_at);
    
    return matchesSearch && matchesConfirmed;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Gestión de Usuarios</h1>
        <div className={styles.loading}>Verificando autenticación...</div>
      </div>
    );
  }

  if (error) {
    const isNotAuthenticated = error.includes('No estás autenticado') || error.includes('Usuario no autenticado');
    const hasEmailInfo = error.includes('Email actual:');
    
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Gestión de Usuarios</h1>
        <div className={styles.error}>
          <p>⚠️ Error al cargar usuarios</p>
          
          {currentUserEmail && (
            <div className={styles.infoMessage}>
              📧 Tu email actual: <strong>{currentUserEmail}</strong>
            </div>
          )}
          
          <p className={styles.errorMessage}>{error}</p>
          
          {isNotAuthenticated && (
            <div className={styles.errorHelp}>
              <h3>🔐 Sesión No Detectada</h3>
              <p>No se detectó una sesión activa de Supabase.</p>
              <p><strong>Solución:</strong></p>
              <ol>
                <li>Haz clic en "Ir al Login" abajo</li>
                <li>Inicia sesión con tu email de administrador</li>
                <li>Vuelve a /admin/users</li>
              </ol>
              <button 
                onClick={() => router.push('/login')} 
                className={styles.loginButton}
              >
                🔑 Ir al Login
              </button>
            </div>
          )}
          
          {hasEmailInfo && (
            <div className={styles.errorHelp}>
              <h3>📋 Email No Coincide</h3>
              <p>Tu email actual no coincide con el admin configurado en Supabase.</p>
              <p><strong>Solución en Supabase SQL Editor:</strong></p>
              <pre>{`UPDATE admin_config 
SET admin_email = '${currentUserEmail || 'tu_email@gmail.com'}' 
WHERE id = 1;`}</pre>
            </div>
          )}
          
          {error.includes('no existe') && (
            <div className={styles.errorHelp}>
              <h3>⚙️ Función No Encontrada</h3>
              <p>La función RPC no existe en Supabase.</p>
              <ol>
                <li>Abre Supabase Dashboard → SQL Editor</li>
                <li>Ejecuta <code>database/FIX_GET_AUTH_USERS.sql</code></li>
                <li>Recarga esta página</li>
              </ol>
            </div>
          )}
          
          <button onClick={checkAuthAndLoadUsers} className={styles.retryButton}>
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>
            Administra y visualiza todos los usuarios registrados
          </p>
          {currentUserEmail && (
            <p className={styles.subtitle}>
              Sesión: {currentUserEmail}
            </p>
          )}
        </div>
        <button onClick={checkAuthAndLoadUsers} className={styles.refreshButton}>
          🔄 Actualizar
        </button>
      </div>

      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stats.total}</p>
              <p className={styles.statLabel}>Total Usuarios</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stats.confirmed}</p>
              <p className={styles.statLabel}>Confirmados</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stats.unconfirmed}</p>
              <p className={styles.statLabel}>Sin Confirmar</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>
                {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
              </p>
              <p className={styles.statLabel}>Tasa Confirmación</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filterConfirmed === 'all' ? styles.active : ''}`}
            onClick={() => setFilterConfirmed('all')}
          >
            Todos ({users.length})
          </button>
          <button
            className={`${styles.filterButton} ${filterConfirmed === 'confirmed' ? styles.active : ''}`}
            onClick={() => setFilterConfirmed('confirmed')}
          >
            Confirmados ({users.filter(u => u.email_confirmed_at).length})
          </button>
          <button
            className={`${styles.filterButton} ${filterConfirmed === 'unconfirmed' ? styles.active : ''}`}
            onClick={() => setFilterConfirmed('unconfirmed')}
          >
            Sin Confirmar ({users.filter(u => !u.email_confirmed_at).length})
          </button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className={styles.noResults}>
          <p>No se encontraron usuarios</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Último Acceso</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className={styles.emailCell}>{user.email}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>{formatDate(user.last_sign_in_at)}</td>
                  <td>
                    {user.email_confirmed_at ? (
                      <span className={styles.statusConfirmed}>Confirmado</span>
                    ) : (
                      <span className={styles.statusUnconfirmed}>Pendiente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
