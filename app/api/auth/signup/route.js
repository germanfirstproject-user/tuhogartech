import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parsear el request
    let body;
    try {
      body = await request.json();
    } catch (err) {
      console.error('Error parsing request body:', err);
      return NextResponse.json(
        { success: false, error: 'Solicitud inválida' },
        { status: 400 }
      );
    }

    const { email, password, fullName } = body;

    // Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Obtener credenciales de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // Validar que las credenciales estén configuradas
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not configured');
      return NextResponse.json(
        { success: false, error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Registrar nuevo usuario
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Auth signup error:', authError.message);
      // Mensajes de error más amigables
      let errorMessage = 'Error al crear la cuenta';
      if (authError.message?.includes('already exists')) {
        errorMessage = 'Este email ya está registrado';
      } else if (authError.message?.includes('Invalid password')) {
        errorMessage = 'Contraseña inválida';
      }
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    // Usuario creado exitosamente en auth.users
    if (authData?.user?.id) {
      // Determinar si es admin basándose en el email
      const isAdmin = adminEmail && email === adminEmail;

      return NextResponse.json({
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          isAdmin: isAdmin,
          role: isAdmin ? 'admin' : 'user',
        },
        message: 'Cuenta creada exitosamente.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Error al crear la cuenta' },
      { status: 500 }
    );
  } catch (err) {
    console.error('Signup error:', err.message || err);
    return NextResponse.json(
      { success: false, error: 'Error inesperado. Intenta de nuevo más tarde.' },
      { status: 500 }
    );
  }
}
