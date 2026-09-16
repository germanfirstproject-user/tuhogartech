'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CONSENT_EVENT, hasStatsConsent } from '@/lib/cookieConsent';
import {
  abrirPagina,
  arrancar,
  autorizarEnvio,
  cerrarPagina,
  confirmarVista,
  parar,
} from '@/lib/medicion';
import { esTraficoPropio, marcarSesionDeAdmin } from '@/lib/traficoPropio';

/**
 * Monta la medición propia y le va contando los cambios de ruta.
 *
 * Va envuelto en Suspense porque useSearchParams obliga a ello en el App
 * Router: sin el límite, toda la aplicación pasaría a renderizarse en cliente.
 */
export default function Medicion() {
  return (
    <Suspense fallback={null}>
      <MedicionInterna />
    </Suspense>
  );
}

function MedicionInterna() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAdmin, loading } = useAuth();

  // El consentimiento se lleva como estado y no se consulta desde el efecto de
  // ruta. Así, aceptarlo vuelve a ejecutar ese efecto en lugar de tener que
  // abrir la página por su cuenta desde aquí. Antes había dos sitios que
  // llamaban a abrirPagina —este y el de ruta— y la página de entrada se
  // contaba dos veces en cada visita.
  const [consentido, setConsentido] = useState(false);

  useEffect(() => {
    const sincronizar = () => setConsentido(hasStatsConsent());
    sincronizar();
    window.addEventListener(CONSENT_EVENT, sincronizar);
    return () => window.removeEventListener(CONSENT_EVENT, sincronizar);
  }, []);

  /**
   * Quién navega. Mientras la sesión se está comprobando, la medición sigue
   * funcionando pero retiene lo que acumula.
   *
   * Se hace así y no esperando a medir porque la comprobación puede tardar
   * unas décimas: si durante ese rato no se midiera nada, una visita que entra
   * y se va enseguida —que es justo la que más interesa detectar— se perdería
   * entera.
   */
  useEffect(() => {
    if (loading) return;

    marcarSesionDeAdmin(isAdmin);

    if (isAdmin) {
      // Se descarta todo lo acumulado. No se ha mandado nada todavía, así que
      // no queda ni rastro de la navegación del administrador.
      parar();
      return;
    }

    autorizarEnvio();
  }, [isAdmin, loading]);

  // Único sitio que abre páginas. Se vuelve a ejecutar al navegar y al cambiar
  // el consentimiento, que son los dos motivos por los que hay algo que hacer.
  useEffect(() => {
    if (!consentido) {
      parar();
      return undefined;
    }

    // Las rutas del panel no se miden, pero la página anterior sí se cierra
    // para no perder el tiempo que se pasó en ella.
    if (esTraficoPropio(pathname)) {
      cerrarPagina();
      return undefined;
    }

    arrancar();
    abrirPagina(pathname);

    // Un respiro antes de mandar la vista: los medidores de cada plantilla
    // (ficha de producto, artículo) corren en este mismo ciclo y añaden qué
    // producto o qué artículo es. Sin la espera, la vista saldría sin eso.
    const t = setTimeout(confirmarVista, 60);
    return () => clearTimeout(t);
    // searchParams entra en las dependencias para que /buscar?q=… cuente como
    // página distinta cada vez que cambia la consulta.
  }, [pathname, searchParams, consentido]);

  // Al desmontar (cierre de la aplicación) se cierra la página abierta para no
  // perder su duración.
  useEffect(() => () => cerrarPagina(), []);

  return null;
}
