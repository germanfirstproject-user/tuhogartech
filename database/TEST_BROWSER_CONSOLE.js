// ============================================
// SCRIPT DE PRUEBA - Ejecuta en la consola del navegador (F12)
// ============================================
// Copia y pega este código completo en la consola del navegador
// mientras estás en la página /admin/users
// ============================================

(async () => {
  console.log('🔍 Iniciando diagnóstico de get_auth_users...\n');

  // Importar supabase desde el window (si está disponible)
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  
  const supabaseUrl = 'https://yiudpmbwtipjbtshmugw.supabase.co';
  const supabaseKey = 'TU_ANON_KEY_AQUI'; // REEMPLAZA con tu NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Verificar sesión
  console.log('1️⃣ Verificando sesión actual...');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('❌ Error al obtener sesión:', sessionError);
    return;
  }
  
  if (!session) {
    console.error('❌ NO HAY SESIÓN ACTIVA');
    console.log('👉 Debes iniciar sesión primero');
    return;
  }
  
  console.log('✅ Sesión activa:', {
    user_id: session.user.id,
    email: session.user.email,
    user_metadata: session.user.user_metadata,
    expires_at: new Date(session.expires_at * 1000).toLocaleString()
  });
  console.log('\n');

  // 2. Verificar user_metadata
  console.log('2️⃣ Verificando si eres admin...');
  const isAdminMetadata = session.user.user_metadata?.is_admin;
  console.log('is_admin en metadata:', isAdminMetadata);
  console.log('\n');

  // 3. Intentar llamar a get_auth_users
  console.log('3️⃣ Llamando a get_auth_users()...');
  const { data, error } = await supabase.rpc('get_auth_users');
  
  if (error) {
    console.error('❌ ERROR en get_auth_users:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    console.error('Detalles:', error.details);
    console.error('Hint:', error.hint);
    console.error('Objeto completo:', error);
    
    console.log('\n📋 Diagnóstico:');
    
    if (error.message?.includes('Usuario no autenticado')) {
      console.log('🔍 auth.uid() está retornando NULL dentro de la función');
      console.log('🔧 Posible causa: El token JWT no se está enviando correctamente');
      console.log('💡 Solución: Cierra sesión, borra cookies, e inicia sesión de nuevo');
    } else if (error.message?.includes('Acceso denegado')) {
      console.log('🔍 El usuario está autenticado pero no es admin');
      console.log('📧 Email actual:', session.user.email);
      console.log('🔧 Ejecuta en Supabase SQL Editor:');
      console.log(`SELECT * FROM admin_config;`);
      console.log(`-- Verifica que el email coincida exactamente`);
    } else if (error.code === '42883') {
      console.log('🔍 La función get_auth_users no existe en Supabase');
      console.log('🔧 Ejecuta database/FIX_GET_AUTH_USERS.sql');
    }
    
    return;
  }
  
  console.log('✅ ÉXITO! Usuarios obtenidos:', data.length);
  console.table(data);
})();
