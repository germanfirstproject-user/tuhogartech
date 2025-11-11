import Link from 'next/link';

export const metadata = {
  title: 'Página no encontrada - 404',
  description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)' }}>404</h1>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Página no encontrada</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: '0.5rem', textDecoration: 'none' }}>
            Volver al inicio
          </Link>
          <Link href="/productos" style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', textDecoration: 'none' }}>
            Ver productos
          </Link>
        </div>
      </div>
    </main>
  );
}
