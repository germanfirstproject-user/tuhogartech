import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, fullName } = await request.json();

    // Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Crear cliente de Supabase (lado servidor)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // SignUp desde servidor
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
          is_admin: false,
        },
      },
    });

    if (error) {
      console.error('Error signing up:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Error al crear la cuenta' },
        { status: 400 }
      );
    }

    // Verificar si el usuario se creó
    if (data?.user) {
      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          isAdmin: false,
        },
        message: 'Cuenta creada exitosamente.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cuenta creada exitosamente.',
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Error inesperado al crear la cuenta' },
      { status: 500 }
    );
  }
}
