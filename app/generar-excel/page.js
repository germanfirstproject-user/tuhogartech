'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function GenerateExcelPage() {
  const [asins, setAsins] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asins: asins.split('\n').filter(a => a.trim()) }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'productos.xlsx';
        link.click();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Generar Excel</h1>
        <div className={styles.card}>
          <textarea value={asins} onChange={(e) => setAsins(e.target.value)} className={styles.textarea} placeholder="ASIN1" rows="6" />
          <button onClick={handleGenerate} disabled={loading} className={styles.button}>{loading ? 'Generando...' : 'Generar'}</button>
        </div>
      </div>
    </main>
  );
}
