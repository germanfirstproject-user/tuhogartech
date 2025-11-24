'use client';

import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem 2rem', textAlign: 'center' }}>Cargando búsqueda...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
