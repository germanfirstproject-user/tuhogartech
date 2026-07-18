import Link from 'next/link';

export const metadata = {
  title: 'Página no encontrada - 404',
  description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'var(--color-background)' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>Página no encontrada</h2>
        <p style={{ fontSize: '1.0625rem', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 500 }}>
            Volver al inicio
          </Link>
          <Link href="/productos" style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--color-border-dark)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 500 }}>
            Ver productos
          </Link>
        </div>
      </div>
    </main>
  );
}
