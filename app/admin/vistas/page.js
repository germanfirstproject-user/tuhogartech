'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { descargarExcel } from '@/lib/excel';
import styles from './vistas.module.css';

const COLUMNAS = [
  { clave: 'path', titulo: 'Página', ancho: 60 },
  { clave: 'origen', titulo: 'Origen', ancho: 40 },
  { clave: 'vistas', titulo: 'Vistas', ancho: 12 },
];

// PostgREST devuelve como mucho 1.000 filas por petición.
const BLOQUE = 1000;

async function cargarTodas() {
  const filas = [];
  for (let desde = 0; ; desde += BLOQUE) {
    const { data, error } = await supabase
      .from('page_views')
      .select('path, origen, vistas')
      .order('vistas', { ascending: false })
      .order('path')
      .order('origen')
      .range(desde, desde + BLOQUE - 1);
    if (error) throw error;
    filas.push(...data);
    if (data.length < BLOQUE) return filas;
  }
}

export default function VistasPage() {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTodas()
      .then(setFilas)
      .catch((e) => setError(e.message || 'No se pudieron cargar las vistas'))
      .finally(() => setCargando(false));
  }, []);

  const exportar = () => {
    const hoy = new Date().toISOString().slice(0, 10);
    descargarExcel(COLUMNAS, filas, `vistas-paginas_${hoy}.xlsx`, 'Vistas');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vistas de páginas</h1>
        <button
          type="button"
          onClick={exportar}
          disabled={cargando || filas.length === 0}
          className={styles.boton}
        >
          Exportar a Excel
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {cargando ? (
        <p className={styles.aviso}>Cargando…</p>
      ) : filas.length === 0 ? (
        <p className={styles.aviso}>Todavía no hay vistas registradas.</p>
      ) : (
        <div className={styles.tablaContenedor}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Página</th>
                <th>Origen</th>
                <th className={styles.numero}>Vistas</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={`${f.path}|${f.origen}`}>
                  <td>{f.path}</td>
                  <td>{f.origen}</td>
                  <td className={styles.numero}>{f.vistas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
