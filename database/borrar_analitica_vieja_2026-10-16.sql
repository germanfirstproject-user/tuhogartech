-- Borra la medición propia antigua (16-10-2026), sustituida por page_views.
-- Ejecutar en el editor SQL de Supabase después de publicar la PR #30.

drop function if exists public.registrar_medicion(jsonb, jsonb);
drop function if exists public.limpiar_analitica(integer);
drop function if exists public.analitica_resumen(timestamptz, timestamptz);
drop function if exists public.analitica_serie(timestamptz, timestamptz);
drop function if exists public.analitica_paginas(timestamptz, timestamptz, integer);
drop function if exists public.analitica_contenido(timestamptz, timestamptz, text, integer);
drop function if exists public.analitica_flujos(timestamptz, timestamptz, integer);
drop function if exists public.analitica_busquedas(timestamptz, timestamptz, integer);
drop function if exists public.analitica_clics(timestamptz, timestamptz, integer);
drop function if exists public.analitica_origenes(timestamptz, timestamptz);
drop function if exists public.analitica_dispositivos(timestamptz, timestamptz);

drop table if exists public.analytics_events;
drop table if exists public.analytics_sessions;
