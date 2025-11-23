import { LoadingSpinner } from '@/components/Skeletons';

export default function Loading() {
  return (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <LoadingSpinner size="large" text="Cargando artículo..." />
    </div>
  );
}
