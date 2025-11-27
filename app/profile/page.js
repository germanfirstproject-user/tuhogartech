'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserData, updateUserPreferences, getUserFavoriteProducts } from '@/lib/supabase';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [userData, setUserData] = useState(null);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    newsletter: false,
    price_alerts: true,
    dark_mode: false
  });
  const [stats, setStats] = useState({
    memberSince: '',
    lastLogin: '',
    visitedProducts: 0,
    savedProducts: 0,
    readBlogs: 0
  });
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else if (user) {
      loadUserData();
      loadUserStats();
      loadFavoriteProducts();
    }
  }, [isLoggedIn, router, user]);

  const loadUserData = async () => {
    if (!user?.id) return;

    const result = await getUserData(user.id);
    if (result.success && result.data) {
      setUserData(result.data);
      setPreferences(result.data.preferences || {
        email_notifications: true,
        newsletter: false,
        price_alerts: true,
        dark_mode: false
      });
    }
  };

  const loadUserStats = () => {
    // Calcular fecha de registro
    const createdAt = user.created_at ? new Date(user.created_at) : new Date();
    const memberSince = createdAt.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Último login
    const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : new Date();
    const lastLogin = lastSignIn.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setStats({
      memberSince,
      lastLogin,
      visitedProducts: 0,
      savedProducts: 0,
      readBlogs: 0
    });
  };

  useEffect(() => {
    if (userData) {
      setStats(prev => ({
        ...prev,
        visitedProducts: userData.visited_products?.length || 0,
        savedProducts: userData.favorite_products?.length || 0,
        readBlogs: userData.read_blogs?.length || 0
      }));
    }
  }, [userData]);

  const loadFavoriteProducts = async () => {
    if (!user?.id) return;

    const result = await getUserFavoriteProducts(user.id);
    if (result.success) {
      setFavoriteProducts(result.data);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleChangePassword = () => {
    // Aquí podrías implementar un modal o redirigir a una página de cambio de contraseña
    alert('Funcionalidad de cambio de contraseña en desarrollo');
  };

  // Detectar si el usuario inició sesión con Google (OAuth)
  const isGoogleUser = user?.app_metadata?.provider === 'google' || 
                       user?.identities?.some(identity => identity.provider === 'google');

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Implementar eliminación de cuenta
      alert('Funcionalidad de eliminación de cuenta en desarrollo');
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = async () => {
    if (!user?.id) return;

    setSaving(true);
    setMessage('');

    const result = await updateUserPreferences(user.id, preferences);

    if (result.success) {
      setMessage('✅ Preferencias guardadas correctamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('❌ Error al guardar: ' + result.error);
    }

    setSaving(false);
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileWrapper}>
        {/* Header Card */}
        <div className={styles.headerCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarLarge}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>{user.email}</h1>
              <p className={styles.userRole}>
                {isAdmin ? (
                  <span className={styles.adminBadge}>👑 Administrador</span>
                ) : (
                  <span className={styles.userBadge}>👤 Usuario</span>
                )}
              </p>
              <p className={styles.memberSince}>
                Miembro desde {stats.memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📋 Información
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'stats' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Estadísticas
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Seguridad
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'preferences' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ Preferencias
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.content}>
          {/* Información Tab */}
          {activeTab === 'info' && (
            <div className={styles.tabContent}>
              <h2 className={styles.sectionTitle}>Información de la cuenta</h2>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Email</label>
                  <div className={styles.infoValue}>{user.email}</div>
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>ID de usuario</label>
                  <div className={styles.infoValueSmall}>{user.id}</div>
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Email verificado</label>
                  <div className={styles.infoValue}>
                    {user.email_confirmed_at ? (
                      <span className={styles.verified}>✅ Verificado</span>
                    ) : (
                      <span className={styles.unverified}>⚠️ No verificado</span>
                    )}
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Tipo de cuenta</label>
                  <div className={styles.infoValue}>
                    {isAdmin ? 'Administrador' : 'Usuario estándar'}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className={styles.quickActions}>
                  <button
                    onClick={() => router.push('/admin')}
                    className={styles.actionButtonPrimary}
                  >
                    📊 Ir al Panel de Administración
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Estadísticas Tab */}
          {activeTab === 'stats' && (
            <div className={styles.tabContent}>
              <h2 className={styles.sectionTitle}>Tus estadísticas</h2>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📅</div>
                  <div className={styles.statValue}>{stats.memberSince}</div>
                  <div className={styles.statLabel}>Fecha de registro</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🕐</div>
                  <div className={styles.statValue}>{stats.lastLogin}</div>
                  <div className={styles.statLabel}>Último acceso</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💾</div>
                  <div className={styles.statValue}>{stats.savedProducts}</div>
                  <div className={styles.statLabel}>Productos guardados</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👁️</div>
                  <div className={styles.statValue}>{stats.visitedProducts}</div>
                  <div className={styles.statLabel}>Productos visitados</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📖</div>
                  <div className={styles.statValue}>{stats.readBlogs}</div>
                  <div className={styles.statLabel}>Artículos leídos</div>
                </div>
              </div>

              {/* Productos Guardados */}
              {favoriteProducts.length > 0 && (
                <div className={styles.favoriteProductsSection}>
                  <h3 className={styles.subsectionTitle}>💾 Tus Productos Guardados</h3>
                  <div className={styles.productsGrid}>
                    {favoriteProducts.slice(0, 6).map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/producto/${product.id}`}
                        className={styles.productCard}
                      >
                        <div className={styles.productImage}>
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} />
                          ) : (
                            <div className={styles.imagePlaceholder}>📦</div>
                          )}
                        </div>
                        <div className={styles.productContent}>
                          <h4 className={styles.productTitle}>{product.title}</h4>
                          <p className={styles.productPrice}>{product.price}€</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {favoriteProducts.length > 6 && (
                    <div className={styles.seeMore}>
                      <Link href="/productos" className={styles.seeMoreLink}>
                        Ver todos ({favoriteProducts.length}) →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.quickActions}>
                <button
                  onClick={() => router.push('/productos')}
                  className={styles.actionButtonSecondary}
                >
                  🛍️ Explorar Productos
                </button>
                <button
                  onClick={() => router.push('/blog')}
                  className={styles.actionButtonSecondary}
                >
                  📚 Leer Blog
                </button>
              </div>
            </div>
          )}

          {/* Seguridad Tab */}
          {activeTab === 'security' && (
            <div className={styles.tabContent}>
              <h2 className={styles.sectionTitle}>Seguridad de la cuenta</h2>
              
              <div className={styles.securitySection}>
                {/* Solo mostrar cambio de contraseña para usuarios con email/password */}
                {!isGoogleUser && (
                  <div className={styles.securityItem}>
                    <div className={styles.securityInfo}>
                      <h3 className={styles.securityTitle}>Cambiar contraseña</h3>
                      <p className={styles.securityDescription}>
                        Actualiza tu contraseña regularmente para mantener tu cuenta segura
                      </p>
                    </div>
                    <button 
                      onClick={handleChangePassword}
                      className={styles.actionButtonSecondary}
                    >
                      Cambiar contraseña
                    </button>
                  </div>
                )}

                {/* Información del método de autenticación */}
                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <h3 className={styles.securityTitle}>Método de inicio de sesión</h3>
                    <p className={styles.securityDescription}>
                      {isGoogleUser ? (
                        <>
                          <span className={styles.badge}>✓ Google</span>
                          {' '}Tu cuenta está vinculada con Google
                        </>
                      ) : (
                        <>
                          <span className={styles.badge}>✉️ Email</span>
                          {' '}Inicio de sesión con email y contraseña
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.dangerZone}>
                <h3 className={styles.dangerTitle}>Zona de peligro</h3>
                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <h3 className={styles.securityTitle}>Eliminar cuenta</h3>
                    <p className={styles.securityDescription}>
                      Una vez eliminada, no podrás recuperar tu cuenta
                    </p>
                  </div>
                  <button 
                    onClick={handleDeleteAccount}
                    className={styles.dangerButton}
                  >
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferencias Tab */}
          {activeTab === 'preferences' && (
            <div className={styles.tabContent}>
              <h2 className={styles.sectionTitle}>Preferencias</h2>
              
              <div className={styles.devWarning}>
                <span className={styles.warningIcon}>🚧</span>
                <div className={styles.warningContent}>
                  <strong>En desarrollo</strong>
                  <p>Las preferencias se guardan correctamente, pero algunas funcionalidades aún no están implementadas.</p>
                </div>
              </div>
              
              {message && (
                <div className={`${styles.message} ${message.includes('❌') ? styles.error : styles.success}`}>
                  {message}
                </div>
              )}
              
              <div className={styles.preferencesSection}>
                <div className={styles.preferenceItem}>
                  <div className={styles.preferenceInfo}>
                    <h3 className={styles.preferenceTitle}>Notificaciones por email</h3>
                    <p className={styles.preferenceDescription}>
                      Recibe actualizaciones sobre nuevos productos y ofertas
                    </p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={preferences.email_notifications}
                      onChange={(e) => handlePreferenceChange('email_notifications', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.divider} />

                <div className={styles.preferenceItem}>
                  <div className={styles.preferenceInfo}>
                    <h3 className={styles.preferenceTitle}>Newsletter semanal</h3>
                    <p className={styles.preferenceDescription}>
                      Resumen semanal de los mejores productos y artículos
                    </p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={preferences.newsletter}
                      onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.divider} />

                <div className={styles.preferenceItem}>
                  <div className={styles.preferenceInfo}>
                    <h3 className={styles.preferenceTitle}>Alertas de precios</h3>
                    <p className={styles.preferenceDescription}>
                      Notificaciones cuando bajen los precios de productos guardados
                    </p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={preferences.price_alerts}
                      onChange={(e) => handlePreferenceChange('price_alerts', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.divider} />

                <div className={styles.preferenceItem}>
                  <div className={styles.preferenceInfo}>
                    <h3 className={styles.preferenceTitle}>Tema oscuro</h3>
                    <p className={styles.preferenceDescription}>
                      Activa el modo oscuro para reducir la fatiga visual
                    </p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={preferences.dark_mode}
                      onChange={(e) => handlePreferenceChange('dark_mode', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.quickActions}>
                <button 
                  className={styles.actionButtonPrimary}
                  onClick={handleSavePreferences}
                  disabled={saving}
                >
                  {saving ? '💾 Guardando...' : '💾 Guardar preferencias'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <button
            onClick={() => router.push('/')}
            className={styles.backButton}
          >
            ← Volver a inicio
          </button>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
