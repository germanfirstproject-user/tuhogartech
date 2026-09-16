'use client';

/**
 * Qué tráfico es del propio dueño de la web y por tanto no se mide.
 *
 * Vive aquí y no dentro de cada medidor porque la decisión tiene que ser la
 * misma para la medición propia y para Google Analytics. Si cada uno llevara
 * su lista, los dos informes acabarían discrepando y no habría forma de saber
 * cuál miente.
 *
 * Son dos casos distintos y los dos cuentan:
 *
 *  1. Las rutas del panel de administración. Nadie más entra ahí.
 *  2. Navegar por la web pública con la sesión de administrador abierta.
 *     Este es el que más distorsiona en la práctica: revisar un artículo
 *     recién publicado diez veces seguidas lo dispara en los informes y
 *     además le baja el tiempo medio de lectura, porque quien lo revisa ya
 *     sabe lo que pone y no lo lee.
 */

/** Rutas que nunca se miden, entren quien entren. */
export const RUTAS_PROPIAS = ['/admin', '/generar-excel'];

// Bandera en memoria, no en disco: la pone AuthContext en cuanto resuelve
// quién navega, y se pierde al recargar, que es justo lo que se quiere. Si se
// guardara, un ordenador prestado quedaría marcado para siempre.
let sesionDeAdmin = false;

/** La llama AuthContext cada vez que sabe si quien navega es el administrador. */
export function marcarSesionDeAdmin(esAdmin) {
  sesionDeAdmin = esAdmin === true;
}

export function haySesionDeAdmin() {
  return sesionDeAdmin;
}

/** ¿Hay que dejar esta ruta fuera de los informes? */
export function esRutaPropia(path = '') {
  return RUTAS_PROPIAS.some((r) => path === r || path.startsWith(`${r}/`));
}

/**
 * Decisión final: true significa «no medir».
 *
 * Una ruta del panel queda fuera aunque no haya sesión iniciada, porque el
 * único motivo para llegar ahí es administrar. Y con sesión de administrador
 * queda fuera todo, incluida la web pública.
 */
export function esTraficoPropio(path = '') {
  return sesionDeAdmin || esRutaPropia(path);
}
