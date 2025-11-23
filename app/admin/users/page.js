'use client';

import { useEffect, useState } from 'react';
import { getAuthUsers, getUserStats } from '@/lib/supabase';
import styles from './users.module.css';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConfirmed, setFilterConfirmed] = useState('all'); // 'all', 'confirmed', 'unconfirmed'

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    const result = await getAuthUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await getUserStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  // Filtrar usuarios
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
        <div className={styles.loading}>Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Gestión de Usuarios</h1>
        <div className={styles.error}>
          <p>⚠️ Error al cargar usuarios</p>
          <p>{error}</p>
          <button onClick={loadUsers} className={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>
            Administra y visualiza todos los usuarios registrados
          </p>
        </div>
        <button onClick={loadUsers} className={styles.refreshButton}>
          🔄 Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.total}</h3>
              <p className={styles.statLabel}>Total Usuarios</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.confirmed}</h3>
              <p className={styles.statLabel}>Confirmados</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.unconfirmed}</h3>
              <p className={styles.statLabel}>Sin Confirmar</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.activeThisMonth}</h3>
              <p className={styles.statLabel}>Activos (30 días)</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Buscar por email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Estado:</label>
          <select 
            value={filterConfirmed}
            onChange={(e) => setFilterConfirmed(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos</option>
            <option value="confirmed">Confirmados</option>
            <option value="unconfirmed">Sin Confirmar</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.tableContainer}>
        {filteredUsers.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Último Acceso</th>
                <th>Confirmado el</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className={styles.emailCell}>
                    <span className={styles.email}>{user.email}</span>
                  </td>
                  <td>
                    {user.email_confirmed_at ? (
                      <span className={styles.badgeConfirmed}>✓ Confirmado</span>
                    ) : (
                      <span className={styles.badgePending}>⏳ Pendiente</span>
                    )}
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(user.created_at)}
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(user.last_sign_in_at)}
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(user.email_confirmed_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>No se encontraron usuarios con los filtros aplicados</p>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className={styles.resultsCount}>
        Mostrando {filteredUsers.length} de {users.length} usuarios
      </div>
    </div>
  );
}
