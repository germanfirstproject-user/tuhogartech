import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

/**
 * Regenera la web cuando el administrador guarda algo.
 *
 * Las páginas se guardan en caché 24 horas (`revalidate = 86400`). Solo el
 * administrador edita contenido, así que en vez de rehacerlas cada pocos
 * minutos por si acaso, el panel avisa aquí tras cada guardado y se marca toda
 * la web como caducada. No se rehace nada en el momento: cada página se
 * regenera la próxima vez que alguien la visita, de una en una.
 *
 * Se comprueba la sesión con Supabase y el correo del administrador, igual
 * que hace el panel, para que nadie de fuera pueda forzar regeneraciones.
 */
export async function POST(request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!token || !adminEmail) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  const { data, error } = await supabase.auth.getUser(token);

  if (error || data?.user?.email !== adminEmail) {
    return Response.json({ ok: false }, { status: 403 });
  }

  // 'layout' en la raíz caduca todas las rutas que cuelgan de ella
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}
