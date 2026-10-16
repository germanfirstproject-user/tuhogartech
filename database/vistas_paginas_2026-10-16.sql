-- Contador de vistas por página y origen (16-10-2026).
--
-- Sustituye a la medición propia (analytics_sessions / analytics_events /
-- registrar_medicion), que se ha quitado de la web. Aquí solo se guarda un
-- número por pareja (página, origen): no hay sesiones, ni identificadores, ni
-- nada guardado en el navegador del visitante.
--
-- origen es:
--   · la ruta de la página anterior, si se llega desde dentro de la web
--     («/blog/mejor-proyector»);
--   · el dominio del sitio externo, si se llega de fuera («google.com»);
--   · «Directo», si no hay de dónde (URL escrita, marcador, app).

create table if not exists public.page_views (
  path        text        not null,
  origen      text        not null,
  vistas      bigint      not null default 0,
  primera_vez timestamptz not null default now(),
  ultima_vez  timestamptz not null default now(),
  primary key (path, origen)
);

alter table public.page_views enable row level security;

-- Solo el administrador lee y borra. Nadie escribe directamente: las vistas
-- entran por contar_vista().
drop policy if exists "Admin lee vistas" on public.page_views;
create policy "Admin lee vistas" on public.page_views
  for select to authenticated using (public.is_admin());

drop policy if exists "Admin borra vistas" on public.page_views;
create policy "Admin borra vistas" on public.page_views
  for delete to authenticated using (public.is_admin());

revoke all on public.page_views from anon;
revoke insert, update, truncate, references, trigger on public.page_views from authenticated;
grant select, delete on public.page_views to authenticated;

-- Suma una vista. SECURITY DEFINER para que el visitante pueda contar sin
-- tener permiso sobre la tabla; lo único que puede hacer es sumar 1 a una
-- pareja (página, origen) con textos de tamaño acotado.
create or replace function public.contar_vista(p_path text, p_origen text)
returns void
language sql
security definer
set search_path = ''
as $f$
  insert into public.page_views as pv (path, origen, vistas)
  select left(trim(p_path), 300),
         coalesce(nullif(left(trim(coalesce(p_origen, '')), 200), ''), 'Directo'),
         1
  where left(trim(coalesce(p_path, '')), 1) = '/'
  on conflict (path, origen) do update set vistas = pv.vistas + 1, ultima_vez = now();
$f$;

revoke all on function public.contar_vista(text, text) from public;
grant execute on function public.contar_vista(text, text) to anon, authenticated;
