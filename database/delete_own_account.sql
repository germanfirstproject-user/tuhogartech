-- ============================================================
-- FUNCIÓN: delete_own_account
-- Aplicada en Supabase el 2026-07-18 (migración: delete_own_account_function)
--
-- Permite a un usuario autenticado eliminar su propia cuenta desde
-- la página de perfil (supabase.rpc('delete_own_account')).
-- Solo puede borrar la fila de auth.users cuyo id coincide con
-- auth.uid(); el borrado cascada a user_data (favoritos, historial
-- y preferencias). Los blogs del usuario quedan con author_id NULL.
-- No es ejecutable por anónimos.
-- ============================================================

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  DELETE FROM auth.users WHERE id = v_uid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated, service_role;
